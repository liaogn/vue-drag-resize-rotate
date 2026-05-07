import { angleToRadian } from '../dom/rotate'
import { contactorMaps } from './maps'
import type { ElementGeometricInfo, Point, StickType } from '../types'

/**
 * 计算两点间的斜率
 * 当 p1 与 p2 重合时 (NaN)，返回 0（视为水平线，由 calcVerticalCrossPoint 中的 isFinite 兜底）
 */
export function calcLineSlope(p1: Point, p2: Point): number {
  const k = (p2[1] - p1[1]) / (p2[0] - p1[0])
  return isNaN(k) ? 0 : k
}

/** 求点 p0 与 p1、p2 构成的直线的垂直交点 */
export function calcVerticalCrossPoint(p0: Point, p1: Point, p2: Point): Point {
  const [x0, y0] = p0
  const [x2, y2] = p2
  const k = calcLineSlope(p1, p2)
  // 斜率为无穷时 → 参考线垂直，鼠标 y 即交点 y，交点 x 取参考线 x
  if (!isFinite(k)) return [x2, y0]
  // 求一点与一条直线（参考线）的垂直交点
  // 直线方程（参考线） y=k*x+b1，垂直线 y=(-1/k)*x+b2
  // 联立 → 解二元一次方程
  const kk = Math.pow(k, 2)
  const xp = (kk * x2 - y2 * k + y0 * k + x0) / (kk + 1)
  const yp = (y2 - x2 * k + y0 * kk + x0 * k) / (kk + 1)
  return [Math.round(xp), Math.round(yp)]
}

/** 获取两点中心点 */
export function calcCenterPoint(p1: Point, p2: Point): Point {
  return [p1[0] + (p2[0] - p1[0]) / 2, p1[1] + (p2[1] - p1[1]) / 2]
}

/**
 * 计算某个点基于某个原点旋转后的坐标
 * @param point 输入点
 * @param originPoint 旋转原点
 * @param rotate 旋转角（角度）
 */
export function calcRotatedPoint(
  point: Point,
  originPoint: Point = [0, 0],
  rotate = 0
): Point {
  const X = point[0] - originPoint[0]
  const Y = point[1] - originPoint[1]
  const { cos, sin } = Math
  const rad = angleToRadian(rotate)
  return [
    X * cos(rad) + Y * sin(rad) + originPoint[0],
    Y * cos(rad) - X * sin(rad) + originPoint[1],
  ]
}

/** 计算矩形 8 个触点（旋转状态下的实际坐标） */
export function calcRotatedContactor(
  geometricInfo: ElementGeometricInfo,
  positionType: StickType
): Point | undefined {
  const { offsetWidth: width, offsetHeight: height, left, top, absoluteRotate, cy, cx } = geometricInfo
  const absolutePoint = contactorMaps({ left, top, width, height }, positionType)
  if (!absolutePoint) return
  return calcRotatedPoint(absolutePoint, [cx, cy], -absoluteRotate)
}

/** 边界直线方程：传入两点 → 返回 (axis, knownValue) → 另一轴的值 */
export type LineEquation = (targetAxis: 'x' | 'y', knownValue: number) => number

export function calcBorderLineEquation(p1: Point, p2: Point): LineEquation {
  const [x1, y1] = p1
  const [x2, y2] = p2
  const k = (y2 - y1) / (x2 - x1)
  return (targetAxis, knownValue) => {
    if (k === 0) {
      return targetAxis === 'y' ? y1 : NaN
    } else if (!isFinite(k)) {
      return targetAxis === 'x' ? x1 : NaN
    } else if (targetAxis === 'y') {
      return k * (knownValue - x1) + y1
    } else {
      return (knownValue + k * x1 - y1) / k
    }
  }
}
