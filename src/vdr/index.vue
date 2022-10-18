<template>
  <div
    class="vdr"
    :class="_class"
    :style="_style"
    @click.stop
    @mousedown.stop.prevent="bodyDown($event)"
    ref="vdr"
  >
    <!-- 控件 -->
    <template v-if="active && activeable">
      <!-- 尺寸控件 -->
      <span
        :class="`vdr-stick-${stick}`"
        :key="stickIndex"
        :style="{zIndex: activeStickIndex == stickIndex ? 10 : 9}"
        @mousedown.stop.prevent="stickDown($event,stick, stickIndex)"
        @mouseenter="stickMouseenter($event, stick)"
        @mouseout="stickMouseout($event, stick)"
        class="vdr-stick"
        :ref="`stick_${stick}`"
        v-for="(stick, stickIndex) in rotateSticks"
      >
      </span>
      <!-- 旋转控件 -->
      <template v-if="sticks.indexOf('angle') > -1">
        <span class="vdr-stick-rotate-line"></span>
        <span
          @mousedown.stop.prevent="rotateDown($event)"
          :style="{cursor:!this.rotateable?'no-drop':''}"
          class="vdr-stick vdr-angle"
          :ref="`stick_angle`"
        ></span>
      </template>
    </template>
    <div class="childWrap" v-if="_childWrapAttr" v-bind="_childWrapAttr">
        <template v-if="childrens">
          <vdr v-for="child in childrens" v-bind="child" v-on="$listeners"  :key="child.key||child.id"></vdr>
        </template>
        <!-- 插槽 -->
        <slot class="child-vdr"></slot>
    </div>
    <template v-else>
      <template v-if="childrens">
        <vdr v-for="child in childrens" v-bind="child" v-on="$listeners"  :key="child.key||child.id"></vdr>
      </template>
      <!-- 插槽 -->
      <slot class="child-vdr"></slot>
    </template>
  </div>
</template>

<script>
import {getSymStick} from './func/maps'
import RectDrager from './func/drag'
import {RectRotator} from './func/rotate'
import RectFliper from './func/flip'
import {getElementGeometricInfo} from './func/dom'
import {stickMouseenter, stickMouseout} from './func/arrow'
import {
  calcVerticalCrossPoint,
  calcCenterPoint,
  calcRotatedPoint,
  calcRotatedContactor,
} from './func/calc'

