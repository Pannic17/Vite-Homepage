import { build } from 'vite';
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, sep, extname, join } from 'node:path';
import assert from 'node:assert/strict';
import { productionPaths } from '../src/routePaths.js';

const output = resolve(process.argv.includes('--output') ? process.argv[process.argv.indexOf('--output') + 1] : 'phase1-latest.local');
await mkdir(output, { recursive: true });
const results = { capturedAt: new Date().toISOString(), mode: 'Local static-file server, directory redirects, real 404 status; no SPA success rewrite. Not a live GitHub deployment.', runs: [] };
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
results.browser = browser.version();
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.gltf': 'model/gltf+json', '.svg': 'image/svg+xml' };
try {
  for (const base of ['/', '/Vite-Homepage-24/', '/Vite-Homepage/']) {
    const root = resolve(base === '/' ? '.static-root.local' : '.static-project.local');
    await build({ base, build: { outDir: root } });
    const server = createServer(async (request, response) => {
      try {
        const url = new URL(request.url, 'http://127.0.0.1');
        if (!url.pathname.startsWith(base)) throw new Error('Outside deployment base');
        let file = resolve(root, decodeURIComponent(url.pathname.slice(base.length)) || '.');
        if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside document root');
        if ((await stat(file)).isDirectory()) {
          if (!url.pathname.endsWith('/')) {
            response.writeHead(301, { Location: url.pathname + '/' + url.search });
            response.end();
            return;
          }
          file = join(file, 'index.html');
        }
        const body = await readFile(file);
        response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
        response.end(body);
      } catch {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end(await readFile(join(root, '404.html')));
      }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    try {
      for (const route of [...productionPaths, '/test', '/unknown-page']) {
        const page = await context.newPage();
        const failures = [];
        page.on('pageerror', error => failures.push(error.message));
        page.on('response', response => {
          if (response.request().resourceType() !== 'document' && response.status() >= 400) failures.push(response.status() + ' ' + response.url());
        });
        const response = await page.goto(origin + base + route.slice(1) + '?probe=one#marker', { waitUntil: 'networkidle' });
        assert.equal(response.status(), ['/test','/unknown-page'].includes(route) ? 404 : 200);
        assert.equal(new URL(page.url()).search, '?probe=one');
        assert.equal(new URL(page.url()).hash, '#marker');
        // Inspect emitted HTML, before Vite adds links for later dynamic imports.
        const preloadUrls = [...(await response.text()).matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"/g)].map(match => match[1]);
        assert(preloadUrls.length > 0, 'Current route should have module preload hints');
        assert(!preloadUrls.some(url => /\/assets\/home-[\w-]+\.js/.test(url)), 'Optional 3D must not be preloaded');
        if (route !== '/') assert(!preloadUrls.some(url => /\/assets\/Home-[\w-]+\.js/.test(url)), 'Other static routes must not preload the Home view');
        await page.waitForFunction(() => document.querySelector('#app')?.textContent.trim().length > 0);
        await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
        await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
        if (route === '/works/gcs') {
          assert.equal(await page.locator('.site-header h1').textContent(), 'Chronoscape');
          if (base !== '/') await page.screenshot({ path: join(output, 'gcs-desktop.png'), fullPage: true });
        }
        if (route.startsWith('/works/three-lab')) {
          assert(preloadUrls.some(url => url.includes('/assets/ThreeLab-')), 'Lab entry must preload its page');
          assert(!preloadUrls.some(url => url.includes('/assets/runtime-')), 'Lab renderer must remain dynamic');
          await page.waitForFunction(() => document.querySelector('.lab-stage')?.dataset.state === 'ready');
          if (route === '/works/three-lab') {
            const reload = await page.reload({waitUntil:'networkidle'});
            assert.equal(reload.status(), 200);
            await page.waitForFunction(() => document.querySelector('.lab-stage')?.dataset.state === 'ready');
          }
        }
        if (route === '/projects/kaiwu' || route === '/projects/kaiwu/viewer') {
          const view=route.endsWith('/viewer')?'KaiwuViewer':'KaiwuHome';
          assert(preloadUrls.some(url=>url.includes('/assets/'+view+'-')), 'Kaiwu entry must preload its own page');
          assert(!preloadUrls.some(url=>url.includes('/assets/scene-')), 'Viewer renderer must remain dynamic');
          if(route.endsWith('/viewer'))await page.waitForFunction(()=>document.querySelector('.kaiwu-stage')?.dataset.state==='ready');
          const reload=await page.reload({waitUntil:'networkidle'});
          assert.equal(reload.status(),200);
          if(route.endsWith('/viewer'))await page.waitForFunction(()=>document.querySelector('.kaiwu-stage')?.dataset.state==='ready');
        }
        if (['/test','/unknown-page'].includes(route)) assert.equal(await page.locator('h1').textContent(), '404');
        assert.deepEqual(failures, []);
        const retiredLinks=await page.locator('a[href]').evaluateAll(links=>links.filter(link=>{
          const host=new URL(link.href).hostname;return host==='kaiwuart.cn'||host.endsWith('.kaiwuart.cn');
        }).map(link=>link.href));
        assert.deepEqual(retiredLinks,[], 'Retired Kaiwu links must not appear on any page');
        results.runs.push({ base, route, status: response.status(), finalUrl: page.url(), images: await page.locator('img').count(), failures });
        await page.close();
      }
    } finally {
      await context.close();
      await new Promise(resolve => server.close(resolve));
    }
  }
  await writeFile(join(output, 'static-host.json'), JSON.stringify(results, null, 2));
  console.log('Static host checks passed for root, legacy and current Pages paths: ' + results.runs.length + ' routes');
} finally { await browser.close(); }
