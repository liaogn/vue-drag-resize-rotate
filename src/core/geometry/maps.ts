import type { Point, StickType, SymStickType } from '../types'

/** 触点映射：返回某触点在矩形中的坐标 */
export function contactorMaps(
  elementInfo: { left: number; top: number; width: number; height: number },
  positionType: StickType
): Point | undefined {
  const { left, top, width, height } = elementInfo
  const halfWidth = width / 2
  const halfHeight = height / 2
  const maps: Record<StickType, () => Point> = {
    tl: () => [left, top],
    tm: () => [left + halfWidth, top],
    tr: () => [left + width, top],
    mr: () => [left + width, top + halfHeight],
    br: () => [left + width, top + height],
    bm: () => [left + halfWidth, top + height],
    bl: () => [left, top + height],
    ml: () => [left, top + halfHeight],
  }
  return maps[positionType]?.()
}

/** 获取当前控点的中心对称控点 */
export function getSymStick(stick: StickType): SymStickType {
  const [s0, s1] = stick.split('') as [string, string]
  const reverseMap: Record<string, string> = { t: 'b', b: 't', l: 'r', r: 'l' }
  return `${reverseMap[s0] || 'm'}${reverseMap[s1] || 'm'}` as SymStickType
}
