<template>
  <div>
    <div class="example-toggles">
      <label v-for="t in themes" :key="t.name">
        <input type="radio" name="vdr-theme" :value="t.name" v-model="theme" />
        {{ t.name }}
      </label>
    </div>
    <div class="example-stage" :style="currentTheme">
      <vdr :w="180" :h="140" :x="40" :y="40">
        <div class="example-card">themed</div>
      </vdr>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
</script>

<style scoped>
.example-toggles {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #555;
  margin-bottom: 12px;
}
.example-stage {
  position: relative;
  height: 320px;
  background: repeating-conic-gradient(#f5f5f5 0% 25%, #fff 0% 50%) 0 / 16px 16px;
  border-radius: 4px;
  overflow: hidden;
}
.example-card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #722ed1;
  color: #fff;
  user-select: none;
  font-size: 13px;
}
</style>
