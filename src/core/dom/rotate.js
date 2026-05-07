// 角度转弧度
function angleToRadian(rotate) {
  return (rotate * Math.PI) / 180
}
// 获取元素旋转角度(矩阵转换)
function getElementRotate(element) {
  if (!element || element.nodeType !== 1) return 0
  const parentStyle = window.getComputedStyle(element, null)
  const matrixInfo =
    parentStyle['-webkit-transform'] ||
    parentStyle['-moz-transform'] ||
    parentStyle['-ms-transform'] ||
    parentStyle['-o-transform'] ||
    parentStyle['transform']
  if (!matrixInfo || matrixInfo.indexOf('matrix') === -1) return 0
  const matrix = matrixInfo.replace(/matrix\(|\)|\s/gi, '')
  const matrixArray = matrix.split(',') || []
  const a = Number(matrixArray[0])
  const b = Number(matrixArray[1])
  const angle = Math.atan2(b, a) * (180 / Math.PI)
  return angle || 0
}

// 累加事件 path 上某一边界之上的祖先旋转角。
// boundary：累加从该元素的下一项开始；不传则只跳过 ev.target，累加所有祖先（含拥有 stick/vdr 自身旋转的根，用于触点 cursor 计算）。
function getParentsRotate(ev, boundary) {
  const path = ev.path || (ev.composedPath && ev.composedPath()) || []
  if (path.length < 2) return 0
  const startIndex = boundary ? path.indexOf(boundary) + 1 : 1
  if (startIndex <= 0) return 0
  let rotate = 0
  for (let i = path.length - 1; i >= startIndex; i--) {
    const element = path[i]
    if (!element || element.nodeType !== 1) continue
    if (element.classList && element.classList.contains('childWrap')) continue
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

export {angleToRadian, getElementRotate, getParentsRotate, getAbsoluteRotate}
