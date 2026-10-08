import {test, expect} from '@playwright/test';

const routes = ['', 'about', 'works', 'projects', 'works/gcs', 'projects/kaiwu', 'projects/kaiwu/viewer?type=unknown', 'test', 'missing-page'];
const viewports = [
  [320,568], [360,800], [390,844], [430,932], [768,1024], [1024,768],
  [844,390], [1280,720], [1440,900], [1920,1080], [2560,1440],
];

async function checkLayout(page) {
  const problems = await page.evaluate(() => {
    const issues = [];
    const width = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > width + 1) issues.push('Document overflow: ' + document.documentElement.scrollWidth + '/' + width);
    for (const element of document.querySelectorAll('h1,h2,h3,p,.tags,.language-switch,nav,img')) {
      const box = element.getBoundingClientRect();
      if (box.width && (box.left < -1 || box.right > width + 1)) issues.push(element.tagName + '.' + element.className + ' outside viewport');
      if (element.scrollWidth > element.clientWidth + 1 && element.clientWidth > 0 && getComputedStyle(element).display !== 'inline') issues.push(element.tagName + '.' + element.className + ' clips content');
    }
    for (const element of document.querySelectorAll('html,body,#app,main')) {
      if (['hidden','clip'].includes(getComputedStyle(element).overflowX)) issues.push('Overflow masking on ' + element.tagName);
    }
    return issues;
  });
  expect(problems).toEqual([]);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
}

for (const [width,height] of viewports) {
  test('responsive layout ' + width + 'x' + height + ' in both languages', async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'Matrix explicitly sets each viewport once.');
    test.setTimeout(90_000);
    await page.setViewportSize({width,height});
    // Freeze decoration through the supported fallback for deterministic layout.
    await page.route('**/cat.gltf', route => route.fulfill({status:503,body:'layout fixture'}));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('./');
    for (const locale of ['en-US','zh-CN']) {
      await page.evaluate(value => localStorage.setItem('locale', value), locale);
      for (const route of routes) {
        await page.goto(route || './');
        // Exercise both stored preference and the language controls.
        const language = page.getByRole('button', {name:locale === 'zh-CN' ? '中文' : 'ENGLISH',exact:true});
        if (await language.count()) await language.click();
        await expect(page.locator('html')).toHaveAttribute('lang',locale);
        await page.evaluate(() => document.fonts.ready);
        await checkLayout(page);
        const header = page.locator('.site-header');
        if (await header.count()) {
          const bottom = await header.evaluate(el => el.getBoundingClientRect().bottom);
          const top = await page.locator('main').evaluate(el => (el.querySelector(':scope > .site-header')?.nextElementSibling || el).getBoundingClientRect().top);
          expect(top).toBeGreaterThanOrEqual(bottom);
        }
        if (route === '') {
          // Home retains its original full-viewport scene composition.
          const scene = await page.locator('#three-canvas').boundingBox();
          expect(scene.x).toBe(0);
          expect(scene.y).toBe(0);
          expect(scene.width).toBe(width);
          expect(scene.height).toBe(height);
        }
        if ([390,1440].includes(width) && ['','works','projects','works/gcs','about'].includes(route)) {
          // Full-page screenshots deliberately resolve offscreen lazy images.
          await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
          await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
          await page.screenshot({path:testInfo.outputPath((route || 'home').replaceAll('/','-') + '-' + locale + '.png'),fullPage:true});
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('keyboard navigation, language state and honest card semantics', async ({page}) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const chinese = page.getByRole('button',{name:'中文',exact:true});
  await chinese.focus();
  await page.keyboard.press('Space');
  await expect(chinese).toHaveAttribute('aria-pressed','true');
  const english = page.getByRole('button',{name:'ENGLISH',exact:true});
  await english.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(chinese).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(english).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(english).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Tab');
  const spanish = page.getByRole('button',{name:'ESPAÑOL',exact:true});
  await expect(spanish).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(spanish).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('html')).toHaveAttribute('lang','es-ES');
  await english.focus();
  await page.keyboard.press('Enter');
  const works = page.getByRole('link',{name:'WORKS',exact:true});
  await works.focus();
  expect(await works.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('none');
  expect(await works.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain('underline');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/works$/);
  const catnet = page.locator('.project-card').filter({has:page.getByRole('heading',{name:'CatNet',exact:true})}).locator('a,button');
  await expect(catnet).toHaveCount(1);
  await expect(catnet).toHaveAttribute('href', /\/works\/catnet$/);
  const gcs = page.getByRole('link',{name:'Chronoscape',exact:true});
  await gcs.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/works\/gcs$/);
  const back = page.getByRole('button',{name:'BACK',exact:true});
  await back.focus();
  await page.keyboard.press('Space');
  await expect(page).toHaveURL(/\/works$/);
});

test('200 percent text sizing and narrow effective viewport preserve content', async ({page}) => {
  await page.setViewportSize({width:640,height:450});
  await page.route('**/cat.gltf', route => route.fulfill({status:503,body:'layout fixture'}));
  for (const route of routes) {
    await page.goto(route || './');
    await page.addStyleTag({content:'html { font-size: 200%; }'});
    await checkLayout(page);
    for (const control of await page.locator('main a,main button,.header-actions a,.header-actions button').all()) {
      await control.scrollIntoViewIfNeeded();
      await expect(control).toBeVisible();
    }
  }
});

test('standalone touch controls are at least 44 pixels and do not rely on hover', async ({page}) => {
  for (const route of ['', 'works','projects','works/gcs']) {
    await page.goto(route || './');
    for (const control of await page.locator('.text-link,.sub-button,.language-switch button,.social-links a,.s-title a').all()) {
      const size = await control.boundingBox();
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
  }
});
