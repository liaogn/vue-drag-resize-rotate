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
        v-for="(stick, stickIndex) in resizeSticks"
        :key="stickIndex"
        :class="`vdr-stick-${stick}`"
        :style="{ zIndex: activeStickIndex === stickIndex ? 10 : 9 }"
        @mousedown.stop.prevent="stickDown($event, stick, stickIndex)"
        @mouseenter="onStickMouseenter($event, stick)"
        @mouseout="onStickMouseout($event, stick)"
        class="vdr-stick"
        :ref="`stick_${stick}`"
      >
      </span>
      <!-- 旋转控件 -->
      <template v-if="_sticks.indexOf('angle') > -1">
        <span class="vdr-stick-rotate-line"></span>
        <span
          @mousedown.stop.prevent="rotateDown($event)"
          :style="{ cursor: !rotateable ? 'no-drop' : '' }"
          class="vdr-stick vdr-angle"
          ref="stick_angle"
        ></span>
      </template>
    </template>
    <div class="childWrap" v-if="_childWrapAttr" v-bind="_childWrapAttr">
      <template v-if="childrens">
        <vdr
          v-for="(child, index) in childrens"
          v-bind="child"
          :key="(child as any).uuid || `child_${index}`"
        ></vdr>
      </template>
      <slot></slot>
    </div>
    <template v-else>
      <template v-if="childrens">
        <vdr
          v-for="(child, index) in childrens"
          v-bind="child"
          :key="(child as any).uuid || `child_${index}`"
        ></vdr>
      </template>
      <slot></slot>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
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
  type ElementGeometricInfo,
  type FlipSign,
  type Point,
  type StickHoverRender,
  type StickType,
} from '../core'

