import { getRotatedRectAABB, type RotatedRectInput } from '../geometry/boundary'

export type SnapAxis = 'x' | 'y'

/** 候选吸附线来源 */
export type SnapSource = 'parent' | 'sibling' | 'custom' | 'grid'

/** 吸附目标开关（grid / 自定义线由独立入参控制） */
export type SnapTarget = 'parent' | 'siblings'

/** 自定义吸附线：x 为竖直线，y 为水平线（父坐标系） */
export interface SnapLineInput {
  x?: number
  y?: number
}

/** 一条候选吸附线 */
export interface SnapCandidate {
  axis: SnapAxis
  value: number
  source: SnapSource
  /** 来源矩形在垂直方向上的范围，用于把参考线画成线段；缺省表示通长线 */
  start?: number
  end?: number
}

/** 吸附命中后回传的参考线（父坐标系） */
export interface SnapGuide {
  axis: SnapAxis
  value: number
  source: SnapSource
  /** 参考线段范围：覆盖来源矩形与被吸附矩形的并集 */
  start: number
  end: number
}

export interface SnapResult {
  dx: number
  dy: number
  guides: SnapGuide[]
}

export interface BuildSnapCandidatesInput {
  /** 父容器内容尺寸；提供且 targets 含 parent 时生成边缘 + 中线候选 */
  parentSize?: { width: number; height: number } | null
  /** 同级矩形（父坐标系），按旋转后 AABB 的边缘 + 中心生成候选 */
  siblings?: RotatedRectInput[]
  /** 自定义吸附线 */
  lines?: SnapLineInput[] | null
  targets?: SnapTarget[]
}

/** 由父容器 / 同级元素 / 自定义线构建候选吸附线集合（拖拽开始时调用一次） */
export function buildSnapCandidates({
  parentSize,
  siblings = [],
  lines,
  targets = ['parent', 'siblings'],
}: BuildSnapCandidatesInput): SnapCandidate[] {
  const candidates: SnapCandidate[] = []

  if (parentSize && targets.includes('parent')) {
    const { width, height } = parentSize
    for (const value of [0, width / 2, width]) {
      candidates.push({ axis: 'x', value, source: 'parent', start: 0, end: height })
    }
    for (const value of [0, height / 2, height]) {
      candidates.push({ axis: 'y', value, source: 'parent', start: 0, end: width })
    }
  }

  if (targets.includes('siblings')) {
    for (const rect of siblings) {
      const aabb = getRotatedRectAABB(rect)
      for (const value of [aabb.minX, (aabb.minX + aabb.maxX) / 2, aabb.maxX]) {
        candidates.push({ axis: 'x', value, source: 'sibling', start: aabb.minY, end: aabb.maxY })
      }
      for (const value of [aabb.minY, (aabb.minY + aabb.maxY) / 2, aabb.maxY]) {
        candidates.push({ axis: 'y', value, source: 'sibling', start: aabb.minX, end: aabb.maxX })
      }
    }
  }

  if (lines) {
    for (const line of lines) {
      if (typeof line.x === 'number') candidates.push({ axis: 'x', value: line.x, source: 'custom' })
      if (typeof line.y === 'number') candidates.push({ axis: 'y', value: line.y, source: 'custom' })
    }
  }

  return candidates
}

/** 判定两个值在吸附命中意义上相等的容差 */
const SNAP_EPS = 1e-6

interface AxisBest {
  delta: number
  hit: boolean
}

function findBestDelta(probes: number[], values: number[], threshold: number): AxisBest {
  let best: AxisBest = { delta: 0, hit: false }
  let bestDist = threshold + SNAP_EPS
  for (const value of values) {
    for (const probe of probes) {
      const delta = value - probe
      const dist = Math.abs(delta)
      if (dist < bestDist) {
        bestDist = dist
        best = { delta, hit: true }
      }
    }
  }
  return best
}

function nearestGridValue(probe: number, gridSize: number): number {
  return Math.round(probe / gridSize) * gridSize
}

