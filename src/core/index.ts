export * from './types'

export { contactorMaps, getSymStick } from './geometry/maps'
export {
  calcLineSlope,
  calcVerticalCrossPoint,
  calcCenterPoint,
  calcRotatedPoint,
  calcRotatedContactor,
  calcBorderLineEquation,
  type LineEquation,
} from './geometry/calc'
export {
  clampSize,
  normalizeSizeLimits,
  hasMinSizeLimit,
  getValidWhRatio,
  getLimitedSize,
  type GetLimitedSizeInput,
} from './geometry/size'
export {
  hasBoundary,
  getRotatedRectAABB,
  getBoundaryShift,
  isRectInsideLimits,
  clampPositionWithinLimits,
  fitResizeWithinLimits,
  type LimitRange,
  type AABB,
} from './geometry/boundary'

export {
  angleToRadian,
  getElementRotate,
  getParentsRotate,
  getAbsoluteRotate,
} from './dom/rotate'
export { getElementGeometricInfo } from './dom/element'

export { default as RectDrager } from './controllers/RectDrager'
export { default as RectRotator } from './controllers/RectRotator'
export { default as RectFliper } from './controllers/RectFliper'

export {
  calcRectResetRotated,
  getStickPoint,
  getResizeWidth,
  getResizeHeight,
  renderLimitedRect,
  computeResize,
  type ComputeResizeInput,
} from './resize/computeResize'

export {
  defaultCursorIconRender,
  svgTobase64,
  getCursorIconRotate,
  buildStickCursor,
  shouldResetStickCursor,
  type BuildStickCursorOptions,
} from './cursor/stickCursor'
