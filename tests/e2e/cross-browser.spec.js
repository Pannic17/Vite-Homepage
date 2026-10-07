import {test,expect} from '@playwright/test';

test('content, language persistence and responsive geometry across engines', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const width of [320,768,1440]) {
    await page.setViewportSize({width,height:900});
    for(const route of ['./','about','works','projects','works/gcs']) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
    }
  }
  await page.goto('works');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await page.getByRole('link',{name:'Chronoscape',exact:true}).click();
  await expect(page).toHaveURL(/\/works\/gcs$/);
  await page.goBack();
  await expect(page.locator('.project-card')).toHaveCount(9);
  expect(errors).toEqual([]);
});

test('static motion preference, keyboard navigation and image fallback', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  await expect(page.locator('#three-canvas')).toHaveAttribute('data-state','static');
  await expect(page.locator('canvas')).toHaveCount(0);
  const works=page.getByRole('link',{name:'WORKS',exact:true});
  await works.focus();
  await page.keyboard.press('Enter');
  const cover=page.locator('[data-entry-id="catnet"] .s-cover');
  await expect.poll(()=>cover.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
  await expect.poll(()=>cover.evaluate(el=>el.currentSrc)).toContain('.webp');
  await page.locator('picture source').evaluateAll(sources=>sources.forEach(source=>source.remove()));
  await expect.poll(()=>cover.evaluate(el=>el.currentSrc)).toContain('CAT-Cover.png');
  await expect.poll(()=>cover.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
});

test('WebGL either starts or provides an operable fallback', async ({page},testInfo) => {
  await page.goto('./');
  await expect(page.locator('#three-canvas')).toHaveAttribute('data-state',/^(ready|fallback)$/);
  const state=await page.locator('#three-canvas').getAttribute('data-state');
  testInfo.annotations.push({type:'webgl',description:state});
  await page.getByRole('button',{name:state==='ready'?'Disable animation':'Enable animation',exact:true}).click();
  if(state==='ready') await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link',{name:'PROJECTS',exact:true}).click();
  await expect(page.getByRole('heading',{name:'PROJECTS',exact:true})).toBeVisible();
});

test('Kaiwu internal flow, language and graphics fallback work across engines',async({page},testInfo)=>{
  await page.goto('projects');await page.locator('.k-detail').click();
  await expect(page).toHaveURL(/\/projects\/kaiwu\/viewer\?debug=1$/);
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await page.getByRole('link',{name:'模型配置',exact:true}).click();
  const example=page.getByRole('link',{name:'查看示例',exact:true});
  await example.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.kaiwu-stage')).toHaveAttribute('data-state',/^(ready|failed)$/,{timeout:35000});
  const state=await page.locator('.kaiwu-stage').getAttribute('data-state');
  testInfo.annotations.push({type:'kaiwu-webgl',description:state});
  if(state==='failed')await expect(page.getByRole('alert')).toContainText('3D 渲染不可用');
  else await expect(page.locator('canvas')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.getByRole('link',{name:'返回项目',exact:true}).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page).toHaveURL(/\/projects$/);
});
