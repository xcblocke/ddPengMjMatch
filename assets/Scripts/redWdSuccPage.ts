import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class redWdSuccPage extends BasePage {
  @property(cc.Label)
  amount_text: cc.Label = null;
  @property(cc.Label)
  sk_time: cc.Label = null;
  @property(cc.Label)
  dz_time: cc.Label = null;
  _init(e) {
    AudioManager.getInstance().playCash("wd_success");
    var t = e.amount,
      o = e.account_time,
      n = void 0 === o ? Date.now() : o;
    this.amount_text.string = "" + t / 100;
    this.sk_time.string = EngineUtil.formatDateTime(1000 * n);
    this.dz_time.string = EngineUtil.formatDateTime(1000 * (n + 60));
  }
  start() {}
  clickClose() {
    AudioManager.getInstance().playMusic("btntouch");
    AudioManager.getInstance().stopCash("wd_success");
    this.updateGoldInfo();
    this._hide();
  }
  updateGoldInfo() {
    var e = this;
    GameSystem.getGoldExtractInfo().then(function (e) {
      EngineUtil.reconnectSuc();
      console.log("gold extract info-------", e);
      e && 1 == e.code && EventMgr.trigger(GameEventType.UPDATE_RED_WD_INFO, e.data);
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.updateGoldInfo();
      });
    });
  }
}