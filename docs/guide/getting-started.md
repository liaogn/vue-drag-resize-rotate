# 快速开始

## 安装

::: code-group

```bash [pnpm]
pnpm add @liaogn/vue-drag-resize-rotate
```

```bash [npm]
npm install @liaogn/vue-drag-resize-rotate
```

```bash [yarn]
yarn add @liaogn/vue-drag-resize-rotate
```

:::

## 引入

### 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import VueDragResizeRotate from '@liaogn/vue-drag-resize-rotate'
import '@liaogn/vue-drag-resize-rotate/style.css'
import App from './App.vue'

createApp(App).use(VueDragResizeRotate).mount('#app')
```

### 局部引入

```vue
<script setup lang="ts">
import VueDragResizeRotate from '@liaogn/vue-drag-resize-rotate'
import '@liaogn/vue-drag-resize-rotate/style.css'
</script>

<template>
  <VueDragResizeRotate :w="200" :h="150" :x="50" :y="50">
    <div>Hello</div>
  </VueDragResizeRotate>
</template>
```

组件全局名是 `<vdr>`，全局安装后可直接使用短标签。

## 最小示例

```vue
<template>
  <vdr :w="200" :h="150" :x="50" :y="50" @dragging="onChange" @resizing="onChange">
    <div>拖我 / 缩我 / 转我</div>
  </vdr>
</template>

<script setup lang="ts">
function onChange(pos) {
  console.log(pos)
}
</script>
```

## 下一步

- [Props API](./props) — 所有可配置项
- [Events](./events) — 事件列表与 `pos` 参数结构
- [主题定制](./theming) — 用 CSS 变量换肤
- [示例](/examples/basic) — 交互演示
