# Slots

组件提供一个**默认插槽**用于承载内容。插槽内容会铺满矩形区域、随宽高/位置/旋转一同变换。

## 基本用法

```vue
<vdr :w="200" :h="200">
  <div>I am the slot content</div>
</vdr>
```

## 嵌入图片

```vue
<vdr :w="300" :h="200">
  <img src="/cat.jpg" style="width:100%;height:100%;object-fit:cover" />
</vdr>
```

或直接使用 `bg` prop：

```vue
<vdr :w="300" :h="200" bg="/cat.jpg" />
```

## 插槽中嵌套另一个 vdr

插槽里可以再放一个 `<vdr>`，用于自由嵌套（不通过 `childrens`）：

```vue
<vdr :w="320" :h="220" :x="30" :y="30">
  <vdr :w="140" :h="100" :x="40" :y="40">
    <div>child via slot</div>
  </vdr>
</vdr>
```

> 💡 **何时用 slot 嵌套，何时用 [`childrens`](./nesting)？** 
> - 数据结构是**递归数据**（如树形 Schema、JSON 配置）→ 用 `childrens`
> - 数据结构是**模板组合**（每层手写一段 template）→ 用 slot
