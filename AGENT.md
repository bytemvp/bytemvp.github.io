# AGENT.md

## 项目概览

这是 Byte MVP 的产品官网：单页静态站点，只包含一个首页，用于展示 Byte MVP 的产品（当前为 Night Rest／夜息）。使用 Astro 构建，纯静态输出，可部署到 GitHub Pages 与 Cloudflare Pages。

- **框架**：Astro 5.16.2
- **语言**：TypeScript 5.9.3、Astro components、少量页面内联 JavaScript
- **样式**：Tailwind CSS 3.4.17 + PostCSS；共享设计 token 在 `src/styles/global.css`
- **部署**：纯静态输出（Astro static），构建产物目录为 `dist/`；GitHub Pages 由 `.github/workflows/deploy.yml` 自动发布，Cloudflare Pages 在控制台配置构建命令
- **站点语言**：页面文案为简体中文
- **包管理**：npm，提交 `package-lock.json` 变更时保持锁文件同步

## 目录与职责

```text
src/
├── components/       # 全站共享组件：头部、主题切换、元信息、页脚
├── data/
│   └── tools.json    # AI 工具精选数据源
├── pages/
│   ├── index.astro        # 首页：hero 与产品介绍
│   └── tools/
│       └── index.astro    # 访客端：AI 工具精选页面（分类、搜索、卡片网格，纯静态构建）
├── styles/global.css # Tailwind layers、主题变量、全局/共享组件样式
├── consts.ts         # SITE_TITLE、SITE_DESCRIPTION 等站点常量
└── env.d.ts          # Astro 客户端类型引用
public/
├── fonts/            # Atkinson regular/bold 字体
├── tools-icons/      # AI 工具的高清图标缓存
└── ...               # favicon、图片资源
scripts/
└── add-tool.mjs      # 自动抓取网页元数据与图标并录入 tools.json 的 CLI 工具
```

根目录中的 `astro.config.mjs` 注册 Tailwind、Sitemap，并设置 `site` 为 GitHub Pages 域名；`tailwind.config.mjs` 扫描 `src` 下的 Astro/HTML/JS/JSX/MD/MDX/TS/TSX 文件，并把 CSS 变量映射为 Tailwind token。

`.history/` 保存历史快照，不是当前实现的源码入口；除非任务明确要求，不要编辑其中的备份文件。

## 本地命令

```bash
npm install                 # 安装依赖
npm run dev                 # Astro 开发服务器，默认 http://localhost:4321
npm run build               # 静态构建到 dist/
npm run preview             # 本地预览构建产物
npm run check               # astro build + tsc
```

当前 `package.json` 没有独立的 test、lint 或 format 脚本。交付前至少运行 `npm run check`；涉及视觉或浏览器交互的改动，还应运行 `npm run dev`（或 `npm run preview`）并实际检查对应路由。不要把 `dist/`、`.astro/`、`.wrangler/` 或本地环境文件提交进版本库。

## 开发约定

### 页面与组件

- 共享页面壳使用 `BaseHead`、`Header`、`Footer`；站点只有一个首页，新增内容优先扩展首页分区，而不是新增路由。
- 产品数据（名称、简介、特性、链接）集中在 `src/pages/index.astro` 的 frontmatter 中维护，修改文案直接改该对象。
- 外部链接统一使用 `target="_blank" rel="noreferrer"` 新窗口打开。
- 交互组件应有可访问的语义 HTML、按钮类型、`aria-label`/隐藏说明和键盘可用性；保留现有 `zh-CN` 文档语言声明。

### 样式与主题

- 优先使用 Tailwind utilities；共享或重复的视觉模式放在 `src/styles/global.css` 的 `@layer components`，不要在页面之间复制同一套 CSS。
- 设计 token 通过 CSS 变量维护：颜色、渐变、玻璃边框、阴影分别映射到 Tailwind 的 `accent`、`candy`、`mango`、`lime`、`aqua`、`bubble`、`ink` 与 shadow token。
- 主题由 `data-theme="light|dark"` 驱动。`BaseHead.astro` 在首次绘制前读取 `localStorage.theme`，没有用户选择时读取 `prefers-color-scheme`；`ThemeToggle.astro` 调用 `src/components/theme.ts` 持久化切换。
- 修改颜色、阴影或组件外观时必须同时检查浅色和深色主题，避免只改一个分支。不要绕过 `data-theme` 另建主题机制。
- 保持现有响应式原则：小屏优先堆叠，`sm`/`md`/`lg` 再切换多列；内容宽度通常使用 `max-w-6xl`，正文使用 `max-w-3xl`。
- 本站使用本地 Atkinson 字体（`public/fonts/`），由 `global.css` 定义并由 `BaseHead.astro` preload；不要无必要地引入外部字体。

## 部署与元信息注意事项

- 站点为纯静态输出，构建产物在 `dist/`；GitHub Pages 部署走 `.github/workflows/deploy.yml`（push 到 `main` 触发），Cloudflare Pages 在控制台连接仓库并设置 Build command 为 `npm run build`、输出目录为 `dist`。
- `astro.config.mjs` 的 `site` 为 `https://bytemvp.github.io`。若改用自定义域名，需同步更新该配置并检查 canonical、Open Graph、Twitter 与 Sitemap 地址；不要只改页面文字。
- 不要引入任何需要服务端运行时的依赖（adapter、binding、环境变量等），GitHub Pages 只能托管静态文件。

## 交付检查清单

1. 变更范围只覆盖当前源码和必要内容，未编辑 `.history/` 或生成产物。
2. 页面复用了共享 head/header/footer；外部链接带 `rel="noreferrer"`。
3. canonical/SEO 与 sitemap 行为没有遗漏。
4. 浅色、深色和移动端布局均已检查；交互改动已在浏览器执行成功路径和错误路径。
5. 运行 `npm run check`，确认 Astro 构建与 TypeScript 检查均通过。
6. 若部署相关变更，已核对 `.github/workflows/deploy.yml` 与静态构建配置。
