# 界面配色

记录日期：2026-10-07。以下记录当前 HTML/CSS 界面的颜色；图片、3D 模型、材质和场景效果不属于界面配色。

## 全局颜色

定义位置：[`src/styles/tokens.css`](../src/styles/tokens.css)。

| 变量 | 当前颜色 | 用途 |
| --- | --- | --- |
| `--title-color` | `#f9f9f9` | 标题、导航和主要链接的默认白色 |
| `--context-color` | `#b8b8b8` | 正文、说明和次要文字 |
| `--hover-color` | `#70c7b8` | 通用链接交互、强调文字和装饰 |
| `--background-color` | `#242424` | 页面背景 |
| `--border-color` | `#606763` | 通用边框和分隔线 |

## 首页与列表项的局部颜色

首页在 [`src/views/Home.vue`](../src/views/Home.vue) 中覆盖颜色变量。作品和项目列表项（`.project-card`、`.kaiwu`）在 [`src/styles/portfolio.css`](../src/styles/portfolio.css) 中使用相同的局部颜色，保留原有视觉风格。

| 变量 | 当前颜色 | 用途 |
| --- | --- | --- |
| `--context-color` | `#aaaaaa`（源码简写为 `#aaa`） | 首页正文、列表项正文和 Kaiwu 能力标签 |
| `--hover-color` | `#54a296` | 首页交互、列表项强调色、角部装饰及 Kaiwu 分隔符 |

Kaiwu 的 `KAIWUART.CN` 和 `PREVIEW` 默认使用 `var(--title-color)`，下划线跟随文字颜色。两个入口的 hover 与键盘焦点状态均使用 `var(--hover-color)`，与入口之间和能力标签之间的竖线一致，在当前列表项作用域内解析为 `#54a296`。

## Kaiwu 查看器的背景

定义位置：[`src/features/kaiwu/kaiwu.css`](../src/features/kaiwu/kaiwu.css)；默认场景背景也配置在 [`src/features/kaiwu/debug.js`](../src/features/kaiwu/debug.js)。

| 当前颜色 | 用途 |
| --- | --- |
| `#171717` | 查看器舞台和默认场景背景 |
| `#eeeeee`（源码简写为 `#eee`） | Kaiwu 页面图片背景 |

## 维护约定

- 新增或调整界面样式时复用当前作用域的颜色变量，不额外引入颜色。
- 同一组件的 hover、键盘焦点与强调分隔符共用 `--hover-color`。
- 局部变量优先于全局值；确认实际颜色时同时检查组件所在作用域。
- 以后修改现有配色时，同步更新本文中的颜色、用途和来源。
