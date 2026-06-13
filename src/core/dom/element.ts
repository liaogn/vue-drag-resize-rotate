import { getElementRotate, getAbsoluteRotate } from './rotate'
import type { ElementGeometricInfo } from '../types'
import type { RotatedRectInput } from '../geometry/boundary'

/** 获取元素的几何信息（位置 / 尺寸 / 中心点 / 旋转角） */
export function getElementGeometricInfo(element: HTMLElement, scale = 1): ElementGeometricInfo {
  const { offsetWidth, offsetHeight } = element
  const rotate = getElementRotate(element)
  const absoluteRotate = getAbsoluteRotate(element)

  const rect = element.getBoundingClientRect()
  // getBoundingClientRect 返回的是已被祖先 scale 缩放的屏幕像素，
  // 除以 scale 还原到未缩放坐标系，与 offsetWidth/offsetHeight 保持一致
  const s = scale > 0 ? scale : 1
  const x = rect.x / s
  const y = rect.y / s
  const width = rect.width / s
  const height = rect.height / s
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

/**
 * 从 vdr 元素的内联样式读取其在父坐标系下的矩形（left/top/width/height/rotate）。
 * 直接解析 style 而非 getBoundingClientRect，避免祖先 rotate/scale 干扰。
 */
export function getVdrRectFromElement(element: HTMLElement): RotatedRectInput | null {
  const translateMatch = element.style.transform.match(
    /translate3d\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/
  )
  if (!translateMatch) return null
  const rotateMatch = element.style.transform.match(/rotateZ\(\s*(-?[\d.]+)deg/)
  const width = parseFloat(element.style.width)
  const height = parseFloat(element.style.height)
  return {
    left: parseFloat(translateMatch[1]),
    top: parseFloat(translateMatch[2]),
    width: isNaN(width) ? element.offsetWidth : width,
    height: isNaN(height) ? element.offsetHeight : height,
    rotate: rotateMatch ? parseFloat(rotateMatch[1]) : 0,
  }
}
