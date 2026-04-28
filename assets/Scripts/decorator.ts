import CommonUtil from './common/CommonUtil';
import EngineUtil from './framework/EngineUtil';
var i = null;
var r = null;
function c() {
  if (!i) if ("undefined" != typeof window && window['__CommonUtil']) i = window['__CommonUtil'];else try {
    i = "undefined" != typeof require ? CommonUtil : "undefined" != typeof window && window['cc'] && window['cc'].require ? window['cc'].require("../game/common/CommonUtil") : window['__CommonUtil'];
  } catch (e) {
    console.warn("Decorator: Failed to load CommonUtil, using fallback");
    i = window['__CommonUtil'];
  }
  return i;
}
function s() {
  if (!r) if ("undefined" != typeof window && window['__EngineUtil']) r = window['__EngineUtil'];else try {
    r = "undefined" != typeof require ? EngineUtil : "undefined" != typeof window && window['cc'] && window['cc'].require ? window['cc'].require("../framework/Utils/EngineUtil") : window['__EngineUtil'];
  } catch (e) {
    console.warn("Decorator: Failed to load EngineUtil, using fallback");
    r = window['__EngineUtil'];
  }
  return r;
}
export default class decorator {
  static Debounce(e = 300, t = "") {
    return function (o, n, a) {
      var i = a.value;
      a.value = function () {
        for (var o = [], a = 0; a < arguments.length; a++) o[a] = arguments[a];
        var r = c();
        if (!r.onAwait(n + t, e)) return i.apply(this, o);
        var l = s();
        l.showCocosToast3(`gkey_271`);
      };
      return a;
    };
  }
  static Singleton(e) {
    var t;
    return class _decorator extends e {
      constructor() {
        super(o);
        for (var o = [], n = 0; n < arguments.length; n++) o[n] = arguments[n];
        if (t) return t;
      }
    };
  }
  static Watch(e) {
    return function (t, o) {
      var n = t[o];
      Object.defineProperty(t, o, {
        get: function () {
          return n;
        },
        set: function (t) {
          var o = n;
          n = t;
          e(t, o);
        },
        enumerable: true,
        configurable: true
      });
    };
  }
}