import {test,expect} from '@playwright/test';

// Windows baselines use the lockfile-pinned bundled Chromium; other OS/font
// combinations run geometry checks, not comparisons to unrelated raster images.
test.skip(process.platform !== 'win32' || !!process.env.PLAYWRIGHT_CHANNEL, 'Pixel baselines require Windows and bundled Chromium.');
test.use({reducedMotion:'reduce'});
// Chinese layout/translation is covered by geometry tests; CI runners do not
// ship the same CJK fallback fonts as a Chinese-language Windows installation.
const locale='en-US';
for(const route of ['./','works','projects']) {
  test(`shared ${route} composition in ${locale}`,async ({page})=>{
    await page.addInitScript(value=>localStorage.setItem('locale',value),locale);
    await page.goto(route);
    await page.locator('h1').waitFor();
    await page.addStyleTag({content:'body, .home, .portfolio-layout, .project-card, .kaiwu { font-family: Arial, sans-serif !important; }'});
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluateAll(images=>images.forEach(image=>{image.loading='eager';}));
    await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
    await page.mouse.move(0,0);
    await expect(page).toHaveScreenshot(`${route==='./'?'home':route}-${locale}.png`,{animations:'disabled',caret:'hide',maxDiffPixelRatio:.005});
  });
}
