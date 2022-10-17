<template>
  <div @click="clickEmpty" id="app">
    <div @click.stop class="drawWrap" id="drawWrap">
      <p style="text-align:center;line-height:40px">click this blue box</p>
      <p>left:{{ posData.left }}</p>
      <p>top:{{ posData.top }}</p>
      <p>width:{{ posData.width }}</p>
      <p>height:{{ posData.height }}</p>
      <p>stick:{{ posData.stick }}</p>
      <p>rotate:{{ posData.rotate }}</p>
      <div class="test_canzhao1" v-if="0"></div>
      <div class="test_canzhao2" v-if="0"></div>
      <span class="aux_dot" :style="{left: `${0}px`, top: `${0}px`}"></span>
      <div class="myTest" v-if="0" ref="myTest" :style="myTestStyle"></div>
            <!-- <vdr
          :active="test.isActive"
          :activeable="true"
          :draggable="true"
          :h="500"
          :r="45"
          :lock="false"
          :resizeable="true"
          :rotateable="true"
          :sticks="['tl', 'tm', 'angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
          :w="500"
          :x="100"
          :y="100"
          class="test-vdr"
        > -->
      <vdr
          :active="test.isActive"
          :activeable="true"
          :draggable="true"
          :h="300"
          :r="45"
          :lock="false"
          :resizeable="true"
          :rotateable="true"
          :sticks="['tl', 'tm', 'angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
          :w="300"
          :x="100"
          :y="100"
          class="test-vdr"
        >
      <vdr
        v-if="1"
        :active="test.isActive"
        :activeable="true"
        :draggable="true"
        :h="test.h"
        :lock="test.lock"
        :r="30"
        :resizeable="true"
        :rotateable="true"
        :widthRange="[50,200]"
        :heightRange="[50,200]"
        :sticks="['tl', 'tm', 'angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
        :w="test.w"
        :x="test.x"
        :y="test.y"
        class="test-vdr">
              <!-- <vdr
          :active="test.isActive"
          :activeable="true"
          :draggable="true"
          :h="20"
          :r="-45"
          :lock="false"
          :resizeable="true"
          :rotateable="true"
          :sticks="['tl', 'tm', 'angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
          :w="20"
          :x="10"
          :y="10"
          class="test-vdr"
        /> -->
        </vdr>
      </vdr>
            <!-- </vdr> -->
    </div>
  </div>
</template>
<script>
import testImage from './img/test.jpg'
export default {
  name: 'app',
  data() {
    return {
      testImage,
      myTestStyle: {},
      test: {
        id: '1',
        w: 100,
        h: 100,
        x: 100,
        y: 100,
        r: 0,
        lock: false,
        isActive: true,
      },
      test2: {
        id: '2',
        w: 300,
        h: 300,
        x: 40,
        y: 100,
        r: 0,
        isActive: true,
      },
      test3: {
        id: '3',
        w: 200,
        h: 200,
        x: 40,
        y: 60,
        r: 0,
        isActive: true,
      },
      posData: {},
    }
  },
  computed: {},
  created() {},
  mounted() {

    /**
     * 数据结构
     *  
     */


  },
  methods: {
    clickEmpty() {
      this.test.isActive = false
      console.log('active设为false:移除选中状态')
    },
  },
}
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
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
}
body {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
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
.parentBox {
  position: absolute;
  width: 400px;
  height: 400px;
  top: 100px;
  left: 80px;
  border: 1px solid skyblue;
}

.test_canzhao1 {
  width: 300px;
  height: 300px;
  position: absolute;
  left: 170px;
  top: 240px;
  background: red;
}
.test_canzhao2 {
  width: 300px;
  height: 300px;
  position: absolute;
  left: 170px;
  top: 240px;
  background: skyblue;
  transform: rotateZ(30deg);
}
.aux_dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  background-color: red;
  position: absolute;
  z-index: 9999;
}

.myTest {
  width: 200px;
  height: 200px;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(100px, 200px);
  border: 1px solid darkcyan;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.test_box{
  width: 100px;
  height: 100px;
  position: absolute;
  transform: rotate(45deg);
  left: 100px;
  top: 100px;
  border: 1px solid red;
}
</style>
