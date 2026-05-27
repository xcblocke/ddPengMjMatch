import GameUtils from "./GameUtils";
import { NativeUtils } from "./NativeUtils";
import { gameData } from "../data/GameData";
import AudioManager from "../framework/controller/AudioManager";
import GlobalApp from "../common/GlobalApp";
import { A } from "../center/api";

/** 与 assets/view/loading.ts 中加载的主场景名一致 */
const MAIN_SCENE = "mainScene";
const LOADING_SCENE = "loadingScene";
const WORD_NEW_HAND_BUNDLE = "WordNewHand";
const WORD_NEW_HAND_PREFAB = "newHand";

export default class LoadWord {
  /** loading 阶段预加载的 WordNewHand 分包与 newHand 预制体 */
  static wordNewHandBundle: cc.AssetManager.Bundle = null;
  static preloadedNewHandPrefab: cc.Prefab = null;

  /**
   * loading 阶段预加载 WordNewHand/newHand
   * @param onProgress 0~1（bundle 占 0.3，prefab 占 0.7）
   */
  static preloadNewHand(onProgress?: (p: number) => void): Promise<void> {
    return new Promise(function (resolve) {
      var report = function (p: number) {
        onProgress && onProgress(Math.max(0, Math.min(1, p)));
      };
      if (LoadWord.preloadedNewHandPrefab) {
        report(1);
        resolve();
        return;
      }
      var bundle = LoadWord.wordNewHandBundle || cc.assetManager.getBundle(WORD_NEW_HAND_BUNDLE);
      if (bundle) {
        LoadWord.wordNewHandBundle = bundle;
        report(0.3);
        bundle.load(WORD_NEW_HAND_PREFAB, cc.Prefab, function (finished, total, _item) {
          if (total > 0) {
            report(0.3 + 0.7 * finished / total);
          }
        }, function (err, prefab) {
          if (err) {
            console.error("preload newHand prefab failed:", err);
            report(1);
            resolve();
            return;
          }
          LoadWord.preloadedNewHandPrefab = prefab as cc.Prefab;
          report(1);
          resolve();
        });
        return;
      }
      cc.assetManager.loadBundle(WORD_NEW_HAND_BUNDLE, function (err, loadedBundle) {
        if (err) {
          console.error("preload WordNewHand bundle failed:", err);
          report(1);
          resolve();
          return;
        }
        LoadWord.wordNewHandBundle = loadedBundle;
        report(0.3);
        loadedBundle.load(WORD_NEW_HAND_PREFAB, cc.Prefab, function (finished, total, _item) {
          if (total > 0) {
            report(0.3 + 0.7 * finished / total);
          }
        }, function (loadErr, prefab) {
          if (loadErr) {
            console.error("preload newHand prefab failed:", loadErr);
            report(1);
            resolve();
            return;
          }
          LoadWord.preloadedNewHandPrefab = prefab as cc.Prefab;
          report(1);
          resolve();
        });
      });
    });
  }

  /** 实例化后释放 loading 阶段缓存的 newHand 预制体资源（场景节点仍持有引用） */
  static releasePreloadedNewHandAsset() {
    if (!LoadWord.preloadedNewHandPrefab) return;
    var bundle = LoadWord.wordNewHandBundle;
    try {
      LoadWord.preloadedNewHandPrefab.decRef();
      if (bundle) {
        bundle.release(WORD_NEW_HAND_PREFAB, cc.Prefab);
      }
    } catch (err) {
      console.warn("releasePreloadedNewHandAsset", err);
    }
    LoadWord.preloadedNewHandPrefab = null;
  }

  /** 销毁新手节点并释放 WordNewHand 分包缓存 */
  static releaseWordNewHandBundle(removeBundle = false) {
    LoadWord.releasePreloadedNewHandAsset();
    var bundle = LoadWord.wordNewHandBundle || cc.assetManager.getBundle(WORD_NEW_HAND_BUNDLE);
    if (bundle) {
      try {
        bundle.release(WORD_NEW_HAND_PREFAB, cc.Prefab);
        if (removeBundle) {
          cc.assetManager.removeBundle(bundle);
        }
      } catch (err) {
        console.warn("releaseWordNewHandBundle", err);
      }
    }
    LoadWord.wordNewHandBundle = null;
  }

