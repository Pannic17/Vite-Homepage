# 个人主页与作品集

基于 Vue 3、Vite 和 Three.js 构建的个人网站，用于展示潘江昀的个人介绍、创意编程作品和开发项目。网站支持中英文切换、响应式布局和交互式 3D 首页，可构建为静态文件部署，无需后端服务或数据库。

线上地址：[pannic17.github.io/Vite-Homepage](https://pannic17.github.io/Vite-Homepage/)。本地默认前缀仍为 `/Vite-Homepage-24/`；Pages 工作流从仓库配置读取实际发布前缀。

## 项目功能

- **个人介绍**：首页与 About 页面展示个人背景及联系方式。
- **作品与项目**：Works、Projects 分类展示作品，支持站内详情及外部项目链接。
- **交互式 3D 首页**：使用 Three.js 展示模型及视觉效果，支持动画开关、画质选择和静态回退。
- **中英双语**：使用 Vue I18n 管理文案，并在浏览器存储可用时记住语言选择。
- **响应式体验**：适配桌面与移动端，支持键盘导航，并提供响应式 WebP 图片。
- **静态部署**：构建时为已知路由生成独立 HTML 入口，同时生成 `404.html`，方便静态托管和详情页直接访问。

## 技术栈

| 用途 | 技术 |
| --- | --- |
| 页面与组件 | Vue 3 |
| 开发与构建 | Vite |
| 页面路由 | Vue Router 4 |
| 国际化 | Vue I18n 9 |
| 3D 渲染 | Three.js |
| 代码检查与测试 | ESLint、Node.js Test Runner、Playwright |
| 自动检查与部署 | GitHub Actions、GitHub Pages |

## 本地运行

需要 Node.js **22.19.0 或以上**，建议使用 `.node-version` 中固定的 **24.19.0**。项目使用 npm，依赖版本由 `package-lock.json` 锁定。

在项目根目录执行：

```sh
npm ci
npm run dev
```

打开终端显示的本地地址。默认路径前缀为 `/Vite-Homepage-24/`；按 `Ctrl+C` 停止服务。

Windows 用户也可以双击根目录的 `start-local.cmd`，自动安装缺失的依赖、启动开发服务并打开浏览器。首次安装依赖需要联网，使用期间需保留终端窗口。

### 构建与预览

```sh
npm run build
npm run preview
```

构建结果位于 `dist/`。`preview` 用于本地检查构建产物；正式部署时，将完整的 `dist/` 发布到静态托管服务。

## 部署方式

### GitHub Pages

项目已提供部署工作流 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)，在推送到 `master` 分支时触发，也支持手动运行。

1. 将项目代码及工作流提交到 GitHub 仓库。
2. 在仓库的 **Settings → Pages → Build and deployment** 中，将 Source 设为 **GitHub Actions**。
3. 确认部署路径与仓库名称一致。当前默认值是 `/Vite-Homepage-24/`，在 `vite.config.js` 中配置；如果仓库改名，需要同步修改默认值，或为工作流设置 `VITE_BASE_PATH`。
4. 推送代码到 `master`，或在 **Actions → Build and publish Pages → Run workflow** 中手动触发。
5. 等待构建和部署成功，通过部署任务提供的地址访问网站。

工作流会安装依赖、执行代码检查、依赖审计、浏览器测试及静态路由检查，然后从源码重新构建并发布 `dist/`。检查失败时不会进入部署步骤。

当前默认访问地址为：

```text
https://<GitHub 用户名>.github.io/Vite-Homepage-24/
```

### 其他静态托管服务

可将构建产物部署到支持静态文件的服务或 Web 服务器。使用以下配置：

| 配置项 | 值 |
| --- | --- |
| 依赖安装 | `npm ci` |
| 构建命令 | `npm run build` |
| 发布目录 | `dist` |
| Node.js 版本 | 与 `.node-version` 一致 |
| 环境变量 | `VITE_BASE_PATH`，按实际访问路径设置 |

**部署到根域名**（如 `https://example.com/`）：将 `VITE_BASE_PATH` 设为 `/`。

PowerShell：

```powershell
$env:VITE_BASE_PATH = '/'
npm run build
npm run preview
# 预览结束后按 Ctrl+C，再清除变量
Remove-Item Env:VITE_BASE_PATH
```

macOS / Linux：

```sh
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/ npm run preview
```

