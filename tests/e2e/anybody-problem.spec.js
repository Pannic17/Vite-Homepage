import {test, expect} from '@playwright/test';

test('Anybody Problem card opens localized details with three source destinations', async ({page, context}) => {
  await context.route('https://github.com/Pannic17/VAP-*', route => route.fulfill({body:'Source repository',contentType:'text/html'}));
  await page.goto('works');
  const card = page.locator('[data-entry-id="anybody-problem"]');
  await expect(card).toContainText('Unreal Engine 4.27');
  await card.click();
  await expect(page).toHaveURL(/\/works\/anybody-problem$/);
  await expect(page).toHaveTitle('Anybody Problem | PANNIC');
  await expect(page.locator('.artwork-detail .tags')).toHaveCount(0);
  await expect(page.locator('iframe')).toHaveCount(0);
  const links = page.locator('.hero-copy .detail-links a');
  await expect(links).toHaveCount(3);
  for(const [index, repository] of ['VAP-UE427','VAP-OpenCV-Detection','VAP-Unity'].entries()) {
    const href = `https://github.com/Pannic17/${repository}`;
    await expect(links.nth(index)).toHaveAttribute('href',href);
    const opened = page.waitForEvent('popup');
    await links.nth(index).click();
    const popup = await opened;
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(href);
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await popup.close();
  }
  await expect(page.locator('.detail-copy')).toContainText('maintained independently');
  await page.getByRole('button',{name:'中文',exact:true}).click();
  await expect(page.getByRole('heading',{name:'视觉 × 引力',exact:true})).toBeVisible();
  await expect(page.locator('.detail-copy')).toContainText('三个仓库独立维护');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
  await page.getByRole('button',{name:'返回',exact:true}).click();
  await expect(page).toHaveURL(/\/works$/);
});
