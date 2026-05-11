# Sticks

Use `sticks` to choose which resize handles and rotation handle are rendered. By default, the component shows 8 resize handles and the `angle` rotation handle.

```vue
<vdr :sticks="['tl', 'tr', 'br', 'bl', 'angle']" />
```

## Values

| Value | Position |
| ----- | -------- |
| `tl` | top left |
| `tm` | top middle |
| `tr` | top right |
| `mr` | middle right |
| `br` | bottom right |
| `bm` | bottom middle |
| `bl` | bottom left |
| `ml` | middle left |
| `angle` | rotation handle |

## Common Sets

Corners only:

```vue
<vdr :sticks="['tl', 'tr', 'br', 'bl']" />
```

Rotation only:

```vue
<vdr :sticks="['angle']" :resizeable="false" />
```

Hide all handles:

```vue
<vdr :sticks="[]" />
```

`sticks` only controls whether handles are rendered. Drag, resize, and rotate permissions are controlled by `draggable`, `resizeable`, and `rotateable`.

See [Sticks](/en/examples/sticks) for an interactive example.
