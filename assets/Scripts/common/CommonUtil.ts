import AudioManager from '../framework/controller/AudioManager';
import PlayerDataSys from '../framework/controller/PlayerDataSys';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import EngineUtil from '../framework/EngineUtil';
class l {
  globalSet = new Set();
  waitKey = {};
  static _instance = null;
  get yid() {
    this._yid || (this._yid = PlayerDataSys.yid);
    return this._yid;
  }
  static get instance() {
    this._instance || (this._instance = new l());
    return this._instance;
  }
  setLocalDataByYid(e, t, o = true) {
    e = o ? this.yid + e : e;
    if ("object" == typeof t) {
      EngineUtil.setLocalData(e, JSON.stringify(t));
    } else {
      EngineUtil.setLocalData(e, t);
    }
  }
  getLocalDataByYid(e, t = true) {
    e = t ? this.yid + e : e;
    return EngineUtil.getLocalData(e);
  }
  getLocalDataJsonByYid(e, t = true) {
    e = t ? this.yid + e : e;
    var o = EngineUtil.getLocalData(e);
    try {
      return JSON.parse(o);
    } catch (e) {
      return o;
    }
  }
  log() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    console.log.apply(console, [...["yxl " + Number(new Date())], ...e]);
  }
  sleep(e) {
    return new Promise(function (t) {
      setTimeout(function () {
        t(true);
      }, e);
    });
  }
  deadlineFormat(e) {
    if (isNaN(+e)) return "00:00";
    if (+e < 0) return "00:00";
    var t = Math.floor(e / 60).toString(),
      o = Math.floor(e % 60).toString();
    return t.padStart(2, "0") + ":" + o.padStart(2, "0");
  }
  showPage(e, t = null) {
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: e,
      data: t
    });
  }
  flyMoneyToEnd(e) {
    var t = e.pos,
      o = e.num,
      n = e.type,
      i = e.isworldPos,
      s = e.end,
      l = e.cb,
      u = void 0 === l ? function () {} : l;
    AudioManager.getInstance().playMusic("addbalance");
    return new Promise(function (e) {
      EventMgr.trigger(GameEventType.SHOWEFFECT, {
        start: t,
        end: s,
        num: o,
        type: n,
        isworldPos: i,
        cb: function () {
          null == u || u();
          e(1);
        }
      });
    });
  }
  flyExchange(e) {
    var t = e.pos,
      o = e.num,
      n = e.type,
      s = e.isworldPos,
      l = e.anchor,
      u = void 0 === l ? 0 : l,
      p = e.cb,
      d = void 0 === p ? function () {} : p;
    AudioManager.getInstance().playMusic("addbalance");
    var f = n ? PlayerDataSys.goldBalance : PlayerDataSys.coinBalance;
    return new Promise(function (e) {
      EventMgr.trigger(GameEventType.SHOWEFFECT, {
        start: u ? t.add(cc.v3(-cc.winSize.width / 2, -cc.winSize.height / 2, 0)) : t,
        num: o,
        type: n,
        isworldPos: s,
        cb: function () {
          if (n) {
            EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE, {
              start: f - o,
              end: f
            });
          } else {
            EventMgr.trigger(GameEventType.UPDATE_BALANCE, {
              start: f - o,
              end: f
            });
          }
          EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
            type: n,
            num: o
          });
          null == d || d();
          e(1);
        }
      });
    });
  }
  onAwait(e, t = 0, o = true) {
    var n = this;
    var a = this.waitKey[e];
    if (0 !== t) {
      if (a) {
        if (o) return a;
        clearTimeout(this.waitKey[e]);
      }
      this.waitKey[e] = setTimeout(function () {
        n.unlockAwait(e);
      }, t);
    } else this.waitKey[e] = 1;
    return a;
  }
  unlockAwait(e) {
    delete this.waitKey[e];
  }
}
export default l.instance;