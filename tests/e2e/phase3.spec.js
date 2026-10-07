import {test, expect} from '@playwright/test';

test('locale persists through routes and reloads and updates document metadata', async ({page}) => {
  await page.goto('works');
  await expect(page).toHaveTitle('WORKS | PANNIC');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await expect(page).toHaveTitle('作品 | PANNIC');
  await expect(page.getByRole('heading',{name:'作品',exact:true})).toBeVisible();
  await expect(page.locator('[data-entry-id="ai-shijing"]')).toContainText('AI 诗经绘画');
  await page.getByRole('link',{name:'Chronoscape',exact:true}).click();
  await expect(page).toHaveTitle('Chronoscape | PANNIC');
  await expect(page.locator('.detail-meta')).toContainText('YOLO');
  await expect(page.locator('.detail-meta')).toContainText('装置');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await expect(page.getByText('更多项目详情正在整理中。')).toBeVisible();
  await page.getByRole('button',{name:'返回',exact:true}).click();
  await expect(page).toHaveTitle('作品 | PANNIC');
  await page.goForward();
  await expect(page).toHaveTitle('Chronoscape | PANNIC');
  await page.getByRole('button',{name:'ENGLISH',exact:true}).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','en-US');
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('en-US');
});

for(const mode of ['get-blocked','set-blocked','invalid']) {
  test('language remains usable when storage is ' + mode, async ({page}) => {
    const errors=[];
    page.on('pageerror',error => errors.push(error.message));
    await page.addInitScript(mode => {
      if(mode === 'get-blocked') Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}});
      if(mode === 'set-blocked') Storage.prototype.setItem = () => {throw new Error('Storage quota');};
      if(mode === 'invalid') localStorage.setItem('locale','__proto__');
    },mode);
    await page.goto('about');
    await expect(page.getByRole('heading',{name:'ABOUT',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'中文',exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
    await expect(page).toHaveTitle('关于 | PANNIC');
    await expect(page.getByRole('heading',{name:'关于',exact:true})).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('Chinese browser preference is used when a saved locale is invalid', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator,'language',{value:'zh-HK'});
    localStorage.setItem('locale','fr-FR');
  });
  await page.goto('projects');
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await expect(page).toHaveTitle('项目 | PANNIC');
  await expect(page.getByRole('heading',{name:'开物 KaiwuArt',exact:true})).toBeVisible();
});

test('internal navigation creates exactly one history entry and external links open once', async ({page,context}) => {
  await page.goto('works');
  const before=await page.evaluate(() => history.length);
  await page.getByRole('link',{name:'Chronoscape',exact:true}).click();
  await expect(page).toHaveURL(/\/works\/gcs$/);
  expect(await page.evaluate(() => history.length)).toBe(before + 1);
  await page.goBack();
  await expect(page).toHaveURL(/\/works$/);
  await expect(page.locator('[data-entry-id="catnet"] a')).toHaveAttribute('href',/\/works\/catnet$/);
  await context.route('https://pannic17.github.io/C1-Final/**',route => route.fulfill({body:'External test destination',contentType:'text/html'}));
  const popups=[];
  page.on('popup',popup => popups.push(popup));
  const opened=page.waitForEvent('popup');
  await page.locator('[data-entry-id="pokemon-pad"] a').click();
  const popup=await opened;
  await popup.waitForLoadState();
  expect(popups).toHaveLength(1);
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await expect(page).toHaveURL(/\/works$/);
  await popup.close();
});

test('About uses existing profile data; production TEST is retired', async ({page}) => {
  await page.goto('about');
  await expect(page.getByRole('heading',{name:'Jiangyun Pan',exact:true})).toBeVisible();
  await expect(page.getByText('MSc Creative Computing - UAL CCI',{exact:false})).toBeVisible();
  await expect(page.getByRole('link',{name:'Email',exact:true})).toHaveAttribute('href','mailto:pannic1984@outlook.com');
  await page.goto('./');
  await expect(page.locator('a[href$="/test"]')).toHaveCount(0);
  await page.goto('test');
  await expect(page.getByRole('heading',{name:'404'})).toBeVisible();
  await expect(page).toHaveTitle('This page could not be found. | PANNIC');
  await page.getByRole('link',{name:'HOME',exact:true}).click();
  await expect(page).toHaveTitle('PANNIC');
});

test('all content loads in both languages without missing translation warnings', async ({page}) => {
  const warnings=[];
  page.on('console',message => {if(/Not found .* key|Fall back to translate/.test(message.text())) warnings.push(message.text());});
  await page.goto('./');
  for(const locale of ['zh-CN','en-US']) {
    await page.evaluate(value => localStorage.setItem('locale',value),locale);
    for(const route of ['about','works','projects','works/gcs','works/catnet']) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang',locale);
      await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
      await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    }
  }
  expect(warnings).toEqual([]);
});
