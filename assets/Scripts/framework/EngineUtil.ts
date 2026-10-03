import EventMgr from './Event/EventMgr';
import GameEventType from './Event/GameEventType';
import SdkHelper from './SdkHelper';
import { GAME_NAME } from './SystemConfig';
import PageMgr from '../view/PageMgr';
import HotUpdate from './Event/HotUpdate';
import toast from '../game/prefab/toast';
import AudioManager from './controller/AudioManager';
import PlayerDataSys from './controller/PlayerDataSys';
import GameSystem from '../system/GameSystem';
import { GuideConfig } from './enum/GuideConfig';
import { PageEnum } from './enum/AllEnum';
Date.prototype.Format = function (e) {
  var t = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  /(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
  for (var o in t) new RegExp("(" + o + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? t[o] : ("00" + t[o]).substr(("" + t[o]).length)));
  return e;
};
class _EngineUtil {
  toastContent = "";
  color = new cc.Color();
  showHttpToast = true;
  manageToast = null;
  manageShows = 0;
  cocosToast2 = null;
  lastToast2 = false;
  cocosToast3 = null;
  lastToast = false;
  promiseResolves = {};
  static _interface = null;
  static _getInterface() {
    _EngineUtil._interface || (_EngineUtil._interface = new _EngineUtil());
    return _EngineUtil._interface;
  }
  isOnlineRelease() {
    if (cc.sys.isBrowser || !cc.sys.isNative) return false;
    if (!jsb.fileUtils.isFileExist("projectCfg.json")) return false;
    var e = jsb.fileUtils.getStringFromFile("projectCfg.json");
    if (null != e && "" != e) {
      var t = JSON.parse(e);
      return "release" == t.version || "prod" == t.version;
    }
    return false;
  }
  localStorageGetItem(e, t) {
    var o = cc.sys.localStorage.getItem(e);
    return o && "" != o && null != o && "nan" != o ? o : t;
  }
  localStorageSetItem(e, t) {
    cc.sys.localStorage.setItem(e, t);
  }
  httpErr(e, t, o = false) {
    this.log(e);
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "reconnectPage",
      data: {
        callback: t,
        err: e
      }
    });
    SdkHelper.reportData("httpErr", {
      response: JSON.stringify(e)
    });
  }
  reconnectSuc() {
    EventMgr.trigger(GameEventType.PAGE_HIDE, "loadingPage");
    EventMgr.trigger(GameEventType.CLOSE_RECONNECT);
  }
  reconnectFai() {
    EventMgr.trigger(GameEventType.PAGE_HIDE, "loadingPage");
  }
  getColor(e) {
    e.includes("#") || (e = "#" + e);
    return this.color.fromHEX(e);
  }
  log() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    if (!HotUpdate.getInstance().isOnlineRelease()) if (cc.sys.isBrowser || !cc.sys.isNative) console.log(GAME_NAME, e);else try {
      console.log(GAME_NAME, JSON.stringify(e));
    } catch (e) {
      console.error(GAME_NAME, e);
    }
  }
  error() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    if (!HotUpdate.getInstance().isOnlineRelease()) if (cc.sys.isNative) try {
      console.error(GAME_NAME, JSON.stringify(e));
    } catch (e) {
      console.error(GAME_NAME, e);
    } else console.error(GAME_NAME, e);
  }
  setLocalData(e, t) {
    cc.sys.localStorage.setItem(e, t);
  }
  getLocalData(e) {
    return cc.sys.localStorage.getItem(e) || "";
  }
  getRandId() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
  }
  getTimeStamp() {
    return Math.floor(Date.now() / 1000);
  }
  isLargeScreen() {
    var e = cc.winSize.height / cc.winSize.width;
    return Number(e.toFixed(2)) > 2;
  }
  loadRemoteAsset(e) {
    return new Promise(function (t, o) {
      cc.assetManager.loadRemote(e, function (n, a) {
        if (n) {
          console.error("加载远程资源错误url:" + e, n);
          o();
        }
        t(a);
      });
    });
  }
  loadRemoteImg(e, t = ".png") {
    return new Promise(function (o, n) {
      cc.assetManager.loadRemote(e, {
        ext: t
      }, function (t, a) {
        if (t) {
          console.error("加载远程图片资源错误url:" + e, t);
          n();
        }
        o(a);
      });
    });
  }
  loadResourceAsset(e) {
    return new Promise(function (t, o) {
      cc.resources.load(e, function (n, a) {
        if (n) {
          console.error("加载resource错误url:" + e, n);
          o(n);
        }
        t(a);
      });
    });
  }
  loadPrefabByUrl(e) {
    return new Promise(function (t, o) {
      cc.loader.loadRes("prefabs/" + e, function (n, a) {
        if (n) {
          console.error("加载resource错误url:" + e, n);
          o(n);
        }
        t(a);
      });
    });
  }
  loadFrames(e) {
    return new Promise(function (t) {
      if (e) {
        cc.resources.loadDir("img/" + e, cc.SpriteFrame, function (e, o) {
          if (e) {
            console.log("manageLoadRes error", e);
          } else {
            t(o);
          }
        });
      } else {
        t([]);
      }
    });
  }
  loadFrame(e) {
    return new Promise(function (t) {
      if (e) {
        cc.loader.loadRes("img/" + e, cc.SpriteFrame, function (e, o) {
          if (e) {
            console.log("manageLoadRes error", e);
          } else {
            t(o);
          }
        });
      } else {
        t(null);
      }
    });
  }
  formatTime(e) {
    var t = Math.floor(e / 60 << 0),
      o = Math.floor(e % 60);
    t < 10 && (t = "0" + t);
    o < 10 && (o = "0" + o);
    return t + ":" + o;
  }
  formatHourTime(e) {
    var t = Math.round((e - 1800) / 3600),
      o = Math.round((e - 30) / 60) % 60,
      n = Math.floor(e % 60);
    t < 10 && (t = "0" + t);
    o < 10 && (o = "0" + o);
    n < 10 && (n = "0" + n);
    return t + ":" + o + ":" + n;
  }
  getRandomNum(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e;
  }
  getProgressWidth(e, t, o) {
    var n = Math.ceil(e * o);
    0 != n && n < t && (n = t);
    n > o && (n = o);
    var a = Math.ceil(100 * e);
    isNaN(a) && (a = 1);
    return {
      width: n,
      persent: a
    };
  }
  getPosByRot(e, t) {
    var o = e * Math.cos(2 * Math.PI / 360 * (90 - t)),
      n = e * Math.sin(2 * Math.PI / 360 * (90 - t));
    return cc.v2(o, n);
  }
  getRotation(e, t) {
    var o = 0,
      n = e.sub(t).mag(),
      a = Math.abs(e.y - t.y),
      i = 57 * Math.asin(a / n);
    o = t.x > e.x ? t.y > e.y ? 90 - i : 90 + i : t.y > e.y ? -(90 - i) : -(90 + i);
    isNaN(o) && (o = 0);
    if (0 > o) {
      var r = Math.abs(o);
      r > 90 && (o = 180 - r + 180);
      o = 90 - r + 270;
    }
    return this.getRotTo360(o);
  }
  getRotTo360(e) {
    var t = 0;
    0 == (t = 0 < e ? e % 360 : 360 - Math.abs(e) % 360) && (t = 360);
    return t;
  }
  getDistance(e, t) {
    return e.sub(t).mag();
  }
  getFormatScore(e) {
    if (e < 1000000) return e;
  }
  getCurrentTime() {
    var e = new Date();
    return e.getHours().toString().padStart(2, "0") + ":" + e.getMinutes().toString().padStart(2, "0") + ":" + e.getSeconds().toString().padStart(2, "0");
  }
  oneDayLocalStorage(e, t = 0, o = false) {
    var n = cc.sys.localStorage.getItem(e);
    null == (n = n ? JSON.parse(n) : {
      date: new Date().Format("yyyy-MM-dd"),
      count: 0
    }).count && (n.count = 0);
    if (n.date == new Date().Format("yyyy-MM-dd")) n.count += t;else {
      n.date = new Date().Format("yyyy-MM-dd");
      n.count = t;
    }
    o && (n.count = 0);
    cc.sys.localStorage.setItem(e, JSON.stringify(n));
    return n;
  }
  formatDate(e, t = "-") {
    var o = new Date(e);
    return "" + o.getFullYear() + t + (o.getMonth() + 1) + t + o.getDate();
  }
  formatDateStr(e, t = `gkey_289`, o = `gkey_290`, n = `gkey_200`) {
    var a = new Date(e);
    return "" + a.getFullYear() + t + (a.getMonth() + 1) + o + a.getDate() + n;
  }
  showManageViewToast(e = "", t = `gkey_198`) {
    var o = this;
    if (e && !(this.manageShows > 0)) if (this.manageToast) {
      var n = cc.instantiate(this.manageToast);
      n.getComponent(toast).init(e, t);
      PageMgr.setToastNode(n);
      n.zIndex = 888;
      this.manageShows++;
      n.runAction(cc.sequence(cc.delayTime(2), cc.fadeOut(0.3), cc.callFunc(function () {
        n.parent = null;
        n.destroy();
        o.manageShows--;
      })));
    } else cc.loader.loadRes("prefabs/toast", cc.Prefab, function (n, a) {
      if (!n) {
        o.manageToast = a;
        o.showManageViewToast(e, t);
      }
    });
  }
  showCocosToast2(e = "") {
    var t = this;
    if (e && !this.lastToast2) if (this.cocosToast2) {
      var o = cc.instantiate(this.cocosToast2);
      PageMgr.setToastNode(o);
      o.getComponentInChildren(cc.Label).string = e;
      o.zIndex = 888;
      o.scale = 0;
      this.lastToast = true;
      o.runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.moveBy(0.4, 0, 48), cc.callFunc(function () {
        t.lastToast = false;
      }), cc.moveBy(0.6, 0, 72), cc.fadeOut(0.3), cc.callFunc(function () {
        o.parent = null;
        o.destroy();
      })));
    } else cc.loader.loadRes("prefabs/cocosToast2", cc.Prefab, function (o, n) {
      if (!o) {
        t.cocosToast2 = n;
        t.showCocosToast2(e);
      }
    });
  }
  showCocosToast3(e = "") {
    var t = this;
    if (e && !this.lastToast) if (this.cocosToast3) {
      var o = cc.instantiate(this.cocosToast3);
      PageMgr.setToastNode(o);
      o.getComponentInChildren(cc.Label).string = e;
      o.zIndex = 888;
      o.scale = 0;
      this.lastToast = true;
      o.runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.moveBy(0.4, 0, 48), cc.callFunc(function () {
        t.lastToast = false;
      }), cc.moveBy(0.6, 0, 72), cc.fadeOut(0.3), cc.callFunc(function () {
        o.parent = null;
        o.destroy();
      })));
    } else cc.loader.loadRes("prefabs/cocosToast3", cc.Prefab, function (o, n) {
      if (!o) {
        t.cocosToast3 = n;
        t.showCocosToast3(e);
      }
    });
  }
  nameFormat(e, t = 12) {
    if (!e) return `gkey_291`;
    for (var o = e.split(""), n = o.length, a = 0, i = "", r = "", c = new RegExp(`gkey_292`), s = 0; s < n; s++) {
      var l = o[s];
      if (c.test(l)) {
        a += 2;
      } else {
        a++;
      }
      if (a > t) {
        r = "...";
        break;
      }
      i += l;
    }
    return i + r;
  }
  convertNodePosition(e, t) {
    if (e && e.parent && t && t.parent) return e.parent.convertToNodeSpaceAR(t.parent.convertToWorldSpaceAR(t.position));
  }
  GetChildByName(e, t, o) {
    var n = e.node ? e.node : e,
      a = null;
    if (n && t) {
      a = n.getChildByName(t);
      if (o && !a) for (var i = n.children, r = n.childrenCount, c = 0; c < r && !(a = this.GetChildByName(i[c], t, o)); ++c);
    }
    return a;
  }
  loadResourceJson(e) {
    return new Promise(function (t, o) {
      cc.resources.load(e, function (n, a) {
        if (n) {
          console.error("加载json错误url:" + e, n);
          o(n);
        }
        t(a);
      });
    });
  }
  setNodeSprieFrame(e, t) {
    cc.resources.load(t, cc.SpriteFrame, function (t, o) {
      if (t) {
        console.log(t);
      } else {
        e.getComponent(cc.Sprite).spriteFrame = o;
      }
    });
  }
  loaderHead(e, t) {
    e && cc.assetManager.loadRemote(e, {
      ext: ".png"
    }, function (e, o) {
      if (e) cc.log("头像加载失败", e);else try {
        t.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(o);
      } catch (e) {
        t && console.log("?????????????????头像报错了", t.name, t.parent ? t.parent.name : "无parent");
      }
    });
  }
  subUserName(e, t = 8) {
    return e ? "" != e && e.length > t ? e.substring(0, t) : e : `gkey_291`;
  }
  hexToColor(e) {
    e = e.replace(/^#/, "");
    var t = parseInt(e.substring(0, 2), 16),
      o = parseInt(e.substring(2, 4), 16),
      n = parseInt(e.substring(4, 6), 16);
    return new cc.Color(t, o, n);
  }
  shuffleArray(e) {
    for (var t, o = e.length - 1; o > 0; o--) {
      var n = Math.floor(Math.random() * (o + 1));
      t = [e[n], e[o]], e[o] = t[0], e[n] = t[1];
    }
    return e;
  }
  registerBtnEvent(e, t, o, n = "", a = {}) {
    if (cc.isValid(e)) {
      t && (t = t.name ? t.name : t);
      if ("function" == typeof t) {
        var i = "__BtnClick__" + this.randomKey(16);
        o[i] = t;
        t = i;
      }
      var r = e.getComponent(cc.Button);
      if (!r) {
        (r = e.addComponent(cc.Button)).transition = cc.Button.Transition.SCALE;
        r.zoomScale = 0.95;
        0 == a.isScale && (r.transition = cc.Button.Transition.NONE);
      }
      if (r && !r.clickEvents[0]) {
        var c = new cc.Component.EventHandler();
        c.target = o.node;
        c.component = cc.js.getClassName(o);
        c.handler = t;
        c.customEventData = n;
        r.clickEvents[0] = c;
        for (var s in a) a.hasOwnProperty(s) && (r[s] = a[s]);
      }
      e.on("click", function () {
        AudioManager.getInstance().playMusic("btntouch");
      });
    }
  }
  randomKey(e) {
    for (var t = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], o = "", n = t.length, a = 0; a < e; a++) o += t[this.randomInt(0, n - 1)];
    return o;
  }
  randomInt(e, t) {
    if (e == t) return e;
    if (!t && 0 != t) {
      t = e[1];
      e = e[0];
    }
    return Math.floor(Math.random() * (t - e + 1)) + e;
  }
  destroyNode(e) {
    if (cc.isValid(e)) {
      e.removeFromParent(false);
      e.destroy();
    } else console.error("Tools: destroyNode error, param is invalid");
  }
  getScript(e) {
    if (!e) return null;
    for (var t = e._components, o = 0; o < t.length; o++) if (t[o] && t[o].hasOwnProperty("_super")) return t[o];
    return null;
  }
  isEmojiCharacter(e) {
    if (!e) return false;
    for (var t = 0; t < e.length; t++) {
      var o = e.charCodeAt(t);
      if (55296 <= o && o <= 56319) {
        if (e.length > 1) {
          var n = 1024 * (o - 55296) + (e.charCodeAt(t + 1) - 56320) + 65536;
          if (118784 <= n && n <= 128895) return true;
        }
      } else if (e.length > 1) {
        if (8419 == e.charCodeAt(t + 1)) return true;
      } else {
        if (8448 <= o && o <= 10239) return true;
        if (11013 <= o && o <= 11015) return true;
        if (10548 <= o && o <= 10549) return true;
        if (12951 <= o && o <= 12953) return true;
        if (169 == o || 174 == o || 12349 == o || 12336 == o || 11093 == o || 11036 == o || 11035 == o || 11088 == o) return true;
      }
    }
    return false;
  }
  setGuideLocal(e) {
    if (!GuideConfig[e].isRepeat && !this.testHasGuide(e)) {
      PlayerDataSys.guide_step_new = PlayerDataSys.guide_step_new | this.powBigInt(BigInt(2), BigInt(e));
      GameSystem.updateGuideIno({
        novice_status: PlayerDataSys.guideStep,
        guide_step_new: PlayerDataSys.guide_step_new.toString()
      });
    }
  }
  setUserNameAndHeadImage(e, t) {
    e && (e.string = this.nameFormat(PlayerDataSys.nickname));
    PlayerDataSys.headimgurl && t && this.loadRemoteImg(PlayerDataSys.headimgurl).then(function (e) {
      t.spriteFrame = new cc.SpriteFrame(e);
    }).catch(function (e) {
      console.log(e);
    });
  }
  sleep(e) {
    return new Promise(function (t) {
      setTimeout(function () {
        t(true);
      }, e);
    });
  }
  formatDateToChineseDateTime(e) {
    var m = String(e.getMonth() + 1).padStart(2, "0");
    return `{"gkey_293":{"v1":"${e.getFullYear()}","v2":"${m[0]}","v3":"${m[1]}","v4":"${String(e.getDate()).padStart(2, "0")}","v5":"${String(e.getHours()).padStart(2, "0")}","v6":"${String(e.getMinutes()).padStart(2, "0")}"}}` + String(e.getSeconds()).padStart(2, "0");
  }

  // formatDateToChineseDateTime(e) {
  //   return e.getFullYear() + "年" + String(e.getMonth() + 1).padStart(2, "0") + "月" + String(e.getDate()).padStart(2, "0") + "日" + String(e.getHours()).padStart(2, "0") + ":" + String(e.getMinutes()).padStart(2, "0") + ":" + String(e.getSeconds()).padStart(2, "0");
  // }

  async showAdByRule(e) {
    if (PlayerDataSys.isOppoReviewer()) {
      return await PageMgr.showPageByEnum(PageEnum.oppoAdPage, {
        cb: e
      });
    }
    e();
    return true;
  }
  testHasGuide(e) {
    return BigInt(PlayerDataSys.guide_step_new) & this.powBigInt(BigInt(2), BigInt(e)) && !GuideConfig[e].isRepeat;
  }
  bigIntMaxNum(e, t) {
    return e < t ? t : e;
  }
  async getPromiseResolve(e) {
    var t, o;
    if (this.promiseResolves[e]) {
      return this.promiseResolves[e];
    }
    o = new Promise(function (e) {
      t = e;
    });
    this.promiseResolves[e] = {
      resolve: t,
      promise: o
    };
    return this.promiseResolves[e].promise;
  }
  triggerPromise(e) {
    if (this.promiseResolves[e]) {
      this.promiseResolves[e].resolve(0);
      delete this.promiseResolves[e];
    }
  }
  netError(e, t, o = null) {
    console.log("🚀yxl ~ EngineUtil.ts:1027 ~ EngineUtil ~ netError ~ e:", JSON.stringify(e), e.message);
    console.error(e);
    if ("xhr.status0" != e.message && "onXhr.error" != e.message && 0 != e.http_status) return false;
    this.reconnectFai();
    this.httpErr(e, function () {
      t();
    }, true);
    return true;
  }
  showNumTween(e, t = function () {}, o = function () {}) {
    return cc.tween({
      num: 0
    }).to(e, {
      num: 100
    }, {
      progress: function (e, o, n, a) {
        t(a);
      }
    }).call(function () {
      o();
    }).start();
  }
  powBigInt(e, t) {
    for (var o = BigInt(1), n = BigInt(0); n < t; n += BigInt(1)) o *= e;
    return o;
  }
  setTopZIndex(e, t = 1200) {
    var o = e.position,
      n = e.parent;
    PageMgr.setToastNode(e);
    setTimeout(function () {
      e.position = o;
      e.parent = n;
    }, t);
  }
  findIndex(e, t) {
    return e.indexOf(t);
  }
  formatDateTime(e) {
    var t = new Date(e);
    return t.getFullYear() + "-" + (t.getMonth() + 1).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0") + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0");
  }
  getRemainTime(e) {
    var t = e - Date.now();
    if (t <= 0) return `gkey_294`;
    var o = Math.floor(t / 1000),
      n = Math.floor(o / 31536000);
    o %= 31536000;
    var a = Math.floor(o / 2592000);
    o %= 2592000;
    var i = Math.floor(o / 86400);
    o %= 86400;
    var r = Math.floor(o / 3600);
    o %= 3600;
    var c = Math.floor(o / 60),
      s = o % 60,
      l = [];
    n > 0 && l.push(`{"gkey_295":{"v1":"${n}"}}`);
    a > 0 && l.push(`{"gkey_296":{"v1":"${a}"}}`);
    i > 0 && l.push(`{"gkey_297":{"v1":"${i}"}}`);
    l.push(String(r).padStart(2, "0") + ":" + String(c).padStart(2, "0") + ":" + String(s).padStart(2, "0"));
    return l.join("");
  }
}
export default _EngineUtil._getInterface();