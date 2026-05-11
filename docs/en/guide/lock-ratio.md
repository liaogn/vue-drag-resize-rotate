# Lock Ratio

Set `lock` to `true` to keep the current aspect ratio while resizing. This is useful for avatar crop boxes, image stickers, and fixed-ratio assets.

```vue
<vdr :w="180" :h="120" :x="40" :y="40" :lock="true">
  <img src="/cover.jpg" style="width:100%;height:100%;object-fit:cover" />
</vdr>
```

## How the Ratio Is Calculated

The locked ratio is based on the component's width and height at mousedown. If external state changes `w` / `h`, the next resize uses the updated ratio.

## Combining with Size Limits

`lock` can be used with `min-width`, `max-width`, `min-height`, and `max-height`:

```vue
<vdr
  :w="180"
  :h="120"
  :lock="true"
  :min-width="90"
  :min-height="60"
  :max-width="360"
  :max-height="240"
/>
```

When size limits conflict, the component keeps the ratio as much as possible while staying inside the valid size range.

See [Lock Ratio](/en/examples/lock-ratio) for an interactive example.
