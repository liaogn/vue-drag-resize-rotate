<template>
  <div class="vdr-demo-stage">
    <vdr v-bind="lockedRect" overflow="hidden" :lock="true">
      <div class="vdr-demo-card vdr-demo-card--alt">lock</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { centerRect } from './helpers'

const lockedRect = centerRect(180, 120)
</script>
