<template>
  <div class="drawWrap drawWrap_test1">
    <wrapDesc title="组件属性、方法的用法" :showData="showData" />
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
      :z="rect.z"
      :bg="rect.bg"
      :lock="rect.lock"
      :active="rect.active"
      @activated="activated"

      @dragStart="dragStart"
      @dragging="dragging"
      @dragStop="dragStop"

      @rotateStart="rotateStart"
      @rotating="rotating"
      @rotateStop="rotateStop"

      @resizeStart="resizeStart"
      @resizing="resizing"
      @resizeStop="resizeStop"
    />
    <div class="codeBox">
      <highlightjs class="myHljs" language="html" :code="codeHTML" />
      <highlightjs class="myHljs" language="javascript" :code="codeJS" />
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
      :z="rect.z"
      :bg="rect.bg"
      :lock="rect.lock"
      :active="rect.active"
      @activated="activated"

      @dragStart="dragStart"
      @dragging="dragging"
      @dragStop="dragStop"

      @rotateStart="rotateStart"
      @rotating="rotating"
      @rotateStop="rotateStop"

      @resizeStart="resizeStart"
      @resizing="resizing"
      @resizeStop="resizeStop"
    />
`
let codeJS = `
  data() {
    return {
      // 左上角展示的数据
      showData:{},
      // 组件参数数据
      rect: {
        w: 200,
        h: 182,
        x: 300,
        y: 120,
        r: 0,
        z: 99,
        lock: false,
        active: true,
        bg: testImage,
      }
    }
  },
  created() {
    this.showData = this.rect
  },
  mounted() {
    document.documentElement.addEventListener('click', ()=>{
      this.rect.active = false
      this.showData.active = false
    })
  },
  methods: {
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

`
export default {
  name: 'test_1',
  data() {
    return {
      rect: {
        w: 200,
        h: 182,
        x: 300,
        y: 120,
        r: 0,
        z: 99,
        lock: false,
        active: true,
        bg: testImage,
      },
      testImage,
      showData: {},
      codeHTML: codeHTML,
      codeJS: codeJS,
    }
  },
  created() {
    this.showData = this.rect
  },
  mounted() {
    document.documentElement.addEventListener('mousedown', ()=>{
      this.rect.active = false
      this.showData.active = false
      console.log('active设为false:移除选中状态')
    })
  },
  methods: {
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
.drawWrap_test1{
  height: 1230px !important;
}
.drawWrap_test1 .vdr {
  background-size: cover;
}
.drawWrap_test1 .codeBox{
  height: 800px;
  bottom: 40px;
}
</style>
