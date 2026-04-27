import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameConfig } from './data/GameConfig';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class makeUpRewardPage extends BasePage {
  @property(cc.Label)
  cash_num: cc.Label = null;
  @property(cc.RichText)
  target_num: cc.RichText = null;
  cb = null;
  _init(e) {
    this.cb = (null == e ? void 0 : e.cb) || null;
    var t = cc.sys.localStorage.getItem("make_up_reward");
    if (t) {
      cc.sys.localStorage.removeItem("make_up_reward");
      this.cash_num.string = PlayerDataSys.getCashBalance(Number(t));
      var o = (PlayerDataSys.cash_limit || PlayerDataSys.getCashBalance(gameConfig.cashLimit[2] || 500000)) + "元";
      this.target_num.string = "预计<color=#FFFC00>30分钟</c>内即可满<color=#FFFC00>" + o + "</c>，快收下吧！";
    } else this._hide();
  }
  close() {
    EventMgr.trigger(GameEventType.UPDATE_BALANCE);
    this.cb && this.cb();
    AudioManager.getInstance().playMusic("btntouch");
    this._hide();
  }
}