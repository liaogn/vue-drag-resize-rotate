# Props

| Prop                | Type                                                                  | Default    | Description |
| ------------------- | --------------------------------------------------------------------- | ---------- | ----------- |
| `w`                 | `Number`                                                              | `100`      | Width |
| `h`                 | `Number`                                                              | `100`      | Height |
| `x`                 | `Number`                                                              | `0`        | Left, relative to parent |
| `y`                 | `Number`                                                              | `0`        | Top, relative to parent |
| `r`                 | `Number`                                                              | `0`        | Rotation in degrees |
| `z`                 | `Number \| String`                                                    | `''`       | z-index |
| `bg`                | `String`                                                              | `''`       | Background image URL |
| `min-width`         | `Number`                                                              | `0`        | Minimum width during resize |
| `min-height`        | `Number`                                                              | `0`        | Minimum height during resize |
| `max-width`         | `Number`                                                              | `Infinity` | Maximum width during resize |
| `max-height`        | `Number`                                                              | `Infinity` | Maximum height during resize |
| `lock`              | `Boolean`                                                             | `false`    | Lock aspect ratio |
| `active`            | `Boolean`                                                             | `true`     | Active state (controls visible) |
| `activeable`        | `Boolean`                                                             | `true`     | Whether the element can be activated |
| `draggable`         | `Boolean`                                                             | `true`     | Allow drag |
| `resizeable`        | `Boolean`                                                             | `true`     | Allow resize |
| `rotateable`        | `Boolean`                                                             | `true`     | Allow rotate |
| `sticks`            | `Array<string>`                                                       | all 9      | Subset of handles. Possible values: `'tl' \| 'tm' \| 'tr' \| 'mr' \| 'br' \| 'bm' \| 'bl' \| 'ml' \| 'angle'` |
| `uuid`              | `String \| Number`                                                    | `''`       | Unique id (used as key in nesting and echoed in events) |
| `childrens`         | `Array<Object>`                                                       | `undefined` | Recursive props for nested children |
| `childWrapAttr`     | `Object`                                                              | `undefined` | Attrs for the wrapper around children |
| `overflow`          | `String`                                                              | `''`       | Wrapper `overflow` (merged into `childWrapAttr` if both provided) |
| `stick-hover-render` | `(cursorRotate: number) => { x: number; y: number; htmlText: string }` | `undefined` | Custom cursor renderer for sticks (returns an SVG string with offsets) |
| `limit-x`           | `[number, number] \| null`                                            | `null`     | Limit the transformed rectangle's bounding box on the x axis in parent coordinates |
| `limit-y`           | `[number, number] \| null`                                            | `null`     | Limit the transformed rectangle's bounding box on the y axis in parent coordinates |
| `snap`              | `Boolean`                                                             | `false`    | Enable drag snapping |
| `snap-threshold`    | `Number`                                                              | `5`        | Drag snapping threshold in px |
| `snap-targets`      | `Array<'parent' \| 'siblings'>`                                       | `['parent', 'siblings']` | Drag snap targets: parent edges/center lines and sibling vdr edges/center lines |
| `snap-lines`        | `Array<{ x?: number; y?: number }>`                                   | `undefined` | Custom guide lines. `x` is a vertical line, `y` is a horizontal line, both in parent coordinates |
| `grid`              | `[number, number] \| null`                                            | `null`     | Grid snap size `[x, y]`; values must be greater than 0 to affect an axis |
| `rotate-snap`       | `Number`                                                              | `0`        | Rotation snap step in degrees. `0` disables it |
| `rotate-snap-threshold` | `Number`                                                          | `5`        | Rotation snap threshold in degrees |
| `scale`             | `Number`                                                             | `1`        | Canvas zoom factor. When the vdr lives inside a transform: scale() container, pass the cumulative scale factor to correct mouse displacement during drag/resize |

## Notes

- When `min-width` or `min-height` is set, dragging past the opposite edge will **not** flip; min takes over.
- `lock` ratio is based on the snapshot at pointerdown.
- `sticks: []` hides every handle.
- `r` is both a prop and a watch source; external updates sync to internal state.
- `limit-x` and `limit-y` can be used independently. The array must be `[min, max]`, with `min <= max`.
- `snap` only applies while dragging the body; resizing does not snap. When snapping changes, the component emits `snapping` so you can render guide lines.
- `snap-lines` and `grid` are not controlled by `snap-targets`; `snap-targets` only controls parent and sibling candidates.
- When `rotate-snap-threshold >= rotate-snap / 2`, rotation behaves like a hard step.
- `scale` only affects the mouse-coordinate conversion for drag and resize; rotation is unaffected by scale and needs no correction. Pass the cumulative product of all ancestor `transform: scale()` values applied to the vdr.

See [Events](./events) for the `pos` payload structure.
