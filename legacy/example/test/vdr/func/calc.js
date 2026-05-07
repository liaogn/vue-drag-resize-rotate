import {angleToRadian} from './rotate'
import {contactorMaps} from './maps'
// 计算两点间的斜率
function calcLineSlope(p1, p2) {
  const k = (p2[1] - p1[1]) / (p2[0] - p1[0])
  // 当p1与2重合时k = 0/0 即NaN 这时斜率取元素旋转角对应的斜率：k=tan(r)
  return isNaN(k) ? Math.tan(this.rad) : k
}
// 求点p0与p1、p2构成的直线的垂直交点
function calcVerticalCrossPoint(p0, p1, p2) {
  const [x0, y0] = p0
  const [x2, y2] = p2
  const k = calcLineSlope(p1, p2)
  // 当斜率为无穷时，证明鼠标y值始终与参考线相同，横坐标直接返回直线的x值(这里的x2)
  if (!isFinite(k)) return [x2, y0]
  // 求一点与一条直线（参考线）的垂直交点
  // 直线方程（参考线） y=k*x+b1,点与直线垂直相交的直线方程 y=(-1/k)*x+b2
  // 先代入参考线的两点p1,p2求出参考线的k和b1,然后可得垂直线的斜率公式k=-1/k,又代入已知点(x0,y0)，就可以求b2以及垂直线方程
  // 因为两线相交，可以定义交点为（xp,yp）,分别代入两天直线方程，yp=k*xp+b1;yp=(-1/k)*x+b2;就变成了一个求二元一次方程了
  const kk = Math.pow(k, 2)
  const xp = (kk * x2 - y2 * k + y0 * k + x0) / (kk + 1)
  const yp = (y2 - x2 * k + y0 * kk + x0 * k) / (kk + 1)
  return [Math.round(xp), Math.round(yp)]
}
// 获取中心点
function calcCenterPoint(p1, p2) {
  return [p1[0] + (p2[0] - p1[0]) / 2, p1[1] + (p2[1] - p1[1]) / 2]
}

/**
 * @description 计算某个点基于某个原点旋转后的坐标
 * @abstract 结合向量、三角函数、二角和差公式可求出其对应关系
 * @param {Object} point 输入点 {x,y}
 * @param {Object} originPoint 坐标原点 {x,y}
 * @param {Number} rotate 旋转角
 * @return {Object} 输入点旋转后的点坐标{x,y}
 */
function calcRotatedPoint(point, originPoint = [0, 0], rotate = 0) {
  if (!point) return []
  // 向量模
  const X = point[0] - originPoint[0]
  const Y = point[1] - originPoint[1]
  // 三角函数
  const {cos, sin} = window.Math
  // 角度转弧度
  const rad = angleToRadian(rotate)
  return [
    X * cos(rad) + Y * sin(rad) + originPoint[0],
    Y * cos(rad) - X * sin(rad) + originPoint[1],
  ]
}
// 计算矩形8个触点(旋转状态)
function calcRotatedContactor(geometricInfo, positionType) {
  if (!positionType) return
  const {offsetWidth: width, offsetHeight: height} = geometricInfo
  const {left, top, absoluteRotate, cy, cx} = geometricInfo
  const absoluteRectInfo = {left, top, width, height}
  const absolutePoint = contactorMaps(absoluteRectInfo, positionType)
  const point = calcRotatedPoint(absolutePoint, [cx, cy], -absoluteRotate)
  return point
}
// 获取边界直线方程
function calcBorderLineEquation(p1, p2) {
      const [x1, y1] = p1
      const [x2, y2] = p2
      const k = (y2 - y1) / (x2 - x1)
      return (targetAxis, knownValue) => {
        if (k === 0) {
          return {y: y1}[targetAxis] 
        } else if (!isFinite(k)) {
          return {x: x1}[targetAxis]
        } else {
          return {
            y: k * (knownValue - x1) + y1,
            x: (knownValue + k * x1 - y1) / k,
          }[targetAxis]
        }
      }
    }
export {
  calcLineSlope,
  calcVerticalCrossPoint,
  calcCenterPoint,
  calcRotatedPoint,
  calcRotatedContactor,
  calcBorderLineEquation,
}
