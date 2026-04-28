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
      // Disabled: do not auto-open levelClearPayoutsPage popup.
      // if (!(1 != gameData.lun_level || this.testGuideHas(GuideEnum.welcomeGuideTip))) {
      //   EngineUtil.setGuideLocal(GuideEnum.welcomeGuideTip);
      //   SdkHelper.reportData("first_guide_page");
      // }
      // if (gameData.canCashExtract) {
      //   gameData.canCashExtract = false;
      //   // Do not auto-open withdraw related popups (stepWdPage / wdPage).
      // }
      // // Disabled: do not auto-open yearReardPage popup.
      // if (!(3 != gameData.lun_level || this.testGuideHas(GuideEnum.yearRewardGuide))) {
      //   EngineUtil.setGuideLocal(GuideEnum.yearRewardGuide);
      // }
      // // Disabled: do not show lottery guide tips/hand.
      // if (!(5 != gameData.lun_level || this.testGuideHas(GuideEnum.signGuide))) {
      //   PlayerDataSys.sign_in_info && PlayerDataSys.sign_in_info.length > 0 && (PlayerDataSys.sign_in_info[0].status = 1);
      //   await this.showSignGuide();
      // }
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
      gameData.canCashExtract = false;
      // Do not auto-open withdraw related popups (stepWdPage / wdPage).
    }
    // if (gameConfig.redBagLevel.includes(gameData.gameLevel)) {
    //   await this.showStepRedRewardPage();
    // }
    // Disabled: do not show lottery guide tips/hand.
    // if (!(4 != gameData.lun_level || this.testGuideHas(GuideEnum.signGuide))) {
    //   PlayerDataSys.sign_in_info && PlayerDataSys.sign_in_info.length > 0 && (PlayerDataSys.sign_in_info[0].status = 1);
    //   // await this.showSignGuide();
    // }
    if (cc.sys.localStorage.getItem("make_up_reward")) {
      await PageMgr.showPageByEnum(PageEnum.makeUpRewardPage, {});
    }
    EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
    return;
  }
  async showLotteryGuide() {
    await EngineUtil.sleep(200);
    gameData.mainBtnGroupVisible.LotteryVisible = true;
    // keep hidden (icon disabled globally)
    await EngineUtil.sleep(200);
    await this.showGuideNode({
      guideType: GuideEnum.lotteryGuide,
      nodes: [GlobalApp.GameMain.mainBtnGroupCtrl.lotteryBtn]
    });
    // Keep the lottery button guide, but do not auto-open turntable popup.
    EngineUtil.setGuideLocal(GuideEnum.lotteryGuide);
    return;
  }
  async showSignGuide() {
    await EngineUtil.sleep(200);
    gameData.mainBtnGroupVisible.SignVisible = true;
    GlobalApp.GameMain.mainBtnGroupCtrl.showSignBtn();
    await EngineUtil.sleep(200);
    await this.showGuideNode({
      guideType: GuideEnum.signGuide,
      nodes: [GlobalApp.GameMain.mainBtnGroupCtrl.signInBtn]
    });
    // Keep the sign button guide, but do not auto-open sign popup.
    EngineUtil.setGuideLocal(GuideEnum.signGuide);
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