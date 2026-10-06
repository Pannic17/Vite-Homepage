import {test, expect} from '@playwright/test';
import {productionPaths} from '../../src/routePaths.js';

test.use({reducedMotion: 'reduce'});

for (const locale of ['en-US', 'zh-CN']) {
  test(`inner pages share About's frame and heading proportions in ${locale}`, async ({page}, testInfo) => {
    test.setTimeout(90_000);
    await page.addInitScript(value => localStorage.setItem('locale', value), locale);
    await page.goto('about');
    const measure = () => page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const main = document.querySelector('#main-content');
      const heading = header.querySelector('h1');
      const rect = header.getBoundingClientRect();
      return {left: rect.left, right: rect.right, top: rect.top, titleSize: getComputedStyle(heading).fontSize,
        mainTop: main.getBoundingClientRect().top, headerBottom: rect.bottom,
        overflow: document.documentElement.scrollWidth > innerWidth + 1};
    });
    const reference = await measure();
    for (const path of [...productionPaths.filter(path => path !== '/'), '/missing-page']) {
      const route = path === '/projects/kaiwu/viewer' ? path + '?type=unknown' : path;
      await page.goto('.' + route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main')).toHaveCount(1);
      const layout = await measure();
      expect(layout.left).toBeCloseTo(reference.left, 0);
      expect(layout.right).toBeCloseTo(reference.right, 0);
      expect(layout.top).toBe(reference.top);
      expect(layout.titleSize).toBe(reference.titleSize);
      expect(layout.mainTop).toBeGreaterThan(layout.headerBottom);
      expect(layout.overflow, route).toBe(false);
      await expect(page.getByRole('button', {name: '中文', exact: true})).toBeVisible();
      await expect(page.getByRole('button', {name: 'ENGLISH', exact: true})).toBeVisible();
      if (['/about', '/works', '/projects', '/works/gcs', '/projects/kaiwu'].includes(path)) {
        await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
        await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
        await page.screenshot({path: testInfo.outputPath((path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')) + '.png'), fullPage: true});
      }
    }
  });
}

test('original home scene fills the viewport through desktop and mobile resize', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One browser exercises the resize sequence.');
  await page.addInitScript(() => localStorage.setItem('home-scene-quality', 'low'));
  await page.goto('./');
  await expect(page.locator('#three-canvas')).toHaveAttribute('data-state', 'ready');
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({width, height: 900});
    await expect.poll(() => page.locator('#three-canvas canvas').evaluate(canvas => {
      const box = canvas.getBoundingClientRect();
      const parent = canvas.parentElement.getBoundingClientRect();
      return Math.abs(box.width - parent.width) + Math.abs(box.height - parent.height);
    })).toBeLessThan(1);
    const scene = await page.locator('#three-canvas').boundingBox();
    expect(scene).toEqual({x: 0, y: 0, width, height: 900});
    await expect(page.locator('.site-header')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({path: testInfo.outputPath('animated-home-' + width + '.png'), fullPage: true});
  }
});
