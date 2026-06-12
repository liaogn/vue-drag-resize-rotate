# vue-drag-resize-rotate

[![npm version](https://img.shields.io/npm/v/@liaogn/vue-drag-resize-rotate?style=flat-square&color=42b883)](https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate)
[![npm downloads](https://img.shields.io/npm/dm/@liaogn/vue-drag-resize-rotate?style=flat-square)](https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate)
[![license](https://img.shields.io/npm/l/@liaogn/vue-drag-resize-rotate?style=flat-square)](./LICENSE)
[![ci](https://img.shields.io/github/actions/workflow/status/liaogn/vue-drag-resize-rotate/ci.yml?branch=master&style=flat-square)](https://github.com/liaogn/vue-drag-resize-rotate/actions)

> 面向 Vue 3 的拖拽 / 缩放 / 旋转组件，适合图片标注、海报编辑、低代码画布、可视化搭建器等需要矩形编辑能力的场景。

[文档站](https://liaogn.github.io/vue-drag-resize-rotate/) · [English](https://liaogn.github.io/vue-drag-resize-rotate/en/) · [React 版](https://liaogn.github.io/react-drag-resize-rotate/) · [Changelog](./CHANGELOG.md)

## 功能亮点

- 🎯 **支持拖拽 / 缩放 / 旋转**：支持在画布中自由移动元素、通过 8 个方向触点调整尺寸，并进行 360° 自由旋转。
- 🔁 **支持锁定宽高比例 / 翻转 / 尺寸与边界限制**：支持按固定比例缩放、拖拽触点自由翻转，并限制元素最小 / 最大宽高和画布活动范围。
- 🧲 **支持拖拽吸附 / 网格 / 旋转步进**：支持吸附父容器、同级元素、自定义参考线、网格，并可按固定角度吸附旋转。
- 🧱 **支持嵌套编辑 / 插槽承载**：支持父子元素多层嵌套，可通过插槽放入任意内容，也支持通过数据配置渲染节点。
- 📱 **支持移动端单指操作**：基于 Pointer Events 兼容鼠标、触摸笔和移动端单指拖拽 / 缩放 / 旋转。
- 🎛️ **支持编辑模式控制**：支持切换只读、仅拖拽、仅缩放、禁止旋转、隐藏控件等模式。
- 🎨 **支持样式定制**：支持自定义触点、轮廓、旋转线、尺寸、阴影和光标图案。
- 📦 **支持轻量接入**：仅依赖 Vue 3，支持全局插件安装和单组件引入，样式按需手动加载。

## 适合什么场景

- 图片标注、截图标记、裁剪框调整等轻量编辑工具
- 海报、贴纸、封面图、营销素材等 Web 可视化编辑器
- 低代码搭建器、大屏编辑器、表单设计器中的自由布局节点
- 需要组合元素、嵌套容器、成组编辑的画布类应用
- 需要将编辑结果保存为 JSON Schema 或远端配置的业务系统

## 安装

```bash
pnpm add @liaogn/vue-drag-resize-rotate
# 或
npm install @liaogn/vue-drag-resize-rotate
```

## 快速使用

```ts
// main.ts
import { createApp } from 'vue'
import VueDragResizeRotate from '@liaogn/vue-drag-resize-rotate'
import '@liaogn/vue-drag-resize-rotate/style.css'
import App from './App.vue'

createApp(App).use(VueDragResizeRotate).mount('#app')
```

```vue
<template>
  <vdr :w="200" :h="150" :x="50" :y="50" @dragging="onChange">
    <div>drag · resize · rotate</div>
  </vdr>
</template>

<script setup lang="ts">
function onChange(pos: { x: number; y: number; w: number; h: number; r: number }) {
  console.log(pos)
}
</script>
```

完整 API 见 [Props](https://liaogn.github.io/vue-drag-resize-rotate/guide/props) · [Events](https://liaogn.github.io/vue-drag-resize-rotate/guide/events) · [Slots](https://liaogn.github.io/vue-drag-resize-rotate/guide/slots) · [边界限制](https://liaogn.github.io/vue-drag-resize-rotate/guide/boundary)。

## 核心能力

### 拖拽、缩放、旋转

组件默认展示 8 个缩放触点和 1 个旋转触点：

- 四角触点用于同时改变宽高
- 四边中点触点用于单轴缩放
- `angle` 触点用于旋转
- `sticks` 可传入触点白名单，例如只保留四角缩放，或隐藏旋转控件

交互过程中会触发 `activated`、`dragStart` / `dragging` / `dragStop`、`resizeStart` / `resizing` / `resizeStop`、`rotateStart` / `rotating` / `rotateStop`、`fliped` 等事件。所有事件回调都会拿到同一份 `pos` 数据：

```ts
interface PosData {
  uuid: string | number
  x: number
  y: number
  w: number
  h: number
  r: number
  z: number | string
  stick: '' | 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml' | 'angle'
  lock: boolean
  active: boolean
  flipSign: '' | '+' | '-'
}
```

### 受控更新

`x`、`y`、`w`、`h`、`r`、`z` 都会响应外部 prop 更新，因此可以把组件作为受控节点使用：

```vue
<vdr
  :x="rect.x"
  :y="rect.y"
  :w="rect.w"
  :h="rect.h"
  :r="rect.r"
  @dragging="onUpdate"
  @resizing="onUpdate"
  @rotating="onUpdate"
/>
```

这让你可以把用户操作实时写回 Pinia、JSON 配置、后端接口或编辑器历史栈。

### 交互开关与约束

```vue
<vdr
  :w="240"
  :h="160"
  :x="40"
  :y="40"
  :lock="true"
  :min-width="80"
  :min-height="60"
  :max-width="480"
  :max-height="320"
  :limit-x="[0, 800]"
  :limit-y="[0, 480]"
  snap
  :grid="[20, 20]"
  :rotate-snap="15"
  :sticks="['tl', 'tr', 'br', 'bl', 'angle']"
/>
```

常用控制项：

| Prop | 作用 |
| ---- | ---- |
| `draggable` | 是否允许拖拽整个元素 |
| `resizeable` | 是否允许通过触点缩放 |
| `rotateable` | 是否允许旋转 |
| `active` | 是否显示激活态与控件 |
| `activeable` | 是否允许被激活和操作 |
| `lock` | 是否锁定当前宽高比 |
| `min-width` / `min-height` | 缩放最小尺寸 |
| `max-width` / `max-height` | 缩放最大尺寸 |
| `limit-x` / `limit-y` | 限制旋转后矩形包围盒在父坐标系内的活动范围 |
| `snap` / `snap-threshold` | 拖拽时吸附父容器、同级元素和自定义线 |
| `grid` | 网格吸附步长 |
| `rotate-snap` / `rotate-snap-threshold` | 旋转角度吸附 |
| `sticks` | 自定义显示哪些缩放 / 旋转触点 |

### 边界限制

`limit-x` / `limit-y` 可以约束拖拽、缩放和旋转后的矩形范围。边界判断基于**旋转后的轴对齐包围盒**，适合把节点限制在画布、裁剪区或父级容器内：

```vue
<vdr
  :w="180"
  :h="120"
  :x="40"
  :y="40"
  :r="15"
  :limit-x="[20, 620]"
  :limit-y="[20, 420]"
/>
```

两个 prop 可以单独使用；如果旋转后的包围盒仍能放进边界，组件会在需要时微调 `x` / `y` 使其回到范围内。详见 [边界限制指南](https://liaogn.github.io/vue-drag-resize-rotate/guide/boundary)。

## 主题定制

通过覆写 CSS 变量即可换肤，无需 override class：

```css
.my-vdr {
  --vdr-stick-color: crimson;
  --vdr-stick-border-radius: 2px;
  --vdr-stick-size: 20px;
}
```

完整变量清单见 [主题定制](https://liaogn.github.io/vue-drag-resize-rotate/guide/theming)。

## 嵌套示例

```vue
<vdr v-bind="root" />

<script setup lang="ts">
const root = {
  uuid: 'root',
  w: 400, h: 300, x: 40, y: 40,
  childrens: [
    { uuid: 'c1', w: 160, h: 100, x: 40, y: 40, r: 15 },
    { uuid: 'c2', w: 100, h: 100, x: 240, y: 140, lock: true },
  ],
}
</script>
```

详见 [嵌套指南](https://liaogn.github.io/vue-drag-resize-rotate/guide/nesting)。

## 插槽与内容承载

默认插槽会跟随组件的尺寸、位置和角度一起变化，可放入图片、文本、业务组件或其他 `<vdr>`：

```vue
<vdr :w="300" :h="200" :x="40" :y="40">
  <img src="/cover.jpg" style="width:100%;height:100%;object-fit:cover" />
</vdr>
```

如果只是设置背景图，也可以直接使用 `bg`：

```vue
<vdr :w="300" :h="200" bg="/cover.jpg" />
```

## 版本与兼容

| 版本   | 支持的 Vue | 状态 |
| ------ | ---------- | ---- |
| `^2.x` | Vue 3.3+   | ✅ 当前主线 |
| `^1.x` | Vue 2.x legacy | 🛑 已停止维护；安装 `@liaogn/vue-drag-resize-rotate@^1` |

v1 → v2 的主要破坏性变更见 [CHANGELOG 2.0.0](./CHANGELOG.md#200)。

## 开发

```bash
pnpm install
pnpm dev          # playground
pnpm docs:dev     # 文档站
pnpm type-check
pnpm lint
pnpm build        # 产出 dist/
pnpm docs:build
pnpm test:mobile  # Playwright 移动端单指交互验证
```

参与贡献请见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE) © liaogn
