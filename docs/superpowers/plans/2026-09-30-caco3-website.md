# CaCO3 服务器官网实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 CaCO3 MC 服务器构建纯前端官网：主页（Hero / 特性 / 画廊 / 时间线）+ 加入页（步骤 / QQ 二维码 / 复制群号），支持深浅主题。

**Architecture:** Vite + Vue 3 SPA，两个路由；内容与展示分离（`src/content.ts` 数据文件）；主题通过 `<html>.dark` 类切换，`useTheme` composable 管理三态（深→浅→自动）。

**Tech Stack:** Vue 3.5+（`<script setup>`）、Vite 7+、Tailwind CSS v4（`@tailwindcss/vite` 插件）、Vue Router 4、TypeScript、Playwright（验证用）。

**Spec:** `docs/superpowers/specs/2026-09-30-caco3-website-design.md`

## Global Constraints

- 本项目为纯静态展示站，**不引入测试框架**；每任务的验证 = `npm run build`（含 vue-tsc 类型检查）+ 浏览器（Playwright）实际检查（与已批准的 spec 第 6 节一致）。
- 文案与数据**全部集中在 `src/content.ts`**，组件不得硬编码文案；时间线文本按 `服务器介绍.md` **原文录入**（含待修正的九测日期）。
- 所有 `<img>` 必须带描述性 `alt`；深色用 `01~05.png`/`join.jpg`，浅色用 `*_light.png`/`join_light.jpg`。
- 主题三态循环顺序固定：**深 → 浅 → 自动**；手动选择存 `localStorage`（key: `caco3-theme`），`auto` 态清除该 key 并跟随系统。
- 依赖仅限：vue、vue-router、tailwindcss、@tailwindcss/vite、@vitejs/plugin-vue、vite、typescript、vue-tsc。不加 UI 库、动画库、图标库（图标内联 SVG）。
- 组件名 PascalCase，变量/函数 camelCase，关键逻辑留**简短中文注释**。
- 目录不是 git 仓库：git 初始化与提交步骤仅在用户批准后执行，否则跳过所有 Commit 步骤。

## Review Focus

1. **浅色模式素材成对切换**：任何一张图（尤其 QQ 二维码）在浅色模式下仍是深色版即为缺陷 → Task 2/6 的 Playwright 步骤逐图核对。
2. **auto 模式下系统主题实时变化**：切换系统深浅色，页面应即时跟随 → Task 2 Playwright 步骤用 `colorScheme` 仿真验证。
3. **复制群号在非安全上下文降级**：`navigator.clipboard` 不可用时不得抛未捕获错误，降级为手动复制提示 → Task 6 验证。
4. **窄屏无横向溢出、汉堡菜单可开合**：375px 宽度下检查 → Task 7 汇总验证。
5. **时间线 13 条按原文顺序渲染、十二测高亮**：多录/漏录/错位即缺陷 → Task 5 步骤核对条数与顺序。

---

### Task 1: 项目脚手架（Vite + Vue3 + TS + Tailwind v4 + Router）

**Files:**
- Create: `package.json`、`vite.config.ts`、`tsconfig.json`、`index.html`、`src/main.ts`、`src/App.vue`（临时占位）、`src/style.css`、`src/vite-env.d.ts`、`src/router/index.ts`
- Copy: 根目录 `images/*` → `src/assets/images/`（原 `images/` 保留不动）

**Interfaces:**
- Produces: 可构建运行的空壳应用；路由表含 `/`(HomeView) 与 `/join`(JoinView)（两视图此任务为占位组件）；`src/style.css` 含 Tailwind 引入与 dark 变体配置，后续所有任务依赖。

- [ ] **Step 1: 脚手架与依赖安装**

```powershell
npm create vite@latest . -- --template vue-ts
npm install
npm install vue-router@4
npm install -D tailwindcss @tailwindcss/vite
```

注意：当前目录已有 `docs/`、`images/`、`*.md`，create-vite 若拒绝非空目录，则改为在临时子目录生成后把脚手架文件并入当前目录。

- [ ] **Step 2: 配置 Tailwind v4 与 dark 类变体**

`vite.config.ts` 引入 `@tailwindcss/vite` 插件；`src/style.css` 顶部：

```css
@import "tailwindcss";
/* v4 默认 dark: 走媒体查询，这里改为类切换策略 */
@custom-variant dark (&:where(.dark, .dark *));
```

- [ ] **Step 3: 建立路由与占位视图**

`src/router/index.ts`：`createWebHistory`，路由 `/` → `HomeView.vue`、`/join` → `JoinView.vue`，均先输出一行占位文字；`scrollBehavior` 返回 `{ top: 0 }`。

- [ ] **Step 4: 验证构建与运行**

Run: `npm run build`
Expected: 类型检查 + 构建通过（若 `package.json` 无 `build` 里的 vue-tsc，补上 `"build": "vue-tsc -b && vite build"`）。

Run: `npm run dev`，浏览器打开确认占位页与 `/join` 路由可访问后停止。

- [ ] **Step 5: Commit（需用户已批准 git）**

