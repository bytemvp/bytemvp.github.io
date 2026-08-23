# Byte MVP

Byte MVP 的产品官网：单页静态站点，展示开源产品（当前为 [Night Rest／夜息](https://github.com/bytemvp/night-rest)）。基于 [Astro](https://astro.build) 构建，纯静态输出，可部署到 GitHub Pages 与 Cloudflare Pages。

## 页面结构

整站只有一个首页（`src/pages/index.astro`），自上而下：

1. **动态 Logo**（`src/components/LogoAnimated.astro`）：像素风 B｜MVP 标志，王冠闪烁、B 像素变化、故障线漂移；纯 CSS 动画，颜色走主题变量，自动适配明暗模式，并尊重 `prefers-reduced-motion`
2. **产品介绍**：Night Rest 产品卡（简介、GitHub 链接、源码构建命令）+ 特性网格；产品数据集中在页面 frontmatter 的 `product` 对象中维护
3. **Footer**：无边框居中版权行，`body` flex 布局 + `mt-auto` 吸底

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

## Deployment

- **GitHub Pages**: push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/`. In the repo settings (Settings → Pages), set Source to "GitHub Actions".
- **Cloudflare Pages**: connect this repository in the Cloudflare dashboard, set Build command to `npm run build` and Build output directory to `dist`.

## Tech Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS
- **Deployment:** GitHub Pages / Cloudflare Pages
