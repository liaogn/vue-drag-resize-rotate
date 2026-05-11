<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(
  defineProps<{
    locale?: 'zh' | 'en'
  }>(),
  { locale: 'zh' }
)

const isEn = computed(() => props.locale === 'en')
const guideLink = computed(() =>
  withBase(isEn.value ? '/en/guide/getting-started' : '/guide/getting-started')
)
const examplesLink = computed(() =>
  withBase(isEn.value ? '/en/examples/basic' : '/examples/basic')
)
const githubLink = 'https://github.com/liaogn/vue-drag-resize-rotate'

const copy = computed(() =>
  isEn.value
    ? {
        eyebrow: 'Try the demo on the right and feel the smooth interaction',
        titlePrefix: 'Drag · Resize ·',
        titleAccent: 'Rotate',
        titleSuffix: 'has never been easier.',
        lead:
          'vue-drag-resize-rotate is a powerful, lightweight Vue 3 component for dragging, resizing, rotating, and nested editing across visual web editor scenarios.',
        metaLabel: 'Project features',
        guideAction: 'Get Started',
        examplesAction: 'Examples',
        stageLabel: 'Drag resize rotate demo',
        infoTitle: 'A silky drag · resize · rotate Vue plugin.',
      }
    : {
        eyebrow: '请操作点击右侧的Demo，体验丝滑交互',
        titlePrefix: '拖拽 · 缩放 ·',
        titleAccent: '旋转',
        titleSuffix: '从未如此简单。',
        lead:
          'vue-drag-resize-rotate 是一个功能强大、轻量灵活的 Vue 3 组件，提供拖拽、缩放、旋转、嵌套编辑等能力，适用于各类 Web 可视化编辑场景。',
        metaLabel: '项目特性',
        guideAction: '快速开始',
        examplesAction: '示例代码',
        stageLabel: '拖拽缩放旋转演示',
        infoTitle: '丝滑的拖拽 · 缩放 · 旋转的 Vue 插件。',
      }
)

const heroRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const panelLimit = reactive({
  ready: false,
  lx0: 0,
  lx1: 0,
  ly0: 0,
  ly1: 0,
})
const panelLimitX = computed<[number, number] | null>(() =>
  panelLimit.ready ? [panelLimit.lx0, panelLimit.lx1] : null
)
const panelLimitY = computed<[number, number] | null>(() =>
  panelLimit.ready ? [panelLimit.ly0, panelLimit.ly1] : null
)
let panelLimitResizeObserver: ResizeObserver | null = null
let panelLimitFrame = 0

function syncPanelLimit() {
  if (!heroRef.value || !stageRef.value) return

  const heroRect = heroRef.value.getBoundingClientRect()
  const stageRect = stageRef.value.getBoundingClientRect()
  const stageScaleX = stageRect.width / (stageRef.value.offsetWidth || stageRect.width || 1) || 1
  const stageScaleY = stageRect.height / (stageRef.value.offsetHeight || stageRect.height || 1) || 1
  const screenRect = {
    left: Math.max(heroRect.left, 0),
    top: Math.max(heroRect.top, 0),
    right: Math.min(heroRect.right, window.innerWidth),
    bottom: Math.min(heroRect.bottom, window.innerHeight),
  }
  const limitRect =
    screenRect.right > screenRect.left && screenRect.bottom > screenRect.top
      ? screenRect
      : heroRect

  panelLimit.lx0 = Math.floor((limitRect.left - stageRect.left) / stageScaleX)
  panelLimit.lx1 = Math.ceil((limitRect.right - stageRect.left) / stageScaleX)
  panelLimit.ly0 = Math.floor((limitRect.top - stageRect.top) / stageScaleY)
  panelLimit.ly1 = Math.ceil((limitRect.bottom - stageRect.top) / stageScaleY)
  panelLimit.ready = true
}

function setupPanelLimitObserver(retryCount = 0) {
  syncPanelLimit()
  if (!heroRef.value || !stageRef.value) {
    if (retryCount < 5) {
      panelLimitFrame = window.requestAnimationFrame(() =>
        setupPanelLimitObserver(retryCount + 1)
      )
    }
    return
  }

  panelLimitResizeObserver = new ResizeObserver(syncPanelLimit)
  panelLimitResizeObserver.observe(heroRef.value)
  panelLimitResizeObserver.observe(stageRef.value)
  window.addEventListener('resize', syncPanelLimit)
}

onMounted(() => {
  nextTick(() => setupPanelLimitObserver())
})