```bash
git init && git add -A && git commit -m "chore: scaffold vite vue-ts project with tailwind v4 and router"
```

---

### Task 2: 内容数据 + 主题系统 + 应用外壳（NavBar/Footer/主题切换）

**Files:**
- Create: `src/content.ts`、`src/composables/useTheme.ts`、`src/components/NavBar.vue`、`src/components/SiteFooter.vue`
- Modify: `src/App.vue`（装入 NavBar/页脚/RouterView）

**Interfaces:**
- Produces（后续任务按此调用，签名不可变）:
  - `useTheme(): { mode: Ref<'light'|'dark'|'auto'>; isDark: ComputedRef<boolean>; cycleMode: () => void }`
  - `content.ts` 导出：
    - `serverInfo = { name: 'CaCO3', slogan: string, description: string }`
    - `features: { icon: string; title: string; desc: string }[]`（4 项：纯净生存/超低门槛/官方整合包/Terralith）
    - `gallery: { dark: string; light: string; alt: string }[]`（5 项，图片用 `import` 引入 assets）
    - `timeline: { name: string; period: string; current?: boolean }[]`（13 项，按原文顺序，`十二测` 带 `current: true`，period 为原文如 `'2021年12月～2022年7月'`）
    - `qq = { group: '951244608', ipTip: '服务器IP：请从QQ群获取' }`

- [ ] **Step 1: 迁移素材并编写 `src/content.ts`**

图片 import 写法：`import img01 from '../assets/images/01.png'`；`gallery` 每项 `dark`/`light` 成对；`timeline` 13 项**逐字**取自 `服务器介绍.md`。

- [ ] **Step 2: 实现 `useTheme.ts`**

逻辑：初始化读 `localStorage['caco3-theme']`，无则 `'auto'`；`isDark` = mode==='dark' 或 (mode==='auto' 且 `matchMedia('(prefers-color-scheme: dark)')` 命中)；`watchEffect` 同步 `document.documentElement.classList.toggle('dark', isDark)`；`auto` 态监听系统 `change` 事件实时更新；`cycleMode` 按 深→浅→自动 循环，`auto` 时清除 localStorage。

- [ ] **Step 3: 实现 NavBar（透明→毛玻璃、汉堡菜单、主题按钮）与 SiteFooter**

NavBar：`window` scroll 监听，`> 8px` 后加 `backdrop-blur bg-white/70 dark:bg-slate-900/70`；左侧站名 `CaCO3`，中间/抽屉内 `主页`、`加入我们` RouterLink；右侧主题循环按钮（图标按 mode 显示月亮/太阳/半圆，内联 SVG）。SiteFooter：QQ 群号 + 版权行。

- [ ] **Step 4: 组装 App.vue 并验证**

Run: `npm run build` → 通过。
Playwright：点击主题按钮三次依次 深→浅→自动，`html` 的 `dark` 类随之增减；浅色下截图素材仍为深色版（素材对切换在 Task 3+ 组件内才生效，此处仅验证类切换与按钮循环）；切换系统 colorScheme 时 auto 态实时跟随；`/join` 可导航。

- [ ] **Step 6: Commit（需批准）**

```bash
git add -A && git commit -m "feat: content data, theme system with 3-state toggle, app shell"
```

---

### Task 3: HomeView 之 HeroSection + FeatureGrid

**Files:**
- Create: `src/components/HeroSection.vue`、`src/components/FeatureGrid.vue`
- Modify: `src/views/HomeView.vue`（替换占位，组装两个 section）

**Interfaces:**
- Consumes: `content.ts` 的 `serverInfo`、`features`、`gallery[0]`（Hero 背景图按 `isDark` 取 `dark`/`light` 版）；`useTheme()` 的 `isDark`。
- Produces: `HeroSection` 内「了解更多」按钮锚点 `#features`；`FeatureGrid` 根元素 `id="features"`。

- [ ] **Step 1: HeroSection**

满屏 `min-h-screen` 背景 `gallery[0]` + 底部渐变遮罩（`bg-gradient-to-t from-black/70`，浅色模式换白系遮罩）；居中大标题 `serverInfo.name` + slogan；按钮「加入我们」→ `RouterLink to="/join"`（实心橙）、「了解更多」→ `href="#features"` 平滑滚动（`scroll-behavior: smooth`）。

- [ ] **Step 2: FeatureGrid**

`id="features"`，`py-24`；手机 1 列、`md:grid-cols-2`、`lg:grid-cols-4`；毛玻璃卡片 `rounded-2xl` + hover 边框微亮；`icon` 用内联 SVG（按 content.ts 的 icon 名映射）。

- [ ] **Step 3: 验证**

Run: `npm run build` → 通过。
Playwright：两主题下 Hero 背景与文字可读；「了解更多」滚动到特性区；4 张卡片渲染无缺字。

- [ ] **Step 4: Commit（需批准）**

```bash
git add -A && git commit -m "feat: hero section and feature grid"
```

---

### Task 4: HomeView 之 GallerySection + LightboxModal

**Files:**
- Create: `src/components/GallerySection.vue`、`src/components/LightboxModal.vue`
- Modify: `src/views/HomeView.vue`（追加画廊 section）

