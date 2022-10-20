<template>
  <div class="drawWrap drawWrap_test3" ref="drawWrap">
    <wrapDesc title="动作控制" />
    <vdr
        :draggable="false"
        :w="rect.w"
        :h="rect.h"
        :r="rect.r"
        :x="40"
        :y="rect.y"
        :z="rect.z"
        :lock="rect.lock"
        :active="active1"
        style="outline:1px solid #999"
    >
    <p>不可拖动</p>
    </vdr>
    <vdr
        :rotateable="false"
        :w="rect.w"
        :h="rect.h"
        :r="rect.r"
        :x="230"
        :y="rect.y"
        :z="rect.z"
        :lock="rect.lock"
        :active="active2"
        style="outline:1px solid #999"
    >
    <p>不可旋转</p>
   </vdr>
   <vdr
        :resizeable="false"
        :w="rect.w"
        :h="rect.h"
        :r="rect.r"
        :x="420"
        :y="rect.y"
        :z="rect.z"
        :lock="rect.lock"
        :active="active3"
        style="outline:1px solid #999"
    >
    <p>不可缩放</p>
   </vdr>
   <vdr
        :activeable="false"
        :w="rect.w"
        :h="rect.h"
        :r="rect.r"
        :x="610"
        :y="rect.y"
        :z="rect.z"
        :lock="rect.lock"
        :active="active4"
        style="outline:1px solid #999"
    >
    <p>不可选中</p>
   </vdr>

    <div class="codeBox">
      <highlightjs v-if="codeHTML" class="myHljs" language='html' :code="codeHTML" />
    </div>
    
  </div>
</template>
<script>
import testImage from '../img/test_1.jpg'
let codeHTML = ` 
 <!-- 默认 draggable="true" rotateable="true" resizeable="true"  activeable="true"-->

 <!--这里自己加的outline为了演示，当active为false未选中时，是没有触点和outline的-->

 <!--这里的选中逻辑在demo里，通过控制每个vdr的ative值来、实现-->

 <vdr draggable="true" :active="xxx" style="outline:1px solid #999"/>

 <vdr rotateable="true" :active="xxx" style="outline:1px solid #999"/>

 <vdr resizeable="true" :active="xxx" style="outline:1px solid #999"/>

 <vdr activeable="true" :active="xxx" style="outline:1px solid #999"/>
 `
export default {
name: 'test_3',
data() {
  return {
    testImage,
    showData: {},
    active1:true,
    active2:false,
    active3:false,
    active4:false,
    rect:{
      w: 150,
      h: 150,
      left: 300,
      y: 100,
      r: 0,
      z:99,
      lock: false,
      active: true,
      bg:testImage,
    },
    codeHTML:codeHTML,
  }
},
created(){
  this.showData = this.rect
},
mounted() {
  // document.documentElement.addEventListener('mousedown', ()=>{
  //     this.active1 = false;
  //     this.active2 = false;
  //     this.active3 = false;
  //     this.active4 = false;
  // })
  const vdrs =  this.$refs.drawWrap.querySelectorAll('.vdr')
  vdrs.forEach((vdr,index)=>{
    vdr.addEventListener('click',()=>{
      if(index===3) return
      this.active1 = false;
      this.active2 = false;
      this.active3 = false;
      this.active4 = false;
      this[`active${index+1}`] = true
    })
  })
  // this.$refs.drawWrap.addEventListener('click',(event)=>{
  //   console.log(event.target);
  // })
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
.drawWrap_test3{
  height: 540px !important;
}
.drawWrap_test3 .vdr {
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawWrap_test3 .codeBox{
  bottom: 20px;
  height: auto;
}
</style>


