# Theming

All visuals are driven by **CSS variables**. Override variables on an outer element to customize the component without overriding internal classes.

## Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `--vdr-stick-color` | `#2db7f5` | Handle border color |
| `--vdr-stick-bg` | `#fff` | Handle background |
| `--vdr-stick-hover-shadow-color` | `rgb(45 183 245 / 0.3)` | Handle hover shadow color |
| `--vdr-active-outline-color` | `#999` | Active outline color |
| `--vdr-rotate-line-color` | `#999` | Rotation line color |
| `--vdr-stick-size` | `16px` | Handle width and height |
| `--vdr-stick-border-width` | `2px` | Handle border width |
| `--vdr-stick-border-radius` | `50%` | Handle radius (`50%` for circles, `2px` for square handles) |
| `--vdr-stick-hover-shadow-width` | `4px` | Handle hover shadow width |
| `--vdr-active-outline-width` | `1px` | Active outline width |
| `--vdr-rotate-line-height` | `30px` | Rotation line length |
| `--vdr-rotate-line-offset` | `32px` | Rotation line offset from the top edge |
| `--vdr-angle-size` | `18px` | Rotation handle size |
| `--vdr-angle-offset` | `258%` | Rotation handle offset from the top edge |
| `--vdr-stick-transition` | `box-shadow 0.1s` | Handle transition |
| `--vdr-rotate-cursor` | `crosshair` | Rotation handle cursor |

## Override Globally

```css
/* All vdr instances become red. */
.vdr {
  --vdr-stick-color: crimson;
  --vdr-active-outline-color: crimson;
}
```

## Override Locally

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

## Dynamic Themes

Put variables in inline styles and bind them to reactive state:

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

## Presets

### Crimson

```css
.theme-crimson {
  --vdr-stick-color: crimson;
  --vdr-stick-hover-shadow-color: rgb(220 20 60 / 0.3);
  --vdr-active-outline-color: crimson;
  --vdr-rotate-line-color: crimson;
}
```

### Large Square Handles

```css
.theme-square-large {
  --vdr-stick-size: 20px;
  --vdr-stick-border-radius: 2px;
  --vdr-stick-color: #52c41a;
  --vdr-stick-hover-shadow-color: rgb(82 196 26 / 0.3);
  --vdr-active-outline-color: #52c41a;
}
```

### Minimal Black

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

See [Theme](/en/examples/theming) for an interactive example.

## Custom Stick Hover Cursor

The hover direction cursor is generated as an SVG data URL, so it is customized through the [`stickHoverRender`](./props) prop instead of CSS variables:

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

See [Custom Cursor](/en/examples/custom-cursor) for details.
