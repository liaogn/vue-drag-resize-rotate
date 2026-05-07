<template>
  <div class="example-stage">
    <vdr v-bind="nestedRoot" />
  </div>
</template>

<script setup lang="ts">
const nestedRoot = {
  w: 320,
  h: 220,
  x: 30,
  y: 30,
  r: 0,
  uuid: 'root',
  childrens: [
    { w: 140, h: 100, x: 30, y: 30, r: 15, uuid: 'child-1' },
    { w: 90, h: 90, x: 200, y: 100, r: -10, lock: true, uuid: 'child-2' },
  ],
}
</script>

<style scoped>
.example-stage {
  position: relative;
  height: 320px;
  background: repeating-conic-gradient(#f5f5f5 0% 25%, #fff 0% 50%) 0 / 16px 16px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
