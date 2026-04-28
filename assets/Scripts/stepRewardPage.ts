import BasePage from './view/BasePage';
import { gameConfig } from './data/GameConfig';
import GameSystem from './system/GameSystem';
import AdManager from './framework/Platform/AdManager';
import AudioManager from './framework/controller/AudioManager';
import SdkHelper from './framework/SdkHelper';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData, GameState } from './data/GameData';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { VideoType } from './framework/enum/AllEnum';
const {
  ccclass,
  property
} = cc._decorator;
enum r {
  All = 1,
  ONLY = 2,
}
@ccclass
export default class stepRewardPage extends BasePage {
  @property(cc.Label)
  label0: cc.Label = null;
  @property(cc.Label)
  label1: cc.Label = null;
  @property(cc.Label)
  onlyLabel: cc.Label = null;
  @property(cc.Node)
  zuigao: cc.Node = null;
  @property(cc.Label)
  btnLb: cc.Label = null;
  @property(cc.Label)
  goldBubbleLb: cc.Label = null;
  _showType = 0;
  _cb = null;
  _inOperation = false;
  _is_force = 0;
  canClick = false;
  _init(e) {
    this._fadeIn();
    gameData.pauseGameAnim = true;
    this.canClick = true;
    this._inOperation = false;
    gameData.gameState == GameState.gameing && EventMgr.trigger(GameEventType.PAUSE_COUNT_DOWN);
    var t = Number(gameConfig.paramConfig.lucky_reward_rate_video_rate.para_value),
      o = PlayerDataSys.getCashBalanceWithUnit(gameData.levelupCash * t, ""),
      n = Number(gameConfig.paramConfig.show_red_bag.para_value);
    console.log("stepRewardPage:", e);
    this.label0.string = "" + o;
    this.label1.string = "" + n;
    this._showType = e.type;
    this._cb = e.cb;
    this._is_force = e.is_force;
    this.onlyLabel.string = `{"gkey_084":{"v1":"${PlayerDataSys.getCNCashNum(gameData.levelupCash)}"}}`;
    var a = Number(gameConfig.paramConfig.show_red_bag.para_value);
    this.goldBubbleLb.string = "" + a;
    SdkHelper.reportData("xc_reward_page");
  }
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      startOpacity: 0,
      endOpacity: 240
    });
  }
  onEnable() {
    super.onEnable.call(this);
    AudioManager.getInstance().playMusic("reward_dialog");
  }
  onlyBtnClick() {
    var e = this;
    if (!this._inOperation && this.canClick) {
      this.canClick = false;
      this._fadeOut();
      SdkHelper.reportData("xc_reward_only");
      this._inOperation = true;
      this.scheduleOnce(function () {
        e._inOperation = false;
      }, 0.5);
      if (this._is_force) {
        SdkHelper.reportData("force_xc_reward_only");
        this.openVideo(r.ONLY);
      } else GameSystem.onlyReward({
        type: VideoType.EliminateCount
      }).then(function () {
        SdkHelper.reportData("xc_reward_only_succ");
        e.close();
      });
    }
  }
  _onHide() {
    super._onHide.call(this);
  }
  openVideo(e) {
    var t = this,
      o = function o() {
        SdkHelper.showForceToast(`gkey_272`);
        AudioManager.getInstance().playNativeMusic("video_big_reward");
        var o = function (e, t) {
          var o = this;
          SdkHelper.showForceToast(`gkey_521`);
          GameSystem.videoReward({
            video_type: e,
            force_type: t,
            is_over: false
          }).then(function () {
            o.close();
          });
        }.bind(t, VideoType.EliminateCount, t._is_force);
        t._fadeOut();
        EventMgr.trigger(GameEventType.STOP_GAME_TIME);
        AdManager.getInstance().playVideoAd(function () {
          if (t._is_force) {
            e == r.ONLY && SdkHelper.reportData("force_xc_reward_video_succ");
          } else {
            SdkHelper.reportData("xc_reward_video_succ");
          }
          GameSystem.videoReward({
            video_type: VideoType.EliminateCount,
            force_type: t._is_force,
            is_over: true
          }).then(function () {
            t.close();
          });
        }, o, !!t._is_force);
      };
    if (PlayerDataSys.isOppoReviewer()) {
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "lookAdPage",
        data: {
          okCb: function () {
            o();
          },
          cancelCb: function () {
            t.canClick = true;
          }
        }
      });
    } else {
      o();
    }
  }
  _fadeIn() {
    super._fadeIn.call(this);
    this.canClick = true;
  }
  _fadeOut() {
    super._fadeOut.call(this);
    this.canClick = false;
  }
  allBtnClick() {
    var e = this;
    if (!this._inOperation && this.canClick) {
      SdkHelper.reportData("big_reward_all");
      SdkHelper.reportData("xc_reward_video");
      this._inOperation = true;
      this.scheduleOnce(function () {
        e._inOperation = false;
      }, 0.5);
      this.canClick = false;
      this.openVideo(r.All);
    }
  }
  close() {
    gameData.gameState == GameState.gameing && EventMgr.trigger(GameEventType.RESUME_COUNT_DOWN);
    this._hide();
    this._cb && this._cb();
  }
}