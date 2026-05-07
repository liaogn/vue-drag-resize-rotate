import { calcRotatedContactor, calcBorderLineEquation, type LineEquation } from '../geometry/calc'
import type { ElementGeometricInfo, FlipSign, Point, StickType } from '../types'

/**
 * 编辑直线的两点：
 * - 第一项：非翻转 180deg 的边界点（普通翻转，不需改 rotate）
 * - 第二项：需翻转 180deg 的边界点（向对边翻转）
 */
const breakStickMaps: Record<StickType, Array<[StickType, StickType] | null>> = {
  tl: [
    ['tr', 'br'],
    ['bl', 'br'],
  ],
  tr: [
    ['tl', 'bl'],
    ['br', 'bl'],
  ],
  bl: [
    ['br', 'tr'],
    ['tl', 'tr'],
  ],
  br: [
    ['bl', 'tl'],
    ['tr', 'tl'],
  ],
  tm: [null, ['bl', 'br']],
  mr: [['tl', 'bl'], null],
  bm: [null, ['tr', 'tl']],
  ml: [['tr', 'br'], null],
}

type SignTuple = [FlipSign, FlipSign]

export default class RectFliper {
  private flipRecting = false
  private absoluteContactor: Point | undefined
  private borderLineEquations: Array<LineEquation | null>
  private borderSigns: SignTuple[]

  constructor(elementInfo: ElementGeometricInfo, stick: StickType) {
    this.absoluteContactor = calcRotatedContactor(elementInfo, stick)
    this.borderLineEquations = this.getBorderLineEquation(elementInfo, stick)
    this.borderSigns = this.getFlipBorderSigns(this.borderLineEquations, this.absoluteContactor)
  }

  private getFlipBorderSigns(
    borderLineEquations: Array<LineEquation | null>,
    point: Point | undefined
  ): SignTuple[] {
    return borderLineEquations.map((lineEquation) => {
      if (!lineEquation || !point) return ['', ''] as SignTuple
      return this.getCurSign(lineEquation, point)
    })
  }

  private getBorderLineEquation(
    elementInfo: ElementGeometricInfo,
    stick: StickType
  ): Array<LineEquation | null> {
    const borderPoints = this.getBreakPoints(elementInfo, stick)
    return borderPoints.map((points) => {
      if (!points) return null
      return calcBorderLineEquation(points[0], points[1])
    })
  }

  private getBreakPoints(
    elementInfo: ElementGeometricInfo,
    stick: StickType
  ): Array<[Point, Point] | null> {
    const breakSticks = breakStickMaps[stick]
    if (!breakSticks) return []
    return breakSticks.map((stickArray) => {
      if (!stickArray) return null
      const p1 = calcRotatedContactor(elementInfo, stickArray[0])
      const p2 = calcRotatedContactor(elementInfo, stickArray[1])
      if (!p1 || !p2) return null
      return [p1, p2] as [Point, Point]
    })
  }

  private getCurSign(lineEquation: LineEquation, point: Point): SignTuple {
    const diffX = lineEquation('x', point[1]) - point[0]
    const diffX_sign: FlipSign = diffX >= 0 ? '+' : '-'
    const diffY = lineEquation('y', point[0]) - point[1]
    const diffY_sign: FlipSign = diffY >= 0 ? '+' : '-'
    return [diffX_sign, diffY_sign]
  }

  /** 获取翻转后的当前触点 */
  getFlipStick(stick: StickType): StickType {
    if (stick.match('m')) {
      return ({ tm: 'tm', bm: 'bm', ml: 'mr', mr: 'ml' } as Record<string, StickType>)[stick]
    }
    const [s0, s1] = stick.split('') as [string, string]
    const reverseMap: Record<string, string> = { t: 'b', b: 't', l: 'r', r: 'l' }
    return `${s0}${reverseMap[s1]}` as StickType
  }

  /** 监测边界符号变化（符号翻转 → 触发回调） */
  borderSignsWatcher(
    mousePoint: Point,
    callback: (isDegFlip: boolean, sign: FlipSign) => void
  ): void {
    this.borderLineEquations.forEach((lineEquation, index) => {
      if (this.flipRecting || !lineEquation) return

      const curSigns = this.getCurSign(lineEquation, mousePoint)
      const breakingSign = this.borderSigns[index].find(
        (sign, i) => sign !== curSigns[i]
      )

      if (breakingSign) {
        const isDegFlip = index === 1
        this.flipRecting = true
        callback(isDegFlip, breakingSign as FlipSign)
        this.flipRecting = false
      }

      this.borderSigns[index] = curSigns
    })
  }
}