/**
 * 拖拽吸附主入口：输入移动中的矩形与候选线 → 输出位移修正 (dx, dy) 与命中的参考线
 *
 * - 吸附探测点为旋转后 AABB 的两边缘 + 中心（每轴 3 个）
 * - x / y 两轴独立取距离最近且 ≤ threshold 的候选
 * - grid 参与吸附但不产生 guides（网格通常以背景形式常显）
 */
export function computeSnap(
  rect: RotatedRectInput,
  candidates: SnapCandidate[],
  threshold: number,
  grid?: readonly [number, number] | [number, number] | null
): SnapResult {
  const aabb = getRotatedRectAABB(rect)
  const probesX = [aabb.minX, (aabb.minX + aabb.maxX) / 2, aabb.maxX]
  const probesY = [aabb.minY, (aabb.minY + aabb.maxY) / 2, aabb.maxY]

  const valuesX = candidates.filter((c) => c.axis === 'x').map((c) => c.value)
  const valuesY = candidates.filter((c) => c.axis === 'y').map((c) => c.value)
  if (grid && grid[0] > 0) valuesX.push(...probesX.map((p) => nearestGridValue(p, grid[0])))
  if (grid && grid[1] > 0) valuesY.push(...probesY.map((p) => nearestGridValue(p, grid[1])))

  const bestX = findBestDelta(probesX, valuesX, threshold)
  const bestY = findBestDelta(probesY, valuesY, threshold)
  const dx = bestX.hit ? bestX.delta : 0
  const dy = bestY.hit ? bestY.delta : 0

  return {
    dx,
    dy,
    guides: collectGuides(
      { ...rect, left: rect.left + dx, top: rect.top + dy },
      candidates,
      bestX.hit,
      bestY.hit
    ),
  }
}

/** 吸附后矩形贴中的所有候选线（去重，grid 除外） */
function collectGuides(
  rect: RotatedRectInput,
  candidates: SnapCandidate[],
  hitX: boolean,
  hitY: boolean
): SnapGuide[] {
  const aabb = getRotatedRectAABB(rect)
  const probes: Record<SnapAxis, number[]> = {
    x: [aabb.minX, (aabb.minX + aabb.maxX) / 2, aabb.maxX],
    y: [aabb.minY, (aabb.minY + aabb.maxY) / 2, aabb.maxY],
  }
  const extents: Record<SnapAxis, [number, number]> = {
    x: [aabb.minY, aabb.maxY],
    y: [aabb.minX, aabb.maxX],
  }

  const guides: SnapGuide[] = []
  for (const candidate of candidates) {
    if (candidate.axis === 'x' ? !hitX : !hitY) continue
    const matched = probes[candidate.axis].some(
      (probe) => Math.abs(candidate.value - probe) < SNAP_EPS * 1e3
    )
    if (!matched) continue
    const [rectStart, rectEnd] = extents[candidate.axis]
    const guide: SnapGuide = {
      axis: candidate.axis,
      value: candidate.value,
      source: candidate.source,
      start: candidate.start === undefined ? rectStart : Math.min(candidate.start, rectStart),
      end: candidate.end === undefined ? rectEnd : Math.max(candidate.end, rectEnd),
    }
    const existing = guides.find(
      (g) => g.axis === guide.axis && Math.abs(g.value - guide.value) < SNAP_EPS
    )
    if (existing) {
      existing.start = Math.min(existing.start, guide.start)
      existing.end = Math.max(existing.end, guide.end)
    } else {
      guides.push(guide)
    }
  }
  return guides
}

/**
 * 旋转角度吸附：吸附到 step 整数倍
 *
 * threshold 为吸附触发距离（度）。threshold ≥ step / 2 时退化为硬步进
 * （任意角度都会落到最近的 step 倍数），可用于实现 Shift 步进旋转。
 */
export function snapRotation(
  angle: number,
  step: number,
  threshold: number
): { angle: number; snapped: boolean } {
  if (!(step > 0)) return { angle, snapped: false }
  const nearest = Math.round(angle / step) * step
  if (Math.abs(angle - nearest) <= threshold) {
    return { angle: nearest, snapped: true }
  }
  return { angle, snapped: false }
}