export default {
  name: 'vdr',
  props: {
    overflow:{
      type: String,
      default: '',
    },
    uuid:{
      type: [String, Number],
      default: '',
    },
    bg: {
      type: String,
      default: '',
    },
    lock: {
      type: Boolean,
      default: false,
    },
    w: {
      type: Number,
      default: 100,
      validator: function(val) {
        return val >= 0
      },
    },
    h: {
      type: Number,
      default: 100,
      validator: function(val) {
        return val >= 0
      },
    },
    x: {
      type: Number,
      default: 0,
      validator: function(val) {
        return typeof val === 'number'
      },
    },
    y: {
      type: Number,
      default: 0,
      validator: function(val) {
        return typeof val === 'number'
      },
    },
    z: {
      type: [String, Number],
      default: '',
    },
    r: {
      type: Number,
      default: 0,
    },
    sticks: {
      type: Array,
      default: function() {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']
      },
    },
    myStyle:{
      type:Object,
      default:()=>({})
    },
    myClass:{
      type:Object,
      default:()=>({})
    },
    active: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    resizeable: {
      type: Boolean,
      default: true,
    },
    rotateable: {
      type: Boolean,
      default: true,
    },
    activeable: {
      type: Boolean,
      default: true,
    },
    childrens:{
      type: Array,
      default: undefined,
    },
    childWrapAttr:{
      type:Object,
      default:undefined
    }
  },
  data() {
    return {
      width: this.w,
      height: this.h,
      left: this.x,
      top: this.y,
      zIndex: this.z,
      rotate: this.r,
      whRatio: this.w/this.h,
      currentStick: '',
      activeStickIndex: -1,
    }
  },
  computed: {
    _class(){
     const outClass = this.myClass
     const inClass= {'vdr-active':this.active && this.activeable, 'vdr-not-active': !this.activeable}
     return [outClass,inClass]
    },
    _style() {
      const rotate = `rotateZ(${this.rotate}deg)`
      const translate = `translate3d(${this.left}px,${this.top}px,0)`
      let cursor = 'pointer'
      if(this.active){
        cursor = this.draggable ? 'move' : 'no-drop'
      }
      if(!this.activeable) cursor = 'no-drop'
      const rectStyle= {
        zIndex: this.zIndex,
        width: `${this.width}px`,
        height: `${this.height}px`,
        backgroundImage: `url(${this.bg})`,
        transform: `${translate} ${rotate}`,
        cursor: cursor
      }
      return Object.assign({}, this.myStyle, rectStyle)
    },
    _childWrapAttr(){
      if(this.overflow){
        const childWrapAttr = this.childWrapAttr||{}
        const style = Object.assign(childWrapAttr.style||{}, {overflow:this.overflow})
        return Object.assign(childWrapAttr,{style})
      }else{
        return this.childWrapAttr  
      }
       
    },
    rotateSticks() {
      return this.sticks.filter((itme) => itme !== 'angle')
    },
    posData() {
      return {
        x: this.left,
        y: this.top,
        w: this.width,
        h: this.height,
        r: this.rotate,
        z:this.zIndex,
        stick: this.currentStick,
        lock:this.lock,
        active:this.active,
        uuid:this.uuid
      }
    },
  },
  mounted() {
    this.init()
    console.log(this.childWrapAttr);
  },
  beforeDestroy() {
    // 销毁前移除事件
    document.documentElement.removeEventListener('mousemove', this.move)
    document.documentElement.removeEventListener('mouseup', this.up)
  },
  methods: {
    stickMouseout,
    stickMouseenter,
    // 初始化
    init() {
      this.cacheRectDomInfo(this.$el)

      this.RectDrager = new RectDrager()
      this.RectRotator = new RectRotator()
      
      // 将元素的mousemove、mouseup事件委托到document.documentElement
      document.documentElement.addEventListener('mousemove', this.move)
      document.documentElement.addEventListener('mouseup', this.up)
    },
    // mousemove事件回调函数
    move(ev) {
      if (this.draggable && this.RectDrager.isDrag && !this.stickDrag) {
        this.bodyMove(ev)
      }
      if (this.resizeable && this.stickDrag) {
        this.stickMove(ev)
      }
      if (this.rotateable && this.RectRotator.isDrag) {
        this.rotateMove(ev)
      }
    },
    // mousemup事件回调函数
    up(ev) {
      // 拖拽停止
      if (this.draggable && this.RectDrager.isDrag) {
        this.RectDrager.upHandle()
        this.$emit('dragStop', this.posData, ev)
      }
      // 缩放停止
      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false
        this.$emit('resizeStop', this.posData, ev)
      }
      // 旋转停止
      if (this.rotateable && this.RectRotator.isDrag) {
        this.RectRotator.upHandle()
        this.$emit('rotateStop', this.posData, ev)
      }
      // 更新宽高比例，当宽高其中一个为0时，不更新比例
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height
      }
    },
    //元素（拖动）mousedown 事件回调函数
    bodyDown(ev) {
      if (!this.activeable) return
      this.currentStick = ''
      this.RectDrager.downHandle(ev, [this.left, this.top])
      // 触发事件
      if (this.activeable) {
        this.$emit('activated', this.posData, ev)
        this.$emit('dragStart', this.posData, ev)
      }
    },
    //元素（拖动）mousemove 事件回调函数
    bodyMove(ev) {
      // 起始位置信息
      const moveInfo = this.RectDrager.moveHandle(ev)

      // 更新位置信息
      this.left = moveInfo[0]
      this.top = moveInfo[1]
      // 触发拖拽事件
      this.$emit('dragging', this.posData, ev)
    },
    // 元素（旋转）mousedown 事件回调函数
    rotateDown(ev) {
      if (!this.activeable) return
      this.currentStick = 'angle'
      this.RectRotator.downHandle(ev, this.$el, this.rotate)
      this.$emit('rotateStart', this.posData, ev)
    },
    // 元素（旋转）mousemove 事件回调函数
    rotateMove(ev) {
      this.rotate = this.RectRotator.moveHandle(ev)
      this.$emit('rotating', this.posData, ev)
    },
    // 缓存矩形dom相关信息
    cacheRectDomInfo(element) {
      // 获取当前元素几何信息
      this.elementInfo = getElementGeometricInfo(element)
      // 获取父元素
      this.parentElement = element.parentNode
      // 获取父元素信息
      this.parentInfo = getElementGeometricInfo(this.parentElement)
    },
    //缩放控件的mousedown事件回调函数
    stickDown(ev, stick, index) {
      if (!this.activeable || !this.resizeable) return
      // 记录当前活跃控件
      this.activeStickIndex = index
      // 记录宽高比
      this.whRatio = this.width / this.height
      // 缩放前数据初始化
      this.stickDownHandle(stick)
      this.stickDrag = true
      this.$emit('resizeStart', this.posData, ev)
    },
    // 点击初始化
    stickDownHandle(stick) {
      // 记录当前拖拽的stick
      this.currentStick = stick

      this.cacheRectDomInfo(this.$el)

      // 记录当前点是否为中点
      this.isMiddlePoint = this.currentStick.match('m')

      // 鼠标点击后固定对称点、边界，直至下一次拖拽再更新
      if (this.stickDrag) return
      
      // 计算当前拖拽点的坐标（相对文档左上角,已旋转时的实际坐标）
      this.absoluteContactor = calcRotatedContactor(
        this.elementInfo,
        this.currentStick
      )

      // 计算当前拖拽点的对称点坐标（相对文档左上角,已旋转时的实际坐标）
      this.symAbsoluteContactor = calcRotatedContactor(
        this.elementInfo,
        getSymStick(stick)
      )

      // 计算对称点基于父元素中点旋转复位（jis,相对文档左上角）
      const symRotatedContactor = calcRotatedPoint(
        this.symAbsoluteContactor,
        [this.parentInfo.cx, this.parentInfo.cy],
        this.parentInfo.absoluteRotate
      )

      // 计算对称点相对父元素的点坐标（相对父元素）
      this.symRelativeContactor = [
        symRotatedContactor[0] - this.parentInfo.left,
        symRotatedContactor[1] - this.parentInfo.top,
      ]

      // 创建翻转监听器
      this.RectFliper = new RectFliper(this.elementInfo, stick)
    },
    // 缩放控件的mousemove事件回调函数
    stickMove(ev) {
      let mousePoint = [ev.clientX, ev.clientY]

      // 当拖拽触点为中点（tm,bm,mr,ml）时或锁定比例时，需要特别处理
      if (this.lock || this.isMiddlePoint) {
        // 计算出鼠标点与参考线（当前触点与对称触点构成的直线）垂直相交的点作为当前点
        mousePoint = calcVerticalCrossPoint(
          mousePoint,
          this.absoluteContactor,
          this.symAbsoluteContactor
        )
      }
      // 计算当前元素旋转复位后的几何信息
      const {newMousePoint, newSymPoint} = this.caclRectResetRotated(
        mousePoint,
        this.symRelativeContactor,
        this.parentInfo,
        this.rotate
      )
      // 更新矩形宽高、位置
      this.updateElementInfo(
        newMousePoint,
        newSymPoint,
        this.currentStick,
        this.lock
      )
      // 监听是否翻转，若翻转则执行回调：更新旋转角、初始化矩形状态
      this.RectFliper.borderSignsWatcher(mousePoint, (isDegFlip, sign) => {
        if (isDegFlip) this.rotate += sign === '-' ? -180 : 180
        this.stickDownHandle(this.RectFliper.getFlipStick(this.currentStick))
      })
      this.$emit('resizing', this.posData, ev)
    },
    // 计算矩形旋转复位后的信息
    caclRectResetRotated(mousePoint, symRelativeContactor, parentInfo, rotate) {
      // 计算鼠标点基于父元素中点旋转复位、以及当前元素旋转复位的鼠标点坐标（相对文档左上角）
      const mouseAbsoluteRotatedPoint = calcRotatedPoint(
        mousePoint,
        [parentInfo.cx, parentInfo.cy],
        parentInfo.absoluteRotate
      )

      // 计算鼠标点相对父元素的点坐标
      const mouseRelativeRotatedPoint = [
        mouseAbsoluteRotatedPoint[0] - parentInfo.left,
        mouseAbsoluteRotatedPoint[1] - parentInfo.top,
      ]

      // 当前元素新中心点
      const newCenterPoint = calcCenterPoint(
        mouseRelativeRotatedPoint,
        symRelativeContactor
      )
      // 计算当前元素旋转复位后，鼠标点坐标
      const newMousePoint = calcRotatedPoint(
        mouseRelativeRotatedPoint,
        newCenterPoint,
        rotate
      )

      // 计算当前元素旋转复位后，对称点坐标
      const newSymPoint = calcRotatedPoint(
        symRelativeContactor,
        newCenterPoint,
        rotate
      )
      return {newMousePoint, newSymPoint, newCenterPoint}
    },
    // 根据strick生成对应的矩形渲染函数
    createRenderFunc(stick) {
      return {
        tl(point, symPoint, lock) {
          this.left = point[0]
          this.top = point[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = lock
            ? this.width / this.whRatio
            : Math.abs(point[1] - symPoint[1])
        },
        tm(point, symPoint, lock) {
          this.height = Math.abs(point[1] - symPoint[1])
          this.width = lock ? this.height * this.whRatio : this.width
          this.top = point[1]
          this.left = symPoint[0] - this.width / 2
        },
        tr(point, symPoint, lock) {
          this.left = symPoint[0]
          this.top = point[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = lock
            ? this.width / this.whRatio
            : Math.abs(point[1] - symPoint[1])
        },
        mr(point, symPoint, lock) {
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = lock ? this.width / this.whRatio : this.height
          this.left = symPoint[0]
          this.top = symPoint[1] - this.height / 2
        },
        br(point, symPoint, lock) {
          this.left = symPoint[0]
          this.top = symPoint[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = lock
            ? this.width / this.whRatio
            : Math.abs(point[1] - symPoint[1])
        },
        bm(point, symPoint, lock) {
          this.height = Math.abs(point[1] - symPoint[1])
          this.width = lock ? this.height * this.whRatio : this.width
          this.left = symPoint[0] - this.width / 2
          this.top = symPoint[1]
        },
        bl(point, symPoint, lock) {
          this.left = point[0]
          this.top = symPoint[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = lock
            ? this.width / this.whRatio
            : Math.abs(point[1] - symPoint[1])
        },
        ml(point, symPoint, lock) {
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = lock ? this.width / this.whRatio : this.height
          this.left = point[0]
          this.top = symPoint[1] - this.height / 2
        },
        angle() {},
      }[stick]
    },
    // 更新矩形信息
    updateElementInfo(point, symPoint, stick, lock) {
      const renderFunc = this.createRenderFunc(stick)
      renderFunc && renderFunc.call(this, point, symPoint, lock)
    },
  },
  watch: {
    x(value) {
      this.left = value
    },
    y(value) {
      this.top = value
    },
    w(value) {
      this.width = value
    },
    h(value) {
      this.height = value
    },
    r(value) {
      this.rotate = value
    },
    z(value) {
      this.zIndex = value
    },
  },
}
</script>
<style lang="css" src="./style/index.css"></style>
