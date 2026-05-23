# 锁定比例

设置 `lock` 为 `true` 后，缩放会保持当前宽高比，适合头像裁剪框、图片贴纸、固定比例素材等场景。

```vue
<vdr :w="180" :h="120" :x="40" :y="40" :lock="true">
  <img src="/cover.jpg" style="width:100%;height:100%;object-fit:cover" />
</vdr>
```

## 比例如何计算

锁定比例使用指针按下时组件的瞬时宽高比。也就是说，如果外部先把 `w` / `h` 改成新的尺寸，下一次缩放时会基于新尺寸重新计算比例。

## 与尺寸限制组合

`lock` 可以和 `min-width` / `max-width` / `min-height` / `max-height` 一起使用：

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

当宽高限制冲突时，组件会尽量保持比例，并把结果限制在合法尺寸内。

在线交互见 [示例 · 锁定比例](/examples/lock-ratio)。
