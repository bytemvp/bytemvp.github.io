## Context

站点为 Astro + Tailwind 静态站。当前视觉是"中国水墨风"：所有颜色经 `src/styles/global.css` 的 CSS 变量（`:root` / `[data-theme="dark"]`）定义，`tailwind.config.mjs` 将其映射为语义 token（`paper`/`ink`/`accent`/`cinnabar`/`indigo`/`jade`/`wash` 等），组件只消费变量与 token。深浅主题切换机制（`theme-system`，`data-theme="dark"` 属性选择器）已存在且不在本次范围。

颜色消费点分布：
- `global.css`：变量定义、blockquote、`.surface-card`/`.hero-shell`/`.gradient-text`/`.neon-pill`/`.cta-*`/`.lift-card`、代码块（硬编码 `#292522`/`#f4ecdc`）
- 组件类名引用 token：`Header.astro`（`bg-cinnabar` 圆点）、`Footer.astro`、`HeaderLink.astro`、`ThemeToggle.astro`（均用 `bg-paper*`/`text-ink*`/`border-accent`）
- 页面：`about.astro`（`bg-wash`）、`blog/index.astro`（`cardColors = ["bg-paper-deep","bg-wash","bg-paper","bg-jade","bg-indigo"]`）、`tools.astro` 内嵌 `<style>`（含硬编码 `rgba(156,47,47,…)` 焦点环、`rgba(234,225,210,…)` 内阴影）
- `BlogPost.astro` 布局仅用中性 token

## Goals / Non-Goals

**Goals:**
- 仅通过重定义 CSS 变量值 + 少量组件级微调，把视觉语言从小清新方向重着色：纸白冷调底色、薄荷绿主点缀、天空蓝次点缀、轻阴影、柔和渐变
- 深色主题同步换为低饱和冷色调（深青灰底 + 柔和薄荷/天蓝点缀），保持 ≥4.5:1 文本对比度
- 清理水墨命名残留：token 更名为清新语义，所有消费点一次性迁移，不留旧别名

**Non-Goals:**
- 不改布局结构、间距体系、路由、内容（`home-page-*`/`about-page-*`/`responsive-layout` specs 不动）
- 不改主题切换机制与持久化逻辑（`theme-system`）
- 不引入新依赖、不改字体（Atkinson 保留）
- 不做圆角/阴影体系的全面重构——只在现有 token 值内调轻

## Decisions

### D1: 保留 CSS 变量架构，只换值
所有组件已通过 `var(--*)` 与 Tailwind 语义 token 消费颜色，重定义 `:root`/`[data-theme="dark"]` 的值即可完成 90% 改版。这是最小且最不易漏的路径；备选方案（每组件写死新色）被否决——会破坏双主题一致性。

### D2: 新调色板（light）
| Token | 新值 | 说明 |
|---|---|---|
| `--paper` | `#f7fbfa` | 冷调纸白 |
| `--paper-deep` | `#e8f2ef` | 浅雾绿灰面 |
| `--accent-dark` | `#20705d` | hover/链接深态 |
| `--mint`（原 `cinnabar`） | `#3fc79f` | 装饰圆点、引用边 |
| `--sky`（原 `indigo`） | `#5f93b8` | 渐变副色、focus 描边 |
| `--leaf`（原 `jade`） | `#86b96a` | 博客卡片装饰底 |
| `--wash` → `--mist` | `#ddeeea` | 卡片浅底 |
| `--ink` | `42,54,58` | 冷调墨灰文本 |
| `--ink-muted` | `110,126,130` | 次级文本 |
| 阴影 | 透明度降至 0.06–0.08，扩散收窄 | "轻"感来源 |
| `--hero-gradient` | 天蓝→纸白→薄荷的 12% 低透明渐变 | 替代米黄+朱砂 |

### D3: 新调色板（dark，冷青灰系）
`--paper:#11191b`、`--paper-deep:#1b272a`、`--accent:#57c4a4`、`--accent-dark:#8adcc4`、`--mint:#4fbf9c`、`--sky:#87b3d4`、`--leaf:#9cbf82`、`--mist:#223134`、`--ink:225,232,233`、`--gray*` 相应冷化。accent-on-dark 用于按钮时配深色文字保证对比度。

### D4: 水墨命名 token 一次性更名
`cinnabar→mint`、`indigo→sky`、`jade→leaf`（`wash→mist`）。同步更新 `tailwind.config.mjs` 映射与全部消费点（`Header.astro` 圆点、`blog/index.astro` `cardColors`、`about.astro`、`global.css` blockquote、`tools.astro` focus 描边）。不做兼容别名——站点小，直接清除断裂面。

### E: 硬编码色清理
- `tools.astro`: `rgba(156,47,47,.16)` 焦点环改为薄荷色 `rgba(47,158,131,.18)`（dark 态用 `rgba(87,196,164,.22)`）；`rgba(234,225,210,…)` 内阴影改冷调
- `global.css` 代码块 `#292522`/`#f4ecdc` 改为冷青灰 `#182124`/`#dbe7e5`，保留"深色代码块"契约（theme-styling spec 要求）
- `.hero-shell::before` 径向光斑由 indigo/cinnabar 改 sky/mint 低透明值
- `.gradient-text` 改 `linear-gradient(135deg, var(--accent), var(--sky))`

## Risks / Trade-offs

- **改名遗漏**：token 更名涉及 6+ 文件；以 grep `cinnabar|indigo|jade|--wash` 归零为完成标准。
- **观感主观性**：色值为初稿方向（薄荷绿为主），浏览器逐页目检后可微调 hex，不影响结构。
- **对比度风险**：薄荷绿在白底上偏亮，初稿 `#2f9e83` 白字仅 3.31:1；已加深至 `#248065`（白字 4.83:1、纸底文字 4.63:1），深色主题 8.35:1，全部达标（WCAG AA）。
