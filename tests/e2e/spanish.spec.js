import {test, expect} from '@playwright/test';

test('Spanish selection persists across navigation and reloads and updates metadata', async ({page}) => {
  await page.goto('./');
  await page.getByRole('button', {name: 'ESPAÑOL', exact: true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES');
  await expect(page.getByRole('button', {name: 'ESPAÑOL', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.identity')).toContainText('Máster en Computación Creativa');
  await page.getByRole('link', {name: 'OBRAS', exact: true}).click();
  await expect(page).toHaveTitle('OBRAS | PANNIC');
  await expect(page.locator('[data-entry-id="resonance"]')).toContainText('Sensores');
  await page.getByRole('link', {name: 'CatNet', exact: true}).click();
  await expect(page.getByRole('heading', {name: 'IA × RA', exact: true})).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES');
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('es-ES');
  await page.getByRole('button', {name: '中文', exact: true}).click();
  await expect(page.getByRole('heading', {name: 'AI × AR', exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'ENGLISH', exact: true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});

test('Spanish browser preference works with unavailable storage', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'language', {value: 'es-MX'});
    Object.defineProperty(window, 'localStorage', {get() { throw new Error('Storage blocked'); }});
  });
  await page.goto('about');
  await expect(page).toHaveTitle('ACERCA DE | PANNIC');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES');
  await page.getByRole('button', {name: 'ENGLISH', exact: true}).click();
  await expect(page).toHaveTitle('ABOUT | PANNIC');
  await page.getByRole('button', {name: 'ESPAÑOL', exact: true}).click();
  await expect(page).toHaveTitle('ACERCA DE | PANNIC');
});

test('Spanish pages have complete copy and fit narrow screens', async ({page}, testInfo) => {
  test.setTimeout(90_000);
  const warnings = [], errors = [];
  page.on('console', message => { if (/Not found .* key|Fall back to translate/.test(message.text())) warnings.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('locale', 'es-ES'));
  if (testInfo.project.name === 'mobile-chromium') await page.setViewportSize({width: 320, height: 568});
  for (const route of ['./', 'about', 'works', 'projects', 'works/gcs', 'works/catnet', 'works/anybody-problem', 'projects/kaiwu', 'projects/kaiwu/details', 'projects/kaiwu/viewer?type=unknown', 'works/three-lab/07', 'missing-page']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES');
    await expect(page.getByRole('button', {name: 'ESPAÑOL', exact: true})).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), route).toBe(true);
    const overlaps = await page.locator('.site-header').evaluateAll(headers => headers.some(header => {
      const heading = header.querySelector('h1').getBoundingClientRect();
      const languages = header.querySelector('.language-switch').getBoundingClientRect();
      return heading.right > languages.left && heading.bottom > languages.top && languages.bottom > heading.top;
    }));
    expect(overlaps, route).toBe(false);
    if (route === 'projects') {
      await expect(page.locator('.k-details')).toHaveText('DETALLES');
      await expect(page.locator('.k-detail')).toHaveText('VISTA PREVIA');
    }
    if (route.includes('type=unknown')) await expect(page.getByRole('alert')).toContainText('no son válidos');
  }
  expect(warnings).toEqual([]);
  expect(errors).toEqual([]);
});

test('3D panels translate in place without resetting the scene or control values', async ({page}) => {
  test.setTimeout(90_000);
  await page.goto('projects/kaiwu/viewer?debug=1');
  await expect(page.locator('.kaiwu-stage')).toHaveAttribute('data-state', 'ready', {timeout: 30000});
  const debug = page.locator('.kaiwu-debug');
  await debug.getByRole('button', {name: /Rendering$/}).click();
  const exposure = debug.locator('.controller').filter({has: page.locator('.name', {hasText: /^Exposure$/})}).locator('input');
  await exposure.fill('1.5');
  await exposure.press('Tab');
  await page.evaluate(() => { window.localeTestCanvas = document.querySelector('canvas'); });
  await page.getByRole('button', {name: 'ESPAÑOL', exact: true}).click();
  await expect(debug.getByRole('button', {name: /Renderizado$/})).toBeVisible();
  await expect(debug.locator('.controller').filter({has: page.locator('.name', {hasText: /^Exposición$/})}).locator('input')).toHaveValue('1.5');
  expect(await page.evaluate(() => window.localeTestCanvas === document.querySelector('canvas'))).toBe(true);
  await page.getByRole('button', {name: '中文', exact: true}).click();
  await expect(debug.getByRole('button', {name: /渲染$/})).toBeVisible();
  await page.getByRole('button', {name: 'ENGLISH', exact: true}).click();
  await expect(debug.getByRole('button', {name: /Rendering$/})).toBeVisible();
  await page.goto('works/three-lab/08');
  await expect(page.locator('.lab-stage')).toHaveAttribute('data-state', 'ready', {timeout: 30000});
  await page.getByRole('button', {name: 'ESPAÑOL', exact: true}).click();
  await expect(page.locator('.lab-settings .name').filter({hasText: /^Activar SSR$/})).toBeVisible();
  const settings = page.locator('.lab-settings').getByRole('button', {name: /Más ajustes$/});
  if (await settings.getAttribute('aria-expanded') === 'false') await settings.click();
  await expect(page.locator('.lab-settings select option').filter({hasText: /^Solo SSR$/})).toHaveCount(1);
  const output = page.locator('.lab-settings .controller.option');
  await expect(output.locator('.display')).toHaveText('Predeterminado');
  await output.locator('select').selectOption({label: 'Solo SSR'});
  await expect(output.locator('.display')).toHaveText('Solo SSR');
  await page.getByRole('button', {name: 'ENGLISH', exact: true}).click();
  await expect(output.locator('.display')).toHaveText('SSR Only');
});
