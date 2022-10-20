(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueDragResizeRotate"] = factory();
	else
		root["VueDragResizeRotate"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "112a");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0353":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("6bf8");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "0451":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
var isArray = __webpack_require__("d1cb");
var SPECIES = __webpack_require__("839a")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "05fd":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("baa7")('native-function-to-string', Function.toString);


/***/ }),

/***/ "065d":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("bb8b");
var createDesc = __webpack_require__("5edc");
module.exports = __webpack_require__("26df") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "065e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "085b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("e99b");
var $indexOf = __webpack_require__("52a4")(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__("95b6")($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),

/***/ "0926":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "0b34":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "112a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (false) {}

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("a450");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.index-of.js
var es6_array_index_of = __webpack_require__("085b");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"b97606b2-vue-loader-template"}!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.5@babel-loader/lib!./node_modules/_vue-loader@15.10.0@vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.10.0@vue-loader/lib??vue-loader-options!./src/vdr/index.vue?vue&type=template&id=66a1b13f&

var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    ref: "vdr",
    staticClass: "vdr",
    class: _vm._class,
    style: _vm._style,
    on: {
      "click": function click($event) {
        $event.stopPropagation();
      },
      "mousedown": function mousedown($event) {
        $event.stopPropagation();
        return _vm.bodyDown($event);
      }
    }
  }, [_vm.active && _vm.activeable ? [_vm._l(_vm.resizeSticks, function (stick, stickIndex) {
    return _c('span', {
      key: stickIndex,
      ref: "stick_".concat(stick),
      refInFor: true,
      staticClass: "vdr-stick",
      class: "vdr-stick-".concat(stick),
      style: {
        zIndex: _vm.activeStickIndex == stickIndex ? 10 : 9
      },
      on: {
        "mousedown": function mousedown($event) {
          $event.stopPropagation();
          $event.preventDefault();
          return _vm.stickDown($event, stick, stickIndex);
        },
        "mouseenter": function mouseenter($event) {
          return _vm.stickMouseenter($event, stick, {
            hoverRender: _vm.hoverRender
          });
        },
        "mouseout": function mouseout($event) {
          return _vm.stickMouseout($event, stick);
        }
      }
    });
  }), _vm._sticks.indexOf('angle') > -1 ? [_c('span', {
    staticClass: "vdr-stick-rotate-line"
  }), _c('span', {
    ref: "stick_angle",
    staticClass: "vdr-stick vdr-angle",
    style: {
      cursor: !this.rotateable ? 'no-drop' : ''
    },
    on: {
      "mousedown": function mousedown($event) {
        $event.stopPropagation();
        $event.preventDefault();
        return _vm.rotateDown($event);
      }
    }
  })] : _vm._e()] : _vm._e(), _vm._childWrapAttr ? _c('div', _vm._b({
    staticClass: "childWrap"
  }, 'div', _vm._childWrapAttr, false), [_vm.childrens ? _vm._l(_vm.childrens, function (child) {
    return _c('vdr', _vm._g(_vm._b({
      key: child.key || child.id
    }, 'vdr', child, false), _vm.$listeners));
  }) : _vm._e(), _vm._t("default")], 2) : [_vm.childrens ? _vm._l(_vm.childrens, function (child) {
    return _c('vdr', _vm._g(_vm._b({
      key: child.key || child.id
    }, 'vdr', child, false), _vm.$listeners));
  }) : _vm._e(), _vm._t("default")]], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./src/vdr/index.vue?vue&type=template&id=66a1b13f&

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.regexp.match.js
var es6_regexp_match = __webpack_require__("d0f2");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.filter.js
var es6_array_filter = __webpack_require__("4890");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("e680");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("fc02");

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
// CONCATENATED MODULE: ./src/vdr/func/maps.js


// 触点映射
function contactorMaps(elementInfo, positionType) {
  var left = elementInfo.left,
    top = elementInfo.top,
    width = elementInfo.width,
    height = elementInfo.height;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var maps = {
    tl: function tl() {
      return [left, top];
    },
    tm: function tm() {
      return [left + halfWidth, top];
    },
    tr: function tr() {
      return [left + width, top];
    },
    mr: function mr() {
      return [left + width, top + halfHeight];
    },
    br: function br() {
      return [left + width, top + height];
    },
    bm: function bm() {
      return [left + halfWidth, top + height];
    },
    bl: function bl() {
      return [left, top + height];
    },
    ml: function ml() {
      return [left, top + halfHeight];
    }
  };
  return maps[positionType] && maps[positionType]();
}
// 获取当前控点的中心对称控点
function getSymStick(stick) {
  var _stick$split = stick.split(''),
    _stick$split2 = _slicedToArray(_stick$split, 2),
    s0 = _stick$split2[0],
    s1 = _stick$split2[1];
  var reverseMap = {
    t: 'b',
    b: 't',
    l: 'r',
    r: 'l'
  };
  return "".concat(reverseMap[s0] || 'm').concat(reverseMap[s1] || 'm');
}

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.19.4@@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("8dee");

// CONCATENATED MODULE: ./src/vdr/func/rotate.js







// 角度转弧度
function angleToRadian(rotate) {
  return rotate * Math.PI / 180;
}
// 获取元素旋转角度(矩阵转换)
function getElementRotate(element) {
  if (element == null) return 0;
  var parentStyle = window.getComputedStyle(element, null);
  var matrixInfo = parentStyle['-webkit-transform'] || parentStyle['-moz-transform'] || parentStyle['-ms-transform'] || parentStyle['-o-transform'] || parentStyle['transform'];
  if (matrixInfo.match('matrix') == null) return 0;
  var matrix = matrixInfo.replace(/matrix\(|\)|\s/gi, '');
  var matrixArray = matrix.split(',') || [];
  var a = Number(matrixArray[0]);
  var b = Number(matrixArray[1]);
  var angle = Math.atan2(b, a) * (180 / Math.PI);
  return angle || 0;
}

