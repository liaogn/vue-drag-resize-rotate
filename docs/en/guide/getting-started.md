# Getting Started

## Install

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

## Usage

### Global registration

```ts
// main.ts
import { createApp } from 'vue'
import VueDragResizeRotate from '@liaogn/vue-drag-resize-rotate'
import '@liaogn/vue-drag-resize-rotate/style.css'
import App from './App.vue'

createApp(App).use(VueDragResizeRotate).mount('#app')
```

### Local import

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

The component registers globally as `<vdr>`.

## Minimal example

```vue
<template>
  <vdr :w="200" :h="150" :x="50" :y="50" @dragging="onChange" @resizing="onChange">
    <div>drag · resize · rotate</div>
  </vdr>
</template>

<script setup lang="ts">
function onChange(pos) {
  console.log(pos)
}
</script>
```

## Next steps

- [Props API](./props) — all configurable options
- [Examples](/examples/basic) — interactive demos
