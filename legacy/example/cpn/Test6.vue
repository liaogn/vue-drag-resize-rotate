<template>
  <div class="drawWrap drawWrap_test6" ref="drawWrap">
    <wrapDesc title="插槽" />
    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="50"
      :y="rect.y"
    >
      <vdr :x="20" :y="60"/>
    </vdr>
    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="300"
      :y="rect.y"
    >
    <textarea
      class="storyTextarea" 
      spellcheck="false"
      placeholder="这是一个Textarea，请写出你的故事"
    />
    </vdr>
    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="550"
      :y="rect.y"
    >
      <img :src="testImage" draggable="false"  style="width:80%">
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
   <!-- 组件内部设置默认插槽，将你想要插入的内容放置到组件标签内即可 -->
   
   <!-- 注意1：如插槽为img或a元素，要注意原生draggable属性的影响 -->

   <!-- 注意2：如插为输入框，要注意文本选中时的鼠标事件冲突， 事件冒泡等影响 -->

   <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="50"
      :y="rect.y"
    >
     <vdr :x="20" :y="20"/>
    </vdr>

    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="300"
      :y="rect.y"
    >
    <textarea 
      class="storyTextarea" 
      spellcheck="false"
      placeholder="这是一个Textarea，请写出你的故事"
    />
    <!-- 阻止冒泡，会导致元素拖拽失败，可以尝试边缘留白拖拽边缘，或使用额外开关（锁）处理 -->
    <!-- <textarea
      @mousedown.stop
      class="storyTextarea" 
      spellcheck="false"
      placeholder="这是一个Textarea，请写出你的故事"
    />-->
    </vdr>

    <vdr
      :w="rect.w"
      :h="rect.h"
      :r="rect.r"
      :x="550"
      :y="rect.y"
    >
      <img :src="testImage" draggable="false"  style="width:80%">
    </vdr>
 `
export default {
  name: 'test_1',
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
.drawWrap_test6 {
  height: 1100px !important;
}
.drawWrap_test6 .vdr {
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawWrap_test6 .codeBox {
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
.storyTextarea{
  width: 100%;
  height: 100%;
  position: relative;
  text-indent: 10px;
  padding: 5px;
  resize: none;
  /* cursor: move; */
}
</style>
