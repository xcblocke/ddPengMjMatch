import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import Service from './service/Service';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class welcomePage3 extends BasePage {
  @property(cc.Sprite)
  head: cc.Sprite = null;
  @property(cc.Node)
  btnNode: cc.Node = null;
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init() {
    var e = this;
    PlayerDataSys.headimgurl && EngineUtil.loaderHead(PlayerDataSys.headimgurl, this.head.node);
    this.btnNode.active = false;
    this.scheduleOnce(function () {
      e.btnNode.active = true;
    }, 3);
    this.playGuideMusic();
  }
  async playGuideMusic() {
    var e = this;
    AudioManager.instance.playMusic("speedup");
    this.scheduleOnce(function () {
      AudioManager.instance.playMusic("speedup_1");
      e.scheduleOnce(function () {
        AudioManager.instance.playMusic("speedup_2");
      }, 3);
    }, 4);
    return;
  }
  async close() {
    AudioManager.instance.stopMusic("speedup", false);
    AudioManager.instance.stopMusic("speedup_1", false);
    AudioManager.instance.stopMusic("speedup_2", false);
    this.unscheduleAllCallbacks();
    Service.getSubsidyReward().then(function (e) {
      var t = e.data.reward;
      PlayerDataSys.setUserCashBalance(e.data.cash_balance, false);
      if (t > 0) {
        EventMgr.trigger(GameEventType.SHOWEFFECT, {
          start: cc.Vec3.ZERO,
          num: 3,
          type: 0,
          cb: function () {
            EventMgr.trigger(GameEventType.UPDATE_BALANCE, {
              start: PlayerDataSys.cashBalance - t,
              end: PlayerDataSys.cashBalance
            });
            EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
              type: 0,
              num: t
            });
          }
        });
        AudioManager.getInstance().playMusic("addbalance");
      }
    });
    this._hide();
    return;
  }
}