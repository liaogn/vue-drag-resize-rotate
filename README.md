## 描述(Describe)

基于 vue2.6 的一个 dom 元素拖拽、缩放和旋转的组件;

支持基本的触点控制、宽高位置范围值、子父级嵌套、锁定定比例和层级等；

支持基本的事件回调，提供元素实时宽高位置信息数据；

目前仅支持 pc 端、px 的 css 单位；后续添加移动端和 rem 自适应；

组件仅实现最基本的拖拽、缩放和旋转核心功能，源码简单清晰可解耦，有较高的扩展性

## 演示(Demo)

## 版本(Version)

目前最新版本为 1.0.9

gitHub 地址：https://github.com/liaogn/vue-drag-resize-rotate

npm 地址：https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate

## 安装(Install)

```javascript
npm i @liaogn/vue-drag-resize-rotate -S
// 或
cnpm i @liaogn/vue-drag-resize-rotate -S
```

## 引入(Import)

1、main.js 全局引入

```javascript
import vueDragResizeRotate from '@liaogn/vue-drag-resize-rotate';
// 如果嫌组件名过长可以自行修改组件名称。如下：使用时直接<vdr>...</vdr>
// vueDragResizeRotate.name='vdr'
Vue.use(vueDragResizeRotate);
```

2、局部引入

```xml
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

基本参数、事件

```xml
<template>
  <div class='yourDiv'>
    <vdr
    :active="isActive"
    :x="100"
    :y="100"
    :w="200"
    :h="200"
    :r="0"
    @activated="activated"

    @dragStart="dragStart"
    @resizeStart="resizeStart"
    @rotateStart="rotateStart"

    @dragging="dragging"
    @resizing="resizing"
    @rotating="rotating"

    @dragStop="dragStop"
    @resizeStop="resizeStop"
    @rotateStop="rotateStop"
    ></vdr>
  </div>
</template>
<script>
import vdr from "@liaogn/vue-drag-resize-rotate";
export default {
  components: { vdr },
  data(){
    return{
      isActive:true
    }
  },
  methods:{
    activated(pos) {
      this.isActive = true;
      console.log('选中当前元素',pos)
    },

    dragStart(pos){
      console.log('拖拽开始',pos)
    },
    resizeStart(pos){
      console.log('缩放开始',pos)
    },
    rotateStart(pos){
      console.log('旋转开始',pos)
    },

    dragging(pos) {
      console.log('拖拽中'，pos)
    },
    resizing(pos) {
      console.log('缩放中'，pos)
    },
    rotating(pos) {
      console.log('旋转中'，pos)
    },

    dragStop(pos){
      console.log('拖拽停止',pos)
    },
    resizeStop(pos){
      console.log('缩放停止',pos)
    },
    rotateStop(pos){
      console.log('旋转停止',pos)
    },
  }
}
</script>
```

## 参数（Props）

1. **:w** 描述：宽 ；类型：Number ； 默认：100，要求：大于 0。
2. **:h** 描述：高 ；类型：Number ； 默认：100，要求：大于 0。
3. **:x** 描述：left ；类型：Number ； 默认：0
4. **:y** 描述：top ；类型：Number ； 默认：0
5. **:r** 描述：旋转角度 ；类型：Number ； 默认：0
6. **:z** 描述：层级 ；类型：Number | String ； 默认：auto
7. **:bg** 描述：背景图片 ；类型：String ； 默认：''"
8. **:lock** 描述：锁定宽高比例 ；类型：Boolean ； 默认：false
9. **:hidden** 描述：隐藏/显示 ；类型：Boolean ； 默认：false
10. **:active** 描述：激活状态 ；类型：Boolean ； 默认：true
11. **:draggable** 描述：是否可拖动 ；类型：Boolean ； 默认：true
12. **:resizeable** 描述：是否可缩放 ；类型：Boolean ； 默认：true
13. **:rotateable** 描述：是否可旋转 ；类型：Boolean ； 默认：true
14. **:activeable** 描述：是否可激活 ；类型：Boolean ； 默认：true
15. **:widthRange**

    描述：宽度范围 ；

    类型：Array ；

    默认：[0,Infinity]；

    说明：取参数 array[0],与 array[0]的最小最大值，与顺无关，如果为其中存在无效值或超出参数 w 的值，则取 0 作为最小值、取 Infinity 作为最大值

16. **:heightRange**

    描述：高度范围 ；

    类型：Array ；

    默认：[0,Infinity]；

    说明：取参数 array[0],与 array[0]的最小最大值，与顺无关，如果为其中存在无效值或超出参数 h 的值，则取 0 作为最小值、取 Infinity 作为最大值；

17. **:sticks**

    描述：控件集；

    类型：Array ；

    默认：['tl', 'tm', 'tr', 'mr', 'ml', 'bl', 'bm', 'br', 'angle'] 对应 8 个缩放控件和旋转控件(不分顺序)

## 事件（Event）

1. **activated(pos) 点击选中元素** 参数：pos [Object] 位置信息
2. **dragStart(pos) 拖拽开始** 参数：pos [Object] 位置信息
3. **dragging(pos) 拖拽中** 参数：pos [Object] 位置信息
4. **dragStop(pos) 拖拽停止** 参数：pos [Object] 位置信息
5. **resizeStart(pos) 缩放开始** 参数：pos [Object] 位置信息
6. **resizing(pos) 缩放中** 参数：pos [Object] 位置信息
7. **resizeStop(pos) 缩放结束** 参数：pos [Object] 位置信息
8. **rotateStart(pos) 旋转开始** 参数：pos [Object] 位置信息
9. **rotating(pos) 旋转中** 参数：pos [Object] 位置信息
10. **rotateStop(pos) 旋转停止** 参数：pos [Object] 位置信息

```javascript
// pos参数详情
{
  left:0,// 相对父元素的left
  top:0,// 相对父元素的top
  widht:200,// 宽
  height:300,// 高
  rotate:0,// 旋转角
  stick:'tl'// 当前操作的控件类型
}
// stick: ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml", "angle"]
```
