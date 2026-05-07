# Events

所有事件回调签名一致：`(pos: PosData, event: MouseEvent) => void`。

## 事件列表

| 事件名         | 触发时机                       |
| -------------- | ------------------------------ |
| `activated`    | 元素被激活（mousedown 选中）   |
| `dragStart`    | 拖拽开始                       |
| `dragging`     | 拖拽中（持续触发）             |
| `dragStop`     | 拖拽结束（mouseup）            |
| `resizeStart`  | 缩放开始                       |
| `resizing`     | 缩放中（持续触发）             |
| `resizeStop`   | 缩放结束                       |
| `rotateStart`  | 旋转开始                       |
| `rotating`     | 旋转中（持续触发）             |
| `rotateStop`   | 旋转结束                       |
| `fliped`       | 缩放越过对边触发翻转时         |

## `pos` 参数结构

```ts
interface PosData {
  uuid: string | number    // 当前实例的 uuid
  x: number                // 相对父元素的 left
  y: number                // 相对父元素的 top
  w: number                // 宽
  h: number                // 高
  r: number                // 旋转角度
  z: number | string       // z-index
  stick: '' | 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml' | 'angle'
                           // 当前操作的控件类型
  lock: boolean            // 是否锁定比例
  active: boolean          // 是否处于激活态
  flipSign: '' | '+' | '-' // 上一次翻转方向（'+' 正向、'-' 反向）
}
```

## 示例：受控更新

```vue
<template>
  <vdr
    :w="rect.w"
    :h="rect.h"
    :x="rect.x"
    :y="rect.y"
    :r="rect.r"
    @dragging="onUpdate"
    @resizing="onUpdate"
    @rotating="onUpdate"
  >
    <div>contents</div>
  </vdr>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const rect = reactive({ w: 200, h: 150, x: 50, y: 50, r: 0 })

function onUpdate(pos) {
  rect.x = pos.x
  rect.y = pos.y
  rect.w = pos.w
  rect.h = pos.h
  rect.r = pos.r
}
</script>
```

## 嵌套场景下的事件传递

嵌套子组件（通过 `childrens`）触发的事件会**冒泡到根组件**。如果你需要区分是哪个实例触发的，请给每个层级设置 `uuid`，并在事件回调中读取 `pos.uuid`：

```vue
<template>
  <vdr v-bind="root" @dragging="onUpdate" />
</template>

<script setup lang="ts">
const root = {
  uuid: 'root',
  w: 320, h: 220, x: 30, y: 30,
  childrens: [
    { uuid: 'child-1', w: 140, h: 100, x: 30, y: 30 },
    { uuid: 'child-2', w: 90, h: 90, x: 200, y: 100 },
  ],
}

function onUpdate(pos) {
  console.log(pos.uuid, pos.x, pos.y)
}
</script>
```
