/** 8 个尺寸触点 */
export type StickType = 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml'

/** 旋转触点 */
export type AngleStick = 'angle'

/** 所有触点（含旋转） */
export type AllStickType = StickType | AngleStick

/** 对称触点字符（中心点为 mm） */
export type SymStickType = StickType | 'mm'

/** 二维坐标 [x, y] */
export type Point = [number, number] | number[]

/** 翻转方向标记 */
export type FlipSign = '' | '+' | '-'

/** 元素几何信息（dom/element.ts 返回） */
export interface ElementGeometricInfo {
  x: number
  y: number
  left: number
  top: number
  width: number
  height: number
  cx: number
  cy: number
  offsetWidth: number
  offsetHeight: number
  /** 当前元素自身旋转角（基于 transform matrix） */
  rotate: number
  /** 累计到 document 的绝对旋转角 */
  absoluteRotate: number
}

/** 尺寸限制 */
export interface SizeLimits {
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
}

/** 触点 hover 时的图标渲染结果 */
export interface StickHoverRenderResult {
  x: number
  y: number
  htmlText: string
}

/** 触点 hover 自定义 cursor 渲染函数 */
export type StickHoverRender = (cursorRotate: number) => StickHoverRenderResult

/** 组件事件回调中的 pos 参数 */
export interface PosData {
  uuid: string | number
  x: number
  y: number
  w: number
  h: number
  r: number
  z: number | string
  stick: AllStickType | ''
  lock: boolean
  active: boolean
  flipSign: FlipSign
}

/** 矩形渲染信息（仅含尺寸） */
export interface RectSize {
  width: number
  height: number
}

/** 矩形渲染信息（含位置） */
export interface RectGeometry extends RectSize {
  left?: number
  top?: number
}

/** buildStickCursor 需要的运行时状态 */
export interface StickCursorState {
  stickDrag: boolean
  currentStick: string
  resizeable: boolean
}
