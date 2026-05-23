# Props

| Prop                | 类型                            | 默认       | 说明 |
| ------------------- | ------------------------------- | ---------- | ---- |
| `w`                 | `Number`                        | `100`      | 宽度 |
| `h`                 | `Number`                        | `100`      | 高度 |
| `x`                 | `Number`                        | `0`        | 相对父元素的 left |
| `y`                 | `Number`                        | `0`        | 相对父元素的 top |
| `r`                 | `Number`                        | `0`        | 旋转角度（度） |
| `z`                 | `Number \| String`              | `''`       | 层级 z-index |
| `bg`                | `String`                        | `''`       | 背景图片 URL |
| `min-width`         | `Number`                        | `0`        | 缩放最小宽度 |
| `min-height`        | `Number`                        | `0`        | 缩放最小高度 |
| `max-width`         | `Number`                        | `Infinity` | 缩放最大宽度 |
| `max-height`        | `Number`                        | `Infinity` | 缩放最大高度 |
| `lock`              | `Boolean`                       | `false`    | 锁定宽高比 |
| `active`            | `Boolean`                       | `true`     | 是否处于激活态（显示控件） |
| `activeable`        | `Boolean`                       | `true`     | 是否可被激活 |
| `draggable`         | `Boolean`                       | `true`     | 是否可拖动 |
| `resizeable`        | `Boolean`                       | `true`     | 是否可缩放 |
| `rotateable`        | `Boolean`                       | `true`     | 是否可旋转 |
| `sticks`            | `Array<string>`                 | 全部 9 个 | 控件子集，可选 `'tl' \| 'tm' \| 'tr' \| 'mr' \| 'br' \| 'bm' \| 'bl' \| 'ml' \| 'angle'` |
| `uuid`              | `String \| Number`              | `''`       | 唯一 id（用于嵌套 key 及事件回传） |
| `childrens`         | `Array<Object>`                 | `undefined` | 嵌套子组件参数数组（递归 props） |
| `childWrapAttr`     | `Object`                        | `undefined` | 嵌套时子级包裹层的 attrs |
| `overflow`          | `String`                        | `''`       | 嵌套时子级包裹层的 overflow（与 `childWrapAttr` 同时定义会合并） |
| `stick-hover-render` | `(cursorRotate: number) => { x: number; y: number; htmlText: string }` | `undefined` | 自定义触点 hover 时的 cursor 图标。返回 svg 字符串与偏移 |
| `limit-x`           | `[number, number] \| null`      | `null`     | 限制旋转后矩形包围盒在父坐标系内的 x 轴范围 |
| `limit-y`           | `[number, number] \| null`      | `null`     | 限制旋转后矩形包围盒在父坐标系内的 y 轴范围 |

## 注意

- 当传入 `min-width` 或 `min-height` 时，缩放越过对边不会触发翻转，由 min 接管；不设最小值时会发生 180° 翻转。
- `lock` 为 `true` 时，宽高比基于指针按下时的瞬时值。
- `sticks` 传 `[]` 表示完全不显示控件。
- `r` 既是 prop 也是 watch 入口；外部修改 `r` 会同步内部 `rotate`。
- `limit-x` / `limit-y` 可以单独使用；传入的数组必须是 `[最小值, 最大值]`，且最小值不能大于最大值。

参见 [Events](./events) 了解事件回传的 `pos` 字段含义。
