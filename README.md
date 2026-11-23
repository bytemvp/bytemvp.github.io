# Byte MVP

Byte MVP 的产品官网：单页静态站点，展示开源产品（当前为 [Night Rest／夜息](https://github.com/bytemvp/night-rest)）。基于 [Astro](https://astro.build) 构建，纯静态输出，可部署到 GitHub Pages 与 Cloudflare Pages。

## 页面结构

1. **产品首页**（`src/pages/index.astro`）：动态 Logo（`LogoAnimated.astro`）+ Night Rest 产品卡与特性网格。
2. **AI 工具精选**（`src/pages/tools/index.astro`，路由 `/tools`）：访客端纯净只读展示，包含分类筛选、实时搜索与外链直达；自动拉取云端数据，全网展示内容完全统一。
3. **AI 工具后台管理**（`src/pages/tools-manage/index.astro`，路由 `/tools-manage`）：隐蔽后台控制台，带口令门禁，支持快速输入网址自动抓取图标/简介、发布到云端，以及在线编辑与下架。

Header 中的像素 B 直接引用 `public/favicon.svg`（`<img>`），与浏览器标签图标共用同一文件；宽度用 `em` 相对字号缩放。修改 Logo 只需改 `public/favicon.svg` 一个文件（动态大 Logo 在 `LogoAnimated.astro` 内联 SVG 中单独维护）。

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
| `npm run add-tool` | 交互式输入网址，自动抓取图标与介绍并录入 AI 工具库 |

## Deployment

- **GitHub Pages**: push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/`. In the repo settings (Settings → Pages), set Source to "GitHub Actions".
- **Cloudflare Pages**: connect this repository in the Cloudflare dashboard, set Build command to `npm run build` and Build output directory to `dist`.

## Tech Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages / Cloudflare Pages