  static releaseWordFrameBundle(removeBundle = false) {
    var bundle = cc.assetManager.getBundle("WordFrame");
    if (!bundle) return;
    try {
      bundle.release("Frame", cc.Prefab);
      if (removeBundle) {
        cc.assetManager.removeBundle(bundle);
      }
    } catch (err) {
      console.warn("releaseWordFrameBundle", err);
    }
  }

  /**
   * 重新进入 loadingScene 时调用：清 WordFrame / WordNewHand，避免重复占用内存。
   */
  static releaseForLoadingRestart() {
    var inst = LoadWord.instance;
    inst.releaseNewHandRuntime(true);
    inst.releaseWordFrameRuntime();
    LoadWord.releaseWordNewHandBundle(true);
    LoadWord.releaseWordFrameBundle(true);
    inst.isInit = false;
    inst.initCallback = null;
    inst._awaitNewHandRewardFlow = false;
    inst._deferredPreLevelBanners = null;
    inst.pendingHandSceneListener = false;
  }

  private static _instance: LoadWord = null;
  static get instance(): LoadWord {
    return LoadWord._instance || (LoadWord._instance = new LoadWord());
  }

  isInit = false;

  static get FrameSDK() {
    return cc.js.getClassByName("FrameSDK") as any;
  }

  initCallback: () => void = null;
  private pendingHandPrefab: cc.Prefab = null;
  private pendingHandSceneListener = false;
  private handNode: cc.Node = null;
  private frameInstanceNode: cc.Node = null;
  /** isFlag 且本地尚无 newHand：须等新手领奖+飞币后再走进关横幅链 */
  private _awaitNewHandRewardFlow = false;
  private _deferredPreLevelBanners: (() => void) | null = null;

  private isFrameSdkReadyForGameEvent(): boolean {
    try {
      const sdk = LoadWord.FrameSDK;
      return !!(sdk && sdk.frameData && sdk.frameData.sdkFuc && typeof sdk.logGameEvent === "function");
    } catch {
      return false;
    }
  }

  private dispatchGameEventWhenReady(
    evkey: string,
    eventData: { [key: string]: any },
    once: boolean,
    retryCount = 0
  ) {
    if (this.isFrameSdkReadyForGameEvent()) {
      LoadWord.FrameSDK.logGameEvent(evkey, eventData, once);
      return;
    }
    if (retryCount >= 40) return;
    setTimeout(() => {
      this.dispatchGameEventWhenReady(evkey, eventData, once, retryCount + 1);
    }, 100);
  }

  showHandPanel(callback?: () => void) {
    this._awaitNewHandRewardFlow = true;
        if (LoadWord.preloadedNewHandPrefab) {
          this.initHand(null, LoadWord.preloadedNewHandPrefab);
        } else if (LoadWord.wordNewHandBundle) {
          LoadWord.wordNewHandBundle.load(WORD_NEW_HAND_PREFAB, cc.Prefab, this.initHand.bind(this));
        } else {
          cc.assetManager.loadBundle(WORD_NEW_HAND_BUNDLE, (err, bundle) => {
            if (err) {
              console.error("load WordNewHand bundle failed:", err);
              this._awaitNewHandRewardFlow = false;
              this.flushDeferredPreLevelBanners();
            } else {
              LoadWord.wordNewHandBundle = bundle;
              bundle.load(WORD_NEW_HAND_PREFAB, cc.Prefab, this.initHand.bind(this));
            }
          });
        }
  }

