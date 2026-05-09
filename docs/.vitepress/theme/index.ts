import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { AntDesignContainer } from '@vitepress-demo-preview/component'
import VueDragResizeRotate from '../../../src/index'
import '@vitepress-demo-preview/component/dist/style.css'
import '../../../src/core/style/vdr.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(VueDragResizeRotate)
    app.component('demo-preview', AntDesignContainer)
  },
} satisfies Theme