// 获取所有父旋转角的叠加状态角#待解决：插槽元素存在旋转角，会出现角度技术偏差。
function getParentsRotate(ev, isStick) {
  var rotate = 0;
  var path = ev.path || ev.composedPath && ev.composedPath() || [];
  path = isStick ? path.slice(1) : path;
  path = path.filter(function (element) {
    return element.className && element.className.match('childWrap') == null;
  });
  var len = path.length || 0;
  if (len < 1) return 0;
  //自身index为0， >0 过滤掉自身
  for (var i = len - 1; i > 0; i--) {
    var element = path[i];
    // 过滤掉window和document
    if (element === window || element === document) continue;
    rotate += getElementRotate(element);
  }
  return rotate;
}

// 获取元素绝对角度（相对窗口视角）
function getAbsoluteRotate(element) {
  if (!element) return 0;
  var rotate = getElementRotate(element);
  var forEachParentRotate = function forEachParentRotate(parent) {
    if (parent && parent.nodeType === 1) {
      rotate += getElementRotate(parent);
      forEachParentRotate(parent.parentNode);
    }
  };
  forEachParentRotate(element.parentNode);
  return rotate;
}
var rotate_RectRotator = /*#__PURE__*/function () {
  function RectRotator() {
    _classCallCheck(this, RectRotator);
    // 标记是否在进行旋转
    this.isDrag = false;
    this.rotate = 0;
    // 旋转坐标点初始化
    this.pointA = {};
    this.pointB = {};
    this.pointC = {};
  }
  _createClass(RectRotator, [{
    key: "downHandle",
    value: function downHandle(ev, target, rotate) {
      // 获取当前元素位置大小信息，用于计算旋转元素的中心点
      if (!ev || !target) return;
      var rect = target.getBoundingClientRect();
      var left = rect.left,
        top = rect.top,
        width = rect.width,
        height = rect.height;
      // 旋转选中中
      this.isDrag = true;
      // 同步旋转前的旋转角度
      this.rotate = rotate;
      // 开始点
      this.pointB = {
        X: ev.clientX,
        Y: ev.clientY
      };
      // 中点
      this.pointA = {
        X: left + width / 2,
        Y: top + height / 2
      };
    }
  }, {
    key: "moveHandle",
    value: function moveHandle(ev) {
      // 记录结束点
      this.pointC = {
        X: ev.clientX,
        Y: ev.clientY
      };
      // AB、AC向量
      var AB = {
        X: this.pointB.X - this.pointA.X,
        Y: this.pointB.Y - this.pointA.Y
      };
      var AC = {
        X: this.pointC.X - this.pointA.X,
        Y: this.pointC.Y - this.pointA.Y
      };

      // AB与AC叉乘，根据右手定则：direct小于零逆时针旋转，大于零顺时针旋转
      var direct = AB.X * AC.Y - AB.Y * AC.X;

      // AB、AC向量的模
      var AB_dx = this.pointA.X - this.pointB.X;
      var AC_dx = this.pointA.X - this.pointC.X;
      var AB_dy = this.pointA.Y - this.pointB.Y;
      var AC_dy = this.pointA.Y - this.pointC.Y;
      var lengthAB = Math.sqrt(AB_dx * AB_dx + AB_dy * AB_dy);
      var lengthAC = Math.sqrt(AC_dx * AC_dx + AC_dy * AC_dy);

      // 向量点乘，公式： A*B = x1*x2 + y1*y2
      var product = AB.X * AC.X + AB.Y * AC.Y;

      // 两个向量之间的夹角的计算公式 ：a * b = |a| * |b| * cosθ
      // 公式转换 θ = Math.acos(a * b /( |a| * |b| )); （θ为弧度）
      // Math.acos的参数范围[-1, 1] ,返回值[-PI, PI],其余值返回 NAN
      var rad = Math.acos(product / (lengthAB * lengthAC));
      var angle = rad / Math.PI * 180 || 0;

      // 根据旋转方向加减角度
      this.rotate = direct < 0 ? this.rotate - angle : this.rotate + angle;

      // // 更新起点
      this.pointB = {
        X: ev.clientX,
        Y: ev.clientY
      };
      return this.rotate;
    }
  }, {
    key: "upHandle",
    value: function upHandle() {
      this.isDrag = false;
    }
  }]);
  return RectRotator;
}();

// CONCATENATED MODULE: ./src/vdr/func/drag.js



var drag_RectDrager = /*#__PURE__*/function () {
  function RectDrager() {
    _classCallCheck(this, RectDrager);
    this.isDrag = false;
    this.startPos = {
      mx: 0,
      my: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      parentsRotate: 0
    };
  }
  _createClass(RectDrager, [{
    key: "downHandle",
    value: function downHandle(ev, curPosition) {
      this.isDrag = true;
      // 记录开始鼠标位置
      this.startPos.mx = ev.clientX;
      this.startPos.my = ev.clientY;
      // 记录开始元素位置
      this.startPos.left = curPosition[0];
      this.startPos.top = curPosition[1];
      // 获取父元素的旋转角
      this.startPos.parentsRotate = getParentsRotate(ev);
    }
  }, {
    key: "moveHandle",
    value: function moveHandle(ev) {
      // 起始位置信息
      var _this$startPos = this.startPos,
        mx = _this$startPos.mx,
        my = _this$startPos.my,
        left = _this$startPos.left,
        top = _this$startPos.top,
        parentsRotate = _this$startPos.parentsRotate;

      // 位移向量
      var vector = {
        x: ev.clientX - mx,
        y: ev.clientY - my
      };

      // 父元素旋转后的坐标系转换，获取新的坐标点公式如下：
      // x'=x·cos(θ)+y·sin(θ)
      // y'=y·cos(θ)-x·sin(θ)
      var rad = angleToRadian(parentsRotate);
      var x = vector.x * Math.cos(rad) + vector.y * Math.sin(rad);
      var y = vector.y * Math.cos(rad) - vector.x * Math.sin(rad);
      return [left + x, top + y];
    }
  }, {
    key: "upHandle",
    value: function upHandle() {
      this.isDrag = false;
    }
  }]);
  return RectDrager;
}();

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("e5b4");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("1bc7");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.for-each.js
var es6_array_for_each = __webpack_require__("246f");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.12@core-js/modules/es6.array.map.js
var es6_array_map = __webpack_require__("566e");

