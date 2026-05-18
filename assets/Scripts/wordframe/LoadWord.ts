import GameUtils from "./GameUtils";
import { NativeUtils } from "./NativeUtils";
import { Matriarchalism } from "./Matriarchalism";
import { gameData } from "../data/GameData";
import AudioManager from "../framework/controller/AudioManager";
import { A } from "../center/api";

/** 与 assets/view/loading.ts 中加载的主场景名一致 */
const MAIN_SCENE = "mainScene";
const LOADING_SCENE = "loadingScene";

export default class LoadWord {
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

  init(callback?: () => void) {
    if (this.isInit == false) {
      this.initCallback = callback;
      this.isInit = true;
      if (null == cc.sys.localStorage.getItem("newHand") && NativeUtils.isFlag) {
        cc.assetManager.loadBundle("WordNewHand", (err, bundle) => {
          if (err) {
            console.error("load WordNewHand bundle failed:", err);
          } else {
            bundle.load("newHand", cc.Prefab, this.initHand.bind(this));
          }
        });
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

  initHand(error, assets) {
    if (error) {
      console.error("load newHand prefab failed:", error);
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
    const pd = Matriarchalism.instance.pandemonian as any;
    const cfgKey = NativeUtils.isFlag ? "basicConfig" : "shadow";
    let data = pd && pd[cfgKey] ? pd[cfgKey] : {};
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
  }

  initWordFrame(error, assets) {
    if (error) {
      console.error("WordFrame Frame prefab load error:", error);
      return;
    }
    var node = cc.instantiate(assets);

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

    /** FrameSDK 旧接口 (success, fail) → A.v2(tag, { onResult }) */
    const bridgeOpenVideo = (successCallback?: () => void, failedCallback?: () => void) => {
      const tag = NativeUtils.placement || "reward_video";
      A.v2(tag, {
        onResult: (result) => {
          if (result === 1) {
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
    const pm = Matriarchalism.instance.pandemonian;
    // /mount 失败时 pandemonian 为空；传带空 SDK_CONF/FRAME_CONF 的对象，避免 FrameSDK.initSettings 里 for..in undefined 崩溃
    const confForFrame =
      pm ||
      ({
        basicConfig: { SDK_CONF: {}, FRAME_CONF: {} },
        shadow: { SDK_CONF: {}, FRAME_CONF: {} }
      } as any);
    LoadWord.FrameSDK.init(fdata, confForFrame);

    if (pm) {
      Matriarchalism.instance.nonsymphoniousness = true;
    }

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
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        GameUtils.logLevelProgress("LoadWord_beforeGameLevelStart_done", {
          levelA,
          waitMs: Date.now() - t0
        });
        callback && callback();
      };
      const timer = setTimeout(() => {
        console.warn("[LoadWord] beforeGameLevelStart safety timeout 5s");
        finish();
      }, 5000);
      LoadWord.FrameSDK.beforeGameLevelStart(levelA, levelB, levelC, () => {
        clearTimeout(timer);
        finish();
      });
    };

    let checkPopUp = GameUtils.checkPopUp;
    GameUtils.checkPopUp = function (levelPassed, callback) {
      LoadWord.FrameSDK.checkPopUp(levelPassed, callback);
    };

    let logGameEvA = GameUtils.logGameEvA;
    GameUtils.logGameEvA = function (name, key, isInter = false) {
      const loadWord = LoadWord.instance;
      let evkey = "sdywords_game_new";
      let nodes = null;
      if (key == 2) {
        evkey = "sdywords_game_ad";
        nodes = isInter ? "inter" : "video";
      }
      if (key == 3) {
        evkey = "sdywords_game_lv";
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
