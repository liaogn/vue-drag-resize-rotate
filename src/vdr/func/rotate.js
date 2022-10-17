// 角度转弧度
function angleToRadian(rotate) {
  return (rotate * Math.PI) / 180
}
// 获取元素旋转角度(矩阵转换)
function getElementRotate(element) {
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
}

// 获取所有父旋转角的叠加状态角
function getParentsRotate(ev, isStick) {
  let rotate = 0
  let path = ev.path || (ev.composedPath && ev.composedPath()) || []
  path = isStick ? path.slice(1) : path
  const len = path.length || 0
  if (len < 1) return 0
  //自身index为0， >0 过滤掉自身
  for (let i = len - 1; i > 0; i--) {
    const element = path[i]
    // 过滤掉window和document
    if (element === window || element === document) continue
    rotate += getElementRotate(element)
  }
  return rotate
}

// 获取元素绝对角度（相对窗口视角）
function getAbsoluteRotate(element) {
  if (!element) return 0
  let rotate = getElementRotate(element)
  const forEachParentRotate = (parent) => {
    if (parent && parent.nodeType === 1) {
      rotate += getElementRotate(parent)
      forEachParentRotate(parent.parentNode)
    }
  }
  forEachParentRotate(element.parentNode)
  return rotate
}

const RectRotator = class {
  constructor() {
    // 标记是否在进行旋转
    this.isDrag = false
    this.rotate = 0
    // 旋转坐标点初始化
    this.pointA = {}
    this.pointB = {}
    this.pointC = {}
  }
  downHandle(ev, target, rotate) {
    // 获取当前元素位置大小信息，用于计算旋转元素的中心点
    if (!ev || !target) return
    const rect = target.getBoundingClientRect()
    const {left, top, width, height} = rect
    // 旋转选中中
    this.isDrag = true
    // 同步旋转前的旋转角度
    this.rotate = rotate
    // 开始点
    this.pointB = {X: ev.clientX, Y: ev.clientY}
    // 中点
    this.pointA = {X: left + width / 2, Y: top + height / 2}
  }
  moveHandle(ev) {
    // 记录结束点
    this.pointC = {X: ev.clientX, Y: ev.clientY}
    // AB、AC向量
    const AB = {
      X: this.pointB.X - this.pointA.X,
      Y: this.pointB.Y - this.pointA.Y,
    }
    const AC = {
      X: this.pointC.X - this.pointA.X,
      Y: this.pointC.Y - this.pointA.Y,
    }

    // AB与AC叉乘，根据右手定则：direct小于零逆时针旋转，大于零顺时针旋转
    const direct = AB.X * AC.Y - AB.Y * AC.X

    // AB、AC向量的模
    const AB_dx = this.pointA.X - this.pointB.X
    const AC_dx = this.pointA.X - this.pointC.X
    const AB_dy = this.pointA.Y - this.pointB.Y
    const AC_dy = this.pointA.Y - this.pointC.Y
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

    // // 更新起点
    this.pointB = {X: ev.clientX, Y: ev.clientY}

    return this.rotate
  }
  upHandle(){
    this.isDrag = false
  }
}

export {angleToRadian, getElementRotate, getParentsRotate, getAbsoluteRotate, RectRotator}
