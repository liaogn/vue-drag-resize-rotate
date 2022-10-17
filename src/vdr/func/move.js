import {angleToRadian, getParentsRotate} from './rotate'
export default class RectMover {
  constructor() {
    this.isDrag = false
    this.startPos = {
      mx: 0,
      my: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      parentsRotate: 0,
    }
  }
  downHandle(ev, curPosition) {
    this.isDrag = true
    // 记录开始鼠标位置
    this.startPos.mx = ev.clientX
    this.startPos.my = ev.clientY
    // 记录开始元素位置
    this.startPos.left = curPosition[0]
    this.startPos.top = curPosition[1]
    // 获取父元素的旋转角
    this.startPos.parentsRotate = getParentsRotate(ev)
  }
  moveHandle(ev) {
    // 起始位置信息
    const {mx, my, left, top, parentsRotate} = this.startPos

    // 位移向量
    const vector = {x: ev.clientX - mx, y: ev.clientY - my}

    // 父元素旋转后的坐标系转换，获取新的坐标点公式如下：
    // x'=x·cos(θ)+y·sin(θ)
    // y'=y·cos(θ)-x·sin(θ)
    const rad = angleToRadian(parentsRotate)
    const x = vector.x * Math.cos(rad) + vector.y * Math.sin(rad)
    const y = vector.y * Math.cos(rad) - vector.x * Math.sin(rad)
    return [left + x, top + y]
  }
  upHandle() {
    this.isDrag = false
  }
}
