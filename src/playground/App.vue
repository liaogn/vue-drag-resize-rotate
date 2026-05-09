<template>
  <div class="page">
    <header class="topbar">
      <h1>vue-drag-resize-rotate · playground</h1>
      <p>覆盖核心交互场景，验证迁移 Vue3 后行为与 v1 一致</p>
    </header>

    <main class="grid">
      <!-- 1. 基础：拖 / 缩 / 转 -->
      <section class="scene">
        <h2>1. 基础：拖 / 缩 / 转</h2>
        <p class="info">
          x={{ fmt(basic.x) }} · y={{ fmt(basic.y) }} · w={{ fmt(basic.w) }} · h={{ fmt(basic.h) }}
          · r={{ fmt(basic.r) }}°
        </p>
        <div class="stage">
          <vdr
            :w="basic.w"
            :h="basic.h"
            :x="basic.x"
            :y="basic.y"
            :r="basic.r"
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
        <h2>2. 锁定比例 lock</h2>
        <p class="info">中点和角点缩放时都强制保持宽高比</p>
        <div class="stage">
          <vdr :w="180" :h="120" :x="40" :y="40" :lock="true">
            <div class="card alt">lock</div>
          </vdr>
        </div>
      </section>

      <!-- 3. min / max 限制（不可翻转） -->
      <section class="scene">
        <h2>3. min/max 尺寸限制</h2>
        <p class="info">min: 80×80，max: 240×200。设置了 min 后越过对边不会翻转</p>
        <div class="stage">
          <vdr
            :w="160"
            :h="120"
            :x="40"
            :y="40"
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
        <h2>4. 翻转 fliped</h2>
        <p class="info">未设 min，越过对边触发翻转（fliped 事件计数: {{ flipCount }}）</p>
        <div class="stage">
          <vdr :w="160" :h="120" :x="160" :y="80" :r="0" @fliped="flipCount++">
            <div class="card warn">把我拽过对边</div>
          </vdr>
        </div>
      </section>

      <!-- 5. 嵌套 childrens -->
      <section class="scene">
        <h2>5. 嵌套（childrens）</h2>
        <p class="info">父子级递归，子组件操作时坐标系跟随父级旋转</p>
        <div class="stage">
          <vdr v-bind="nestedRoot" />
        </div>
      </section>

      <!-- 6. 嵌套 + overflow:hidden -->
      <section class="scene">
        <h2>6. 嵌套 + overflow:hidden</h2>
        <p class="info">通过 overflow="hidden" 包一层 childWrap，子元素被父级裁剪</p>
        <div class="stage">
          <vdr v-bind="nestedClipped" />
        </div>
      </section>

      <!-- 7. 控件子集 sticks -->
      <section class="scene">
        <h2>7. 控件子集 sticks</h2>
        <p class="info">只显示四角 + 旋转，不显示中点</p>
        <div class="stage">
          <vdr :w="180" :h="140" :x="40" :y="40" :sticks="['tl', 'tr', 'bl', 'br', 'angle']">
            <div class="card alt">corners only</div>
          </vdr>
        </div>
      </section>

      <!-- 8. 自定义 stickHoverRender -->
      <section class="scene">
        <h2>8. 自定义 cursor (stickHoverRender)</h2>
        <p class="info">把 hover 箭头换成红色双箭头</p>
        <div class="stage">
          <vdr :w="180" :h="140" :x="40" :y="40" :stick-hover-render="redArrowRender">
            <div class="card warn">custom cursor</div>
          </vdr>
        </div>
      </section>

      <!-- 9. 不可激活 / 不可拖 / 不可缩 -->
      <section class="scene">
        <h2>9. 状态开关</h2>
        <p class="info">勾选实时切换 active / draggable / resizeable / rotateable</p>
        <div class="toggles">
          <label><input type="checkbox" v-model="flags.active" /> active</label>
          <label><input type="checkbox" v-model="flags.draggable" /> draggable</label>
          <label><input type="checkbox" v-model="flags.resizeable" /> resizeable</label>
          <label><input type="checkbox" v-model="flags.rotateable" /> rotateable</label>
        </div>
        <div class="stage">
          <vdr
            :w="180"
            :h="140"
            :x="40"
            :y="40"
            :active="flags.active"
            :draggable="flags.draggable"
            :resizeable="flags.resizeable"
            :rotateable="flags.rotateable"
          >
            <div class="card">flags</div>
          </vdr>
        </div>
      </section>

      <!-- 10. CSS 变量主题切换 -->
      <section class="scene">
        <h2>10. CSS 变量主题</h2>
        <p class="info">通过覆写 --vdr-* 变量实现主题切换</p>
        <div class="toggles">
          <label v-for="t in themes" :key="t.name">
            <input type="radio" name="vdr-theme" :value="t.name" v-model="theme" />
            {{ t.name }}
          </label>
        </div>
        <div class="stage" :style="currentTheme">
          <vdr :w="180" :h="140" :x="40" :y="40">
            <div class="card alt">themed</div>
          </vdr>
        </div>
      </section>
      <!-- 11. 边界限制 limit-x / limit-y -->
      <section class="scene">
        <h2>11. 边界限制 limit-x / limit-y</h2>
        <p class="info">
          x=[{{ bound.lx0 }},{{ bound.lx1 }}] · y=[{{ bound.ly0 }},{{ bound.ly1 }}] ·
          pos=({{ fmt(boundPos.x) }},{{ fmt(boundPos.y) }}) · {{ fmt(boundPos.w) }}×{{
            fmt(boundPos.h)
          }} · r={{ fmt(boundPos.r) }}°
        </p>
        <div class="toggles">
          <label>
            x max
            <input type="range" min="120" max="380" step="10" v-model.number="bound.lx1" />
            {{ bound.lx1 }}
          </label>
          <label>
            y max
            <input type="range" min="120" max="320" step="10" v-model.number="bound.ly1" />
            {{ bound.ly1 }}
          </label>
          <label><input type="checkbox" v-model="bound.lock" /> lock</label>
          <button type="button" @click="resetBound">reset</button>
        </div>
        <div class="stage">
          <div
            class="boundary-hint"
            :style="{
              position: 'absolute',
              left: bound.lx0 + 'px',
              top: bound.ly0 + 'px',
              width: bound.lx1 - bound.lx0 + 'px',
              height: bound.ly1 - bound.ly0 + 'px',
              outline: '2px dashed #fa541c',
              pointerEvents: 'none',
            }"
          ></div>
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
        <h2>12. 边界 + min/max（交叉验证）</h2>
        <p class="info">
          limit=[0,280]×[0,240]，min 60×60，max 240×200；缩放在 min 与边界双重约束下正确收敛，翻转已禁用
        </p>
        <div class="stage">
          <div
            class="boundary-hint"
            :style="{
              position: 'absolute',
              left: '0px',
              top: '0px',
              width: '280px',
              height: '240px',
              outline: '2px dashed #13c2c2',
              pointerEvents: 'none',
            }"
          ></div>
          <vdr
            :w="140"
            :h="110"
            :x="30"
            :y="30"
            :r="10"
            :min-width="60"
            :min-height="60"
            :max-width="240"
            :max-height="200"
            :limit-x="[0, 280]"
            :limit-y="[0, 240]"
          >
            <div class="card alt">bounded + min/max</div>
          </vdr>
        </div>
      </section>

      <!-- 13. 嵌套 + limit-x / limit-y -->
      <section class="scene">
        <h2>13. 嵌套 + limit（父子各自的坐标系）</h2>
        <p class="info">
          外层 limit 在 stage 内；子元素 limit 在父 vdr 内（父旋转/缩放后子限制仍生效）
        </p>
        <div class="stage">
          <!-- 外层边界提示（在 stage 坐标系） -->
          <div
            :style="{
              position: 'absolute',
              left: '0px',
              top: '0px',
              width: '320px',
              height: '260px',
              outline: '2px dashed #fa541c',
              pointerEvents: 'none',
            }"
          ></div>
          <vdr
            :w="280"
            :h="220"
            :x="20"
            :y="20"
            :r="0"
            :limit-x="[0, 320]"
            :limit-y="[0, 260]"
            uuid="nest-root"
          >
            <!-- 子元素的边界提示（在父 vdr 坐标系，不带旋转） -->
            <div
              :style="{
                position: 'absolute',
                left: '10px',
                top: '10px',
                width: '260px',
                height: '200px',
                outline: '2px dashed #13c2c2',
                pointerEvents: 'none',
              }"
            ></div>
            <vdr
              :w="120"
              :h="90"
              :x="30"
              :y="30"
              :r="15"
              :limit-x="[10, 270]"
              :limit-y="[10, 210]"
              uuid="nest-child-a"
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
              :limit-x="[10, 270]"
              :limit-y="[10, 210]"
              uuid="nest-child-b"
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
import { computed, defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const basic = reactive({ w: 180, h: 140, x: 40, y: 40, r: 0 })

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
      w: 320,
      h: 220,
      x: 30,
      y: 30,
      r: 0,
      uuid: 'root',
      childrens: [
        {
          w: 140,
          h: 100,
          x: 30,
          y: 30,
          r: 15,
          uuid: 'child-1',
        },
        {
          w: 90,
          h: 90,
          x: 200,
          y: 100,
          r: -10,
          lock: true,
          uuid: 'child-2',
        },
      ],
    }

    const nestedClipped = {
      w: 320,
      h: 220,
      x: 30,
      y: 30,
      r: 0,
      uuid: 'clip-root',
      overflow: 'hidden',
      childrens: [
        {
          w: 200,
          h: 160,
          x: 60,
          y: 30,
          r: 20,
          uuid: 'clip-child',
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

    const boundInitial = { w: 120, h: 100, x: 40, y: 40, r: 20 }
    const boundPos = reactive({ ...boundInitial })
    const bound = reactive({ lx0: 0, lx1: 300, ly0: 0, ly1: 260, lock: false })
    const boundKey = ref(0)
    function updateBound(pos: any) {
      boundPos.x = pos.x
      boundPos.y = pos.y
      boundPos.w = pos.w
      boundPos.h = pos.h
      boundPos.r = pos.r
    }
    function resetBound() {
      Object.assign(boundPos, boundInitial)
      bound.lx0 = 0
      bound.lx1 = 300
      bound.ly0 = 0
      bound.ly1 = 260
      bound.lock = false
      boundKey.value++
    }

    return {
      basic,
      updateBasic,
      fmt,
      flipCount,
      flags,
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
      boundaryHintStyle: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '300px',
        height: '260px',
        outline: '2px dashed #fa541c',
        pointerEvents: 'none',
      } as Record<string, string>,
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
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 16px;
  padding: 16px;
}
.scene {
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  padding: 14px;
  display: flex;
  flex-direction: column;
}
.scene h2 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}
.scene .info {
  margin: 0 0 10px;
  color: #888;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  min-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stage {
  position: relative;
  height: 320px;
  background: repeating-conic-gradient(#f0f0f0 0% 25%, #fafafa 0% 50%) 0 / 16px 16px;
  border-radius: 4px;
  overflow: hidden;
}
.toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #555;
  margin-bottom: 8px;
}
.card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
