<template>
  <div class="vdr-demo-stage">
    <vdr
      v-bind="minMaxRect"
      :min-width="80"
      :min-height="80"
      :max-width="240"
      :max-height="200"
    >
      <div class="vdr-demo-card vdr-demo-card--warn">min/max</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { centerRect } from './helpers'

const minMaxRect = centerRect(160, 120)
</script>
