<template>
  <div class="vdr-demo-stage">
    <vdr overflow="hidden" v-bind="flipRect" @fliped="flipCount++">
      <div class="vdr-demo-card vdr-demo-card--success">拖拽触点实现翻转</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { centerRect } from './helpers'

const flipRect = centerRect(160, 120)
const flipCount = ref(0)

defineExpose({ flipCount })
</script>
