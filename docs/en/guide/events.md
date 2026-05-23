# Events

All event callbacks use the same signature: `(pos: PosData, event: PointerEvent) => void`.

## Event List

| Event          | When it fires |
| -------------- | ------------- |
| `activated`    | The element is activated by pointerdown |
| `dragStart`    | Drag starts |
| `dragging`     | Dragging, emitted continuously |
| `dragStop`     | Drag ends on pointerup / pointercancel |
| `resizeStart`  | Resize starts |
| `resizing`     | Resizing, emitted continuously |
| `resizeStop`   | Resize ends on pointerup / pointercancel |
| `rotateStart`  | Rotate starts |
| `rotating`     | Rotating, emitted continuously |
| `rotateStop`   | Rotate ends on pointerup / pointercancel |
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

Vue component events emitted by recursive `childrens` do not automatically bubble to the root `vdr`. To listen to data-driven children, pass listeners in the child config with Vue's `onEventName` object syntax:

```vue
<template>
  <vdr v-bind="root" @dragging="onRootUpdate" />
</template>

<script setup lang="ts">
function onRootUpdate(pos) {
  console.log('root', pos.uuid, pos.x, pos.y)
}

function onChildUpdate(pos) {
  console.log('child', pos.uuid, pos.x, pos.y)
}

const root = {
  uuid: 'root',
  w: 320, h: 220, x: 30, y: 30,
  childrens: [
    {
      uuid: 'child-1',
      w: 140, h: 100, x: 30, y: 30,
      onDragging: onChildUpdate,
      onResizing: onChildUpdate,
      onRotating: onChildUpdate,
    },
  ],
}
</script>
```
