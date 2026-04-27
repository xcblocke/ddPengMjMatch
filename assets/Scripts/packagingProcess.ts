import newGuide from './newGuide';
import PageMgr from './view/PageMgr';
import GlobalApp from './common/GlobalApp';
import { gameData } from './data/GameData';
import { Res } from './common/ResourcesManager';
import { gameConfig } from './data/GameConfig';
import EventMgr from './framework/Event/EventMgr';
import { PageEnum } from './framework/enum/AllEnum';
import EngineUtil from './framework/EngineUtil';
import GameEventType from './framework/Event/GameEventType';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { GuideEnum } from './framework/enum/GuideConfig';
import SdkHelper from './framework/SdkHelper';
import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class packagingProcess extends cc.Component {
  guideArr2s = [];
  onLoad() {
    GlobalApp.PackagingProcessGuide = this;
  }
  async excuteBeforeLevel() {
    var e,
      t,
      o,
      n,
      a = this;
    console.log("excuteBeforeLevel");
    try {
      if (gameData.isOpenDemo) {
        return;
      }
      if (!(1 != gameData.lun_level || this.testGuideHas(GuideEnum.welcomeGuideTip))) {
        await PageMgr.showPageByEnum(PageEnum.levelClearPayoutsPage);
        EngineUtil.setGuideLocal(GuideEnum.welcomeGuideTip);
        SdkHelper.reportData("first_guide_page");
      }
      if (gameData.canCashExtract) {
        gameData.canCashExtract = false;
        e = {
          auto_wd: true,
          gameSucc: false,
          info: null,
          levle_threshold: false,
          cash_threshold: false
        };
        t = Number(EngineUtil.getLocalData("wdCashLoad") || 0);
        if (EngineUtil.findIndex(gameConfig.cashExtractLevel, gameData.successCount) >= 0) {
          if (gameData.successCount > 2 && gameData.successCount <= 5) {
            e.levle_threshold = true;
            e.cash_threshold = false;
          } else {
            e.levle_threshold = false;
            e.cash_threshold = false;
          }
        } else if (PlayerDataSys.cashBalance >= 100 * PlayerDataSys.cash_limit && !t) {
          e.levle_threshold = false;
          e.cash_threshold = true;
        }
        await PageMgr.showPageByEnum(PageEnum.stepWdPage, e);
        o = EngineUtil.getPromiseResolve("wdPagePromise");
        GameSystem.getExtractInfo().then(async function (t) {
          const __async_this = a;
          EngineUtil.reconnectSuc();
          if (!(!t || 1 != t.code)) {
            e.info = t.data.info;
            await PageMgr.showPageByEnum(PageEnum.wdPage, Object.assign(Object.assign({}, e), {
              extract_status: gameData.extractStatus,
              cb: function () {
                EngineUtil.triggerPromise("wdPagePromise");
              }
            }));
          }
          return;
        });
        SdkHelper.reportData("guide_cash", {
          level: gameData.lun_level
        });
        await o;
      }
      if (!(3 != gameData.lun_level || this.testGuideHas(GuideEnum.yearRewardGuide))) {
        await PageMgr.showPageByEnum(PageEnum.yearReardPage);
        EngineUtil.setGuideLocal(GuideEnum.yearRewardGuide);
      }
      if (!(4 != gameData.lun_level || this.testGuideHas(GuideEnum.lotteryGuide))) {
        await this.showLotteryGuide();
      }
      if (!(5 != gameData.lun_level || this.testGuideHas(GuideEnum.signGuide))) {
        PlayerDataSys.sign_in_info && PlayerDataSys.sign_in_info.length > 0 && (PlayerDataSys.sign_in_info[0].status = 1);
        await this.showSignGuide();
      }
    } catch (__error_1_0) {
      n = __error_1_0;
      console.error(n);
    }
    EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
    return;
  }
  async excuteAfterLevel() {
    var e,
      t,
      o,
      n,
      a = this;
    console.log("excuteAfterLevel");
    if (gameData.isOpenDemo) {
      return;
    }
    e = false;
    t = Number(EngineUtil.getLocalData("wdCashLoad") || 0);
    if (PlayerDataSys.cashBalance >= 100 * PlayerDataSys.cash_limit && !t) {
      e = true;
      EngineUtil.setLocalData("wdCashLoad", "1");
    }
    if (!(!gameData.canCashExtract && !e)) {
      o = {
        auto_wd: true,
        gameSucc: true,
        info: null,
        levle_threshold: false,
        cash_threshold: false
      };
      if (EngineUtil.findIndex(gameConfig.cashExtractLevel, gameData.gameLevel) >= 0 && gameData.canCashExtract) {
        if (gameData.successCount > 2 && gameData.successCount <= 5) {
          o.levle_threshold = true;
          o.cash_threshold = false;
        } else {
          o.levle_threshold = false;
          o.cash_threshold = false;
        }
      } else if (PlayerDataSys.cashBalance >= 100 * PlayerDataSys.cash_limit) {
        o.levle_threshold = false;
        o.cash_threshold = true;
      }
      gameData.canCashExtract = false;
      await PageMgr.showPageByEnum(PageEnum.stepWdPage, o);
      n = EngineUtil.getPromiseResolve("wdPagePromise");
      GameSystem.getExtractInfo().then(async function (e) {
        const __async_this = a;
        EngineUtil.reconnectSuc();
        if (!(!e || 1 != e.code)) {
          o.info = e.data.info;
          await PageMgr.showPageByEnum(PageEnum.wdPage, Object.assign(Object.assign({}, o), {
            extract_status: gameData.extractStatus,
            cb: function () {
              EngineUtil.triggerPromise("wdPagePromise");
            }
          }));
        }
        return;
      });
      SdkHelper.reportData("guide_cash", {
        level: gameData.lun_level
      });
      await n;
    }
    if (gameConfig.redBagLevel.includes(gameData.gameLevel)) {
      await this.showStepRedRewardPage();
    }
    if (!(3 != gameData.lun_level || this.testGuideHas(GuideEnum.lotteryGuide))) {
      await this.showLotteryGuide();
    }
    if (!(4 != gameData.lun_level || this.testGuideHas(GuideEnum.signGuide))) {
      PlayerDataSys.sign_in_info && PlayerDataSys.sign_in_info.length > 0 && (PlayerDataSys.sign_in_info[0].status = 1);
      await this.showSignGuide();
    }
    if (cc.sys.localStorage.getItem("make_up_reward")) {
      await PageMgr.showPageByEnum(PageEnum.makeUpRewardPage, {});
    }
    EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
    return;
  }
  async showLotteryGuide() {
    var e;
    await EngineUtil.sleep(200);
    gameData.mainBtnGroupVisible.LotteryVisible = true;
    GlobalApp.GameMain.mainBtnGroupCtrl.showLotteryBtn();
    await EngineUtil.sleep(200);
    await this.showGuideNode({
      guideType: GuideEnum.lotteryGuide,
      nodes: [GlobalApp.GameMain.mainBtnGroupCtrl.lotteryBtn]
    });
    e = EngineUtil.getPromiseResolve("turntablePage");
    await PageMgr.showPageByEnum(PageEnum.turntablePage, {
      cb: function () {
        EngineUtil.triggerPromise("turntablePage");
      }
    });
    EngineUtil.setGuideLocal(GuideEnum.lotteryGuide);
    await e;
    return;
  }
  async showSignGuide() {
    var e,
      t = this;
    await EngineUtil.sleep(200);
    gameData.mainBtnGroupVisible.SignVisible = true;
    GlobalApp.GameMain.mainBtnGroupCtrl.showSignBtn();
    await EngineUtil.sleep(200);
    await this.showGuideNode({
      guideType: GuideEnum.signGuide,
      nodes: [GlobalApp.GameMain.mainBtnGroupCtrl.signInBtn]
    });
    e = EngineUtil.getPromiseResolve("signPage");
    GameSystem.signInfo().then(async function (e) {
      const __async_this = t;
      if (e && 1 == e.code) {
        await PageMgr.showPageByEnum(PageEnum.signPage, {
          info: e.data.info,
          cb: function () {
            EngineUtil.triggerPromise("signPage");
          }
        });
      }
      return;
    });
    EngineUtil.setGuideLocal(GuideEnum.signGuide);
    await e;
    return;
  }
  async showStepRedRewardPage() {
    var e;
    e = EngineUtil.getPromiseResolve("stepRedRewardPage");
    PageMgr.showPageByEnum(PageEnum.stepRedPage, {
      tg_gold_reward: gameData.tg_gold_reward,
      cb: function () {
        EngineUtil.triggerPromise("stepRedRewardPage");
      }
    });
    await e;
    return;
  }
  setMainBtnGroupVisible() {
    gameData.mainBtnGroupVisible.SignVisible = gameData.id > 4;
  }
  testGuideHas(e) {
    return EngineUtil.testHasGuide(e);
  }
  async showGuideNode(e) {
    var t, o;
    var n,
      a,
      i,
      r = this;
    n = e.guideType;
    if (this.testGuideHas(n)) {
      return;
    }
    if (null === (t = this.guideNode) || void 0 === t ? void 0 : t.parent) {
      (null === (o = this.guideNode) || void 0 === o ? void 0 : o.getComponent(newGuide).nowGuideType) != n && !this.guideArr2s.find(function (e) {
        return e[0] === n;
      }) && this.guideArr2s.push(e);
      return;
    }
    a = cc.instantiate(Res.getPrefab("newGuide"));
    this.guideNode = a;
    a.name = "guide";
    a.getComponent(newGuide).showGuideByNode(e);
    i = EngineUtil.getPromiseResolve("guide" + e.guideType);
    a.getComponent(newGuide).cb = function () {
      var t;
      r.guideNode = null;
      null === (t = e.cb) || void 0 === t || t.call(e);
      var o = r.guideArr2s.shift();
      o && r.showGuideNode(o);
      EngineUtil.triggerPromise("guide" + e.guideType);
    };
    if (e.parentNode) {
      e.parentNode.addChild(a);
    } else {
      this.node.parent.addChild(a);
    }
    return i;
  }
}