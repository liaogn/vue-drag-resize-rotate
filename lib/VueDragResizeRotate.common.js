module.exports =
/******/ (function(modules) { // webpackBootstrap
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

/***/ "064e":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("69b3");
var IE8_DOM_DEFINE = __webpack_require__("db6b");
var toPrimitive = __webpack_require__("94b3");
var dP = Object.defineProperty;

exports.f = __webpack_require__("149f") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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

/***/ "09b9":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("224c");
var defined = __webpack_require__("f6b4");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "0aed":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("aaba");
var redefine = __webpack_require__("bf16");
var hide = __webpack_require__("86d4");
var fails = __webpack_require__("238a");
var defined = __webpack_require__("f6b4");
var wks = __webpack_require__("cb3d");
var regexpExec = __webpack_require__("8714");

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

/***/ "0dc8":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("064e");
var anObject = __webpack_require__("69b3");
var getKeys = __webpack_require__("80a9");

module.exports = __webpack_require__("149f") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "112a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "install", function() { return /* reexport */ src["b" /* install */]; });

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("e67d")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./src/index.js
var src = __webpack_require__("b635");

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src["a" /* default */]);



/***/ }),

/***/ "149f":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("238a")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "163d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("e7ad");
var has = __webpack_require__("e042");
var cof = __webpack_require__("75c4");
var inheritIfRequired = __webpack_require__("1e5b");
var toPrimitive = __webpack_require__("94b3");
var fails = __webpack_require__("238a");
var gOPN = __webpack_require__("2ea2").f;
var gOPD = __webpack_require__("dcb7").f;
var dP = __webpack_require__("064e").f;
var $trim = __webpack_require__("777a").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("e005")(proto)) == NUMBER;
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
  for (var keys = __webpack_require__("149f") ? gOPN(Base) : (
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
  __webpack_require__("bf16")(global, NUMBER, $Number);
}


/***/ }),

/***/ "1e5b":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("fb68");
var setPrototypeOf = __webpack_require__("859b").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "224c":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("75c4");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "238a":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "2ea2":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("c2f7");
var hiddenKeys = __webpack_require__("ceac").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "4ce5":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("5daa");
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

/***/ "4f18":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "550e":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "56f2":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("6798")('keys');
var uid = __webpack_require__("ec45");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "5daa":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "6798":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("7ddc");
var global = __webpack_require__("e7ad");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("550e") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "69b3":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("fb68");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "7108":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("7e23");
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

/***/ "75c4":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "777a":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("e46b");
var defined = __webpack_require__("f6b4");
var fails = __webpack_require__("238a");
var spaces = __webpack_require__("9769");
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

/***/ "7ddc":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "7e23":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("75c4");
var TAG = __webpack_require__("cb3d")('toStringTag');
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

/***/ "7e2c":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "80a9":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("c2f7");
var enumBugKeys = __webpack_require__("ceac");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "859b":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("fb68");
var anObject = __webpack_require__("69b3");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("4ce5")(Function.call, __webpack_require__("dcb7").f(Object.prototype, '__proto__').set, 2);
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

/***/ "86d4":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("064e");
var createDesc = __webpack_require__("cc33");
module.exports = __webpack_require__("149f") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "8714":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("f1fe");

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

/***/ "8df1":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("e7ad").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "94b3":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("fb68");
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

/***/ "9769":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "9e76":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("69b3");
var toLength = __webpack_require__("eafa");
var advanceStringIndex = __webpack_require__("e754");
var regExpExec = __webpack_require__("7108");

