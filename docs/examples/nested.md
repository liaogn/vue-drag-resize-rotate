# 嵌套

通过 `childrens` 数组实现数据驱动的嵌套。父级旋转时，子级操作自动跟随坐标系。

<preview path="./components/nested.vue" title="嵌套" description="先旋转外层，再操作内层子元素 —— 坐标换算自动处理"></preview>

## 关键点

- 子组件 props 与根完全一致，可以继续嵌套 `childrens` 形成任意深度
- 推荐为每个节点传 `uuid`，既作为 key 也用于在事件中识别来源
- 所有层级事件都会冒泡到最外层实例

详细说明见 [嵌套指南](/guide/nesting)。
