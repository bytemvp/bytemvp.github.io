# AGENT.md

## 项目概览

这是 Byte MVP 的个人博客与在线工具站，使用 Astro 构建，部署到 Cloudflare Workers。站点内容以 AI 资讯、开发者工具与工作流、科技行业观察为主，内容页面默认静态生成；在线工具页包含主要浏览器端交互，主题切换也在浏览器端运行。

- **框架**：Astro 5.16.2
- **语言**：TypeScript 5.9.3、Astro components、少量页面内联 JavaScript
- **样式**：Tailwind CSS 3.4.17 + PostCSS；共享设计 token 在 `src/styles/global.css`
- **内容**：Astro Content Collections，支持 Markdown 与 MDX
- **部署**：`@astrojs/cloudflare` + Wrangler 4，Cloudflare Workers 静态资源目录为 `dist/`
- **站点语言**：页面文案主要为简体中文；现有文章正文和 frontmatter 主要为英文
- **包管理**：npm，提交 `package-lock.json` 变更时保持锁文件同步

## 目录与职责

```text
src/
├── components/       # 全站共享组件：头部、导航、主题切换、元信息、页脚
├── content/blog/     # 博客 Markdown/MDX 文章
├── content.config.ts # blog 内容集合 loader 与 frontmatter schema
├── layouts/          # 文章/关于页共用布局
├── pages/            # 路由页面与 RSS endpoint
│   ├── index.astro   # 首页：hero、精选文章、最新文章
│   ├── blog/
│   │   ├── index.astro       # 文章列表
│   │   └── [...slug].astro   # 内容集合文章详情与静态路径
│   ├── about.astro   # 关于页，复用 BlogPost 布局
│   ├── tools.astro   # 浏览器端在线工具集合
│   └── rss.xml.js    # `/rss.xml` RSS endpoint
├── styles/global.css # Tailwind layers、主题变量、全局/共享组件样式
├── consts.ts         # SITE_TITLE、SITE_DESCRIPTION 等站点常量
└── env.d.ts          # Cloudflare Runtime/Env 类型声明
public/
├── fonts/            # Atkinson regular/bold 字体
└── ...               # favicon、文章占位图、关于页封面
```

根目录中的 `astro.config.mjs` 注册 Tailwind、MDX、Sitemap 与 Cloudflare adapter；`tailwind.config.mjs` 扫描 `src` 下的 Astro/HTML/JS/JSX/MD/MDX/TS/TSX 文件，并把 CSS 变量映射为 Tailwind token。`worker-configuration.d.ts` 是 Wrangler 类型生成文件，优先通过脚本更新，不要手工维护其大段内容。

`.history/` 保存历史快照，不是当前实现的源码入口；除非任务明确要求，不要编辑其中的备份文件。`openspec/changes/archive/` 保存已归档的设计驱动变更，不代表当前待实施任务。

## 本地命令

```bash
npm install                 # 安装依赖
npm run dev                 # Astro 开发服务器，默认 http://localhost:4321
npm run build               # 构建到 dist/
npm run preview             # 构建后以 wrangler dev 预览 Cloudflare Worker
npm run check               # astro build + tsc + wrangler deploy --dry-run
npm run cf-typegen          # 重新生成 worker-configuration.d.ts
npm run deploy              # 部署到 Cloudflare Workers，需要 Wrangler 登录/授权
```

当前 `package.json` 没有独立的 test、lint 或 format 脚本。交付前至少运行 `npm run check`；涉及视觉或浏览器交互的改动，还应运行 `npm run dev`（或 `npm run preview`）并实际检查对应路由。不要把 `dist/`、`.astro/`、`.wrangler/` 或本地环境文件提交进版本库。

## 开发约定

### 页面与组件

- 共享页面壳使用 `BaseHead`、`Header`、`Footer`；新增顶层路由应复用它们，确保主题初始化、元信息、导航和页脚一致。
- 文章详情与关于页使用 `src/layouts/BlogPost.astro`。该布局接收内容 frontmatter，并负责标题、描述、日期、标签、来源、hero 图和正文容器。
- 页面使用 Astro frontmatter 获取内容和生成静态数据；不要为本可静态生成的内容引入客户端框架或服务端状态。
- URL 使用现有路由约定：`/blog/<post.id>/`、`/tools`、`/about`。修改路由时同步检查导航链接、首页 CTA、RSS link 和 sitemap 行为。
- 交互组件应有可访问的语义 HTML、按钮类型、`aria-label`/隐藏说明和键盘可用性；保留现有 `zh-CN` 文档语言声明。
- `HeaderLink.astro` 依据当前 pathname 计算活动导航状态；新增导航项时按现有模式加入 `Header.astro`。

### 博客内容

`src/content.config.ts` 定义 `blog` 集合。每篇文章应放在 `src/content/blog/`，使用以下 frontmatter：

