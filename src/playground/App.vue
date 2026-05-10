<template>
  <div class="page">
    <header class="topbar">
      <h1>vue-drag-resize-rotate · playground</h1>
      <p>覆盖核心交互场景，验证迁移 Vue3 后行为与 v1 一致</p>
    </header>

    <main class="grid">
      <!-- 1. 基础：拖 / 缩 / 转 -->
      <section class="scene">
        <div class="scene-info">
          <h2>1. 基础：拖 / 缩 / 转</h2>
          <p class="info">
            x={{ fmt(basic.x) }} · y={{ fmt(basic.y) }} · w={{ fmt(basic.w) }} · h={{ fmt(basic.h) }}
            · r={{ fmt(basic.r) }}°
          </p>
        </div>
        <div class="stage">
          <vdr
            :w="basic.w"
            :h="basic.h"
            :x="basic.x"
            :y="basic.y"
            :r="basic.r"
            overflow="hidden"
            @dragging="updateBasic"
            @resizing="updateBasic"
            @rotating="updateBasic"
          >
            <div class="card">drag · resize · rotate</div>
          </vdr>
        </div>
      </section>

      <!-- 2. 锁定比例 -->
      <section class="scene">
        <div class="scene-info">
          <h2>2. 锁定比例 lock</h2>
          <p class="info">中点和角点缩放时都强制保持宽高比</p>
        </div>
        <div class="stage">
          <vdr v-bind="lockedRect" overflow="hidden" :lock="true">
            <div class="card alt">lock</div>
          </vdr>
        </div>
      </section>

      <!-- 3. min / max 限制（不可翻转） -->
      <section class="scene">
        <div class="scene-info">
          <h2>3. min/max 尺寸限制</h2>
          <p class="info">min: 80×80，max: 240×200。设置了 min 后越过对边不会翻转</p>
        </div>
        <div class="stage">
          <vdr
            v-bind="minMaxRect"
            :min-width="80"
            :min-height="80"
            :max-width="240"
            :max-height="200"
          >
            <div class="card">min/max</div>
          </vdr>
        </div>
      </section>

      <!-- 4. 翻转 -->
      <section class="scene">
        <div class="scene-info">
          <h2>4. 翻转 fliped</h2>
          <p class="info">未设 min，越过对边触发翻转（fliped 事件计数: {{ flipCount }}）</p>
        </div>
        <div class="stage">
          <vdr overflow="hidden" v-bind="flipRect" @fliped="flipCount++">
            <div class="card warn">拖拽触点实现翻转</div>
          </vdr>
        </div>
      </section>

      <!-- 5. 嵌套 childrens -->
      <section class="scene">
        <div class="scene-info">
          <h2>5. 嵌套（childrens）</h2>
          <p class="info">父子级递归，子组件操作时坐标系跟随父级旋转</p>
        </div>
        <div class="stage">
          <vdr v-bind="nestedRoot"  />
        </div>
      </section>

      <!-- 6. 嵌套 + overflow:hidden -->
      <section class="scene">
        <div class="scene-info">
          <h2>6. 嵌套 + overflow:hidden</h2>
          <p class="info">通过 overflow="hidden" 包一层 childWrap，子元素被父级裁剪</p>
        </div>
        <div class="stage">
          <vdr v-bind="nestedClipped" />
        </div>
      </section>

      <!-- 7. 控件子集 sticks -->
      <section class="scene">
        <div class="scene-info">
          <h2>7. 控件子集 sticks</h2>
          <p class="info">只显示四角 + 旋转，不显示中点</p>
        </div>
        <div class="stage">
          <vdr overflow="hidden" v-bind="centerRect180x140" :sticks="['tl', 'tr', 'bl', 'br', 'angle']">
            <div class="card alt">corners only</div>
          </vdr>
        </div>
      </section>

      <!-- 8. 自定义 stickHoverRender -->
      <section class="scene">
        <div class="scene-info">
          <h2>8. 自定义 cursor (stickHoverRender)</h2>
          <p class="info">把 hover 箭头换成红色双箭头</p>
        </div>
        <div class="stage">
          <vdr overflow="hidden" v-bind="centerRect180x140" :stick-hover-render="redArrowRender">
            <div class="card warn">custom cursor</div>
          </vdr>
        </div>
      </section>

      <!-- 9. 不可激活 / 不可拖 / 不可缩 -->
      <section class="scene">
        <div class="scene-info">
          <h2>9. 状态开关</h2>
          <p class="info">勾选实时切换 active / draggable / resizeable / rotateable</p>
          <div class="toggles">
            <label><input type="checkbox" v-model="flags.active" /> active</label>
            <label><input type="checkbox" v-model="flags.draggable" /> draggable</label>
            <label><input type="checkbox" v-model="flags.resizeable" /> resizeable</label>
            <label><input type="checkbox" v-model="flags.rotateable" /> rotateable</label>
          </div>
        </div>
        <div class="stage">
          <vdr
            v-bind="centerRect180x140"
            :active="flags.active"
            :draggable="flags.draggable"
            :resizeable="flags.resizeable"
            :rotateable="flags.rotateable"
            overflow="hidden"
          >
            <div class="card">flags</div>
          </vdr>
        </div>
      </section>

      <!-- 10. CSS 变量主题切换 -->
      <section class="scene">
        <div class="scene-info">
          <h2>10. CSS 变量主题</h2>
          <p class="info">通过覆写 --vdr-* 变量实现主题切换</p>
          <div class="toggles">
            <label v-for="t in themes" :key="t.name">
              <input type="radio" name="vdr-theme" :value="t.name" v-model="theme" />
              {{ t.name }}
            </label>
          </div>
        </div>
        <div class="stage" :style="currentTheme">
          <vdr overflow="hidden" v-bind="centerRect180x140">
            <div class="card alt">themed</div>
          </vdr>
        </div>
      </section>

      <!-- 11. 边界限制 limit-x / limit-y -->
      <section class="scene">
        <div class="scene-info">
          <h2>11. 边界限制 limit-x / limit-y</h2>
          <p class="info">
            x=[{{ bound.lx0 }},{{ bound.lx1 }}] · y=[{{ bound.ly0 }},{{ bound.ly1 }}] ·
            pos=({{ fmt(boundPos.x) }},{{ fmt(boundPos.y) }}) · {{ fmt(boundPos.w) }}×{{
              fmt(boundPos.h)
            }} · r={{ fmt(boundPos.r) }}°
          </p>
          <div class="toggles">
            <label><input type="checkbox" v-model="bound.lock" /> lock</label>
            <button type="button" @click="resetBound">reset</button>
          </div>
        </div>
        <div class="stage" ref="limitStageRef">
          <div class="boundary-hint boundary-hint--orange" :style="boundaryHintStyle"></div>
          <vdr
            :key="boundKey"
            :w="boundPos.w"
            :h="boundPos.h"
            :x="boundPos.x"
            :y="boundPos.y"
            :r="boundPos.r"
            :lock="bound.lock"
            :limit-x="[bound.lx0, bound.lx1]"
            :limit-y="[bound.ly0, bound.ly1]"
            overflow="hidden"
            @dragging="updateBound"
            @resizing="updateBound"
            @rotating="updateBound"
            @fliped="updateBound"
          >
            <div class="card">bounded · drag / resize / rotate / flip</div>
          </vdr>
        </div>
      </section>

      <!-- 12. 边界 + min/max 尺寸限制 -->
      <section class="scene">
        <div class="scene-info">
          <h2>12. 边界 + min/max（交叉验证）</h2>
          <p class="info">
            limit 为操作区 95% 居中边界，min 60×60，max 240×200；缩放在双重约束下正确收敛
          </p>
        </div>
        <div class="stage">
          <div class="boundary-hint boundary-hint--cyan" :style="boundaryHintStyle"></div>
          <vdr
            overflow="hidden"
            v-bind="boundedMinMaxRect"
            :min-width="60"
            :min-height="60"
            :max-width="240"
            :max-height="200"
            :limit-x="[bound.lx0, bound.lx1]"
            :limit-y="[bound.ly0, bound.ly1]"
          >
            <div class="card alt">bounded + min/max</div>
          </vdr>
        </div>
      </section>

      <!-- 13. 嵌套 + limit-x / limit-y -->
      <section class="scene">
        <div class="scene-info">
          <h2>13. 嵌套 + limit（父子各自的坐标系）</h2>
          <p class="info">外层 limit 使用操作区 95% 居中边界；子元素 limit 在父 vdr 内独立生效</p>
        </div>
        <div class="stage">
          <div class="boundary-hint boundary-hint--orange" :style="boundaryHintStyle"></div>
          <vdr
            v-bind="boundedNestedRoot"
            :limit-x="[bound.lx0, bound.lx1]"
            :limit-y="[bound.ly0, bound.ly1]"
            uuid="nest-root"
            overflow="hidden"
          >
            <div class="boundary-hint boundary-hint--cyan" :style="nestedChildBoundaryStyle"></div>
            <vdr
              :w="120"
              :h="90"
              :x="30"
              :y="30"
              :r="15"
              :limit-x="[12, 268]"
              :limit-y="[12, 208]"
              uuid="nest-child-a"
              overflow="hidden"
            >
              <div class="card">child A</div>
            </vdr>
            <vdr
              :w="80"
              :h="80"
              :x="160"
              :y="100"
              :r="-10"
              :lock="true"
              :limit-x="[12, 268]"
              :limit-y="[12, 208]"
              uuid="nest-child-b"
              overflow="hidden"
            >
              <div class="card alt">child B (lock)</div>
            </vdr>
          </vdr>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  type CSSProperties,
} from 'vue'

