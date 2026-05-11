<template>
  <div class="vdr-demo-stage">
    <vdr overflow="hidden" v-bind="centerRect180x140" :stick-hover-render="redArrowRender">
      <div class="vdr-demo-card vdr-demo-card--warn">custom cursor</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { centerRect, redArrowRender } from './helpers'

const centerRect180x140 = centerRect(180, 140)
</script>