  init(callback?: () => void) {
    if (this.isInit == false) {
      this.initCallback = callback;
      this.isInit = true;
      if (null == cc.sys.localStorage.getItem("newHand") && NativeUtils.isFlag) {
        // 尽早标记，避免 startGame 先于 showHandPanel 导致未注册 defer 回调
        this._awaitNewHandRewardFlow = true;
        setTimeout(() => {
          this.showHandPanel();
        }, 500);
      }
      cc.assetManager.loadBundle("WordFrame", (err, bundle) => {
        if (err) {
          console.error("load WordFrame bundle failed:", err);
        } else {
          bundle.load("Frame", cc.Prefab, this.initWordFrame.bind(this));
        }
      });
    }
  }

  /** 首次进游戏（isFlag + localStorage 无 newHand）须延后进关横幅，等 Panel_Award_New2 飞币结束 */
  shouldDeferPreLevelPopupsForNewHand(): boolean {
    return NativeUtils.isFlag && this._awaitNewHandRewardFlow;
  }

  /** 飞币/教程阶段确保仍视为新手 defer 流程（localStorage 已写 newHand 后 startGame 仍需能挂上 defer） */
  markAwaitNewHandRewardFlow() {
    if (NativeUtils.isFlag) {
      this._awaitNewHandRewardFlow = true;
    }
  }

  setDeferredPreLevelBanners(runner: () => void) {
    this._deferredPreLevelBanners = runner;
  }

  private flushDeferredPreLevelBanners() {
    const run = this._deferredPreLevelBanners;
    this._deferredPreLevelBanners = null;
    run && run();
  }

  /** Panel_Award_New2 飞币动画结束后调用（或新手加载失败时兜底） */
  completeNewHandRewardFlow(force = false) {
    if (!this._awaitNewHandRewardFlow && !force) {
      return;
    }
    if (force) {
      const sdk = LoadWord.FrameSDK;
      if (sdk) {
        sdk.skipNextRedeemTipsOnce = true;
      }
    }
    this._awaitNewHandRewardFlow = false;
    const run = this._deferredPreLevelBanners;
    this._deferredPreLevelBanners = null;
    if (run) {
      run();
      return;
    }
    if (force) {
      const gm: any = GlobalApp.GameMain;
      if (gm && typeof gm.runDeferredNewHandPreLevelFlow === "function") {
        gm.runDeferredNewHandPreLevelFlow();
      }
    }
  }

  /** 销毁 persist 新手节点（不释放 WordNewHand 分包，便于下次冷启动重新预加载） */
  releaseNewHandRuntime(destroyNode = true) {
    if (destroyNode && this.handNode && cc.isValid(this.handNode)) {
      try {
        cc.game.removePersistRootNode(this.handNode);
      } catch (_e) {}
      this.handNode.destroy();
    }
    this.handNode = null;
    this.pendingHandPrefab = null;
    this.pendingHandSceneListener = false;
  }

  releaseWordFrameRuntime() {
    if (this.frameInstanceNode && cc.isValid(this.frameInstanceNode)) {
      this.frameInstanceNode.destroy();
    }
    this.frameInstanceNode = null;
  }

  initHand(error, assets) {
    if (error) {
      console.error("load newHand prefab failed:", error);
      this._awaitNewHandRewardFlow = false;
      this.flushDeferredPreLevelBanners();
      return;
    }
    this.pendingHandPrefab = assets;
    this.tryAttachHandToScene();
  }

  private getSceneName(): string {
    try {
      const scene: any = cc.director.getScene && cc.director.getScene();
      return scene && (scene.name || scene._name) ? String(scene.name || scene._name) : "";
    } catch {
      return "";
    }
  }

  private isTargetSceneReady(targetSceneName: string): boolean {
    const sceneName = this.getSceneName();
    if (sceneName === targetSceneName) return true;
    if (sceneName === LOADING_SCENE) return false;
    try {
      if (targetSceneName === MAIN_SCENE) {
        const canvas = cc.find("Canvas");
        if (canvas && cc.isValid(canvas)) return true;
      }
    } catch {}
    return false;
  }

