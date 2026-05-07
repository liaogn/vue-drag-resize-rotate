import {calcCenterPoint, calcRotatedPoint} from '../geometry/calc'
import {getLimitedSize, hasMinSizeLimit} from '../geometry/size'

// 计算矩形旋转复位后的几何信息
// 输入：鼠标点（document 坐标）、对称触点（相对父元素，未旋转坐标系）、父元素几何信息、当前元素旋转角
// 输出：相对当前元素未旋转坐标系的鼠标点和对称点
function calcRectResetRotated(mousePoint, symRelativeContactor, parentInfo, rotate) {
  // 计算鼠标点基于父元素中点旋转复位
  const mouseAbsoluteRotatedPoint = calcRotatedPoint(
    mousePoint,
    [parentInfo.cx, parentInfo.cy],
    parentInfo.absoluteRotate
  )

  // 计算鼠标点相对父元素的点坐标
  const mouseRelativeRotatedPoint = [
    mouseAbsoluteRotatedPoint[0] - parentInfo.left,
    mouseAbsoluteRotatedPoint[1] - parentInfo.top,
  ]

  // 当前元素新中心点
  const newCenterPoint = calcCenterPoint(mouseRelativeRotatedPoint, symRelativeContactor)

  // 计算当前元素旋转复位后，鼠标点坐标
  const newMousePoint = calcRotatedPoint(mouseRelativeRotatedPoint, newCenterPoint, rotate)

  // 计算当前元素旋转复位后，对称点坐标
  const newSymPoint = calcRotatedPoint(symRelativeContactor, newCenterPoint, rotate)

  return {newMousePoint, newSymPoint, newCenterPoint}
}

// 获取触点在未旋转矩形内的坐标
function getStickPoint(stick, width, height) {
  return {
    tl: [0, 0],
    tm: [width / 2, 0],
    tr: [width, 0],
    mr: [width, height / 2],
    br: [width, height],
    bm: [width / 2, height],
    bl: [0, height],
    ml: [0, height / 2],
  }[stick]
}

// 设置最小尺寸时不可翻转，越过对边后的距离按 0 处理，由 min 尺寸接管
function getResizeWidth(point, symPoint, stick, currentWidth, limits) {
  let raw
  if (stick.includes('l')) raw = symPoint[0] - point[0]
  else if (stick.includes('r')) raw = point[0] - symPoint[0]
  else return currentWidth
  return hasMinSizeLimit(limits) ? Math.max(0, raw) : Math.abs(raw)
}

function getResizeHeight(point, symPoint, stick, currentHeight, limits) {
  let raw
  if (stick.includes('t')) raw = symPoint[1] - point[1]
  else if (stick.includes('b')) raw = point[1] - symPoint[1]
  else return currentHeight
  return hasMinSizeLimit(limits) ? Math.max(0, raw) : Math.abs(raw)
}

// 根据固定的对称触点反推受限后的矩形位置，避免旋转状态下缩放被 min/max 截断时发生位移
// 返回 { width, height, left, top }；symRelativeContactor 缺失时仅返回宽高
function renderLimitedRect({width, height, stick, rotate, symRelativeContactor}) {
  const symStick = getSymStickByStick(stick)
  const symPoint = getStickPoint(symStick, width, height)

  if (!symPoint || !symRelativeContactor) {
    return {width, height}
  }

  const centerOffset = [symPoint[0] - width / 2, symPoint[1] - height / 2]
  const rotatedCenterOffset = calcRotatedPoint(centerOffset, [0, 0], -rotate)
  const centerPoint = [
    symRelativeContactor[0] - rotatedCenterOffset[0],
    symRelativeContactor[1] - rotatedCenterOffset[1],
  ]

  return {
    width,
    height,
    left: centerPoint[0] - width / 2,
    top: centerPoint[1] - height / 2,
  }
}

// 局部对称触点映射（与 maps.getSymStick 等价，独立放置避免循环依赖）
function getSymStickByStick(stick) {
  const [s0, s1] = stick.split('')
  const reverseMap = {t: 'b', b: 't', l: 'r', r: 'l'}
  return `${reverseMap[s0] || 'm'}${reverseMap[s1] || 'm'}`
}

// 缩放主入口：输入当前矩形状态 + 鼠标点 + 触点 → 输出新的 width/height/left/top
function computeResize({
  point,           // 当前元素未旋转坐标系下的鼠标点
  symPoint,        // 当前元素未旋转坐标系下的对称触点
  stick,           // 当前操作触点
  lock,            // 是否锁定宽高比
  rotate,          // 当前元素旋转角
  width,           // 当前宽
  height,          // 当前高
  whRatio,         // 宽高比
  limits,          // normalizeSizeLimits 的结果
  symRelativeContactor, // 父元素坐标系下的对称触点
}) {
  if (stick === 'angle') return null
  const baseAxis = stick.includes('l') || stick.includes('r') ? 'width' : 'height'
  const nextWidthRaw = getResizeWidth(point, symPoint, stick, width, limits)
  const nextHeightRaw = getResizeHeight(point, symPoint, stick, height, limits)
  const limited = getLimitedSize({
    width: nextWidthRaw,
    height: nextHeightRaw,
    lock,
    baseAxis,
    limits,
    whRatio,
  })
  return renderLimitedRect({
    width: limited.width,
    height: limited.height,
    stick,
    rotate,
    symRelativeContactor,
  })
}

export {
  calcRectResetRotated,
  getStickPoint,
  getResizeWidth,
  getResizeHeight,
  renderLimitedRect,
  computeResize,
}
