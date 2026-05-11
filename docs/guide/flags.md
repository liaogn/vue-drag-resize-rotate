# 状态开关

组件提供一组布尔 prop，用于按业务状态开启或关闭交互能力。

```vue
<vdr
  :active="true"
  :draggable="true"
  :resizeable="true"
  :rotateable="true"
  :activeable="true"
/>
```

## 开关说明

| Prop | 作用 |
| ---- | ---- |
| `active` | 是否处于激活态，激活时显示轮廓和控件 |
| `activeable` | 是否允许被激活和操作 |
| `draggable` | 是否允许拖拽整体 |
| `resizeable` | 是否允许通过触点缩放 |
| `rotateable` | 是否允许通过 `angle` 触点旋转 |

## 常见模式

只读展示：

```vue
<vdr :active="false" :activeable="false" :draggable="false" :resizeable="false" :rotateable="false" />
```

仅拖拽：

```vue
<vdr :resizeable="false" :rotateable="false" />
```

禁止旋转但允许拖拽和缩放：

```vue
<vdr :rotateable="false" :sticks="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']" />
```

在线交互见 [示例 · 状态开关](/examples/flags)。