// @@match logic
__webpack_require__("0aed")('match', 1, function (defined, MATCH, $match, maybeCallNative) {
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

/***/ "9edd":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "aaba":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("8714");
__webpack_require__("e46b")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "abf4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("cc57");

// EXTERNAL MODULE: ./src/vdd/index.css
var vdd = __webpack_require__("7e2c");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"514a6e5c-vue-loader-template"}!./node_modules/_vue-loader@15.9.2@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.2@vue-loader/lib??vue-loader-options!./src/vdd/index.vue?vue&type=template&id=e22b3cd4&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"vdr",staticClass:"vdr",class:{ 'vdr-active': _vm.active && _vm.activeable, 'vdr-not-active': !_vm.activeable },style:(_vm.style),on:{"click":function($event){$event.stopPropagation();},"mousedown":function($event){$event.stopPropagation();$event.preventDefault();return _vm.bodyDown($event)}}},[(_vm.active && _vm.activeable)?[_vm._l((_vm.sticks),function(stick,stickIndex){return _c('span',{key:stickIndex,staticClass:"vdr-stick",class:("vdr-stick-" + stick),style:({zIndex:_vm.activeStick==stickIndex?10:9}),on:{"mousedown":function($event){$event.stopPropagation();$event.preventDefault();return _vm.stickDown($event, stick,stickIndex)}}})}),(_vm.rotateable)?[_c('span',{staticClass:"vdr-stick-rotate-line"}),_c('span',{staticClass:"vdr-stick vdr-rotate",on:{"mousedown":function($event){$event.stopPropagation();$event.preventDefault();return _vm.rotateDown($event)}}})]:_vm._e()]:_vm._e(),_c('div',{staticClass:"vdr-slot",attrs:{"bg":_vm.bg}},[_vm._t("default")],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/vdd/index.vue?vue&type=template&id=e22b3cd4&

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.regexp.match.js
var es6_regexp_match = __webpack_require__("9e76");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("163d");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.1.0@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.2@vue-loader/lib??vue-loader-options!./src/vdd/index.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// 宽高最小值
var MINSIZE = 0; // 旋转坐标点缓存

var pointA = {};
var pointB = {};
var pointC = {};
/* harmony default export */ var vddvue_type_script_lang_js_ = ({
  name: "VueDragResizeRotate",
  props: {
    d: {
      type: Boolean,
      default: true
    },
    bg: {
      type: String,
      default: ""
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
        return typeof val === "number";
      }
    },
    y: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return typeof val === "number";
      }
    },
    z: {
      type: [String, Number],
      default: "auto"
    },
    r: {
      type: Number,
      default: 0
    },
    sticks: {
      type: Array,
      default: function _default() {
        return ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml"];
      }
    },
    stickSize: {
      type: Number,
      default: 10
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
    borderSize: {
      type: Number,
      default: 2
    },
    widthRange: {
      type: Array
    },
    heightRange: {
      type: Array
    }
  },
  data: function data() {
    return {
      whRatio: 0,
      width: this.w,
      height: this.h,
      zIndex: this.z,
      left: this.x,
      top: this.y,
      bottom: 0,
      right: 0,
      rotate: this.r,
      activeStick: -1
    };
  },
  computed: {
    style: function style() {
      var rotate = "rotateZ(".concat(Math.round(this.rotate), "deg)");
      var translate = "translateX(".concat(this.left, "px) translateY(").concat(this.top, "px)");
      return {
        zIndex: this.zIndex,
        width: "".concat(this.width, "px"),
        height: "".concat(this.height, "px"),
        transform: "".concat(translate, " ").concat(rotate)
      };
    },
    posData: function posData() {
      return {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        rotate: Math.round(this.rotate)
      };
    },
    // x的最小偏移值
    minOffsetLeft: function minOffsetLeft() {
      // console.log(this.minWidth);
      return this.parentWidth - this.right - this.minWidth;
    },
    maxOffsetLeft: function maxOffsetLeft() {
      // console.log(this.minWidth);
      return this.parentWidth - this.right - this.maxWidth;
    },
    // y的最小偏移值
    minOffsetTop: function minOffsetTop() {
      return this.parentHeight - this.bottom - this.minHeight;
    },
    maxOffsetTop: function maxOffsetTop() {
      return this.parentHeight - this.bottom - this.maxHeight;
    }
  },
  mounted: function mounted() {
    this.init();
  },
  beforeDestroy: function beforeDestroy() {
    // 销毁前移除事件
    document.documentElement.removeEventListener("mousemove", this.move);
    document.documentElement.removeEventListener("mouseup", this.up);
  },
  methods: {
    // 计算最小宽
    calcMinWidth: function calcMinWidth() {
      var min = Math.min.apply(null, this.widthRange);
      if (min < 0 || min >= 0 && min >= this.width) return 0;
      return min || 0;
    },
    // 计算最大宽
    calcMaxWidth: function calcMaxWidth() {
      var max = Math.max.apply(null, this.widthRange);
      if (max <= 0 || max > 0 && max < this.width) return Infinity;
      return max || Infinity;
    },
    // 计算最小高
    calcMinHeight: function calcMinHeight() {
      var min = Math.min.apply(null, this.heightRange);
      if (min < 0 || min >= 0 && min >= this.height) min = 0;

      if (this.lock) {
        if (this.widthRange) {
          return this.minWidth / this.whRatio;
        } else if (this.widthRange == null && this.heightRange) {
          this.minWidth = min * this.whRatio;
        }
      }

      return min || 0;
    },
    // 计算最大高
    calcMaxHeight: function calcMaxHeight() {
      var max = Math.max.apply(null, this.heightRange);
      if (max <= 0 || max > 0 && max < this.height) max = Infinity;

      if (this.lock) {
        if (this.widthRange) {
          return this.maxWidth / this.whRatio;
        } else if (this.widthRange == null && this.heightRange) {
          this.maxWidth = max * this.whRatio;
        }
      }

      return max || Infinity;
    },
    // 范围值初始
    setLimitValue: function setLimitValue() {
      this.minWidth = this.calcMinWidth();
      this.maxWidth = this.calcMaxWidth();
      this.minHeight = this.calcMinHeight();
      this.maxHeight = this.calcMaxHeight();
    },
    // 初始化
    init: function init() {
      // 缩放控件类型初始化
      this.currentStick = ""; // 元素宽高比例初始化

      this.whRatio = this.width / this.height; // 父级信息初始化

      this.parentElement = this.$el.parentNode;
      this.parentWidth = this.parentElement.clientWidth;
      this.parentHeight = this.parentElement.clientHeight; // 元素bottom、right初始化

      this.bottom = this.parentHeight - this.height - this.top;
      this.right = this.parentWidth - this.width - this.left; // 范围值初始化

      this.setLimitValue(); // 鼠标、元素位置信息初始化

      this.bodyStartPos = {
        mx: 0,
        my: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
      document.documentElement.addEventListener("mousemove", this.move);
      document.documentElement.addEventListener("mouseup", this.up);
    },
    //元素本身的mousedown事件回调函数
    bodyDown: function bodyDown(ev) {
      if (!this.activeable) return;
      this.bodyDrag = true; // 记录开始鼠标位置

      this.bodyStartPos.mx = ev.clientX;
      this.bodyStartPos.my = ev.clientY; // 记录开始元素位置

      this.bodyStartPos.left = this.left;
      this.bodyStartPos.top = this.top;
      this.activeable && this.$emit("activated", this.posData);
    },
    // 元素本身的mousemove事件回调函数
    bodyMove: function bodyMove(ev) {
      // 起始位置信息
      var _this$bodyStartPos = this.bodyStartPos,
          mx = _this$bodyStartPos.mx,
          my = _this$bodyStartPos.my,
          left = _this$bodyStartPos.left,
          top = _this$bodyStartPos.top; // 位移向量

      var vector = {
        x: ev.clientX - mx,
        y: ev.clientY - my
      }; // 更新位置信息

      this.left = left + vector.x;
      this.top = top + vector.y; // 触发拖拽事件

      this.$emit("dragging", this.posData);
    },
    //缩放控件的mousedown事件回调函数
    stickDown: function stickDown(ev, stick, index) {
      if (!this.activeable) return;
      this.stickDrag = true;
      this.activeStick = index; // 记录当前拖拽的stick

      this.currentStick = stick; // 记录开始时鼠标位置

      this.bodyStartPos.mx = ev.clientX;
      this.bodyStartPos.my = ev.clientY; // 计算开始时元素right、bottom位置信息

      this.right = this.parentWidth - this.width - this.left;
      this.bottom = this.parentHeight - this.height - this.top; // 记录开始时元素位置

      this.bodyStartPos.left = this.left;
      this.bodyStartPos.top = this.top;
      this.bodyStartPos.bottom = this.bottom;
      this.bodyStartPos.right = this.right;
    },
    // 缩放控件的mousemove事件回调函数
    stickMove: function stickMove(ev) {
      // 当前空间类型
      var currentStick = this.currentStick; // 起始位置信息

      var _this$bodyStartPos2 = this.bodyStartPos,
          mx = _this$bodyStartPos2.mx,
          my = _this$bodyStartPos2.my,
          top = _this$bodyStartPos2.top,
          left = _this$bodyStartPos2.left,
          bottom = _this$bodyStartPos2.bottom,
          right = _this$bodyStartPos2.right; // 位移向量

      var vector = {
        x: ev.clientX - mx,
        y: ev.clientY - my
      }; // 如果比例锁定，将非m控件替代为m控件计算

      if (this.lock && !currentStick.match("m")) {
        currentStick = "".concat(currentStick[0], "m");
      } // 根据当前控件类型更新位置信息


      currentStick[0] == "t" && (this.top = top + vector.y);
      currentStick[0] == "b" && (this.bottom = bottom - vector.y);
      currentStick[1] == "l" && (this.left = left + vector.x);
      currentStick[1] == "r" && (this.right = right - vector.x); // 触发缩放事件

      this.$emit("resizing", this.posData);
    },
    // 旋转控件的mousedown事件回调函数
    rotateDown: function rotateDown(ev) {
      if (!this.activeable) return; // 当前元素

      var vdr = this.$refs.vdr; // 当前元素位置大小信息，用于计算旋转元素的中心点

      var rect = vdr.getBoundingClientRect();
      var left = rect.left,
          top = rect.top,
          width = rect.width,
          height = rect.height;
      this.rotateDrag = true; // 开始点

      pointB = {
        X: ev.clientX,
        Y: ev.clientY
      }; // 中点

      pointA = {
        X: left + width / 2,
        Y: top + height / 2
      };
    },
    // 旋转控件的mousemove事件回调函数
    rotateMove: function rotateMove(ev) {
      // 记录结束点
      pointC = {
        X: ev.clientX,
        Y: ev.clientY
      }; // AB、AC向量

      var AB = {
        X: pointB.X - pointA.X,
        Y: pointB.Y - pointA.Y
      };
      var AC = {
        X: pointC.X - pointA.X,
        Y: pointC.Y - pointA.Y
      }; // AB与AC叉乘，根据右手定则：direct小于零逆时针旋转，大于零顺时针旋转

      var direct = AB.X * AC.Y - AB.Y * AC.X; // AB、AC向量的模

      var AB_dx = pointA.X - pointB.X;
      var AC_dx = pointA.X - pointC.X;
      var AB_dy = pointA.Y - pointB.Y;
      var AC_dy = pointA.Y - pointC.Y;
      var lengthAB = Math.sqrt(AB_dx * AB_dx + AB_dy * AB_dy);
      var lengthAC = Math.sqrt(AC_dx * AC_dx + AC_dy * AC_dy); // 向量点乘，公式： A*B = x1*x2 + y1*y2

      var product = AB.X * AC.X + AB.Y * AC.Y; // 两个向量之间的夹角的计算公式 ：a * b = |a| * |b| * cosθ
      // 公式转换 θ = Math.acos(a * b /( |a| * |b| )); （θ为弧度）
      // Math.acos的参数范围[-1, 1] ,返回值[-PI, PI],其余值返回 NAN

      var rad = Math.acos(product / (lengthAB * lengthAC));
      var angle = rad / Math.PI * 180 || 0; // 根据旋转方向加减角度

      this.rotate = direct < 0 ? this.rotate - angle : this.rotate + angle; // 触发事件

      this.$emit("rotating", this.posData); // 更新起点

      pointB = {
        X: ev.clientX,
        Y: ev.clientY
      };
    },
    // mousemove事件回调函数
    move: function move(ev) {
      if (this.draggable && this.bodyDrag) {
        this.bodyMove(ev);
      }

      if (this.resizeable && this.stickDrag) {
        this.stickMove(ev);
      }

      if (this.rotateable && this.rotateDrag) {
        this.rotateMove(ev);
      }
    },
    // mousemup事件回调函数
    up: function up() {
      // 拖拽停止
      if (this.draggable && this.bodyDrag) {
        this.bodyDrag = false;
        this.$emit("dragStop", this.posData);
      } // 缩放停止


      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false;
        this.$emit("resizeStop", this.posData);
      } // 旋转停止


      if (this.rotateable && this.rotateDrag) {
        this.rotateDrag = false;
        this.$emit("rotateStop", this.posData);
      } // 更新宽高比例，当宽高其中一个为0时，不更新比例


      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height;
      }
    }
  },
  watch: {
    left: function left(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return; // 更新宽度、宽度范围校验

      if (value > this.minOffsetLeft) this.left = this.minOffsetLeft;
      if (value < this.maxOffsetLeft) this.left = this.maxOffsetLeft;
      this.width = this.parentWidth - this.left - this.right; // 处理锁定状态

      if (this.lock) {
        this.height = this.width / this.whRatio;
      }
    },
    top: function top(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return; // 更新高度、最小高度检测

      if (value > this.minOffsetTop) this.top = this.minOffsetTop;
      if (value < this.maxOffsetTop) this.top = this.maxOffsetTop;
      this.height = this.parentHeight - this.top - this.bottom; // 处理锁定状态

      if (this.lock) {
        this.width = this.height * this.whRatio; // 如果操作的是左边缩放控件，则重新计算left，以右边为参照

        if (this.currentStick.match("l")) {
          this.left = this.parentWidth - this.right - this.width;
        }
      }
    },
    right: function right(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return; // 更新宽度、宽度范围校验

      var width = this.parentWidth - value - this.left;
      width = width < this.minWidth ? this.minWidth : width;
      width = width > this.maxWidth ? this.maxWidth : width;
      this.width = width;

      if (this.lock) {
        this.height = this.width / this.whRatio;
      }
    },
    bottom: function bottom(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return; // 更新高度、最小高度检测

      var height = this.parentHeight - value - this.top;
      height = height < this.minHeight ? this.minHeight : height;
      height = height > this.maxHeight ? this.maxHeight : height;
      this.height = height; // 处理锁定状态

      if (this.lock) {
        this.width = this.height * this.whRatio; // 如果操作的是左边缩放控件，则重新计算left，以右边为参照

        if (this.currentStick.match("l")) {
          this.left = this.parentWidth - this.right - this.width;
        }
      }
    },
    w: function w(value) {
      if (value <= 0 || isNaN(value) || value == null) {
        this.width = 0;
        this.height = 0;
        return;
      }

      this.width = value;

      if (this.lock) {
        this.height = Math.round(value / (this.w / this.h));
      }

      this.whRatio = this.width / this.height;
    },
    h: function h(value) {
      if (value <= 0 || isNaN(value) || value == null) {
        this.width = 0;
        this.height = 0;
        return;
      }

      this.height = value;

      if (this.lock) {
        this.width = Math.round(value * (this.w / this.h));
      }

      this.whRatio = this.width / this.height;
    },
    x: function x(value) {
      this.left = value;
      this.right = this.parentWidth - this.w - value;
    },
    y: function y(value) {
      this.top = value;
      this.bottom = this.parentHeight - this.h - value;
    },
    z: function z(value) {
      this.zIndex = value;
    },
    r: function r(value) {
      this.rotate = value;
    },
    lock: function lock(value) {
      if (value) {
        this.whRatio = this.width / this.height;
        this.setLimitValue();
      }
    }
  }
});
// CONCATENATED MODULE: ./src/vdd/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_vddvue_type_script_lang_js_ = (vddvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/_vue-loader@15.9.2@vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

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
  if (moduleIdentifier) { // server build
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
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/vdd/index.vue





/* normalize component */

var component = normalizeComponent(
  src_vddvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var src_vdd = (component.exports);
// CONCATENATED MODULE: ./src/vdd/index.js

// 导入组件，组件必须声明 name

 // 为组件添加 install 方法，用于按需引入

src_vdd.install = function (Vue) {
  Vue.component(src_vdd.name, src_vdd);
};

/* harmony default export */ var src_vdd_0 = __webpack_exports__["a"] = (src_vdd);

/***/ }),

