<template>
  <div @click="clickEmpty" id="app">
    <div @click.stop class="drawWrap">
      <p style="text-align:center;line-height:40px">click this blue box</p>
      <VueDragResizeRotate
        :active="test.isActive"
        :activeable="true"
        :bg="testImage"
        :draggable="true"
        :h="test.h"
        :heightRange="[300, 20]"
        :lock="test.lock"
        :r="test.r"
        :resizeable="true"
        :rotateable="true"
        :sticks="['tl', 'tm','angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
        :w="test.w"
        :widthRange="[300, 20]"
        :x="test.x"
        :y="test.y"
        @activated="activated"
        @dragging="dragging"
        @dragStart="dragStart"
        @resizeStart="resizeStart"
        @resizeStop="resizeStop"
        @resizing="resizing"
        @rotateStart="rotateStart"
        @rotating="rotating"
        class="test-vdr"
      ></VueDragResizeRotate>
    </div>
  </div>
</template>
<script>
import testImage from "./img/test.jpg";
export default {
  data() {
    return {
      testImage,
      test: {
        id: "1",
        w: 192,
        h: 156,
        x: 170,
        y: 140,
        r: 0,
        lock: false,
        isActive: true
      },
      test2: {
        id: "2",
        w: 100,
        h: 100,
        x: 20,
        y: 20,
        r: 0,
        isActive: true
      },
      posData: {}
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
    activated() {
      this.test.isActive = true;
    },
    dragStart(pos) {
      console.log("拖拽开始", pos);
    },
    resizeStart(pos) {
      console.log("缩放开始", pos.stick);
    },
    rotateStart(pos) {
      console.log("旋转开始", pos);
    },

    dragging(pos) {
      // this.posData = pos;
    },
    resizing(pos) {
      // this.posData = pos;
    },
    rotating(pos) {
      // this.posData = pos;
    },
    dragStop(pos) {
      // console.log("缩放结束", pos.stick);
    },
    resizeStop(pos) {
      // console.log("缩放结束", pos.stick);
    },
    rotateStop(pos) {
      // console.log("缩放结束", pos.stick);
    },

    clickEmpty() {
      this.test.isActive = false;
    }
  }
};
</script>
<style lang="css">
@import "./style/public.css";
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

.test-vdr {
  /* border: 1px solid #000; */
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
