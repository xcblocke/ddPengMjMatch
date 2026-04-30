import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameConfig } from './data/GameConfig';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class steAutoWdPage extends BasePage {
  @property(cc.Sprite)
  pro_sprite: cc.Sprite = null;
  cb = null;
  gameSucc = false;
  extract_status = 0;
  extract_info = null;
  cash_threshold = false;
  levle_threshold = false;
  _init(e) {
    var t = this;
    SdkHelper.reportData("steo_auto_wd_page", {
      game_level: gameData.gameLevel
    });
    console.log("steAutoWdPage", e);
    var o = e.gameSucc,
      n = e.extract_status,
      a = void 0 === n ? 0 : n,
      i = e.cash_threshold,
      c = e.levle_threshold,
      s = e.info;
    this.gameSucc = o || false;
    this.cb = null == e ? void 0 : e.cb;
    this.extract_status = a;
    this.extract_info = s;
    this.cash_threshold = i;
    this.levle_threshold = c;
    this.pro_sprite.fillRange = 0;
    this.pro_sprite.node.stopAllActions();
    cc.tween(this.pro_sprite).to(2, {
      fillRange: 1
    }).call(function () {
      t.closePage();
    }).start();
  }
  start() {}
  closePage() {
    var e = this,
      t = 0;
    t = this.gameSucc ? Number(gameData.gameLevel) : Number(gameData.successCount);
    if (this.levle_threshold) {
      var o = EngineUtil.findIndex(gameConfig.cashExtractLevel, t),
        n = this.extract_info[o].extract_status,
        a = EngineUtil.getLocalData("wd_time"),
        i = JSON.parse(a || "[]");
      i.splice(o, 1, Date.now());
      EngineUtil.setLocalData("wd_time", JSON.stringify(i));
      var g = {
        amount: PlayerDataSys.cashBalance,
        extract_amount: 0,
        cash_balance: 0,
        gameSucc: this.gameSucc,
        extract_status: n,
        wd_index: o,
        limit_days_begin_time: Date.now(),
        limit_days_end_time: Date.now() + 60000,
        extract_info: this.extract_info[o],
        cb: this.cb
      };
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wdSuccFakePage",
        data: g
      });
    } else {
      this.cash_threshold && (t = 5);
      GameSystem.gotoWithdraw({
        game_level: t
      }).then(function (o) {
        var n = EngineUtil.findIndex(gameConfig.cashExtractLevel, t);
        e.cash_threshold && (n = 2);
        if (o && 1 == o.code) {
          var a = o.data,
            i = a.amount,
            r = a.extract_amount,
            l = a.cash_balance,
            h = a.withdraw_percent,
            g = (a.withdraw_percent_3, a.extract_status),
            _ = a.limit_days_begin_time,
            y = a.limit_days_end_time;
          if (1 == t || 2 == t) {
            gameData.updateBubble(o.data);
            PlayerDataSys.setUserCashBalance(l);
            EventMgr.trigger(GameEventType.PAGE_SHOW, {
              name: "wdSuccRealPage",
              data: {
                amount: i,
                cash_balance: l,
                gameSucc: e.gameSucc,
                wd_index: n,
                cb: e.cb,
                withdraw_percent: h
              }
            });
          } else {
            var m = {
              amount: i,
              extract_amount: r || i,
              cash_balance: PlayerDataSys.cashBalance,
              gameSucc: e.gameSucc,
              extract_status: g,
              wd_index: n,
              withdraw_percent: h,
              limit_days_begin_time: 1000 * _,
              limit_days_end_time: 1000 * y,
              extract_info: e.extract_info[n],
              cb: e.cb
            };
            EventMgr.trigger(GameEventType.PAGE_SHOW, {
              name: "wdSuccFakePage",
              data: m
            });
          }
        }
        if (2 != n) {
          var v = EngineUtil.getLocalData("wd_time"),
            b = JSON.parse(v || "[]");
          b.includes && b.splice(n, 1, Date.now());
          EngineUtil.setLocalData("wd_time", JSON.stringify(b));
        }
      }).catch(function () {
        SdkHelper.showToast(`gkey_525`);
      });
    }
    this._hide();
  }
}