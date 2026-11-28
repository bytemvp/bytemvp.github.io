# Byte MVP

Byte MVP 官方网站：基于 [Astro](https://astro.build) 构建，纯静态输出，通过推送分支自动部署到 GitHub Pages 与 Cloudflare Pages。

## 页面结构

1. **品牌首页**（`src/pages/index.astro`）：动态像素 Logo（`LogoAnimated.astro`）+ 品牌 Slogan 与导航入口。
2. **AI 工具精选**（`src/pages/tools/index.astro`，路由 `/tools`）：纯静态构建的 AI 工具导航页，支持分类筛选、关键词与 `#标签` 检索、URL 状态同步与外链直达。数据完全由 [src/data/tools.json](src/data/tools.json) 驱动，图标本地托管于 `public/tools-icons/`。

Header 中的像素 B 直接引用 `public/favicon.svg`（`<img>`），与浏览器标签图标共用同一文件；宽度用 `em` 相对字号缩放。修改 Logo 只需改 `public/favicon.svg` 一个文件（动态大 Logo 在 `LogoAnimated.astro` 内联 SVG 中单独维护）。

## 更新 AI 工具

可以通过以下任意方式更新工具列表，提交并推送（合并）至 `main` 分支后即自动发布上线：

- **交互式命令行录入**：运行 `npm run add-tool`，输入网址即可自动抓取名称、中文简介与高清图标并写入 `src/data/tools.json` 和 `public/tools-icons/`；
- **直接编辑配置**：编辑 `src/data/tools.json` 新增、修改、删除条目，或调整数组顺序即可改变前台展示顺序。

## 主题

- 由 `data-theme="light|dark"` 驱动，`BaseHead.astro` 首绘前读取 `localStorage.theme`，无用户选择时跟随 `prefers-color-scheme`；`ThemeToggle` 切换并持久化
- 设计 token 为 CSS 变量（`src/styles/global.css`），映射到 Tailwind 的 `accent`、`ink`、`gray` 等工具类；新增样式优先用 Tailwind utilities，复用样式放 `@layer components`

## Commands

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview the built site locally |
| `npm run check` | Build + TypeScript check |
| `npm run add-tool` | 交互式输入网址，自动抓取图标与中文介绍并录入 `src/data/tools.json` |

## Deployment

- **GitHub Pages**: 推送或合并到 `main` 分支触发 `.github/workflows/deploy.yml`，自动执行 `npm run check` 并将 `dist/` 发布到 GitHub Pages（仓库 Settings → Pages Source 设为 "GitHub Actions"）。
- **Cloudflare Pages**: 连接仓库后设置 Build command 为 `npm run check`、Build output directory 为 `dist`。

## Tech Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages / Cloudflare Pages
