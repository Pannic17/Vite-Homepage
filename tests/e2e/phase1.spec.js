import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function installCounters(page) {
  await page.addInitScript(() => {
    const state = { created: 0, lost: 0, raf: new Set(), resize: new Set(), doubleClick: new Set() };
    window.__phase1 = state;
    const seen = new WeakSet();
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      const context = getContext.apply(this, args);
      if (context && /webgl/.test(args[0]) && !seen.has(context)) {
        seen.add(context);
        state.created++;
        this.addEventListener('webglcontextlost', () => { state.lost++; }, { once: true });
      }
      return context;
    };
    const raf = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => {
      const id = raf(time => { state.raf.delete(id); callback(time); });
      state.raf.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => { state.raf.delete(id); cancel(id); };
    for (const [target, type, listeners] of [[window, 'resize', state.resize], [document, 'dblclick', state.doubleClick]]) {
      const add = target.addEventListener.bind(target);
      const remove = target.removeEventListener.bind(target);
      target.addEventListener = (name, listener, options) => { if (name === type) listeners.add(listener); return add(name, listener, options); };
      target.removeEventListener = (name, listener, options) => { if (name === type) listeners.delete(listener); return remove(name, listener, options); };
    }
  });
}

const ready = page => expect(page.locator('#three-canvas')).toHaveAttribute('data-state', 'ready');
const snapshot = page => page.evaluate(() => ({
  created: window.__phase1.created, lost: window.__phase1.lost,
  raf: window.__phase1.raf.size, resize: window.__phase1.resize.size,
  doubleClick: window.__phase1.doubleClick.size,
  canvas: document.querySelectorAll('canvas').length, gui: document.querySelectorAll('.lil-gui').length,
}));

test('20 route round trips release render contexts, frames and page listeners', async ({ page }, testInfo) => {
  // Hosted runners render WebGL in software; allow the full 20-cycle stress
  // test to finish without relaxing any disposal or navigation assertions.
  test.setTimeout(process.env.CI ? 240_000 : 90_000);
  await installCounters(page);
  const errors = [];
  const warnings = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (/Too many active WebGL/.test(message.text())) warnings.push(message.text()); });
  await page.goto('./');
  await ready(page);
  const first = await snapshot(page);
  expect(first.created).toBe(1);
  const samples = [first];
  for (let cycle = 1; cycle <= 20; cycle++) {
    // Start postprocessing as well as the base pass, then tear down mid-effect.
    await page.getByRole('heading', {name: 'PANNIC', exact: true}).dblclick();
    await page.getByRole('link', { name: 'WORKS', exact: true }).click();
    await expect(page).toHaveURL(/\/works$/);
    await expect.poll(async () => (await snapshot(page)).lost).toBe(cycle);
    const away = await snapshot(page);
    expect(away.raf).toBe(0);
    expect(away.canvas).toBe(0);
    expect(away.doubleClick).toBe(0);
    expect(away.gui).toBe(0);
    await page.getByRole('link', { name: 'HOME', exact: true }).click();
    await ready(page);
    const home = await snapshot(page);
    expect(home.created - home.lost).toBe(1);
    expect(home.raf).toBe(1);
    expect(home.resize).toBe(first.resize);
    expect(home.doubleClick).toBe(first.doubleClick);
    expect(home.canvas).toBe(1);
    if ([1,5,10,20].includes(cycle)) samples.push({ cycle, away, home });
  }
  expect(errors).toEqual([]);
  expect(warnings).toEqual([]);
  await testInfo.attach('lifecycle', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' });
});

test('leaving during model download does not restart rendering', async ({ page }) => {
  await installCounters(page);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const model = readFileSync('public/cat.gltf');
  let requested = false;
  await page.route('**/cat.gltf', async route => {
    requested = true;
    await gate;
    await route.fulfill({ body: model, contentType: 'model/gltf+json' }).catch(() => {});
  });
  await page.goto('./');
  await expect.poll(() => requested).toBe(true);
  await page.getByRole('link', { name: 'WORKS', exact: true }).click();
  release();
  await page.waitForTimeout(300);
  const state = await snapshot(page);
  expect(state.created - state.lost).toBe(0);
  expect(state.raf).toBe(0);
  expect(state.canvas).toBe(0);
});

test('a GLTF parse finishing after navigation is discarded', async ({ page }) => {
  await installCounters(page);
  const model = JSON.parse(readFileSync('public/cat.gltf', 'utf8'));
  const buffer = Buffer.from(model.buffers[0].uri.split(',')[1], 'base64');
  model.buffers[0].uri = 'late-buffer.bin';
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let parsing = false;
  let completed;
  const done = new Promise(resolve => { completed = resolve; });
  await page.route('**/cat.gltf', route => route.fulfill({ json: model }));
  await page.route('**/late-buffer.bin', async route => {
    parsing = true;
    await gate;
    await route.fulfill({ body: buffer, contentType: 'application/octet-stream' });
    completed();
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect.poll(() => parsing).toBe(true);
  await page.getByRole('link', { name: 'WORKS', exact: true }).click();
  release();
  await done;
  await page.waitForTimeout(300);
  expect((await snapshot(page)).raf).toBe(0);
  expect((await snapshot(page)).canvas).toBe(0);
  expect(errors).toEqual([]);
});

for (const mode of ['no-webgl', 'model-http-error', 'invalid-model', 'context-loss']) {
  test(`3D fallback keeps navigation usable: ${mode}`, async ({ page }) => {
    if (mode === 'no-webgl') await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return /webgl/.test(type) ? null : original.call(this, type, ...rest);
      };
    });
    if (mode === 'model-http-error') await page.route('**/cat.gltf', route => route.fulfill({ status: 503, body: 'unavailable' }));
    if (mode === 'invalid-model') await page.route('**/cat.gltf', route => route.fulfill({ body: 'invalid JSON' }));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('./');
    if (mode === 'context-loss') {
      await ready(page);
      await page.locator('canvas').evaluate(canvas => canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    }
    await expect(page.locator('#three-canvas')).toHaveAttribute('data-state', 'fallback');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect.poll(() => page.locator('.scene-fallback').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.getByRole('link', { name: 'WORKS', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'WORKS', exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('direct detail back has a site fallback; direct HOME does not leave the site', async ({ page }) => {
  await page.goto('works/gcs');
  await page.getByRole('button', { name: 'BACK', exact: true }).click();
  await expect(page).toHaveURL(/\/works$/);
  await page.goto('about');
  await page.getByRole('link', { name: 'HOME', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'PANNIC', exact: true })).toBeVisible();
});

test('GCS card navigation restores the works scroll position on BACK', async ({ page }) => {
  await page.goto('works');
  const title = page.getByRole('heading', { name: 'Chronoscape', exact: true });
  await title.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await title.click();
  await expect(page).toHaveURL(/\/works\/gcs$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole('button', { name: 'BACK', exact: true }).click();
  await expect(page).toHaveURL(/\/works$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
});

test('unknown URL renders a useful 404 instead of an empty app', async ({ page }) => {
  await page.goto('not-a-page');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await page.getByRole('link', { name: 'HOME', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'PANNIC', exact: true })).toBeVisible();
});
