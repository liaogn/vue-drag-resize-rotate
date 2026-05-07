import { getParentsRotate } from '../dom/rotate'
import type {
  StickCursorState,
  StickHoverRender,
  StickHoverRenderResult,
} from '../types'

/** 默认 cursor 图标渲染函数 */
export function defaultCursorIconRender(cursorRotate: number): StickHoverRenderResult {
  return {
    x: 16,
    y: 16,
    htmlText: `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" >
    <path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(${cursorRotate}deg);transform-origin: 16px 16px"></path>
  </svg>`,
  }
}

/** svg 转 base64 */
export function svgTobase64(svgString: string): string {
  if (typeof svgString !== 'string' || svgString.length <= 0) return ''
  return window.btoa(unescape(encodeURIComponent(svgString)))
}

/** 获取控件图标悬停角度（基于父链累计旋转 + stick 方向） */
export function getCursorIconRotate(parentsRotate = 0, stick: string): number {
  const map: Record<string, number> = {
    tl: parentsRotate - 45,
    tr: parentsRotate + 45,
    bl: parentsRotate - 135,
    br: parentsRotate + 135,
    tm: parentsRotate + 0,
    mr: parentsRotate + 90,
    bm: parentsRotate - 180,
    ml: parentsRotate - 90,
  }
  return map[stick] ?? 0
}

export interface BuildStickCursorOptions {
  hoverRender?: StickHoverRender
}

/**
 * 计算指定 stick 鼠标进入时的 cursor 字符串
 * @returns 'default' | css-cursor 字符串 | null（angle 触点不处理）
 */
export function buildStickCursor(
  ev: MouseEvent,
  stick: string,
  state: StickCursorState,
  options: BuildStickCursorOptions = {}
): string | null {
  if (stick === 'angle') return null
  if (state.stickDrag && state.currentStick !== stick) {
    return 'default'
  }
  const parentsRotate = getParentsRotate(ev)
  const cursorRotate = getCursorIconRotate(parentsRotate, stick)
  const renderFunc = options.hoverRender || defaultCursorIconRender
  const { htmlText, x, y } = renderFunc(cursorRotate)
  const iconBase64 = svgTobase64(htmlText)
  const iconUrl = `data:image/svg+xml;base64,${iconBase64}`
  return state.resizeable ? `url(${iconUrl}) ${x} ${y},auto` : 'no-drop'
}

/** 鼠标移出 stick 时是否要重置 cursor */
export function shouldResetStickCursor(
  stick: string,
  state: { stickDrag: boolean }
): boolean {
  if (stick === 'angle') return false
  if (state.stickDrag) return false
  return true
}
