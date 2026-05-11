# 自定义 cursor

缩放触点 hover 时的方向箭头可以通过 `stick-hover-render` 自定义。这个函数会收到当前触点方向对应的旋转角度，并返回 cursor 图标内容和热点偏移。

```vue
<template>
  <vdr :stick-hover-render="renderCursor" />
</template>

<script setup lang="ts">
function renderCursor(cursorRotate: number) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g transform="rotate(${cursorRotate} 16 16)">
        <path d="M16 3 L21 10 H18 V22 H21 L16 29 L11 22 H14 V10 H11 Z" fill="#f5222d"/>
      </g>
    </svg>
  `

  return {
    x: 16,
    y: 16,
    htmlText: svg,
  }
}
</script>
```

## 返回值

| 字段 | 说明 |
| ---- | ---- |
| `x` | cursor 热点的 x 偏移 |
| `y` | cursor 热点的 y 偏移 |
| `htmlText` | SVG 字符串 |

旋转触点的 cursor 使用 CSS 变量 `--vdr-rotate-cursor` 控制；缩放触点 hover 图标则使用 `stick-hover-render`。

在线交互见 [示例 · 自定义 cursor](/examples/custom-cursor)。
