## 1. 建立水墨设计 token

- [x] 1.1 在 `src/styles/global.css` 中定义浅色和深色主题的宣纸、墨色、灰阶、朱砂、靛青、黛绿、晕染、边框和阴影变量。
- [x] 1.2 更新 `tailwind.config.mjs`，将颜色 token 映射为 `paper`、`paper-deep`、`ink`、`ink-muted`、`cinnabar`、`indigo`、`jade`、`wash` 等语义化 utility，并移除旧糖果色 token。
- [x] 1.3 重写全局背景、字体回退、标题层级、代码块、引用块、链接和 selection 样式，使其使用水墨 token，同时保留 Atkinson 字体资产。
- [x] 1.4 更新 `surface-card`、`hero-shell`、按钮、标签和 hover/focus 状态，使用低透明度 CSS 洗染、细边框和柔和阴影，确保背景纹理不拦截指针事件。

## 2. 迁移共享组件与布局

- [x] 2.1 更新 `src/components/Header.astro`、`HeaderLink.astro`、`Footer.astro` 和 `ThemeToggle.astro` 的颜色、边框、背景、active、hover 和 focus 样式。
- [x] 2.2 更新 `src/layouts/BlogPost.astro` 的 hero、文章元信息、标签、来源链接、图片边框和正文容器，使文章详情与关于页使用统一水墨层次。
- [x] 2.3 检查 `BaseHead.astro` 与主题初始化逻辑，确保首次绘制、主题切换、字体 preload 和页面元信息行为不被视觉改造破坏。

## 3. 迁移页面视觉表现

- [x] 3.1 更新 `src/pages/index.astro` 的 hero、精选文章、最新文章、CTA 和统计卡片，移除旧糖果色 utility 引用。
- [x] 3.2 更新 `src/pages/blog/index.astro`、`src/pages/blog/[...slug].astro` 的列表卡片、文章图片、日期、标签和内容入口样式，保持 featured 与普通文章层级。
- [x] 3.3 更新 `src/pages/about.astro` 的简介卡片、联系 CTA、正文区块和原则列表，使其使用宣纸、墨色和克制点缀色。
- [x] 3.4 更新 `src/pages/tools.astro` 的 `.tool-*` 局部样式和页面 utility，统一工具卡片、输入框、按钮、结果、成功/错误信息、焦点态和复制反馈。
- [x] 3.5 在 `src/` 中搜索并清理 `bg-candy`、`bg-mango`、`bg-lime`、`bg-aqua`、`bg-bubble` 及对应旧视觉 token 的残留引用，确认无页面继续以糖果色为主视觉。

## 4. 验证视觉与行为

- [x] 4.1 运行 `npm run check`，确认 Astro 构建、TypeScript 检查和 Wrangler dry-run 通过。
- [x] 4.2 在开发或预览环境检查 `/`、`/blog`、至少一篇 `/blog/<slug>/`、`/about` 和 `/tools` 的浅色与深色主题。
- [x] 4.3 在移动端和桌面端检查导航、标题换行、卡片布局、正文宽度、工具表单和主题切换，不出现遮挡、溢出或交互失效。
- [x] 4.4 验证正文文本对比度至少为 4.5:1、交互元素对比度至少为 3:1，并确认 active、hover、focus、成功和错误状态不只依赖颜色区分。
- [x] 4.5 执行工具页 JSON、URL、Base64、时间戳、UUID、密码、复制和字数统计的成功/错误路径检查，确认视觉改造未改变原有功能。
