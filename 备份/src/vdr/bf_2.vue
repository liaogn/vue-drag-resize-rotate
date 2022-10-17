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
    <!-- <div class="ctrlBox"></div> -->
    <!-- 控件 -->
    <template v-if="active && activeable">
      <!-- 缩放控件   @mouseenter="stickMouseenter($event,stickIndex)"     @mouseout.stop="stickMouseout"-->
      <span
        :class="`vdr-stick-${stick}`"
        :key="stickIndex"
        :style="{zIndex: activeStickIndex == stickIndex ? 10 : 9}"
        @mousedown.stop.prevent="stickDown(stick, stickIndex)"
         @mouseenter="stickMouseenter($event,stick)" 
        class="vdr-stick"
        :ref="`stick_${stick}`"
        v-for="(stick, stickIndex) in rotateSticks"
      >
      <!-- <i id="stickCursorIcon"></i> -->
      <!-- <img  @mouseenter.stop @mouseout.stop  src="../arrows-h.svg" id="stickCursorIcon" class="stick-CursorIcon" :style="stickCursorStyle" v-if="hoverStickIndex===stickIndex"> -->
      </span>
      <!-- 旋转控件 -->
      <template v-if="sticks.indexOf('angle') > -1">
        <span class="vdr-stick-rotate-line"></span>
        <span
          @mousedown.stop.prevent="rotateDown($event)"
          class="vdr-stick vdr-angle"
          :ref="`stick_angle`"
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
const updateRactMaps = {
  tl(point, symPoint) {
    this.left = point[0]
    this.top = point[1]
    this.width = Math.abs(point[0] - symPoint[0])
    this.height = Math.abs(point[1] - symPoint[1])

  },
  tm(point, symPoint, lock) {
    this.height = Math.abs(point[1] - symPoint[1])
    lock && (this.width = this.height / this.whRatio)
    this.top = point[1]
    this.left = symPoint[0] - this.width / 2
  },
  tr(point, symPoint) {
    // const width = Math.abs(point[0] - symPoint[0])
    // const height= Math.abs(point[1] - symPoint[1])
    // if(width>=150)return console.log('stop');
    this.left = symPoint[0]
    this.top = point[1]
    this.width = Math.abs(point[0] - symPoint[0])
    this.height = Math.abs(point[1] - symPoint[1])
  },
  mr(point, symPoint, lock) {
    this.width = Math.abs(point[0] - symPoint[0])
    lock && (this.height = this.width * this.whRatio)
    this.left = symPoint[0]
    this.top = symPoint[1] - this.height / 2
  },
  br(point, symPoint) {
    this.left = symPoint[0]
    this.top = symPoint[1]
    this.width = Math.abs(point[0] - symPoint[0])
    this.height = Math.abs(point[1] - symPoint[1])
  },
  bm(point, symPoint, lock) {
    this.height = Math.abs(point[1] - symPoint[1])
    lock && (this.width = this.height / this.whRatio)
    this.left = symPoint[0] - this.width / 2
    this.top = symPoint[1]
  },
  bl(point, symPoint) {
    this.left = point[0]
    this.top = symPoint[1]
    this.width = Math.abs(point[0] - symPoint[0])
    this.height = Math.abs(point[1] - symPoint[1])
  },
  ml(point, symPoint, lock) {
    this.width = Math.abs(point[0] - symPoint[0])
    lock && (this.height = this.width * this.whRatio)
    this.left = point[0]
    this.top = symPoint[1] - this.height / 2
  },
  angle() {},
}
// 编辑直线的两点，数组第一项为非翻转180deg的边界点，第二项为需翻转180deg的边界点
const breakStickMaps = {
  tl: [['tr','br'],['bl','br']],
  tr: [['tl','bl'],['br','bl']],
  bl: [['br','tr'],['tl','tr']],
  br: [['bl','tl'], ['tr','tl']],
  tm: [null,['bl', 'br']],
  mr: [['tl', 'bl'],null],
  bm: [null,['tr', 'tl']],
  ml: [['tr', 'br'],null],
}
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
      activeStickIndex: -1,
      hoverStickIndex:-1,
      currentStick: '',
      dirCursorShow:false,
      stickCursorStyle:{}
    }
  },
  computed: {
    style() {
      const rotate = `rotateZ(${this.rotate}deg)`
      const translate = `translate3d(${this.left}px,${this.top}px,0)`
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
    rad(){
      return (this.rotate * Math.PI) / 180
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
    // 获取控件图标悬停角度
    getCursorIconRotate(parentsRotate,stick){
      const obj = {
        tl: parentsRotate - 45,
        tr: parentsRotate + 45,
        bl: parentsRotate - 135,
        br: parentsRotate + 135,
        tm: parentsRotate + 0,
        mr: parentsRotate + 90,
        bm: parentsRotate - 180,
        ml: parentsRotate - 90,
      }
      return obj[stick]
    },
    stickMouseenter(ev,stick){
      if(stick==='angle') return
      if(this.stickDrag && this.currentStick!==stick){
        return  (ev.target.style.cursor = "default")
      }  
      console.log('进入',stick);
      const parentsRotate =  this.getParentsRotate(ev)
      const cursorRotate = this.getCursorIconRotate(parentsRotate,stick)
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(${cursorRotate}deg);transform-origin: 16px 16px"></path></svg>`
      const iconUrl ='data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgIcon)))
      ev.target.style.cursor = 'url(' + iconUrl + ') 16 16,auto'
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
      const angle = Math.atan2(b, a) * (180 / Math.PI)
      return angle || 0
    },
    // 初始化
    init() {
      // 元素宽高比例初始化
      this.whRatio = this.width / this.height
      // 父级信息初始化
      this.parentElement = this.$el.parentNode

      this.parentInfo = this.getElementGeometricInfo(this.parentElement)
      // 获取当前元素几何信息
      this.elementInfo = this.getElementGeometricInfo(this.$el)
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
      const rad = this.angleToRadian(this.parentsRotate)
      const x = vector.x * Math.cos(rad) + vector.y * Math.sin(rad)
      const y = vector.y * Math.cos(rad) - vector.x * Math.sin(rad)

      // 更新位置信息
      this.left = left + x
      this.top = top + y
      // 触发拖拽事件
      this.$emit('dragging', this.posData)
    },
    // 角度转弧度
    angleToRadian(rotate) {
      return (rotate * Math.PI) / 180
    },
    // 获取元素绝对角度（相对窗口视角）
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
    // 获取当前控点的中心对称控点
    getSymStick(stick) {
      const [s0, s1] = stick.split('')
      const reverseMap = {t: 'b', b: 't', l: 'r', r: 'l'}
      return `${reverseMap[s0] || 'm'}${reverseMap[s1] || 'm'}`
    },
    // 触点映射
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
    // 求边界直线方程
    getBorderLineEquation(p1, p2) {
      const [x1, y1] = p1
      const [x2, y2] = p2
      const k = (y2 - y1) / (x2 - x1)
      return (targetAxis, knownValue) => {
        if (k === 0) {
          return {y: y1}[targetAxis] 
        } else if (!isFinite(k)) {
          return {x: x1}[targetAxis]
        } else {
          return {
            y: k * (knownValue - x1) + y1,
            x: (knownValue + k * x1 - y1) / k,
          }[targetAxis]
        }
      }
    },
    // 点击初始化
    stickDownInit(stick) {
      // 记录当前拖拽的stick
      this.currentStick = stick

      // 记录当前点是否为中点
      this.isMiddlePoint = this.currentStick.match('m')

      // 获取父元素几何信息
      this.parentInfo = this.getElementGeometricInfo(this.parentElement)

      // 获取当前元素几何信息
      this.elementInfo = this.getElementGeometricInfo(this.$el)

      // 鼠标点击后固定对称点、边界，直至下一次拖拽再更新
      if(this.stickDrag) return

      // 计算当前拖拽点的坐标（相对文档左上角,已旋转时的实际坐标）
      this.absoluteContactor = this.calcRotatedContactor(
        this.elementInfo,
        this.currentStick
      )

      // 记录当前拖拽的对称stick
      this.symCurrentStick = this.getSymStick(stick)
      // 计算当前拖拽点的对称点坐标（相对文档左上角,已旋转时的实际坐标）
      this.symAbsoluteContactor = this.calcRotatedContactor(
        this.elementInfo,
        this.symCurrentStick
      )
      // console.log(this.absoluteContactor,this.symAbsoluteContactor);
      
      // 记录边界点(用于处理缩放时的边界翻转或限制)
      this.borderPoints = this.getBreakPoints(stick)
      // 记录边界点直线方程
      this.borderLineEquations = this.borderPoints.map((points) =>{
        return points && this.getBorderLineEquation(points[0], points[1])
      })
      // 记录边界符号
      this.borderSigns =  this.borderLineEquations.map((lineEquation) => {
          if(!lineEquation) return []
          // 计算鼠标点与边界直线的x轴差值、并标记差值符合，根据符号变化判断到达边界
          const diffX = lineEquation('x', this.absoluteContactor[1]) - this.absoluteContactor[0]
          const diffX_sign = diffX > 0 ? `+` : `-`
          
          // 计算鼠标点与边界直线的y轴差值、并标记差值符合，根据符号变化判断到达边界
          const diffY =  lineEquation('y', this.absoluteContactor[0]) - this.absoluteContactor[1]
          const diffY_sign = diffY > 0 ? `+` : `-`

          return [diffX_sign,diffY_sign]
      })
      // console.log(this.borderSigns);
      
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
    // 获取边界点集合
    getBreakPoints(stick) {
      const breakSticks = breakStickMaps[stick]
      if (!breakSticks) return []
      const points = breakSticks.map((stickArray) =>{
         return stickArray && stickArray.map(stick=>{
           return this.calcRotatedContactor(this.elementInfo, stick)
         })
      })
      return points
    },

    //缩放控件的mousedown事件回调函数
    stickDown(stick, index) {
      if (!this.activeable) return
      // 记录当前活跃控件
      this.activeStickIndex = index
      // 记录宽高比
      this.whRatio = this.width / this.height
      // 缩放前数据初始化
      this.stickDownInit(stick)
      this.stickDrag = true
    },
    // 获取翻转后的当前触点
    getFlipStick(stick) {
      const [s0, s1] = stick.split('')
      if(stick.match('m')){
        return {tm: 'tm', bm: 'bm', ml: 'mr', mr: 'ml'}[stick]
      }else{
        const reverseMap = {t: 'b', b: 't', l: 'r', r: 'l'}
        return `${s0}${reverseMap[s1]}`
      }

    },
    // 进行翻转
    flipRect(stick,isDegFlip,sign){
       const flipStick = this.getFlipStick(stick)
       if(isDegFlip) {
         this.rotate += sign === '-' ? -180 :180
       }else{
          this.testa = null
       }
      
      
       this.stickDownInit(flipStick)
       this.flipRecting = false
    },
    // 缩放控件的mousemove事件回调函数
    stickMove(ev) {
     
      let mousePoint = [ev.clientX, ev.clientY]
      
      // 当拖拽触点为中点（tm,bm,mr,ml）时或锁定比例时，需要特别处理
      if (this.lock || this.isMiddlePoint) {
        // 计算出鼠标点与参考线（当前触点与对称触点构成的直线）垂直相交的点作为当前点
        mousePoint = this.calcVerticalCrossPoint(
          mousePoint,
          this.absoluteContactor,
          this.symAbsoluteContactor
        )
      }


                      //  遍历边界直线，判断鼠标点是否超出边界直线
      this.borderLineEquations.forEach((lineEquation, index) => {
        if(this.flipRecting || !lineEquation) return
        // 计算鼠标点与边界直线的x轴差值、并标记差值符合，根据符号变化判断是否到达边界
        const diffX = lineEquation('x', mousePoint[1]) - mousePoint[0]
        const diffX_sign = diffX > 0 ? `+` : `-`
        
        // 计算鼠标点与边界直线的y轴差值、并标记差值符合，根据符号变化判断是否到达边界
        const diffY =  lineEquation('y', mousePoint[0]) - mousePoint[1]
        const diffY_sign = diffY > 0 ? `+` : `-`

        const curSigns = [diffX_sign, diffY_sign]

        // 存在符号与前值状态不一致，证明发生了越界
        const breakingSign = this.borderSigns[index].find((sign,index)=>sign!==curSigns[index])
        if(breakingSign){
           console.log(breakingSign,index,'突破边界');
           this.flipRecting = true
           this.flipRect(this.currentStick, index===1, breakingSign)
        }
        // 缓存当前边界符号
        this.borderSigns[index] = [diffX_sign, diffY_sign]
      })
      if(this.flipRecting)return
      // 计算当前元素旋转复位后的几何信息this.currentStick
      const {newMousePoint:point,newSymPoint:symPoint} = this.caclRectResetRotated(mousePoint)
      const width = Math.abs(point[0] - symPoint[0])
      const height= Math.abs(point[1] - symPoint[1])
      if(width>151){
        if(!this.testa){
        this.elementInfo = this.getElementGeometricInfo(this.$el)
        
        this.testa = this.calcRotatedContactor(
            this.elementInfo,
            this.currentStick
        )
        this.testb = this.calcRotatedContactor(
          this.elementInfo,
          this.testMaxLine(this.currentStick)
        )
        }

        mousePoint = this.calcVerticalCrossPoint(
          mousePoint,
          this.testa,
          this.testb
        )


         const {newMousePoint:point,newSymPoint:symPoint} = this.caclRectResetRotated(mousePoint)
         this.updateElementInfo(point, symPoint, this.currentStick, this.lock)
         this.width = 150
      }else{
      
         this.updateElementInfo(point, symPoint, this.currentStick, this.lock)
      }

            
    },
    testMaxLine(currentStick){
       return {
         'tr':'br',
         'br':'tr',
         'tl':'bl',
         'bl':'tl'
       }[currentStick]
    },
    // ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle']
    caclRectResetRotated(mousePoint) {
            // 计算鼠标点基于父元素中点旋转复位、以及当前元素旋转复位的鼠标点坐标（相对文档左上角）
      const mouseAbsoluteRotatedPoint = this.calcRotatedPoint(
        mousePoint,
        [this.parentInfo.cx, this.parentInfo.cy],
        this.parentInfo.absoluteRotate - this.elementInfo.rotate
      )
      // console.log(mouseAbsoluteRotatedPoint[0]-this.symAbsoluteContactor[0]);

      // 计算鼠标点相对父元素的点坐标
      const mouseRelativeRotatedPoint = [
        mouseAbsoluteRotatedPoint[0] - this.parentInfo.left,
        mouseAbsoluteRotatedPoint[1] - this.parentInfo.top,
      ]
     
      // 当前元素新中心点
      const newCenterPoint = this.getCenterPoint(
        mouseRelativeRotatedPoint,
        this.symRelativeContactor
      )
      // 计算当前元素旋转复位后，鼠标点坐标
      const newMousePoint = this.calcRotatedPoint(
        mouseRelativeRotatedPoint,
        newCenterPoint,
        this.rotate
      )

      // 计算当前元素旋转复位后，对称点坐标
      const newSymPoint = this.calcRotatedPoint(
        this.symRelativeContactor,
        newCenterPoint,
        this.rotate
      )
      return {newMousePoint,newSymPoint}
      // 更新当前元素信息
      // this.updateElementInfo(newMousePoint, newSymPoint, stick, this.lock)
    },
    updateElementInfo(point, symPoint, stick, lock) {
      const renderFunc = updateRactMaps[stick]
      // 此处控制极值（2021-11-25）
      
      renderFunc && renderFunc.call(this, point, symPoint, lock)
    },
    // 计算两点间的斜率
    calcLineSlope(p1, p2) {
      const k = (p2[1] - p1[1]) / (p2[0] - p1[0])
      // 当p1与2重合时k = 0/0 即NaN 这时斜率取元素旋转角对应的斜率：k=tan(r)
      return isNaN(k) ? Math.tan(this.rad) : k
    },
    // 求点p0与p1、p2构成的直线的垂直交点
    calcVerticalCrossPoint(p0, p1, p2) {
      const [x0, y0] = p0
      const [x2, y2] = p2
      const k = this.calcLineSlope(p1, p2)
      // 当斜率为无穷时，证明鼠标y值始终与参考线相同，横坐标直接返回直线的x值(这里的x2)
      if (!isFinite(k)) return [x2, y0]
      // 求一点与一条直线（参考线）的垂直交点
      // 直线方程（参考线） y=k*x+b1,点与直线垂直相交的直线方程 y=(-1/k)*x+b2
      // 先代入参考线的两点p1,p2求出参考线的k和b1,然后可得垂直线的斜率公式k=-1/k,又代入已知点(x0,y0)，就可以求b2以及垂直线方程
      // 因为两线相交，可以定义交点为（xp,yp）,分别代入两天直线方程，yp=k*xp+b1;yp=(-1/k)*x+b2;就变成了一个求二元一次方程了
      const kk = Math.pow(k, 2)
      const xp = (kk * x2 - y2 * k + y0 * k + x0) / (kk + 1)
      const yp = (y2 - x2 * k + y0 * kk + x0 * k) / (kk + 1)
      return [Math.round(xp), Math.round(yp)]
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
      if (!point) return []
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

    // 旋转控件的mousedown事件回调函数
    rotateDown(ev) {
      if (!this.activeable) return
      this.rotateDrag = true
      this.currentStick = 'angle'
      // 获取当前元素位置大小信息，用于计算旋转元素的中心点
      const vdr = this.$refs.vdr
      const rect = vdr.getBoundingClientRect()
      const {left, top, width, height} = rect

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
      if(this.draggable && this.bodyDrag && !this.stickDrag) {
        this.bodyMove(ev)
      }
      if(this.resizeable && this.stickDrag) {
        this.stickMove(ev)
      }
      if(this.rotateable && this.rotateDrag) {
        this.rotateMove(ev)
      }
      // this.stickMouseMove(ev)
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
    x(value){
      this.left = value
    }
  },
}
</script>
