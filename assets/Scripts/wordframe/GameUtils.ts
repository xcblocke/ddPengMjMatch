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

    const y = () => {
        null == succ || succ();
    }


    let cb = () => {
        NativeUtils.succBack = y;
        NativeUtils.failBack = fail;
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

  /** 已通关数（当前要玩的关卡为 gameLevel，已完成 = gameLevel - 1） */
  static getPassLevel() {
    const curLevel = Math.floor(Number(gameData.gameLevel) || 1);
    return Math.max(0, curLevel - 1);
  }

   /**玩的时候的弹窗 */
   static rewardAB(cb?){
    cb && cb();
}
/**通关奖励 */
static rewardPass(cb?){
    cb && cb();
}
//**关卡前的小弹窗 */
static beforeGameLevelStart(levelA: number, levelB?: number, levelC?: any, callback?: () => any){
    callback && callback();
}
/**检查解锁的东西 */
static checkPopUp(levelPassed?: boolean, callback?: () => any){
    callback && callback();
}
/**获取当前关卡轮次信息 */
static getCurTurnInfo(){
    try {
      // 统一从 GameManager 取当前轮次，供框架进度条和弹窗展示使用。
      // return GameManager.getInstance().getCurrentTurnInfo();
      return {
        totalTurn: 1,
        curTurn: 0
      };
    } catch {
      return {
        totalTurn: 1,
        curTurn: 0
      };
    }
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
