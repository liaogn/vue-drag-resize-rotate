interface RotatePoint {
  X: number
  Y: number
}

export default class RectRotator {
  isDrag = false
  rotate = 0
  private pointA: RotatePoint = { X: 0, Y: 0 }
  private pointB: RotatePoint = { X: 0, Y: 0 }
  private pointC: RotatePoint = { X: 0, Y: 0 }

  downHandle(ev: MouseEvent, target: HTMLElement, rotate: number): void {
    if (!ev || !target) return
    const { left, top, width, height } = target.getBoundingClientRect()
    this.isDrag = true
    this.rotate = rotate
    this.pointB = { X: ev.clientX, Y: ev.clientY }
    this.pointA = { X: left + width / 2, Y: top + height / 2 }
  }

  moveHandle(ev: MouseEvent): number {
    this.pointC = { X: ev.clientX, Y: ev.clientY }
    const AB = { X: this.pointB.X - this.pointA.X, Y: this.pointB.Y - this.pointA.Y }
    const AC = { X: this.pointC.X - this.pointA.X, Y: this.pointC.Y - this.pointA.Y }

    // 叉乘判旋向：< 0 逆时针，> 0 顺时针
    const direct = AB.X * AC.Y - AB.Y * AC.X

    const AB_dx = this.pointA.X - this.pointB.X
    const AC_dx = this.pointA.X - this.pointC.X
    const AB_dy = this.pointA.Y - this.pointB.Y
    const AC_dy = this.pointA.Y - this.pointC.Y
    const lengthAB = Math.sqrt(AB_dx * AB_dx + AB_dy * AB_dy)
    const lengthAC = Math.sqrt(AC_dx * AC_dx + AC_dy * AC_dy)

    // 点乘 + acos 求增量角
    const product = AB.X * AC.X + AB.Y * AC.Y
    const rad = Math.acos(product / (lengthAB * lengthAC))
    const angle = (rad / Math.PI) * 180 || 0

    this.rotate = direct < 0 ? this.rotate - angle : this.rotate + angle
    this.pointB = { X: ev.clientX, Y: ev.clientY }

    return this.rotate
  }

  upHandle(): void {
    this.isDrag = false
  }
}
