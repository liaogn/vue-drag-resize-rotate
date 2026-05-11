# 边界限制

`limit-x` / `limit-y` 用来限制组件在父坐标系中的可活动范围。它们会作用于拖拽、缩放、旋转以及外部 prop 更新后的自动校正。

## 基本用法

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

`limit-x="[24, 576]"` 表示旋转后矩形的外接包围盒不能超出 `x = 24` 到 `x = 576`。`limit-y` 同理。

## 与旋转的关系

边界判断使用的是**旋转后的轴对齐包围盒**，而不是未旋转的原始宽高。因此元素旋转后会占用更大的边界空间：

```vue
<vdr
  :w="180"
  :h="100"
  :r="35"
  :limit-x="[0, 400]"
  :limit-y="[0, 300]"
/>
```

当旋转后仍能放进边界时，组件会在需要时微调 `x` / `y`，让包围盒回到范围内；如果旋转后的包围盒已经大于边界范围，本次旋转会被拒绝。

## 单轴限制

两个 prop 可以单独使用。只限制横向时保留 `limit-y` 为默认值：

```vue
<vdr :limit-x="[0, 480]" />
```

只限制纵向：

```vue
<vdr :limit-y="[0, 320]" />
```

## 与尺寸限制组合

`limit-x` / `limit-y` 负责元素位置和旋转后的范围，`min-width` / `max-width` / `min-height` / `max-height` 负责缩放尺寸本身。它们可以一起使用：

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

缩放时如果请求尺寸会导致包围盒越界，组件会取当前操作方向上仍然合法的最大尺寸。

## 嵌套边界

嵌套场景下，每个 `vdr` 的边界都基于它自己的父坐标系。外层和子级可以拥有完全不同的限制：

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

如果你希望视觉上裁剪子元素，边界限制之外还需要设置 `overflow="hidden"` 或自定义 `childWrapAttr.style.overflow`。

## 动态边界

当画布尺寸会响应式变化时，可以把边界保存为响应式数组。组件会监听 `limit-x` / `limit-y` 的变化并尝试把当前元素校正回边界内：

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

在线交互见 [示例 · 边界限制](/examples/boundary) 和 [示例 · 嵌套 + limit](/examples/nested-boundary)。
