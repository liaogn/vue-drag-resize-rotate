# 锁定比例

设置 `lock` 为 `true`，所有缩放操作都会保持宽高比。中点触点也生效。

<preview path="./components/lock-ratio.vue" title="锁定比例" description="尝试拖角点和中点，比例始终保持"></preview>

## 代码说明

```vue
<vdr :w="180" :h="120" :lock="true" />
```

- `lock` 的宽高比基于**鼠标按下时**的瞬时值，不是初始 `w / h`
- 中点（`tm / bm / mr / ml`）被锁后会沿参考线投影，不会把另一边拉斜
- 如果同时设置了 `min-width` 和 `max-height`，`lock` 会自动折算两边的有效范围
