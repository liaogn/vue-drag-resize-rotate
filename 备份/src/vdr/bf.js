// 新左上角点
const curPositon = {
    x: ev.clientX - this.parentInfo.left,
    y: ev.clientY - this.parentInfo.top,
  }

  // 新中心点
  const newCenterPoint = this.getCenterPoint(
    curPositon,
    this.symmetricPoint
  )
  // 旋转复位左上角点
  const newTopLeftPoint = this.calculateRotatedPointCoordinate(
    curPositon,
    newCenterPoint,
    -this.rotate
  )
  // 旋转复位右下角点
  const newBottomRightPoint = this.calculateRotatedPointCoordinate(
    this.symmetricPoint,
    newCenterPoint,
    -this.rotate
  )
  const newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  const newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  // if (newWidth > 0 && newHeight > 0) {
  this.width = newWidth
  this.height = newHeight
  this.left = newTopLeftPoint.x
  this.top = newTopLeftPoint.y