// CONCATENATED MODULE: ./src/vdr/func/calc.js



// 计算两点间的斜率
function calcLineSlope(p1, p2) {
  var k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  // 当p1与2重合时k = 0/0 即NaN 这时斜率取元素旋转角对应的斜率：k=tan(r)
  return isNaN(k) ? Math.tan(this.rad) : k;
}
// 求点p0与p1、p2构成的直线的垂直交点
function calcVerticalCrossPoint(p0, p1, p2) {
  var _p = _slicedToArray(p0, 2),
    x0 = _p[0],
    y0 = _p[1];
  var _p2 = _slicedToArray(p2, 2),
    x2 = _p2[0],
    y2 = _p2[1];
  var k = calcLineSlope(p1, p2);
  // 当斜率为无穷时，证明鼠标y值始终与参考线相同，横坐标直接返回直线的x值(这里的x2)
  if (!isFinite(k)) return [x2, y0];
  // 求一点与一条直线（参考线）的垂直交点
  // 直线方程（参考线） y=k*x+b1,点与直线垂直相交的直线方程 y=(-1/k)*x+b2
  // 先代入参考线的两点p1,p2求出参考线的k和b1,然后可得垂直线的斜率公式k=-1/k,又代入已知点(x0,y0)，就可以求b2以及垂直线方程
  // 因为两线相交，可以定义交点为（xp,yp）,分别代入两天直线方程，yp=k*xp+b1;yp=(-1/k)*x+b2;就变成了一个求二元一次方程了
  var kk = Math.pow(k, 2);
  var xp = (kk * x2 - y2 * k + y0 * k + x0) / (kk + 1);
  var yp = (y2 - x2 * k + y0 * kk + x0 * k) / (kk + 1);
  return [Math.round(xp), Math.round(yp)];
}
// 获取中心点
function calcCenterPoint(p1, p2) {
  return [p1[0] + (p2[0] - p1[0]) / 2, p1[1] + (p2[1] - p1[1]) / 2];
}

/**
 * @description 计算某个点基于某个原点旋转后的坐标
 * @abstract 结合向量、三角函数、二角和差公式可求出其对应关系
 * @param {Object} point 输入点 {x,y}
 * @param {Object} originPoint 坐标原点 {x,y}
 * @param {Number} rotate 旋转角
 * @return {Object} 输入点旋转后的点坐标{x,y}
 */
function calcRotatedPoint(point) {
  var originPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var rotate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!point) return [];
  // 向量模
  var X = point[0] - originPoint[0];
  var Y = point[1] - originPoint[1];
  // 三角函数
  var _window$Math = window.Math,
    cos = _window$Math.cos,
    sin = _window$Math.sin;
  // 角度转弧度
  var rad = angleToRadian(rotate);
  return [X * cos(rad) + Y * sin(rad) + originPoint[0], Y * cos(rad) - X * sin(rad) + originPoint[1]];
}
// 计算矩形8个触点(旋转状态)
function calcRotatedContactor(geometricInfo, positionType) {
  if (!positionType) return;
  var width = geometricInfo.offsetWidth,
    height = geometricInfo.offsetHeight;
  var left = geometricInfo.left,
    top = geometricInfo.top,
    absoluteRotate = geometricInfo.absoluteRotate,
    cy = geometricInfo.cy,
    cx = geometricInfo.cx;
  var absoluteRectInfo = {
    left: left,
    top: top,
    width: width,
    height: height
  };
  var absolutePoint = contactorMaps(absoluteRectInfo, positionType);
  var point = calcRotatedPoint(absolutePoint, [cx, cy], -absoluteRotate);
  return point;
}
// 获取边界直线方程
function calcBorderLineEquation(p1, p2) {
  var _p3 = _slicedToArray(p1, 2),
    x1 = _p3[0],
    y1 = _p3[1];
  var _p4 = _slicedToArray(p2, 2),
    x2 = _p4[0],
    y2 = _p4[1];
  var k = (y2 - y1) / (x2 - x1);
  return function (targetAxis, knownValue) {
    if (k === 0) {
      return {
        y: y1
      }[targetAxis];
    } else if (!isFinite(k)) {
      return {
        x: x1
      }[targetAxis];
    } else {
      return {
        y: k * (knownValue - x1) + y1,
        x: (knownValue + k * x1 - y1) / k
      }[targetAxis];
    }
  };
}

// CONCATENATED MODULE: ./src/vdr/func/flip.js










