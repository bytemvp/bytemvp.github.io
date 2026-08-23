## 1. 调色板与 Token

- [x] 1.1 重定义 `src/styles/global.css` `:root` 浅色调色板为小清新配色（paper/paper-deep/accent/accent-dark/ink/gray*/阴影/glass/hero-gradient，见 design D2）
- [x] 1.2 重定义 `[data-theme="dark"]` 深色调色板为冷青灰系（design D3）
- [x] 1.3 更名语义 token：`cinnabar→mint`、`indigo→sky`、`jade→leaf`、`wash→mist`（CSS 变量 + `tailwind.config.mjs` 映射）

## 2. 组件与页面迁移

- [x] 2.1 迁移 `Header.astro` 圆点、`Footer.astro`、`HeaderLink.astro`、`ThemeToggle.astro` 中的旧 token 类名至新命名
- [x] 2.2 迁移 `about.astro`（`bg-wash`）、`blog/index.astro`（`cardColors` 数组）中的旧 token
- [x] 2.3 更新 `global.css` 组件层：blockquote 边框/渐变、`.gradient-text`、`.hero-shell::before` 光斑改用 sky/mint
- [x] 2.4 清理 `tools.astro` 硬编码色：朱砂焦点环改薄荷 rgba、暖调内阴影改冷调、focus 描边改 sky
- [x] 2.5 代码块底色改冷青灰 `#182124` / 文字 `#dbe7e5`（保留深色代码块契约）

## 3. 验证

- [x] 3.1 grep 校验旧 token 引用归零（`cinnabar|indigo|jade|--wash\b`）
- [x] 3.2 核验对比度：浅/深主题下正文链接与按钮文字 ≥4.5:1，不达标则按 design 备选值加深
- [x] 3.3 构建并浏览器目检全部路由（首页/文章列表/文章页/关于/工具）双主题表现，确认无水墨残留观感且布局无回归
- [x] 3.4 运行 `openspec validate fresh-minimal-redesign` 通过
