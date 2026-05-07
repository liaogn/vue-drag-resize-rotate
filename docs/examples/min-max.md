# min / max 尺寸限制

通过 `min-width` / `min-height` / `max-width` / `max-height` 约束尺寸范围。

<preview path="./components/min-max.vue" title="min / max" description="缩到 80×80 不再变小，最大 240×200。设置 min 后越过对边不会翻转"></preview>

## 关于翻转

设置了 `min-width` 或 `min-height` 后，**翻转会被禁用**：拖到对边时尺寸按 0 处理（由 min 接管）。如果你希望保留翻转行为，就不要设置 min。

## 与 `lock` 的组合

```vue
<vdr
  :min-width="80"
  :min-height="60"
  :max-width="400"
  :max-height="300"
  :lock="true"
/>
```

- `lock=true` 时，`getLimitedSize` 会折算两边限制，保持宽高比且不突破任一边界
- 如果 `min` > `max`（比如 `minWidth: 500, maxWidth: 300`），以 `min` 为准
