import AdManager from '../framework/Platform/AdManager';
import EngineUtil from '../framework/EngineUtil';
import Service from '../service/Service';
import { gameData, GameState } from '../data/GameData';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import PlayerDataSys from '../framework/controller/PlayerDataSys';
import { gameConfig } from '../data/GameConfig';
import AudioManager from '../framework/controller/AudioManager';
import { PageEnum, VideoType } from '../framework/enum/AllEnum';
import SdkHelper from '../framework/SdkHelper';
import LocalData from '../cyll/LocalData';
import PageMgr from '../view/PageMgr';
class _GameSystem {
  static _instance = null;
  static _getInstance() {
    _GameSystem._instance || (_GameSystem._instance = new _GameSystem());
    return _GameSystem._instance;
  }
  async startGame(e = 0) {
    return new Promise(function (t, o) {
      Service.startGame({
        is_restart: e
      }).then(function (o) {
        console.log("start game res-------", o);
        gameData.startGameData = o.data;
        gameData.initGameData(o.data, !!e);
        var n = o.data.gold_bubble_flag;
        EventMgr.trigger(GameEventType.FRESH_RED_BUBBLE, n);
        t(o);
      }).catch(function (e) {
        o(e);
      });
    });
  }
  videoReward(e, t = 0) {
    var o = this;
    var c = AdManager.getInstance().cpm_data;
    e = Object.assign(Object.assign(Object.assign({}, e), c), {
      prop_type: t
    });
    PlayerDataSys.setCurForceCount(0);
    console.log("*-*-*-*-*-*-*", e);
    return new Promise(function (t, n) {
      Service.videoReward(e).then(async function (n) {
        const __async_this = o;
        var o_local, a, r, c;
        console.log("video reward-------------", n);
        gameData.cashBubbleTip = n.data.bubble_cash_balance;
        gameData.goldBubbleTip = n.data.bubble_gold_balance;
        n.data.make_up_reward && cc.sys.localStorage.setItem("make_up_reward", n.data.make_up_reward);
        gameData.tg_gold_reward > 0 && (n.data.gold_balance -= gameData.tg_gold_reward);
        PlayerDataSys.setUserCashBalance(n.data.cash_balance, false);
        PlayerDataSys.setUserGoldBalance(n.data.gold_balance, false);
        n.isComplete = false;
        o_local = n.data.cash_reward;
        a = n.data.gold_reward;
        gameData.gameLevel <= 2 && (o_local = gameData.tg_reward);
        r = n.data.gold_bubble_flag;
        EventMgr.trigger(GameEventType.FRESH_RED_BUBBLE, r);
        "";
        c = 2 == e.video_type || 3 == e.video_type ? `gkey_484` : `gkey_484`;
        // Disabled: do not auto-open reward toast popup during settlement flow.
        t(n);
        return;
      }).catch(function (e) {
        n(e);
      });
    });
  }
  onlyReward(e = {
    type: 1
  }) {
    var t = this;
    return new Promise(function (o, n) {
      gameData.lun_level > 2 && PlayerDataSys.setCurForceCount(PlayerDataSys.getCurForceCount() + 1);
      Service.onlyReward(e).then(async function (n) {
        const __async_this = t;
        var t_local, a;
        n.data.make_up_reward && cc.sys.localStorage.setItem("make_up_reward", n.data.make_up_reward);
        gameData.tg_gold_reward > 0 && (n.data.gold_balance -= gameData.tg_gold_reward);
        gameData.cashBubbleTip = n.data.bubble_cash_balance;
        gameData.goldBubbleTip = n.data.bubble_gold_balance;
        PlayerDataSys.setUserGoldBalance(n.data.gold_balance, false);
        PlayerDataSys.setUserCashBalance(n.data.cash_balance, false);
        t_local = n.data.reward;
        a = n.data.gold_reward;
        gameData.gameLevel <= 2 && (t_local = gameData.tg_reward);
        // Disabled: do not auto-open reward toast popup during settlement flow.
        o(n);
        return;
      }).catch(function (e) {
        n(e);
      });
    });
  }
  updateGuideIno(e) {
    e.novice_status && (PlayerDataSys.guideStep = e.novice_status);
    return Service.updateGuideInfo(e);
  }
  getRankingInfo() {
    return Service.getRankingInfo();
  }
  getScrollMsg(e = null) {
    return Service.getScrollMsg(e);
  }
  getTaskList() {
    return Service.getTaskList();
  }
  luckyDraw(e) {
    console.log("luckyDraw data-------", e);
    return Service.luckyDraw(e);
  }
  luckyDrawList() {
    return Service.luckyDrawList();
  }
  getExtractInfo(e = {}) {
    return Service.getExtractInfo(e);
  }
  gotoWithdraw_v2(e) {
    return Service.gotoWithdraw_v2(e);
  }
  getGoldExtractInfo() {
    return Service.getGoldExtractInfo();
  }
  getLevelExtractInfo() {
    return Service.getLevelExtractInfo();
  }
  getDayTaskInfo() {
    return Service.getDayTaskInfo();
  }
  getDayTask(e) {
    return Service.getDayTask(e);
  }
  getLevelReward(e) {
    return Service.getLevelReward(e);
  }
  getBigMsg() {
    return Service.getBigMsg();
  }
  gotoWithdraw(e) {
    return new Promise(function (t, o) {
      Service.gotoWithdraw(e).then(function (e) {
        gameData.hasUnExtract && (gameData.hasUnExtract = false);
        t(e);
      }).catch(function (e) {
        o(e);
      });
    });
  }
  getWithdrawDetail(e) {
    return Service.getWithdrawDetail(e);
  }
  gotoGoldWithdraw(e) {
    return Service.gotoGoldWithdraw(e);
  }
  submitGame(e = {
    is_tg: 0
  }, t = null, o = null) {
    return new Promise(function (n, a) {
      e.sync_data = gameData.gameState == GameState.gameover ? null : JSON.stringify(gameData.getSyncData());
      Service.submitGame(e).then(function (a) {
        var i, r;
        console.log("submit res-----", a);
        if (e.is_tg) {
          gameData.successCount = a.data.sucess_count;
          gameData.gameState = GameState.gameResult;
        }
        var c = a.data.cash_reward;
        gameData.updataRewardInfo(a.data);
        gameData.tg_gold_reward = a.data.tg_gold_reward;
        gameData.canCashExtract = a.data.is_extract;
        var s = a.data.speed_reward;
        console.log("guideStep == ", PlayerDataSys.guideStep);
        PlayerDataSys.taskPopupFlag = a.data.task_popup_flag || 0;
        s > 0 && !gameData.isOpenDemo && EventMgr.trigger(GameEventType.SHOWEFFECT, {
          start: o,
          num: 3,
          type: 0,
          rnum: s,
          cb: function () {
            EventMgr.trigger(GameEventType.UPDATE_BALANCE, {
              start: PlayerDataSys.cashBalance - s,
              end: PlayerDataSys.cashBalance
            });
            EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
              type: 0,
              num: s
            });
          }
        });
        var f = a.data.gold_reward;
        if (f > 0 && !gameData.isOpenDemo) {
          EventMgr.trigger(GameEventType.SHOWEFFECT, {
            start: t,
            num: 1,
            type: 1,
            rnum: f,
            cb: function () {
              console.log("goldBalance == ", PlayerDataSys.goldBalance);
              EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE, {
                start: PlayerDataSys.goldBalance - f,
                end: PlayerDataSys.goldBalance
              });
              EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
                type: 1,
                num: f
              });
            }
          });
          AudioManager.getInstance().playMusic("xc_money");
        }
        c > 0 && !gameData.isOpenDemo && EventMgr.trigger(GameEventType.SHOWEFFECT, {
          start: t,
          num: 3,
          type: 0,
          rnum: f,
          cb: function () {
            console.log("cashBalance == ", PlayerDataSys.cashBalance);
            EventMgr.trigger(GameEventType.UPDATE_BALANCE, {
              start: PlayerDataSys.cashBalance - c,
              end: PlayerDataSys.cashBalance
            });
            EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
              type: 0,
              num: c
            });
          }
        });
        gameData.lucky_count = a.data.lucky_count;
        gameData.onlyReward = a.data.show_only_reward;
        gameData.gradeDis = a.data.tx_ratio;
        a.data.bubble_cash_balance && (gameData.cashBubbleTip = a.data.bubble_cash_balance);
        a.data.bubble_gold_balance && (gameData.goldBubbleTip = a.data.bubble_gold_balance);
        0 != Object.keys(a.data.tx_ratio).length && (gameData.gradeDis = a.data.tx_ratio);
        var g = a.data.gold_bubble_flag;
        EventMgr.trigger(GameEventType.FRESH_RED_BUBBLE, g);
        if (!gameData.isOpenDemo) {
          gameData.tg_gold_reward > 0 && (a.data.gold_balance -= gameData.tg_gold_reward);
          PlayerDataSys.setUserCashBalance(null === (i = null == a ? void 0 : a.data) || void 0 === i ? void 0 : i.cash_balance, false);
          PlayerDataSys.setUserGoldBalance(null === (r = null == a ? void 0 : a.data) || void 0 === r ? void 0 : r.gold_balance, false);
        }
        PlayerDataSys.user_level = a.data.level;
        EventMgr.trigger(GameEventType.FRESH_GAME_LEVELINFO);
        n(a.data);
      }).catch(function (e) {
        a(e);
      });
    });
  }
  useProp(e) {
    var t = e.code;
    var reqPropId = Number(e && e.prop_id || 0);
    SdkHelper.reportData("use_prop", {
      prop_type: t,
      level: gameData.id
    });
    return new Promise(function (t, o) {
      Service.useProp(e).then(function (e) {
        // Merge server prop info with local counts.
        // Reason: propPage now supports local coin exchange; server prop_info may lag behind.
        var srv = (e && e.data && e.data.prop_info) ? e.data.prop_info : {};
        var curTip = Number(PlayerDataSys.tipCardCount || 0);
        var curReshuffle = Number(PlayerDataSys.reshuffleCardCount || 0);
        var curFreeze = Number(PlayerDataSys.freezeCardCount || 0);
        var usedId = reqPropId;
        var merged = {
          prop1_num: Math.max(Number(srv.prop1_num || 0), Math.max(0, curReshuffle - (usedId == 1 ? 1 : 0))),
          prop2_num: Math.max(Number(srv.prop2_num || 0), Math.max(0, curTip - (usedId == 2 ? 1 : 0))),
          prop3_num: Math.max(Number(srv.prop3_num || 0), Math.max(0, curFreeze - (usedId == 3 ? 1 : 0)))
        };
        PlayerDataSys.setUserPropCount(merged);
        t(e);
      }).finally(function () {
        o();
      });
    });
  }
  clearBlock(e, t = null, o = null, n?, a = 0, i?) {
    var r = this;
    var s = 0;
    n && (s = 1);
    console.log("istg", s, t, o, gameData.gameState == GameState.gameResult);
    n && (gameData.gameState = GameState.gameResult);
    return new Promise(function (d, f) {
      r.submitGame({
        is_tg: s,
        xc_skip: a,
        cd_time: gameData.xc_count_wait_time
      }, t, o).then(function (e) {
        EngineUtil.reconnectSuc();
        var t = 0;
        gameData.canCashExtract || (gameData.canCashExtract = e.is_extract);
        var o = e.xc_seven_count_popup_flag,
          a = e.force_flag;
        e.is_extract && EventMgr.trigger(GameEventType.HIDE_BUBBLE);
        gameData.tg_reward = e.tg_reward;
        gameData.extractStatus = e.extract_status;
        if (o && gameData.gameState == GameState.gameing) {
          t = 3;
          gameData.xc_count_wait_time = 0;
          console.log("幸运奖励");
        }
        if (s) {
          t = 5;
          console.log("通关奖励");
        }
        if (t) {
          var i = function i(e) {
              d(e);
            },
            f = 0;
          n && (f = 500);
          setTimeout(function () {
            switch (t) {
              case 3:
                var o = {
                  type: t,
                  cb: i.bind(r, {
                    is_tg: s,
                    is_tx: false
                  }),
                  is_force: a
                };
                gameData.isOpenDemo || EventMgr.trigger(GameEventType.PAGE_SHOW, {
                  name: "stepRewardPage",
                  data: o,
                  option: {
                    inQueue: true
                  }
                });
                break;
              case 5:
                EventMgr.trigger(GameEventType.PASS_LEVEL_EFFECT);
                gameData.gameState = GameState.gameResult;
                var n = !!e.is_extract,
                  c = {
                    type: VideoType.Pass,
                    is_force: a,
                    cb: i.bind(r, {
                      is_tg: s,
                      is_tx: n
                    }),
                    tg_progress_info: e.tg_progress_info
                  };
                EventMgr.trigger(GameEventType.SHOW_SETTLMENT_PAGE, c);
            }
          }, f);
        } else d({
          is_tg: s,
          is_tx: false
        });
      }).catch(function (s) {
        console.error("dddddddddddddddddddddddd = ", s);
        EngineUtil.httpErr(s, function () {
          r.clearBlock(e, t, o, n, a, i);
        }, true);
        f(s);
      });
    });
  }
  demoClearBlock(e, t = null, o = null, n?, a = 0, i?) {
    var r = 0;
    n && (r = 1);
    console.log("istg", r, t, o);
    EventMgr.trigger(GameEventType.FRESH_GAME_LEVELINFO);
    var c = this.getCashReward(e);
    0 != gameData.debugData.passLevelReward && n && (c = gameData.debugData.passLevelReward);
    if (c > 0) {
      EventMgr.trigger(GameEventType.SHOWEFFECT, {
        start: t,
        num: 1,
        type: 1,
        rnum: c,
        cb: function () {
          console.log("goldBalance == ", PlayerDataSys.goldBalance);
          EventMgr.trigger(GameEventType.UPDATE_BALANCE, {
            start: PlayerDataSys.goldBalance - c,
            end: PlayerDataSys.goldBalance
          });
          EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
            type: 1,
            num: c
          });
          console.log("gameData.debugData", gameData.debugData);
          if (gameData.debugData.isOpenAutoGet) {
            PlayerDataSys.withDrawal(c);
            EventMgr.trigger(GameEventType.PAGE_SHOW, {
              name: "wdSuccPage",
              data: {
                amount: c
              }
            });
          }
        }
      });
      AudioManager.getInstance().playMusic("xc_money");
      PlayerDataSys.addUserGoldBalance(c);
    }
    if (r) {
      gameData.gameState = GameState.gameResult;
      var s = {
        type: VideoType.Pass,
        cb: i.bind(this, {
          is_tg: r
        })
      };
      EventMgr.trigger(GameEventType.SHOW_SETTLMENT_PAGE, s);
    }
  }
  getCashReward(e) {
    var t = 0;
    console.log("gameData.debugData.isOpenMingma", gameData.debugData.isOpenMingma);
    if (gameData.debugData.nextMustMoney > 0) {
      t = gameData.debugData.nextMustMoney;
      gameData.debugData.nextMustMoney = 0;
      LocalData.getInstance().setDebugData(JSON.stringify(gameData.debugData));
    } else if (null != gameData.debugData.fixedMoney) {
      t = gameData.debugData.fixedMoney;
      LocalData.getInstance().setDebugData(JSON.stringify(gameData.debugData));
    } else if (gameData.debugData.isOpenMingma) {
      t = e;
      t *= 100;
    } else {
      var o = gameData.debugData.goldLowLimit,
        n = gameData.debugData.goldHighLimit;
      t = +(t = Math.random() * (n - o) + o).toFixed(2);
    }
    return t;
  }
  initGameConfig(e) {
    var t = e.parameter_conf;
    gameData.red_bag_value.push(Number(t.red_bag_value.para_value));
  }
  initCashGoldInfo(e) {
    gameConfig.cashExtractLevel = e.cash_extract_level;
    gameConfig.goldExtractLevel = e.gold_extract_level;
    gameConfig.redBagLevel = e.red_bag_level;
    gameConfig.cashLimit = e.cash_limit;
    gameConfig.withdrawPercent3 = e.withdraw_percent_3;
    gameConfig.gold_extract_title = e.gold_extract_title;
    gameConfig.lucky_level_count_limit = e.lucky_level_count_limit;
  }
  withdrawHistory() {
    return Service.withdrawHistory();
  }
  removeUser(e) {
    return Service.removeUser(e);
  }
  signInfo() {
    return Service.signInfo();
  }
  sign(e) {
    return Service.sign(e);
  }
  syncTujianData(e) {
    return Service.syncTujianData(e);
  }
  getTujianInfo() {
    return Service.getTujianInfo();
  }
  favoriteExtract() {
    return Service.favoriteExtract();
  }
  luckyDrawInfo() {
    return Service.luckyDrawInfo();
  }
}
export default _GameSystem._getInstance();