import BasePage from './view/BasePage';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import SdkHelper from './framework/SdkHelper';
import AdManager from './framework/Platform/AdManager';
import { VideoType } from './framework/enum/AllEnum';
import GlobalApp from './common/GlobalApp';
import { gameConfig } from './data/GameConfig';
import EngineUtil from './framework/EngineUtil';
import { gameEnterModel, GameEnterModel, hasTujianUnlockForLevel, levelRewardCoin } from './config';
import PageMgr from './view/PageMgr';
import SetNode2Top from './common/SetNode2Top';
import GameUtils from './wordframe/GameUtils';
const {
  ccclass,
  property
} = cc._decorator;
enum s {
  All = 1,
  ONLY = 2,
}
var S = [-228, -118, -2, 115, 226];
var E = [10, 13, 15, 13, 10];
@ccclass
export default class settleMentPage extends BasePage {
  


  @property(cc.Label)
  dollarText: cc.Label = null;


  canClick = false;
  _cb = null;
  _is_extract = false;

  _inOperation = false;
  _showType = -1;
  _isforce = false;
  _isAddDiamond = false;
  currentTargetIndex = 0;

  @property(cc.Node)
  dollarNode: cc.Node = null;

  @property(cc.Button)
  claimBtnNode: cc.Button = null;

