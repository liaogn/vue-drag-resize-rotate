import {calcRotatedContactor, calcBorderLineEquation} from './calc'
// 编辑直线的两点，数组第一项为非翻转180deg的边界点，第二项为需翻转180deg的边界点
const breakStickMaps = {
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

class RectFliper {
  constructor(elementInfo, stick) {
    this.elementInfo = elementInfo
    this.stick = stick

    this.rotate = elementInfo.rotate
    this.flipRecting = false
    this.breakStickMaps = breakStickMaps
    this.absoluteContactor = calcRotatedContactor(elementInfo, stick)

    // 记录边界点直线方程
    this.borderLineEquations = this.getBorderLineEquation(elementInfo,stick)
    // 记录边界符号
    this.borderSigns = this.getFlipBorderSigns(this.borderLineEquations,this.absoluteContactor)
  }
  // 获取翻转的边界符号
  getFlipBorderSigns(borderLineEquations, point) {
    return borderLineEquations.map((lineEquation) => {
      if (!lineEquation) return []
      return this.getCurSign(lineEquation, point)
    })
  }
  // 获取直线方程
  getBorderLineEquation(elementInfo,stick) {
    // 记录边界点(用于处理缩放时的边界翻转或限制)
    const borderPoints = this.getBreakPoints(elementInfo,stick)
    // 记录边界点直线方程
    return borderPoints.map((points) => {
      return points && calcBorderLineEquation(points[0], points[1])
    })
  }
  // 获取边界点集合
  getBreakPoints(elementInfo,stick) {
    const breakSticks = breakStickMaps[stick]
    if (!breakSticks) return []
    const points = breakSticks.map((stickArray) => {
      if (!stickArray) return
      return stickArray.map((stick) => {
        return calcRotatedContactor(elementInfo, stick)
      })
    })
    return points
  }
  // 获取当前边界符号
  getCurSign(lineEquation,point){
    // 计算鼠标点与边界直线的x轴差值、并标记差值符合，根据符号变化判断到达边界
    let diffX = lineEquation('x', point[1]) - point[0]
    const diffX_sign = diffX >= 0 ? `+` : `-`

    // 计算鼠标点与边界直线的y轴差值、并标记差值符合，根据符号变化判断到达边界
    let diffY = lineEquation('y', point[0]) - point[1]
    const diffY_sign = diffY >= 0 ? `+` : `-`

    return [diffX_sign, diffY_sign]
  }
  // 获取翻转后的当前触点
  getFlipStick(stick) {
    const [s0, s1] = stick.split('')
    if(stick.match('m')){
      return {tm: 'tm', bm: 'bm', ml: 'mr', mr: 'ml'}[stick]
    }else{
      const reverseMap = {t: 'b', b: 't', l: 'r', r: 'l'}
      return `${s0}${reverseMap[s1]}`
    }

  }
  // 更新边界符号（符号发生改变则翻转）
  borderSignsWatcher(mousePoint,callback){
       //  遍历边界直线，判断鼠标点是否超出边界直线
       this.borderLineEquations.forEach((lineEquation, index) => {
        if(this.flipRecting || !lineEquation) return

        const curSigns = this.getCurSign(lineEquation, mousePoint)

        // 存在符号与前值状态不一致，证明发生了越界
        const breakingSign = this.borderSigns[index].find((sign,index)=>sign!==curSigns[index])
        if(breakingSign){
          // isDegFlip:像对边翻转，需要180度翻转
           console.log(breakingSign,'突破边界')
           const isDegFlip = index===1
           this.flipRecting = true
           callback(isDegFlip, breakingSign)
           this.flipRecting = false
        }
        // 缓存当前边界符号
        this.borderSigns[index] = curSigns
      })
  }
}
export default RectFliper
