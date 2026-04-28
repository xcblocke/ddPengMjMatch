import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameConfig } from './data/GameConfig';
import { gameData } from './data/GameData';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class stepWdPage extends BasePage {
  @property(cc.Label)
  level_num: cc.Label = null;
  @property(cc.Label)
  cash_num: cc.Label = null;
  @property(cc.Sprite)
  time_circle: cc.Sprite = null;
  @property(cc.Label)
  time_label: cc.Label = null;
  @property(cc.Node)
  level_layout: cc.Node = null;
  @property(cc.Node)
  cash_layout: cc.Node = null;
  @property(cc.Label)
  cash_title: cc.Label = null;
  cb = null;
  wd_status = false;
  extract_status = 0;
  cash_threshold = false;
  levle_threshold = false;
  tg_gold_reward = 0;
  timerCallback = null;
  _init(e) {
    var t = this;
    AudioManager.getInstance().playCash("finish_step_wd");
    var o = Number(gameData.successCount);
    SdkHelper.reportData("step_wd_page", {
      game_level: o
    });
    this.level_num.string = "" + o;
    this.cash_num.string = "" + PlayerDataSys.getCashBalance();
    this.time_circle.fillRange = 1;
    this.wd_status = false;
    this.extract_status = e.extract_status || 0;
    this.cash_threshold = e.cash_threshold || false;
    this.levle_threshold = e.levle_threshold || false;
    this.tg_gold_reward = e.tg_gold_reward || 0;
    if (this.cash_threshold) {
      this.level_layout.active = false;
      this.cash_layout.active = true;
      var n = PlayerDataSys.cash_limit || PlayerDataSys.getCashBalance(gameConfig.cashLimit[2] || 500000);
      this.cash_title.string = `{"gkey_526":{"v1":"${n}"}}`;
    } else {
      this.level_layout.active = true;
      this.cash_layout.active = false;
    }
    if (this.tg_gold_reward > 0) {
      PlayerDataSys.setUserGoldBalance(PlayerDataSys.goldBalance + this.tg_gold_reward, false);
      EventMgr.trigger(GameEventType.SHOWEFFECT, {
        num: this.tg_gold_reward < 5 ? this.tg_gold_reward : 5,
        type: 1,
        cb: function () {
          EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE, {
            start: PlayerDataSys.goldBalance - t.tg_gold_reward,
            end: PlayerDataSys.goldBalance
          });
          EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
            type: 1,
            num: t.tg_gold_reward
          });
        }
      });
    }
    this.time_circle.node.stopAllActions();
    cc.tween(this.time_circle).to(4, {
      fillRange: 0
    }).call(function () {
      t.wd_status || t.goWidthDraw(null, true);
    }).start();
    var a = 3;
    this.time_label.string = "4";
    this.unscheduleAllCallbacks();
    this.timerCallback = this.schedule(function () {
      t.time_label.string = "" + a--;
    }, 1, 3);
  }
  goWidthDraw(e, t = false) {
    t || AudioManager.getInstance().playMusic("btntouch");
    this.unschedule(this.timerCallback);
    this.wd_status = true;
    this.gotoWdPage();
    AudioManager.getInstance().stopCash("finish_step_wd");
  }
  gotoWdPage() {
    this._hide();
  }
}