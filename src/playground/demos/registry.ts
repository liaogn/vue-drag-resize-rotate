import type { Component } from 'vue'
import DemoBasic from './DemoBasic.vue'
import DemoBasicSource from './DemoBasic.vue?raw'
import DemoBoundary from './DemoBoundary.vue'
import DemoBoundarySource from './DemoBoundary.vue?raw'
import DemoCustomCursor from './DemoCustomCursor.vue'
import DemoCustomCursorSource from './DemoCustomCursor.vue?raw'
import DemoFlags from './DemoFlags.vue'
import DemoFlagsSource from './DemoFlags.vue?raw'
import DemoFlip from './DemoFlip.vue'
import DemoFlipSource from './DemoFlip.vue?raw'
import DemoLock from './DemoLock.vue'
import DemoLockSource from './DemoLock.vue?raw'
import DemoMinMax from './DemoMinMax.vue'
import DemoMinMaxSource from './DemoMinMax.vue?raw'
import DemoNested from './DemoNested.vue'
import DemoNestedSource from './DemoNested.vue?raw'
import DemoNestedBoundary from './DemoNestedBoundary.vue'
import DemoNestedBoundarySource from './DemoNestedBoundary.vue?raw'
import DemoNestedClip from './DemoNestedClip.vue'
import DemoNestedClipSource from './DemoNestedClip.vue?raw'
import DemoSticks from './DemoSticks.vue'
import DemoSticksSource from './DemoSticks.vue?raw'
import DemoTheming from './DemoTheming.vue'
import DemoThemingSource from './DemoTheming.vue?raw'

export interface DemoMeta {
  key: string
  title: string
  description: string
  component: Component
  source: string
}

export const demos: DemoMeta[] = [
  {
    key: 'basic',
    title: '1. 基础：拖 / 缩 / 转',
    description: 'x / y / w / h / r 会随拖拽、缩放、旋转实时更新。',
    component: DemoBasic,
    source: DemoBasicSource,
  },
  {
    key: 'lock',
    title: '2. 锁定比例 lock',
    description: '中点和角点缩放时都强制保持宽高比。',
    component: DemoLock,
    source: DemoLockSource,
  },
  {
    key: 'min-max',
    title: '3. min / max 尺寸限制',
    description: 'min: 80x80，max: 240x200。设置 min 后越过对边不会翻转。',
    component: DemoMinMax,
    source: DemoMinMaxSource,
  },
  {
    key: 'flip',
    title: '4. 翻转 fliped',
    description: '未设 min，拖拽触点越过对边会触发翻转。',
    component: DemoFlip,
    source: DemoFlipSource,
  },
  {
    key: 'nested',
    title: '5. 嵌套（childrens）',
    description: '父子级递归，子组件操作时坐标系跟随父级旋转。',
    component: DemoNested,
    source: DemoNestedSource,
  },
  {
    key: 'nested-clip',
    title: '6. 嵌套 + overflow:hidden',
    description: '通过 overflow="hidden" 包一层 childWrap，子元素被父级裁剪。',
    component: DemoNestedClip,
    source: DemoNestedClipSource,
  },
  {
    key: 'sticks',
    title: '7. 控件子集 sticks',
    description: '只显示四角 + 旋转，不显示中点。',
    component: DemoSticks,
    source: DemoSticksSource,
  },
  {
    key: 'custom-cursor',
    title: '8. 自定义 cursor (stickHoverRender)',
    description: '把 hover 箭头换成红色双箭头。',
    component: DemoCustomCursor,
    source: DemoCustomCursorSource,
  },
  {
    key: 'flags',
    title: '9. 状态开关',
    description: '勾选实时切换 active / draggable / resizeable / rotateable。',
    component: DemoFlags,
    source: DemoFlagsSource,
  },
  {
    key: 'theming',
    title: '10. CSS 变量主题',
    description: '通过覆写 --vdr-* 变量实现主题切换。',
    component: DemoTheming,
    source: DemoThemingSource,
  },
  {
    key: 'boundary',
    title: '11. 边界限制 / min-max',
    description: 'limit-x / limit-y 可约束拖拽、缩放和旋转后的矩形范围。',
    component: DemoBoundary,
    source: DemoBoundarySource,
  },
  {
    key: 'nested-boundary',
    title: '12. 嵌套 + limit（父子各自的坐标系）',
    description: '外层 limit 使用操作区边界；子元素 limit 在父 vdr 内独立生效。',
    component: DemoNestedBoundary,
    source: DemoNestedBoundarySource,
  },
]

export function getDemo(key: string) {
  return demos.find((demo) => demo.key === key)
}
