# 翻转

没有设置最小尺寸限制时，拖拽缩放触点越过对边会触发翻转。组件会保持矩形继续可操作，并触发 `fliped` 事件。

```vue
<template>
  <vdr :w="160" :h="120" @fliped="onFlip">
    <div>flip me</div>
  </vdr>
</template>

<script setup lang="ts">
function onFlip(pos) {
  console.log(pos.flipSign, pos.r)
}
</script>
```

## `fliped` 事件

`fliped` 的事件参数和其他事件一致，都会收到 `(pos, event)`。其中 `pos.flipSign` 表示上一次翻转方向：

```ts
type FlipSign = '' | '+' | '-'
```

## 禁用翻转

如果你的业务不希望元素翻转，可以设置最小尺寸：

```vue
<vdr :min-width="40" :min-height="40" />
```

在线交互见 [示例 · 翻转](/examples/flip)。
