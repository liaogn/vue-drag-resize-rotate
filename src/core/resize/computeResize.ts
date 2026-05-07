import { calcCenterPoint, calcRotatedPoint } from '../geometry/calc'
import { getLimitedSize, hasMinSizeLimit } from '../geometry/size'
import type {
  ElementGeometricInfo,
  Point,
  RectGeometry,
  SizeLimits,
  StickType,
} from '../types'

/**
 * 计算矩形旋转复位后的几何信息
 * @param mousePoint 鼠标点（document 坐标）
 * @param symRelativeContactor 对称触点（相对父元素，未旋转坐标系）
 * @param parentInfo 父元素几何信息
 * @param rotate 当前元素旋转角
 */
export function calcRectResetRotated(
  mousePoint: Point,
  symRelativeContactor: Point,
  parentInfo: ElementGeometricInfo,
  rotate: number
): { newMousePoint: Point; newSymPoint: Point; newCenterPoint: Point } {
  const mouseAbsoluteRotatedPoint = calcRotatedPoint(
    mousePoint,
    [parentInfo.cx, parentInfo.cy],
    parentInfo.absoluteRotate
  )

  const mouseRelativeRotatedPoint: Point = [
    mouseAbsoluteRotatedPoint[0] - parentInfo.left,
    mouseAbsoluteRotatedPoint[1] - parentInfo.top,
  ]

  const newCenterPoint = calcCenterPoint(mouseRelativeRotatedPoint, symRelativeContactor)
  const newMousePoint = calcRotatedPoint(mouseRelativeRotatedPoint, newCenterPoint, rotate)
  const newSymPoint = calcRotatedPoint(symRelativeContactor, newCenterPoint, rotate)

  return { newMousePoint, newSymPoint, newCenterPoint }
}

/** 获取触点在未旋转矩形内的坐标 */
export function getStickPoint(
  stick: StickType,
  width: number,
  height: number
): Point | undefined {
  const map: Record<StickType, Point> = {
    tl: [0, 0],
    tm: [width / 2, 0],
    tr: [width, 0],
    mr: [width, height / 2],
    br: [width, height],
    bm: [width / 2, height],
    bl: [0, height],
    ml: [0, height / 2],
  }
  return map[stick]
}

/** 设置最小尺寸时不可翻转，越过对边后的距离按 0 处理 */
export function getResizeWidth(
  point: Point,
  symPoint: Point,
  stick: StickType,
  currentWidth: number,
  limits: SizeLimits
): number {
  let raw: number
  if (stick.includes('l')) raw = symPoint[0] - point[0]
  else if (stick.includes('r')) raw = point[0] - symPoint[0]
  else return currentWidth
  return hasMinSizeLimit(limits) ? Math.max(0, raw) : Math.abs(raw)
}

export function getResizeHeight(
  point: Point,
  symPoint: Point,
  stick: StickType,
  currentHeight: number,
  limits: SizeLimits
): number {
  let raw: number
  if (stick.includes('t')) raw = symPoint[1] - point[1]
  else if (stick.includes('b')) raw = point[1] - symPoint[1]
  else return currentHeight
  return hasMinSizeLimit(limits) ? Math.max(0, raw) : Math.abs(raw)
}

interface RenderLimitedRectInput {
  width: number
  height: number
  stick: StickType
  rotate: number
  symRelativeContactor: Point | null
}

/**
 * 根据固定的对称触点反推受限后的矩形位置
 * 避免旋转状态下缩放被 min/max 截断时发生位移
 */
export function renderLimitedRect({
  width,
  height,
  stick,
  rotate,
  symRelativeContactor,
}: RenderLimitedRectInput): RectGeometry {
  const symStick = getSymStickByStick(stick)
  const symPoint = symStick ? getStickPoint(symStick, width, height) : undefined

  if (!symPoint || !symRelativeContactor) {
    return { width, height }
  }

  const centerOffset: Point = [symPoint[0] - width / 2, symPoint[1] - height / 2]
  const rotatedCenterOffset = calcRotatedPoint(centerOffset, [0, 0], -rotate)
  const centerPoint: Point = [
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

/** 局部对称触点映射（与 maps.getSymStick 等价，独立放置避免循环依赖） */
function getSymStickByStick(stick: StickType): StickType | undefined {
  const [s0, s1] = stick.split('') as [string, string]
  const reverseMap: Record<string, string> = { t: 'b', b: 't', l: 'r', r: 'l' }
  const result = `${reverseMap[s0] || 'm'}${reverseMap[s1] || 'm'}`
  return result === 'mm' ? undefined : (result as StickType)
}

export interface ComputeResizeInput {
  point: Point
  symPoint: Point
  stick: string
  lock: boolean
  rotate: number
  width: number
  height: number
  whRatio: number
  limits: SizeLimits
  symRelativeContactor: Point | null
}

/** 缩放主入口：输入当前矩形状态 + 鼠标点 + 触点 → 输出新的 width/height/left/top */
export function computeResize(input: ComputeResizeInput): RectGeometry | null {
  const {
    point,
    symPoint,
    stick,
    lock,
    rotate,
    width,
    height,
    whRatio,
    limits,
    symRelativeContactor,
  } = input

  if (stick === 'angle' || !stick) return null
  const stickType = stick as StickType

  const baseAxis: 'width' | 'height' =
    stickType.includes('l') || stickType.includes('r') ? 'width' : 'height'

  const nextWidthRaw = getResizeWidth(point, symPoint, stickType, width, limits)
  const nextHeightRaw = getResizeHeight(point, symPoint, stickType, height, limits)

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
    stick: stickType,
    rotate,
    symRelativeContactor,
  })
}
