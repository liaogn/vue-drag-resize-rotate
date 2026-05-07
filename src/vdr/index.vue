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
        @mouseenter="onStickMouseenter($event, stick)"
        @mouseout="onStickMouseout($event, stick)"
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
import {
  getSymStick,
  RectDrager,
  RectRotator,
  RectFliper,
  getElementGeometricInfo,
  calcVerticalCrossPoint,
  calcRotatedPoint,
  calcRotatedContactor,
  normalizeSizeLimits,
  hasMinSizeLimit,
  getLimitedSize,
  getValidWhRatio,
  calcRectResetRotated,
  computeResize,
  buildStickCursor,
  shouldResetStickCursor,
} from '../core'

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
      hoverRender: undefined,
      flipSign: '',
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
    sizeLimits() {
      return normalizeSizeLimits({
        minWidth: this.minWidth,
        minHeight: this.minHeight,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
      })
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
    document.documentElement.removeEventListener('mousemove', this.move)
    document.documentElement.removeEventListener('mouseup', this.up)
  },
  methods: {
    // 初始化
    init() {
      this.cacheRectDomInfo(this.$el)

      this.RectDrager = new RectDrager()
      this.RectRotator = new RectRotator()

      document.documentElement.addEventListener('mousemove', this.move)
      document.documentElement.addEventListener('mouseup', this.up)
    },
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
    up(ev) {
      if (this.draggable && this.RectDrager.isDrag) {
        this.RectDrager.upHandle()
        this.$emit('dragStop', this.posData, ev)
      }
      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false
        this.$emit('resizeStop', this.posData, ev)
      }
      if (this.rotateable && this.RectRotator.isDrag) {
        this.RectRotator.upHandle()
        this.$emit('rotateStop', this.posData, ev)
      }
      this.syncWhRatio()
    },
    bodyDown(ev) {
      if (!this.activeable) return
      this.currentStick = ''
      this.RectDrager.downHandle(ev, [this.left, this.top], this.$el)
      if (this.activeable) {
        this.$emit('activated', this.posData, ev)
        this.$emit('dragStart', this.posData, ev)
      }
    },
    bodyMove(ev) {
      const moveInfo = this.RectDrager.moveHandle(ev)
      this.left = moveInfo[0]
      this.top = moveInfo[1]
      this.$emit('dragging', this.posData, ev)
    },
    rotateDown(ev) {
      if (!this.activeable) return
      this.currentStick = 'angle'
      this.RectRotator.downHandle(ev, this.$el, this.rotate)
      this.$emit('rotateStart', this.posData, ev)
    },
    rotateMove(ev) {
      this.rotate = this.RectRotator.moveHandle(ev)
      this.$emit('rotating', this.posData, ev)
    },
    cacheRectDomInfo(element) {
      this.elementInfo = getElementGeometricInfo(element)
      this.parentElement = element.parentNode
      this.parentInfo = getElementGeometricInfo(this.parentElement)
    },
    stickDown(ev, stick, index) {
      if (!this.activeable || !this.resizeable) return
      this.activeStickIndex = index
      this.syncWhRatio()
      this.stickDownHandle(stick)
      this.stickDrag = true
      this.$emit('resizeStart', this.posData, ev)
    },
    stickDownHandle(stick) {
      this.currentStick = stick
      this.cacheRectDomInfo(this.$el)
      this.isMiddlePoint = this.currentStick.match('m')

      if (this.stickDrag) return

      // 当前拖拽点的坐标（已旋转时的实际坐标，相对文档左上角）
      this.absoluteContactor = calcRotatedContactor(this.elementInfo, this.currentStick)

      // 对称点坐标（相对文档左上角）
      this.symAbsoluteContactor = calcRotatedContactor(this.elementInfo, getSymStick(stick))

      // 对称点基于父元素中点旋转复位（相对文档左上角）
      const symRotatedContactor = calcRotatedPoint(
        this.symAbsoluteContactor,
        [this.parentInfo.cx, this.parentInfo.cy],
        this.parentInfo.absoluteRotate
      )

      // 对称点相对父元素的点坐标
      this.symRelativeContactor = [
        symRotatedContactor[0] - this.parentInfo.left,
        symRotatedContactor[1] - this.parentInfo.top,
      ]

      // 创建翻转监听器
      this.RectFliper = new RectFliper(this.elementInfo, stick)
    },
    stickMove(ev) {
      let mousePoint = [ev.clientX, ev.clientY]

      // 当拖拽触点为中点（tm,bm,mr,ml）或锁定比例时，把鼠标点投影到参考线
      if (this.lock || this.isMiddlePoint) {
        mousePoint = calcVerticalCrossPoint(
          mousePoint,
          this.absoluteContactor,
          this.symAbsoluteContactor
        )
      }

      // 计算当前元素旋转复位后的几何信息
      const {newMousePoint, newSymPoint} = calcRectResetRotated(
        mousePoint,
        this.symRelativeContactor,
        this.parentInfo,
        this.rotate
      )

      // 更新矩形
      const next = computeResize({
        point: newMousePoint,
        symPoint: newSymPoint,
        stick: this.currentStick,
        lock: this.lock,
        rotate: this.rotate,
        width: this.width,
        height: this.height,
        whRatio: getValidWhRatio(this.whRatio),
        limits: this.sizeLimits,
        symRelativeContactor: this.symRelativeContactor,
      })
      if (next) {
        this.width = next.width
        this.height = next.height
        if (next.left !== undefined) this.left = next.left
        if (next.top !== undefined) this.top = next.top
      }

      // 设置最小尺寸时，缩放到最小值即停止，不再越过边界触发翻转
      if (!hasMinSizeLimit(this.sizeLimits)) {
        this.RectFliper.borderSignsWatcher(mousePoint, (isDegFlip, sign) => {
          this.flipSign = sign
          if (isDegFlip) this.rotate += this.flipSign === '-' ? -180 : 180
          this.$emit('fliped', this.posData, ev)
          this.stickDownHandle(this.RectFliper.getFlipStick(this.currentStick))
        })
      }
      this.$emit('resizing', this.posData, ev)
    },
    syncWhRatio() {
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height
      }
    },
    // 当前尺寸受外部 props 变化影响时，同步落在限制范围内
    limitCurrentSize() {
      const {width, height} = getLimitedSize({
        width: this.width,
        height: this.height,
        lock: this.lock,
        baseAxis: 'width',
        limits: this.sizeLimits,
        whRatio: getValidWhRatio(this.whRatio),
      })
      this.width = width
      this.height = height
    },
    onStickMouseenter(ev, stick) {
      const cursor = buildStickCursor(
        ev,
        stick,
        {
          stickDrag: this.stickDrag,
          currentStick: this.currentStick,
          resizeable: this.resizeable,
        },
        {hoverRender: this.hoverRender}
      )
      if (cursor !== null) ev.target.style.cursor = cursor
    },
    onStickMouseout(ev, stick) {
      if (shouldResetStickCursor(stick, {stickDrag: this.stickDrag})) {
        ev.target.style.cursor = ''
      }
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
      this.width = getLimitedSize({
        width: value,
        height: this.height,
        lock: this.lock,
        baseAxis: 'width',
        limits: this.sizeLimits,
        whRatio: getValidWhRatio(this.whRatio),
      }).width
    },
    h(value) {
      this.height = getLimitedSize({
        width: this.width,
        height: value,
        lock: this.lock,
        baseAxis: 'height',
        limits: this.sizeLimits,
        whRatio: getValidWhRatio(this.whRatio),
      }).height
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
<style lang="css" src="../core/style/vdr.css"></style>
