import BasePage from './view/BasePage';
import GameSystem from './system/GameSystem';
import AdManager from './framework/Platform/AdManager';
import AudioManager from './framework/controller/AudioManager';
import SdkHelper from './framework/SdkHelper';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class firstScrewRewardPage extends BasePage {
  @property(cc.Label)
  label0: cc.Label = null;
  @property(cc.Label)
  label1: cc.Label = null;
  @property(cc.Label)
  onlyLabel: cc.Label = null;
  _showType = 0;
  _cb = null;
  _inOperation = false;
  _is_force = 0;
  _hide() {
    super._hide.call(this);
  }
  _init(e) {
    var t = PlayerDataSys.getCashBalanceWithUnit(e.ad_cash, ""),
      o = PlayerDataSys.getCashBalanceWithUnit(e.ad_gold, "");
    console.log("stepRewardPage:", e);
    this.label0.string = "" + t;
    this.label1.string = "" + o;
    this._showType = 13;
    this._cb = e.cb;
    this._is_force = e.is_force;
    this._inOperation = false;
    SdkHelper.reportData("video", {
      page_id: "3",
      action_type: "show",
      level: gameData.id,
      force: this._is_force ? 1 : 0,
      ext_param: ""
    });
  }
  onEnable() {
    super.onEnable.call(this);
    AudioManager.getInstance().playMusic("reward_dialog");
  }
  onClose() {
    var e = this;
    if (!this._inOperation) {
      SdkHelper.reportData("big_reward_only");
      SdkHelper.reportData("video", {
        page_id: "3",
        action_type: "click",
        level: gameData.id,
        force: this._is_force ? 1 : 0,
        ext_param: ""
      });
      this._inOperation = true;
      this.scheduleOnce(function () {
        e._inOperation = false;
      }, 0.5);
      if (this._is_force) this.openVideo(1);else {
        this._hide();
        GameSystem.onlyReward({
          type: this._showType
        }).then(function () {
          e._cb && e._cb();
        });
      }
    }
  }
  openVideo(e = 0) {
    var t = this;
    EngineUtil.showAdByRule(function () {
      var o = 1 == e;
      SdkHelper.showForceToast("看完广告 领取大额奖励");
      AudioManager.getInstance().playNativeMusic("video_big_reward");
      var n = function (e, t) {
          var o = this;
          SdkHelper.reportData("video", {
            page_id: "3",
            action_type: "succ",
            level: gameData.id,
            force: this._is_force ? 1 : 0,
            ext_param: ""
          });
          EventMgr.trigger(GameEventType.START_GAME_TIME);
          this._hide();
          GameSystem.videoReward({
            video_type: e,
            force_type: t,
            is_over: true
          }).then(function () {
            o._cb();
          });
        }.bind(t, t._showType, e),
        a = function (e, t) {
          var o = this;
          SdkHelper.reportData("video", {
            page_id: "3",
            action_type: "fail",
            level: gameData.id,
            force: this._is_force ? 1 : 0,
            ext_param: ""
          });
          EventMgr.trigger(GameEventType.START_GAME_TIME);
          this._hide();
          GameSystem.videoReward({
            video_type: e,
            force_type: t,
            is_over: false
          }).then(function () {
            o._cb();
          });
        }.bind(t, t._showType, e);
      EventMgr.trigger(GameEventType.STOP_GAME_TIME);
      AdManager.getInstance().playVideoAd(n, a, o);
    });
  }
  onVideoClicked() {
    var e = this;
    if (!this._inOperation) {
      SdkHelper.reportData("big_reward_all");
      SdkHelper.reportData("video", {
        page_id: "3",
        action_type: "click",
        level: gameData.id,
        force: this._is_force ? 1 : 0,
        ext_param: ""
      });
      this._inOperation = true;
      this.scheduleOnce(function () {
        e._inOperation = false;
      }, 0.5);
      this.openVideo(0);
    }
  }
}