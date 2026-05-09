import { calcRotatedPoint } from './calc'
import { getLimitedSize } from './size'
import { renderLimitedRect } from '../resize/computeResize'
import type { Point, RectGeometry, SizeLimits, StickType } from '../types'

export type LimitRange = readonly [number, number] | [number, number] | null | undefined

export interface RotatedRectInput {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}

export interface AABB {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/** 计算旋转后矩形的 4 角点（父坐标系）及轴对齐包围盒 */
export function getRotatedRectAABB({
  left,
  top,
  width,
  height,
  rotate,
}: RotatedRectInput): AABB {
  const cx = left + width / 2
  const cy = top + height / 2
  const hw = width / 2
  const hh = height / 2
  const offsets: Point[] = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ]
  // 与 calcRotatedContactor 保持一致：屏幕(CSS)旋转使用 -rotate
  const rotated = offsets.map((o) =>
    calcRotatedPoint([cx + o[0], cy + o[1]], [cx, cy], -rotate)
  )
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity
  for (const [x, y] of rotated) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minX, maxX, minY, maxY }
}

/** 计算把 AABB 平移回 limit 区间所需的位移；若 AABB 比区间还大则 fits=false */
export function getBoundaryShift(
  aabb: AABB,
  limitX?: LimitRange,
  limitY?: LimitRange
): { dx: number; dy: number; fits: boolean } {
  let dx = 0
  let dy = 0
  let fits = true
  if (limitX) {
    const [lo, hi] = limitX
    if (aabb.maxX - aabb.minX > hi - lo + 1e-6) fits = false
    else if (aabb.minX < lo) dx = lo - aabb.minX
    else if (aabb.maxX > hi) dx = hi - aabb.maxX
  }
  if (limitY) {
    const [lo, hi] = limitY
    if (aabb.maxY - aabb.minY > hi - lo + 1e-6) fits = false
    else if (aabb.minY < lo) dy = lo - aabb.minY
    else if (aabb.maxY > hi) dy = hi - aabb.maxY
  }
  return { dx, dy, fits }
}

export function hasBoundary(limitX?: LimitRange, limitY?: LimitRange): boolean {
  return Boolean(limitX) || Boolean(limitY)
}

/** 判断旋转矩形是否落在 limit 区间内（无需平移） */
export function isRectInsideLimits(
  rect: RotatedRectInput,
  limitX?: LimitRange,
  limitY?: LimitRange
): boolean {
  const aabb = getRotatedRectAABB(rect)
  const { dx, dy, fits } = getBoundaryShift(aabb, limitX, limitY)
  return fits && dx === 0 && dy === 0
}

/**
 * 拖拽/初始化时的位置约束：保持尺寸与 rotate 不变，平移回界内
 * 若矩形 AABB 大于区间则保持原位（不强行截断）
 */
export function clampPositionWithinLimits(
  rect: RotatedRectInput,
  limitX?: LimitRange,
  limitY?: LimitRange
): { left: number; top: number; fits: boolean } {
  if (!hasBoundary(limitX, limitY)) {
    return { left: rect.left, top: rect.top, fits: true }
  }
  const aabb = getRotatedRectAABB(rect)
  const { dx, dy, fits } = getBoundaryShift(aabb, limitX, limitY)
  if (!fits) return { left: rect.left, top: rect.top, fits: false }
  return { left: rect.left + dx, top: rect.top + dy, fits: true }
}

export interface FitResizeInput {
  width: number
  height: number
  stick: StickType
  rotate: number
  symRelativeContactor: Point | null
  lock: boolean
  whRatio: number
  limits: SizeLimits
}

/**
 * Resize 受限：在 sym-contactor 锚点不动的前提下，二分搜索最大可行的尺寸缩放比例
 * - lock 模式下保持比例的等比缩放
 * - 中点 stick：仅缩放有变化的轴
 */
export function fitResizeWithinLimits(
  input: FitResizeInput,
  limitX?: LimitRange,
  limitY?: LimitRange
): RectGeometry {
  const { width, height, stick, rotate, symRelativeContactor, lock, whRatio, limits } = input
  const baseAxis: 'width' | 'height' =
    stick.includes('l') || stick.includes('r') ? 'width' : 'height'

  const buildAt = (w: number, h: number): RectGeometry => {
    const sized = getLimitedSize({ width: w, height: h, lock, baseAxis, limits, whRatio })
    return renderLimitedRect({
      width: sized.width,
      height: sized.height,
      stick,
      rotate,
      symRelativeContactor,
    })
  }

  const fitsAt = (r: RectGeometry): boolean => {
    return isRectInsideLimits(
      {
        left: r.left ?? 0,
        top: r.top ?? 0,
        width: r.width,
        height: r.height,
        rotate,
      },
      limitX,
      limitY
    )
  }

  const initial = buildAt(width, height)
  if (!hasBoundary(limitX, limitY) || fitsAt(initial)) return initial

  const widthChanges = lock || stick.includes('l') || stick.includes('r')
  const heightChanges = lock || stick.includes('t') || stick.includes('b')

  let lo = 0
  let hi = 1
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    const w = widthChanges ? width * mid : width
    const h = heightChanges ? height * mid : height
    if (fitsAt(buildAt(w, h))) lo = mid
    else hi = mid
  }
  const w = widthChanges ? width * lo : width
  const h = heightChanges ? height * lo : height
  return buildAt(w, h)
}
