import type { SizeLimits } from '../types'

/** 限制数值范围 */
export function clampSize(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** 标准化外部传入的 min/max。若 max 小于 min 则以 min 为准 */
export function normalizeSizeLimits(input: Partial<SizeLimits> = {}): SizeLimits {
  const { minWidth = 0, minHeight = 0, maxWidth = Infinity, maxHeight = Infinity } = input
  const _minWidth = Math.max(0, minWidth)
  const _minHeight = Math.max(0, minHeight)
  const _maxWidth = Math.max(_minWidth, maxWidth)
  const _maxHeight = Math.max(_minHeight, maxHeight)
  return {
    minWidth: _minWidth,
    minHeight: _minHeight,
    maxWidth: _maxWidth,
    maxHeight: _maxHeight,
  }
}

/** 是否存在最小尺寸限制（用于决定是否禁用翻转） */
export function hasMinSizeLimit(limits: SizeLimits): boolean {
  return limits.minWidth > 0 || limits.minHeight > 0
}

/** 锁定比例时，保证比例为有限正数；否则回落 1 */
export function getValidWhRatio(whRatio: number): number {
  return isFinite(whRatio) && whRatio > 0 ? whRatio : 1
}

export interface GetLimitedSizeInput {
  width: number
  height: number
  lock?: boolean
  baseAxis?: 'width' | 'height'
  limits: SizeLimits
  whRatio?: number
}

/** 根据限制生成最终宽高；lock 时会同步折算另一边的限制，保持宽高比 */
export function getLimitedSize({
  width,
  height,
  lock = false,
  baseAxis = 'width',
  limits,
  whRatio = 1,
}: GetLimitedSizeInput): { width: number; height: number } {
  const { minWidth, minHeight, maxWidth, maxHeight } = limits
  let nextWidth = Math.max(0, width)
  let nextHeight = Math.max(0, height)

  if (!lock) {
    return {
      width: clampSize(nextWidth, minWidth, maxWidth),
      height: clampSize(nextHeight, minHeight, maxHeight),
    }
  }

  const ratio = getValidWhRatio(whRatio)
  if (baseAxis === 'height') {
    const heightMin = Math.max(minHeight, minWidth / ratio)
    const heightMax = Math.max(heightMin, Math.min(maxHeight, maxWidth / ratio))
    nextHeight = clampSize(nextHeight, heightMin, heightMax)
    nextWidth = nextHeight * ratio
  } else {
    const widthMin = Math.max(minWidth, minHeight * ratio)
    const widthMax = Math.max(widthMin, Math.min(maxWidth, maxHeight * ratio))
    nextWidth = clampSize(nextWidth, widthMin, widthMax)
    nextHeight = nextWidth / ratio
  }

  return { width: nextWidth, height: nextHeight }
}
