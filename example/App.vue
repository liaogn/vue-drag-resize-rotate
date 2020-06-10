<template>
  <div @click="clickEmpty" id="app">
    <div class="drawWrap">
      <p style="text-align:center;line-height:40px">click this blue box</p>
      <VueDragResizeRotate :active="test.isActive" :activeable="true" :draggable="true" :h="test.h" :r="test.r" :resizeable="true" :rotateable="true" :w="test.w" :x="test.x" :y="test.y" @activated="activated" @dragging="dragging" @resizing="resizing" @rotating="rotating">
        <p style="text-align:center">left: {{ posData.left }}</p>
        <p style="text-align:center">top: {{ posData.top }}</p>
        <p style="text-align:center">width: {{ posData.width }}</p>
        <p style="text-align:center">height: {{ posData.height }}</p>
        <p style="text-align:center">rotate: {{ posData.rotate }}</p>
      </VueDragResizeRotate>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      test: {
        id: '1',
        w: 200,
        h: 200,
        x: 170,
        y: 200,
        r: 0,
        isActive: false,
      },
      posData: {},
    };
  },
  computed: {},
  created() {
    let { w, h, x, y, r } = this.test;
    this.posData.width = w;
    this.posData.height = h;
    this.posData.left = x;
    this.posData.top = y;
    this.posData.rotate = r;
  },
  methods: {
    dragging(pos) {
      this.posData = pos;
    },
    resizing(pos) {
      this.posData = pos;
    },
    rotating(pos) {
      this.posData = pos;
    },
    activated() {
      this.test.isActive = true;
    },
    clickEmpty() {
      this.test.isActive = false;
    },
  },
};
</script>
<style lang="css">
@import './style/public.css';
html,
body,
#app,
.page,
.pageWrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawWrap {
  width: 540px;
  height: 700px;
  position: relative;
  background-color: #fff;
  overflow: hidden;

  box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.2);
}
.vdr-slot p {
  width: 100%;
  line-height: 30px;
  font-size: 20px;
}
.vdr-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