onBeforeUnmount(() => {
  panelLimitResizeObserver?.disconnect()
  window.removeEventListener('resize', syncPanelLimit)
  if (panelLimitFrame) window.cancelAnimationFrame(panelLimitFrame)
})

const stats = computed(() =>
  isEn.value
    ? [
        { icon: '▼', text: 'Vue 3' },
        { icon: '✧', text: 'Lightweight' },
        { icon: '↪', text: 'Nestable' },
        { icon: '↯', text: 'Performant' },
      ]
    : [
        { icon: '▼', text: 'Vue 3' },
        { icon: '✧', text: '极轻量' },
        { icon: '↪', text: '可嵌套' },
        { icon: '↯', text: '高性能' },
      ]
)

const features = computed(() =>
  isEn.value
    ? [
        {
          icon: '🎯',
          index: '01',
          title: 'Drag / Resize / Rotate',
          text: 'Move freely, resize from 8 directional handles, and rotate 360 degrees for editor-ready canvas interactions.',
        },
        {
          icon: '🧱',
          index: '02',
          title: 'Nested Editing / Slots',
          text: 'Support multi-level parent-child editing, arbitrary slot content, and data-driven node rendering.',
        },
        {
          icon: '🔁',
          index: '03',
          title: 'Aspect Lock / Flip / Size Limits',
          text: 'Lock aspect ratio, flip by dragging handles across edges, and constrain minimum or maximum dimensions.',
        },
        {
          icon: '🎨',
          index: '04',
          title: 'Theming / Lightweight Setup',
          text: 'Only Vue 3 is required. Use global install or local import, with visuals driven by CSS variables.',
        },
      ]
    : [
        {
          icon: '🎯',
          index: '01',
          title: '拖拽 / 缩放 / 旋转',
          text: '支持自由移动、8 方向触点缩放和 360° 旋转，快速获得画布元素编辑能力。',
        },
        {
          icon: '🧱',
          index: '02',
          title: '嵌套编辑 / 插槽承载',
          text: '支持父子元素多层嵌套，可通过插槽放入任意内容，也支持数据配置渲染节点。',
        },
        {
          icon: '🔁',
          index: '03',
          title: '锁比例 / 翻转 / 尺寸限制',
          text: '支持固定比例缩放、拖拽触点自由翻转，并限制元素最小 / 最大宽高。',
        },
        {
          icon: '🎨',
          index: '04',
          title: '样式定制 / 轻量接入',
          text: '仅依赖 Vue 3，支持全局插件安装和单组件引入，主题样式由 CSS 变量驱动。',
        },
      ]
)
</script>

<template>
  <main class="vdr-home">
    <section ref="heroRef" class="vdr-hero">
      <div class="vdr-hero__grid" aria-hidden="true"></div>
      <div class="vdr-hero__shade" aria-hidden="true"></div>

      <div class="vdr-hero__inner">
        <div class="vdr-hero__copy">
          <p class="vdr-eyebrow">{{ copy.eyebrow }}</p>
          <h1><span class="vdr-hero__title-line">{{ copy.titlePrefix }} <span class="vdr-hero__accent">{{ copy.titleAccent }}</span></span><br />{{ copy.titleSuffix }}</h1>
         
          <div>
            <p class="vdr-hero__lead">
              {{ copy.lead }}
            </p>

            <div class="vdr-hero__meta" :aria-label="copy.metaLabel">
              <span v-for="item in stats" :key="item.text">
                <i>{{ item.icon }}</i>
                {{ item.text }}
              </span>
            </div>
          </div>

          <div class="vdr-hero__actions">
            <a class="vdr-button vdr-button--primary" :href="guideLink">{{ copy.guideAction }} <span>→</span></a>
            <a class="vdr-button" :href="examplesLink">{{ copy.examplesAction }} <span>↘</span></a>
            <a class="vdr-button" :href="githubLink" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
          </div>
        </div>

        <ClientOnly>
          <div ref="stageRef" class="vdr-stage" :aria-label="copy.stageLabel">
            <vdr
              class="vdr-stage__panel"
              overflow="hidden"
              :w="500"
              :h="320"
              :x="60"
              :y="110"
              :r="-7"
              :limit-x="panelLimitX"
              :limit-y="panelLimitY"
            >
              <div class="vdr-stage__surface">
                <vdr :limit-x="[-40,540]" :limit-y="[-40,360]" class="vdr-stage__nested" :w="130" :h="80" :x="188" :y="110" :r="10">
                  <div class="vdr-stage__label">nesting</div>
                </vdr>
              </div>
            </vdr>
          </div>
        </ClientOnly>
      </div>
    </section>

    <section class="vdr-info">
      <div class="vdr-info__heading">
        <h2>{{ copy.infoTitle }}</h2>
      </div>

      <div class="vdr-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="vdr-feature">
          <div class="vdr-feature__top">
            <span class="vdr-feature__icon" aria-hidden="true">{{ feature.icon }}</span>
            <span class="vdr-feature__index">{{ feature.index }}</span>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(.vdr-home-page.VPDoc) {
  padding: 0 !important;
}

