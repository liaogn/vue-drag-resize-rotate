# State Flags

The component exposes boolean props for turning editing capabilities on or off based on your product state.

```vue
<vdr
  :active="true"
  :draggable="true"
  :resizeable="true"
  :rotateable="true"
  :activeable="true"
/>
```

## Flags

| Prop | Purpose |
| ---- | ------- |
| `active` | Whether the component is active and shows outline/handles |
| `activeable` | Whether the component can be activated and operated |
| `draggable` | Whether the whole element can be dragged |
| `resizeable` | Whether resize handles can resize the element |
| `rotateable` | Whether the `angle` handle can rotate the element |

## Common Modes

Read-only:

```vue
<vdr :active="false" :activeable="false" :draggable="false" :resizeable="false" :rotateable="false" />
```

Drag only:

```vue
<vdr :resizeable="false" :rotateable="false" />
```

Disable rotation while keeping drag and resize:

```vue
<vdr :rotateable="false" :sticks="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']" />
```

See [Flags](/en/examples/flags) for an interactive example.
