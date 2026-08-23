## Why

站点当前采用"中国水墨风"视觉语言（米纸色背景、朱砂红点缀、厚重阴影），整体偏沉稳。用户希望改为**小清新**风格——明亮通透的底色、柔和的青绿/天蓝点缀、轻盈的留白与圆角——同时保持页面整洁有序。

## What Changes

- 将 CSS 变量调色板（`src/styles/global.css` 的 `:root` 与 `[data-theme="dark"]`）从小清新方向重定义：纸白/薄荷绿/天空蓝系浅色主题，深色主题同步调整为低饱和冷色调
- 更新 Tailwind 语义 token（`tailwind.config.mjs`）以匹配新变量命名（如需要）
- 调整全局组件样式（header、footer、按钮、卡片、hero 渐变、阴影）为更轻、更透的气质：更浅的阴影、更柔和的边框、更大的留白感
- 保持现有信息架构、布局结构、深色模式切换（`ThemeToggle` / `theme-system`）行为不变
- **不改变**任何页面功能、内容或路由

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `theme-styling`: 视觉语言要求从 "Chinese Ink Visual Language" 改为 "Fresh Minimal Visual Language"——配色从纸墨/朱砂系改为清新浅色系（薄荷绿/天空蓝/纸白），阴影与渐变从厚重改为轻透；深色主题对比度、双主题组件适配、主题切换图标等其余要求保留并沿用新配色

## Impact

- **代码**: `src/styles/global.css`（核心，CSS 变量与组件层）、`tailwind.config.mjs`（token 映射）、各 `.astro` 组件中引用旧语义色的类名（Header/Footer/HeaderLink/ThemeToggle/index/about/blog/tools 页面按需微调）
- **规格**: `openspec/specs/theme-styling/spec.md` 需求级修改
- **不受影响**: 布局结构（home-page-* / about-page-* specs）、响应式（responsive-layout）、主题切换机制（theme-system）、Tailwind 集成方式
