import GameSystem from './system/GameSystem';
import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import GlobaldataMgr from './framework/data/GlobaldataMgr';
import { gameData, GameState } from './data/GameData';
import UserProp from './UserProp';
import GlobalApp from './common/GlobalApp';
import { FailedType, BgSkinType, PropType, VideoType } from './framework/enum/AllEnum';
import packagingProcess from './packagingProcess';
import ResourcesManager, { Res } from './common/ResourcesManager';
import DebugNode from './framework/debug/DebugNode';
import PageMgr from './view/PageMgr';
import AdSchedule from './common/AdSchedule';
import card from './prefab/card';
import touchCtrl from './touchCtrl';
import combo from './prefab/combo';
// import countDown from './countDown';
import { Constants } from './common/Constants';
import { gameConfig } from './data/GameConfig';
// import mainBtnGroupCtrl from './mainBtnGroupCtrl';
import { GameLevelPropConfig, getUnlockPropLevel, levelRewardCoin, MainConfig, ServerType } from './config';
import { applyFreePropRewardIfAny } from './freePropPage';
import GameUtils from './wordframe/GameUtils';
import LoadWord from './wordframe/LoadWord';
import { NativeUtils } from './wordframe/NativeUtils';
import { A } from './center/api';
import RandomUtil from './framework/Utils/RandomUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class GameMain extends cc.Component {

  @property(cc.Node)
  map_root: cc.Node = null;
  
  @property(cc.Button)
  backStepBtn: cc.Button = null;
  @property(cc.Prefab)
  passLevelEffect: cc.Prefab = null;
  @property(cc.Node)
  propContainer: cc.Node = null;
  @property({
    type: cc.Node,
    displayName: "游戏提示"
  })
  gameTips: cc.Node = [];

  @property({
    type: cc.Node,
    displayName: "背景"
  })
  bg: cc.Node = null;
  // @property({
  //   type: cc.Node,
  //   displayName: "通关动画"
  // })
  // levelStart: cc.Node = null;
  @property(cc.SpriteFrame)
  propSpriteFrame: cc.SpriteFrame = [];
  @property(cc.SpriteFrame)
  propNumIcons: cc.SpriteFrame = [];
  // @property({
  //   type: cc.Node,
  //   displayName: "倒计时节点"
    // })
    countTimeNode: cc.Node = null;
  @property({
    type: cc.Prefab,
    displayName: "麻将牌预制体"
  })
  mahjongPrefab: cc.Prefab = null;
  packagingProcess = null;
  @property(cc.Node)
  tipPropBubbleNode: cc.Node = null;
  @property(cc.Node)
  gridBgNode: cc.Node = null;
  @property(cc.Node)
  mahjongContainer: cc.Node = null;
  @property(cc.Graphics)
  mahjongGridLine: cc.Graphics = null;
  @property(cc.Graphics)
  operationGridLine: cc.Graphics = null;
  @property(cc.Node)
  comboNode: cc.Node = null;
    // @property(cc.Node)
    // freezeTipNode: cc.Node = null;
  @property(cc.Prefab)
  comboEffectPrefab: cc.Prefab = null;
  @property(cc.Prefab)
  comboEffect15Prefab: cc.Prefab = null;
  // @property(cc.Prefab)
  // passLevelEffectPrefab: cc.Prefab = null;
  // @property(mainBtnGroupCtrl)
  // mainBtnGroupCtrl: mainBtnGroupCtrl = null;
  @property(cc.Node)
  teachGuideNode: cc.Node = null;

  @property(sp.Skeleton)
  ruchangAni: sp.Skeleton = null;

  // Main scene coin UI (top-left in screenshot 1).
  _coinTextNode: cc.Node = null;
  _coinTextLabel: cc.Label = null;
  _gridRows = 0;
  _gridCols = 0;
  _cardGrid = [];
  _scaledCardWidth = 0;
  _scaledCardHeight = 0;
  _gapX = 0;
  _gapY = 0;
  _cardScale = 1;
  _touchCtrl = null;
  isGameing = false;
  _stime = 0;
  _gameTipIndex = 0;
  isHaveShowGame = false;
  /** 关卡前置弹窗 + Level 横幅结束后才允许生成牌面 */
  _mahjongSpawnAllowed = false;
  gameCountDownTime = 0;
  _tipTime = 8;
  _teachingStep = 0;
  /** isFlag 首次：飞币后先走完黄币手指 + 第 1 关操作教程，再走进关横幅 */
  _awaitNewHandTutorialComplete = false;
  /** 防止 RDM 教程结束回调重复/过早触发导致进关链丢失 */
  _newHandTutorialFinishHandled = false;
  /** startGame 延后的进关横幅链；教程结束后若 defer 未挂上则走此兜底 */
  _deferredNewHandPreLevelRunner: (() => void) | null = null;
  teachingStepCardList = [];
  _comboEffect = null;
  /** 本关累计消除对数，过关或弹产出后清零 */
  rewardAbMergeCount = 0;
  _rewardAbPopupPending = false;
  get gridRows() {
    return this._gridRows;
  }
  get gridCols() {
    return this._gridCols;
  }
  get cardGrid() {
    return this._cardGrid;
  }
  get scaledCardWidth() {
    return this._scaledCardWidth;
  }
  get scaledCardHeight() {
    return this._scaledCardHeight;
  }
  get gapX() {
    return this._gapX;
  }
  get gapY() {
    return this._gapY;
  }
  get cardScale() {
    return this._cardScale;
  }
  start() {
    this.playRuchangAni();
    GlobaldataMgr.auth_type && SdkHelper.ysdkLogin();

    AudioManager.getInstance().playMusic("bgm", true, true);
    GlobalApp.GameMain = this;
    if (MainConfig.curServerType !== ServerType.release) {
      var e = ResourcesManager.getInstance().getPrefab("DebugNode"),
        t = cc.instantiate(e);
      t.getComponent(DebugNode).init();
      cc.game.addPersistRootNode(t);
    }
  }

  playRuchangAni() {
    this.ruchangAni.node.active = true;
    this.ruchangAni.setAnimation(0, "guan", false);
    this.ruchangAni.setCompleteListener((event) => {
      if (event.animation.name === "guan") { 
        this.scheduleOnce(() => {
          LoadWord.instance.init();
        }, 0.5);
        this.scheduleOnce(() => {
          this.ruchangAni.setAnimation(0, "jingzhi", false);
        }, 0.85);
      } else if (event.animation.name === "jingzhi") {
        this.ruchangAni.setAnimation(0, "kai", false);
        // this.ruchangAni.node.active = false;
        // this.startGame(false, true);
        
      } else if (event.animation.name === "kai") {
        AudioManager.getInstance().playMusic("door_open");
        this.ruchangAni.node.active = false;
        this.startGame(false, true);
      } 
    });
  }

  onLoad() {
    cc.internal && cc.internal.inputManager && (cc.internal.inputManager._maxTouches = 1);
    gameData.gameUIRoot = this.node;
    GlobalApp.GameMain = this;
    this.comboNode.active = false;
    this.propContainer.active = false;
    this.teachGuideNode.active = false;
    this.packagingProcess = this.node.getComponent(packagingProcess);
    GlobalApp.AdSchedule = new cc.Node().addComponent(AdSchedule);
    GlobalApp.AdSchedule.node.parent = this.node;
    this.node.addComponent(UserProp);
    this._touchCtrl = this.node.getComponent(touchCtrl) || this.node.addComponent(touchCtrl);
    this._touchCtrl.init(this);
    GlobalApp.TouchCtrl = this._touchCtrl;
    this.updateGameSkin();
    this.clearGameUI();
    this.initCoinBalance();
    this.addEvent();
    
  }
  getCellW() {
    return this._scaledCardWidth + this._gapX;
  }
  getCellH() {
    return this._scaledCardHeight + this._gapY;
  }
  getMahjongContainer() {
    return this.mahjongContainer;
  }
  showYSDKToast() {
    PlayerDataSys.isYSDKLoginSuccess && EngineUtil.showCocosToast3(`gkey_308`);
  }
  addEvent() {
    EventMgr.listen(GameEventType.REBORN, this.rebornGame, this);
    EventMgr.listen(GameEventType.START_GAME, this.startGame, this);
    EventMgr.listen(GameEventType.SHOW_GAME_TIPS, this.showGameTips, this);
    EventMgr.listen(GameEventType.START_GAME_TIME, this.startUpdateGameTime, this);
    EventMgr.listen(GameEventType.STOP_GAME_TIME, this.stopUpdateGameTime, this);
    EventMgr.listen(GameEventType.SUBMIT, this.submitOperateInfo, this);
    EventMgr.listen(GameEventType.ADD_PROP_ANIM, this.addPropAnim, this);
    EventMgr.listen(GameEventType.CLOSE_GAME_TIPS, this.closeGameEvent, this);
    EventMgr.listen(GameEventType.SHOW_YSDK_TOAST, this.showYSDKToast, this);
    EventMgr.listen(GameEventType.REFRESH_PROP_COUNT, this.updatePorpCount, this);
    EventMgr.listen(GameEventType.GAME_OVER, this.gameOver, this);
    EventMgr.listen(GameEventType.SHOW_SETTLMENT_PAGE, this.showSettlementPage, this);
    EventMgr.listen(GameEventType.UPDATE_GAME_SKIN_DATA, this.updateGameSkin, this);
    EventMgr.listen(GameEventType.UPDATE_BACK_STEP_STATE, this.updateBackStepBtnState, this);
    EventMgr.listen(GameEventType.RESTART_GAME, this.reStartGame, this);
    EventMgr.listen(GameEventType.PASS_LEVEL_EFFECT, this.playPassLevelEffect, this);
    EventMgr.listen(GameEventType.UPDATE_COMBO_COUNT, this.updateComboCount, this);
    EventMgr.listen(GameEventType.UPDATE_DOLLARBALANCE, this.updateCoinTextUI, this);
    EventMgr.listen(GameEventType.FULL_SCREEN_CLICK, this.closePropTip, this);
    EventMgr.listen(GameEventType.FULL_SCREEN_MOVE, this.closePropTip, this);
    EventMgr.listen(GameEventType.FULL_SCREEN_CLICK, this.onEarlyAutoHintUserActivity, this);
    EventMgr.listen(GameEventType.FULL_SCREEN_MOVE, this.onEarlyAutoHintUserActivity, this);
  }
  removeEvent() {
    EventMgr.ignore(GameEventType.REBORN, this.rebornGame, this);
    EventMgr.ignore(GameEventType.START_GAME, this.startGame, this);
    EventMgr.ignore(GameEventType.SUBMIT, this.submitOperateInfo, this);
    EventMgr.ignore(GameEventType.ADD_PROP_ANIM, this.addPropAnim, this);
    EventMgr.ignore(GameEventType.SHOW_GAME_TIPS, this.showGameTips, this);
    EventMgr.ignore(GameEventType.START_GAME_TIME, this.startUpdateGameTime, this);
    EventMgr.ignore(GameEventType.STOP_GAME_TIME, this.stopUpdateGameTime, this);
    EventMgr.ignore(GameEventType.CLOSE_GAME_TIPS, this.closeGameEvent, this);
    EventMgr.ignore(GameEventType.SHOW_YSDK_TOAST, this.showYSDKToast, this);
    EventMgr.ignore(GameEventType.REFRESH_PROP_COUNT, this.updatePorpCount, this);
    EventMgr.ignore(GameEventType.CHECKOUT_GAME_OVER, this.checkoutGameOver, this);
    EventMgr.ignore(GameEventType.GAME_OVER, this.gameOver, this);
    EventMgr.ignore(GameEventType.RESTART_GAME, this.reStartGame, this);
    EventMgr.ignore(GameEventType.PASS_LEVEL_EFFECT, this.playPassLevelEffect, this);
    EventMgr.ignore(GameEventType.UPDATE_BACK_STEP_STATE, this.updateBackStepBtnState, this);
    EventMgr.ignore(GameEventType.UPDATE_DOLLARBALANCE, this.updateCoinTextUI, this);
    EventMgr.ignore(GameEventType.FULL_SCREEN_CLICK, this.closePropTip, this);
    EventMgr.ignore(GameEventType.FULL_SCREEN_MOVE, this.closePropTip, this);
    EventMgr.ignore(GameEventType.FULL_SCREEN_CLICK, this.onEarlyAutoHintUserActivity, this);
    EventMgr.ignore(GameEventType.FULL_SCREEN_MOVE, this.onEarlyAutoHintUserActivity, this);
  }
  isPropVisibleLevel(level = gameData.gameLevel): boolean {
    return level >= getUnlockPropLevel();
  }
  isEarlyAutoHintLevel(level = gameData.gameLevel): boolean {
    const levels = GameLevelPropConfig.earlyAutoHintLevels || [2, 3];
    return levels.indexOf(level) >= 0;
  }
  startEarlyAutoHintTimer() {
    this.stopEarlyAutoHintTimer();
    if (!this.isEarlyAutoHintLevel()) {
      return;
    }
    const delay = Math.max(0.1, Number(GameLevelPropConfig.earlyAutoHintIdleSeconds) || 3);
    this.scheduleOnce(this.onEarlyAutoHintTimeout, delay);
  }
  stopEarlyAutoHintTimer() {
    this.unschedule(this.onEarlyAutoHintTimeout);
  }
  resetEarlyAutoHintTimer() {
    if (!this.isEarlyAutoHintLevel() || gameData.gameState !== GameState.gameing) {
      return;
    }
    this.startEarlyAutoHintTimer();
  }
  onEarlyAutoHintUserActivity() {
    if (!this.isEarlyAutoHintLevel()) {
      return;
    }
    this.resetEarlyAutoHintTimer();
  }
  shouldShowEarlyAutoHint(): boolean {
    if (!this.isEarlyAutoHintLevel()) {
      return false;
    }
    if (gameData.gameState !== GameState.gameing) {
      return false;
    }
    if (!gameData.globalCanClick) {
      return false;
    }
    if (this.teachGuideNode && this.teachGuideNode.active) {
      return false;
    }
    if (this._rewardAbPopupPending) {
      return false;
    }
    const overlay = this.node.getChildByName("__operate_tip_overlay__");
    if (overlay && overlay.active) {
      return false;
    }
    return true;
  }
  onEarlyAutoHintTimeout() {
    if (!this.isEarlyAutoHintLevel() || gameData.gameState !== GameState.gameing) {
      return;
    }
    if (!this.shouldShowEarlyAutoHint()) {
      if (!gameData.globalCanClick || this.teachGuideNode && this.teachGuideNode.active || this._rewardAbPopupPending) {
        this.scheduleOnce(this.onEarlyAutoHintTimeout, 0.5);
      }
      return;
    }
    const touch = this._touchCtrl;
    const action = touch && typeof touch.getOperateTipAction === "function" ? touch.getOperateTipAction() : null;
    if (!action) {
      this.resetEarlyAutoHintTimer();
      return;
    }
    AudioManager.getInstance().playMusic("Prop_tip");
    EventMgr.trigger(GameEventType.TEACHING_OPERATE_TIP, action);
  }
  onDestroy() {
    this.removeEvent();
  }
  async startGame(e = false, t = false) {
    var o = this;
    console.log("startGame", e, t);
    if (!t) {
      await this.packagingProcess.excuteAfterLevel();
    }

    this.resetRewardAbMergeCount();
    this._stime = new Date().getTime();
    GameSystem.startGame(e ? 1 : 0).then(async function (t) {
      
      const __async_this = o;
      var o_local,
        n = __async_this;
      await __async_this.packagingProcess.excuteBeforeLevel(t.data);
      GameUtils.logLevelProgress("startGame_data_ready", { is_restart: !!e });
      EventMgr.trigger(GameEventType.UPDATE_LEVEL_INFO);
      cc.director.emit("resfLv");
      EventMgr.trigger(GameEventType.FRESH_RED_BUBBLE);
      o_local = function o() {
        n._mahjongSpawnAllowed = false;
        n.map_root.active = false;
        n.mahjongContainer.removeAllChildren();
        const roundForUi = gameData.roundMax > 1 ? gameData.roundId : undefined;
        const enteringLevel = GameUtils.getEnteringLevelId();
        let levelFlowStarted = false;
        const onLevelFlowDone = () => {
          GameUtils.logLevelProgress("onLevelFlowDone_initGameData");
          n._mahjongSpawnAllowed = true;
          EventMgr.trigger(GameEventType.UPDATE_LEVEL_INFO);
          cc.director.emit("resfLv");
          n.initGameData(e);
        };
        const showLevelBannerThenStart = () => {
          const sdk = LoadWord.FrameSDK;
          if (sdk && sdk.Panel && typeof sdk.showLevelStartBanner === "function") {
            sdk.showLevelStartBanner(onLevelFlowDone, enteringLevel);
          } else {
            // n.levelStart.active = true;
            // n.levelStart.getComponent(LevelStart).init({ cb: onLevelFlowDone });
          }
        };
        const beginLevelFlow = (needLevelBanner = false) => {
          if (levelFlowStarted) return;
          levelFlowStarted = true;
          GameUtils.logLevelProgress("beginLevelFlow", { needLevelBanner });
          SdkHelper.reportData("show_game_level");
          if (gameData.isOpenDemo) {
            n._mahjongSpawnAllowed = true;
            n.initGameData(e);
          } else if (needLevelBanner) {
            showLevelBannerThenStart();
          } else {
            onLevelFlowDone();
          }
        };
        if (gameData.skipNextPreLevelPopups) {
          gameData.skipNextPreLevelPopups = false;
          GameUtils.logLevelProgress("skip_beforeGameLevelStart_force");
          beginLevelFlow(true);
          return;
        }
        if (GameUtils.shouldSkipPreLevelPopups()) {
          GameUtils.logLevelProgress("skip_beforeGameLevelStart_same_level_round2", {
            enteringLevel,
            roundId: gameData.roundId,
            roundMax: gameData.roundMax
          });
          beginLevelFlow(true);
          return;
        }
        const loadWord = LoadWord.instance;
        if (loadWord && loadWord.shouldDeferPreLevelPopupsForNewHand()) {
          GameUtils.logLevelProgress("defer_beforeGameLevelStart_newHand", { enteringLevel });
          const deferredRunner = () => {
            const t0 = Date.now();
            const lv = GameUtils.getEnteringLevelId();
            GameUtils.beforeGameLevelStart(lv, roundForUi, null, () => {
              GameUtils.logLevelProgress("beforeGameLevelStart_done_after_newHand", {
                enteringLevel: lv,
                waitMs: Date.now() - t0
              });
              beginLevelFlow(false);
            });
          };
          n._deferredNewHandPreLevelRunner = deferredRunner;
          loadWord.setDeferredPreLevelBanners(deferredRunner);
          return;
        }
        const t0 = Date.now();
        GameUtils.beforeGameLevelStart(enteringLevel, roundForUi, null, () => {
          GameUtils.logLevelProgress("beforeGameLevelStart_done", {
            enteringLevel,
            waitMs: Date.now() - t0
          });
          beginLevelFlow(false);
        });
      };
      if (gameData.hasGradeChange() && !gameData.isOpenDemo) {
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "gradeBalancePage",
          data: {
            cb: o_local,
            gradeDis: gameData.gradeDis
          },
          option: {
            inQueue: true
          }
        });
      } else {
        o_local();
      }
      return;
    }).catch(function () {});
    return;
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

  initCoinBalance() {
    // Local-only coin system.
    const COIN_KEY = "user_dollar_balance";
    const COIN_REWARD_LEVEL_KEY = "user_dollar_reward_applied_level";
    const raw = EngineUtil.getLocalData(COIN_KEY);
    let coin = Number(raw);
    if (raw === "" || Number.isNaN(coin)) {
      coin = 100;
      EngineUtil.setLocalData(COIN_KEY, String(coin));
    }
    gameData.dollarBalance = coin < 0 ? 0 : Math.floor(coin);
    gameData.dollarLastAdd = 0;
    const appliedRaw = EngineUtil.getLocalData(COIN_REWARD_LEVEL_KEY);
    const appliedLevel = Number(appliedRaw);
    gameData.dollarRewardAppliedLevel = Number.isNaN(appliedLevel) ? 0 : Math.floor(appliedLevel);
    // Cache coin label node (may not exist in editor tests).
    this.updateCoinTextUI(gameData.dollarBalance);
  }

  updateCoinTextUI(v: any = null) {
    if (null != v && v !== "") {
      if (typeof v === "object" && v.end !== undefined) {
        gameData.dollarBalance = Math.floor(Number(v.end) || 0);
      } else {
        gameData.dollarBalance = Math.floor(Number(v) || 0);
      }
    }
    if (!this._coinTextNode) {
      this._coinTextNode = this._findNodeByName(this.node, "coinText");
      if (!this._coinTextNode) this._coinTextNode = this._findNodeByName(cc.director.getScene(), "coinText");
      this._coinTextLabel = this._coinTextNode ? this._coinTextNode.getComponent(cc.Label) : null;
    }
    if (this._coinTextLabel) {
      this._coinTextLabel.string = String(gameData.dollarBalance || 0);
    }
  }

  addCoinRewardForLevelPass() {
    const curLevel = gameData.gameLevel;
    if (gameData.dollarRewardAppliedLevel === curLevel) return;
    const add = Number(levelRewardCoin) || 0;
    gameData.dollarBalance = Number(gameData.dollarBalance || 0) + add;
    gameData.dollarLastAdd = add;
    gameData.dollarRewardAppliedLevel = curLevel;
    EngineUtil.setLocalData("user_dollar_balance", String(gameData.dollarBalance));
    EngineUtil.setLocalData("user_dollar_reward_applied_level", String(gameData.dollarRewardAppliedLevel));
    try {
      cc.director.emit("goldPlus", add, false);
    } catch (_e) {}
  }
  reStartGame() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("re_start_game");
    this.closeGameEvent();
    this.clearGameUI();
    this.startGame(true, true);
  }
  showCountTimeNode(e) {
    // this.countTimeNode.getComponent(countDown).showCountTimeNode(e);
  }
  startUpdateGameTime() {
    this.schedule(this.updateGameTime, 1);
  }
  stopUpdateGameTime() {
    this.unschedule(this.updateGameTime);
  }
  updateGameTime() {
    gameData.gameTime++;
  }
  playPassLevelEffect() {
    console.log("playPassLevelEffect");
    // var e = cc.instantiate(this.passLevelEffect);
    // e.parent = this.node;
    // e.active = true;
    // this.scheduleOnce(function () {
    //   e.removeFromParent(true);
    // }, 1.5);
  }
  async initGameData(e = false) {
    if (!this._mahjongSpawnAllowed) {
      GameUtils.logLevelProgress("initGameData_blocked_wait_level_banner");
      return;
    }
    GameUtils.logLevelProgress("initGameData", { is_restart: !!e });
    this.bg.zIndex = -1;
    this.map_root.active = true;
    this.isGameing = false;
    gameData.gameState = GameState.gameing;
    this.startUpdateGameTime();
    this.showCountTimeNode(gameData.countdownTime);
    EventMgr.trigger(GameEventType.UPDATE_WHEEL_BUBBLE);
    EventMgr.trigger(GameEventType.SHOW_BUBBLE);
    EventMgr.trigger(GameEventType.FRESH_GAME_LEVELINFO);
    1 != gameData.gameLevel && (gameData.globalCanClick = true);
    this.createMahjong();
    this.initMahjongGridLine();
    this.updatePorpCount();
    this.updateBackStepBtnState();
    await this.gameInitGuide();
    this.startEarlyAutoHintTimer();
    cc.director.emit("resfLv");
    return;
  }
  createMahjong() {
    AudioManager.getInstance().playMusic("Mahjong_Start");
    this.mahjongContainer.removeAllChildren();
    this._cardGrid = [];
    gameData.globalCanClick = false;
    this.scheduleOnce(function () {
      gameData.globalCanClick = true;
    }, 0.075 * this._gridRows);
    var e = gameData.getGridData();
    if (e) {
      var t = e.length,
        o = e[0].length;
      this._gridRows = t;
      this._gridCols = o;
      console.log("this.gridRows", this.gridRows, this.gridCols);
      if (6 == this.gridCols && 8 == this.gridRows) {
        this.gridBgNode.height = 980;
        this.map_root.y = 0;
      } else if (8 == this.gridCols && 10 == this.gridRows) {
        this.gridBgNode.height = 920;
        this.map_root.y = -30;
      } else if (10 == this.gridCols && 12 == this.gridRows) {
        this.gridBgNode.height = 885;
        this.map_root.y = -50;
      } else {
        this.gridBgNode.height = 750;
        this.map_root.y = -100;
      }
      var n = 686.38 / (116.48 * o + -2.5 * (o - 1)),
        a = 942 / (130 * t + -14 * (t - 1)),
        i = Math.min(n, a, 1),
        r = 116.48 * i,
        c = 130 * i,
        s = -2.5 * i,
        u = -14 * i;
      this._cardScale = i;
      this._scaledCardWidth = r;
      this._scaledCardHeight = c;
      this._gapX = s;
      this._gapY = u;
      for (var p = 0; p < t; p++) {
        this._cardGrid[p] = [];
        for (var d = 0; d < o; d++) this._cardGrid[p][d] = null;
      }
      for (p = 0; p < t; p++) for (d = 0; d < o; d++) if (null != e[p][d]) {
        var f = cc.instantiate(this.mahjongPrefab);
        f.parent = this.mahjongContainer;
        f.setScale(i);
        console.log("cardScale", i);
        var h = d * (r + s),
          g = -p * (c + u);
        f.setPosition(h, g);
        var y = f.getComponent(card);
        y.init(e[p][d]);
        this._cardGrid[p][d] = y;
      }
    }
  }
  initMahjongGridLine() {
    var e = this;
    if (this.mahjongGridLine) {
      this.mahjongGridLine.clear();
      this.mahjongGridLine.lineWidth = 1.5;
      this.mahjongGridLine.lineCap = cc.Graphics.LineCap.ROUND;
      this.mahjongGridLine.lineJoin = cc.Graphics.LineJoin.ROUND;
      var t = this._gridRows,
        o = this._gridCols;
      if (!(t <= 0 || o <= 0)) {
        for (var n = this._scaledCardWidth + this._gapX, a = 1.01 * this._scaledCardHeight + this._gapY, i = (o - 1) * n + this._scaledCardWidth, r = t * a, c = t >= 8 && o >= 6, s = function s(t, o, n, a) {
            for (var i = 0; i < 48; i++) {
              var r = i / 48,
                s = (i + 1) / 48,
                l = (p = 0.5 * (r + s), c ? p <= 0.5 ? Math.sin(p / 0.5 * Math.PI * 0.5) : p >= 0.5 ? Math.sin((1 - p) / 0.5 * Math.PI * 0.5) : 1 : 1),
                u = Math.round(255 * Math.max(0, Math.min(1, l)));
              e.mahjongGridLine.strokeColor = new cc.Color(17, 39, 35, u);
              e.mahjongGridLine.moveTo(t + (n - t) * r, o + (a - o) * r);
              e.mahjongGridLine.lineTo(t + (n - t) * s, o + (a - o) * s);
              e.mahjongGridLine.stroke();
            }
            var p;
          }, l = 1; l < o; l++) {
          var u = l * n;
          s(u, 0, u, -r);
        }
        for (var p = 1; p < t; p++) {
          var d = -p * a;
          s(0, d, i, d);
        }
        s(0, 0, i, 0);
        s(0, -r, i, -r);
        s(0, 0, 0, -r);
        s(i, 0, i, -r);
      }
    }
  }
  closePropTip() {
    this.isGameing && this.startShowTipNode();
  }
  closeGameEvent() {
    if (this.isHaveShowGame) {
      this.gameTips.forEach(function (e) {
        e && (e.active = false);
      });
      this.isHaveShowGame = false;
      EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
    }
    EventMgr.trigger(GameEventType.CLOSE_BOTTLE_FADE_TIP);
  }
  gameOver(e = {
    type: FailedType.Normal
  }) {
    console.log("gameOver", e.type);
    if (gameData.gameState == GameState.gameing) {
      console.log("gameOver", gameData.gameState);
      gameData.gameState = GameState.gameover;
      this.stopUpdateGameTime();
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "gameOverPage",
        data: e,
        option: {
          inQueue: true
        }
      });
    }
  }

  rewaedAbMergeThreshold = 8;
  
  // getRewardAbPopLevel() {
  //   const abPop = Number(this.getFrameConf().rewaedAbTotalTime)  || [5, 8];
  //   return abPop > 0 ? Math.floor(abPop) : 3;
  // }
  resetRewardAbMergeCount() {
    this.rewardAbMergeCount = 0;
    this._rewardAbPopupPending = false;
    this.unschedule(this._onRewardAbMergePopup);

    let conf =  LoadWord.instance.getWbConfigData();
    const cfgKey = NativeUtils.isFlag ? "basicConfig" : "partyplay";  //"basicConfig" : "shadow";
    let timeConf = conf?.[cfgKey]?.["FRAME_CONF"]?.rewaedAbTotalTime || [6, 8];
    // let timeConf = this.getFrameConf()?.rewaedAbTotalTime || [5, 8];
    this.rewaedAbMergeThreshold = RandomUtil.rangeInt(timeConf[0], timeConf[1]);
    CC_DEBUG && console.log("[rewardAB] merge count reset");
  }

  /** 与 FrameSDK.openABAward 一致：当前关卡 >= AbPop 才弹产出（Panel_Award_3） */
  isRewardAbPopupUnlocked(): boolean {
    const passLevel = GameUtils.getPassLevel();
    let abPop = 3;
    const conf = LoadWord.instance.getWbConfigData() as any;
    if (conf) {
      const v = conf.AbPop ?? conf.basicConfig?.FRAME_CONF?.AbPop ?? conf.partyplay?.FRAME_CONF?.AbPop;
      if (v != null) {
        abPop = Math.floor(Number(v)) || abPop;
      }
    }
    try {
      const FrameDataCls = cc.js.getClassByName("FrameData") as any;
      if (FrameDataCls?.FRAME_CONF?.AbPop != null) {
        abPop = Math.floor(Number(FrameDataCls.FRAME_CONF.AbPop)) || abPop;
      }
    } catch (_) {}
    return passLevel + 1 >= Math.max(1, abPop);
  }

  /**
   * 是否应在本次消除后弹产出窗：牌面未清空、未进入结算，且产出窗已解锁。
   * levelCleared 为 isTg() 快照；gameState 可能尚未切到 gameResult，需双重判断。
   */
  shouldShowRewardAbMergePopup(levelCleared: boolean): boolean {
    if (levelCleared || this.isTg()) {
      return false;
    }
    if (gameData.gameState !== GameState.gameing) {
      return false;
    }
    return this.isRewardAbPopupUnlocked();
  }

  _onRewardAbMergePopup() {
    if (!cc.isValid(this.node)) {
      return;
    }
    if (gameData.gameState === GameState.gameResult || this.isTg()) {
      this._rewardAbPopupPending = false;
      this.resetRewardAbMergeCount();
      if (gameData.gameState === GameState.gameing) {
        gameData.globalCanClick = true;
      }
      return;
    }
    if (!this.isRewardAbPopupUnlocked()) {
      this._rewardAbPopupPending = false;
      if (gameData.gameState === GameState.gameing) {
        gameData.globalCanClick = true;
      }
      return;
    }
    gameData.globalCanClick = false;
    GameUtils.rewardAB(() => {
      this._rewardAbPopupPending = false;
      this.resetRewardAbMergeCount();
      if (gameData.gameState === GameState.gameing) {
        gameData.globalCanClick = true;
      }
    });
  }

  /** 消除一对麻将 +1，累计超过阈值弹产出；本步若已通关则不弹产出，走结算 */
  dealMergeReward(levelCleared = false) {
    console.log("dealMergeReward。。。。。。。。。。。。。。。。。。。", levelCleared);
    if (!(NativeUtils.isFlag || NativeUtils.isFlag_wushi)) {
      return;
    }
    if (this._rewardAbPopupPending) {
      return;
    }
    this.rewardAbMergeCount++;
    if (this.rewardAbMergeCount < this.rewaedAbMergeThreshold) {
      return;
    }

    const remainingCards: card[] = [];
    this._cardGrid.forEach((row) => {
      row.forEach((c) => {
        if (c && c.node && c.node.isValid) {
          remainingCards.push(c);
        }
      });
    });
    if(remainingCards.length <= 2) {
      return;
    }
    console.log("remainingCards。。。。。。。。。。。。。。。。。。。", remainingCards.length);


    if (!this.shouldShowRewardAbMergePopup(levelCleared)) {
      if (levelCleared || this.isTg() || gameData.gameState !== GameState.gameing) {
        this.rewardAbMergeCount = 0;
      }
      return;
    }
    this._rewardAbPopupPending = true;
    this.unschedule(this._onRewardAbMergePopup);
    gameData.globalCanClick = false;
    this._onRewardAbMergePopup();
  }

  submitOperateInfo(e) {
    var t = this;
    console.log("submitOperateInfo", e);
    var o = e.xc_skip ? 1 : 0,
      n = this.isTg(),
      a = e.pos0,
      i = e.type,
      r = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    if (1 === i) {
      this.dealMergeReward(n);
    }
    if (gameData.gameState == GameState.gameing) {
      this.isGameing = true;
      this.onEarlyAutoHintUserActivity();
      this.startShowTipNode();
      gameData.curClearNum++;
      this.hideTipNode();
      if (gameData.curClearNum == gameConfig.getComboBubbleStep()) {
        gameData.curClearNum = 0;
        var c = cc.instantiate(this.comboEffect15Prefab);
        c.parent = this.node.getChildByName("effectNode") || this.node;
        c.active = true;
        var l = this.node.convertToNodeSpaceAR(e.pos0),
          d = cc.winSize.width,
          g = (cc.winSize.height, l.x);
        console.log("posX1", g, -d / 2 * 1 / 6);
        if (g < -d / 2 * 1 / 6) {
          g += 60;
          l.x = g;
        }
        console.log("posX2", g, d / 2 * 2 / 3);
        if (g > d / 2 * 2 / 3) {
          g -= 50;
          l.x = g;
        }
        c.position = l;
        // var y = c.getComponent(sp.Skeleton),
        //   m = Math.floor(3 * Math.random()) + 1;
        // y.setSkin("0" + m);
        // y.setCompleteListener(function () {
        //   c.destroy();
        // });
        this.scheduleOnce(() => {
          c.destroy();
        }, 1);
      }
      if (n) {
        gameData.gameState = GameState.gameResult;
        this.stopUpdateGameTime();
        this.resetRewardAbMergeCount();
      }
      var v = function v(e) {
        if (e.is_tg) {
          gameData.gameState = GameState.gameResult;
          t.startGame(false);
        }
        if (gameData.gameLevel > 2 && !PlayerDataSys.isOppoReviewer() && !gameData.isOpenDemo) {
          gameData.linkTimes++;
          console.log("linkTimes", gameData.linkTimes, PlayerDataSys.big_scroll_xc_count);
          if (gameData.linkTimes >= PlayerDataSys.big_scroll_xc_count) {
            gameData.linkTimes = 0;
            EventMgr.trigger(GameEventType.SHOW_TOPBIGBARRAGE);
          }
        }
      };
      if (gameData.isOpenDemo) {
        GameSystem.demoClearBlock(i, a, r, n, o, v);
      } else {
        GameSystem.clearBlock(i, a, r, n, o).then(function (e) {
          e && v(e);
        }).catch(function (e) {
          EngineUtil.log("clearBlock error", e);
        });
      }
    }
  }
  clearGameUI() {
    this.isGameing = false;
    // this.freezeTipNode.active = false;
    this.teachGuideNode.active = false;
    this.comboNode.active = false;
    // this.countTimeNode.active = false;
    this.map_root.active = false;
    this.tipPropBubbleNode.active = false;
    this.unschedule(this.showTipNode);
    this.stopEarlyAutoHintTimer();
    this.mahjongContainer.removeAllChildren();
  }
  checkoutGameOver() {}
  startShowTipNode() {
    this.tipPropBubbleNode.active = false;
    this.unschedule(this.showTipNode);
    this.scheduleOnce(this.showTipNode, this._tipTime);
  }
  showTipNode() {
    gameData.gameState == GameState.gameing && this.isPropVisibleLevel() && (this.tipPropBubbleNode.active = true);
  }
  hideTipNode() {
    this.tipPropBubbleNode.active = false;
    this.startShowTipNode();
  }
  rebornGame(e = FailedType.Normal) {
    gameData.gameState = GameState.gameing;
    if (e == FailedType.TIME_OUT) {
      gameData.globalCanClick = true;
      // this.countTimeNode.getComponent(countDown).showCountTimeNode(60);
      EventMgr.trigger(GameEventType.START_COUNT_DOWN);
    } else {
      gameData.globalCanClick = true;
      EventMgr.trigger(GameEventType.USER_RESHUFFLE_CARD, true);
    }
    SdkHelper.reportData("reborn", {
      level: gameData.id
    });
  }
  updateBackStepBtnState() {}
  updateGameSkin() {
    this.bg.getComponent(cc.Sprite).spriteFrame = Res.getBgSpriteFrame("bg" + gameData.gameSkinData.bgSkin.toString());
    this.gridBgNode.getComponent(cc.Sprite).spriteFrame = Res.getBgSpriteFrame("gridBg" + gameData.gameSkinData.bgSkin.toString());
  }
  updatePorpCount() {
    var e = this;
    if (gameData.openGameModule.propModule) {
      const unlockPropLevel = getUnlockPropLevel();
      if (gameData.gameLevel < unlockPropLevel) this.propContainer.active = false;else {
        this.propContainer.active = true;
        this.propContainer.children.forEach(function (t) {
          var o = cc.find("ui_you/numLb", t),
            n = cc.find("+", t),
            a = cc.find("ui_you", t);
          a.active = true;
          if ("reshuffleCard" == t.name) {
            t.active = gameData.gameLevel >= unlockPropLevel;
            o.getComponent(cc.Label).string = 0 == PlayerDataSys.reshuffleCardCount ? "+" : "" + PlayerDataSys.reshuffleCardCount;
            if (PlayerDataSys.reshuffleCardCount > 9) {
              a.getComponent(cc.Sprite).spriteFrame = e.propNumIcons[1];
            } else {
              a.getComponent(cc.Sprite).spriteFrame = e.propNumIcons[0];
            }
            n.active = 0 == PlayerDataSys.reshuffleCardCount;
            o.active = 0 != PlayerDataSys.reshuffleCardCount;
          } else if ("tipBtn" == t.name) {
            t.active = gameData.gameLevel >= unlockPropLevel;
            o.getComponent(cc.Label).string = 0 == PlayerDataSys.tipCardCount ? "+" : "" + PlayerDataSys.tipCardCount;
            n.active = 0 == PlayerDataSys.tipCardCount;
            o.active = 0 != PlayerDataSys.tipCardCount;
            if (PlayerDataSys.tipCardCount > 9) {
              a.getComponent(cc.Sprite).spriteFrame = e.propNumIcons[1];
            } else {
              a.getComponent(cc.Sprite).spriteFrame = e.propNumIcons[0];
            }
          } else if ("freeze" == t.name) {
            t.active = false;
            o.getComponent(cc.Label).string = 0 == PlayerDataSys.freezeCardCount ? "+" : "" + PlayerDataSys.freezeCardCount;
            n.active = 0 == PlayerDataSys.freezeCardCount;
            o.active = 0 != PlayerDataSys.freezeCardCount;
            if (PlayerDataSys.freezeCardCount > 9) {
              a.getComponent(cc.Sprite).spriteFrame = e.propNumIcons[1];
            } else {
              a.getComponent(cc.Sprite).spriteFrame = e.propNumIcons[0];
            }
          }
        });
      }
    } else this.propContainer.active = false;
  }
  showGameTips(e) {
    this.gameTips.forEach(function (e) {
      e && (e.active = false);
    });
    this.gameTips[e].active = true;
  }
  addPropAnim(e) {
    for (var t = e.props, o = 0; o < t.length; o++) {
      var n = t[o],
        a = void 0,
        i = null,
        r = new cc.Node();
      r.scale = 0.7;
      r.zIndex = 0;
      r.addComponent(cc.Sprite);
      r.parent = this.node;
      r.position = cc.Vec3.ZERO;
      if (n.code == PropType.tipCard) {
        var c = (i = this.propContainer.getChildByName("tipBtn")).parent.convertToWorldSpaceAR(i.position);
        a = this.node.convertToNodeSpaceAR(c);
        r.getComponent(cc.Sprite).spriteFrame = this.propSpriteFrame[0];
      } else if (n.code == PropType.reshuffleCard) {
        i = this.propContainer.getChildByName("reshuffleCard");
        r.getComponent(cc.Sprite).spriteFrame = this.propSpriteFrame[1];
        c = i.parent.convertToWorldSpaceAR(i.position);
        a = this.node.convertToNodeSpaceAR(c);
      } else if (n.code == PropType.freezeCard) {
        i = this.propContainer.getChildByName("freeze");
        r.getComponent(cc.Sprite).spriteFrame = this.propSpriteFrame[2];
        c = i.parent.convertToWorldSpaceAR(i.position);
        a = this.node.convertToNodeSpaceAR(c);
      }
      a.y += 40;
      cc.tween(r).to(0.5, {
        position: a,
        scale: 0.4
      }, {
        easing: "quadOut"
      }).removeSelf().start();
      cc.tween(i).delay(0.4).to(0.1, {
        scale: 1.1
      }).to(0.1, {
        scale: 1
      }).to(0.1, {
        scale: 0.9
      }).to(0.1, {
        scale: 1
      }).start();
    }
    AudioManager.getInstance().playMusic("xiu");
  }
  passClick() {
    var e = this;
    this.closeGameEvent();
    this.resetRewardAbMergeCount();
    gameData.gameState = GameState.gameResult;
    GameSystem.submitGame({
      is_tg: 1,
      complete_flag: 1,
      skip: 1
    }).then(function (t) {
      GameUtils.logLevelProgress("passClick_submit_ok");
      EngineUtil.reconnectSuc();
      SdkHelper.reportData("pass_game_level", {
        duration: gameData.gameTime
      });
      SdkHelper.reportData("pass_game_level_balance", {
        duration: gameData.gameTime,
        cionNum: PlayerDataSys.coinBalance,
        goldNum: PlayerDataSys.goldBalance
      });
      var o = t.force_flag;
      gameData.tg_reward = t.tg_reward;
      gameData.canCoinExtract = t.is_extract;
      gameData.extractStatus = t.extract_status;
      // Local-only coin reward is applied after settlement "claim".
      // Store pending add amount now, so settleMentPage can animate + update coin UI.
      gameData.dollarLastAdd = Number(levelRewardCoin) || 0;
      var n = {
        type: VideoType.Pass,
        is_force: o,
        cb: function () {
          gameData.skipNextPreLevelPopups = true;
          EventMgr.trigger(GameEventType.START_GAME);
        }
      };
      if (gameData.isOpenDemo) EventMgr.trigger(GameEventType.START_GAME);else {
        EventMgr.trigger(GameEventType.PASS_LEVEL_EFFECT);
        setTimeout(function () {
          e.showSettlementPage(n);
        }, 500);
      }
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.passClick();
      });
    });
  }
  async gameInitGuide(e = false) {
    var e, t, o, n, a, i, r, l;
    if (!(1 != gameData.gameLevel)) {
      await EngineUtil.sleep(1000);
      this.showNextTeachingStep();
    }
    t = JSON.parse(cc.sys.localStorage.getItem("unLockPropGuide")) || [];
    const unlockPropLevel = getUnlockPropLevel();
    const levelKey = String(gameData.gameLevel);
    // 到达配置关卡一次性解锁「刷新 + 提示」两道具；不弹 unlockPropPage、不走道具教程
    if (gameData.gameLevel === unlockPropLevel && -1 === t.indexOf(levelKey)) {
      PlayerDataSys.reshuffleCardCount = Number(GameLevelPropConfig.unlockReshuffleCount) || 1;
      PlayerDataSys.tipCardCount = Number(GameLevelPropConfig.unlockTipCount) || 3;
      if (gameData.gameLevel === 4) {
        PlayerDataSys.freezeCardCount = 0;
      }
      t.push(levelKey);
      cc.sys.localStorage.setItem("unLockPropGuide", JSON.stringify(t));
      EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
      await EngineUtil.sleep(500);
      applyFreePropRewardIfAny();
      EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
      return;
    }
    e = null;
    4 == gameData.gameLevel && unlockPropLevel !== 4 && (e = {
      type: PropType.freezeCard,
      level: gameData.gameLevel
    });
    if (!(!e || -1 != t.indexOf(gameData.gameLevel.toString()))) {
      e.type == PropType.freezeCard && (PlayerDataSys.freezeCardCount = 0);
      EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
      await EngineUtil.sleep(500);
      if (e.type == PropType.freezeCard) {
        // Freeze prop: do not show unlock UI; also mark as unlocked so it won't retry.
        t.push(gameData.gameLevel.toString());
        cc.sys.localStorage.setItem("unLockPropGuide", JSON.stringify(t));
        applyFreePropRewardIfAny();
        EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
        return;
      }
    }
    // Do not auto-open atlas exchange related popups (tujianWdPage / tujianAutoWdPage).
    applyFreePropRewardIfAny();
    EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
    return;
  }
  showNextTeachingStep() {
    for (var e = ["guide/teachGuide_1", "guide/teachGuide_2", "guide/teachGuide_3", "guide/teachGuide_4", "guide/teachGuide_5"], t = 0; t < e.length; t++);
    this._teachingStep++;
    SdkHelper.reportData("guide_" + this._teachingStep);
    var o = null,
      n = null,
      a = null,
      i = null,
      r = "";
    e[this._teachingStep - 1];
    switch (this._teachingStep) {
      case 1:
        n = {
          a: (o = this.getCardByType(31))[0],
          b: o[1],
          kind: "eliminate",
          isAdjacent: true
        };
        this.teachingStepCardList = o.map(function (e) {
          return e.cardData.id;
        });
        r = `gkey_309`;
        break;
      case 2:
        n = {
          a: (o = this.getCardByType(32))[0],
          b: o[1],
          kind: "eliminate",
          isAdjacent: false
        };
        this.teachingStepCardList = o.map(function (e) {
          return e.cardData.id;
        });
        r = `gkey_313`;
        break;
      case 3:
        n = {
          elimA: a = this.getCardByPos(1, 0),
          elimB: i = this.getCardByPos(0, 2),
          kind: "move",
          groupCards: [],
          direction: "right",
          steps: 2,
          toCol: 2,
          toRow: 1,
          startCard: a
        };
        this.teachingStepCardList = [a.cardData.id, i.cardData.id];
        r = `gkey_310`;
        break;
      case 4:
        a = this.getCardByPos(4, 3);
        i = this.getCardByPos(3, 1);
        var c = this.getCardByPos(3, 3);
        n = {
          elimA: a,
          elimB: i,
          kind: "move",
          groupCards: [a, c],
          direction: "up",
          steps: 1,
          toCol: 3,
          toRow: 3,
          startCard: a
        };
        this.teachingStepCardList = [a.cardData.id, i.cardData.id, c.cardData.id];
        r = `gkey_311`;
        break;
      case 5:
        n = {
          elimA: a = this.getCardByPos(0, 1),
          elimB: i = this.getCardByPos(3, 4),
          kind: "move",
          groupCards: [],
          direction: "right",
          steps: 3,
          toCol: 4,
          toRow: 0,
          startCard: a
        };
        this.teachingStepCardList = [a.cardData.id, i.cardData.id];
        r = `gkey_312`;
    }
    if (n) {
      this.teachGuideNode.active = true;
      LoadWord.FrameSDK.logGameEvent('sdymjmatch_game_new', {
        object_action: 'show',
        object_name: 'new_7',
      }, true);
      this.teachGuideNode.getChildByPath("gborder/tip").getComponent(cc.RichText).string = r;
      EventMgr.trigger(GameEventType.TEACHING_OPERATE_TIP, n);
    }
  }
  hideTeachingGuide() {
    this.teachGuideNode.active = false;
  }

  private isRdmLevelPanelOpen(): boolean {
    const sdk = LoadWord.FrameSDK;
    const panel = sdk?.Panel;
    if (!panel || !cc.isValid(panel)) {
      return false;
    }
    for (let i = 0; i < panel.childrenCount; i++) {
      const child = panel.children[i];
      if (child && cc.isValid(child) && child.activeInHierarchy && child.getComponent("RDM_Level")) {
        return true;
      }
    }
    return false;
  }

  /**
   * 飞币结束后：黄币手指 → RDM_Level 内教程 → 点返回关闭后再走进关横幅并发牌。
   * 与 shouldDefer 解耦，避免 newHand 停留过久导致 startGame 未挂上 defer 后流程卡死。
   */
  beginNewHandTutorialBeforeBanners() {
    const loadWord = LoadWord.instance;
    const FrameDataCls: any = cc.js.getClassByName("FrameData");
    const getSaveGuideInedx = () => FrameDataCls?.saveData?.guideInedx ?? 0;

    if (!loadWord) {
      return;
    }

    if (getSaveGuideInedx() >= 3 && !this.isRdmLevelPanelOpen()) {
      loadWord.completeNewHandRewardFlow(true);
      return;
    }

    loadWord.markAwaitNewHandRewardFlow();
    this._newHandTutorialFinishHandled = false;
    this._awaitNewHandTutorialComplete = true;
    GameUtils.logLevelProgress("beginNewHandTutorialBeforeBanners");

    const waitRdmTutorialDone = () => {
      cc.director.once("NEW_HAND_RDM_TUTORIAL_DONE", () => {
        this.finishNewHandTutorialBeforeBanners();
      }, this);
    };

    if (this.isRdmLevelPanelOpen()) {
      waitRdmTutorialDone();
      return;
    }

    const FrameCls: any = cc.js.getClassByName("Frame");
    const frameIns = FrameCls?.ins;

    if (getSaveGuideInedx() > 0) {
      waitRdmTutorialDone();
      return;
    }

    if (frameIns?.guide?.active) {
      cc.director.once("NEW_HAND_YELLOW_GUIDE_DONE", waitRdmTutorialDone, this);
      return;
    }

    waitRdmTutorialDone();
  }

  /** 教程结束后恢复 defer 进关链；defer 未挂上时（竞态）用缓存 runner 或重走进关兜底 */
  runDeferredNewHandPreLevelFlow() {
    const run = this._deferredNewHandPreLevelRunner;
    this._deferredNewHandPreLevelRunner = null;
    if (run) {
      GameUtils.logLevelProgress("runDeferredNewHandPreLevelFlow");
      run();
      return;
    }
    if (!this._mahjongSpawnAllowed) {
      GameUtils.logLevelProgress("runDeferredNewHandPreLevelFlow_fallback_startGame");
      this.startGame(false, true);
    }
  }

  /** LoadWord 在 RDM 教程结束事件上的兜底入口 */
  onNewHandRdmTutorialClosed() {
    this.finishNewHandTutorialBeforeBanners();
  }

  private finishNewHandTutorialBeforeBanners() {
    if (this._newHandTutorialFinishHandled) {
      return;
    }
    if (!this._awaitNewHandTutorialComplete && this._mahjongSpawnAllowed) {
      return;
    }
    this._newHandTutorialFinishHandled = true;
    this._awaitNewHandTutorialComplete = false;
    GameUtils.logLevelProgress("finishNewHandTutorialBeforeBanners", {
      mahjongSpawnAllowed: this._mahjongSpawnAllowed
    });
    try {
      const FrameCls: any = cc.js.getClassByName("Frame");
      FrameCls?.ins?.setGuideShow(false);
    } catch (_) {}
    if (this._mahjongSpawnAllowed) {
      return;
    }
    const loadWord = LoadWord.instance;
    loadWord?.markAwaitNewHandRewardFlow();
    loadWord?.completeNewHandRewardFlow(true);
  }
  showFreezeTip() {
    var e = this;
    //   t = this.freezeTipNode.getComponent(sp.Skeleton);
    // this.freezeTipNode.active = true;
    // t.setAnimation(0, "show", false);
    // t.setCompleteListener(null);
    // t.setCompleteListener(function (o) {
    //   if ("show" == o.animation.name) {
    //     t.setAnimation(0, "idle", true);
    //   } else {
    //     "end" == o.animation.name && (e.freezeTipNode.active = false);
    //   }
    // });
    // this.countTimeNode.getComponent(countDown).pauseCountDown();
    // this.scheduleOnce(function () {
    //   t.setAnimation(0, "end", false);
    //   gameData.isUseFreeze = false;
    //   // e.countTimeNode.getComponent(countDown).resumeCountDown();
    // }, Constants.FreezeTime);
  }
  /** 原 settleMentPage._init 中的通关清场与本地金币入账（与弹窗解耦，供 Panel_Award_6 使用） */
  prepareMahjongPassSettlement() {
    this.resetRewardAbMergeCount();
    this.clearGameUI();
    gameData.isPassLevel = true;
    if (gameData.dollarRewardAppliedLevel !== gameData.gameLevel) {
      const add = Number(levelRewardCoin) || 0;
      gameData.dollarBalance = Number(gameData.dollarBalance || 0) + add;
      gameData.dollarLastAdd = add;
      gameData.dollarRewardAppliedLevel = gameData.gameLevel;
      EngineUtil.setLocalData("user_dollar_balance", String(gameData.dollarBalance));
      EngineUtil.setLocalData("user_dollar_reward_applied_level", String(gameData.dollarRewardAppliedLevel));
    } else if (!gameData.dollarLastAdd) {
      gameData.dollarLastAdd = Number(levelRewardCoin) || 0;
    }
    if (1 == gameData.gameLevel) {
      GameSystem.updateGuideIno({
        novice_status: 4
      });
    }
    AudioManager.getInstance().playMusic("level_pass");
    AudioManager.getInstance().playMusic("yanhua");
  }
  async showSettlementPage(e) {
    // var t;
    // (t = cc.instantiate(this.passLevelEffectPrefab)).parent = this.node;
    // t.active = true;
    // this.scheduleOnce(function () {
    //   t.removeFromParent(true);
    // }, 2);
    await EngineUtil.sleep(500);
    this.prepareMahjongPassSettlement();
    const sdk = LoadWord.FrameSDK;
    if (sdk && typeof sdk.setPostLevelSettlementActive === "function") {
      sdk.setPostLevelSettlementActive(true);
    }
    sdk.openWindow("Panel_Award_6", {
      closeCB: () => {
        if (sdk && typeof sdk.setPostLevelSettlementActive === "function") {
          sdk.setPostLevelSettlementActive(false);
        }
        GameUtils.checkPopUp(true, () => {
          e.cb && e.cb();
        });
      },
      mahjongSettlement: true
    });
    return;
  }
  updateComboCount() {
    var e = this;
    if (gameData.openGameModule.comboModule && 1 != gameData.gameLevel) {
      gameData.comboCount++;
      this.comboNode.active = true;
      this.comboNode.getComponent(combo).updateCombo();
      if (gameData.comboCount >= 5) {
        // console.log("updateComboCount.................: 11111");
        NativeUtils.vibrate(100);
        if (!this._comboEffect) {
          this._comboEffect = cc.instantiate(this.comboEffectPrefab);
          this._comboEffect.parent = this.node;
        }
        this._comboEffect.active = true;
        var t = this._comboEffect.getChildByName("left").getComponent(sp.Skeleton),
          o = this._comboEffect.getChildByName("right").getComponent(sp.Skeleton),
          n = 5,
          a = "",
          i = "start1";
        if (gameData.comboCount <= 7) {
          n = 5;
          AudioManager.instance.playMusic("combo5");
        } else if (gameData.comboCount <= 8) {
          n = 10;
          a = "note_1";
          i = "start2";
        } else if (9 == gameData.comboCount) {
          n = 15;
          a = "note_2";
          i = "start2";
        } else {
          n = 20;
          a = "note_" + Math.min(3 + gameData.comboCount - 9, 10);
          i = "start3";
        }
        gameData.comboCount, gameConfig.getComboBubbleStep();
        t.setAnimation(0, i, false);
        o.setAnimation(0, i, false);
        t.setCompleteListener(function () {
          t.setCompleteListener(null);
          e._comboEffect.active = false;
        });
        this._cardGrid.forEach(function (e) {
          e.forEach(function (e) {
            e && e.shakeAnim(n);
          });
        });
        "" != a && AudioManager.getInstance().playMusic("note/" + a);
      }
    }
  }
  isTg() {
    var e = true;
    this._cardGrid.forEach(function (t) {
      t.forEach(function (t) {
        t && (e = false);
      });
    });
    return e;
  }
  getCardByType(e) {
    var t = [];
    this._cardGrid.forEach(function (o) {
      o.forEach(function (o) {
        o && o.getComponent(card).cardData.type == e && t.push(o);
      });
    });
    return t;
  }
  getCardByPos(e, t) {
    for (var o = null, n = 0; n < this._cardGrid.length; n++) for (var a = 0; a < this._cardGrid[n].length; a++) this._cardGrid[n][a] && this._cardGrid[n][a].getComponent(card).cardData.x == t && this._cardGrid[n][a].getComponent(card).cardData.y == e && (o = this._cardGrid[n][a].getComponent(card));
    return o;
  }
}