import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class tujianAutoWdPage extends BasePage {
  @property(cc.Sprite)
  pro_sprite: cc.Sprite = null;
  cb = null;
  gameSucc = false;
  _init(e) {
    var t = this;
    AudioManager.getInstance().playCash("step_wd_page");
    this.cb = null == e ? void 0 : e.cb;
    this.pro_sprite.fillRange = 0;
    this.pro_sprite.node.stopAllActions();
    cc.tween(this.pro_sprite).to(1.5, {
      fillRange: 1
    }).call(function () {
      t.closePage();
    }).start();
  }
  closePage() {
    var e = this;
    AudioManager.getInstance().stopCash("step_wd");
    GameSystem.favoriteExtract().then(function (t) {
      if (t && 1 == t.code) {
        var o = t.data,
          n = o.amount,
          a = o.cash_balance,
          i = o.withdraw_percent;
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "wdSuccRealPage",
          data: {
            amount: n,
            cash_balance: a,
            gameSucc: e.gameSucc,
            cb: e.cb,
            withdraw_percent: i,
            fromPage: "tujian"
          }
        });
      }
    }).catch(function () {
      SdkHelper.showToast(`gkey_525`);
    });
    AudioManager.getInstance().stopCash("step_wd_page");
    this._hide();
  }
}