// 编辑直线的两点，数组第一项为非翻转180deg的边界点，第二项为需翻转180deg的边界点
var breakStickMaps = {
  tl: [['tr', 'br'], ['bl', 'br']],
  tr: [['tl', 'bl'], ['br', 'bl']],
  bl: [['br', 'tr'], ['tl', 'tr']],
  br: [['bl', 'tl'], ['tr', 'tl']],
  tm: [null, ['bl', 'br']],
  mr: [['tl', 'bl'], null],
  bm: [null, ['tr', 'tl']],
  ml: [['tr', 'br'], null]
};
var flip_RectFliper = /*#__PURE__*/function () {
  function RectFliper(elementInfo, stick) {
    _classCallCheck(this, RectFliper);
    this.elementInfo = elementInfo;
    this.stick = stick;
    this.rotate = elementInfo.rotate;
    this.flipRecting = false;
    this.breakStickMaps = breakStickMaps;
    this.absoluteContactor = calcRotatedContactor(elementInfo, stick);

    // 记录边界点直线方程
    this.borderLineEquations = this.getBorderLineEquation(elementInfo, stick);
    // 记录边界符号
    this.borderSigns = this.getFlipBorderSigns(this.borderLineEquations, this.absoluteContactor);
  }
  // 获取翻转的边界符号
  _createClass(RectFliper, [{
    key: "getFlipBorderSigns",
    value: function getFlipBorderSigns(borderLineEquations, point) {
      var _this = this;
      return borderLineEquations.map(function (lineEquation) {
        if (!lineEquation) return [];
        return _this.getCurSign(lineEquation, point);
      });
    }
    // 获取直线方程
  }, {
    key: "getBorderLineEquation",
    value: function getBorderLineEquation(elementInfo, stick) {
      // 记录边界点(用于处理缩放时的边界翻转或限制)
      var borderPoints = this.getBreakPoints(elementInfo, stick);
      // 记录边界点直线方程
      return borderPoints.map(function (points) {
        return points && calcBorderLineEquation(points[0], points[1]);
      });
    }
    // 获取边界点集合
  }, {
    key: "getBreakPoints",
    value: function getBreakPoints(elementInfo, stick) {
      var breakSticks = breakStickMaps[stick];
      if (!breakSticks) return [];
      var points = breakSticks.map(function (stickArray) {
        if (!stickArray) return;
        return stickArray.map(function (stick) {
          return calcRotatedContactor(elementInfo, stick);
        });
      });
      return points;
    }
    // 获取当前边界符号
  }, {
    key: "getCurSign",
    value: function getCurSign(lineEquation, point) {
      // 计算鼠标点与边界直线的x轴差值、并标记差值符合，根据符号变化判断到达边界
      var diffX = lineEquation('x', point[1]) - point[0];
      var diffX_sign = diffX >= 0 ? "+" : "-";

      // 计算鼠标点与边界直线的y轴差值、并标记差值符合，根据符号变化判断到达边界
      var diffY = lineEquation('y', point[0]) - point[1];
      var diffY_sign = diffY >= 0 ? "+" : "-";
      return [diffX_sign, diffY_sign];
    }
    // 获取翻转后的当前触点
  }, {
    key: "getFlipStick",
    value: function getFlipStick(stick) {
      var _stick$split = stick.split(''),
        _stick$split2 = _slicedToArray(_stick$split, 2),
        s0 = _stick$split2[0],
        s1 = _stick$split2[1];
      if (stick.match('m')) {
        return {
          tm: 'tm',
          bm: 'bm',
          ml: 'mr',
          mr: 'ml'
        }[stick];
      } else {
        var reverseMap = {
          t: 'b',
          b: 't',
          l: 'r',
          r: 'l'
        };
        return "".concat(s0).concat(reverseMap[s1]);
      }
    }
    // 更新边界符号（符号发生改变则翻转）
  }, {
    key: "borderSignsWatcher",
    value: function borderSignsWatcher(mousePoint, callback) {
      var _this2 = this;
      //  遍历边界直线，判断鼠标点是否超出边界直线
      this.borderLineEquations.forEach(function (lineEquation, index) {
        if (_this2.flipRecting || !lineEquation) return;
        var curSigns = _this2.getCurSign(lineEquation, mousePoint);

        // 存在符号与前值状态不一致，证明发生了越界
        var breakingSign = _this2.borderSigns[index].find(function (sign, index) {
          return sign !== curSigns[index];
        });
        if (breakingSign) {
          // isDegFlip:像对边翻转，需要180度翻转
          var isDegFlip = index === 1;
          _this2.flipRecting = true;
          callback(isDegFlip, breakingSign);
          _this2.flipRecting = false;
        }
        // 缓存当前边界符号
        _this2.borderSigns[index] = curSigns;
      });
    }
  }]);
  return RectFliper;
}();
/* harmony default export */ var flip = (flip_RectFliper);
// CONCATENATED MODULE: ./src/vdr/func/dom.js

// 获取元素的几何信息
function getElementGeometricInfo(element) {
  // const contactor={}
  var offsetWidth = element.offsetWidth,
    offsetHeight = element.offsetHeight;
  var rotate = getElementRotate(element);
  var absoluteRotate = getAbsoluteRotate(element);
  var rect = element.getBoundingClientRect();
  var x = rect.x,
    y = rect.y,
    width = rect.width,
    height = rect.height;
  var cx = width / 2 + x;
  var cy = height / 2 + y;
  var left = cx - offsetWidth / 2;
  var top = cy - offsetHeight / 2;
  return Object.assign({
    x: x,
    y: y,
    left: left,
    top: top,
    width: width,
    height: height,
    cx: cx,
    cy: cy
  }, {
    offsetWidth: offsetWidth,
    offsetHeight: offsetHeight,
    rotate: rotate,
    absoluteRotate: absoluteRotate
  });
}

// CONCATENATED MODULE: ./src/vdr/func/arrow.js

function createSvgIcon(cursorRotate) {
  return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32px\" height=\"32px\" viewBox=\"0 0 32 32\" >\n            <path d=\"M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z\" stroke-linejoin=\"round\" stroke-width=\"1.2\" fill=\"black\" stroke=\"white\" style=\"transform:rotate(".concat(cursorRotate, "deg);transform-origin: 16px 16px\"></path>\n          </svg>");
}
// svg转base64
function svgTobase64(svgString) {
  if (typeof svgString !== 'string' || svgString.length <= 0) return '';
  return window.btoa(unescape(encodeURIComponent(svgString)));
}
// 获取控件图标悬停角度
function getCursorIconRotate() {
  var parentsRotate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var stick = arguments.length > 1 ? arguments[1] : undefined;
  var hoverAngle = {
    tl: parentsRotate - 45,
    tr: parentsRotate + 45,
    bl: parentsRotate - 135,
    br: parentsRotate + 135,
    tm: parentsRotate + 0,
    mr: parentsRotate + 90,
    bm: parentsRotate - 180,
    ml: parentsRotate - 90
  }[stick];
  return hoverAngle || 0;
}
// 控件鼠标进入
function stickMouseenter(ev, stick) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (stick === 'angle') return;
  if (this.stickDrag && this.currentStick !== stick) {
    return ev.target.style.cursor = 'default';
  }
  var parentsRotate = getParentsRotate(ev);
  var cursorRotate = getCursorIconRotate(parentsRotate, stick);
  var createSvgIconFunc = options.hoverRender || createSvgIcon;
  var iconBase64 = svgTobase64(createSvgIconFunc(cursorRotate));
  var iconUrl = "data:image/svg+xml;base64,".concat(iconBase64);
  var cursor = this.resizeable ? "url(".concat(iconUrl, ") 16 16,auto") : 'no-drop';
  ev.target.style.cursor = cursor;
}
function stickMouseout(ev, stick) {
  if (stick === 'angle') return;
  if (this.stickDrag) return;
  ev.target.style.cursor = "";
}

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.5@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.10.0@vue-loader/lib??vue-loader-options!./src/vdr/index.vue?vue&type=script&lang=js&










