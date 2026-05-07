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

## Notes

- When `min-width` or `min-height` is set, dragging past the opposite edge will **not** flip; min takes over.
- `lock` ratio is based on the snapshot at mousedown.
- `sticks: []` hides every handle.
- `r` is both a prop and a watch source; external updates sync to internal state.

See [Events](./events) for the `pos` payload structure.
