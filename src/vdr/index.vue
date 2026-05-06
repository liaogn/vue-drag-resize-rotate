<template>
  <div
    class="vdr"
    :class="_class"
    :style="_style"
    @click.stop
    @mousedown.stop="bodyDown($event)"
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
        @mouseenter="stickMouseenter($event, stick,{hoverRender})"
        @mouseout="stickMouseout($event, stick)"
        class="vdr-stick"
        :ref="`stick_${stick}`"
        v-for="(stick, stickIndex) in resizeSticks"
      >
      </span>
      <!-- 旋转控件 -->
      <template v-if="_sticks.indexOf('angle') > -1">
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
          <vdr v-for="(child,index) in childrens" v-bind="child" v-on="$listeners" :key="child.uuid||`child_${index}`"></vdr>
        </template>
        <!-- 插槽 -->
        <slot class="child-vdr"></slot>
    </div>
    <template v-else>
      <template v-if="childrens">
        <vdr v-for="(child,index) in childrens" v-bind="child" v-on="$listeners" :key="child.uuid||`child_${index}`"></vdr>
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
    minWidth: {
      type: Number,
      default: 0,
      validator: function(val) {
        return val >= 0
      },
    },
    minHeight: {
      type: Number,
      default: 0,
      validator: function(val) {
        return val >= 0
      },
    },
    maxWidth: {
      type: Number,
      default: Infinity,
      validator: function(val) {
        return val >= 0
      },
    },
    maxHeight: {
      type: Number,
      default: Infinity,
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
      whRatio: 1,
      currentStick: '',
      activeStickIndex: -1,
      hoverRender:undefined,
      flipSign:'',
    }
  },
  computed: {
    _sticks(){
     if(!this.sticks) {
       return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']
     }
     return this.sticks
    },
    _class(){
     const inClass= {'vdr-active':this.active && this.activeable, 'vdr-not-active': !this.activeable}
     return [inClass]
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
      return Object.assign({}, rectStyle)
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
    resizeSticks() {
      return this._sticks.filter((itme) => itme !== 'angle')
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
        uuid:this.uuid,
        flipSign:this.flipSign
      }
    },
  },
  created(){
    // 自定义触点hover样式函数，可由组件安装前时通过mixins或extends导入
    this.hoverRender = this.stickHoverRender || this.$stickHoverRender
  },
  mounted() {
    this.syncWhRatio()
    this.limitCurrentSize()
    this.$nextTick(() => {
      this.init()
    })
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
      this.syncWhRatio()
    },
    //元素（拖动）mousedown 事件回调函数
    bodyDown(ev) {
      if (!this.activeable) return
      this.currentStick = ''
      this.RectDrager.downHandle(ev, [this.left, this.top], this.$el)
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
      this.syncWhRatio()
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
      // 设置最小尺寸时，缩放到最小值即停止，不再越过边界触发翻转
      if (!this.hasMinSizeLimit()) {
        // 监听是否翻转，若翻转则执行回调：更新旋转角、初始化矩形状态
        this.RectFliper.borderSignsWatcher(mousePoint, (isDegFlip, sign) => {
          this.flipSign = sign
          if (isDegFlip) this.rotate += this.flipSign === '-' ? -180 : 180
          this.$emit('fliped',this.posData, ev)
          this.stickDownHandle(this.RectFliper.getFlipStick(this.currentStick))
        })
      }
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
    // 获取当前宽高限制，若max小于min则以min为准
    getSizeLimits() {
      const minWidth = Math.max(0, this.minWidth)
      const minHeight = Math.max(0, this.minHeight)
      const maxWidth = Math.max(minWidth, this.maxWidth)
      const maxHeight = Math.max(minHeight, this.maxHeight)
      return {minWidth, minHeight, maxWidth, maxHeight}
    },
    // 是否设置了最小尺寸，设置后默认不允许翻转
    hasMinSizeLimit() {
      const {minWidth, minHeight} = this.getSizeLimits()
      return minWidth > 0 || minHeight > 0
    },
    // 限制数值范围
    clampSize(value, min, max) {
      return Math.min(Math.max(value, min), max)
    },
    // 同步当前宽高比，宽高其一为0或非有限值时保持原值（默认1）
    syncWhRatio() {
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height
      }
    },
    // 获取可用于锁定宽高比的比例
    getValidWhRatio() {
      return isFinite(this.whRatio) && this.whRatio > 0 ? this.whRatio : 1
    },
    // 根据限制生成最终宽高；lock时会同步折算另一边的限制，保持宽高比
    getLimitedSize(width, height, lock, baseAxis = 'width') {
      const {minWidth, minHeight, maxWidth, maxHeight} = this.getSizeLimits()
      let nextWidth = Math.max(0, width)
      let nextHeight = Math.max(0, height)

      if (!lock) {
        return {
          width: this.clampSize(nextWidth, minWidth, maxWidth),
          height: this.clampSize(nextHeight, minHeight, maxHeight),
        }
      }

      const ratio = this.getValidWhRatio()
      if (baseAxis === 'height') {
        const heightMin = Math.max(minHeight, minWidth / ratio)
        const heightMax = Math.max(heightMin, Math.min(maxHeight, maxWidth / ratio))
        nextHeight = this.clampSize(nextHeight, heightMin, heightMax)
        nextWidth = nextHeight * ratio
      } else {
        const widthMin = Math.max(minWidth, minHeight * ratio)
        const widthMax = Math.max(widthMin, Math.min(maxWidth, maxHeight * ratio))
        nextWidth = this.clampSize(nextWidth, widthMin, widthMax)
        nextHeight = nextWidth / ratio
      }

      return {
        width: nextWidth,
        height: nextHeight,
      }
    },
    // 当前尺寸受外部props变化影响时，同步落在限制范围内
    limitCurrentSize() {
      const {width, height} = this.getLimitedSize(this.width, this.height, this.lock)
      this.width = width
      this.height = height
    },
    // 获取触点在未旋转矩形内的坐标
    getStickPoint(stick, width, height) {
      return {
        tl: [0, 0],
        tm: [width / 2, 0],
        tr: [width, 0],
        mr: [width, height / 2],
        br: [width, height],
        bm: [width / 2, height],
        bl: [0, height],
        ml: [0, height / 2],
      }[stick]
    },
    // 根据固定的对称触点反推受限后的矩形位置，避免旋转状态下缩放被min/max截断时发生位移
    renderLimitedRect(width, height, stick) {
      const symStick = getSymStick(stick)
      const symPoint = this.getStickPoint(symStick, width, height)

      if (!symPoint || !this.symRelativeContactor) {
        this.width = width
        this.height = height
        return
      }

      const centerOffset = [
        symPoint[0] - width / 2,
        symPoint[1] - height / 2,
      ]
      const rotatedCenterOffset = calcRotatedPoint(centerOffset, [0, 0], -this.rotate)
      const centerPoint = [
        this.symRelativeContactor[0] - rotatedCenterOffset[0],
        this.symRelativeContactor[1] - rotatedCenterOffset[1],
      ]

      this.width = width
      this.height = height
      this.left = centerPoint[0] - width / 2
      this.top = centerPoint[1] - height / 2
    },
    // 设置最小尺寸时不可翻转，越过对边后的距离按0处理，由min尺寸接管
    getResizeWidth(point, symPoint, stick) {
      let raw
      if (stick.includes('l')) raw = symPoint[0] - point[0]
      else if (stick.includes('r')) raw = point[0] - symPoint[0]
      else return this.width
      return this.hasMinSizeLimit() ? Math.max(0, raw) : Math.abs(raw)
    },
    // 设置最小尺寸时不可翻转，越过对边后的距离按0处理，由min尺寸接管
    getResizeHeight(point, symPoint, stick) {
      let raw
      if (stick.includes('t')) raw = symPoint[1] - point[1]
      else if (stick.includes('b')) raw = point[1] - symPoint[1]
      else return this.height
      return this.hasMinSizeLimit() ? Math.max(0, raw) : Math.abs(raw)
    },
    // 根据stick生成对应的矩形渲染函数：中点以非固定轴为base，避免lock时反推错方向
    createRenderFunc(stick) {
      if (stick === 'angle') return null
      return function (point, symPoint, lock) {
        const baseAxis = stick.includes('l') || stick.includes('r') ? 'width' : 'height'
        const {width, height} = this.getLimitedSize(
          this.getResizeWidth(point, symPoint, stick),
          this.getResizeHeight(point, symPoint, stick),
          lock,
          baseAxis
        )
        this.renderLimitedRect(width, height, stick)
      }
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
      this.width = this.getLimitedSize(value, this.height, this.lock).width
    },
    h(value) {
      this.height = this.getLimitedSize(this.width, value, this.lock, 'height').height
    },
    minWidth() {
      this.limitCurrentSize()
    },
    minHeight() {
      this.limitCurrentSize()
    },
    maxWidth() {
      this.limitCurrentSize()
    },
    maxHeight() {
      this.limitCurrentSize()
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