**部署到子目录**（如 `https://example.com/portfolio/`）：将上述变量值改为 `/portfolio/`，并把 `dist/` 内的文件发布到服务器对应的 `/portfolio/` 目录。路径前后都应保留 `/`。不设置变量时，默认使用 `/Vite-Homepage-24/`。

`VITE_BASE_PATH` 在构建时生效，变更部署路径后需要重新构建；本地预览时也应使用相同的值。

### 路由与发布注意事项

- 每次发布都使用新构建的完整 `dist/`，包括资源文件、各路由目录和 `404.html`，不要直接使用仓库中遗留的构建产物。
- 静态服务器应支持目录下的 `index.html`。已知路由依靠生成的目录入口实现直接访问，无需额外配置 SPA 重写。
- 如需让未知地址展示站内 404 页面，请将托管服务的自定义错误页设为构建产物中的 `404.html`，并保留 HTTP 404 状态。
- 发布后检查首页、作品列表、详情页直接访问与刷新，以及图片、模型和语言切换是否正常。

## 内容维护

### Kaiwu 页面（Phase 2）

Projects 的 Kaiwu“查看详情”和配置页的“查看示例”进入 `/projects/kaiwu/viewer?debug=1`，加载默认模型并展开 Three.js 调试菜单。“3D Viewer”仅作为能力标签展示。个人介绍中的 KaiwuArt 进入 `/projects/kaiwu`。路径自动适配站点部署前缀，支持直接打开和刷新。

配置页提供默认示例、模型 URL、远程 JSON 和本地 JSON。默认配置位于 `public/kaiwu/default.json`；模型、纹理和 HDR 位于 `public/kaiwu/`。远程资源需要允许浏览器跨域访问；本地 JSON 保存在会话存储中，刷新可恢复，关闭会话后需重新选择。

查看器与首页仅共用 **Three.js 0.147.0**，渲染实例独立。暂停时按需绘制、后台停止调度、离开时释放资源。非零 HDR 旋转和旧版高级后处理尚未支持，配置启用这些功能时会显示提示。

维护入口：`src/features/kaiwu/`（配置、渲染、双语文案）、`src/views/KaiwuHome.vue`、`src/views/KaiwuViewer.vue`。默认示例资源约 19 MB，应按需加载；修改模型或压缩资源后需重新核对材质和移动端表现。

参见 [Phase 2 Roadmap](docs/Phase2/Roadmap.md) 与 [Phase 2 发布验收](docs/Phase2/deployment.md)。

```text
src/
├── components/       共用组件
├── content/          作品、项目、联系方式和图片信息
├── lang/             中英文文案
├── layouts/          页面布局
├── styles/           样式与设计变量
├── three/            3D 场景、效果与画质控制
├── views/            页面组件
├── router.js         路由配置
└── routePaths.js     页面路径与静态构建路由
public/               图片、模型等静态资源
scripts/              启动、图片处理及验证脚本
tests/               单元测试与浏览器测试
.github/workflows/    自动检查与部署流程
```

- 修改作品或项目：编辑 `src/content/portfolio.js`，并同步更新 `src/lang/cn.js` 和 `src/lang/en.js`。
- 修改联系方式：编辑 `src/content/profile.js`。
- 更新作品封面或 Kaiwu 海报后，运行 `npm run images:optimize`，同时保存生成的 `public/image/optimized/` 和 `src/content/imageVariants.json`。
- 带有详情定义的项目会自动生成详情路由及静态 HTML 入口。`/test` 仅供开发使用，不会生成生产页面。

详细说明见 [内容与语言维护](docs/Phase1/content.md)。

当前界面颜色、局部覆盖及交互配色约定见 [界面配色](docs/design-colors.md)。

## 常用检查

```sh
# 代码检查、单元测试及构建验证
npm run check

# 首次运行浏览器测试前安装浏览器
npx playwright install --with-deps chromium firefox webkit

# 完整浏览器测试
npm run test:e2e

# 检查根路径和默认子路径下的静态部署
npm run test:static
```

浏览器检查请依次运行，避免预览端口冲突。更多开发记录见 [Roadmap](docs/Phase1/Roadmap.md) 和 `docs/Phase1/` 目录。

Pages 发布仅执行依赖安装和生产构建；完整回归在 Actions 的 `Verify site` 手动运行，不阻塞上线。发布后可运行 `node scripts/verify-kaiwu-live.mjs` 检查主要线上流程。
