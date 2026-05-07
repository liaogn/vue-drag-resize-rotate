# Changelog

## 2.0.0 (2026-05-08)

### 💥 BREAKING CHANGES

- **仅支持 Vue 3**。Vue 2 用户请继续使用 [`^1.x`](https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate/v/1.2.0) 版本。
- **构建工具迁移**：`vue-cli-service` → Vite + TypeScript 5。源码全量 TS 化。
- **移除老的 cursor 扩展点**：不再支持通过 `Vue.prototype.$stickHoverRender` / `mixins` / `extends` 注入自定义 cursor。改为 `stick-hover-render` prop。
- **样式 API 变更**：所有内部 class 的颜色 / 尺寸 / 阴影改由 [CSS 变量](https://liaogn.github.io/vue-drag-resize-rotate/guide/theming) 驱动。如果你之前覆写过 `.vdr-stick { ... }` 等 class，改为覆写 `--vdr-*` 变量。
- **包入口变更**：`main` 从 `lib/VueDragResizeRotate.common.js` 改为 `dist/index.umd.cjs`，新增 `module` (ESM)、`types`、`exports` 字段。请使用 `import VueDragResizeRotate from '@liaogn/vue-drag-resize-rotate'` 与 `import '@liaogn/vue-drag-resize-rotate/style.css'`。
- **License 变更**：`ISC` → `MIT`。

### ✨ Features

- **完整 TypeScript 类型支持**：随包发 `.d.ts`，所有 props / events / 工具函数有完整类型定义。
- **CSS 变量主题**：14 个 `--vdr-*` 变量可独立覆写，无需 override class 即可换肤；支持运行时动态切换主题。
- **核心逻辑解耦**：所有几何计算 / 控制器 (`RectDrager` / `RectRotator` / `RectFliper`) / cursor 渲染都抽到 [`core/`](./src/core)，框架无关，便于后续做 Vue 2.x 兼容包或 React 版本。
- **新文档站**：基于 VitePress 的中英双语文档站，每个示例可交互、可查看源码：[liaogn.github.io/vue-drag-resize-rotate](https://liaogn.github.io/vue-drag-resize-rotate/)
- **changesets 工程化**：版本号与 CHANGELOG 自动管理。

### 🐛 Bug Fixes

- 修复 `calcLineSlope` 在两点重合（NaN）时引用未定义的 `this.rad` 字段，曾导致斜率计算分支不可达。改为返回 0，由外层 `isFinite` 兜底。
- 修复 `calcBorderLineEquation` 返回值在 `targetAxis` 不匹配时返回 `undefined`，类型推断不准。改为明确返回 NaN 并标注函数签名。

### 📦 内部改动

- 旧的 `vue-cli` 脚手架与历史 demo 已归档到仓库的 [`legacy/`](./legacy) 目录作参照。
- ESLint 升级到 v9，使用 `@vue/eslint-config-typescript`。
- 包管理器固定为 pnpm（仓库内禁止 npm / yarn 的 lock 文件）。

### 🔄 迁移指南（v1 → v2）

#### 1. 框架要求

```diff
- "vue": "^2.6.x"
+ "vue": "^3.3.0"
```

#### 2. 安装方式

```ts
// v1
import Vue from 'vue'
import vdr from '@liaogn/vue-drag-resize-rotate'
Vue.use(vdr)

// v2
import { createApp } from 'vue'
import vdr from '@liaogn/vue-drag-resize-rotate'
import '@liaogn/vue-drag-resize-rotate/style.css'  // ⬅ 必须显式引入

createApp(App).use(vdr).mount('#app')
```

#### 3. 自定义 cursor

```diff
- // v1：通过 mixins / Vue.prototype 注入
- Vue.prototype.$stickHoverRender = (cursorRotate) => ({ ... })

+ // v2：作为 prop 传入
+ <vdr :stick-hover-render="myRender" />
```

#### 4. 自定义样式

```diff
- /* v1: override class */
- .vdr-stick { background: transparent; }

+ /* v2: 覆写变量 */
+ .vdr { --vdr-stick-bg: transparent; }
```

完整变量表见 [主题定制](https://liaogn.github.io/vue-drag-resize-rotate/guide/theming)。

---

## 1.2.0 及更早

历史版本基于 Vue 2，参见 [v1 文档](https://github.com/liaogn/vue-drag-resize-rotate/blob/v1/README.md)（待整理 tag）。
