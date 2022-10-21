<template>
  <div class="drawWrap drawWrap_test7">
    <wrapDesc title="修改触点hover时的icon" />
    <p style="padding:10px;font-size:13px">使用鼠标移到缩放触点上，查看效果</p>
    <myVdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="rect.x"
      :y="rect.y"
    />
    <div class="codeBox">
      <highlightjs class="myHljs" language="html" :code="codeHTML" />
      <highlightjs class="myHljs" language="javascript" :code="codeJS" />
    </div>
  </div>
</template>
<script>

import myVdr from '../test/vdr/index.vue';
// import testImage from '../img/test_1.jpg'
myVdr.extends = {
  methods:{
    stickHoverRender(cursorRotate){
        return {
          x:16,
          y:16,
          htmlText:`<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" >
            <path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="crimson" stroke="black" style="transform: rotate(${cursorRotate}deg);transform-origin: 16px 16px;"></path>
          </svg>`
        }
    }
  }
}
let codeHTML = ` 
  <vdr
    :w="rect.w"
    :h="rect.h"
    :r="rect.r"
    :x="rect.x"
    :y="rect.y"
  />
`
let codeJS = `
  // hover时的方向图标是使用svg转base64, 然后定义style属性cursor:url(base64....) x y ,auto;来实现的

  // 在组件上实现了可通过extends、mixins或Vue.prototype定义图标渲染回调函数stickHoverRender

  // stickHoverRender要求return返回一个包含svg的字符串，和cursor偏移值x，y（x、y默认值16），函数提供一个回调参数，是当前方向角度，
  // 该参数可插入svg字符串style="transform:rotate(xxxdeg)"里面

  import vdr from '../src/index.js';
  
  // 定义svgIcon渲染函数
  function stickHoverRender(cursorRotate){
    return {
          x:16, // cursor的x偏移值
          y:16, // cursor的y偏移值
          htmlText:\`<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" >
            <path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="crimson" stroke="black" style="transform: rotate(\${cursorRotate}deg);transform-origin: 16px 16px;"></path>
          </svg>\`
        }
  }
  
  // 扩展方法
  vdr.extends = {
    methods:{
      stickHoverRender
    }
  }
  
  // 或mixins

  // 或全局定义
  vdr.$stickHoverRender = stickHoverRender //注意这里有“$”

  Vue.use(vdr);
  
  
`
export default {
  name: 'test_7',
  components:{myVdr},
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
      },
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
   
  },
}
</script>
<style>
.drawWrap_test7{
  height: 950px !important;
}
.drawWrap_test7 .vdr {
  background-size: cover;
}
.drawWrap_test7 .codeBox{
  height: 550px;
  bottom: 30px;
}
</style>
