import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
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
export default class wdReturnPage extends BasePage {
  @property(cc.Label)
  wd_ratio: cc.Label = null;
  @property(cc.Label)
  wd_cash_num: cc.Label = null;
  @property(cc.Label)
  next_desc: cc.Label = null;
  gameSucc = false;
  wd_index = 0;
  _init(e) {
    var t = this;
    AudioManager.getInstance().playMusic("tday");
    if (e) {
      var o = e.gameSucc,
        n = e.cash_balance,
        a = e.wd_index,
        i = e.withdraw_percent,
        r = void 0 === i ? 0 : i,
        s = e.withdraw_percent_3,
        l = void 0 === s ? 0 : s;
      this.wd_index = a || 0;
      this.gameSucc = o || false;
      var u = 0;
      this.wd_cash_num.string = "+" + PlayerDataSys.getCNCashNum(n);
      this.scheduleOnce(function () {
        if (t.wd_cash_num.string.length < 8) {
          t.wd_cash_num.node.parent.scale = 1;
        } else {
          if (t.wd_cash_num.string.length >= 8 && t.wd_cash_num.string.length < 10) {
            t.wd_cash_num.node.parent.scale = 0.8;
          } else {
            if (t.wd_cash_num.string.length >= 10 && t.wd_cash_num.string.length < 12) {
              t.wd_cash_num.node.parent.scale = 0.7;
            } else {
              t.wd_cash_num.string.length >= 12 && (t.wd_cash_num.node.parent.scale = 0.6);
            }
          }
        }
      });
      if (0 == a || 1 == a) {
        this.wd_ratio.string = 100 * r + "%收款全返";
        u = 0.03;
      } else {
        this.wd_ratio.string = 100 * l + "%收款全返";
        u = gameConfig.withdrawPercent3[a + 1];
      }
      var h = gameConfig.cashExtractLevel[a + 1],
        g = h - gameData.successCount;
      g <= 0 && (h = gameConfig.cashExtractLevel[a + 2]) && (g = h - gameData.successCount);
      g <= 0 && (h = gameConfig.cashExtractLevel[a + 3]) && (g = h - gameData.successCount);
      g <= 0 && (g = 10);
      this.next_desc.string = "再过" + g + "关，自动发起" + 100 * u + "%收款";
    }
  }
  closePage() {
    AudioManager.getInstance().playMusic("btntouch");
    this.gotoWdPage();
    this._hide();
  }
  gotoWdPage() {
    var e = this,
      t = "",
      o = 0;
    if (1 == this.wd_index && this.gameSucc) {
      t = "再过3关可自动收款" + PlayerDataSys.getCashBalance(0.03 * PlayerDataSys.cashBalance) + "元";
      o = 1;
    }
    GameSystem.getExtractInfo({
      type: o
    }).then(function (o) {
      EngineUtil.reconnectSuc();
      if (o && 1 == o.code) {
        var n = Object.assign(Object.assign({}, o.data), {
          gameSucc: e.gameSucc,
          auto_wd: false,
          cash_threshold: false,
          wd_desc: t
        });
        EventMgr.trigger(GameEventType.UPDATE_WD_INFO, n);
      }
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.gotoWdPage();
      });
    });
  }
}