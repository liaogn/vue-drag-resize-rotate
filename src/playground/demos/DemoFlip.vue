<template>
  <div class="vdr-demo-stage">
    <vdr overflow="hidden" v-bind="flipRect" @fliped="flipCount++">
      <div class="vdr-demo-card vdr-demo-card--success">
        {{ isEn ? 'Drag a handle to flip' : '拖拽触点实现翻转' }}
      </div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { centerRect } from './helpers'
import { useDemoLocale } from './i18n'

const flipRect = centerRect(160, 120)
const flipCount = ref(0)
const locale = useDemoLocale()
const isEn = computed(() => locale?.value === 'en')

defineExpose({ flipCount })
</script>