export default defineComponent({
  name: 'vdr',
  inheritAttrs: false,
  props: {
    overflow: { type: String, default: '' },
    uuid: { type: [String, Number], default: '' },
    bg: { type: String, default: '' },
    lock: { type: Boolean, default: false },
    w: {
      type: Number,
      default: 100,
      validator: (val: number) => val >= 0,
    },
    h: {
      type: Number,
      default: 100,
      validator: (val: number) => val >= 0,
    },
    minWidth: {
      type: Number,
      default: 0,
      validator: (val: number) => val >= 0,
    },
    minHeight: {
      type: Number,
      default: 0,
      validator: (val: number) => val >= 0,
    },
    maxWidth: {
      type: Number,
      default: Infinity,
      validator: (val: number) => val >= 0,
    },
    maxHeight: {
      type: Number,
      default: Infinity,
      validator: (val: number) => val >= 0,
    },
    x: {
      type: Number,
      default: 0,
      validator: (val: number) => typeof val === 'number',
    },
    y: {
      type: Number,
      default: 0,
      validator: (val: number) => typeof val === 'number',
    },
    z: { type: [String, Number], default: '' },
    r: { type: Number, default: 0 },
    sticks: { type: Array as PropType<string[]>, default: undefined },
    active: { type: Boolean, default: true },
    draggable: { type: Boolean, default: true },
    resizeable: { type: Boolean, default: true },
    rotateable: { type: Boolean, default: true },
    activeable: { type: Boolean, default: true },
    childrens: { type: Array as PropType<Record<string, any>[]>, default: undefined },
    childWrapAttr: { type: Object as PropType<Record<string, any>>, default: undefined },
    stickHoverRender: {
      type: Function as PropType<StickHoverRender>,
      default: undefined,
    },
  },
  emits: [
    'activated',
    'dragStart',
    'dragging',
    'dragStop',
    'resizeStart',
    'resizing',
    'resizeStop',
    'rotateStart',
    'rotating',
    'rotateStop',
    'fliped',
  ],
  data() {
    return {
      width: this.w,
      height: this.h,
      left: this.x,
      top: this.y,
      zIndex: this.z,
      rotate: this.r,
      whRatio: 1,
      currentStick: '' as string,
      activeStickIndex: -1,
      flipSign: '' as FlipSign,
      stickDrag: false,
      isMiddlePoint: null as null | RegExpMatchArray,
      // 以下字段在 mounted / stickDown 之后才会被赋值，使用前一定已存在
      RectDrager: null as unknown as RectDrager,
      RectRotator: null as unknown as RectRotator,
      RectFliper: null as unknown as RectFliper,
      elementInfo: null as unknown as ElementGeometricInfo,
      parentElement: null as unknown as HTMLElement,
      parentInfo: null as unknown as ElementGeometricInfo,
      absoluteContactor: null as unknown as Point,
      symAbsoluteContactor: null as unknown as Point,
      symRelativeContactor: null as unknown as Point,
    }
  },
  computed: {
    _sticks(): string[] {
      if (!this.sticks) {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']
      }
      return this.sticks
    },
    _class() {
      const inClass = {
        'vdr-active': this.active && this.activeable,
        'vdr-not-active': !this.activeable,
      }
      return [inClass]
    },
    _style() {
      const rotate = `rotateZ(${this.rotate}deg)`
      const translate = `translate3d(${this.left}px,${this.top}px,0)`
      let cursor: string = 'pointer'
      if (this.active) {
        cursor = this.draggable ? 'move' : 'no-drop'
      }
      if (!this.activeable) cursor = 'no-drop'
      return {
        zIndex: this.zIndex,
        width: `${this.width}px`,
        height: `${this.height}px`,
        backgroundImage: `url(${this.bg})`,
        transform: `${translate} ${rotate}`,
        cursor,
      }
    },
    _childWrapAttr() {
      if (this.overflow) {
        const childWrapAttr = this.childWrapAttr || {}
        const style = Object.assign(childWrapAttr.style || {}, { overflow: this.overflow })
        return Object.assign(childWrapAttr, { style })
      }
      return this.childWrapAttr
    },
    resizeSticks(): string[] {
      return this._sticks.filter((item) => item !== 'angle')
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
        z: this.zIndex,
        stick: this.currentStick,
        lock: this.lock,
        active: this.active,
        uuid: this.uuid,
        flipSign: this.flipSign,
      }
    },
  },
  mounted() {
    this.syncWhRatio()
    this.limitCurrentSize()
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeUnmount() {
    document.documentElement.removeEventListener('mousemove', this.move)
    document.documentElement.removeEventListener('mouseup', this.up)
  },
  methods: {
    init() {
      this.cacheRectDomInfo(this.$el)
      this.RectDrager = new RectDrager()
      this.RectRotator = new RectRotator()
      document.documentElement.addEventListener('mousemove', this.move)
      document.documentElement.addEventListener('mouseup', this.up)
    },
    move(ev: MouseEvent) {
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
    up(ev: MouseEvent) {
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
    bodyDown(ev: MouseEvent) {
      if (!this.activeable) return
      this.currentStick = ''
      this.RectDrager.downHandle(ev, [this.left, this.top], this.$el)
      if (this.activeable) {
        this.$emit('activated', this.posData, ev)
        this.$emit('dragStart', this.posData, ev)
      }
    },
    bodyMove(ev: MouseEvent) {
      const moveInfo = this.RectDrager.moveHandle(ev)
      this.left = moveInfo[0]
      this.top = moveInfo[1]
      this.$emit('dragging', this.posData, ev)
    },
    rotateDown(ev: MouseEvent) {
      if (!this.activeable) return
      this.currentStick = 'angle'
      this.RectRotator.downHandle(ev, this.$el, this.rotate)
      this.$emit('rotateStart', this.posData, ev)
    },
    rotateMove(ev: MouseEvent) {
      this.rotate = this.RectRotator.moveHandle(ev)
      this.$emit('rotating', this.posData, ev)
    },
    cacheRectDomInfo(element: HTMLElement) {
      this.elementInfo = getElementGeometricInfo(element)
      this.parentElement = element.parentNode as HTMLElement
      this.parentInfo = getElementGeometricInfo(this.parentElement)
    },
    stickDown(ev: MouseEvent, stick: string, index: number) {
      if (!this.activeable || !this.resizeable) return
      this.activeStickIndex = index
      this.syncWhRatio()
      this.stickDownHandle(stick)
      this.stickDrag = true
      this.$emit('resizeStart', this.posData, ev)
    },
    stickDownHandle(stick: string) {
      this.currentStick = stick
      this.cacheRectDomInfo(this.$el)
      this.isMiddlePoint = this.currentStick.match('m')

      if (this.stickDrag) return

      const stickKey = this.currentStick as StickType
      this.absoluteContactor = calcRotatedContactor(this.elementInfo, stickKey) as Point
      this.symAbsoluteContactor = calcRotatedContactor(
        this.elementInfo,
        getSymStick(stickKey) as StickType
      ) as Point

      const symRotatedContactor = calcRotatedPoint(
        this.symAbsoluteContactor,
        [this.parentInfo.cx, this.parentInfo.cy],
        this.parentInfo.absoluteRotate
      )

      this.symRelativeContactor = [
        symRotatedContactor[0] - this.parentInfo.left,
        symRotatedContactor[1] - this.parentInfo.top,
      ]

      this.RectFliper = new RectFliper(this.elementInfo, stickKey)
    },
    stickMove(ev: MouseEvent) {
      let mousePoint: number[] = [ev.clientX, ev.clientY]

      if (this.lock || this.isMiddlePoint) {
        mousePoint = calcVerticalCrossPoint(
          mousePoint,
          this.absoluteContactor,
          this.symAbsoluteContactor
        )
      }

      const { newMousePoint, newSymPoint } = calcRectResetRotated(
        mousePoint,
        this.symRelativeContactor,
        this.parentInfo,
        this.rotate
      )

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

      if (!hasMinSizeLimit(this.sizeLimits)) {
        this.RectFliper.borderSignsWatcher(mousePoint, (isDegFlip: boolean, sign: FlipSign) => {
          this.flipSign = sign
          if (isDegFlip) this.rotate += this.flipSign === '-' ? -180 : 180
          this.$emit('fliped', this.posData, ev)
          this.stickDownHandle(this.RectFliper.getFlipStick(this.currentStick as StickType))
        })
      }
      this.$emit('resizing', this.posData, ev)
    },
    syncWhRatio() {
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height
      }
    },
    limitCurrentSize() {
      const { width, height } = getLimitedSize({
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
    onStickMouseenter(ev: MouseEvent, stick: string) {
      const cursor = buildStickCursor(
        ev,
        stick,
        {
          stickDrag: this.stickDrag,
          currentStick: this.currentStick,
          resizeable: this.resizeable,
        },
        { hoverRender: this.stickHoverRender }
      )
      if (cursor !== null) (ev.target as HTMLElement).style.cursor = cursor
    },
    onStickMouseout(ev: MouseEvent, stick: string) {
      if (shouldResetStickCursor(stick, { stickDrag: this.stickDrag })) {
        ;(ev.target as HTMLElement).style.cursor = ''
      }
    },
  },
  watch: {
    x(value: number) {
      this.left = value
    },
    y(value: number) {
      this.top = value
    },
    w(value: number) {
      this.width = getLimitedSize({
        width: value,
        height: this.height,
        lock: this.lock,
        baseAxis: 'width',
        limits: this.sizeLimits,
        whRatio: getValidWhRatio(this.whRatio),
      }).width
    },
    h(value: number) {
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
    r(value: number) {
      this.rotate = value
    },
    z(value: number | string) {
      this.zIndex = value
    },
  },
})
</script>
<style src="../core/style/vdr.css"></style>
