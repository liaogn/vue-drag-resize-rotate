# 尺寸限制

通过 `min-width` / `min-height` / `max-width` / `max-height` 可以限制缩放后的尺寸范围。

```vue
<vdr
  :w="160"
  :h="120"
  :min-width="80"
  :min-height="80"
  :max-width="240"
  :max-height="200"
>
  <div>min / max</div>
</vdr>
```

## 常见用法

- 图片或贴纸：设置最小尺寸，避免缩到不可操作。
- 组件画布：设置最大尺寸，避免节点覆盖整个工作区。
- 固定比例素材：配合 `lock` 使用，让缩放在比例和尺寸范围内同时生效。

## 与翻转的关系

当设置了 `min-width` 或 `min-height` 时，拖拽触点越过对边不会触发翻转，而是由最小尺寸限制接管。没有设置最小尺寸时，越过对边才会进入翻转逻辑。

在线交互见 [示例 · min / max](/examples/min-max)。
