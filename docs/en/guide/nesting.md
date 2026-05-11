# Nesting

`vdr` supports two nesting styles: **recursive data nesting** through `childrens`, and **template nesting** through the default slot. Use `childrens` when your editor is driven by a JSON-like schema; use slots when you compose each level by hand.

## Recursive Nesting with `childrens`

```vue
<template>
  <vdr v-bind="root" />
</template>

<script setup lang="ts">
const root = {
  w: 400, h: 300, x: 40, y: 40, r: 0,
  uuid: 'root',
  childrens: [
    {
      w: 160, h: 100, x: 40, y: 40, r: 15,
      uuid: 'child-1',
    },
    {
      w: 100, h: 100, x: 240, y: 140, r: -10, lock: true,
      uuid: 'child-2',
      // Children can also define their own childrens.
      childrens: [
        { w: 60, h: 60, x: 20, y: 20, uuid: 'grand-1' },
      ],
    },
  ],
}
</script>
```

Child operations follow the parent's rotated coordinate system automatically, so you do not need to convert angles manually.

## `overflow` for Clipping Children

By default, children are not clipped when they exceed the parent. Pass `overflow` to create a `.childWrap` with the requested overflow behavior:

```vue
<vdr
  :w="300" :h="200" :x="40" :y="40"
  overflow="hidden"
  :childrens="[{ w: 200, h: 160, x: 60, y: 30, r: 20 }]"
/>
```

Common values are `'hidden'`, `'auto'`, and `'scroll'`.

## `childWrapAttr`

Use `childWrapAttr` when you need more control over the wrapper around child nodes, such as class, inline style, or other attributes:

```vue
<vdr
  :w="300" :h="200" :x="40" :y="40"
  :child-wrap-attr="{
    class: 'my-wrap',
    style: { borderRadius: '8px', overflow: 'hidden' },
  }"
  :childrens="[{ w: 200, h: 160, x: 60, y: 30 }]"
/>
```

When both `overflow` and `childWrapAttr` are provided, `overflow` is merged into `childWrapAttr.style`.

## Slot Nesting

```vue
<vdr :w="320" :h="220" :x="30" :y="30">
  <vdr :w="140" :h="100" :x="40" :y="40">
    <div>child via slot</div>
  </vdr>
</vdr>
```

You can mix both styles: render part of the tree from `childrens`, then place hand-written `vdr` nodes in the slot.

## Handling Child Events

Vue component events emitted by recursive `childrens` do not automatically bubble to the root `vdr`. To handle events from data-driven children, pass listeners in the child config with Vue's `onEventName` object syntax:

```vue
<template>
  <vdr v-bind="root" @dragging="onRootDragging" />
</template>

<script setup lang="ts">
function onAnyChildChange(pos) {
  console.log(pos.uuid, pos.x, pos.y)
}

function onRootDragging(pos) {
  console.log('root', pos)
}

const root = {
  uuid: 'root',
  w: 320, h: 220, x: 30, y: 30,
  childrens: [
    {
      uuid: 'child-1',
      w: 140, h: 100, x: 30, y: 30,
      onDragging: onAnyChildChange,
      onResizing: onAnyChildChange,
      onRotating: onAnyChildChange,
    },
  ],
}
</script>
```

For slot nesting, bind listeners directly on each nested `<vdr>`.
