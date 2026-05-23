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
import DemoMobile from './DemoMobile.vue'
import DemoMobileSource from './DemoMobile.vue?raw'
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
import type { DemoLocale } from './i18n'

export interface DemoMeta {
  key: string
  title: string
  description: string
  component: Component
  source: string
}

interface DemoDefinition extends Omit<DemoMeta, 'title' | 'description'> {
  title: Record<DemoLocale, string>
  description: Record<DemoLocale, string>
}

const demoDefinitions: DemoDefinition[] = [
  {
    key: 'basic',
    title: {
      zh: '1. 基础：拖 / 缩 / 转',
      en: '1. Basic: drag / resize / rotate',
    },
    description: {
      zh: 'x / y / w / h / r 会随拖拽、缩放、旋转实时更新。',
      en: 'x / y / w / h / r update live while dragging, resizing, and rotating.',
    },
    component: DemoBasic,
    source: DemoBasicSource,
  },
  {
    key: 'mobile',
    title: {
      zh: '2. 移动端：单指控件',
      en: '2. Mobile: single-pointer controls',
    },
    description: {
      zh: '移动视口下通过单指拖拽主体、缩放触点和旋转触点完成编辑。',
      en: 'Edit in a mobile viewport with one finger on the body, resize handles, and rotate handle.',
    },
    component: DemoMobile,
    source: DemoMobileSource,
  },
  {
    key: 'lock',
    title: {
      zh: '3. 锁定比例 lock',
      en: '3. Lock ratio',
    },
    description: {
      zh: '中点和角点缩放时都强制保持宽高比。',
      en: 'Middle and corner handles both keep the aspect ratio.',
    },
    component: DemoLock,
    source: DemoLockSource,
  },
  {
    key: 'min-max',
    title: {
      zh: '4. min / max 尺寸限制',
      en: '4. Min / max size limits',
    },
    description: {
      zh: 'min: 80x80，max: 240x200。设置 min 后越过对边不会翻转。',
      en: 'min: 80x80, max: 240x200. Minimum limits prevent flipping across the opposite edge.',
    },
    component: DemoMinMax,
    source: DemoMinMaxSource,
  },
  {
    key: 'flip',
    title: {
      zh: '5. 翻转 fliped',
      en: '5. Flip',
    },
    description: {
      zh: '未设 min，拖拽触点越过对边会触发翻转。',
      en: 'Without minimum limits, dragging a handle across the opposite edge triggers a flip.',
    },
    component: DemoFlip,
    source: DemoFlipSource,
  },
  {
    key: 'nested',
    title: {
      zh: '6. 嵌套（childrens）',
      en: '6. Nesting (childrens)',
    },
    description: {
      zh: '父子级递归，子组件操作时坐标系跟随父级旋转。',
      en: "Recursive parent/child nodes; child coordinates follow the parent's rotation.",
    },
    component: DemoNested,
    source: DemoNestedSource,
  },
  {
    key: 'nested-clip',
    title: {
      zh: '7. 嵌套 + overflow:hidden',
      en: '7. Nesting + overflow:hidden',
    },
    description: {
      zh: '通过 overflow="hidden" 包一层 childWrap，子元素被父级裁剪。',
      en: 'Use overflow="hidden" to add a childWrap layer and clip children inside the parent.',
    },
    component: DemoNestedClip,
    source: DemoNestedClipSource,
  },
  {
    key: 'sticks',
    title: {
      zh: '8. 控件子集 sticks',
      en: '8. Sticks subset',
    },
    description: {
      zh: '只显示四角 + 旋转，不显示中点。',
      en: 'Show only the four corners plus rotation, without middle handles.',
    },
    component: DemoSticks,
    source: DemoSticksSource,
  },
  {
    key: 'custom-cursor',
    title: {
      zh: '9. 自定义 cursor (stickHoverRender)',
      en: '9. Custom cursor (stickHoverRender)',
    },
    description: {
      zh: '把 hover 箭头换成红色双箭头。',
      en: 'Replace the hover cursor with a red double-arrow icon.',
    },
    component: DemoCustomCursor,
    source: DemoCustomCursorSource,
  },
  {
    key: 'flags',
    title: {
      zh: '10. 状态开关',
      en: '10. State flags',
    },
    description: {
      zh: '勾选实时切换 active / draggable / resizeable / rotateable。',
      en: 'Toggle active / draggable / resizeable / rotateable in real time.',
    },
    component: DemoFlags,
    source: DemoFlagsSource,
  },
  {
    key: 'theming',
    title: {
      zh: '11. CSS 变量主题',
      en: '11. CSS variable themes',
    },
    description: {
      zh: '通过覆写 --vdr-* 变量实现主题切换。',
      en: 'Switch themes by overriding --vdr-* variables.',
    },
    component: DemoTheming,
    source: DemoThemingSource,
  },
  {
    key: 'boundary',
    title: {
      zh: '12. 边界限制 / min-max',
      en: '12. Boundary limits / min-max',
    },
    description: {
      zh: 'limit-x / limit-y 可约束拖拽、缩放和旋转后的矩形范围。',
      en: 'limit-x / limit-y constrain the rectangle after drag, resize, and rotate.',
    },
    component: DemoBoundary,
    source: DemoBoundarySource,
  },
  {
    key: 'nested-boundary',
    title: {
      zh: '13. 嵌套 + limit（父子各自的坐标系）',
      en: '13. Nesting + limit (separate coordinate systems)',
    },
    description: {
      zh: '外层 limit 使用操作区边界；子元素 limit 在父 vdr 内独立生效。',
      en: "The outer limit uses the stage boundary; child limits work inside the parent vdr.",
    },
    component: DemoNestedBoundary,
    source: DemoNestedBoundarySource,
  },
]

function localizeDemo(demo: DemoDefinition, locale: DemoLocale): DemoMeta {
  return {
    ...demo,
    title: demo.title[locale],
    description: demo.description[locale],
  }
}

export const demos: DemoMeta[] = demoDefinitions.map((demo) => localizeDemo(demo, 'zh'))

export function getDemo(key: string, locale: DemoLocale = 'zh') {
  const demo = demoDefinitions.find((item) => item.key === key)
  return demo ? localizeDemo(demo, locale) : undefined
}
