import {test, expect} from '@playwright/test';

test('color nebula animates with a fixed camera and freezes on pause', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Mouse orbit regression');
  await page.goto('works/three-lab/06');
  await expect(page.locator('.lab-stage')).toHaveAttribute('data-state','ready');
  const canvas = page.locator('.lab-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(700);
  expect(await canvas.screenshot()).not.toEqual(first);
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  const paused = await canvas.screenshot();
  const bounds = await canvas.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2 + 100, bounds.y + bounds.height / 2 + 50, {steps:8});
  await page.mouse.up();
  const rotated = await canvas.screenshot();
  expect(rotated).toEqual(paused);
  await page.mouse.wheel(0, -300);
  const zoomed = await canvas.screenshot();
  expect(zoomed).toEqual(rotated);
  await page.waitForTimeout(150);
  expect(await canvas.screenshot()).toEqual(zoomed);
});

test('the work opens all nine experiments and releases each scene on navigation', async ({page}) => {
  test.setTimeout(120000);
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('works');
  await page.getByRole('link', {name:'Three.js Visual Experiments',exact:true}).click();
  await expect(page.locator('.lab-stage')).toHaveAttribute('data-experiment','07');
  for (const id of ['01','02','03','04','05','06','07','08','09','07']) {
    await page.locator(`.lab-nav a[href$="/${id}"]`).click();
    await expect(page.locator('.lab-stage')).toHaveAttribute('data-experiment',id);
    await expect(page.locator('.lab-stage')).toHaveAttribute('data-state','ready',{timeout:30000});
    await expect(page.locator('canvas')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  await expect(page.getByRole('button',{name:'Play',exact:true})).toBeVisible();
  const frozen = await page.locator('.lab-canvas').screenshot();
  await page.waitForTimeout(150);
  expect(await page.locator('.lab-canvas').screenshot()).toEqual(frozen);
  await page.getByRole('button',{name:'Play',exact:true}).click();
  await page.reload();
  await expect(page.locator('.lab-stage')).toHaveAttribute('data-state','ready');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Three.js 视觉实验',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'返回作品',exact:true}).click();
  await expect(page).toHaveURL(/\/works$/);
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(failures).toEqual([]);
});

test('failed assets can be retried and reduced motion starts paused', async ({page}) => {
  await page.route('**/three-lab/model/eevee.gltf', route => route.abort());
  await page.goto('works/three-lab/01');
  await expect(page.locator('.lab-stage')).toHaveAttribute('data-state','error');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.unroute('**/three-lab/model/eevee.gltf');
  await page.getByRole('button',{name:'Retry',exact:true}).click();
  await expect(page.locator('.lab-stage')).toHaveAttribute('data-state','ready');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('works/three-lab/07');
  await expect(page.getByRole('button',{name:'Play',exact:true})).toBeVisible();
});