/* harmony default export */ var vdrvue_type_script_lang_js_ = ({
  name: 'vdr',
  props: {
    overflow: {
      type: String,
      default: ''
    },
    uuid: {
      type: [String, Number],
      default: ''
    },
    bg: {
      type: String,
      default: ''
    },
    lock: {
      type: Boolean,
      default: false
    },
    w: {
      type: Number,
      default: 100,
      validator: function validator(val) {
        return val >= 0;
      }
    },
    h: {
      type: Number,
      default: 100,
      validator: function validator(val) {
        return val >= 0;
      }
    },
    x: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return typeof val === 'number';
      }
    },
    y: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return typeof val === 'number';
      }
    },
    z: {
      type: [String, Number],
      default: ''
    },
    r: {
      type: Number,
      default: 0
    },
    sticks: {
      type: Array
    },
    myStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    myClass: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    active: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizeable: {
      type: Boolean,
      default: true
    },
    rotateable: {
      type: Boolean,
      default: true
    },
    activeable: {
      type: Boolean,
      default: true
    },
    childrens: {
      type: Array,
      default: undefined
    },
    childWrapAttr: {
      type: Object,
      default: undefined
    }
  },
  data: function data() {
    return {
      width: this.w,
      height: this.h,
      left: this.x,
      top: this.y,
      zIndex: this.z,
      rotate: this.r,
      whRatio: this.w / this.h,
      currentStick: '',
      activeStickIndex: -1,
      hoverRender: undefined
    };
  },
  computed: {
    _sticks: function _sticks() {
      if (!this.sticks) {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml', 'angle'];
      }
      return this.sticks;
    },
    _class: function _class() {
      var outClass = this.myClass;
      var inClass = {
        'vdr-active': this.active && this.activeable,
        'vdr-not-active': !this.activeable
      };
      return [outClass, inClass];
    },
    _style: function _style() {
      var rotate = "rotateZ(".concat(this.rotate, "deg)");
      var translate = "translate3d(".concat(this.left, "px,").concat(this.top, "px,0)");
      var cursor = 'pointer';
      if (this.active) {
        cursor = this.draggable ? 'move' : 'no-drop';
      }
      if (!this.activeable) cursor = 'no-drop';
      var rectStyle = {
        zIndex: this.zIndex,
        width: "".concat(this.width, "px"),
        height: "".concat(this.height, "px"),
        backgroundImage: "url(".concat(this.bg, ")"),
        transform: "".concat(translate, " ").concat(rotate),
        cursor: cursor
      };
      return Object.assign({}, this.myStyle, rectStyle);
    },
    _childWrapAttr: function _childWrapAttr() {
      if (this.overflow) {
        var childWrapAttr = this.childWrapAttr || {};
        var style = Object.assign(childWrapAttr.style || {}, {
          overflow: this.overflow
        });
        return Object.assign(childWrapAttr, {
          style: style
        });
      } else {
        return this.childWrapAttr;
      }
    },
    resizeSticks: function resizeSticks() {
      return this._sticks.filter(function (itme) {
        return itme !== 'angle';
      });
    },
    posData: function posData() {
      return {
        x: this.left,
        y: this.top,
        w: this.width,
        h: this.height,
        r: this.rotate,
        z: this.zIndex,
        stick: this.currentStick,
        lock: this.lock,
        active: this.active,
        uuid: this.uuid
      };
    }
  },
  created: function created() {
    // 自定义触点hover样式函数，可由组件安装前时通过mixins或extends导入
    this.hoverRender = this.stickHoverRender || this.$stickHoverRender;
  },
  mounted: function mounted() {
    this.init();
  },
  beforeDestroy: function beforeDestroy() {
    // 销毁前移除事件
    document.documentElement.removeEventListener('mousemove', this.move);
    document.documentElement.removeEventListener('mouseup', this.up);
  },
  methods: {
    stickMouseout: stickMouseout,
    stickMouseenter: stickMouseenter,
    // 初始化
    init: function init() {
      this.cacheRectDomInfo(this.$el);
      this.RectDrager = new drag_RectDrager();
      this.RectRotator = new rotate_RectRotator();

      // 将元素的mousemove、mouseup事件委托到document.documentElement
      document.documentElement.addEventListener('mousemove', this.move);
      document.documentElement.addEventListener('mouseup', this.up);
    },
    // mousemove事件回调函数
    move: function move(ev) {
      if (this.draggable && this.RectDrager.isDrag && !this.stickDrag) {
        this.bodyMove(ev);
      }
      if (this.resizeable && this.stickDrag) {
        this.stickMove(ev);
      }
      if (this.rotateable && this.RectRotator.isDrag) {
        this.rotateMove(ev);
      }
    },
    // mousemup事件回调函数
    up: function up(ev) {
      // 拖拽停止
      if (this.draggable && this.RectDrager.isDrag) {
        this.RectDrager.upHandle();
        this.$emit('dragStop', this.posData, ev);
      }
      // 缩放停止
      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false;
        this.$emit('resizeStop', this.posData, ev);
      }
      // 旋转停止
      if (this.rotateable && this.RectRotator.isDrag) {
        this.RectRotator.upHandle();
        this.$emit('rotateStop', this.posData, ev);
      }
      // 更新宽高比例，当宽高其中一个为0时，不更新比例
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height;
      }
    },
    //元素（拖动）mousedown 事件回调函数
    bodyDown: function bodyDown(ev) {
      if (!this.activeable) return;
      this.currentStick = '';
      this.RectDrager.downHandle(ev, [this.left, this.top]);
      // 触发事件
      if (this.activeable) {
        this.$emit('activated', this.posData, ev);
        this.$emit('dragStart', this.posData, ev);
      }
    },
    //元素（拖动）mousemove 事件回调函数
    bodyMove: function bodyMove(ev) {
      // 起始位置信息
      var moveInfo = this.RectDrager.moveHandle(ev);

      // 更新位置信息
      this.left = moveInfo[0];
      this.top = moveInfo[1];
      // 触发拖拽事件
      this.$emit('dragging', this.posData, ev);
    },
    // 元素（旋转）mousedown 事件回调函数
    rotateDown: function rotateDown(ev) {
      if (!this.activeable) return;
      this.currentStick = 'angle';
      this.RectRotator.downHandle(ev, this.$el, this.rotate);
      this.$emit('rotateStart', this.posData, ev);
    },
    // 元素（旋转）mousemove 事件回调函数
    rotateMove: function rotateMove(ev) {
      this.rotate = this.RectRotator.moveHandle(ev);
      this.$emit('rotating', this.posData, ev);
    },
    // 缓存矩形dom相关信息
    cacheRectDomInfo: function cacheRectDomInfo(element) {
      // 获取当前元素几何信息
      this.elementInfo = getElementGeometricInfo(element);
      // 获取父元素
      this.parentElement = element.parentNode;
      // 获取父元素信息
      this.parentInfo = getElementGeometricInfo(this.parentElement);
    },
    //缩放控件的mousedown事件回调函数
    stickDown: function stickDown(ev, stick, index) {
      if (!this.activeable || !this.resizeable) return;
      // 记录当前活跃控件
      this.activeStickIndex = index;
      // 记录宽高比
      this.whRatio = this.width / this.height;
      // 缩放前数据初始化
      this.stickDownHandle(stick);
      this.stickDrag = true;
      this.$emit('resizeStart', this.posData, ev);
    },
    // 点击初始化
    stickDownHandle: function stickDownHandle(stick) {
      // 记录当前拖拽的stick
      this.currentStick = stick;
      this.cacheRectDomInfo(this.$el);

      // 记录当前点是否为中点
      this.isMiddlePoint = this.currentStick.match('m');

      // 鼠标点击后固定对称点、边界，直至下一次拖拽再更新
      if (this.stickDrag) return;

      // 计算当前拖拽点的坐标（相对文档左上角,已旋转时的实际坐标）
      this.absoluteContactor = calcRotatedContactor(this.elementInfo, this.currentStick);

      // 计算当前拖拽点的对称点坐标（相对文档左上角,已旋转时的实际坐标）
      this.symAbsoluteContactor = calcRotatedContactor(this.elementInfo, getSymStick(stick));

      // 计算对称点基于父元素中点旋转复位（jis,相对文档左上角）
      var symRotatedContactor = calcRotatedPoint(this.symAbsoluteContactor, [this.parentInfo.cx, this.parentInfo.cy], this.parentInfo.absoluteRotate);

      // 计算对称点相对父元素的点坐标（相对父元素）
      this.symRelativeContactor = [symRotatedContactor[0] - this.parentInfo.left, symRotatedContactor[1] - this.parentInfo.top];

      // 创建翻转监听器
      this.RectFliper = new flip(this.elementInfo, stick);
    },
    // 缩放控件的mousemove事件回调函数
    stickMove: function stickMove(ev) {
      var _this = this;
      var mousePoint = [ev.clientX, ev.clientY];

      // 当拖拽触点为中点（tm,bm,mr,ml）时或锁定比例时，需要特别处理
      if (this.lock || this.isMiddlePoint) {
        // 计算出鼠标点与参考线（当前触点与对称触点构成的直线）垂直相交的点作为当前点
        mousePoint = calcVerticalCrossPoint(mousePoint, this.absoluteContactor, this.symAbsoluteContactor);
      }
      // 计算当前元素旋转复位后的几何信息
      var _this$caclRectResetRo = this.caclRectResetRotated(mousePoint, this.symRelativeContactor, this.parentInfo, this.rotate),
        newMousePoint = _this$caclRectResetRo.newMousePoint,
        newSymPoint = _this$caclRectResetRo.newSymPoint;
      // 更新矩形宽高、位置
      this.updateElementInfo(newMousePoint, newSymPoint, this.currentStick, this.lock);
      // 监听是否翻转，若翻转则执行回调：更新旋转角、初始化矩形状态
      this.RectFliper.borderSignsWatcher(mousePoint, function (isDegFlip, sign) {
        if (isDegFlip) _this.rotate += sign === '-' ? -180 : 180;
        _this.stickDownHandle(_this.RectFliper.getFlipStick(_this.currentStick));
      });
      this.$emit('resizing', this.posData, ev);
    },
    // 计算矩形旋转复位后的信息
    caclRectResetRotated: function caclRectResetRotated(mousePoint, symRelativeContactor, parentInfo, rotate) {
      // 计算鼠标点基于父元素中点旋转复位、以及当前元素旋转复位的鼠标点坐标（相对文档左上角）
      var mouseAbsoluteRotatedPoint = calcRotatedPoint(mousePoint, [parentInfo.cx, parentInfo.cy], parentInfo.absoluteRotate);

      // 计算鼠标点相对父元素的点坐标
      var mouseRelativeRotatedPoint = [mouseAbsoluteRotatedPoint[0] - parentInfo.left, mouseAbsoluteRotatedPoint[1] - parentInfo.top];

      // 当前元素新中心点
      var newCenterPoint = calcCenterPoint(mouseRelativeRotatedPoint, symRelativeContactor);
      // 计算当前元素旋转复位后，鼠标点坐标
      var newMousePoint = calcRotatedPoint(mouseRelativeRotatedPoint, newCenterPoint, rotate);

      // 计算当前元素旋转复位后，对称点坐标
      var newSymPoint = calcRotatedPoint(symRelativeContactor, newCenterPoint, rotate);
      return {
        newMousePoint: newMousePoint,
        newSymPoint: newSymPoint,
        newCenterPoint: newCenterPoint
      };
    },
    // 根据strick生成对应的矩形渲染函数
    createRenderFunc: function createRenderFunc(stick) {
      return {
        tl: function tl(point, symPoint, lock) {
          this.left = point[0];
          this.top = point[1];
          this.width = Math.abs(point[0] - symPoint[0]);
          this.height = lock ? this.width / this.whRatio : Math.abs(point[1] - symPoint[1]);
        },
        tm: function tm(point, symPoint, lock) {
          this.height = Math.abs(point[1] - symPoint[1]);
          this.width = lock ? this.height * this.whRatio : this.width;
          this.top = point[1];
          this.left = symPoint[0] - this.width / 2;
        },
        tr: function tr(point, symPoint, lock) {
          this.left = symPoint[0];
          this.top = point[1];
          this.width = Math.abs(point[0] - symPoint[0]);
          this.height = lock ? this.width / this.whRatio : Math.abs(point[1] - symPoint[1]);
        },
        mr: function mr(point, symPoint, lock) {
          this.width = Math.abs(point[0] - symPoint[0]);
          this.height = lock ? this.width / this.whRatio : this.height;
          this.left = symPoint[0];
          this.top = symPoint[1] - this.height / 2;
        },
        br: function br(point, symPoint, lock) {
          this.left = symPoint[0];
          this.top = symPoint[1];
          this.width = Math.abs(point[0] - symPoint[0]);
          this.height = lock ? this.width / this.whRatio : Math.abs(point[1] - symPoint[1]);
        },
        bm: function bm(point, symPoint, lock) {
          this.height = Math.abs(point[1] - symPoint[1]);
          this.width = lock ? this.height * this.whRatio : this.width;
          this.left = symPoint[0] - this.width / 2;
          this.top = symPoint[1];
        },
        bl: function bl(point, symPoint, lock) {
          this.left = point[0];
          this.top = symPoint[1];
          this.width = Math.abs(point[0] - symPoint[0]);
          this.height = lock ? this.width / this.whRatio : Math.abs(point[1] - symPoint[1]);
        },
        ml: function ml(point, symPoint, lock) {
          this.width = Math.abs(point[0] - symPoint[0]);
          this.height = lock ? this.width / this.whRatio : this.height;
          this.left = point[0];
          this.top = symPoint[1] - this.height / 2;
        },
        angle: function angle() {}
      }[stick];
    },
    // 更新矩形信息
    updateElementInfo: function updateElementInfo(point, symPoint, stick, lock) {
      var renderFunc = this.createRenderFunc(stick);
      renderFunc && renderFunc.call(this, point, symPoint, lock);
    }
  },
  watch: {
    x: function x(value) {
      this.left = value;
    },
    y: function y(value) {
      this.top = value;
    },
    w: function w(value) {
      this.width = value;
    },
    h: function h(value) {
      this.height = value;
    },
    r: function r(value) {
      this.rotate = value;
    },
    z: function z(value) {
      this.zIndex = value;
    }
  }
});
// CONCATENATED MODULE: ./src/vdr/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_vdrvue_type_script_lang_js_ = (vdrvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/vdr/style/index.css?vue&type=style&index=0&prod&lang=css&
var stylevue_type_style_index_0_prod_lang_css_ = __webpack_require__("7337");

