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
import { levelRewardCoin } from './config';
import SetNode2Top from './common/SetNode2Top';
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
  @property(cc.Node)
  fanbei_node: cc.Node = null;
  @property(cc.Label)
  goldNumLabel: cc.Label = null;
  @property(cc.Label)
  cashNumLabel: cc.Label = null;
  @property(cc.Label)
  onlyCashLabel: cc.Label = null;
  @property(cc.RichText)
  topTip: cc.RichText = null;
  @property(cc.Node)
  normalNode: cc.Node = null;
  @property(cc.Node)
  demoNode: cc.Node = null;
  @property(cc.Node)
  goldNode: cc.Node = null;
  @property(cc.Node)
  cashNode: cc.Node = null;
  @property(cc.Node)
  draw_node: cc.Node = null;
  @property(cc.Node)
  allBtnNode: cc.Node = null;
  @property(cc.Node)
  onlyBtnNode: cc.Node = null;
  @property(cc.RichText)
  tgxx_desc: cc.RichText = null;

  @property(cc.Label)
  dollarText: cc.Label = null;

  @property(cc.Node)
  beishuNode: cc.Node = null;
  @property(sp.Skeleton)
  skeleton: sp.Skeleton = null;
  canClick = false;
  _cb = null;
  _is_extract = false;
  _cash_num = 0;
  _inOperation = false;
  _showType = -1;
  _isforce = false;
  _isAddDiamond = false;
  currentTargetIndex = 0;
  @property(cc.Label)
  goldBubbleLb: cc.Label = null;
  @property(cc.Label)
  double_num: cc.Label = null;
  @property(cc.Node)
  freeNode: cc.Node = null;

  @property(cc.Node)
  dollarNode: cc.Node = null;

  @property(cc.Button)
  claimBtnNode: cc.Button = null;

  tg_gold_reward = 0;
  cash_reward = 0;
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
    this.fanbei_node.opacity = 0;
    this.allBtnNode.active = false;
    this.onlyBtnNode.active = false;
    this.cashNode.active = false;
    this.goldNode.active = false;
    SdkHelper.reportData("pass_game_level", {
      duration: gameData.gameTime
    });
    SdkHelper.reportData("pass_game_level_balance", {
      duration: gameData.gameTime,
      cashNum: PlayerDataSys.cashBalance,
      goldNum: PlayerDataSys.goldBalance
    });
    GlobalApp.GameMain.clearGameUI();
    this.freeNode.active = false;//gameData.gameLevel < 3;
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
    this.demoNode.active = false;//gameData.isOpenDemo;
    this.normalNode.active = false;//!gameData.isOpenDemo;
    this.allBtnNode.getChildByName("free").active = gameData.gameLevel < 3;
    AudioManager.getInstance().playMusic("level_pass");
    AudioManager.getInstance().playMusic("yanhua");
    if (gameData.gameLevel <= 2) {
      this.cashNumLabel.string = "" + PlayerDataSys.getCNCashNum(gameData.tg_reward);
      this.onlyCashLabel.string = `{"gkey_084":{"v1":"${PlayerDataSys.getCNCashNum(gameData.tg_reward)}"}}`;
    } else {
      this.cashNumLabel.string = "" + PlayerDataSys.getCNCashNum(gameData.levelupCash);
      this.onlyCashLabel.string = `{"gkey_084":{"v1":"${PlayerDataSys.getCNCashNum(gameData.levelupCash)}"}}`;
    }
    var o = Number(gameConfig.paramConfig.show_red_bag.para_value);
    this.goldBubbleLb.string = "" + o;
    this.goldNumLabel.string = "" + o;
    1 == gameData.gameLevel && GameSystem.updateGuideIno({
      novice_status: 4
    });
    this.skeleton.node.active = false;
    this.scheduleOnce(function () {
      t.playAnim();
    }, 0.2);
    this.showDesc();
    gameData.gameLevel > 2 && this.startLotteryAnimation(this.draw_node);
  }
  showDesc() {
    var e = "",
      t = gameData.lun_level;
    if (gameConfig.goldExtractLevel.includes(t)) {
      var o = EngineUtil.findIndex(gameConfig.goldExtractLevel, t);
      e = `{"gkey_516":{"v1":"${gameConfig.gold_extract_title[o]}"}}`;
    } else if (gameConfig.cashExtractLevel.includes(gameData.gameLevel)) {
      var n = EngineUtil.findIndex(gameConfig.cashExtractLevel, gameData.gameLevel),
        a = gameConfig.withdrawPercent3[n];
      e = `{"gkey_517":{"v1":"${PlayerDataSys.getCashBalance(a * PlayerDataSys.cashBalance)}"}}`;
      e = `{"gkey_518":{"v1":"${PlayerDataSys.getCNCashNum(10000 * a)}"}}`;
    } else {
      n = Math.floor(gameData.gameLevel / 5) + 2;
      var i = gameConfig.cashExtractLevel[n];
      a = gameConfig.withdrawPercent3[n];
      e = `{"gkey_519":{"v1":"${(i - gameData.gameLevel)}","v2":"${PlayerDataSys.getCashBalance(a * PlayerDataSys.cashBalance)}"}}`;
    }
    if (gameData.gameLevel <= 85) {
      this.tgxx_desc.string = "<outline color=#7F4800 width=2>" + e + "</outline>";
    } else {
      this.tgxx_desc.string = `gkey_520`;
    }
  }
  playAnim() {
    var e = this;
    this.cashNode.active = false;
    this.goldNode.active = false;
    this.skeleton.node.active = false;
    if (this.skeleton) {
      console.log("animName", "cx");
      this.skeleton.setAnimation(0, "cx", false);
      this.skeleton.setCompleteListener(null);
      this.skeleton.setCompleteListener(async function (t) {
        const __async_this = e;
        if (!("cx" != t.animation.name)) {
          __async_this.skeleton.setAnimation(0, "dj", true);
          __async_this.cashNode.active = false;//true;
          __async_this.goldNode.active = false;//true;
          gameData.gameLevel > 2 && (__async_this.fanbei_node.opacity = 255);
          await EngineUtil.sleep(200);
          __async_this.allBtnNode.active = false;//true;
          await EngineUtil.sleep(800);
          __async_this.onlyBtnNode.active = false;//true;
        }
        return;
      });
    }
  }

  onClickClaimn() {
    AudioManager.getInstance().playMusic("btntouch");
    var e = this;
    if(this._coinFlyOnClaim) return;
    this._coinFlyOnClaim = true;
    this.claimBtnNode.interactable = false;
    SetNode2Top.setTopZIndex(GlobalApp.GameMain.dollarNode);
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
        
        e.allBtnClick();
      }
    });
  }

  onEnable() {
    super.onEnable.call(this);
    console.log("on enable----------");
  }
  close(e = null) {
    AudioManager.getInstance().stopEffect("guide_5");
    this._hide();
    this._cb && this._cb();
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
      this.stopLotteryAnimation(this.draw_node);
      var o = function o() {
        SdkHelper.showForceToast(`gkey_272`);
        AudioManager.getInstance().playNativeMusic("video_big_reward");
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
    this.cashNode && (this.cashNode.active = true);
    this.goldNode && (this.goldNode.active = true);
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
      this.close();
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
            this.close();
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
    AudioManager.getInstance().stopEffect("guide_5");
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
      gameData.canCashExtract = t.is_extract;
      gameData.extractStatus = t.extract_status;
      e._hide();
      e._cb && e._cb();
    });
  }
  startLotteryAnimation(e) {
    if (e) {
      e.stopAllActions();
      this.beishuNode.children.forEach(function (e) {
        e.getChildByName("select").active = false;
      });
      this.lotteryRunning = true;
      this.currentSweepTime = 2.7;
      this.isLeftToRight = true;
      this.continueLotterySweep(e);
    } else console.warn("指针节点不存在");
  }
  continueLotterySweep(e) {
    var t = this;
    if (this.lotteryRunning) {
      if (this.currentSweepTime < 1.5) {
        this.currentSweepTime *= 1;
      } else {
        this.currentSweepTime = 1.5;
      }
      var o = this.isLeftToRight ? 270 : -270,
        n = cc.sequence(cc.moveTo(this.currentSweepTime, o, e.y), cc.callFunc(function () {
          t.isLeftToRight = !t.isLeftToRight;
          t.continueLotterySweep(e);
        }));
      e.runAction(n);
    }
  }
  stopLotteryAnimation(e) {
    if (e) {
      this.lotteryRunning = false;
      e.stopAllActions();
      for (var t = e.x, o = S, n = 0, a = Math.abs(t - o[0]), i = 1; i < o.length; i++) {
        var r = Math.abs(t - o[i]);
        if (r < a) {
          a = r;
          n = i;
        }
      }
      var c = o[n];
      console.log("当前位置: " + t + ", 最近的奖项索引: " + n + ", 目标位置: " + c);
      this.double_num.string = "" + E[n];
      this.cashNumLabel.string = "" + PlayerDataSys.getCNCashNum(gameData.levelupCash * E[n]);
      var s = [];
      s.push(cc.moveTo(0.5, c, e.y).easing(cc.easeOut(2)));
      s.push(cc.delayTime(0.1));
      s.push(cc.moveTo(0.1, c + 15, e.y));
      s.push(cc.moveTo(0.1, c - 8, e.y));
      s.push(cc.moveTo(0.1, c, e.y));
      this.currentTargetIndex = n;
      gameData.gameLevel <= 2 && (this.currentTargetIndex = 0);
      e.runAction(cc.sequence(s));
    } else console.warn("指针节点不存在");
  }
  update(e) {
    if (this.lotteryRunning && this.draw_node) {
      var t = this.draw_node.x;
      this.checkPosition(t);
      this.updateAttach(e);
    }
  }
  updateAttach() {}
  checkPosition(e) {
    for (var t = 0; t < S.length; t++) {
      var o = S[t];
      if (Math.abs(e - o) <= this.threshold) {
        this.onPositionMatch(t, o, e);
        break;
      }
    }
  }
  onPositionMatch(e) {
    this.highlightPosition(e);
  }
  highlightPosition(e) {
    this.double_num.string = "" + E[e];
    this.cashNumLabel.string = PlayerDataSys.getCashBalance(gameData.levelupCash * E[e]);
    this.beishuNode.children.forEach(function (t, o) {
      t.getChildByName("select").active = false;//e == o;
    });
  }
  playQuickLotteryAnimation(e, t, o = 6, n?) {
    if (e) {
      e.stopAllActions();
      for (var a = S[t], i = [], r = 0.12, c = true, s = 0; s < o; s++) {
        if (c) {
          i.push(cc.moveTo(r, 270, e.y));
        } else {
          i.push(cc.moveTo(r, -270, e.y));
        }
        c = !c;
        r *= 1.3;
      }
      var l = 1.2 * r;
      i.push(cc.moveTo(l, a, e.y));
      i.push(cc.callFunc(function () {
        console.log("抽奖完成，指针停在索引: " + t + ", X: " + a);
        n && n(t);
      }));
      e.runAction(cc.sequence(i));
    } else console.warn("指针节点不存在");
  }
}