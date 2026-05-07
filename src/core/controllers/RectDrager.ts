import { angleToRadian, getParentsRotate } from '../dom/rotate'

interface DragStartPos {
  mx: number
  my: number
  left: number
  top: number
  parentsRotate: number
}

export default class RectDrager {
  isDrag = false
  private startPos: DragStartPos = {
    mx: 0,
    my: 0,
    left: 0,
    top: 0,
    parentsRotate: 0,
  }

  downHandle(ev: MouseEvent, curPosition: [number, number], boundary: Element): void {
    this.isDrag = true
    this.startPos.mx = ev.clientX
    this.startPos.my = ev.clientY
    this.startPos.left = curPosition[0]
    this.startPos.top = curPosition[1]
    this.startPos.parentsRotate = getParentsRotate(ev, boundary)
  }

  moveHandle(ev: MouseEvent): [number, number] {
    const { mx, my, left, top, parentsRotate } = this.startPos
    const vector = { x: ev.clientX - mx, y: ev.clientY - my }
    // 父元素旋转后的坐标系转换：x'=x·cos(θ)+y·sin(θ)，y'=y·cos(θ)-x·sin(θ)
    const rad = angleToRadian(parentsRotate)
    const x = vector.x * Math.cos(rad) + vector.y * Math.sin(rad)
    const y = vector.y * Math.cos(rad) - vector.x * Math.sin(rad)
    return [left + x, top + y]
  }

  upHandle(): void {
    this.isDrag = false
  }
}
