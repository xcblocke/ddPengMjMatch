import SdkHelper from "../framework/SdkHelper";
import { NativeUtils } from "./NativeUtils";
import { gameData } from "../data/GameData";

/**
 * WordFrame 通过 LoadWord 替换这些静态方法；默认实现为直接回调，便于未接入框架时也可运行。
 */
export default class GameUtils {
  static _m_instance: GameUtils = null;

  static getInstance() {
    if (!GameUtils._m_instance) GameUtils._m_instance = new GameUtils();
    return GameUtils._m_instance;
  }

  m_canWatchVideo = true;
  canWatchVideo() {
    const self = this;
    if (this.m_canWatchVideo) {
      this.m_canWatchVideo = false;
      setTimeout(() => {
        self.m_canWatchVideo = true;
      }, 500);
      return true;
    }
    return false;
  }

  showToast(t: any) {
    const msg =
      typeof t === "string"
        ? t
        : t && (t.text || t.msg || t.string)
          ? t.text || t.msg || t.string
          : "";
    SdkHelper.showToast(msg);
  }

  showRewardVideo(succ: () => void, fail?: () => void, _skip?: any) {
    if (!GameUtils.getInstance().canWatchVideo()) return;
    const y = () => {
      succ && succ();
    };
    NativeUtils.succBack = y;
    NativeUtils.failBack = fail;
    if (cc.sys.isNative && !NativeUtils.no_video) {
      NativeUtils.showVideoAd();
    } else {
      NativeUtils.executeAdSucc();
    }
  }

  static showInterstitialAd(succFunc: (str?: string) => void = null) {
    NativeUtils.succBack = succFunc;
    NativeUtils.failBack = succFunc;
    if (cc.sys.isNative && !NativeUtils.no_video) {
      NativeUtils.showInterstitialAd();
    } else {
      NativeUtils.executeAdSucc();
    }
  }

  /**
   * 已通过关卡数：当前关卡为 gameData.gameLevel 时，理解为已完成 gameLevel-1 关。
   */
  static getPassLevel() {
    const gl = Math.floor(Number(gameData.gameLevel) || 1);
    return Math.max(0, gl - 1);
  }

  static rewardAB(cb?) {
    cb && cb();
  }

  static rewardPass(cb?) {
    cb && cb();
  }

  static beforeGameLevelStart(
    _levelA: number,
    _levelB?: number,
    _levelC?: any,
    callback?: () => any
  ) {
    callback && callback();
  }

  static checkPopUp(_levelPassed?: boolean, callback?: () => any) {
    callback && callback();
  }

  /** 非多轮关卡玩法：固定单轮。 */
  static getCurTurnInfo() {
    return {
      totalTurn: 1,
      curTurn: 0
    };
  }

  static logGameEvA(_name, _key?) {}

  static openWelcomePanel(_cb = null) {}
}

cc.js.setClassName("GameUtils", GameUtils);
CC_DEBUG && ((window as any)["GameUtils"] = GameUtils);