```yaml
---
title: "文章标题"
description: "用于卡片和 SEO 的摘要"
pubDate: "Aug 05 2025"
updatedDate: "Aug 06 2025" # 可选
heroImage: "/blog-placeholder-1.jpg" # 可选，来自 public 或可访问 URL
tags: ["Tag"]
sourceName: "来源名称" # 可选
sourceUrl: "https://example.com/source" # 可选，必须是合法 URL
---
```

`title`、`description`、`pubDate` 必填；`pubDate`/`updatedDate` 会被 coercion 为 `Date`；`tags` 缺省为空数组。首页、文章列表按 `pubDate` 倒序排列，首页第一篇是精选文章，后续最多显示四篇最新文章。文章详情通过 `getStaticPaths()` 生成，因此新增文章后必须完成一次构建验证。来源链接会以新窗口打开，并带 `rel="noreferrer"`。

### 样式与主题

- 优先使用 Tailwind utilities；共享或重复的视觉模式放在 `src/styles/global.css` 的 `@layer components`，不要在页面之间复制同一套 CSS。
- 设计 token 通过 CSS 变量维护：颜色、渐变、玻璃边框、阴影分别映射到 Tailwind 的 `accent`、`candy`、`mango`、`lime`、`aqua`、`bubble`、`ink` 与 shadow token。
- 主题由 `data-theme="light|dark"` 驱动。`BaseHead.astro` 在首次绘制前读取 `localStorage.theme`，没有用户选择时读取 `prefers-color-scheme`；`ThemeToggle.astro` 调用 `src/components/theme.ts` 持久化切换。
- 修改颜色、阴影或组件外观时必须同时检查浅色和深色主题，避免只改一个分支。不要绕过 `data-theme` 另建主题机制。
- 保持现有响应式原则：小屏优先堆叠，`md`/`lg` 再切换多列；内容宽度通常使用 `max-w-6xl`，正文使用 `max-w-3xl`。
- 本站使用本地 Atkinson 字体（`public/fonts/`），由 `global.css` 定义并由 `BaseHead.astro` preload；不要无必要地引入外部字体。

### 工具页

`src/pages/tools.astro` 是单页浏览器端工具集合，当前包含 JSON 格式化/压缩、URL 编解码、Base64 编解码、Unix 时间戳转换、UUID、随机密码和字数统计。工具计算不调用后端，使用原生 Web API（如 `TextEncoder`、`crypto.randomUUID`、`crypto.getRandomValues`、Clipboard API）。交互选择器通过 `data-*` 属性连接，新增工具时保持该模式并处理无效输入、复制失败及不支持 API 的降级路径。页面专属 `.tool-*` 样式留在该页面；跨页面复用的样式才应提升到全局样式。

## Cloudflare 与元信息注意事项

- `wrangler.json` 的 Worker 入口是 `./dist/_worker.js/index.js`，静态资源目录是 `./dist`，绑定名为 `ASSETS`，已启用 `nodejs_compat`、observability 和 source map 上传。
- `astro.config.mjs` 当前 `site` 仍是 `https://example.com`。若要上线真实域名，需同时更新该配置并检查 canonical、Open Graph、Twitter、Sitemap 与 RSS 地址；不要只改页面文字。
- Cloudflare 运行时类型通过 `src/env.d.ts` 接入 Astro `App.Locals`。新增 Worker binding 或环境变量时，先更新配置并运行 `npm run cf-typegen`，再修复类型错误。
- RSS 位于 `src/pages/rss.xml.js`，从 `blog` 集合生成文章链接；新增或修改 frontmatter 时检查 RSS 能否构建。

## OpenSpec 工作流

仓库采用 `spec-driven` OpenSpec 配置（`openspec/config.yaml`）。当前主要规范在 `openspec/specs/`，历史变更归档在 `openspec/changes/archive/`；仓库内未发现活跃的未归档变更目录。

当任务涉及新功能、页面结构、主题或行为契约时，优先遵循已有 spec；如果需求改变契约，应先更新/创建对应 OpenSpec artifact，再实现代码。`.github/skills/` 与 `.github/prompts/` 提供 explore、new、continue、apply、verify、archive 等流程提示。实施 OpenSpec 变更时：先读取 proposal/design/spec/tasks，上下文明确后再改代码，完成任务后同步更新 tasks 状态，最后运行 `npm run check`。

## 交付检查清单

1. 变更范围只覆盖当前源码和必要内容，未编辑 `.history/` 或生成产物。
2. 新页面复用了共享 head/header/footer，新增文章符合 collection schema。
3. 相关路由、导航、RSS、canonical/SEO 和静态路径没有遗漏。
4. 浅色、深色和移动端布局均已检查；交互改动已在浏览器执行成功路径和错误路径。
5. 运行 `npm run check`，确认 Astro 构建、TypeScript 检查和 Wrangler dry-run 均通过。
6. 若配置或环境类型改变，已运行 `npm run cf-typegen` 并检查生成类型；若部署相关变更，已核对 `wrangler.json`。
