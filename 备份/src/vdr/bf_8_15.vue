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

      this.parentInfo = this.getElementGeometricInfo(this.parentElement)

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
    getAbsoluteRotate(element) {
      if (!element) return 0
      let rotate = this.getElementRotate(element)
      const forEachParentRotate = (parent) => {
        if (parent && parent.nodeType === 1) {
          rotate += this.getElementRotate(parent)
          forEachParentRotate(parent.parentNode)
        }
      }
      forEachParentRotate(element.parentNode)
      return rotate
    },
    getSymStick(positionType) {
      const [s0, s1] = positionType.split('')
      const reverseMap = {t: 'b', b: 't', l: 'r', r: 'l'}
      return `${reverseMap[s0] || 'm'}${reverseMap[s1] || 'm'}`
    },
    contactorMaps(elementInfo, positionType) {
      const {left, top, width, height} = elementInfo
      const halfWidth = width / 2
      const halfHeight = height / 2
      const maps = {
        tl: () => [left, top],
        tm: () => [left + halfWidth, top],
        tr: () => [left + width, top],
        mr: () => [left + width, top + halfHeight],
        br: () => [left + width, top + height],
        bm: () => [left + halfWidth, top + height],
        bl: () => [left, top + height],
        ml: () => [left, top + halfHeight],
      }
      return maps[positionType] && maps[positionType]()
    },
    // 计算矩形8个触点
    calcRotatedContactor(geometricInfo, positionType) {
      if (!positionType) return
      const {offsetWidth: width, offsetHeight: height} = geometricInfo
      const {left, top, absoluteRotate, cy, cx} = geometricInfo
      const absoluteRectInfo = {left, top, width, height}
      const absolutePoint = this.contactorMaps(absoluteRectInfo, positionType)
      const point = this.calcRotatedPoint(
        absolutePoint,
        [cx, cy],
        -absoluteRotate
      )
      return point
    },
    // 获取元素的几何信息
    getElementGeometricInfo(element) {
      // const contactor={}
      const {offsetWidth, offsetHeight} = element
      const rotate = this.getElementRotate(element)
      const absoluteRotate = this.getAbsoluteRotate(this.$el)

      const rect = element.getBoundingClientRect()
      const {x, y, width, height} = rect
      const cx = width / 2 + x
      const cy = height / 2 + y

      const left = cx - offsetWidth / 2
      const top = cy - offsetHeight / 2

      return Object.assign(
        {x, y, left, top, width, height, cx, cy},
        {offsetWidth, offsetHeight, rotate, absoluteRotate}
      )
    },
    //缩放控件的mousedown事件回调函数
    stickDown(ev, stick, index) {
      if (!this.activeable) return

      this.stickDrag = true
      this.activeStick = index
      // 记录当前拖拽的stick
      this.currentStick = stick
      this.symCurrentStick = this.getSymStick(stick)

      // 获取父元素几何信息
      this.parentInfo = this.getElementGeometricInfo(this.parentElement)

      // 获取当前元素几何信息
      this.elementInfo = this.getElementGeometricInfo(this.$el)

      // 计算当前拖拽点的对称点坐标（相对文档左上角,已旋转时的实际坐标）
      this.absoluteContactor = this.calcRotatedContactor(
        this.elementInfo,
        this.currentStick
      )
      // 计算当前拖拽点的对称点坐标（相对文档左上角,已旋转时的实际坐标）
      this.symAbsoluteContactor = this.calcRotatedContactor(
        this.elementInfo,
        this.symCurrentStick
      )

      // 计算对称点基于父元素中点旋转复位、以及当前元素旋转复位的点坐标（相对文档左上角）
      this.symRotatedContactor = this.calcRotatedPoint(
        this.symAbsoluteContactor,
        [this.parentInfo.cx, this.parentInfo.cy],
        this.parentInfo.absoluteRotate - this.elementInfo.rotate
      )

      // 计算对称点相对父元素的点坐标（相对父元素）
      this.symRelativeContactor = [
        this.symRotatedContactor[0] - this.parentInfo.left,
        this.symRotatedContactor[1] - this.parentInfo.top,
      ]
    },
    // 计算两点间的斜率
    calClineSlope(p1, p2) {
      return (p2[1] - p1[1]) / (p2[0] - p1[0])
    },
    // 修正鼠标点（当拖拽触点为中点时，修正鼠标点为与参考线垂直相交的点）
    reviseMousePoint(x0, y0, p1, p2) {
      // 非中点不做处理，直接返回原鼠标点
      if (!this.currentStick.match('m')) return [x0, y0]
      const [x2, y2] = p2
      const k = this.calClineSlope(p1, p2)
      // 当斜率为无穷时，证明鼠标y值始终与参考线相同，横坐标直接返回参考线的x值(这里的x2)
      if (!isFinite(k)) return [x2, y0]
      // 数学原理：求一点与一条直线（参考线）的垂直交点
      // 直线方程（参考线） y=k*x+b1,点与直线垂直相交的直线方程 y=(-1/k)*x+b2
      // 先代入参考线的两点p1,p2求出参考线的k和b1,然后可得垂直线的斜率公式k=-1/k,又代入已知点(x0,y0)，就可以求b2以及垂直线方程
      // 因为两线相交，可以定义交点为（xp,yp）,分别代入两天直线方程，yp=k*xp+b1;yp=(-1/k)*x+b2;就变成了一个求二元一次方程了
      // 注意，要联立两直线分别求xp和yp的表达式，不要求出xp然后代入一条方程求
      const kk = Math.pow(k, 2)
      const xp = (kk * x2 - y2 * k + y0 * k + x0) / (kk + 1)
      const yp = (y2 - x2 * k + y0 * kk + x0 * k) / (kk + 1)
      return [Math.round(xp), Math.round(yp)]
    },
    // 缩放控件的mousemove事件回调函数
    stickMove(ev) {
      // 修正鼠标点（当拖拽触点为中点（tm,bm,mr,ml）时，修正鼠标点为与参考线垂直相交的点）
      const mousePoint = this.reviseMousePoint(
        ev.clientX,
        ev.clientY,
        this.absoluteContactor,
        this.symAbsoluteContactor
      )
      // 计算鼠标点基于父元素中点旋转复位、以及当前元素旋转复位的鼠标点坐标（相对文档左上角）
      const mouseAbsoluteRotatedPoint = this.calcRotatedPoint(
        mousePoint,
        [this.parentInfo.cx, this.parentInfo.cy],
        this.parentInfo.absoluteRotate - this.elementInfo.rotate
      )
      // 计算鼠标点相对父元素的点坐标（相对父元素,鼠标点有问题，当有m的时候）
      const mouseRelativeRotatedPoint = [
        mouseAbsoluteRotatedPoint[0] - this.parentInfo.left,
        mouseAbsoluteRotatedPoint[1] - this.parentInfo.top,
      ]

      // 当前元素新中心点
      const newCenterPoint = this.getCenterPoint(
        mouseRelativeRotatedPoint,
        this.symRelativeContactor
      )
      // 计算当前元素旋转复位后的几何信息
      this.caclRectResetRotated(
        mouseRelativeRotatedPoint,
        newCenterPoint,
        this.currentStick
      )
    },
    // ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']
    caclRectResetRotated(mousePositon, newCenterPoint, stick) {
      // 计算当前元素旋转复位后，鼠标点坐标
      const newMousePoint = this.calcRotatedPoint(
        mousePositon,
        newCenterPoint,
        this.rotate
      )

      // 计算当前元素旋转复位后，对称点坐标
      const newSymPoint = this.calcRotatedPoint(
        this.symRelativeContactor,
        newCenterPoint,
        this.rotate
      )

      // 更新当前元素信息
      this.updateElementInfo(newMousePoint, newSymPoint, newCenterPoint, stick)
    },
    updateElementInfo(point, symPoint, center, stick) {
      const maps = {
        tl() {
          this.left = point[0]
          this.top = point[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = Math.abs(point[1] - symPoint[1])
        },
        tm() {
          this.height = Math.abs(point[1] - symPoint[1])
          this.top = point[1]
          this.left = symPoint[0] - this.width / 2
        },
        tr() {
          this.left = symPoint[0]
          this.top = point[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = Math.abs(point[1] - symPoint[1])
        },
        mr() {
          this.left = symPoint[0]
          this.top = symPoint[1] - this.height / 2
          this.width = Math.abs(point[0] - symPoint[0])
        },
        br() {
          this.left = symPoint[0]
          this.top = symPoint[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = Math.abs(point[1] - symPoint[1])
        },
        bm() {
          this.left = symPoint[0] - this.width / 2
          this.top = symPoint[1]
          this.height = Math.abs(point[1] - symPoint[1])
        },
        bl() {
          this.left = point[0]
          this.top = symPoint[1]
          this.width = Math.abs(point[0] - symPoint[0])
          this.height = Math.abs(point[1] - symPoint[1])
        },
        ml() {
          this.left = point[0]
          this.top = symPoint[1] - this.height / 2
          this.width = Math.abs(point[0] - symPoint[0])
        },
      }
      maps[stick] && maps[stick].call(this)
    },

    // 获取中心点
    getCenterPoint(p1, p2) {
      return [p1[0] + (p2[0] - p1[0]) / 2, p1[1] + (p2[1] - p1[1]) / 2]
    },

    /**
     * @description 计算某个点基于某个原点旋转后的坐标
     * @abstract 结合向量、三角函数、二角和差公式可求出其对应关系
     * @param {Object} point 输入点 {x,y}
     * @param {Object} originPoint 坐标原点 {x,y}
     * @param {Number} rotate 旋转角
     * @return {Object} 输入点旋转后的点坐标{x,y}
     */
    calcRotatedPoint(point, originPoint = [0, 0], rotate = 0) {
      if (!point) return
      // 向量模
      const X = point[0] - originPoint[0]
      const Y = point[1] - originPoint[1]
      // 三角函数
      const {cos, sin, PI} = window.Math
      // 角度转弧度
      const rad = (rotate * PI) / 180
      return [
        X * cos(rad) + Y * sin(rad) + originPoint[0],
        Y * cos(rad) - X * sin(rad) + originPoint[1],
      ]
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
      if (this.draggable && this.bodyDrag && !this.stickDrag) {
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