const STAGE_WIDTH = 420
const STAGE_HEIGHT = 380
const BOUNDARY_RATIO = 0.95

function centerRect(w: number, h: number, r = 0) {
  return {
    w,
    h,
    x: Math.round((STAGE_WIDTH - w) / 2),
    y: Math.round((STAGE_HEIGHT - h) / 2),
    r,
  }
}

function getBoundary(width = STAGE_WIDTH, height = STAGE_HEIGHT) {
  const boundaryWidth = Math.round(width * BOUNDARY_RATIO)
  const boundaryHeight = Math.round(height * BOUNDARY_RATIO)
  const marginX = Math.round((width - boundaryWidth) / 2)
  const marginY = Math.round((height - boundaryHeight) / 2)

  return {
    x0: marginX,
    x1: marginX + boundaryWidth,
    y0: marginY,
    y1: marginY + boundaryHeight,
    width: boundaryWidth,
    height: boundaryHeight,
  }
}

function centerRectInBoundary(w: number, h: number, r = 0, width = STAGE_WIDTH, height = STAGE_HEIGHT) {
  const boundary = getBoundary(width, height)

  return {
    w,
    h,
    x: Math.round(boundary.x0 + (boundary.width - w) / 2),
    y: Math.round(boundary.y0 + (boundary.height - h) / 2),
    r,
  }
}

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const centerRect180x140 = centerRect(180, 140)
    const lockedRect = centerRect(180, 120)
    const minMaxRect = centerRect(160, 120)
    const flipRect = centerRect(160, 120)
    const boundedMinMaxRect = reactive(centerRectInBoundary(140, 110, 10))
    const boundedNestedRoot = reactive(centerRectInBoundary(280, 220))
    const limitStageRef = ref<HTMLElement | null>(null)
    const stageSize = reactive({ width: STAGE_WIDTH, height: STAGE_HEIGHT })
    const boundTouched = ref(false)
    let stageResizeObserver: ResizeObserver | null = null

    const basic = reactive({ ...centerRect180x140 })

    function updateBasic(pos: any) {
      basic.x = pos.x
      basic.y = pos.y
      basic.w = pos.w
      basic.h = pos.h
      basic.r = pos.r
    }

    function fmt(v: number) {
      return Number.isFinite(v) ? v.toFixed(1) : v
    }

    const flipCount = ref(0)

    const flags = reactive({
      active: true,
      draggable: true,
      resizeable: true,
      rotateable: true,
    })

    const nestedRoot = {
      ...centerRect(320, 220),
      uuid: 'root',
      childWrapAttr: { class: 'vdr-fill vdr-fill--root', 'data-label': '父级容器' },
      childrens: [
        {
          w: 140,
          h: 100,
          x: 40,
          y: 40,
          r: 15,
          uuid: 'child-1',
          overflow: 'hidden',
          childWrapAttr: { class: 'vdr-fill vdr-fill--child-a', 'data-label': '子元素 A' },
        },
        {
          w: 90,
          h: 90,
          x: 190,
          y: 100,
          r: -10,
          lock: true,
          uuid: 'child-2',
          overflow: 'hidden',
          childWrapAttr: { class: 'vdr-fill vdr-fill--child-b', 'data-label': '子元素 B' },
        },
      ],
    }

    const nestedClipped = {
      ...centerRect(320, 220),
      uuid: 'clip-root',
      childWrapAttr: { class: 'vdr-fill vdr-fill--clip-root', 'data-label': '裁剪父级' },
      overflow: 'hidden',
      childrens: [
        {
          w: 200,
          h: 160,
          x: 60,
          y: 30,
          r: 20,
          overflow: 'hidden',
          uuid: 'clip-child',
          childWrapAttr: { class: 'vdr-fill vdr-fill--clip-child', 'data-label': '被裁剪的子元素' },
        },
      ],
    }

    function redArrowRender(cursorRotate: number) {
      return {
        x: 16,
        y: 16,
        htmlText: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20,10 L 16,5 Z" fill="crimson" stroke="white" stroke-width="1.2" style="transform:rotate(${cursorRotate}deg);transform-origin:16px 16px"/></svg>`,
      }
    }

    type ThemeVars = Record<string, string>
    const themes: { name: string; vars: ThemeVars }[] = [
      { name: 'default', vars: {} },
      {
        name: 'crimson',
        vars: {
          '--vdr-stick-color': 'crimson',
          '--vdr-stick-hover-shadow-color': 'rgb(220 20 60 / 0.3)',
          '--vdr-active-outline-color': 'crimson',
          '--vdr-rotate-line-color': 'crimson',
        },
      },
      {
        name: 'square-large',
        vars: {
          '--vdr-stick-size': '20px',
          '--vdr-stick-border-radius': '2px',
          '--vdr-stick-color': '#52c41a',
          '--vdr-stick-hover-shadow-color': 'rgb(82 196 26 / 0.3)',
          '--vdr-active-outline-color': '#52c41a',
        },
      },
      {
        name: 'minimal',
        vars: {
          '--vdr-stick-size': '8px',
          '--vdr-stick-border-width': '1px',
          '--vdr-stick-color': '#222',
          '--vdr-stick-hover-shadow-width': '2px',
          '--vdr-stick-hover-shadow-color': 'rgb(0 0 0 / 0.2)',
          '--vdr-active-outline-color': '#222',
        },
      },
    ]
    const theme = ref<string>('default')
    const currentTheme = computed<ThemeVars>(
      () => themes.find((t) => t.name === theme.value)?.vars ?? {}
    )

    const boundInitial = centerRectInBoundary(120, 100, 20)
    const boundPos = reactive({ ...boundInitial })
    const initialBoundary = getBoundary()
    const bound = reactive({
      lx0: initialBoundary.x0,
      lx1: initialBoundary.x1,
      ly0: initialBoundary.y0,
      ly1: initialBoundary.y1,
      lock: false,
    })
    const boundKey = ref(0)
    const boundaryHintStyle = computed<CSSProperties>(() => ({
      position: 'absolute',
      left: `${bound.lx0}px`,
      top: `${bound.ly0}px`,
      width: `${bound.lx1 - bound.lx0}px`,
      height: `${bound.ly1 - bound.ly0}px`,
      pointerEvents: 'none',
    }))
    const nestedChildBoundaryStyle: CSSProperties = {
      position: 'absolute',
      left: '12px',
      top: '12px',
      width: '256px',
      height: '196px',
      pointerEvents: 'none',
    }

    function updateBound(pos: any) {
      boundTouched.value = true
      boundPos.x = pos.x
      boundPos.y = pos.y
      boundPos.w = pos.w
      boundPos.h = pos.h
      boundPos.r = pos.r
    }
    function resetBound() {
      Object.assign(boundPos, centerRectInBoundary(120, 100, 20, stageSize.width, stageSize.height))
      boundTouched.value = false
      bound.lock = false
      boundKey.value++
    }

    function syncLimitBoundary() {
      const boundary = getBoundary(stageSize.width, stageSize.height)
      bound.lx0 = boundary.x0
      bound.lx1 = boundary.x1
      bound.ly0 = boundary.y0
      bound.ly1 = boundary.y1
      Object.assign(boundedMinMaxRect, centerRectInBoundary(140, 110, 10, stageSize.width, stageSize.height))
      Object.assign(boundedNestedRoot, centerRectInBoundary(280, 220, 0, stageSize.width, stageSize.height))
      if (!boundTouched.value) {
        Object.assign(boundPos, centerRectInBoundary(120, 100, 20, stageSize.width, stageSize.height))
        boundKey.value++
      }
    }

    onMounted(() => {
      nextTick(() => {
        if (!limitStageRef.value) return

        const syncStageSize = () => {
          if (!limitStageRef.value) return
          const rect = limitStageRef.value.getBoundingClientRect()
          stageSize.width = Math.round(rect.width)
          stageSize.height = Math.round(rect.height)
        }

        syncStageSize()
        stageResizeObserver = new ResizeObserver(syncStageSize)
        stageResizeObserver.observe(limitStageRef.value)
      })
    })

    onBeforeUnmount(() => {
      stageResizeObserver?.disconnect()
    })

    watch(() => [stageSize.width, stageSize.height], syncLimitBoundary, { immediate: true })

    return {
      basic,
      updateBasic,
      fmt,
      flipCount,
      flags,
      limitStageRef,
      centerRect180x140,
      lockedRect,
      minMaxRect,
      flipRect,
      nestedRoot,
      nestedClipped,
      redArrowRender,
      themes,
      theme,
      currentTheme,
      boundPos,
      bound,
      boundKey,
      updateBound,
      resetBound,
      boundaryHintStyle,
      nestedChildBoundaryStyle,
      boundedMinMaxRect,
      boundedNestedRoot,
    }
  },
})
</script>

