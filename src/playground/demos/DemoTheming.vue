<template>
  <div class="vdr-demo-stage" :style="currentTheme">
    <div class="vdr-demo-stage-tools vdr-demo-toggles">
      <label v-for="t in themes" :key="t.name">
        <input type="radio" name="vdr-theme" :value="t.name" v-model="theme" />
        <span>{{ t.name }}</span>
      </label>
    </div>
    <vdr overflow="hidden" v-bind="centerRect180x140">
      <div class="vdr-demo-card vdr-demo-card--alt">themed</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { centerRect, themes, type ThemeVars } from './helpers'

const centerRect180x140 = centerRect(180, 140)
const theme = ref<string>('default')
const currentTheme = computed<ThemeVars>(
  () => themes.find((t) => t.name === theme.value)?.vars ?? {}
)
</script>
