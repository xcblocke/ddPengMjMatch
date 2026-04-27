import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdSuccRealPage extends BasePage {
  @property(cc.Label)
  cash_num: cc.Label = null;
  @property(cc.Label)
  sksj_label: cc.Label = null;
  @property(cc.Label)
  dzsj_label: cc.Label = null;
  @property(cc.RichText)
  xgtj_label: cc.RichText = null;
  gameSucc = false;
  cash_balance = 0;
  withdraw_percent = 0;
  wd_index = 0;
  fromPage = "";
  cb = null;
  _init(e) {
    SdkHelper.reportData("wd_success", {
      game_level: gameData.gameLevel
    });
    AudioManager.getInstance().playCash("wd_success");
    var t = e.amount,
      o = e.gameSucc,
      n = e.cash_balance,
      a = e.withdraw_percent,
      i = e.wd_index,
      r = e.fromPage;
    this.cb = e.cb;
    this.gameSucc = o || false;
    this.cash_balance = n;
    this.withdraw_percent = a;
    this.wd_index = i;
    this.fromPage = r;
    this.cash_num.string = PlayerDataSys.getCNCashNum(t);
    this.sksj_label.string = EngineUtil.formatDateTime(Date.now());
    this.dzsj_label.string = EngineUtil.formatDateTime(Date.now() + 60000);
    if ("tujian" == r) {
      this.xgtj_label.string = "继续收集，可再次发起自动提现";
    } else {
      if (0 == i) {
        this.xgtj_label.string = "再过<color = #3BB37A>1关</c>，可再次发起自动收款";
      } else {
        1 == i && (this.xgtj_label.string = "再过<color = #3BB37A>3关</c>，可再次发起自动收款");
      }
    }
  }
  closePage() {
    AudioManager.getInstance().playMusic("btntouch");
    AudioManager.getInstance().stopCash("wd_success");
    if ("tujian" == this.fromPage) {
      this.cb && this.cb();
    } else {
      if (this.cash_balance > 0) {
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "wdReturnPage",
          data: {
            gameSucc: this.gameSucc,
            cash_balance: this.cash_balance,
            withdraw_percent: this.withdraw_percent,
            wd_index: this.wd_index
          }
        });
      } else {
        this.gotoWdPage();
      }
    }
    AudioManager.getInstance().stopCash("wd_succ");
    this._hide();
  }
  gotoWdPage() {
    var e = this;
    GameSystem.getExtractInfo().then(function (t) {
      EngineUtil.reconnectSuc();
      if (t && 1 == t.code) {
        var o = Object.assign(Object.assign({}, t.data), {
          gameSucc: e.gameSucc,
          auto_wd: false,
          cash_threshold: false,
          cb: e.cb
        });
        EventMgr.trigger(GameEventType.UPDATE_WD_INFO, o);
      }
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.gotoWdPage();
      });
    });
  }
}