<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f6f7f9;
}
.page {
  min-height: 100vh;
}
.topbar {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
}
.topbar h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.topbar p {
  margin: 6px 0 0;
  color: #888;
  font-size: 12px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 16px;
  padding: 16px;
}
.scene {
  height: 530px;
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  padding: 14px;
  display: grid;
  grid-template-rows: 110px 380px;
  gap: 12px;
}
.scene-info {
  min-height: 0;
  overflow: hidden;
}
.scene h2 {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}
.scene .info {
  min-height: 36px;
  max-height: 36px;
  margin: 0 0 8px;
  color: #888;
  font-size: 12px;
  line-height: 18px;
  font-family: ui-monospace, monospace;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.stage {
  position: relative;
  width: 100%;
  height: 380px;
  justify-self: center;
  background: repeating-conic-gradient(#f0f0f0 0% 25%, #fafafa 0% 50%) 0 / 16px 16px;
  border-radius: 4px;
  overflow: hidden;
}
.toggles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  min-height: 24px;
  font-size: 12px;
  color: #555;
}
.toggles button {
  height: 24px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #555;
  cursor: pointer;
}
.boundary-hint {
  position: absolute;
  pointer-events: none;
}
.boundary-hint--orange {
  border: 2px dashed #fa541c;
}
.boundary-hint--cyan {
  border: 2px dashed #13c2c2;
}
.vdr-fill {
  width: 100%;
  height: 100%;
}
.vdr-fill::before {
  content: attr(data-label);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #fff;
  font-size: 13px;
  text-align: center;
  pointer-events: none;
  user-select: none;
}
.vdr-fill--root,
.vdr-fill--clip-root {
  background: #2db7f5;
}
.vdr-fill--child-a,
.vdr-fill--clip-child {
  background: #fa8c16;
}
.vdr-fill--child-b {
  background: #722ed1;
}
.card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  background: #2db7f5;
  color: #fff;
  font-size: 13px;
  user-select: none;
}
.card.alt {
  background: #722ed1;
}
.card.warn {
  background: #fa8c16;
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .stage {
    width: 100%;
  }
}
</style>







