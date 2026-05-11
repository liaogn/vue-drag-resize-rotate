<template>
  <div class="vdr-demo-stage">
    <div class="vdr-demo-stage-tools vdr-demo-toggles">
      <label><input type="checkbox" v-model="flags.active" /> active</label>
      <label><input type="checkbox" v-model="flags.draggable" /> draggable</label>
      <label><input type="checkbox" v-model="flags.resizeable" /> resizeable</label>
      <label><input type="checkbox" v-model="flags.rotateable" /> rotateable</label>
    </div>
    <vdr
      v-bind="centerRect180x140"
      :active="flags.active"
      :draggable="flags.draggable"
      :resizeable="flags.resizeable"
      :rotateable="flags.rotateable"
      overflow="hidden"
    >
      <div class="vdr-demo-card">flags</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { centerRect } from './helpers'

const centerRect180x140 = centerRect(180, 140)
const flags = reactive({
  active: true,
  draggable: true,
  resizeable: true,
  rotateable: true,
})
</script>