:global(.vdr-home-page.VPDoc .container),
:global(.vdr-home-page.VPDoc .content),
:global(.vdr-home-page.VPDoc .content-container) {
  max-width: none !important;
  padding: 0 !important;
}

:global(.vdr-home-page .VPDoc) {
  padding: 0 !important;
}

:global(.vdr-home-page .VPDoc .container),
:global(.vdr-home-page .VPDoc .content),
:global(.vdr-home-page .VPDoc .content-container) {
  max-width: none !important;
  padding: 0 !important;
}

:global(.vdr-home-page .VPContent) {
  padding-top: var(--vp-nav-height) !important;
}

.vdr-home {
  overflow: hidden;
  color: #17254a;
  background: #f7faff;
}

.vdr-hero {
  position: relative;
  user-select: none;
  min-height: calc(100vh - var(--vp-nav-height));
  overflow: hidden;
  border-bottom: 1px solid rgba(98, 132, 196, 0.22);
  background:
    linear-gradient(118deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 251, 255, 0.95) 50%, rgba(237, 245, 255, 0.92) 100%),
    #f7faff;
}

.vdr-hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(63, 112, 204, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(63, 112, 204, 0.045) 1px, transparent 1px),
    radial-gradient(rgba(43, 111, 255, 0.16) 1px, transparent 1px);
  background-position: 0 0, 0 0, 9px 9px;
  background-size: 64px 64px, 64px 64px, 18px 18px;
}

.vdr-hero__shade {
  position: absolute;
  inset: auto 0 0;
  height: 230px;
  background:
    repeating-linear-gradient(90deg, rgba(80, 119, 193, 0.14) 0 1px, transparent 1px 72px),
    repeating-linear-gradient(0deg, rgba(80, 119, 193, 0.12) 0 1px, transparent 1px 42px);
  opacity: 0.72;
  transform: perspective(620px) rotateX(64deg);
  transform-origin: bottom;
}

.vdr-hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(610px, 1fr) minmax(520px, 1fr);
  gap: 42px;
  width: min(1420px, calc(100% - 128px));
  min-height: calc(100vh - var(--vp-nav-height));
  margin: 0 auto;
  align-items: center;
}

.vdr-hero__copy {
  padding: 20px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.vdr-eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 18px;
  border-radius: 999px;
  background: #dbeaff70;
  color: #1f66ff90;
  font-size: 17px;
  font-weight: 900;
}

.vdr-hero h1 {
  color: #17254a;
  font-size: clamp(66px, 5.3vw, 82px);
  line-height: 1.5;
  font-weight: 900;
  letter-spacing: 0;
}

.vdr-hero__title-line {
  white-space: nowrap;
}

.vdr-hero h1 .vdr-hero__accent {
  color: #276cff;
}

.vdr-hero__lead {
  max-width: 660px;
  color: #5b6988;
  font-size: 20px;
  line-height: 1.72;
}

.vdr-hero__meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.vdr-hero__meta span {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: #50617e;
  font-size: 15px;
  font-weight: 800;
}

.vdr-hero__meta i {
  color: #35b888;
  font-style: normal;
  font-weight: 900;
}

.vdr-hero__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 38px;
}

.vdr-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 150px;
  height: 58px;
  padding: 0 26px;
  border: 1px solid rgba(72, 96, 143, 0.16);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 10px 24px rgba(43, 74, 140, 0.08);
  color: #1d3974;
  font-size: 17px;
  font-weight: 800;
  text-decoration: none !important;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.vdr-button:hover {
  border-color: rgba(39, 108, 255, 0.35);
  box-shadow: 0 14px 30px rgba(43, 74, 140, 0.14);
  transform: translateY(-1px);
}

.vdr-button--primary {
  border-color: #276cff;
  background: #276cff;
  color: #fff;
  box-shadow: 0 16px 32px rgba(39, 108, 255, 0.28);
}

