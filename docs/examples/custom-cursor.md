# 自定义 cursor

通过 `stickHoverRender` prop 自定义触点 hover 时的方向箭头图标。函数接收当前触点角度、返回 SVG 字符串与偏移。

<preview path="./components/custom-cursor.vue" title="自定义 cursor" description="hover 任一触点可见红色双箭头"></preview>

## 签名

```ts
type StickHoverRender = (cursorRotate: number) => {
  x: number          // cursor 热点 x 偏移
  y: number          // cursor 热点 y 偏移
  htmlText: string   // SVG 字符串
}
```

**注意**：SVG 里需要根据 `cursorRotate` 旋转图标方向：

```html
<svg style="...">
  <path style="transform: rotate(${cursorRotate}deg); transform-origin: 16px 16px" ... />
</svg>
```

`cursorRotate` 已经包含了所有祖先元素的累计旋转角 —— 也就是说，父级被旋转 30° 后，子级触点的箭头会自动跟着转。
