// import DataManager from "../managers/DataManager";
// import { NativeUtils } from "../native/NativeUtils";
// import { Emitter } from "../../frame/event/Emitter";
// import { EmitterEvent } from "../../Record/FrameConst";
// import GameLocalData from "../../GameLocalData/GameLocalData";
// import GamePlayData from "../../Record/GamePlayData";
// import { Boot } from "../../frame/event/Boot";
// import { AutoConfig } from "./AutoConfig";
// import { GameCardManager } from "../../Game/manager/GameCardManager";

import { gameData } from "../data/GameData";
import { logAd } from "../common/AdLog";
import { AutoConfig } from "./AutoConfig";
import DataManager from "./DataManager";
import { NativeUtils } from "./NativeUtils";

// import { GameManager } from "../../Manager/GameManager";
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class GameUtils {
  static _m_instance: GameUtils = null;
  get is_enough_vivo() {
    return false;
  }
  get is_enough_oppo() {
    return false;
  }
  get is_oppo() {
    var e = false;
    -1 != DataManager.getInstance().getHttpHeaderMessage().currentChannel.indexOf("oppo") && (e = true);
    return e;
  }
  static getInstance() {
    null == GameUtils._m_instance && (GameUtils._m_instance = new GameUtils());
    return GameUtils._m_instance;
  }
  getIsEditorPlatform() {
    return DataManager.getInstance().getIsEditorPlatform();
  }
  getIsTestEnv() {
    return "production" != DataManager.getInstance().getHttpHeaderMessage().env;
  }
  getShenHeBoolen() {
    var e = DataManager.getInstance().getHttpHeaderMessage().isPass;
    console.log("isPass = ", e);
    return this.getIsIosShenHeMode() || this.getIsAndroidShenHeMode();
  }
  getIsIosShenHeMode() {
    var e = false;
    e = DataManager.getInstance().getHttpHeaderMessage().isPass;
    -1 != DataManager.getInstance().getHttpHeaderMessage().os.indexOf("android") && (e = false);
    return e;
  }
  getIsAndroidShenHeMode() {
    var e = false;
    e = DataManager.getInstance().getHttpHeaderMessage().isPass;
    -1 == DataManager.getInstance().getHttpHeaderMessage().os.indexOf("android") && (e = true);
    return e;
  }
  isNULL(e) {
    return null == e || void 0 === e || "{}" === e || "" === e || "/0" === e || (isNaN(e), false);
  }
  getDecimalPlaces(e, t) {
    return this.isNULL(e) ? "0" : e.toFixed(t);
  }
  PrefixZero(e, t) {
    return (Array(t).join("0") + e).slice(-t);
  }

  getChannelUser() {
    return DataManager.getInstance().getHttpHeaderMessage().channelUser;
  }
  getBlackBox(e) {
    e && e("success");
  }
  isDebug() {
    return DataManager.getInstance().isDebug();
  }
  isAudit() {
    return false;
  }
  exit_game() {
    cc.game.end();
  }
  showToast(e) {
    // Emitter.fire(EmitterEvent.SHOW_UI_TOAST, e);
  }
  sensorHit() {
    // var e,
    //   t = GameLocalData.get_instance().get_data(GamePlayData);
    // e = {
    //   typeStr: "pass_cp",
    //   userId: DataManager.getInstance().user_id(),
    //   totalPassNumber: t.ct2048,
    //   totalSessionNumber: t.totalSessionNumber,
    //   sessionId: t.sessionId,
    //   videoCount: t.video_count,
    //   popVideoCount: t.pop_video_count,
    //   levelVideoCount: t.level_video_count,
    //   levelReviveCount: t.level_revive_count,
    //   levelCupCount: t.level_open_cup_count,
    //   requestVideoCount: t.request_video_times,
    //   version: AutoConfig.hotVersion,
    //   userVersion: t.version,
    //   totalStep: 0
    // };
    // var a = JSON.stringify(e);

    // t.resetPointData();
  }
  annisvaryReport(e) {
    var t;
    t = {
      typeStr: "annisvary_report",
      userId: DataManager.getInstance().user_id(),
      clickEvent: e
    };
    var n = JSON.stringify(t);

  }

  m_canWatchVideo = true;
  canWatchVideo() {
    let e = this;
    if (this.m_canWatchVideo) {
        this.m_canWatchVideo = false;
        setTimeout(() => {
            e.m_canWatchVideo = true;
        }, 500);
        return true;
    }
    return false;
}

showRewardVideo(succ, fail, skip?) {
    if (!GameUtils.getInstance().canWatchVideo()) return;

    logAd("click");

    const y = () => {
        logAd("succeed");
        null == succ || succ();
    }

    const onFail = () => {
        logAd("fail");
        fail && fail();
    }

    let cb = () => {
        NativeUtils.succBack = y;
        NativeUtils.failBack = onFail;
        if (cc.sys.isNative && !NativeUtils.no_video) {
            NativeUtils.showVideoAd();
        } else {
            NativeUtils.executeAdSucc();
        }
    }

    // if (NativeUtils.newFirst) {
        cb();
    // } else {
    //     // GameVideo.openView(cb, failFunc);
    //     UIManager.getInstance().showUI(game_Video, {
    //         okFunc:()=>{
    //             cb();
    //         },
    //         closeCB:()=>{
    //             fail && fail();
    //         }

    //     });
    // }

    console.log("showVideo")

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

  /** 已通关数（按 level_id：当前大关 gameLevel，已完成 = gameLevel - 1） */
  static getPassLevel() {
    const curLevel = Math.floor(Number(gameData.gameLevel) || 1);
    return Math.max(0, curLevel - 1);
  }

  /** 当前局信息（round_id / round_max，配置表「局」） */
  static getCurRoundInfo() {
    const totalRound = Math.max(1, Math.floor(Number(gameData.roundMax) || 1));
    const roundId = Math.max(1, Math.floor(Number(gameData.roundId) || 1));
    return {
      totalRound,
      curRound: Math.max(0, roundId - 1)
    };
  }

  /** 进度条局数文案：round_max>1 时返回 "1/2" 等 */
  static getRoundProgressText(): string | null {
    const { totalRound, curRound } = GameUtils.getCurRoundInfo();
    if (totalRound <= 1) {
      return null;
    }
    return `${curRound + 1}/${totalRound}`;
  }

  /**
   * 同一大关内第 2 局及以后：仅展示 Level 横幅，不走 beforeGameLevelStart 全链。
   * （Welcome / 幸运奖 / 插屏等也不再弹）
   */
  static shouldSkipPreLevelPopups() {
    const { totalRound, curRound } = GameUtils.getCurRoundInfo();
    return totalRound > 1 && curRound > 0;
  }

  /**
   * 本次 start_game 后要进入的大关 id（兼容接口 game_level 滞后、仍显示上一关的情况）。
   */
  static getEnteringLevelId(): number {
    const fromStart = Math.floor(Number(gameData.startGameData?.game_level) || 0);
    const fromGame = Math.floor(Number(gameData.gameLevel) || 0);
    const fromPass = GameUtils.getPassLevel() + 1;
    return Math.max(1, fromStart, fromGame, fromPass);
  }

  /** 是否跳过 Panel_RedeemTips（截图2）：第 1 关，或同关第 2 局及以后 */
  static shouldSkipRedeemTips(enteringLevel?: number): boolean {
    const lv = Math.max(
      1,
      Math.floor(Number(enteringLevel ?? GameUtils.getEnteringLevelId()) || 1)
    );
    if (lv <= 1) {
      return true;
    }
    return GameUtils.shouldSkipPreLevelPopups();
  }

  /**
   * 供 WordFrame 使用的轮次信息（历史命名 turn，实际优先读 round）。
   * curTurn 为 0-based，与 FixedTargetProgressBa 中 curTurn+1 配套。
   */
  static getCurTurnInfo() {
    const round = GameUtils.getCurRoundInfo();
    if (round.totalRound > 1) {
      return {
        totalTurn: round.totalRound,
        curTurn: round.curRound
      };
    }
    const totalTurn = Math.max(1, Math.floor(Number(gameData.turnMax) || 1));
    const turnId = Math.max(1, Math.floor(Number(gameData.turnId) || 1));
    if (totalTurn > 1) {
      return {
        totalTurn,
        curTurn: Math.max(0, turnId - 1)
      };
    }
    return {
      totalTurn: 1,
      curTurn: 0
    };
  }

  /**
   * 埋点 / UI：当前大关与关内局数（逻辑在 WordFrame 外，经 gameFuc 桥接使用）。
   * - levelId：gameLevel（当前大关）
   * - curRound / totalRound：round_max>1 用 round_id；否则 turn_max>1 用 turn_id；否则 1/1
   */
  static getLevelReportInfo(): {
    levelId: number;
    passLevel: number;
    curRound: number;
    totalRound: number;
  } {
    const levelId = Math.max(1, Math.floor(Number(gameData.gameLevel) || 1));
    const roundMax = Math.floor(Number(gameData.roundMax) || 1);
    if (roundMax > 1) {
      return {
        levelId,
        passLevel: GameUtils.getPassLevel(),
        curRound: Math.max(1, Math.floor(Number(gameData.roundId) || 1)),
        totalRound: roundMax,
      };
    }
    const turnMax = Math.floor(Number(gameData.turnMax) || 1);
    if (turnMax > 1) {
      return {
        levelId,
        passLevel: GameUtils.getPassLevel(),
        curRound: Math.max(1, Math.floor(Number(gameData.turnId) || 1)),
        totalRound: turnMax,
      };
    }
    return {
      levelId,
      passLevel: GameUtils.getPassLevel(),
      curRound: 1,
      totalRound: 1,
    };
  }

  /** 与 FrameSDK.beforeGameLevelStart 一致：大关段_局段（如 2_1） */
  static getLevelReportSegments(): number[] {
    const levelA = Math.max(1, Math.floor(Number(gameData.gameLevel) || 1));
    const segments: number[] = [levelA <= 1 ? 1 : levelA - 1];
    const roundMax = Math.floor(Number(gameData.roundMax) || 1);
    if (roundMax > 1) {
      segments.push(Math.max(1, Math.floor(Number(gameData.roundId) || 1)));
    }
    return segments;
  }

  static formatLevelReportSegments(segments?: number[]): string {
    return (segments ?? GameUtils.getLevelReportSegments()).join("_");
  }

  /** logGameEvA(key=3) 等：`lv:3` 或 `lv:3_r2_3` */
  static formatLevelReportNotes(info?: ReturnType<typeof GameUtils.getLevelReportInfo>): string {
    const { levelId, curRound, totalRound } = info ?? GameUtils.getLevelReportInfo();
    if (totalRound > 1) {
      return `lv:${levelId}_r${curRound}_${totalRound}`;
    }
    return `lv:${levelId}`;
  }

  static logLevelProgress(tag: string, extra?: Record<string, unknown>) {
    const round = GameUtils.getCurRoundInfo();
    console.log("[LevelFlow]", tag, JSON.stringify(Object.assign({
      gameLevel: gameData.gameLevel,
      lun_level: gameData.lun_level,
      roundId: gameData.roundId,
      roundMax: gameData.roundMax,
      roundText: GameUtils.getRoundProgressText(),
      passLevel: GameUtils.getPassLevel(),
      enteringLevel: GameUtils.getEnteringLevelId(),
      skipPreLevelPopups: GameUtils.shouldSkipPreLevelPopups(),
      skipRedeemTips: GameUtils.shouldSkipRedeemTips()
    }, extra || {})));
  }

   /**玩的时候的弹窗 */
   static rewardAB(cb?){
    cb && cb();
}
/**通关奖励 */
static rewardPass(cb?){
    cb && cb();
}
/** 关卡开始横幅（WordFrame Panel_ShowLevel） */
static showLevelStartBanner(callback?: () => void, level?: number) {
    callback && callback();
}
//**关卡前的小弹窗 */
static beforeGameLevelStart(levelA: number, levelB?: number, levelC?: any, callback?: () => any){
    callback && callback();
}
/**检查解锁的东西 */
static checkPopUp(levelPassed?: boolean, callback?: () => any){
    callback && callback();
}
static logGameEvA(name,key?){
    let obj = {}
    if(NativeUtils.isFlag || NativeUtils.isFlag_wushi){
        // NativeUtils.wwylogComm(name,obj)
    }
}

static openWelcomePanel(cb=null){

}
}

cc.js.setClassName("GameUtils", GameUtils);

CC_DEBUG && (window["GameUtils"] = GameUtils);
