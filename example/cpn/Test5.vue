<template>
  <div class="drawWrap drawWrap_test5" ref="drawWrap">
    <wrapDesc title="样式控制" />
    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="50"
      :y="rect.y"
      :z="rect.z"
      :lock="rect.lock"
      class="vdr_test_1"
    >
      <p>触点透明</p>
    </vdr>
    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="300"
      :y="rect.y"
      :z="rect.z"
      :lock="rect.lock"
      class="vdr_test_2"
      style="outline: 1px solid brown"
    >
      <p>触点框颜色</p>
    </vdr>

    <vdr
      :sticks="[]"
      style="outline: none"
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="550"
      :y="rect.y"
      :z="rect.z"
      :bg="rect.bg"
      :lock="rect.lock"
    >
      <p>无操作框</p>
    </vdr>

    <div class="codeBox">
      <highlightjs
        v-if="codeHTML"
        class="myHljs"
        language="html"
        :code="codeHTML"
      />
    </div>
  </div>
</template>

<script>
import testImage from '../img/test_1.jpg'
let codeHTML = ` 
   <!-- 通过class或style 修改组件边框样式 -->

   <!-- sticks传入一个空数组，则不显示全部触点 -->
  
   <vdr class="vdr_test_1"/>

   <vdr class="vdr_test_2"  style="outline:1px solid brown"/>
   
   <vdr :sticks="[]" style="outline:none"/>
   
   <style>
    .vdr_test_1 .vdr-stick{
      background: transparent;
    }

    .vdr_test_2 .vdr-stick{
      border-radius: 0;
      border-color: brown;
    }
   </style>
 `
export default {
  name: 'test_5',
  data() {
    return {
      testImage,
      showData: {},
      active1: true,
      active2: false,
      active3: false,
      active4: false,
      rect: {
        w: 200,
        h: 200,
        left: 300,
        y: 120,
        r: 0,
        z: 99,
        lock: false,
        active: true,
        bg: testImage,
      },
      codeHTML: codeHTML,
    }
  },
}
</script>
<style>
.drawWrap_test5 {
  height: 700px !important;
}
.drawWrap_test5 .vdr {
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawWrap_test5 .codeBox {
  bottom: 20px;
  height: auto;
}

.vdr_test_1 .vdr-stick {
  background: transparent;
}

.vdr_test_2 .vdr-stick {
  border-radius: 0;
  border-color: brown;
}
</style>
