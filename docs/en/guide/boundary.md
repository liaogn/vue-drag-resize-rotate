# Boundary Limits

Use `limit-x` / `limit-y` to constrain the component's movable area in the parent coordinate system. The limits apply to dragging, resizing, rotating, and correction after external prop updates.

## Basic Usage

```vue
<template>
  <div class="stage">
    <vdr
      :w="160"
      :h="120"
      :x="80"
      :y="60"
      :limit-x="[24, 576]"
      :limit-y="[24, 376]"
    >
      <div>bounded</div>
    </vdr>
  </div>
</template>

<style>
.stage {
  position: relative;
  width: 600px;
  height: 400px;
}
</style>
```

`limit-x="[24, 576]"` means the transformed rectangle's bounding box must stay between `x = 24` and `x = 576`. `limit-y` works the same way on the vertical axis.

## Rotation

Boundary checks use the **axis-aligned bounding box after rotation**, not the raw unrotated width and height. A rotated element can therefore occupy more boundary space:

```vue
<vdr
  :w="180"
  :h="100"
  :r="35"
  :limit-x="[0, 400]"
  :limit-y="[0, 300]"
/>
```

If the rotated box still fits, the component may adjust `x` / `y` to bring it back inside the limits. If the rotated bounding box is larger than the available range, that rotate step is rejected.

## Single-Axis Limits

The two props can be used independently. Horizontal only:

```vue
<vdr :limit-x="[0, 480]" />
```

Vertical only:

```vue
<vdr :limit-y="[0, 320]" />
```

## Combining with Size Limits

`limit-x` / `limit-y` constrain the transformed position, while `min-width` / `max-width` / `min-height` / `max-height` constrain the size itself. They can be used together:

```vue
<vdr
  :w="180"
  :h="120"
  :min-width="80"
  :min-height="60"
  :max-width="300"
  :max-height="220"
  :limit-x="[20, 520]"
  :limit-y="[20, 340]"
/>
```

During resize, if the requested size would move the bounding box outside the limits, the component uses the largest valid size in the current operation direction.

## Nested Boundaries

In nested layouts, each `vdr` reads its limits in its own parent coordinate system. Outer and inner nodes can use different boundaries:

```vue
<vdr
  :w="320"
  :h="240"
  :x="40"
  :y="40"
  :limit-x="[20, 580]"
  :limit-y="[20, 380]"
  overflow="hidden"
>
  <vdr
    :w="120"
    :h="90"
    :x="30"
    :y="30"
    :limit-x="[12, 308]"
    :limit-y="[12, 228]"
  />
</vdr>
```

If you also want visual clipping, set `overflow="hidden"` or provide `childWrapAttr.style.overflow`. Boundary limits do not clip content by themselves.

## Dynamic Boundaries

When the stage size is responsive, keep the limits in reactive state. The component watches `limit-x` / `limit-y` and tries to correct the current element back into range:

```vue
<template>
  <vdr
    :x="rect.x"
    :y="rect.y"
    :w="rect.w"
    :h="rect.h"
    :limit-x="[0, stage.width]"
    :limit-y="[0, stage.height]"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const stage = reactive({ width: 800, height: 480 })
const rect = reactive({ x: 40, y: 40, w: 180, h: 120 })
</script>
```

See [Boundary](/en/examples/boundary) and [Nested + Limit](/en/examples/nested-boundary) for interactive examples.
