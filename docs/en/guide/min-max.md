# Size Limits

Use `min-width`, `min-height`, `max-width`, and `max-height` to constrain the resized dimensions.

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

## Common Uses

- Images and stickers: set a minimum size so handles remain usable.
- Editor canvases: set a maximum size so one node cannot cover the whole stage.
- Fixed-ratio assets: combine with `lock` so ratio and size limits both apply.

## Relationship with Flip

When `min-width` or `min-height` is set, dragging a handle past the opposite edge does not flip the element; the minimum size limit takes over. Without minimum limits, crossing the opposite edge enters the flip logic.

See [Min / Max](/en/examples/min-max) for an interactive example.
