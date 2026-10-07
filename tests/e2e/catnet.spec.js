import {test, expect} from '@playwright/test';

test('CatNet opens from Works with localized details, source link and a responsive demo', async ({page, context}) => {
  // Keep the page checks independent of the third-party player's availability.
  await page.route('https://player.bilibili.com/**', route => route.fulfill({body:'Demo player', contentType:'text/html'}));
  await context.route('https://github.com/Pannic17/CatNet-Unity', route => route.fulfill({body:'CatNet source', contentType:'text/html'}));
  await page.goto('works');
  await page.locator('[data-entry-id="catnet"]').click();
  await expect(page).toHaveURL(/\/works\/catnet$/);
  await expect(page).toHaveTitle('CatNet | PANNIC');
  await expect(page.getByRole('heading', {name:'CatNet', exact:true})).toBeVisible();
  await expect(page.locator('.detail-copy')).toContainText('224 × 224');
  await expect(page.locator('.detail-copy')).not.toContainText('More project details will be added here.');
  const source = page.getByRole('link', {name:'View source on GitHub ↗'});
  const opened = page.waitForEvent('popup');
  await source.click();
  const popup = await opened;
  await popup.waitForLoadState();
  await expect(popup).toHaveURL('https://github.com/Pannic17/CatNet-Unity');
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await popup.close();
  const video = page.locator('.detail-video iframe');
  await expect(video).toHaveAttribute('src', 'https://player.bilibili.com/player.html?bvid=BV1434y1R7Yw&page=1&autoplay=0');
  await expect(page.getByRole('link', {name:'Watch on bilibili ↗'})).toHaveAttribute('href','https://www.bilibili.com/video/BV1434y1R7Yw/');
  await video.scrollIntoViewIfNeeded();
  const box = await video.boundingBox();
  expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', {name:'中文', exact:true}).click();
  await expect(video).toHaveAttribute('title','CatNet 演示视频');
  await expect(page.getByRole('link', {name:'在 GitHub 查看源码 ↗'})).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await expect(page.locator('.detail-copy')).toContainText('猫脸');
  await page.getByRole('button', {name:'返回', exact:true}).click();
  await expect(page).toHaveURL(/\/works$/);
});
