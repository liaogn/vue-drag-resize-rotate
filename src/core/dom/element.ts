import { getElementRotate, getAbsoluteRotate } from './rotate'
import type { ElementGeometricInfo } from '../types'

/** 获取元素的几何信息（位置 / 尺寸 / 中心点 / 旋转角） */
export function getElementGeometricInfo(element: HTMLElement): ElementGeometricInfo {
  const { offsetWidth, offsetHeight } = element
  const rotate = getElementRotate(element)
  const absoluteRotate = getAbsoluteRotate(element)

  const rect = element.getBoundingClientRect()
  const { x, y, width, height } = rect
  const cx = width / 2 + x
  const cy = height / 2 + y

  const left = cx - offsetWidth / 2
  const top = cy - offsetHeight / 2

  return {
    x,
    y,
    left,
    top,
    width,
    height,
    cx,
    cy,
    offsetWidth,
    offsetHeight,
    rotate,
    absoluteRotate,
  }
}
