<template>
  <div class="drawWrap drawWrap_test4">
    <wrapDesc title="组件（递归）嵌套" :showData="showData" />
    <vdr 
      v-bind="rect"
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
<vdr v-bind="rect"/>
`
let codeJS = `
data() {
    return {
      rect: {
        w: 400,
        h: 350,
        x: 235,
        y: 125,
        r: 0,
        z: 99,
        lock: false,
        active: true,
        uuid:'1',
        childrens:[
          {
            w: 250,
            h: 250,
            x: 70,
            y: 60,
            r: 0,
            lock: true,
            active: true,
            uuid:'2_1',
            overflow:'hidden',
            childrens:[
              {
                w: 60,
                h: 60,
                x: 50,
                y: 50,
                r: 45,
                lock: false,
                active: true,
                uuid:'3_1',
              },
              {
                w: 60,
                h: 60,
                x: 120,
                y: 140,
                r: 45,
                lock: false,
                active: true,
                uuid:'3_2',
              }
            ]
          }
        ]
      }
    }
  },

`
export default {
  name: 'test_1',
  data() {
    return {
      rect: {
        w: 400,
        h: 350,
        x: 235,
        y: 125,
        r: 0,
        z: 99,
        lock: false,
        active: true,
        uuid:'1',
        childrens:[
          {
            w: 250,
            h: 250,
            x: 70,
            y: 60,
            r: 0,
            lock: true,
            active: true,
            uuid:'2_1',
            overflow:'hidden',
            childrens:[
              {
                w: 60,
                h: 60,
                x: 50,
                y: 50,
                r: 45,
                lock: false,
                active: true,
                uuid:'3_1',
              },
              {
                w: 60,
                h: 60,
                x: 120,
                y: 140,
                r: 45,
                lock: false,
                active: true,
                uuid:'3_2',
              }
            ]
          }
        ]
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
.drawWrap_test4{
  height: 1400px !important;
}
.drawWrap_test4 .vdr {
  background-size: cover;
}
.drawWrap_test4 .codeBox{
  height: 800px;
  bottom: 40px;
}
</style>
