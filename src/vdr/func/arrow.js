import {getParentsRotate} from './rotate'
function createSvgIcon(cursorRotate) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" >
            <path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(${cursorRotate}deg);transform-origin: 16px 16px"></path>
          </svg>`
}
// svg转base64
function svgTobase64(svgString) {
  if (typeof svgString !== 'string' || svgString.length <= 0) return ''
  return window.btoa(unescape(encodeURIComponent(svgString)))
}
// 获取控件图标悬停角度
function getCursorIconRotate(parentsRotate = 0, stick) {
  const hoverAngle = {
    tl: parentsRotate - 45,
    tr: parentsRotate + 45,
    bl: parentsRotate - 135,
    br: parentsRotate + 135,
    tm: parentsRotate + 0,
    mr: parentsRotate + 90,
    bm: parentsRotate - 180,
    ml: parentsRotate - 90,
  }[stick]
  return hoverAngle || 0
}
// 控件鼠标进入
function stickMouseenter(ev, stick) {
  if (stick === 'angle') return
  if (this.stickDrag && this.currentStick !== stick) {
    return (ev.target.style.cursor = 'default')
  }
  const parentsRotate = getParentsRotate(ev)
  const cursorRotate = getCursorIconRotate(parentsRotate, stick)
  const iconUrl = `data:image/svg+xml;base64,${svgTobase64(
    createSvgIcon(cursorRotate,)
  )}`
  const cursor = this.resizeable ? `url(${iconUrl}) 16 16,auto`:'no-drop'
  ev.target.style.cursor = cursor
}
function stickMouseout(ev,stick){
  if(stick==='angle') return
  if(this.stickDrag) return
  ev.target.style.cursor = ""
}

export {stickMouseenter, stickMouseout}