.vdr-stage {
  position: relative;
  height: 540px;
  min-width: 0;
  margin-top: 26px;
}

.vdr-stage::before {
  content: '';
  position: absolute;
  left: 58px;
  right: 12px;
  bottom: 28px;
  height: 34px;
  border-radius: 50%;
  background: rgba(39, 84, 167, 0.16);
  filter: blur(18px);
}

.vdr-stage__panel {
  --vdr-stick-color: #2973ff;
  --vdr-stick-bg: #f8fbff;
  --vdr-stick-size: 18px;
  --vdr-angle-size: 24px;
  --vdr-active-outline-color: #2973ff;
  --vdr-rotate-line-color: rgba(41, 115, 255, 0.55);
  box-shadow: 0 34px 80px rgba(46, 89, 179, 0.24);
}

.vdr-stage__surface {
  position: relative;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(135deg, rgba(53, 195, 245, 0.96) 0%, rgba(55, 132, 245, 0.95) 48%, rgba(112, 77, 233, 0.96) 100%);
}

.vdr-stage__nested {
  --vdr-stick-color: #f6fbff;
  --vdr-stick-bg: #eaf3ff;
  --vdr-stick-size: 16px;
  --vdr-angle-size: 20px;
  --vdr-active-outline-color: rgba(255, 255, 255, 0.82);
  --vdr-rotate-line-color: rgba(255, 255, 255, 0.68);
}

.vdr-stage__label {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(39, 91, 199, 0.94), rgba(47, 65, 164, 0.94));
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  line-height: 1;
}

.vdr-info {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height));
  padding: 70px 0 86px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(247, 250, 255, 0.95)),
    #f8fbff;
}

.vdr-info__heading {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  text-align: center;
}

.vdr-info__heading p {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  margin: 0 0 14px;
  padding: 0 18px;
  border-radius: 999px;
  background: #eee9ff;
  color: #5d42d6;
  font-size: 14px;
  font-weight: 800;
}

.vdr-info__heading h2 {
  max-width: 840px;
  margin: 0 auto;
  border: 0;
  color: #17254a;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1.28;
  font-weight: 900;
  letter-spacing: 0;
}

.vdr-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  width: min(1120px, calc(100% - 48px));
  margin: 38px auto 0;
}

.vdr-feature {
  min-height: 226px;
  padding: 24px;
  border: 1px solid rgba(77, 105, 158, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 22px 54px rgba(49, 76, 132, 0.08);
}

.vdr-feature__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
}

.vdr-feature__icon {
  display: inline-flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.86), transparent 34%),
    linear-gradient(135deg, #e8f2ff, #f7fbff);
  box-shadow: inset 0 0 0 1px rgba(39, 108, 255, 0.08);
  font-size: 25px;
  line-height: 1;
}

.vdr-feature__index {
  color: #46587d;
  font-size: 18px;
  font-weight: 900;
}

.vdr-feature h3 {
  margin: 0 0 10px;
  color: #17254a;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.35;
}

.vdr-feature p {
  margin: 0;
  color: #5b6988;
  font-size: 15px;
  line-height: 1.75;
}

@media (max-width: 1080px) {
  .vdr-hero {
    min-height: auto;
  }

  .vdr-hero__inner {
    grid-template-columns: 1fr;
    gap: 18px;
    min-height: auto;
    padding-top: 54px;
  }

  .vdr-hero__copy {
    padding: 42px 0 0;
  }

  .vdr-stage {
    height: 460px;
    margin-top: 0;
  }

  .vdr-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .vdr-hero {
    min-height: auto;
  }

  .vdr-hero__inner,
  .vdr-info__heading,
  .vdr-feature-grid {
    width: min(100% - 32px, 1120px);
  }

  .vdr-hero h1 {
    font-size: clamp(40px, 12vw, 58px);
    line-height: 1.18;
  }

  .vdr-hero__title-line {
    white-space: normal;
  }

  .vdr-hero__lead {
    font-size: 16px;
  }

  .vdr-button {
    min-width: 132px;
    height: 52px;
    padding: 0 20px;
    font-size: 15px;
  }

  .vdr-stage {
    height: 380px;
    transform: scale(0.72);
    transform-origin: top left;
    width: 138%;
    margin-bottom: -88px;
  }

  .vdr-info {
    padding-top: 46px;
  }

  .vdr-feature-grid {
    grid-template-columns: 1fr;
  }

  .vdr-feature {
    min-height: 0;
  }
}
</style>