// CONCATENATED MODULE: ./node_modules/_vue-loader@15.10.0@vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/vdr/index.vue






/* normalize component */

var component = normalizeComponent(
  src_vdrvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var vdr = (component.exports);
// CONCATENATED MODULE: ./src/index.js

// 导入组件，组件必须声明 name


// 为组件添加 install 方法，用于按需引入
vdr.install = function (Vue) {
  Vue.component(vdr.name, vdr);
};
/* harmony default export */ var src = (vdr);
// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ }),

/***/ "120f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("3d8a");
var $export = __webpack_require__("e99b");
var redefine = __webpack_require__("84e8");
var hide = __webpack_require__("065d");
var Iterators = __webpack_require__("953d");
var $iterCreate = __webpack_require__("3460");
var setToStringTag = __webpack_require__("bac3");
var getPrototypeOf = __webpack_require__("addc");
var ITERATOR = __webpack_require__("839a")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "1663":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("212e");
var defined = __webpack_require__("3ab0");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "1b0b":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("a86f");
var aFunction = __webpack_require__("3250");
var SPECIES = __webpack_require__("839a")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "1b96":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("cea2");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "1bc7":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("25ba");
var getKeys = __webpack_require__("93ca");
var redefine = __webpack_require__("84e8");
var global = __webpack_require__("0b34");
var hide = __webpack_require__("065d");
var Iterators = __webpack_require__("953d");
var wks = __webpack_require__("839a");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "1e4d":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("3250");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "201c":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("212e");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "212e":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "21d9":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("3a4c");
var hiddenKeys = __webpack_require__("065e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "246f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("e99b");
var $forEach = __webpack_require__("e9aa")(0);
var STRICT = __webpack_require__("95b6")([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "25ba":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("87b2");
var step = __webpack_require__("6fef");
var Iterators = __webpack_require__("953d");
var toIObject = __webpack_require__("3471");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("120f")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "26df":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("0926")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "285b":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("35d4");
var createDesc = __webpack_require__("5edc");
var toIObject = __webpack_require__("3471");
var toPrimitive = __webpack_require__("5d10");
var has = __webpack_require__("4fd4");
var IE8_DOM_DEFINE = __webpack_require__("83d3");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("26df") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "3250":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "3460":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("7ee3");
var descriptor = __webpack_require__("5edc");
var setToStringTag = __webpack_require__("bac3");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("065d")(IteratorPrototype, __webpack_require__("839a")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "3471":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("1b96");
var defined = __webpack_require__("3ab0");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "35d4":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "3a0d":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("baa7")('keys');
var uid = __webpack_require__("d8b3");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "3a4c":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("4fd4");
var toIObject = __webpack_require__("3471");
var arrayIndexOf = __webpack_require__("52a4")(false);
var IE_PROTO = __webpack_require__("3a0d")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "3ab0":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "3d8a":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "3f9e":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("bb8b");
var anObject = __webpack_require__("a86f");
var getKeys = __webpack_require__("93ca");

module.exports = __webpack_require__("26df") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "43ec":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("1663")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "4890":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("e99b");
var $filter = __webpack_require__("e9aa")(2);

$export($export.P + $export.F * !__webpack_require__("95b6")([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "4fd4":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "52a4":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("3471");
var toLength = __webpack_require__("201c");
var toAbsoluteIndex = __webpack_require__("732b");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "566e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("e99b");
var $map = __webpack_require__("e9aa")(1);

$export($export.P + $export.F * !__webpack_require__("95b6")([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "5d10":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("9cff");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "5dc3":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "5edc":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "6bf8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("a86f");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "6fef":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "70f2":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("0451");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "732b":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("212e");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "7337":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_8_2_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_10_0_vue_loader_lib_loaders_stylePostLoader_js_index_css_vue_type_style_index_0_prod_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d998");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_8_2_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_10_0_vue_loader_lib_loaders_stylePostLoader_js_index_css_vue_type_style_index_0_prod_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_8_2_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_1_0_1_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_10_0_vue_loader_lib_loaders_stylePostLoader_js_index_css_vue_type_style_index_0_prod_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "76e3":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "7ee3":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("a86f");
var dPs = __webpack_require__("3f9e");
var enumBugKeys = __webpack_require__("065e");
var IE_PROTO = __webpack_require__("3a0d")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("e8d7")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("bbcc").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "804d":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("9cff");
var cof = __webpack_require__("cea2");
var MATCH = __webpack_require__("839a")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "8078":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("3ab0");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "839a":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("baa7")('wks');
var uid = __webpack_require__("d8b3");
var Symbol = __webpack_require__("0b34").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "83d3":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("26df") && !__webpack_require__("0926")(function () {
  return Object.defineProperty(__webpack_require__("e8d7")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "84e8":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var hide = __webpack_require__("065d");
var has = __webpack_require__("4fd4");
var SRC = __webpack_require__("d8b3")('src');
var $toString = __webpack_require__("05fd");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("76e3").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "87b2":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("839a")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("065d")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "8dee":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("a86f");
var toObject = __webpack_require__("8078");
var toLength = __webpack_require__("201c");
var toInteger = __webpack_require__("212e");
var advanceStringIndex = __webpack_require__("43ec");
var regExpExec = __webpack_require__("f417");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("c46f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "93ca":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("3a4c");
var enumBugKeys = __webpack_require__("065e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "953d":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "95b6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("0926");

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),

/***/ "9cff":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "a450":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("bb8b").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("26df") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "a83a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
var setPrototypeOf = __webpack_require__("e0ff").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "a86f":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "addc":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("4fd4");
var toObject = __webpack_require__("8078");
var IE_PROTO = __webpack_require__("3a0d")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "baa7":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("76e3");
var global = __webpack_require__("0b34");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("3d8a") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "bac3":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("bb8b").f;
var has = __webpack_require__("4fd4");
var TAG = __webpack_require__("839a")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "bb8b":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("a86f");
var IE8_DOM_DEFINE = __webpack_require__("83d3");
var toPrimitive = __webpack_require__("5d10");
var dP = Object.defineProperty;

exports.f = __webpack_require__("26df") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "bbcc":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("0b34").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "bf73":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("0353");
__webpack_require__("e99b")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "c46f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("bf73");
var redefine = __webpack_require__("84e8");
var hide = __webpack_require__("065d");
var fails = __webpack_require__("0926");
var defined = __webpack_require__("3ab0");
var wks = __webpack_require__("839a");
var regexpExec = __webpack_require__("0353");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "cea2":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "d0f2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("a86f");
var toLength = __webpack_require__("201c");
var advanceStringIndex = __webpack_require__("43ec");
var regExpExec = __webpack_require__("f417");

// @@match logic
__webpack_require__("c46f")('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "d1cb":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("cea2");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "d445":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("cea2");
var TAG = __webpack_require__("839a")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "d8b3":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "d998":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e0ff":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("9cff");
var anObject = __webpack_require__("a86f");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("1e4d")(Function.call, __webpack_require__("285b").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "e5b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("e99b");
var $find = __webpack_require__("e9aa")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("87b2")(KEY);


/***/ }),

/***/ "e680":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("0b34");
var has = __webpack_require__("4fd4");
var cof = __webpack_require__("cea2");
var inheritIfRequired = __webpack_require__("a83a");
var toPrimitive = __webpack_require__("5d10");
var fails = __webpack_require__("0926");
var gOPN = __webpack_require__("21d9").f;
var gOPD = __webpack_require__("285b").f;
var dP = __webpack_require__("bb8b").f;
var $trim = __webpack_require__("eb34").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("7ee3")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("26df") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("84e8")(global, NUMBER, $Number);
}


/***/ }),

/***/ "e8d7":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("9cff");
var document = __webpack_require__("0b34").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "e99b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("0b34");
var core = __webpack_require__("76e3");
var hide = __webpack_require__("065d");
var redefine = __webpack_require__("84e8");
var ctx = __webpack_require__("1e4d");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "e9aa":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("1e4d");
var IObject = __webpack_require__("1b96");
var toObject = __webpack_require__("8078");
var toLength = __webpack_require__("201c");
var asc = __webpack_require__("70f2");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "eb34":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("e99b");
var defined = __webpack_require__("3ab0");
var fails = __webpack_require__("0926");
var spaces = __webpack_require__("5dc3");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "f417":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("d445");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "fc02":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__("804d");
var anObject = __webpack_require__("a86f");
var speciesConstructor = __webpack_require__("1b0b");
var advanceStringIndex = __webpack_require__("43ec");
var toLength = __webpack_require__("201c");
var callRegExpExec = __webpack_require__("f417");
var regexpExec = __webpack_require__("0353");
var fails = __webpack_require__("0926");
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__("c46f")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ })

/******/ });
});