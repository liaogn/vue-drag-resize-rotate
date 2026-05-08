# Events

All event callbacks use the same signature: `(pos: PosData, event: MouseEvent) => void`.

## Event List

| Event          | When it fires |
| -------------- | ------------- |
| `activated`    | The element is activated by mousedown |
| `dragStart`    | Drag starts |
| `dragging`     | Dragging, emitted continuously |
| `dragStop`     | Drag ends on mouseup |
| `resizeStart`  | Resize starts |
| `resizing`     | Resizing, emitted continuously |
| `resizeStop`   | Resize ends on mouseup |
| `rotateStart`  | Rotate starts |
| `rotating`     | Rotating, emitted continuously |
| `rotateStop`   | Rotate ends on mouseup |
| `fliped`       | Resize crosses the opposite edge and flips |

## `pos` Payload

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

## Controlled Updates

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

## Nested Instances

Events emitted by nested children through `childrens` bubble to the root component. Set a `uuid` on each level when you need to know which instance emitted the event.
