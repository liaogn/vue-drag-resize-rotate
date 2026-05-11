import type { CSSProperties } from 'vue'

export interface PosDataLike {
  x: number
  y: number
  w: number
  h: number
  r: number
}

export const STAGE_WIDTH = 420
export const STAGE_HEIGHT = 380
export const BOUNDARY_RATIO = 0.95

export function centerRect(w: number, h: number, r = 0) {
  return {
    w,
    h,
    x: Math.round((STAGE_WIDTH - w) / 2),
    y: Math.round((STAGE_HEIGHT - h) / 2),
    r,
  }
}

export function getBoundary(width = STAGE_WIDTH, height = STAGE_HEIGHT) {
  const boundaryWidth = Math.round(width * BOUNDARY_RATIO)
  const boundaryHeight = Math.round(height * BOUNDARY_RATIO)
  const marginX = Math.round((width - boundaryWidth) / 2)
  const marginY = Math.round((height - boundaryHeight) / 2)

  return {
    x0: marginX,
    x1: marginX + boundaryWidth,
    y0: marginY,
    y1: marginY + boundaryHeight,
    width: boundaryWidth,
    height: boundaryHeight,
  }
}

export function centerRectInBoundary(
  w: number,
  h: number,
  r = 0,
  width = STAGE_WIDTH,
  height = STAGE_HEIGHT
) {
  const boundary = getBoundary(width, height)

  return {
    w,
    h,
    x: Math.round(boundary.x0 + (boundary.width - w) / 2),
    y: Math.round(boundary.y0 + (boundary.height - h) / 2),
    r,
  }
}

export function fmt(v: number) {
  return Number.isFinite(v) ? v.toFixed(1) : v
}

export function redArrowRender(cursorRotate: number) {
  return {
    x: 16,
    y: 16,
    htmlText: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20,10 L 16,5 Z" fill="crimson" stroke="white" stroke-width="1.2" style="transform:rotate(${cursorRotate}deg);transform-origin:16px 16px"/></svg>`,
  }
}

export type ThemeVars = Record<string, string>

export const themes: { name: string; vars: ThemeVars }[] = [
  { name: 'default', vars: {} },
  {
    name: 'crimson',
    vars: {
      '--vdr-stick-color': 'crimson',
      '--vdr-stick-hover-shadow-color': 'rgb(220 20 60 / 0.3)',
      '--vdr-active-outline-color': 'crimson',
      '--vdr-rotate-line-color': 'crimson',
    },
  },
  {
    name: 'square-large',
    vars: {
      '--vdr-stick-size': '20px',
      '--vdr-stick-border-radius': '2px',
      '--vdr-stick-color': '#52c41a',
      '--vdr-stick-hover-shadow-color': 'rgb(82 196 26 / 0.3)',
      '--vdr-active-outline-color': '#52c41a',
    },
  },
  {
    name: 'minimal',
    vars: {
      '--vdr-stick-size': '8px',
      '--vdr-stick-border-width': '1px',
      '--vdr-stick-color': '#222',
      '--vdr-stick-hover-shadow-width': '2px',
      '--vdr-stick-hover-shadow-color': 'rgb(0 0 0 / 0.2)',
      '--vdr-active-outline-color': '#222',
    },
  },
]

export function assignPos(target: PosDataLike, pos: PosDataLike) {
  target.x = pos.x
  target.y = pos.y
  target.w = pos.w
  target.h = pos.h
  target.r = pos.r
}

export function boundaryStyle(bound: {
  lx0: number
  lx1: number
  ly0: number
  ly1: number
}): CSSProperties {
  return {
    position: 'absolute',
    left: `${bound.lx0}px`,
    top: `${bound.ly0}px`,
    width: `${bound.lx1 - bound.lx0}px`,
    height: `${bound.ly1 - bound.ly0}px`,
    pointerEvents: 'none',
  }
}
