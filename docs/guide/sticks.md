# 控件子集

`sticks` 用来控制显示哪些缩放触点和旋转触点。默认显示 8 个缩放触点和 `angle` 旋转触点。

```vue
<vdr :sticks="['tl', 'tr', 'br', 'bl', 'angle']" />
```

## 可选值

| 值 | 位置 |
| -- | -- |
| `tl` | 左上 |
| `tm` | 上中 |
| `tr` | 右上 |
| `mr` | 右中 |
| `br` | 右下 |
| `bm` | 下中 |
| `bl` | 左下 |
| `ml` | 左中 |
| `angle` | 旋转控件 |

## 常见组合

只保留四角缩放：

```vue
<vdr :sticks="['tl', 'tr', 'br', 'bl']" />
```

只允许旋转：

```vue
<vdr :sticks="['angle']" :resizeable="false" />
```

隐藏所有控件：

```vue
<vdr :sticks="[]" />
```

`sticks` 只控制控件是否渲染；是否允许拖拽、缩放、旋转分别由 `draggable`、`resizeable`、`rotateable` 控制。

在线交互见 [示例 · 控件子集](/examples/sticks)。
