# 主题定制

所有样式都通过 **CSS 变量** 驱动。你只需要在外层覆写变量即可换肤，无需 override 内部 class。

## 变量清单

| 变量 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `--vdr-stick-color` | `#2db7f5` | 触点边框颜色 |
| `--vdr-stick-bg` | `#fff` | 触点背景色 |
| `--vdr-stick-hover-shadow-color` | `rgb(45 183 245 / 0.3)` | 触点 hover 阴影颜色 |
| `--vdr-active-outline-color` | `#999` | 激活态外轮廓颜色 |
| `--vdr-rotate-line-color` | `#999` | 旋转控件连接线颜色 |
| `--vdr-stick-size` | `16px` | 触点尺寸（宽高） |
| `--vdr-stick-border-width` | `2px` | 触点边框粗细 |
| `--vdr-stick-border-radius` | `50%` | 触点圆角（`50%` 为圆形；`2px` 为方形） |
| `--vdr-stick-hover-shadow-width` | `4px` | 触点 hover 阴影宽度 |
| `--vdr-active-outline-width` | `1px` | 激活态外轮廓宽度 |
| `--vdr-rotate-line-height` | `30px` | 旋转连接线长度 |
| `--vdr-rotate-line-offset` | `32px` | 旋转连接线距元素顶部偏移 |
| `--vdr-angle-size` | `18px` | 旋转控件尺寸 |
| `--vdr-angle-offset` | `258%` | 旋转控件距元素顶部偏移 |
| `--vdr-stick-transition` | `box-shadow 0.1s` | 触点过渡动画 |
| `--vdr-rotate-cursor` | `crosshair` | 旋转控件 cursor |

## 覆写方式

### 全局覆写

```css
/* 全站 vdr 都变红 */
.vdr {
  --vdr-stick-color: crimson;
  --vdr-active-outline-color: crimson;
}
```

### 局部覆写

```vue
<template>
  <vdr class="my-vdr" :w="200" :h="150" />
</template>

<style>
.my-vdr {
  --vdr-stick-color: #52c41a;
  --vdr-stick-border-radius: 2px;
  --vdr-stick-size: 20px;
}
</style>
```

### 动态主题

把变量存到 inline style 里，配合响应式数据即可实现运行时切换：

```vue
<template>
  <div :style="themeVars">
    <vdr :w="200" :h="150" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const accent = ref('#722ed1')

const themeVars = computed(() => ({
  '--vdr-stick-color': accent.value,
  '--vdr-active-outline-color': accent.value,
}))
</script>
```

## 预设示例

### Crimson 主题

```css
.theme-crimson {
  --vdr-stick-color: crimson;
  --vdr-stick-hover-shadow-color: rgb(220 20 60 / 0.3);
  --vdr-active-outline-color: crimson;
  --vdr-rotate-line-color: crimson;
}
```

### 方形大触点

```css
.theme-square-large {
  --vdr-stick-size: 20px;
  --vdr-stick-border-radius: 2px;
  --vdr-stick-color: #52c41a;
  --vdr-stick-hover-shadow-color: rgb(82 196 26 / 0.3);
  --vdr-active-outline-color: #52c41a;
}
```

### 极简黑

```css
.theme-minimal {
  --vdr-stick-size: 8px;
  --vdr-stick-border-width: 1px;
  --vdr-stick-color: #222;
  --vdr-stick-hover-shadow-width: 2px;
  --vdr-stick-hover-shadow-color: rgb(0 0 0 / 0.2);
  --vdr-active-outline-color: #222;
}
```

在线交互见 [示例 · CSS 变量主题](/examples/theming)。

## 自定义触点 hover cursor

hover 时的方向箭头不属于 CSS 变量范畴，因为它是 SVG 图标，用 [`stickHoverRender`](./props) prop 提供自定义渲染函数：

```vue
<vdr :stick-hover-render="myRender" />

<script setup lang="ts">
function myRender(cursorRotate: number) {
  return {
    x: 16,
    y: 16,
    htmlText: `<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>`,
  }
}
</script>
```

详见示例 [自定义 cursor](/examples/custom-cursor)。
