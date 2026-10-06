import { test, expect } from '@playwright/test';

// Regression coverage for the three original baseline defects, now resolved.
test('B01: resizing home preserves the document', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#three-canvas canvas')).toHaveCount(1);
  await page.evaluate(() => { window.__baselineDocument = 'original'; });
  const navigated = page.waitForEvent('framenavigated', { timeout: 1500 }).catch(() => null);
  await page.setViewportSize({ width: 800, height: 600 });
  await navigated;
  await page.waitForLoadState();
  expect(await page.evaluate(() => window.__baselineDocument)).toBe('original');
  await expect(page.locator('#three-canvas')).toHaveAttribute('data-state', 'ready');
  await expect.poll(() => page.locator('#three-canvas canvas').evaluate(canvas => Math.abs(canvas.width - canvas.parentElement.clientWidth))).toBeLessThanOrEqual(1);
});

test('B02: selected language survives refresh', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '中文', exact: true }).click();
  await expect(page.getByRole('link', { name: '作品', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', {name: 'PANNIC', exact: true})).toBeVisible();
  expect(await page.getByRole('link', { name: '作品', exact: true }).count()).toBe(1);
});

test('B03: GCS direct URL renders a detail view rather than the works listing', async ({ page }) => {
  await page.goto('works/gcs');
  await expect(page.locator('#app')).not.toBeEmpty();
  expect(await page.locator('.site-header').count()).toBe(1);
  await expect(page.getByRole('heading', { name: 'Chronoscape', exact: true })).toBeVisible();
  await expect.poll(() => page.locator('.gcs-cover').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
});