  private tryAttachHandToScene() {
    if (!this.pendingHandPrefab) return;
    if (this.handNode && cc.isValid(this.handNode)) return;

    const targetSceneName = MAIN_SCENE;
    if (!this.isTargetSceneReady(targetSceneName)) {
      if (!this.pendingHandSceneListener) {
        this.pendingHandSceneListener = true;
        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
          this.pendingHandSceneListener = false;
          this.tryAttachHandToScene();
        });
      }
      return;
    }

    var node = cc.instantiate(this.pendingHandPrefab);
    const pd = A.l3 || A.l4  || {}; //Matriarchalism.instance.pandemonian as any;
    const cfgKey = NativeUtils.isFlag ? "FRAME_CONF" : "FRAME_CONF";  //"basicConfig" : "shadow";
    let data = pd && pd[cfgKey] ? pd[cfgKey] : {};
    console.log("data===========11111",pd,cfgKey,data);
    let frameData = {
      gameName: NativeUtils.gameName,
      reportEventCall: A.t,
      // logLiftEvent: NativeUtils.wwylogComm,
      // logGameEvent: NativeUtils.wwylogComm,
      // earlierStageEvent: Matriarchalism.instance.indispositions.bind(Matriarchalism.instance),
      // sdyEvent: NativeUtils.sdyLog,
      showGameGuide: () => {}
    };
    node.getComponent("newHand").init(data, frameData);
    node.parent = cc.director.getScene();
    node.zIndex = cc.macro.MAX_ZINDEX;
    cc.game.addPersistRootNode(node);
    this.handNode = node;
    this.pendingHandPrefab = null;
    LoadWord.releasePreloadedNewHandAsset();
  }

  initWordFrame(error, assets) {
    if (error) {
      console.error("WordFrame Frame prefab load error:", error);
      return;
    }
    var node = cc.instantiate(assets);
    this.frameInstanceNode = node;

    cc.director.on("goldPlus", (num: number, ispiao: boolean = false) => {
      if (ispiao) {
        LoadWord.FrameSDK.addCoin(num, 0, 0, () => {});
      } else {
        LoadWord.FrameSDK.addCoin_A(num);
      }
    });
    let viobj = NativeUtils._mapNativeCallback;
    viobj.vCall = function () {
      cc.director.emit("AD_SUC");
      // Matriarchalism.instance.indispositions("ad_success");
      A.t('v2');
    };
    viobj.iCall = function () {
      cc.director.emit("AD_SUC");
      // Matriarchalism.instance.indispositions("ad_success");
      A.t('v2');
    };

    /** FrameSDK 旧接口 (success, fail) → A.v2(tag, { onResult })；click/succeed/fail 由 A.v2 统一打日志 */
    const bridgeOpenVideo = (successCallback?: () => void, failedCallback?: () => void) => {
      const tag = NativeUtils.placement || "reward_video";
      A.v2(tag, {
        onResult: (result) => {
          if (result === 1) {
            cc.director.emit("AD_SUC");
            successCallback && successCallback();
          } else if (result === -1) {
            failedCallback && failedCallback();
          }
        }
      });
    };
    /** FrameSDK 旧接口 (callback) → A.i2(tag, { onResult }) */
    const bridgeOpenInters = (callback?: () => void) => {
      const tag = NativeUtils.placement || "inters";
      A.i2(tag, {
        onResult: (result) => {
          if (result === 1) {
            callback && callback();
          }
        }
      });
    };

    let fdata = {
      isDeBug: false || CC_DEBUG,
      sdkFuc: {
        openVideo: bridgeOpenVideo,
        openInters: bridgeOpenInters,
        openBanner: function (_gravity, _margin) {},
        hiddenBanner: function () {},


        // logCommonEvent: NativeUtils.wwylogComm,
        // earlierStageEvent: Matriarchalism.instance.indispositions.bind(Matriarchalism.instance),
        // logGameEvent: NativeUtils.wwylogComm,
        reportEventCall: A.t,
        ppEvent: function (key) {
          let dataList = {
            slotShow: "f1",
            popupShow: "f2",
            claim: "f3",
            collected: "f4",
            freeShow: "f5",
            freeClaim: "f6",
            freeCollected: "f7"
          };
          if (!cc.sys.isNative) return;
          // NativeUtils.wwylogPP(dataList[key]);
          A.t(dataList[key]);
          CC_DEBUG && console.log("ppEvent==", key, dataList[key]);
        },
        openUrl: A.u,
        get isReadyVideo() {
          return A.v1//NativeUtils.hasVideo();
        },
        get isReadyInters() {
          try {
            return !!NativeUtils.hasInterstitial();
          } catch (_e) {
            return false;
          }
        },
        set placement(v) {
          NativeUtils.placement = v;
        },
        get placement() {
          return NativeUtils.placement;
        }
      },
      ListenKeys: {
        FRESH_FLAG: "newFirst",
        FRESH_STRING: "CHANGE_LAN",
        VIDEO_SUC: "AD_SUC"
      },
      gameData: {
        get isFlag() {
          return NativeUtils.isFlag;
        },
        get passLevel() {
          return GameUtils.getPassLevel();
        },
        get noProfitAd() {
          return NativeUtils.isFlag ? false : true;
        },
        get isSound() {
          try {
            return AudioManager.getInstance().getMusicState();
          } catch {
            return true;
          }
        },
        myLanguge: "US"
      },
      gameFuc: {
        openLoad: () => {},
        closeLoad: () => {},
        vibrate: function (durationInMilliseconds: number) {
          NativeUtils.vibrate(durationInMilliseconds);
        },
        getCurTurnInfo: () => GameUtils.getCurTurnInfo(),
        getCurRoundInfo: () => GameUtils.getCurRoundInfo(),
        getRoundProgressText: () => GameUtils.getRoundProgressText(),
        showToast: GameUtils.getInstance().showToast.bind(GameUtils.getInstance())
      },
      gameNodeObj: {}
    };

  
    let pm = NativeUtils.isFlag ? A.l4 : A.l3;
    // /mount 失败时 pandemonian 为空；传带空 SDK_CONF/FRAME_CONF 的对象，避免 FrameSDK.initSettings 里 for..in undefined 崩溃
    const confForFrame =
      pm ||
      ({
        basicConfig: { SDK_CONF: {}, FRAME_CONF: {} },
        shadow: { SDK_CONF: {}, FRAME_CONF: {} }
      } as any);
    LoadWord.FrameSDK.init(fdata, confForFrame);

    const onNewHandFlyCoinDone = () => {
      const tryBeginTutorial = (retry = 0) => {
        const gm: any = GlobalApp.GameMain;
        if (gm && typeof gm.beginNewHandTutorialBeforeBanners === "function") {
          gm.beginNewHandTutorialBeforeBanners();
          return;
        }
        if (retry < 50) {
          setTimeout(() => tryBeginTutorial(retry + 1), 100);
          return;
        }
        LoadWord.instance.completeNewHandRewardFlow(true);
      };
      tryBeginTutorial();
    };
    cc.director.on("NEW_HAND_FLY_COIN_DONE", onNewHandFlyCoinDone);
    cc.director.on("NEW_HAND_RDM_TUTORIAL_DONE", () => {
      const gm: any = GlobalApp.GameMain;
      if (gm && !gm._mahjongSpawnAllowed && typeof gm.onNewHandRdmTutorialClosed === "function") {
        gm.onNewHandRdmTutorialClosed();
      }
    });

    let int = setInterval(() => {
      let p = cc.find("Canvas/frameNode") ||cc.find("Canvas/rootNode") ||cc.find("Canvas")||null;
      if (p) {
        clearInterval(int);
        node.parent = p;
        // setTimeout(() => {
        //   NativeUtils.sdyLog(
        //     347,
        //     null == cc.sys.localStorage.getItem("newHand") ? "1" : "2"
        //   );
        // });
        node.active = true;
      }
    }, 16);

    let rewardAB = GameUtils.rewardAB;
    GameUtils.rewardAB = function (cb) {
      LoadWord.FrameSDK.openABAward(cb);
    };

    let rewardPass = GameUtils.rewardPass;
    GameUtils.rewardPass = function (cb) {
      LoadWord.FrameSDK.openLevelAward(null, null, null, null, cb);
    };

    GameUtils.showLevelStartBanner = function (callback, level) {
      const sdk = LoadWord.FrameSDK;
      if (sdk && sdk.Panel && typeof sdk.showLevelStartBanner === "function") {
        sdk.showLevelStartBanner(callback, level);
      } else {
        callback && callback();
      }
    };

    GameUtils.beforeGameLevelStart = function (levelA, levelB, levelC, callback) {
      if (gameData.skipNextPreLevelPopups || GameUtils.shouldSkipPreLevelPopups()) {
        gameData.skipNextPreLevelPopups = false;
        GameUtils.logLevelProgress("LoadWord_skip_beforeGameLevelStart", {
          afterPass: true
        });
        callback && callback();
        return;
      }
      const t0 = Date.now();
      GameUtils.logLevelProgress("LoadWord_beforeGameLevelStart", { levelA, levelB });
      LoadWord.FrameSDK.beforeGameLevelStart(levelA, levelB, levelC, () => {
        GameUtils.logLevelProgress("LoadWord_beforeGameLevelStart_done", {
          levelA,
          waitMs: Date.now() - t0
        });
        callback && callback();
      });
    };

    let checkPopUp = GameUtils.checkPopUp;
    GameUtils.checkPopUp = function (levelPassed, callback) {
      LoadWord.FrameSDK.checkPopUp(levelPassed, callback);
    };

    let logGameEvA = GameUtils.logGameEvA;
    GameUtils.logGameEvA = function (name, key, isInter = false) {
      const loadWord = LoadWord.instance;
      let evkey = "sdymjmatch_game_new";
      let nodes = null;
      if (key == 2) {
        evkey = "sdymjmatch_game_ad";
        nodes = isInter ? "inter" : "video";
      }
      if (key == 3) {
        evkey = "sdymjmatch_game_lv";
        let levelNum = Math.max(1, GameUtils.getPassLevel() + 1);
        let curTurn = 1;
        let totalTurn = 1;
        try {
          levelNum = Math.max(
            1,
            Math.floor(Number(gameData.gameLevel) || levelNum)
          );
        } catch {}
        try {
          const roundInfo = GameUtils.getCurRoundInfo();
          if (roundInfo.totalRound > 1) {
            totalTurn = roundInfo.totalRound;
            curTurn = roundInfo.curRound + 1;
          } else {
            const CurTurnInfo = GameUtils.getCurTurnInfo();
            totalTurn = Math.max(1, Math.floor(Number(CurTurnInfo?.totalTurn) || 1));
            curTurn = Math.max(1, Math.floor(Number(CurTurnInfo?.curTurn) || 0) + 1);
          }
        } catch {}
        nodes =
          totalTurn > 1 ? `lv:${levelNum}_r${curTurn}_${totalTurn}` : `lv:${levelNum}`;
      }

      const eventData = {
        object_action: "show",
        object_name: name,
        object_notes: nodes
      };
      const once = key == 2 ? false : true;

      if (key == 3 && name == "lv_start") {
        loadWord.dispatchGameEventWhenReady(evkey, eventData, once);
        return;
      }

      if (!loadWord.isFrameSdkReadyForGameEvent()) {
        return;
      }

      LoadWord.FrameSDK.logGameEvent(evkey, eventData, once);
    };

    let openWelcomePanel = GameUtils.openWelcomePanel;
    GameUtils.openWelcomePanel = function (callback) {
      LoadWord.FrameSDK.openWelcomePanel(callback);
    };

    this.initCallback && this.initCallback();
  }
}

cc.js.setClassName("LoadWord", LoadWord);
