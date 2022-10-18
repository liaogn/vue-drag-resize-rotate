<template>
  <div class="drawWrap drawWrap_test2">
    <wrapDesc title="可选触点" />
    <vdr
        :sticks="['tl', 'tm', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']"
        :w="rect.w"
        :h="rect.h"
        :r="rect.r"
        :x="150"
        :y="rect.y"
        :z="rect.z"
        :bg="rect.bg"
        :lock="rect.lock"
        :active="rect.active"
    />
    <vdr
        :sticks="['tl', 'tm', 'mr', 'ml', 'bm','angle']"
        :w="rect.w"
        :h="rect.h"
        :r="rect.r"
        :x="450"
        :y="rect.y"
        :z="rect.z"
        :bg="rect.bg"
        :lock="rect.lock"
        :active="rect.active"
    />

    <div class="codeBox">
      <highlightjs class="myHljs" language='html' :code="codeHTML" />
      <highlightjs class="myHljs" language='javascript' :code="codeJS" />
    </div>
    
  </div>
</template>
<script>
import testImage from '../img/test_1.jpg'
let codeHTML = ` 
 <!-- 默认 sticks="['tl', 'tm', 'angle', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']" -->

 <vdr :sticks="['tl', 'tm', 'tr', 'mr', 'ml', 'bl', 'bm', 'br']" />

 <vdr :sticks="['tl', 'tm', 'mr', 'ml', 'bm','angle']" />
`
let codeJS = `

`
export default {
name: 'test_1',
data() {
  return {
    testImage,
    showData: {},
    rect:{
      w: 200,
      h: 182,
      left: 300,
      y: 100,
      r: 0,
      z:99,
      lock: false,
      active: true,
      bg:testImage,
    },
    codeHTML:codeHTML,
    codeJS:codeJS
  }
},
created(){
  this.showData = this.rect
},
mounted() {

},
methods: {
  clickEmpty() {
    this.test.isActive = false
    console.log('active设为false:移除选中状态')
  },
  dragStop(res){
    this.showData = res
  },
  dragStart(res){
    this.showData = res
  },
  dragging(res){
    this.showData = res
  },
  rotateStart(res){
    this.showData = res
  },
  rotating(res){
    this.showData = res
  },
  rotateStop(res){
    this.showData = res
  },
  resizeStart(res){
    this.showData = res
  },
  resizing(res){
    this.showData = res
  },
  resizeStop(res){
    this.showData = res
  },
  activated(res){
    this.showData = res
    this.rect.active = true
  }
},
}
</script>
<style>
.drawWrap_test2{
  height: 500px !important;
}
.drawWrap_test2 .vdr {
  background-size: cover;
}
.drawWrap_test2 .codeBox{
  bottom: 20px;
  height: auto;
}
</style>

