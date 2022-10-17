<style lang="css" src="./index.css"></style>
<template>
  <div
    :class="{'vdr-active': active && activeable, 'vdr-not-active': !activeable}"
    :style="style"
    @click.stop
    @mousedown.stop.prevent="bodyDown($event)"
    class="vdr"
    ref="vdr"
  >
    <!-- 控件 -->
    <template v-if="active && activeable">
      <!-- 缩放控件 -->
      <span
        :class="`vdr-stick-${stick}`"
        :key="stickIndex"
        :style="{zIndex: activeStick == stickIndex ? 10 : 9}"
        @mousedown.stop.prevent="stickDown($event, stick, stickIndex)"
        class="vdr-stick"
        :ref="`stick_${stick}`"
        v-for="(stick, stickIndex) in rotateSticks"
      ></span>
      <!-- 旋转控件 -->
      <template v-if="sticks.indexOf('angle') > -1">
        <span class="vdr-stick-rotate-line"></span>
        <span
          @mousedown.stop.prevent="rotateDown($event)"
          class="vdr-stick vdr-rotate"
        ></span>
      </template>
    </template>

    <!-- 插槽 -->
    <!-- 插槽 -->
    <slot class="child-vdr"></slot>
  </div>
</template>

<script>
// 旋转坐标点缓存
let pointA = {}
let pointB = {}
let pointC = {}