  tg_gold_reward = 0;
  lotteryRunning = false;
  currentSweepTime = 0;
  isLeftToRight = true;
  threshold = 5;
  // Claim button triggers local coin flying to main coin UI.
  _coinFlyOnClaim = false;
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      startOpacity: 0,
      endOpacity: 220
    });

    this._coinFlyOnClaim = false;
  }
  _init(e) {
    var t = this;
    this._fadeIn();
   

    this.claimBtnNode.interactable = true;

    SdkHelper.reportData("pass_game_level", {
      duration: gameData.gameTime
    });
    SdkHelper.reportData("pass_game_level_balance", {
      duration: gameData.gameTime,
      coinNum: PlayerDataSys.coinBalance,
      goldNum: PlayerDataSys.goldBalance
    });
    GlobalApp.GameMain.clearGameUI();
    this._inOperation = false;
    console.log("settlement page data------------", e);
    gameData.isPassLevel = true;
    // Fallback guarantee: once settlement is shown, this level's coin reward must
    // already be persisted in localStorage + GameData (without refreshing top UI yet).
    if (gameData.dollarRewardAppliedLevel !== gameData.gameLevel) {
      const add = Number(levelRewardCoin) || 0;
      gameData.dollarBalance = Number(gameData.dollarBalance || 0) + add;
      gameData.dollarLastAdd = add;
      gameData.dollarRewardAppliedLevel = gameData.gameLevel;
      EngineUtil.setLocalData("user_dollar_balance", String(gameData.dollarBalance));
      EngineUtil.setLocalData("user_dollar_reward_applied_level", String(gameData.dollarRewardAppliedLevel));
    } else if (!gameData.dollarLastAdd) {
      // Keep claim animation amount stable for this page show.
      gameData.dollarLastAdd = Number(levelRewardCoin) || 0;
    }

    this.dollarText.string = "" + levelRewardCoin;

    this._showType = VideoType.Pass;
    this._isforce = e.is_force;
    this._cb = e.cb;
    console.log("_isforce", this._isforce);
  
    AudioManager.getInstance().playMusic("level_pass");
    AudioManager.getInstance().playMusic("yanhua");
    var o = Number(gameConfig.paramConfig.show_red_bag.para_value);
    
    1 == gameData.gameLevel && GameSystem.updateGuideIno({
      novice_status: 4
    });
    // this.scheduleOnce(function () {
    //   t.playAnim();
    // }, 0.2);
  }


  onClickClaimn() {
    AudioManager.getInstance().playMusic("btntouch");
    var e = this;
    if(this._coinFlyOnClaim) return;
    this._coinFlyOnClaim = true;
    this.claimBtnNode.interactable = false;
    SetNode2Top.setTopZIndex(GlobalApp.GameMain.dollarNode);
     AudioManager.getInstance().playMusic("addbalance");
    EventMgr.trigger(GameEventType.SHOWEFFECT, {
      start: this.dollarNode.parent.convertToWorldSpaceAR(this.dollarNode.position),
      num: 4,
      type: 3,
      cb: function () {
        // Balance is already written on level-pass; claim only refreshes UI after fly.
        EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, gameData.dollarBalance);
        EventMgr.trigger(GameEventType.SHOWDOLLARBALANCEEFFECT, {
          type: 3,
          num: levelRewardCoin
        });
        // Do not call allBtnClick -> openVideo: on browser AdManager plays success immediately; on APK it waits for reward video (3~5s). Local coin claim does not need an ad.
        SdkHelper.reportData("big_reward_all");
        SetNode2Top.restoreNode(GlobalApp.GameMain.dollarNode);
        e._coinFlyOnClaim = false;
        e._finishSettlementOrTujian();
      }
    });
  }

  onEnable() {
    super.onEnable.call(this);
    console.log("on enable----------");
  }
  close(e = null) {
    this._hide();
    this._continueNextLevel();
  }
  _continueNextLevel() {
    const cb = this._cb;
    GameUtils.checkPopUp(true, () => {
      cb && cb();
    });
  }
  _finishSettlementOrTujian() {
    if (gameEnterModel === GameEnterModel.shenheModel && hasTujianUnlockForLevel(gameData.gameLevel)) {
      this._runTujianUnlockFlow();
      return;
    }
    this.close();
  }
  async _runTujianUnlockFlow() {
    this._hide();
    await PageMgr.showPage({
      name: "TujianUnlockPage"
    });
    await PageMgr.showPage({
      name: "TujianNodePage",
      data: {
        highlightUnlockLevel: Math.floor(Number(gameData.gameLevel) || 1)
      }
    });
    await PageMgr.showPage({
      name: "MainNodePage",
      data: {
        waitLevelClick: true
      }
    });
    this._continueNextLevel();
  }
  allBtnClick() {
    
    var e = this;
    if (!this._inOperation) {
      // btn_claim -> allBtnClick, used for the local coin system.
      this._coinFlyOnClaim = true;
      SdkHelper.reportData("big_reward_all");
      this._inOperation = true;
      this.scheduleOnce(function () {
        e._inOperation = false;
        e._coinFlyOnClaim = false;
      }, 0.5);
      this.openVideo(1);
    }
  }
  onlyBtnClick() {
    var e = this;
    SdkHelper.reportData("tg_reward_only");
    // Be safe: allow flying coins also on only-button path if it is used as claim.
    this._coinFlyOnClaim = true;
    if (this.canClick) if (this._isforce) {
      SdkHelper.reportData("tg_reward_only_force");
      this.openVideo(s.ONLY);
    } else if (!this._inOperation) {
      this._inOperation = true;
      this.scheduleOnce(function () {
        e._inOperation = false;
        e._coinFlyOnClaim = false;
      }, 0.5);
      AudioManager.getInstance().stopEffect("yanhua");
      if (1 == gameData.gameLevel) {
        AudioManager.getInstance().stopEffect("guide_1"); 
        AudioManager.getInstance().stopEffect("guide_2");
        AudioManager.getInstance().stopEffect("guide_3");
        AudioManager.getInstance().stopEffect("guide_4");
        SdkHelper.reportData("guide_5");
      }
      this._fadeOut();
      GameSystem.onlyReward({
        type: this._showType,
        isSettle: 1
      }).then(function () {
        EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE);
        EventMgr.trigger(GameEventType.UPDATE_BALANCE);
        SdkHelper.reportData("tg_reward_only_succ");
        e._flyCoinsThenClose();
      });
    }
  }
  openVideo(e) {
    var t = this;
    SdkHelper.reportData("tg_reward_video_click");
    if (this.canClick) {
      var o = function o() {
        // AudioManager.getInstance().playNativeMusic("video_big_reward");
        EventMgr.trigger(GameEventType.STOP_GAME_TIME);
        var o = function (t, o) {
            var n = this;
            if (this._isforce) {
              e == s.ONLY && SdkHelper.reportData("tg_reward_video_force_succ");
            } else {
              SdkHelper.reportData("tg_reward_video_succ");
            }
            GameSystem.videoReward({
              video_type: t,
              force_type: o,
              is_over: true,
              isSettle: 1,
              double_num: E[this.currentTargetIndex]
            }).then(function () {
              n._flyCoinsThenClose();
            });
          }.bind(t, t._showType, t._isforce, t._isAddDiamond),
          n = function (e, t) {
            var o = this;
            SdkHelper.showForceToast(`gkey_521`);
            GameSystem.videoReward({
              video_type: e,
              force_type: t,
              is_over: false,
              isSettle: 1,
              double_num: E[this.currentTargetIndex]
            }).then(function () {
              o._flyCoinsThenClose();
            });
          }.bind(t, t._showType, t._isforce, t._isAddDiamond);
        AdManager.getInstance().playVideoAd(o, n, t._isforce);
        t._fadeOut();
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
              t._coinFlyOnClaim = false;
            }
          }
        });
      } else {
        o();
      }
    }
  }
  _findNodeByName(root: any, name: string) {
    if (!root) return null;
    if (root.name === name) return root;
    if (!root.children) return null;
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i];
      const res = this._findNodeByName(child, name);
      if (res) return res;
    }
    return null;
  }
  _flyCoinsThenClose() {
    if (!this._coinFlyOnClaim) {
      this.close();
      return;
    }
    this._coinFlyOnClaim = false;

    // Ensure this page is visible when animating.
    this._fadeIn();
    this.canClick = false;

    const sceneRoot = cc.director.getScene();
    const coinTextNode = this._findNodeByName(sceneRoot, "coinText");
    const coin0 = this._findNodeByName(this.node, "coin0");
    const coin1 = this._findNodeByName(this.node, "coin1");
    const startNodes = [coin0, coin1].filter(Boolean);
    // Make sure the coin icons are visible; they might be disabled during _init().
   
    coin0 && (coin0.active = true);
    coin1 && (coin1.active = true);

    const add = Number(gameData.dollarLastAdd) || Number(levelRewardCoin) || 0;
    const shouldApply = gameData.dollarRewardAppliedLevel !== gameData.gameLevel;
    if (shouldApply && add > 0) {
      gameData.dollarBalance = Number(gameData.dollarBalance || 0) + add;
      gameData.dollarRewardAppliedLevel = gameData.gameLevel;
      EngineUtil.setLocalData("user_dollar_balance", String(gameData.dollarBalance));
      EngineUtil.setLocalData("user_dollar_reward_applied_level", String(gameData.dollarRewardAppliedLevel));
    }

    if (!coinTextNode || startNodes.length === 0) {
      // No animation possible; still refresh coin UI for claim.
      if (!coinTextNode) console.warn("settleMentPage: coinText node not found");
      if (startNodes.length === 0) console.warn("settleMentPage: coin0/coin1 nodes not found");
      EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, gameData.dollarBalance);
      this._finishSettlementOrTujian();
      return;
    }

    const endWorld = coinTextNode.convertToWorldSpaceAR(cc.v2(0, 0));
    let remain = startNodes.length;
    startNodes.forEach((node, idx) => {
      node.zIndex = 9999;
      node.opacity = 255;
      node.scale = 1;
      const parent = node.parent || this.node;
      const endLocal = parent.convertToNodeSpaceAR(endWorld);
      cc.tween(node)
        .delay(idx * 0.06)
        .to(0.6, {
          position: endLocal,
          scale: 0.35,
          opacity: 0
        }, {
          easing: "quadOut"
        })
        .call(() => {
          remain--;
          if (remain <= 0) {
            EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, gameData.dollarBalance);
            this._finishSettlementOrTujian();
          }
        })
        .start();
    });
  }
  _fadeIn() {
    super._fadeIn.call(this);
    this.canClick = true;
  }
  _fadeOut() {
    super._fadeOut.call(this);
    SetNode2Top.restoreNode(GlobalApp.GameMain.dollarNode);
    this.canClick = false;
  }
  _onHide() {
    super._onHide.call(this);
    AudioManager.getInstance().stopEffect("level_pass");
    AudioManager.getInstance().stopEffect("yanhua");
  }
  demoBtnClicked() {
    var e = this;
    GameSystem.submitGame({
      is_tg: 1,
      complete_flag: 1,
      skip: 1
    }).then(function (t) {
      gameData.tg_reward = t.tg_reward;
      gameData.canCoinExtract = t.is_extract;
      gameData.extractStatus = t.extract_status;
      e._hide();
      e._cb && e._cb();
    });
  }
}