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
