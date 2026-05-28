import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import GameSystem from './GameSystem';
import AudioManager from '../framework/controller/AudioManager';
import AdManager from '../framework/Platform/AdManager';
import EngineUtil from '../framework/EngineUtil';
import PlayerDataSys from '../framework/controller/PlayerDataSys';
import { VideoType, PropType } from '../framework/enum/AllEnum';
import { gameData } from '../data/GameData';
import CommonUtil from '../common/CommonUtil';
import SdkHelper from '../framework/SdkHelper';
import { levelRewardCoin } from '../config';
import GlobalApp from '../common/GlobalApp';
import { A } from '../center/api';
import LoadProgress from '../framework/components/LoadProgress';
import LoadWord from '../wordframe/LoadWord';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class buttonMgr extends cc.Component {
  isClicking = false;
  isReqUseProp = false;
  propBtnIsFlag = false;
  isWatchingPropVideo = false;
  passVideoClose(e) {
    e.target.parent.active = false;
  }
  passVideo() {
    AdManager.getInstance().noAdTest = !AdManager.getInstance().noAdTest;
  }
  passClose(e) {
    e.target.parent.active = false;
  }
  passClick() {
    var e = this;
    GameSystem.submitGame({
      is_tg: 1,
      complete_flag: 1,
      skip: 1
    }).then(function (e) {
      EngineUtil.reconnectSuc();
      SdkHelper.reportData("pass_game_level", {
        duration: gameData.gameTime
      });
      SdkHelper.reportData("pass_game_level_balance", {
        duration: gameData.gameTime,
        cionNum: PlayerDataSys.coinBalance,
        goldNum: PlayerDataSys.goldBalance
      });
      var t = e.levelup_force_flag;
      gameData.tg_reward = e.tg_reward;
      gameData.canCoinExtract = e.is_extract;
      gameData.extractStatus = e.extract_status;
      // On level pass: update localStorage + GameData immediately, but do not refresh top UI yet.
      if (gameData.dollarRewardAppliedLevel !== gameData.gameLevel) {
        var add = Number(levelRewardCoin) || 0;
        gameData.dollarBalance = Number(gameData.dollarBalance || 0) + add;
        gameData.dollarLastAdd = add;
        gameData.dollarRewardAppliedLevel = gameData.gameLevel;
        EngineUtil.setLocalData("user_dollar_balance", String(gameData.dollarBalance));
        EngineUtil.setLocalData("user_dollar_reward_applied_level", String(gameData.dollarRewardAppliedLevel));
      }
      var o = {
        type: VideoType.Pass,
        is_force: t,
        background_info: e.background_info,
        cb: function () {
          EventMgr.trigger(GameEventType.START_GAME);
        },
        tg_progress_info: e.tg_progress_info
      };
      if (gameData.isOpenDemo) EventMgr.trigger(GameEventType.START_GAME);else {
        EventMgr.trigger(GameEventType.PASS_LEVEL_EFFECT);
        setTimeout(function () {
          GlobalApp.GameMain.showSettlementPage(o);
        }, 500);
      }
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.passClick();
      });
    });
  }
  rank_click() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "rankPage",
      data: {}
    });
  }
  wx_wdBtn_click(e = false) {
    // var t = this;
    // if (gameData.globalCanClick) {
    //   EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
    //   AudioManager.getInstance().playMusic("btntouch");
    //   if (!CommonUtil.onAwait("wx_wdBtn_click", 100)) {
    //     e = true === e;
    //     GameSystem.getExtractInfo().then(function (e) {
    //       EngineUtil.reconnectSuc();
    //       if (e && 1 == e.code) {
    //         var t = Object.assign(Object.assign({}, e.data), {
    //           auto_wd: false,
    //           gameSucc: false
    //         });
    //         EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //           name: "wdPage",
    //           data: t
    //         });
    //       }
    //     }).catch(function (e) {
    //       EngineUtil.reconnectFai();
    //       EngineUtil.httpErr(e, function () {
    //         t.wx_wdBtn_click();
    //       });
    //     });
    //   }
    // }
  }
  red_wdBtn_click() {
    // var e = this;
    // EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
    // AudioManager.getInstance().playMusic("btntouch");
    // if (gameData.isOpenDemo) {
    //   this.demoWdTBtnClick();
    // } else {
    //   GameSystem.getGoldExtractInfo().then(function (e) {
    //     EngineUtil.reconnectSuc();
    //     console.log("gold extract info-------", e);
    //     e && 1 == e.code && EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //       name: "redWdPage",
    //       data: e.data
    //     });
    //   }).catch(function (t) {
    //     EngineUtil.reconnectFai();
    //     EngineUtil.httpErr(t, function () {
    //       e.red_wdBtn_click();
    //     });
    //   });
    // }
  }
  againGameBtnClick() {}
  tipCardBtnClick() {
    var e = this;
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("click_prop", {
      prop_type: PropType.tipCard,
      game_level: gameData.gameLevel,
      lun_level: gameData.lun_level,
      turn_id: gameData.turnId,
      round_id: gameData.roundId,
      set_id: gameData.setId
    });
    if (gameData.globalCanClick) if (this.propBtnIsFlag) EngineUtil.showCocosToast3(`gkey_527`);else if (PlayerDataSys.tipCardCount <= 0) this.watchVideoForProp(PropType.tipCard);else if (cc.sys.isBrowser || gameData.isOpenDemo) EventMgr.trigger(GameEventType.USER_OPERATE_TIP);else {
      this.propBtnIsFlag = true;
      setTimeout(function () {
        e.propBtnIsFlag = false;
      }, 3000);
      EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
      EventMgr.trigger(GameEventType.USER_OPERATE_TIP);
    }
  }
  reshuffleCardBtnClick() {
    var e = this;
    SdkHelper.reportData("click_prop", {
      prop_type: PropType.reshuffleCard,
      game_level: gameData.gameLevel,
      lun_level: gameData.lun_level,
      turn_id: gameData.turnId,
      round_id: gameData.roundId,
      set_id: gameData.setId
    });
    AudioManager.getInstance().playMusic("btntouch");
    if (gameData.globalCanClick) if (PlayerDataSys.reshuffleCardCount <= 0) this.watchVideoForProp(PropType.reshuffleCard);else if (this.propBtnIsFlag) EngineUtil.showCocosToast3(`gkey_527`);else {
      this.propBtnIsFlag = true;
      setTimeout(function () {
        e.propBtnIsFlag = false;
      }, 3000);
      if (cc.sys.isBrowser || gameData.isOpenDemo) EventMgr.trigger(GameEventType.USER_RESHUFFLE_CARD);else {
        EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
        EventMgr.trigger(GameEventType.USER_RESHUFFLE_CARD);
      }
    }
  }
  freezeCardBtnClick() {
    // var e = this;
    // SdkHelper.reportData("click_prop", {
    //   prop_type: PropType.freezeCard,
    //   game_level: gameData.gameLevel,
    //   lun_level: gameData.lun_level,
    //   turn_id: gameData.turnId,
    //   round_id: gameData.roundId,
    //   set_id: gameData.setId
    // });
    // AudioManager.getInstance().playMusic("btntouch");
    // if (gameData.globalCanClick) if (this.propBtnIsFlag) EngineUtil.showCocosToast3(`gkey_527`);else if (PlayerDataSys.freezeCardCount <= 0) this.addPropCount(PropType.freezeCard);else if (cc.sys.isBrowser || gameData.isOpenDemo) EventMgr.trigger(GameEventType.USER_FREEZE);else {
    //   this.propBtnIsFlag = true;
    //   setTimeout(function () {
    //     e.propBtnIsFlag = false;
    //   }, 3000);
    //   EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
    //   EventMgr.trigger(GameEventType.USER_FREEZE);
    // }
  }
  getVideoTypeByProp(e) {
    if (e == PropType.tipCard) return VideoType.TipCard;
    if (e == PropType.reshuffleCard) return VideoType.ReshuffleCard;
    return VideoType.FreezeCard;
  }
  getPropVideoTag(e) {
    if (e == PropType.tipCard) return "tips";
    if (e == PropType.reshuffleCard) return "refresh";
    return "use_prop_freeze";
  }
  showPropAdFailToast() {
    EngineUtil.showCocosToast3(`gkey_303`);
  }
  watchVideoForProp(e) {
    var t = this;
    if (this.isWatchingPropVideo) return;
    var o = this.getVideoTypeByProp(e),
      n = this.getPropVideoTag(e);
    SdkHelper.reportData("get_prop_video", {
      idx: e
    });

    LoadWord.FrameSDK.logGameEvent('sdymjmatch_game_ad', {
      object_action: 'show',
      object_name: e == PropType.tipCard ? "tips" : "refresh" ,
      object_notes: `video`,
  });

    A.v0(n);
    if (!A.v1) {
      this.showPropAdFailToast();
      return;
    }
    this.isWatchingPropVideo = true;
    A.v2(n, {
      onResult: function (a) {
        t.isWatchingPropVideo = false;
        if (1 === a) {
          cc.director.emit("AD_SUC");
          t.claimPropByVideo(e, o, true);
        } else if (-1 === a) {
          t.showPropAdFailToast();
          t.claimPropByVideo(e, o, false);
        } else if (0 === a) {
          t.showPropAdFailToast();
        }
      }
    });
  }
  claimPropByVideo(e, t, o) {
    var n = this,
      a = e;
    GameSystem.videoReward({
      video_type: t,
      force_type: 0,
      is_over: o
    }, a).then(function (e) {
      PlayerDataSys.setUserPropCount(e.prop_info, true);
      o && SdkHelper.reportData("get_prop_succ", {
        prop_id: a
      });
    }).catch(function (e) {
      EngineUtil.httpErr(e, function () {
        n.claimPropByVideo(a, t, o);
      });
    });
  }
  addPropCount(e) {
    console.log("addPropCount", e);
    this.watchVideoForProp(e);
  }
  userNoticeBtnClick() {
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "userNoticePage"
    });
  }
  demoWdTBtnClick() {
    var e = PlayerDataSys.goldBalance;
    if (e < 0.01) {

    }else {
      PlayerDataSys.exchange(e);
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wdSuccPage",
        data: {
          amount: e
        }
      });
    }
  }
  openSetUp() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "SetUpPage"
    });
  }
  openSignInPage() {
    // GameSystem.signInfo().then(function (e) {
    //   e && 1 == e.code && EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //     name: "signPage",
    //     data: e.data
    //   });
    // });
  }
  openTaskPage() {
    // EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //   name: "taskPage"
    // });
  }
  openBoxPage() {
    // EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //   name: "boxPage",
    //   data: {
    //     cb: function () {}
    //   }
    // });
  }
  openLuckyFlopPage() {
    // EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //   name: "luckyFlopPage"
    // });
  }
  openLuckyDrawPage() {
    // EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //   name: "turntablePage",
    //   option: {
    //     inQueue: true
    //   }
    // });
  }
  openTujianPage() {
    // GameSystem.getTujianInfo().then(function (e) {
    //   e && 1 == e.code && EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //     name: "tujianPage",
    //     data: e.data
    //   });
    // });
  }
}