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

/** AABB 检测的浮点容差：避免边角浮点误差让贴边状态被误判为越界 */
const BOUNDARY_EPS = 1e-3

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
    if (aabb.maxX - aabb.minX > hi - lo + BOUNDARY_EPS) fits = false
    else if (aabb.minX < lo - BOUNDARY_EPS) dx = lo - aabb.minX
    else if (aabb.maxX > hi + BOUNDARY_EPS) dx = hi - aabb.maxX
  }
  if (limitY) {
    const [lo, hi] = limitY
    if (aabb.maxY - aabb.minY > hi - lo + BOUNDARY_EPS) fits = false
    else if (aabb.minY < lo - BOUNDARY_EPS) dy = lo - aabb.minY
    else if (aabb.maxY > hi + BOUNDARY_EPS) dy = hi - aabb.maxY
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
  /** 上一帧（未应用本次拖拽前）的合法尺寸；越界时用作二分基线，避免"snap back" */
  prevWidth: number
  prevHeight: number
  stick: StickType
  rotate: number
  symRelativeContactor: Point | null
  lock: boolean
  whRatio: number
  limits: SizeLimits
}

/**
 * Resize 受限：在 sym-contactor 锚点不动的前提下确定最终尺寸
 *
 * 二分基线从 prev → request 沿"用户意图方向"线性插值，保证：
 *   - 请求合法 → 直接采用请求值
 *   - 请求越界且 prev 合法 → 取 [prev, request] 间最大的合法尺寸（≥ prev，永不 snap back）
 *   - prev 也越界（如边界刚被收紧、初始化越界）→ 退化为 [0, request] 二分缩
 *
 * 这样能正确处理 max 与 limit 同时存在、贴边继续拖等场景，避免"突然缩回拖拽前大小"。
 */
export function fitResizeWithinLimits(
  input: FitResizeInput,
  limitX?: LimitRange,
  limitY?: LimitRange
): RectGeometry {
  const {
    width,
    height,
    prevWidth,
    prevHeight,
    stick,
    rotate,
    symRelativeContactor,
    lock,
    whRatio,
    limits,
  } = input
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

  // 选取二分下界：优先用 prev（上一帧合法值），否则退化到 0
  const prevCandidate = buildAt(prevWidth, prevHeight)
  const lowerW = fitsAt(prevCandidate) ? prevWidth : 0
  const lowerH = fitsAt(prevCandidate) ? prevHeight : 0

  // 在 [lower, request] 间二分插值，t∈[0,1]：t=0 → lower，t=1 → request
  let lo = 0
  let hi = 1
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    const w = lowerW + (width - lowerW) * mid
    const h = lowerH + (height - lowerH) * mid
    if (fitsAt(buildAt(w, h))) lo = mid
    else hi = mid
  }
  const w = lowerW + (width - lowerW) * lo
  const h = lowerH + (height - lowerH) * lo
  return buildAt(w, h)
}
