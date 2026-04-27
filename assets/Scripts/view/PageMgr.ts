import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import { gameData } from '../data/GameData';
class _PageMgr {
  map_pages = new Map();
  arr_pageQueue = [];
  onShowNum = 0;
  set_onShowPages = new Set();
  persist = null;
  pages = null;
  effects = null;
  toast = null;
  fullScreenClickRect = null;
  lastPageData = null;
  openTimes = new Set();
  _clickEffct = null;
  fullNode = null;
  static _instance = null;
  static _getInstance() {
    if (this._instance) return this._instance;
    this._instance = new _PageMgr();
    return this._instance;
  }
  init() {
    this.createNodes();
    this.addEvent();
  }
  addEvent() {
    EventMgr.listen(GameEventType.PAGE_SHOW, this.showPage, this);
    EventMgr.listen(GameEventType.PAGE_HIDE, this.hidePage, this);
  }
  removeEvent() {
    EventMgr.ignore(GameEventType.PAGE_SHOW, this.showPage, this);
    EventMgr.ignore(GameEventType.PAGE_HIDE, this.hidePage, this);
  }
  openEventBlock(e) {
    if (!this.openTimes.has(e)) {
      this.fullNode.active = true;
      this.openTimes.add(e);
    }
  }
  closeEventBlock(e) {
    this.openTimes.has(e) && this.openTimes.delete(e);
    0 === this.openTimes.size && (this.fullNode.active = false);
  }
  createNodes() {
    var e = new cc.Node("persist");
    this.persist = e;
    var t = new cc.Node("effects");
    this.effects = t;
    var o = new cc.Node("pages");
    this.pages = o;
    var n = new cc.Node("toast");
    this.toast = n;
    this.addFullScreenClickEffect();
    var a = new cc.Node("fullBlock");
    this.persist.addChild(o);
    this.persist.addChild(n);
    this.persist.addChild(t);
    this.persist.addChild(a);
    a.width = 99999;
    a.height = 99999;
    a.addComponent(cc.BlockInputEvents);
    this.fullNode = a;
    this.fullNode.active = false;
    e.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
    cc.game.addPersistRootNode(e);
  }
  setEffectNode(e) {
    e.parent = this.effects;
  }
  setToastNode(e) {
    e.parent = this.toast;
  }
  setEffectNode2(e) {
    e.parent = this.pages;
  }
  async showPage(e) {
    var t,
      o,
      i,
      r,
      c,
      s,
      l,
      u,
      p,
      d,
      f,
      h,
      g,
      _,
      y = this;
    console.log("pageMgr.showPage", e);
    t = e.name, o = e.data;
    i = e.option;
    if (!t) {
      console.error("class:pageMgr.fun:showPage页面名称为空");
      return;
    }
    i || (i = {
      reuse: true,
      inQueue: false,
      only: true,
      priority: 0
    });
    r = i.reuse, c = i.inQueue, s = i.only, l = i.priority;
    void 0 === c && (i.inQueue = false);
    void 0 === r && (i.reuse = true);
    void 0 === s && (i.only = true);
    void 0 === l && (i.priority = 0);
    u = 0;
    if (c) {
      if (this.onShowNum > 0) {
        if (l > 0) this.arr_pageQueue.unshift(e);else {
          e.data.lastPageData = this.lastPageData;
          this.arr_pageQueue.push(e);
        }
        return;
      }
      this.onShowNum++;
    } else u = this.getPageIndex();
    if (r && (p = this.map_pages.get(t)) && (d = p.node)) {
      h = new Promise(function (e) {
        f = e;
      });
      d.getComponent(t).resolve = f;
      this.fullNode.active = true;
      await d.getComponent(t)._init(o);
      this.fullNode.active = false;
      d.zIndex = u;
      d.active = true;
      this.set_onShowPages.add(d);
      return h;
    }
    _ = new Promise(function (e) {
      g = e;
    });
    cc.resources.load("pages/" + t, cc.Prefab, async function (e, r) {
      const __async_this = y;
      var n;
      if (e) {
        console.error("class:pageMgr.fun:showPage加载页面错误", e);
        return;
      }
      if (i.only && __async_this.hasShowPage(t)) {
        return;
      }
      (n = cc.instantiate(r)).zIndex = u;
      __async_this.fullNode.active = true;
      __async_this.set_onShowPages.add(n);
      __async_this.map_pages.set(t, {
        node: n,
        prefab: r,
        option: i
      });
      n.getComponent(t).resolve = g;
      await n.getComponent(t)._init(o);
      __async_this.pages.addChild(n);
      __async_this.fullNode.active = false;
      return;
    });
    this.lastPageData = e;
    return _;
  }
  hasShowPage(e) {
    var t = this.map_pages.get(e);
    return !!t && !!t.node && !!t.node.active;
  }
  isHasShowPage() {
    var e = false;
    this.map_pages.forEach(function (t) {
      t && t.node && t.node.active && (e = true);
    });
    return e;
  }
  hidePage(e) {
    if (e) {
      var t = this.map_pages.get(e);
      if (t) {
        var o = t.node,
          n = t.option,
          a = n.reuse,
          i = n.inQueue;
        if (a) o.active = false;else {
          o.destroy();
          t.node = null;
        }
        if (i) {
          this.onShowNum--;
          this.onShowNum < 0 && (this.onShowNum = 0);
          var r = this.arr_pageQueue.shift();
          r && this.showPage(r);
        }
      }
    } else console.error("class:pageMgr.fun:hidePage页面名称为空");
  }
  getPageIndex() {
    var e = 0;
    this.set_onShowPages.forEach(function (t) {
      var o = t.zIndex;
      o >= e && (e = o + 1);
    });
    return e;
  }
  hasPage(e) {
    return !!this.map_pages.get(e);
  }
  clear() {
    this.removeEvent();
    this.map_pages.forEach(function (e) {
      var t = e.prefab,
        o = e.node;
      t && cc.assetManager.releaseAsset(t);
      o && o.destroy();
    });
    this.map_pages.clear();
    this.set_onShowPages.clear();
    this.onShowNum = 0;
    this.arr_pageQueue = [];
    this.persist && this.persist.destroy();
    this.pages = null;
    this.persist = null;
    this.effects = null;
    _PageMgr._instance = null;
  }
  getPage(e) {
    return this.map_pages.get(e);
  }
  async showPageByEnum(e, t = null, o = null) {
    return this.showPage({
      name: e,
      option: o,
      data: t
    });
  }
  addFullScreenClickEffect() {
    var e = this,
      t = new cc.Node("fullScreenClickRect");
    t.setContentSize(99999, 99999);
    this.fullScreenClickRect = t;
    this.fullScreenClickRect.on(cc.Node.EventType.TOUCH_END, this.fullScreenClick, this);
    this.fullScreenClickRect.on(cc.Node.EventType.TOUCH_MOVE, this.fullScreenMove, this);
    var o = this.fullScreenClickRect._touchListener;
    o && "function" == typeof o.setSwallowTouches && o.setSwallowTouches(false);
    t.zIndex = 999;
    this.persist.addChild(t);
    cc.resources.load("prefabs/fullScreenClickEffect", cc.Prefab, async function (t, o) {
      const __async_this = e;
      __async_this._clickEffct = cc.instantiate(o);
      __async_this._clickEffct.parent = __async_this.fullScreenClickRect;
      __async_this._clickEffct.active = false;
      return;
    });
  }
  fullScreenClick(e) {
    var t = this;
    console.log("fullScreenClick");
    if (gameData.openGameModule.fullScreenClickEffectModule) {
      this._clickEffct.active = true;
      var o = this._clickEffct.getComponent(sp.Skeleton),
        n = this._clickEffct.parent,
        a = e.getLocation(),
        s = n.convertToNodeSpaceAR(cc.v2(a.x, a.y));
      this._clickEffct.setPosition(s.x, s.y);
      this._clickEffct.zIndex = 9999;
      o.setAnimation(0, "start", false);
      o.setCompleteListener(function () {
        t._clickEffct.active = false;
        o.setCompleteListener(null);
      });
    }
    EventMgr.trigger(GameEventType.START_COUNT_DOWN);
    EventMgr.trigger(GameEventType.FULL_SCREEN_CLICK);
  }
  fullScreenMove() {
    this._clickEffct.active || EventMgr.trigger(GameEventType.FULL_SCREEN_MOVE);
  }
}
export default _PageMgr._getInstance();