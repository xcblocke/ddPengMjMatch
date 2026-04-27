import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class stepRedPage extends BasePage {
  @property(cc.Label)
  level_num: cc.Label = null;
  @property(cc.Label)
  red_num: cc.Label = null;
  cb = null;
  tg_gold_reward = 0;
  _init(e) {
    AudioManager.getInstance().playCash("step_red");
    SdkHelper.reportData("show_step_red_page");
    if (e) {
      this.cb = null == e ? void 0 : e.cb;
      this.tg_gold_reward = e.tg_gold_reward || 0;
    }
    gameData.tg_gold_reward = 0;
    this.level_num.string = "" + gameData.gameLevel;
    this.red_num.string = "" + this.tg_gold_reward;
  }
  clickClose() {
    var e = this;
    AudioManager.getInstance().playMusic("btntouch");
    AudioManager.getInstance().stopMusic("step_red", false);
    if (this.tg_gold_reward > 0) {
      PlayerDataSys.setUserGoldBalance(PlayerDataSys.goldBalance + this.tg_gold_reward, false);
      EventMgr.trigger(GameEventType.SHOWEFFECT, {
        num: this.tg_gold_reward < 5 ? this.tg_gold_reward : 5,
        type: 1,
        cb: function () {
          EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE, {
            start: PlayerDataSys.goldBalance - e.tg_gold_reward,
            end: PlayerDataSys.goldBalance
          });
          EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
            type: 1,
            num: e.tg_gold_reward
          });
        }
      });
    }
    this.cb && this.cb();
    this._hide();
  }
}