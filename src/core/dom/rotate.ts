/** 角度转弧度 */
export function angleToRadian(rotate: number): number {
  return (rotate * Math.PI) / 180
}

/** 获取元素旋转角度（基于 transform matrix） */
export function getElementRotate(element: Element | null | undefined): number {
  if (!element || element.nodeType !== 1) return 0
  const parentStyle = window.getComputedStyle(element, null)
  const matrixInfo =
    parentStyle.getPropertyValue('-webkit-transform') ||
    parentStyle.getPropertyValue('-moz-transform') ||
    parentStyle.getPropertyValue('-ms-transform') ||
    parentStyle.getPropertyValue('-o-transform') ||
    parentStyle.transform
  if (!matrixInfo || matrixInfo.indexOf('matrix') === -1) return 0
  const matrix = matrixInfo.replace(/matrix\(|\)|\s/gi, '')
  const matrixArray = matrix.split(',') || []
  const a = Number(matrixArray[0])
  const b = Number(matrixArray[1])
  const angle = Math.atan2(b, a) * (180 / Math.PI)
  return angle || 0
}

/**
 * 累加事件 path 上某一边界之上的祖先旋转角。
 * @param ev 鼠标事件
 * @param boundary 累加从该元素的下一项开始；不传则只跳过 ev.target
 */
export function getParentsRotate(ev: MouseEvent, boundary?: Element): number {
  const eventWithPath = ev as MouseEvent & { path?: EventTarget[] }
  const path: EventTarget[] =
    eventWithPath.path || (typeof ev.composedPath === 'function' && ev.composedPath()) || []
  if (path.length < 2) return 0
  const startIndex = boundary ? path.indexOf(boundary) + 1 : 1
  if (startIndex <= 0) return 0
  let rotate = 0
  for (let i = path.length - 1; i >= startIndex; i--) {
    const element = path[i] as Element
    if (!element || element.nodeType !== 1) continue
    if (element.classList && element.classList.contains('childWrap')) continue
    rotate += getElementRotate(element)
  }
  return rotate
}

/** 获取元素绝对角度（相对窗口视角，沿 parentNode 累加） */
export function getAbsoluteRotate(element: Element | null | undefined): number {
  if (!element) return 0
  let rotate = getElementRotate(element)
  const forEachParentRotate = (parent: Node | null) => {
    if (parent && parent.nodeType === 1) {
      rotate += getElementRotate(parent as Element)
      forEachParentRotate(parent.parentNode)
    }
  }
  forEachParentRotate(element.parentNode)
  return rotate
}
