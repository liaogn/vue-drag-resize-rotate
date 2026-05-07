# CSS 变量主题

通过覆写 `--vdr-*` 变量实现主题切换。切换下面的 radio，观察触点/边框样式的变化。

<preview path="./components/theming.vue" title="CSS 变量主题" description="运行时切换主题 —— 通过内联 style 注入变量即可"></preview>

## 关键点

- 变量在 `.vdr` 选择器上定义（见 [主题定制](/guide/theming)）
- 外层任何祖先元素覆写都会继承 —— 所以用 `:style="themeVars"` 即可动态切换
- 覆写对象建议声明 `Record<string, string>` 类型

完整变量清单见 [主题定制](/guide/theming#变量清单)。
