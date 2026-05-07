import AudioManager from '../framework/controller/AudioManager';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import SdkHelper from '../framework/SdkHelper';
import EngineUtil from '../framework/EngineUtil';
import PageMgr from './PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
export enum AnimType {
  NONE = 0,
  SCALE = 1,
  FADE = 2,
  DOWN_UP = 3,
}
@ccclass
export default class BasePage extends cc.Component {
  _set_oldContent = new Set();
  _peneLock = null;
  _black = null;
  _touchLock = null;
  _content = null;
  _highestIndex = 0;
  _show_timestemp = 0;
  _report_data = null;
  _lockOption = {
    hasBlack: true,
    hasPeneLock: true,
    hasTouchLock: true
  };
  startPosition = cc.Vec3.ZERO;
  _animOption = {
    startOpacity: 0,
    endOpacity: 200,
    blackTime: 0.3,
    pageTime: 0.3,
    animType: AnimType.SCALE
  };
  onLoad() {
    this._saveContent();
    this._createPeneLock();
    this._createBlack();
    this._createContent();
    this._createTouchLock();
    this.registerBtnEvent(this.node);
  }
  onEnable() {
    this._reportEntry();
    this._show();
  }
  onDisable() {
    this._reportExit();
  }
  _reportEntry() {
    this._show_timestemp = new Date().getTime();
    var e = {
      act_page: this.node.name
    };
    this._report_data && Object.assign(e, this._report_data);
    SdkHelper.reportData("b_entry_game_page", e);
  }
  _reportExit() {
    var e = new Date().getTime();
    SdkHelper.reportData("b_leave_game_page", {
      act_page: this.node.name,
      duration: e - this._show_timestemp
    });
    this._show_timestemp = 0;
  }
  _animInit(e) {
    var t = this;
    Object.keys(e).forEach(function (o) {
      if (void 0 !== t._animOption[o]) {
        t._animOption[o] = e[o];
      } else {
        console.error("class:basePage", "页面动画配置错误,属性名:" + o);
      }
    });
  }
  _lockInit(e) {
    var t = this;
    Object.keys(e).forEach(function (o) {
      if (void 0 !== t._lockOption[o]) {
        t._lockOption[o] = e[o];
      } else {
        console.error("class:basePage", "屏蔽触碰配置错误,属性名:" + o);
      }
    });
  }
  _init() {}
  _show() {
    var e = this;
    EngineUtil.log("显示页面", this.node.name);
    var t = this._animOption.animType;
    this._lockTouch();
    var o = this._content;
    cc.Tween.stopAllByTarget(o);
    var n = this._animOption.pageTime;
    switch (t) {
      case AnimType.NONE:
        this._onShow();
        break;
      case AnimType.SCALE:
        o.scale = 0;
        cc.tween(o).to(n, {
          scale: 1
        }, {
          easing: "backOut"
        }).call(function () {
          e._onShow();
        }).start();
        break;
      case AnimType.FADE:
        o.opacity = 0;
        cc.tween(o).to(n, {
          opacity: 255
        }).call(function () {
          e._onShow();
        }).start();
    }
    this._showBlack();
  }
  _hide() {
    var e,
      t = this,
      o = this._animOption.animType;
    this._lockTouch();
    var n = this._content;
    cc.Tween.stopAllByTarget(n);
    var a = this._animOption.pageTime;
    switch (o) {
      case AnimType.NONE:
        this._onHide();
        null === (e = this.resolve) || void 0 === e || e.call(this, this.resolveData);
        break;
      case AnimType.SCALE:
        n.scale = 1;
        cc.tween(n).to(a, {
          scale: 0
        }, {
          easing: "backIn"
        }).call(function () {
          var e;
          t._onHide();
          null === (e = t.resolve) || void 0 === e || e.call(t, t.resolveData);
        }).start();
        break;
      case AnimType.FADE:
        n.opacity = 255;
        cc.tween(n).to(a, {
          opacity: 0
        }).call(function () {
          var e;
          t._onHide();
          null === (e = t.resolve) || void 0 === e || e.call(t, t.resolveData);
        }).start();
    }
    this._hideBlack();
  }
  _onShow() {
    this._unLockTouch();
  }
  _onHide() {
    this._unLockTouch();
    EventMgr.trigger(GameEventType.PAGE_HIDE, this.node.name);
  }
  _showBlack() {
    var e = this._animOption,
      t = e.blackTime,
      o = e.startOpacity,
      n = e.endOpacity,
      a = this._black;
    if (a) {
      a.opacity = o;
      cc.Tween.stopAllByTarget(a);
      cc.tween(a).to(t, {
        opacity: n
      }).start();
    }
  }
  _hideBlack() {
    var e = this._animOption,
      t = e.blackTime,
      o = e.startOpacity,
      n = e.endOpacity,
      a = this._black;
    if (a) {
      a.opacity = n;
      cc.Tween.stopAllByTarget(a);
      cc.tween(a).to(t, {
        opacity: o
      }).start();
    }
  }
  _unLockTouch() {
    this._touchLock && (this._touchLock.active = false);
  }
  _lockTouch() {
    this._touchLock && (this._touchLock.active = true);
  }
  _saveContent() {
    var e = this;
    this.node.children.forEach(function (t) {
      return e._set_oldContent.add(t);
    });
  }
  _setIndex(e) {
    if (e) {
      e.zIndex = this._highestIndex;
      this._highestIndex++;
    }
  }
  _createContent() {
    var e = this,
      t = new cc.Node("content");
    this.node.addChild(t);
    this._set_oldContent.forEach(function (o) {
      o.parent = t;
      "top" == o.name && e._setTopNodes(o);
      "bottom" == o.name && e._setBottomNodes(o);
    });
    this._content = t;
    this._content.setContentSize(cc.winSize);
    this._setIndex(t);
  }
  _setTopNodes(e) {
    var t = cc.winSize.height;
    e.y = EngineUtil.isLargeScreen() ? t / 2 - 40 : t / 2;
  }
  _setBottomNodes(e) {
    var t = cc.winSize.height,
      o = EngineUtil.isLargeScreen() ? t / 2 - 40 : t / 2;
    e.y = o;
  }
  _createTouchLock() {
    if (this._lockOption.hasTouchLock) {
      var e = new cc.Node("closeTouch");
      e.addComponent(cc.BlockInputEvents);
      e.setContentSize(cc.winSize);
      this.node.addChild(e);
      this._touchLock = e;
      this._setIndex(e);
    }
  }
  _createPeneLock() {
    if (this._lockOption.hasPeneLock) {
      var e = new cc.Node("peneLock");
      e.addComponent(cc.BlockInputEvents);
      e.setContentSize(cc.winSize);
      this.node.addChild(e);
      this._peneLock = e;
      this._setIndex(e);
    }
  }
  _createBlack() {
    if (this._lockOption.hasBlack) {
      var e = new cc.Node("black"),
        t = e.addComponent(cc.Sprite);
      cc.resources.load("pages/res/back", cc.SpriteFrame, function (o, n) {
        if (o) console.error("class:basePage", o);else {
          t.spriteFrame = n;
          e.setContentSize(cc.size(cc.winSize.width, cc.winSize.height + 800));
        }
      });
      this.node.addChild(e);
      e.color = EngineUtil.getColor("000000");
      this._black = e;
      this._setIndex(e);
    }
  }
  hideTemplate() {
    PageMgr.openEventBlock(this.node.name + "hide");
    this._lockTouch();
    var e = this._content;
    cc.Tween.stopAllByTarget(e);
    this._hideBlack();
    return new Promise(function (e) {
      e(1);
    });
  }
  async _fakeHide() {
    await this.hideTemplate();
    PageMgr.closeEventBlock(this.node.name + "hide");
    return;
  }
  _fadeOut() {
    this.node.opacity = 0;
    this._peneLock && (this._peneLock.active = false);
  }
  _fadeIn() {
    this.node.opacity = 255;
    this._peneLock && (this._peneLock.active = true);
  }
  DoClosePage() {
    var e = this.clickClose || this.closePage || this.close;
    if ("function" == typeof e) {
      e.call(this);
      return;
    }
    this._hide();
  }
  registerBtnEvent(e) {
    var t = this,
      o = e.getComponent(cc.Button);
    if (o && 0 == o.clickEvents.length) {
      var n = new cc.Component.EventHandler();
      n.target = this.node;
      n.component = "BasePage";
      n.handler = "_hookOnBtnClick";
      n.customEventData = o.node.name;
      o.clickEvents.push(n);
    }
    e.children.forEach(function (e) {
      return t.registerBtnEvent(e);
    });
  }
  _hookOnBtnClick(e, t) {
    AudioManager.getInstance().playMusic("click");
    if (-1 == (t = t.replace("comp", "")).indexOf("btnClose")) {
      var o = this["on" + t + "Click"];
      o || t.startsWith("btn") && (o = this["on" + (t = t.substring(3, t.length)) + "Click"]);
      null == o || o.call(this);
    } else this.DoClosePage();
  }
  onSpineEvent(e) {
    console.log("onSpineEvent------------", e);
  }
}