**Interfaces:**
- Consumes: `content.ts` 的 `gallery`；`useTheme()` 的 `isDark`（选 dark/light 图）。
- Produces: `LightboxModal` props `{ src: string; alt: string }`，emit `close`；由 `GallerySection` 用 `ref` 控制 open/close。

- [ ] **Step 1: GallerySection**

手机 1 列、`sm:grid-cols-2`、`lg:grid-cols-3`；图片 `rounded-2xl`，hover `scale-[1.02]` + 上浮阴影；`loading="lazy"`；点击设置当前项并打开 Lightbox。

- [ ] **Step 2: LightboxModal**

`Teleport to body`：全屏黑底 `bg-black/80`、居中大图、右上关闭按钮；`onMounted` 加 `keydown` 监听（ESC → close）并 `document.body.style.overflow='hidden'`，`onUnmounted` 还原；焦点移入弹层、Tab 圈定（简单实现：监听 Tab 在弹层内两个焦点元素间循环）。

- [ ] **Step 3: 验证**

Run: `npm run build` → 通过。
Playwright：点击任一图打开弹层；ESC/点背景/点关闭按钮均可关闭；弹层打开时页面不滚动；浅色模式下画廊与弹层内为 `_light` 版图片。

- [ ] **Step 4: Commit（需批准）**

```bash
git add -A && git commit -m "feat: screenshot gallery with lightbox modal"
```

---

### Task 5: HomeView 之 TimelineSection

**Files:**
- Create: `src/components/TimelineSection.vue`
- Modify: `src/views/HomeView.vue`（追加时间线 section）

**Interfaces:**
- Consumes: `content.ts` 的 `timeline`。

- [ ] **Step 1: TimelineSection**

标题「服务器历程」；左侧竖线 + 圆点布局（手机与桌面同构，内容右侧卡片化）；`current: true` 项圆点用点缀色高亮 + 「进行中」小徽标；13 条按数组顺序渲染，period 原文显示。

- [ ] **Step 2: 验证**

Run: `npm run build` → 通过。
Playwright：计数 `.timeline-item` = 13；最后一项（十二测）含「进行中」徽标；抽查一测/补测文本与 `服务器介绍.md` 一致。

- [ ] **Step 3: Commit（需批准）**

```bash
git add -A && git commit -m "feat: server history timeline section"
```

---

### Task 6: JoinView（步骤 + 二维码 + 复制群号）

**Files:**
- Create: `src/views/JoinView.vue`（替换占位）

**Interfaces:**
- Consumes: `content.ts` 的 `qq`、`serverInfo`；`useTheme()` 的 `isDark`（选 `join.jpg`/`join_light.jpg`）。

- [ ] **Step 1: 页面实现**

三步卡片（大数字 1/2/3：下载 MC 1.21.11 → 原版加 IP → QQ 群下载整合包）；右侧二维码卡片（图按主题切换，`alt="CaCO3服务器交流群二维码"`）+「复制群号」按钮：`navigator.clipboard.writeText` 成功显示「已复制」，失败（非安全上下文等）`try/catch` 降级为提示文字「请手动复制群号：951244608」；下方注明 IP 从 QQ 群获取。

- [ ] **Step 2: 验证**

Run: `npm run build` → 通过。
Playwright：点击复制按钮出现「已复制」（Playwright 环境授予剪贴板权限）；浅色模式二维码为 `join_light.jpg`；三步布局手机单列。

- [ ] **Step 3: Commit（需批准）**

```bash
git add -A && git commit -m "feat: join page with steps, qr code and copy group number"
```

---

### Task 7: 全站汇总验证与收尾

**Files:**
- Modify: 仅在发现问题时修复（预期为微调间距/响应式类）

- [ ] **Step 1: 全页 Playwright 巡检**

`npm run build` 通过后 `npm run dev`，一次跑完全部检查项：两页加载与控制台零报错；主题三态循环 + 素材成对切换（含二维码）；画廊弹层全交互；复制按钮；375px 窄屏：汉堡菜单开合、无横向滚动条、画廊单列；键盘：Tab 遍历导航/按钮、Lightbox ESC 关闭、焦点圈定。

- [ ] **Step 2: 修复巡检发现的问题并复跑**

Run: `npm run build` 与巡检步骤，直至全绿。

- [ ] **Step 3: 最终 Commit（需批准）**

```bash
git add -A && git commit -m "feat: responsive polish and final verification pass"
```

---

## Self-Review 记录

- **Spec coverage:** Hero/特性/画廊/时间线/加入页/主题/响应式/边界情况 → Task 2~7 一一对应；spec 第 7 节待确认事项落在 Global Constraints（原文录入）。
- **Step scan:** 每步均为单一动作（写某文件/跑某命令/某项浏览器核对），无 "处理边界情况" 类空话。
- **Type consistency:** `useTheme` 与 `content.ts` 五个导出在 Task 2 定义后，Task 3~6 引用名一致。
- **Review Focus:** 5 项均落到了所属任务的验证步骤。
- **Proportion:** 计划以决策与验证为主，无组件代码转写。
