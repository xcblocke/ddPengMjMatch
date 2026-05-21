import GameUtils from "./GameUtils";
import { NativeUtils } from "./NativeUtils";
import { gameData, GameState } from "../data/GameData";
import GlobalApp from "../common/GlobalApp";
import AudioManager from "../framework/controller/AudioManager";
import { A } from "../center/api";
import { ParaquadrateFinerOutland } from "../center/l/ParaquadrateFinerOutland";

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
  private pendingStartGameCb: () => void = null;

  /** isFlag 且本地无 newHand = 首次进游戏（补贴页飞币结束前不 startGame） */
  isFirstGameEntry(): boolean {
    return NativeUtils.isFlag && null == cc.sys.localStorage.getItem("newHand");
  }

  shouldDelayStartGameForFirstEntry(): boolean {
    return this.isFirstGameEntry();
  }

  setPendingStartGame(cb: () => void) {
    this.pendingStartGameCb = cb;
  }

  /** Panel_Award_New2 飞币结束后调用，再走进关弹窗链 */
  completeFirstEntryAndStartGame() {
    cc.sys.localStorage.setItem("newHand", "1");
    const cb = this.pendingStartGameCb;
    this.pendingStartGameCb = null;
    cb && cb();
  }

  showFirstEntryHand() {
    if (this.handNode && cc.isValid(this.handNode)) {
      this.handNode.active = true;
    }
  }

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

    // console.log("this.pendingHandPrefab===========11111",JSON.stringify(ParaquadrateFinerOutland.instance.lumbricoid));
    
    // const pd: any = NativeUtils.isFlag ? A.l4 || A.l3 : ParaquadrateFinerOutland.instance.lumbricoid ;
    // const cfgKey = NativeUtils.isFlag ? "basicConfig" : "partyplay";
    // let data = pd && pd[cfgKey] ? pd[cfgKey] : {};
    // console.log("data===========11111",pd,cfgKey,data);


    const pd: any = NativeUtils.isFlag ? A.l4 || A.l3 || {} : A.l3;
    // const cfgKey = NativeUtils.isFlag ? "basicConfig" : "basicConfig";
    // let data = pd && pd[cfgKey] ? pd[cfgKey] : {};
    // console.log("data===========11111",pd,cfgKey,data);

    
    let frameData = {
      gameName: NativeUtils.gameName,
      reportEventCall: A.t,
      // logLiftEvent: NativeUtils.wwylogComm,
      // logGameEvent: NativeUtils.wwylogComm,
      // earlierStageEvent: Matriarchalism.instance.indispositions.bind(Matriarchalism.instance),
      // sdyEvent: NativeUtils.sdyLog,
      showGameGuide: () => {}
    };
    node.getComponent("newHand").init(pd, frameData);
    node.parent = cc.director.getScene();
    node.zIndex = cc.macro.MAX_ZINDEX;
    if (this.isFirstGameEntry()) {
      node.active = !!this.pendingStartGameCb;
    }
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

    /** FrameSDK 旧接口 (success, fail) → A.v2(tag, { onResult })；click/succeed/fail 由 A.v2 统一打日志 */
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

  

    LoadWord.FrameSDK.init(fdata, ParaquadrateFinerOutland.instance.lumbricoid);

    

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
      const sdk = LoadWord.FrameSDK;
      const gm = GlobalApp.GameMain;
      if (gameData.gameState === GameState.gameResult) {
        cb && cb();
        return;
      }
      if (sdk && typeof sdk.isSettlementPhase === "function" && sdk.isSettlementPhase()) {
        cb && cb();
        return;
      }
      if (gm && typeof gm.shouldSkipRewardAbForPass === "function" && gm.shouldSkipRewardAbForPass()) {
        cb && cb();
        return;
      }
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
