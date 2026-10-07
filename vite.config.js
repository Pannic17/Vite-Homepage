import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { productionPaths } from './src/routePaths.js'

// Known routes get real HTML entries on static hosts. Unknown routes receive
// the same app shell as a genuine HTTP 404, preserving history-mode URLs.
function staticEntries() {
  let base;
  return {
    name: 'static-route-entries',
    apply: 'build',
    enforce: 'post',
    configResolved(config) { base = config.base; },
    generateBundle(options, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') throw new Error('Missing index.html');
      const shell = String(index.source);
      const pageShell = view => {
        const entry = Object.values(bundle).find(chunk => chunk.type === 'chunk' && chunk.facadeModuleId?.replaceAll('\\', '/').endsWith('/src/views/' + view + '.vue'));
        if (!entry) throw new Error('Missing route chunk: ' + view);
        const scripts = new Set(), styles = new Set();
        function visit(chunk) {
          if (scripts.has(chunk.fileName)) return;
          scripts.add(chunk.fileName);
          // Only static dependencies: never preload the optional 3D import.
          for (const dependency of chunk.imports) if (bundle[dependency]?.type === 'chunk') visit(bundle[dependency]);
          for (const css of chunk.viteMetadata?.importedCss || []) styles.add(css);
        }
        visit(entry);
        const hints = [
          ...[...scripts].filter(file => !shell.includes(base + file)).map(file => `<link rel="modulepreload" crossorigin href="${base}${file}">`),
          ...[...styles].filter(file => !shell.includes(base + file)).map(file => `<link rel="stylesheet" crossorigin href="${base}${file}">`),
        ];
        return shell.replace('</head>', hints.join('\n    ') + '\n  </head>');
      };
      const views = {'/':'Home','/about':'About','/works':'Works','/projects':'Projects','/projects/kaiwu':'KaiwuHome','/projects/kaiwu/viewer':'KaiwuViewer','/projects/kaiwu/details':'KaiwuDetails'};
      for (const path of productionPaths.filter(path => path !== '/')) {
        this.emitFile({ type: 'asset', fileName: path.slice(1) + '/index.html', source: pageShell((path.startsWith('/works/three-lab') ? 'ThreeLab' : views[path]) || 'ProjectDetail') });
      }
      index.source = pageShell('Home');
      this.emitFile({ type: 'asset', fileName: '404.html', source: pageShell('NotFound') });
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), staticEntries()],
  server: {watch: {ignored:['**/*.local/**','**/.baseline-dist/**','**/test-results/**','**/playwright-report/**']}},
  base: process.env.VITE_BASE_PATH || '/Vite-Homepage-24/'
})
