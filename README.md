# vue-drag-resize-rotate

[![npm version](https://img.shields.io/npm/v/@liaogn/vue-drag-resize-rotate?style=flat-square&color=42b883)](https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate)
[![npm downloads](https://img.shields.io/npm/dm/@liaogn/vue-drag-resize-rotate?style=flat-square)](https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate)
[![license](https://img.shields.io/npm/l/@liaogn/vue-drag-resize-rotate?style=flat-square)](./LICENSE)
[![ci](https://img.shields.io/github/actions/workflow/status/liaogn/vue-drag-resize-rotate/ci.yml?branch=master&style=flat-square)](https://github.com/liaogn/vue-drag-resize-rotate/actions)

> 简洁、零依赖的 Vue 3 拖拽 / 缩放 / 旋转组件。

[文档站](https://liaogn.github.io/vue-drag-resize-rotate/) · [English](https://liaogn.github.io/vue-drag-resize-rotate/en/) · [Changelog](./CHANGELOG.md)

## 特性

- 🎯 **拖拽 / 缩放 / 旋转**：8 触点缩放、独立旋转控件、锁定宽高比、翻转检测
- 🪄 **任意嵌套**：通过 `childrens` 递归嵌套，子组件操作自动跟随父级旋转坐标系
- 🎨 **CSS 变量主题**：14 个 `--vdr-*` 变量驱动样式，外层覆写即换肤
- 📦 **零运行时依赖**：仅 Vue 3 作 peer dep，构建产物含 ESM / UMD / `.d.ts`
- 🔒 **TypeScript 优先**：完整 props / events / 工具函数类型

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

完整 API 见 [Props](https://liaogn.github.io/vue-drag-resize-rotate/guide/props) · [Events](https://liaogn.github.io/vue-drag-resize-rotate/guide/events) · [Slots](https://liaogn.github.io/vue-drag-resize-rotate/guide/slots)。

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

## 版本与兼容

| 版本   | 支持的 Vue | 状态 |
| ------ | ---------- | ---- |
| `^2.x` | Vue 3.3+   | ✅ 当前主线 |
| `^1.x` | Vue 2.6+   | 🛑 已停止维护；安装 `@liaogn/vue-drag-resize-rotate@^1` |

v1 → v2 迁移指南见 [CHANGELOG](./CHANGELOG.md#迁移指南v1--v2)。

## 开发

```bash
pnpm install
pnpm dev          # playground
pnpm docs:dev     # 文档站
pnpm type-check
pnpm build        # 产出 dist/
```

参与贡献请见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE) © liaogn
