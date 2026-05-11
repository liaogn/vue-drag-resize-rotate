<template>
  <div class="vdr-demo-stage">
    <vdr overflow="hidden" v-bind="centerRect180x140" :sticks="['tl', 'tr', 'bl', 'br', 'angle']">
      <div class="vdr-demo-card vdr-demo-card--alt">corners only</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { centerRect } from './helpers'

const centerRect180x140 = centerRect(180, 140)
</script>