/***/ "b3a6":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("09b9");
var toLength = __webpack_require__("eafa");
var toAbsoluteIndex = __webpack_require__("f58a");
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

/***/ "b635":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return install; });
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cc57");
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vdd_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("abf4");


function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component(_vdd_index_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].name, _vdd_index_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]);
}
var plugin = {
  install: install
};
var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

/* harmony default export */ __webpack_exports__["a"] = (_vdd_index_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("9edd")))

/***/ }),

/***/ "bf16":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e7ad");
var hide = __webpack_require__("86d4");
var has = __webpack_require__("e042");
var SRC = __webpack_require__("ec45")('src');
var $toString = __webpack_require__("d07e");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("7ddc").inspectSource = function (it) {
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

/***/ "bfe7":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("fb68");
var document = __webpack_require__("e7ad").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "c2f7":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("e042");
var toIObject = __webpack_require__("09b9");
var arrayIndexOf = __webpack_require__("b3a6")(false);
var IE_PROTO = __webpack_require__("56f2")('IE_PROTO');

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

/***/ "cb3d":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("6798")('wks');
var uid = __webpack_require__("ec45");
var Symbol = __webpack_require__("e7ad").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "cc33":
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

/***/ "cc57":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("064e").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("149f") && dP(FProto, NAME, {
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

/***/ "ceac":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "d07e":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("6798")('native-function-to-string', Function.toString);


/***/ }),

/***/ "db6b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("149f") && !__webpack_require__("238a")(function () {
  return Object.defineProperty(__webpack_require__("bfe7")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "dcb7":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("4f18");
var createDesc = __webpack_require__("cc33");
var toIObject = __webpack_require__("09b9");
var toPrimitive = __webpack_require__("94b3");
var has = __webpack_require__("e042");
var IE8_DOM_DEFINE = __webpack_require__("db6b");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("149f") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "e005":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("69b3");
var dPs = __webpack_require__("0dc8");
var enumBugKeys = __webpack_require__("ceac");
var IE_PROTO = __webpack_require__("56f2")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("bfe7")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("8df1").appendChild(iframe);
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

/***/ "e042":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "e46b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e7ad");
var core = __webpack_require__("7ddc");
var hide = __webpack_require__("86d4");
var redefine = __webpack_require__("bf16");
var ctx = __webpack_require__("4ce5");
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

/***/ "e67d":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "e754":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("fc81")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "e7ad":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "eafa":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("ee21");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "ec45":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "ee21":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "f1fe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("69b3");
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

/***/ "f58a":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("ee21");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "f6b4":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "fb68":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "fc81":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("ee21");
var defined = __webpack_require__("f6b4");
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


/***/ })

/******/ });