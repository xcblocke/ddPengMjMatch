import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { VideoType } from './framework/enum/AllEnum';
import GameSystem from './system/GameSystem';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class yearReardPage extends BasePage {
  @property(sp.Skeleton)
  year_sp1: sp.Skeleton = null;
  @property(sp.Skeleton)
  year_sp2: sp.Skeleton = null;
  @property(cc.Node)
  year_reward_node: cc.Node = null;
  @property(cc.Node)
  passBtn: cc.Node = null;
  @property(cc.Node)
  sp1_head: cc.Node = null;
  @property(cc.Node)
  sp2_head: cc.Node = null;
  @property(cc.Label)
  sp1_name: cc.Label = null;
  @property(cc.Label)
  sp2_name: cc.Label = null;
  @property(cc.Sprite)
  proBar: cc.Sprite = null;
  cb = null;
  currentStep = 0;
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.NONE
    });
  }
  _init(e) {
    var t = this;
    SdkHelper.reportData("year_reward_page");
    this.cb = null == e ? void 0 : e.cb;
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (e) {
      if (e) {
        t.sp2_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e);
        t.sp1_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e);
      }
    }).catch(function (e) {
      console.log(e);
    });
    this.sp2_name.string = EngineUtil.nameFormat(`gkey_191`);
    this.sp1_name.string = EngineUtil.nameFormat(`gkey_191`);
    this.currentStep = 1;
    this.year_sp1.node.active = false;
    this.year_sp2.node.active = false;
    this.year_reward_node.active = false;
    this.passBtn.active = false;
    this.playSkeleton1();
  }
  playSkeleton1() {
    var e = this;
    this.passBtn.active = false;
    AudioManager.getInstance().playCash("year_reward1");
    this.delayShowPassBtn(1.3, this.year_sp1.node);
    this.year_sp1.node.active = true;
    this.year_sp1.node.y = 225;
    this.year_sp1.setAnimation(0, "cx2", true);
    cc.tween(this.proBar).to(2, {
      fillRange: 1
    }).call(function () {
      1 == e.currentStep && e.scheduleOnce(function () {
        e.playSkeleton2();
      }, 5);
    }).start();
  }
  playSkeleton2() {
    var e = this;
    this.unscheduleAllCallbacks();
    AudioManager.getInstance().stopCash("year_reward1");
    AudioManager.getInstance().playCash("year_reward2_1");
    this.scheduleOnce(function () {
      AudioManager.getInstance().playCash("year_reward2_2");
    }, 4);
    this.scheduleOnce(function () {
      AudioManager.getInstance().playCash("year_reward2_3");
    }, 6);
    this.currentStep = 2;
    this.passBtn.active = false;
    this.delayShowPassBtn(1.3, this.year_sp2.node);
    this.year_sp2.node.active = true;
    this.year_sp1.node.active = false;
    this.year_sp2.setAnimation(0, "dj", true);
    this.scheduleOnce(function () {
      if (2 == e.currentStep) {
        e.year_sp2.node.active = false;
        e.playSkeleton3();
      }
    }, 8);
  }
  playSkeleton3() {
    var e = this;
    this.unscheduleAllCallbacks();
    AudioManager.getInstance().stopCash("year_reward2_1");
    AudioManager.getInstance().stopCash("year_reward2_2");
    AudioManager.getInstance().stopCash("year_reward2_3");
    this.passBtn.active = false;
    this.year_sp2.node.active = false;
    this.year_reward_node.x = -500;
    this.year_reward_node.opacity = 0;
    this.year_reward_node.active = true;
    this.currentStep = 3;
    GameSystem.onlyReward({
      type: VideoType.NewPlayerReward
    }).then(function (e) {
      if (1 == e.code) {
        var t = e.data,
          o = t.reward,
          n = t.cash_balance;
        PlayerDataSys.setUserCashBalance(n, false);
        if (o > 0) {
          AudioManager.getInstance().playMusic("addbalance");
          EventMgr.trigger(GameEventType.SHOWEFFECT, {
            num: 10,
            type: 0,
            cb: function () {
              EventMgr.trigger(GameEventType.UPDATE_BALANCE);
              EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
                type: 0,
                num: o
              });
            }
          });
        }
      }
    }).catch(function (e) {
      console.error(e);
      EngineUtil.showCocosToast3(`gkey_583`);
    });
    cc.tween(this.year_reward_node).to(0.3, {
      x: 0,
      opacity: 255
    }).delay(2).to(0.3, {
      x: 500,
      opacity: 0
    }).call(function () {
      var t;
      null === (t = e.cb) || void 0 === t || t.call(e);
      e._hide();
    }).start();
  }
  passNextStep(e) {
    console.log("passNextStep", this.currentStep);
    e.target.active = false;
    this.unscheduleAllCallbacks();
    switch (this.currentStep) {
      case 1:
        this.playSkeleton2();
        break;
      case 2:
        this.playSkeleton3();
    }
    1 == this.currentStep && (this.currentStep = 2);
  }
  delayShowPassBtn(e = 2, t = null) {
    var o = this;
    this.scheduleOnce(function () {
      o.passBtn.active = true;
    }, e);
    this.passBtn.parent = t;
  }
  stopAllEffect() {
    for (var e = 0; e < 12; e++) AudioManager.getInstance().stopEffect("year" + (e + 1));
  }
}