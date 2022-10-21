## 描述(Describe)

是一个基于 vue2.6 的一个 dom 元素拖拽、缩放和旋转的vue组件；支持宽高触点控制、翻转、子父级(递归)嵌套、锁定比例、层级等功能；提供事件回调，提供元素实时宽高位置等数据；（注：目前仅支持 pc 端web浏览器）组件目前仅实现了拖拽、缩放和旋转核心功能。组件源码简单清晰，内部功能函数封装度较高、有需要可自行修改扩展或参与一起研究开发;

## 版本(Version)

最新版本：1.10

## 资源地址（source address）

- [gitHub 地址](https://github.com/liaogn/vue-drag-resize-rotate) 
- [npm 地址](https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate) 
- [Demo演示  地址](https://liaogn.github.io/vue-drag-resize-rotate/dist/index.html)

## 安装(Install)

```shell
npm i @liaogn/vue-drag-resize-rotate -S
// 或
cnpm i @liaogn/vue-drag-resize-rotate -S
```

## 引入(Import)

1、main.js 全局引入

```javascript
import vdr from '@liaogn/vue-drag-resize-rotate';
// 如果嫌组件名过长可以自行修改组件名称。如下：使用时直接<vdr>...</vdr>
Vue.use(vdr);
```

2、局部引入

```vue
<template>
  <div class='yourDiv'>
    <vdr :x="100" :y="100"></vdr>
  </div>
</template>
<script>
import vdr from "@liaogn/vue-drag-resize-rotate";
export default {
  components: { vdr },
}
</script>
```



## 使用示例(Use)

组件属性、方法的用法

```vue
<template>
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
    />
<template>
<script>
import testImage from '../img/test_1.jpg'
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
    }
  },
}
</script>
```



## 参数详情（Props）

1. **:w** 描述：宽 ；类型：Number ； 默认：100

2. **:h** 描述：高 ；类型：Number ； 默认：100

3. **:x** 描述：left ；类型：Number ； 默认：0

4. **:y** 描述：top ；类型：Number ； 默认：0

5. **:r** 描述：旋转角度 ；类型：Number ； 默认：0

6. **:z** 描述：层级 ；类型：Number | String ； 默认：auto

7. **:bg** 描述：背景图片 ；类型：String ； 默认：''"

8. **:lock** 描述：锁定宽高比例 ；类型：Boolean ； 默认：false

9. **:active** 描述：激活状态 ；类型：Boolean ； 默认：true

10. **:draggable** 描述：是否可拖动 ；类型：Boolean ； 默认：true

11. **:resizeable** 描述：是否可缩放 ；类型：Boolean ； 默认：true

12. **:rotateable** 描述：是否可旋转 ；类型：Boolean ； 默认：true

13. **:activeable** 描述：是否可激活 ；类型：Boolean ； 默认：true

14. **:uuid** 描述：设置一个唯一id，仅用于需要传递childrens产生嵌套（递归）组件时的key值；类型：String ； 默认：""

15. **:childWrapAttr** 描述：嵌套组件子组件的属性集合；类型：Object； 默认：undefined

16. **:overflow**

    描述：组件插槽包裹overflow（css）属性，如果overflow与childWrapAttr同时定义，则childWrapAttr会合并overflow；

    类型：String； 
    默认：""

17. **:childrens** 描述：嵌套组件子的参数数组；类型：Object； 默认：undefined

18. **:sticks**

    描述：控件集；

    类型：Array ；

    默认：['tl', 'tm', 'tr', 'mr', 'ml', 'bl', 'bm', 'br', 'angle'] 对应 8 个缩放控件和旋转控件(不分顺序)，传入空数组则不显示任何控件。

    

## 事件（Event）

1. **activated(pos, event) 点击选中元素** 参数：pos [Object] 位置信息；event  [Object]  原生事件；
2. **dragStart(pos, event) 拖拽开始** 参数：pos [Object] 位置信息；event [Object]   原生事件；
3. **dragging(pos, event) 拖拽中** 参数：pos [Object] 位置信息；event [Object]   原生事件；
4. **dragStop(pos, event) 拖拽停止** 参数：pos [Object] 位置信息；event [Object]   原生事件；
5. **resizeStart(pos, event) 缩放开始** 参数：pos [Object] 位置信息；event [Object]  原生事件；
6. **resizing(pos, event) 缩放中** 参数：pos [Object] 位置信息；event [Object]  原生事件；
7. **resizeStop(pos, event) 缩放结束** 参数：pos [Object] 位置信息；event [Object]  原生事件；
8. **rotateStart(pos, event) 旋转开始** 参数：pos [Object] 位置信息；event [Object]  原生事件；
9. **rotating(pos, event) 旋转中** 参数：pos [Object] 位置信息；event [Object]  原生事件；
10. **rotateStop(pos, event) 旋转停止** 参数：pos [Object] 位置信息；event [Object]  原生事件；
11. **fliped(pos, event) 翻转** 参数：pos [Object] 位置信息；event [Object]  原生事件；

```javascript
// pos参数详情
{
  uuid:'xxx',// uuid
  left:0,// 相对父元素的left
  top:0,// 相对父元素的top
  widht:200,// 宽
  height:300,// 高
  rotate:0,// 旋转角
  stick:'tl'// 当前操作的控件类型
  lock:false, // 比例是否锁定
  active:true,// 是否在选中状态
  flipSign:'+' // 正向("+")翻转还是反("-")向翻转；
}
```



## 组件嵌套

组件实现了通过传入childrens参数进行组件递归嵌套。嵌套层级是否需要overflow:hidden的效果，可以通过传入参数overflow或childWrapAttr控制样式，若有这两个参数之一，会给子组件包裹一层div，来实现overflow:hidden效果

```vue
<template>
   <vdr v-bind="rect"/>
</template>
<script>
import testImage from '../img/test_1.jpg'
export default {
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
            y: 53,
            r: 30,
            lock: true,
            active: true,
            uuid:'2_1',
            overflow:'hidden',
            childrens:[
             // ...
            ]
          }
        ]
      },
    }
  },
}
</script>
```



## 插槽

组件提供了一个默认插槽

```vue
<template>
   <vdr :w="200" :h="200" >
       <div>我是一个插槽</div>
   </vdr>
   <vdr :w="200" :h="200" >
       <vdr>插槽组件自嵌套</vdr>
   </vdr>
</template>
```



## 控件样式

1、可通过在组件上定义class、style、或选取组件内部class定义css，来修改组件内部控件样式，例如：

```vue
<template>
     <!-- 修改触点框颜色 -->
    <vdr class="vdr_test_2" style="outline: 1px solid brown" />
     <!-- 修改触点background透明 -->
    <vdr class="vdr_test_1">
</template>
<style>
  .vdr_test_2 .vdr-stick {
      border-radius: 0;
      border-color: brown;
  }
  .vdr_test_1 .vdr-stick{
      background: transparent;
  }
</style>    
```

2、通过组件扩展修改触点hover的icon(目前只支持svg)

```js
// main.js（你的组件引入文件）

// hover时的方向图标是使用svg转base64, 然后定义style属性cursor:url(base64....) x y ,auto;来实现的
// 在组件上实现了可通过extends、mixins或Vue.prototype定义图标渲染回调函数stickHoverRender
// stickHoverRender要求return返回一个包含svg的字符串，和cursor偏移值x，y（x、y默认值16）
// 函数提供一个回调参数（当前方向角度），该参数需要插入svg字符串style="transform:rotate(xxxdeg)"里面，控制方向

// extends 扩展组件
vdr.extends = {
  methods:{
    stickHoverRender(cursorRotate){
    return {
          x:16, // cursor的x偏移值
          y:16, // cursor的y偏移值
          htmlText:`<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="crimson" stroke="black" style="transform: rotate(\${cursorRotate}deg);transform-origin: 16px 16px;"></path></svg>`
        }
    }
  }
}

// 或使用mixins

// 或全局定义
Vue.prototype.$stickHoverRender = function(cursorRotate){
    return {
          x:16, // cursor的x偏移值
          y:16, // cursor的y偏移值
          htmlText:`<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="crimson" stroke="black" style="transform: rotate(\${cursorRotate}deg);transform-origin: 16px 16px;"></path></svg>`
        }
}
```

