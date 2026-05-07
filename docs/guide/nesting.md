# 嵌套

`vdr` 支持两种嵌套形态：**数据递归嵌套**（`childrens`）和 **模板嵌套**（slot）。前者适合由配置驱动的编辑器场景，后者适合手写组合。

## 通过 `childrens` 递归嵌套

```vue
<template>
  <vdr v-bind="root" />
</template>

<script setup lang="ts">
const root = {
  w: 400, h: 300, x: 40, y: 40, r: 0,
  uuid: 'root',
  childrens: [
    {
      w: 160, h: 100, x: 40, y: 40, r: 15,
      uuid: 'child-1',
    },
    {
      w: 100, h: 100, x: 240, y: 140, r: -10, lock: true,
      uuid: 'child-2',
      // 子节点也可以继续有 childrens
      childrens: [
        { w: 60, h: 60, x: 20, y: 20, uuid: 'grand-1' },
      ],
    },
  ],
}
</script>
```

子组件的操作会**自动跟随父级旋转坐标系**，你不需要手动换算旋转角度。所有层级触发的事件都会冒泡到根实例。

## `overflow` —— 子元素被父级裁剪

默认情况下子元素超出父元素不会被裁剪。通过传 `overflow` 可以给子级包一层 `overflow:hidden` 的 `.childWrap`：

```vue
<vdr
  :w="300" :h="200" :x="40" :y="40"
  overflow="hidden"
  :childrens="[{ w: 200, h: 160, x: 60, y: 30, r: 20 }]"
/>
```

常用值：`'hidden' | 'auto' | 'scroll'`。

## `childWrapAttr` —— 自定义子级包裹层

如果需要更多包裹层的控制（class、inline style、任意属性），使用 `childWrapAttr`：

```vue
<vdr
  :w="300" :h="200" :x="40" :y="40"
  :child-wrap-attr="{
    class: 'my-wrap',
    style: { borderRadius: '8px', overflow: 'hidden' },
  }"
  :childrens="[{ w: 200, h: 160, x: 60, y: 30 }]"
/>
```

`overflow` 与 `childWrapAttr` 同时存在时，`overflow` 会合并到 `childWrapAttr.style`。

## 通过 slot 嵌套

```vue
<vdr :w="320" :h="220" :x="30" :y="30">
  <vdr :w="140" :h="100" :x="40" :y="40">
    <div>child via slot</div>
  </vdr>
</vdr>
```

两种方式可以混用：外层用 `childrens`，插槽里再手写一个 `vdr`。

## 事件传递

所有嵌套层级的事件都会冒泡到根组件。可以通过 `pos.uuid` 区分来源：

```vue
<vdr v-bind="root" @dragging="(pos) => console.log(pos.uuid, pos.x, pos.y)" />
```
