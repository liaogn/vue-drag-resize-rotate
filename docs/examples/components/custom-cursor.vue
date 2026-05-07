<template>
  <div class="example-stage">
    <vdr :w="180" :h="140" :x="40" :y="40" :stick-hover-render="redArrowRender">
      <div class="example-card">custom cursor</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
function redArrowRender(cursorRotate: number) {
  return {
    x: 16,
    y: 16,
    htmlText: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20,10 L 16,5 Z" fill="crimson" stroke="white" stroke-width="1.2" style="transform:rotate(${cursorRotate}deg);transform-origin:16px 16px"/></svg>`,
  }
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
.example-card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fa8c16;
  color: #fff;
  user-select: none;
  font-size: 13px;
}
</style>
