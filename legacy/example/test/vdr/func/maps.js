// 触点映射
function contactorMaps(elementInfo, positionType) {
  const {left, top, width, height} = elementInfo
  const halfWidth = width / 2
  const halfHeight = height / 2
  const maps = {
    tl: () => [left, top],
    tm: () => [left + halfWidth, top],
    tr: () => [left + width, top],
    mr: () => [left + width, top + halfHeight],
    br: () => [left + width, top + height],
    bm: () => [left + halfWidth, top + height],
    bl: () => [left, top + height],
    ml: () => [left, top + halfHeight],
  }
  return maps[positionType] && maps[positionType]()
}
// 获取当前控点的中心对称控点
function getSymStick(stick) {
  const [s0, s1] = stick.split('')
  const reverseMap = {t: 'b', b: 't', l: 'r', r: 'l'}
  return `${reverseMap[s0] || 'm'}${reverseMap[s1] || 'm'}`
}
export {contactorMaps, getSymStick}