export default {
  name: 'VueDragResizeRotate',
  props: {
    hidden: {
      type: Boolean,
      default: false,
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
      default: 'auto',
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

    widthRange: {
      type: Array,
    },
    heightRange: {
      type: Array,
    },
  },
  data() {
    return {
      whRatio: 0,
      width: this.w,
      height: this.h,
      zIndex: this.z,
      left: this.x,
      top: this.y,
      bottom: 0,
      right: 0,
      rotate: this.r,
      activeStick: -1,
      currentStick: '',
    }
  },
  computed: {
    style() {
      const rotate = `rotateZ(${Math.round(this.rotate)}deg)`
      const translate = `translateX(${this.left}px) translateY(${this.top}px)`

      return {
        zIndex: this.zIndex,
        width: `${this.width}px`,
        height: `${this.height}px`,
        // backgroundImage: `url(${this.bg})`,
        // left: `${this.left}px`,
        // top: `${this.top}px`,
        // transform: `${rotate}`,
        transform: `${translate} ${rotate}`,
        visibility: this.hidden ? 'hidden' : 'visible',
      }
    },
    rotateSticks() {
      return this.sticks.filter((itme) => itme !== 'angle')
    },
    posData() {
      return {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        rotate: Math.round(this.rotate),
        stick: this.currentStick,
      }
    },
    // x的最小偏移值
    minOffsetLeft() {
      return this.parentWidth - this.right - this.minWidth
    },
    maxOffsetLeft() {
      return this.parentWidth - this.right - this.maxWidth
    },
    // y的最小偏移值
    minOffsetTop() {
      return this.parentHeight - this.bottom - this.minHeight
    },
    maxOffsetTop() {
      return this.parentHeight - this.bottom - this.maxHeight
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    // 销毁前移除事件
    document.documentElement.removeEventListener('mousemove', this.move)
    document.documentElement.removeEventListener('mouseup', this.up)
  },
  methods: {
    // 计算最小宽
    calcMinWidth() {
      const min = Math.min.apply(null, this.widthRange)
      if (min < 0 || (min >= 0 && min >= this.width)) return 0
      return min || 0
    },
    // 计算最大宽
    calcMaxWidth() {
      const max = Math.max.apply(null, this.widthRange)
      if (max <= 0 || (max > 0 && max < this.width)) return Infinity
      return max || Infinity
    },
    // 计算最小高
    calcMinHeight() {
      let min = Math.min.apply(null, this.heightRange)
      if (min < 0 || (min >= 0 && min >= this.height)) min = 0
      if (this.lock) {
        if (this.widthRange) {
          return this.minWidth / this.whRatio
        } else if (this.widthRange == null && this.heightRange) {
          this.minWidth = min * this.whRatio
        }
      }
      return min || 0
    },
    // 计算最大高
    calcMaxHeight() {
      let max = Math.max.apply(null, this.heightRange)
      if (max <= 0 || (max > 0 && max < this.height)) max = Infinity
      if (this.lock) {
        if (this.widthRange) {
          return this.maxWidth / this.whRatio
        } else if (this.widthRange == null && this.heightRange) {
          this.maxWidth = max * this.whRatio
        }
      }
      return max || Infinity
    },
    // 范围值初始
    setLimitValue() {
      this.minWidth = this.calcMinWidth()
      this.maxWidth = this.calcMaxWidth()
      this.minHeight = this.calcMinHeight()
      this.maxHeight = this.calcMaxHeight()
    },
    // 获取所有父旋转角的叠加状态角
    getParentsRotate(ev, isStick) {
      let rotate = 0
      let path = ev.path || (ev.composedPath && ev.composedPath()) || []
      path = isStick ? path.slice(1) : path
      // path = path.filter(
      //   (element) =>
      //     element.className && element.className.match('vdr-slot') == null
      // )
      const len = path.length || 0
      // console.log(path, 'path')
      if (len < 1) return 0
      //自身index为0， >0 过滤掉自身
      for (let i = len - 1; i > 0; i--) {
        const element = path[i]
        // 过滤掉window和document
        if (element === window || element === document) continue
        rotate += this.getElementRotate(element)
      }
      return rotate
    },
    // 获取元素旋转角度(矩阵转换)
    getElementRotate(element) {
      if (element == null) return 0
      const parentStyle = window.getComputedStyle(element, null)
      const matrixInfo =
        parentStyle['-webkit-transform'] ||
        parentStyle['-moz-transform'] ||
        parentStyle['-ms-transform'] ||
        parentStyle['-o-transform'] ||
        parentStyle['transform']

      if (matrixInfo.match('matrix') == null) return 0

      const matrix = matrixInfo.replace(/matrix\(|\)|\s/gi, '')
      const matrixArray = matrix.split(',') || []
      const a = Number(matrixArray[0])
      const b = Number(matrixArray[1])
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
      return angle || 0
    },
    // 初始化
    init() {
      // 元素宽高比例初始化
      this.whRatio = this.width / this.height
      // 父级信息初始化
      this.parentElement = this.$el.parentNode

      this.parentInfo = this.getParentInfo(this.parentElement)

      // 范围值初始化
      // this.setLimitValue()

      // 鼠标、元素位置信息初始化
      this.bodyStartPos = {
        mx: 0,
        my: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }

      // const rad = (this.rotate * Math.PI) / 180
      // const sin = Math.sin(rad)
      // console.log(sin, 'rad')

      // 元素的mousemove、mouseup事件委托到document.documentElement
      document.documentElement.addEventListener('mousemove', this.move)
      document.documentElement.addEventListener('mouseup', this.up)
    },

    // 获取父元素几何信息
    getParentInfo(parent) {
      const {offsetWidth, offsetHeight} = parent
      const rotate = this.getElementRotate(parent)
      const rect = parent.getBoundingClientRect()
      const {x, y, width, height} = rect
      const cx = width / 2 + x
      const cy = height / 2 + y
      return Object.assign(
        {x, y, width, height, cx, cy},
        {offsetWidth, offsetHeight, rotate}
      )
    },
    //元素本身的mousedown事件回调函数
    bodyDown(ev) {
      if (!this.activeable) return

      this.bodyDrag = true
      this.currentStick = ''

      // 记录开始鼠标位置
      this.bodyStartPos.mx = ev.clientX
      this.bodyStartPos.my = ev.clientY
      // 记录开始元素位置
      this.bodyStartPos.left = this.left
      this.bodyStartPos.top = this.top

      this.parentsRotate = this.getParentsRotate(ev)
      // console.log(this.parentsRotate)
      // 触发事件
      if (this.activeable) {
        this.$emit('activated', this.posData)
        this.$emit('dragStart', this.posData)
      }
    },
    // 元素本身的mousemove事件回调函数
    bodyMove(ev) {
      // 起始位置信息
      const {mx, my, left, top} = this.bodyStartPos
      // 位移向量
      const vector = {x: ev.clientX - mx, y: ev.clientY - my}
      // 父元素旋转后的坐标系转换，获取新的坐标点公式如下：
      // x'=x·cos(θ)+y·sin(θ)
      // y'=y·cos(θ)-x·sin(θ)

      const rad = this.parentsRotate * (Math.PI / 180)
      const x = vector.x * Math.cos(rad) + vector.y * Math.sin(rad)
      const y = vector.y * Math.cos(rad) - vector.x * Math.sin(rad)

      // 更新位置信息
      this.left = left + x
      this.top = top + y
      // 触发拖拽事件
      this.$emit('dragging', this.posData)
    },
    getRad(r) {
      return r * (Math.PI / 180)
    },
    //缩放控件的mousedown事件回调函数
    stickDown(ev, stick, index) {
      if (!this.activeable) return

      this.stickDrag = true
      this.activeStick = index
      // 记录当前拖拽的stick
      this.currentStick = stick

      this.center = {
        x: this.left + this.width / 2,
        y: this.top + this.height / 2,
      }
      // 获取父元素位置信息
      this.parentInfo = this.getParentInfo(this.parentElement)

      // 当前拖拽点的对称点（取对称拖拽控件的中点）
      const symStick = this.$refs.stick_br[0]
      const symStickInfo = symStick.getBoundingClientRect()
      const symPointCenter = {
        x: symStickInfo.left + symStickInfo.width / 2,
        y: symStickInfo.top + symStickInfo.height / 2,
      }
      this.symPoint = {
        x: this.getRotatedRelativeX(this.parentInfo, symPointCenter),
        y: this.getRotatedRelativeY(this.parentInfo, symPointCenter),
      }
    },
    getRotatedRelativeX(parentInfo, point) {
      const {x: px, y: py} = point
      const {width, x, offsetWidth, rotate, cy} = parentInfo
      const rad = this.angleToRadian(rotate)
      const csymW = width / 2 - offsetWidth / 2 / Math.cos(rad)
      const csymH = csymW / Math.tan(rad) || 0
      const diffY = Math.abs(py - cy)
      const outH = py > cy ? csymH - diffY : csymH + diffY
      const outW = Math.tan(rad) * outH
      const kLine = px - x - outW
      const mouseX = Math.cos(rad) * kLine
      return mouseX
    },
    getRotatedRelativeY(parentInfo, point) {
      const {x: px, y: py} = point
      const {height, y, offsetHeight, rotate, cx} = parentInfo
      const rad = this.angleToRadian(rotate)
      const csymH = height / 2 - offsetHeight / 2 / Math.cos(rad)
      const csymW = csymH / Math.tan(rad) || 0
      const diffX = Math.abs(px - cx)
      const outW = px < cx ? csymW - diffX : csymW + diffX
      const outH = Math.tan(rad) * outW
      const kLine = py - y - outH
      const mouseY = Math.cos(rad) * kLine
      return mouseY
    },
    // 缩放控件的mousemove事件回调函数
    stickMove(ev) {
      // 新左上角点
      // let curPositon = {}
      // let curPositon = {
      //   x: ev.clientX - this.parentInfo.x,
      //   y: ev.clientY - this.parentInfo.y,
      // }
      let mousePoint = {x: ev.clientX, y: ev.clientY}
      let curPositon = {
        x: this.getRotatedRelativeX(this.parentInfo, mousePoint),
        y: this.getRotatedRelativeY(this.parentInfo, mousePoint),
      }
      console.log(curPositon)
      // 新中心点
      const newCenterPoint = this.getCenterPoint(curPositon, this.symPoint)
      console.log(this.rotate, 'this.rotate')
      this.topLeftStick(curPositon, newCenterPoint)
    },
    // ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']
    topLeftStick(curPositon, newCenterPoint) {
      // 旋转复位左上角点
      const newTopLeftPoint = this.calcRotatedPoint(
        curPositon,
        newCenterPoint,
        this.rotate
      )

      // 旋转复位右下角点
      const newBottomRightPoint = this.calcRotatedPoint(
        this.symPoint,
        newCenterPoint,
        this.rotate
      )
      let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
      let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

      this.width = newWidth
      this.height = newHeight
      this.left = newTopLeftPoint.x
      this.top = newTopLeftPoint.y
    },

    // 获取中心点
    getCenterPoint(p1, p2) {
      return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2,
      }
    },

    /**
     * @description 计算某个点基于某个原点旋转后的坐标
     * @abstract 结合向量、三角函数、二角和差公式可求出其对应关系
     * @param {Object} point 输入点 {x,y}
     * @param {Object} originPoint 坐标原点 {x,y}
     * @param {Number} rotate 旋转角
     * @return {Object} 输入点旋转后的点坐标{x,y}
     */
    calcRotatedPoint(point, originPoint, rotate = 0) {
      if (!point || !originPoint) return
      // 向量模
      const X = point.x - originPoint.x
      const Y = point.y - originPoint.y
      // 三角函数
      const {cos, sin, PI} = window.Math
      // 角度转弧度
      const rad = (rotate * PI) / 180
      return {
        x: X * cos(rad) + Y * sin(rad) + originPoint.x,
        y: Y * cos(rad) - X * sin(rad) + originPoint.y,
      }
    },

    // 角度转弧度
    angleToRadian(rotate) {
      return (rotate * Math.PI) / 180
    },

    // 旋转控件的mousedown事件回调函数
    rotateDown(ev) {
      if (!this.activeable) return
      // 获取当前元素位置大小信息，用于计算旋转元素的中心点
      const vdr = this.$refs.vdr
      const rect = vdr.getBoundingClientRect()
      const {left, top, width, height} = rect

      this.rotateDrag = true
      this.currentStick = 'angle'

      // 开始点
      pointB = {X: ev.clientX, Y: ev.clientY}
      // 中点
      pointA = {X: left + width / 2, Y: top + height / 2}
      // 触发事件
      this.$emit('rotateStart', this.posData)
    },

    // 旋转控件的mousemove事件回调函数
    rotateMove(ev) {
      // 记录结束点
      pointC = {X: ev.clientX, Y: ev.clientY}
      // AB、AC向量
      const AB = {X: pointB.X - pointA.X, Y: pointB.Y - pointA.Y}
      const AC = {X: pointC.X - pointA.X, Y: pointC.Y - pointA.Y}

      // AB与AC叉乘，根据右手定则：direct小于零逆时针旋转，大于零顺时针旋转
      const direct = AB.X * AC.Y - AB.Y * AC.X

      // AB、AC向量的模
      const AB_dx = pointA.X - pointB.X
      const AC_dx = pointA.X - pointC.X
      const AB_dy = pointA.Y - pointB.Y
      const AC_dy = pointA.Y - pointC.Y
      const lengthAB = Math.sqrt(AB_dx * AB_dx + AB_dy * AB_dy)
      const lengthAC = Math.sqrt(AC_dx * AC_dx + AC_dy * AC_dy)

      // 向量点乘，公式： A*B = x1*x2 + y1*y2
      const product = AB.X * AC.X + AB.Y * AC.Y

      // 两个向量之间的夹角的计算公式 ：a * b = |a| * |b| * cosθ
      // 公式转换 θ = Math.acos(a * b /( |a| * |b| )); （θ为弧度）
      // Math.acos的参数范围[-1, 1] ,返回值[-PI, PI],其余值返回 NAN
      const rad = Math.acos(product / (lengthAB * lengthAC))
      const angle = (rad / Math.PI) * 180 || 0

      // 根据旋转方向加减角度
      this.rotate = direct < 0 ? this.rotate - angle : this.rotate + angle

      // 触发事件
      this.$emit('rotating', this.posData)

      // 更新起点
      pointB = {X: ev.clientX, Y: ev.clientY}
    },

    // mousemove事件回调函数
    move(ev) {
      if (this.draggable && this.bodyDrag) {
        // const { clientX, clientY } = ev;

        this.bodyMove(ev)
      }
      if (this.resizeable && this.stickDrag) {
        this.stickMove(ev)
      }
      if (this.rotateable && this.rotateDrag) {
        this.rotateMove(ev)
      }
    },
    // mousemup事件回调函数
    up() {
      // 拖拽停止
      if (this.draggable && this.bodyDrag) {
        this.bodyDrag = false
        this.$emit('dragStop', this.posData)
      }
      // 缩放停止
      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false
        this.$emit('resizeStop', this.posData)
      }
      // 旋转停止
      if (this.rotateable && this.rotateDrag) {
        this.rotateDrag = false
        this.$emit('rotateStop', this.posData)
      }
      // 更新宽高比例，当宽高其中一个为0时，不更新比例
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height
      }
    },
  },
  watch: {
    // left() {
    //   if (this.bodyDrag) return
    //   this.width = this.parentWidth - this.left - this.right
    // },
    // top() {
    //   if (this.bodyDrag) return
    //   this.height = this.parentHeight - this.top - this.bottom
    // },
    // right(value) {
    //   if (this.bodyDrag) return
    //   this.width = this.parentWidth - value - this.left
    // },
    // bottom(value) {
    //   if (this.bodyDrag) return
    //   this.height = this.parentHeight - value - this.top
    // },
  },
}
</script>
