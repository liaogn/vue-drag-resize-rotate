/**
 * 取得缩放指定倍数后的坐标
 * @param  {[type]} params    rect
 * @param  {[type]} baseIndex 基点索引
 */
function getScaledRect(params, baseIndex) {
  var { x, y, width, height, scale } = params;
  var offset = {
    x: 0,
    y: 0
  };
  var deltaXScale = scale.x - 1;
  var deltaYScale = scale.y - 1;
  var deltaWidth = width * deltaXScale;
  var deltaHeight = height * deltaYScale;
  var newWidth = width + deltaWidth;
  var newHeight = height + deltaHeight;
  var newX = x - deltaWidth / 2;
  var newY = y - deltaHeight / 2
  if (baseIndex) {
    var points = [{x, y}, {x: x+ width, y}, {x: x + width, y: y+ height}, {x, y: y+ height}];
    var newPoints = [{x: newX, y: newY}, {x: newX+ newWidth, y: newY}, {x: newX + newWidth, y: newY+ newHeight}, {x: newX, y: newY+ newHeight}];
    offset.x = points[baseIndex].x - newPoints[baseIndex].x;
    offset.y = points[baseIndex].y - newPoints[baseIndex].y;
  }
  return {
    x: newX + offset.x,
    y: newY + offset.y,
    width: newWidth,
    height: newHeight
  }
}
