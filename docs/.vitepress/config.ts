import { defineConfig } from 'vitepress'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

const GITHUB = 'https://github.com/liaogn/vue-drag-resize-rotate'

export default defineConfig({
  title: 'vue-drag-resize-rotate',
  description: 'Vue 3 component for dragging, resizing, and rotating DOM elements.',
  base: '/vue-drag-resize-rotate/',
  cleanUrls: true,
  lastUpdated: true,

  head: [['link', { rel: 'icon', href: '/vue-drag-resize-rotate/favicon.svg' }]],

  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: GITHUB }],
    search: { provider: 'local' },
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: 'API', link: '/guide/props' },
          { text: '示例', link: '/examples/basic' },
          { text: 'v2.0', items: [{ text: '更新日志', link: `${GITHUB}/blob/master/CHANGELOG.md` }] },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '指南',
              items: [
                { text: '快速开始', link: '/guide/getting-started' },
                { text: '锁定比例', link: '/guide/lock-ratio' },
                { text: '尺寸限制', link: '/guide/min-max' },
                { text: '翻转', link: '/guide/flip' },
                { text: '嵌套', link: '/guide/nesting' },
                { text: '边界限制', link: '/guide/boundary' },
                { text: '控件子集', link: '/guide/sticks' },
                { text: '自定义 cursor', link: '/guide/custom-cursor' },
                { text: '状态开关', link: '/guide/flags' },
                { text: '主题定制', link: '/guide/theming' },
              ],
            },
            {
              text: 'API',
              items: [
                { text: 'Props', link: '/guide/props' },
                { text: 'Events', link: '/guide/events' },
                { text: 'Slots', link: '/guide/slots' },
              ],
            },
          ],
          '/examples/': [
            {
              text: '示例',
              items: [
                { text: '基础', link: '/examples/basic' },
                { text: '锁定比例', link: '/examples/lock-ratio' },
                { text: 'min / max', link: '/examples/min-max' },
                { text: '翻转', link: '/examples/flip' },
                { text: '嵌套', link: '/examples/nested' },
                { text: '嵌套 + 裁剪', link: '/examples/nested-clip' },
                { text: '控件子集', link: '/examples/sticks' },
                { text: '自定义 cursor', link: '/examples/custom-cursor' },
                { text: '状态开关', link: '/examples/flags' },
                { text: 'CSS 变量主题', link: '/examples/theming' },
                { text: '边界限制', link: '/examples/boundary' },
                { text: '嵌套 + limit', link: '/examples/nested-boundary' },
              ],
            },
          ],
        },
        outline: { label: '本页内容' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdatedText: '最后更新于',
        editLink: {
          pattern: `${GITHUB}/edit/master/docs/:path`,
          text: '在 GitHub 上编辑此页',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/guide/props' },
          { text: 'Examples', link: '/en/examples/basic' },
          { text: 'v2.0', items: [{ text: 'Changelog', link: `${GITHUB}/blob/master/CHANGELOG.md` }] },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/en/guide/getting-started' },
                { text: 'Lock Ratio', link: '/en/guide/lock-ratio' },
                { text: 'Size Limits', link: '/en/guide/min-max' },
                { text: 'Flip', link: '/en/guide/flip' },
                { text: 'Nesting', link: '/en/guide/nesting' },
                { text: 'Boundary Limits', link: '/en/guide/boundary' },
                { text: 'Sticks', link: '/en/guide/sticks' },
                { text: 'Custom Cursor', link: '/en/guide/custom-cursor' },
                { text: 'State Flags', link: '/en/guide/flags' },
                { text: 'Theming', link: '/en/guide/theming' },
              ],
            },
            {
              text: 'API',
              items: [
                { text: 'Props', link: '/en/guide/props' },
                { text: 'Events', link: '/en/guide/events' },
                { text: 'Slots', link: '/en/guide/slots' },
              ],
            },
          ],
          '/en/examples/': [
            {
              text: 'Examples',
              items: [
                { text: 'Basic', link: '/en/examples/basic' },
                { text: 'Lock Ratio', link: '/en/examples/lock-ratio' },
                { text: 'Min / Max', link: '/en/examples/min-max' },
                { text: 'Flip', link: '/en/examples/flip' },
                { text: 'Nested', link: '/en/examples/nested' },
                { text: 'Nested + Clip', link: '/en/examples/nested-clip' },
                { text: 'Sticks', link: '/en/examples/sticks' },
                { text: 'Custom Cursor', link: '/en/examples/custom-cursor' },
                { text: 'Flags', link: '/en/examples/flags' },
                { text: 'Theme', link: '/en/examples/theming' },
                { text: 'Boundary', link: '/en/examples/boundary' },
                { text: 'Nested + Limit', link: '/en/examples/nested-boundary' },
              ],
            },
          ],
        },
        editLink: {
          pattern: `${GITHUB}/edit/master/docs/:path`,
          text: 'Edit this page on GitHub',
        },
      },
    },
  },
})
