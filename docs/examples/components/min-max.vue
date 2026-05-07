<template>
  <div class="example-stage">
    <vdr
      :w="160"
      :h="120"
      :x="40"
      :y="40"
      :min-width="80"
      :min-height="80"
      :max-width="240"
      :max-height="200"
    >
      <div class="example-card">min 80×80 · max 240×200</div>
    </vdr>
  </div>
</template>

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
  background: #2db7f5;
  color: #fff;
  user-select: none;
  font-size: 13px;
}
</style>
