<template>
  <div
    class="vdr"
    :class="_class"
    :style="_style"
    @click.stop
    @pointerdown.stop="bodyDown($event)"
    @pointerup.stop="up($event)"
    @pointercancel.stop="cancel($event)"
    ref="vdr"
  >
    <i v-if="active && activeable" class="vdr-outline" aria-hidden="true"></i>
    <!-- 控件 -->
    <template v-if="active && activeable">
      <!-- 尺寸控件 -->
      <span
        v-for="(stick, stickIndex) in resizeSticks"
        :key="stickIndex"
        :class="`vdr-stick-${stick}`"
        :style="{ zIndex: activeStickIndex === stickIndex ? 10 : 9 }"
        @pointerdown.stop.prevent="stickDown($event, stick, stickIndex)"
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
          @pointerdown.stop.prevent="rotateDown($event)"
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
  hasBoundary,
  clampPositionWithinLimits,
  isRectInsideLimits,
  fitResizeWithinLimits,
  type LimitRange,
  type ElementGeometricInfo,
  type FlipSign,
  type Point,
  type StickHoverRender,
  type StickType,
} from '../core'

type ChildConfig = Record<string, unknown> & {
  uuid?: string | number
}

type ChildWrapAttr = Record<string, unknown> & {
  style?: Record<string, string | number | undefined>
}

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
    childrens: { type: Array as PropType<ChildConfig[]>, default: undefined },
    childWrapAttr: { type: Object as PropType<ChildWrapAttr>, default: undefined },
    stickHoverRender: {
      type: Function as PropType<StickHoverRender>,
      default: undefined,
    },
    limitX: {
      type: Array as unknown as PropType<[number, number] | null>,
      default: null,
      validator: (val: unknown) =>
        val === null ||
        (Array.isArray(val) &&
          val.length === 2 &&
          typeof val[0] === 'number' &&
          typeof val[1] === 'number' &&
          val[0] <= val[1]),
    },
    limitY: {
      type: Array as unknown as PropType<[number, number] | null>,
      default: null,
      validator: (val: unknown) =>
        val === null ||
        (Array.isArray(val) &&
          val.length === 2 &&
          typeof val[0] === 'number' &&
          typeof val[1] === 'number' &&
          val[0] <= val[1]),
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
      activePointerId: null as number | null,
      pointerCaptureTarget: null as HTMLElement | null,
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
        return {
          ...childWrapAttr,
          style: {
            ...(childWrapAttr.style || {}),
            overflow: this.overflow,
          },
        }
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
    _limitX(): LimitRange {
      return this.limitX as LimitRange
    },
    _limitY(): LimitRange {
      return this.limitY as LimitRange
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
    this.applyBoundaryToCurrent()
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeUnmount() {
    document.documentElement.removeEventListener('pointermove', this.move)
    document.documentElement.removeEventListener('pointerup', this.up)
    document.documentElement.removeEventListener('pointercancel', this.cancel)
  },
  methods: {
    init() {
      this.cacheRectDomInfo(this.$el)
      this.RectDrager = new RectDrager()
      this.RectRotator = new RectRotator()
      document.documentElement.addEventListener('pointermove', this.move, { passive: false })
      document.documentElement.addEventListener('pointerup', this.up)
      document.documentElement.addEventListener('pointercancel', this.cancel)
    },
    isUsablePointerDown(ev: PointerEvent) {
      if (this.activePointerId !== null) return false
      if (ev.pointerType === 'mouse' && ev.button !== 0) return false
      return ev.isPrimary
    },
    isActivePointer(ev: PointerEvent) {
      return this.activePointerId === ev.pointerId
    },
    capturePointer(ev: PointerEvent) {
      const target = ev.currentTarget
      if (!(target instanceof HTMLElement) || typeof target.setPointerCapture !== 'function') return
      try {
        target.setPointerCapture(ev.pointerId)
        this.pointerCaptureTarget = target
      } catch {
        this.pointerCaptureTarget = null
      }
    },
    releasePointer() {
      if (
        this.pointerCaptureTarget &&
        this.activePointerId !== null &&
        typeof this.pointerCaptureTarget.releasePointerCapture === 'function'
      ) {
        try {
          this.pointerCaptureTarget.releasePointerCapture(this.activePointerId)
        } catch {
          // The browser may have already released capture after pointercancel.
        }
      }
      this.pointerCaptureTarget = null
      this.activePointerId = null
    },
    startPointerInteraction(ev: PointerEvent) {
      if (!this.isUsablePointerDown(ev)) return false
      this.activePointerId = ev.pointerId
      this.capturePointer(ev)
      ev.preventDefault()
      return true
    },
    move(ev: PointerEvent) {
      if (!this.isActivePointer(ev)) return
      if (this.RectDrager.isDrag || this.stickDrag || this.RectRotator.isDrag) {
        ev.preventDefault()
      }
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
    stopPointerInteraction(ev: PointerEvent) {
      if (this.RectDrager.isDrag) {
        this.RectDrager.upHandle()
        if (this.draggable) {
          this.$emit('dragStop', this.posData, ev)
        }
      }
      if (this.stickDrag) {
        this.stickDrag = false
        if (this.resizeable) {
          this.$emit('resizeStop', this.posData, ev)
        }
      }
      if (this.RectRotator.isDrag) {
        this.RectRotator.upHandle()
        if (this.rotateable) {
          this.$emit('rotateStop', this.posData, ev)
        }
      }
      this.releasePointer()
      this.syncWhRatio()
    },
    up(ev: PointerEvent) {
      if (!this.isActivePointer(ev)) return
      this.stopPointerInteraction(ev)
    },
    cancel(ev: PointerEvent) {
      if (!this.isActivePointer(ev)) return
      this.stopPointerInteraction(ev)
    },
    bodyDown(ev: PointerEvent) {
      if (!this.activeable) return
      if (!this.startPointerInteraction(ev)) return
      this.currentStick = ''
      this.RectDrager.downHandle(ev, [this.left, this.top], this.$el)
      if (this.activeable) {
        this.$emit('activated', this.posData, ev)
        this.$emit('dragStart', this.posData, ev)
      }
    },
    bodyMove(ev: PointerEvent) {
      const moveInfo = this.RectDrager.moveHandle(ev)
      let nextLeft = moveInfo[0]
      let nextTop = moveInfo[1]
      if (hasBoundary(this._limitX, this._limitY)) {
        const clamped = clampPositionWithinLimits(
          {
            left: nextLeft,
            top: nextTop,
            width: this.width,
            height: this.height,
            rotate: this.rotate,
          },
          this._limitX,
          this._limitY
        )
        if (clamped.fits) {
          nextLeft = clamped.left
          nextTop = clamped.top
        } else {
          nextLeft = this.left
          nextTop = this.top
        }
      }
      this.left = nextLeft
      this.top = nextTop
      this.$emit('dragging', this.posData, ev)
    },
    rotateDown(ev: PointerEvent) {
      if (!this.activeable) return
      if (!this.startPointerInteraction(ev)) return
      this.currentStick = 'angle'
      this.RectRotator.downHandle(ev, this.$el, this.rotate)
      this.$emit('rotateStart', this.posData, ev)
    },
    rotateMove(ev: PointerEvent) {
      const nextRotate = this.RectRotator.moveHandle(ev)
      if (hasBoundary(this._limitX, this._limitY)) {
        const clamped = clampPositionWithinLimits(
          {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height,
            rotate: nextRotate,
          },
          this._limitX,
          this._limitY
        )
        if (!clamped.fits) {
          // 旋转后矩形 AABB 比区间还大 → 拒绝该旋转
          return
        }
        this.rotate = nextRotate
        this.left = clamped.left
        this.top = clamped.top
      } else {
        this.rotate = nextRotate
      }
      this.$emit('rotating', this.posData, ev)
    },
    cacheRectDomInfo(element: HTMLElement) {
      this.elementInfo = getElementGeometricInfo(element)
      this.parentElement = element.parentNode as HTMLElement
      this.parentInfo = getElementGeometricInfo(this.parentElement)
    },
    /**
     * 翻转触发的 stickDownHandle 紧跟 data 修改而来，但 Vue 的 DOM patch 是异步的，
     * 此刻 getBoundingClientRect 仍读到旧的 transform/size。这里在读 DOM 之前
     * 同步把当前 data 写入 style，保证后续几何信息与 data 一致。
     */
    syncDomToData() {
      const el = this.$el as HTMLElement | undefined
      if (!el || !el.style) return
      el.style.width = `${this.width}px`
      el.style.height = `${this.height}px`
      el.style.transform = `translate3d(${this.left}px,${this.top}px,0) rotateZ(${this.rotate}deg)`
    },
    stickDown(ev: PointerEvent, stick: string, index: number) {
      if (!this.activeable || !this.resizeable) return
      if (!this.startPointerInteraction(ev)) return
      this.activeStickIndex = index
      this.syncWhRatio()
      this.stickDownHandle(stick)
      this.stickDrag = true
      this.$emit('resizeStart', this.posData, ev)
    },
    stickDownHandle(stick: string) {
      this.currentStick = stick
      this.syncDomToData()
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
    stickMove(ev: PointerEvent) {
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
        let result = next
        if (
          hasBoundary(this._limitX, this._limitY) &&
          !isRectInsideLimits(
            {
              left: next.left ?? this.left,
              top: next.top ?? this.top,
              width: next.width,
              height: next.height,
              rotate: this.rotate,
            },
            this._limitX,
            this._limitY
          )
        ) {
          result = fitResizeWithinLimits(
            {
              width: next.width,
              height: next.height,
              prevWidth: this.width,
              prevHeight: this.height,
              stick: this.currentStick as StickType,
              rotate: this.rotate,
              symRelativeContactor: this.symRelativeContactor,
              lock: this.lock,
              whRatio: getValidWhRatio(this.whRatio),
              limits: this.sizeLimits,
            },
            this._limitX,
            this._limitY
          )
        }
        this.width = result.width
        this.height = result.height
        if (result.left !== undefined) this.left = result.left
        if (result.top !== undefined) this.top = result.top
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
    applyBoundaryToCurrent() {
      if (!hasBoundary(this._limitX, this._limitY)) return
      const clamped = clampPositionWithinLimits(
        {
          left: this.left,
          top: this.top,
          width: this.width,
          height: this.height,
          rotate: this.rotate,
        },
        this._limitX,
        this._limitY
      )
      if (clamped.fits) {
        this.left = clamped.left
        this.top = clamped.top
      }
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
      this.applyBoundaryToCurrent()
    },
    y(value: number) {
      this.top = value
      this.applyBoundaryToCurrent()
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
      this.applyBoundaryToCurrent()
    },
    z(value: number | string) {
      this.zIndex = value
    },
    limitX: {
      handler() {
        this.applyBoundaryToCurrent()
      },
      deep: true,
    },
    limitY: {
      handler() {
        this.applyBoundaryToCurrent()
      },
      deep: true,
    },
  },
})
</script>
<style src="../core/style/vdr.css"></style>
