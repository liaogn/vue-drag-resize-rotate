/**
 * 获取旋转指定角度后的rect
 * @param  {[type]} options rect
 * @param  {[type]} angle   旋转角度
 * @return {[type]}
 */
function transform(options, angle) {
  var x = options.x;
  var y = options.y;
  var width = options.width;
  var height = options.height;

  var r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
  var a = Math.round(Math.atan(height / width) * 180 / Math.PI);
  var tlbra = 180 - angle - a;
  var trbla = a - angle;
  var ta = 90 - angle;
  var ra = angle;

  var halfWidth = width / 2;
  var halfHeight = height / 2;

  var middleX = x + halfWidth;
  var middleY = y + halfHeight;

  var topLeft = {
    x: middleX + r * Math.cos(tlbra * Math.PI / 180),
    y: middleY - r * Math.sin(tlbra * Math.PI / 180)
  };
  var top = {
    x: middleX + halfHeight * Math.cos(ta * Math.PI / 180),
    y: middleY - halfHeight * Math.sin(ta * Math.PI / 180),
  };
  var topRight = {
    x: middleX + r * Math.cos(trbla * Math.PI / 180),
    y: middleY - r * Math.sin(trbla * Math.PI / 180)
  };
  var right = {
    x: middleX + halfWidth * Math.cos(ra * Math.PI / 180),
    y: middleY + halfWidth * Math.sin(ra * Math.PI / 180),
  };
  var bottomRight = {
    x: middleX - r * Math.cos(tlbra * Math.PI / 180),
    y: middleY + r * Math.sin(tlbra * Math.PI / 180)
  };
  var bottom = {
    x: middleX - halfHeight * Math.sin(ra * Math.PI / 180),
    y: middleY + halfHeight * Math.cos(ra * Math.PI / 180),
  }
  var bottomLeft = {
    x: middleX - r * Math.cos(trbla * Math.PI / 180),
    y: middleY + r * Math.sin(trbla * Math.PI / 180)
  };
  var left = {
    x: middleX - halfWidth * Math.cos(ra * Math.PI / 180),
    y: middleY - halfWidth * Math.sin(ra * Math.PI / 180),
  }
  var minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
  var maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
  var minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  var maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  return {
    point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY
  }
}
