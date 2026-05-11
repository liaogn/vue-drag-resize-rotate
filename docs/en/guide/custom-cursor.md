# Custom Cursor

The direction cursor shown when hovering resize handles can be customized with `stick-hover-render`. The function receives the rotation angle for the current handle and returns cursor content plus hotspot offsets.

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

## Return Value

| Field | Description |
| ----- | ----------- |
| `x` | cursor hotspot x offset |
| `y` | cursor hotspot y offset |
| `htmlText` | SVG string |

The rotation handle cursor is controlled by the `--vdr-rotate-cursor` CSS variable. Resize handle hover cursors are customized with `stick-hover-render`.

See [Custom Cursor](/en/examples/custom-cursor) for an interactive example.
