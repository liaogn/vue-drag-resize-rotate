<template>
  <div @click.stop class="drawWrap">
    <vdr :x="350" :y="70"></vdr>
    <div class="codeBox">
      <highlightjs class="myHljs" language='html' :code="codeHTML" />
      <highlightjs class="myHljs" language='javascript' :code="codeJS" />
    </div>
    
  </div>
</template>
<script>
import testImage from '../img/test_1.jpg'
let codeHTML = ` 
<vdr
  :activeable="true"
  :draggable="true"
  :resizeable="true"
  :rotateable="true"
  :sticks="['tl', 'tm', 'angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
  :w="rect.w"
  :h="rect.h"
  :r="rect.r"
  :x="rect.x"
  :y="rect.y"
  :bg="rect.bg"
  :lock="rect.lock"
  :active="rect.isActive">
</vdr>`
let codeJS = `
data(){
  rect:{
      w: 200,
      h: 182,
      x: 300,
      y: 100,
      r: 0,
      lock: true,
      isActive: true,
      bg:testImage,
  }
}
`
export default {
name: 'test_1',
data() {
  return {
    testImage,
    posData: {},
    rect:{
      w: 200,
      h: 182,
      x: 300,
      y: 100,
      r: 0,
      z:99,
      lock: true,
      isActive: true,
      bg:testImage,
    },
    codeHTML:codeHTML,
    codeJS:codeJS
  }
},
computed: {},
created() {},
mounted() {},
methods: {
  clickEmpty() {
    this.test.isActive = false
    console.log('active设为false:移除选中状态')
  },
},
}
</script>

