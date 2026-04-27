export enum GuideEnum {
  redShow1 = 0,
  redShow2 = 1,
  redShow3 = 2,
  redShow4 = 3,
  gameFail = 4,
  welcomeGuideTip = 5,
  wdPageGuide = 6,
  guideEliminateChoice = 7,
  lotteryGuide = 8,
  yearRewardGuide = 9,
  prop1Guide = 10,
  prop2Guide = 11,
  prop3Guide = 12,
  signGuide = 13,
  tujianGuide = 14,
  redWdBtnGuide = 15,
}
function i(e) {
  return "<size=35><color=#FF691FFF>" + e + "</color></size>";
}
(GuideConfig = {})[GuideEnum.redWdBtnGuide] = {
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.tujianGuide] = {
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.signGuide] = {
  audioName: "newShow",
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.prop1Guide] = {
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.prop2Guide] = {
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.prop3Guide] = {
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.yearRewardGuide] = {
  isRepeat: false
};
GuideConfig[GuideEnum.lotteryGuide] = {
  des: "<color=#FCFF00>鸿运抽大奖</color=#FCFF00>已开启!\n点击抽奖!",
  audioName: "makeMnSound/wheelGuide",
  needShowHand: true,
  isRepeat: false
};
GuideConfig[GuideEnum.guideEliminateChoice] = {
  isRepeat: true
};
GuideConfig[GuideEnum.welcomeGuideTip] = {
  isRepeat: false
};
GuideConfig[GuideEnum.wdPageGuide] = {
  des: "恭喜您!\n<color=#FCFF00>现金</color=#FCFF00>可以提现啦！",
  audioName: "withdraw",
  needShowHand: true,
  isBlackClose: true,
  isRepeat: true
};
GuideConfig[GuideEnum.gameFail] = {
  isUnShowText: false,
  unBindClose: true,
  isRepeat: true
};
GuideConfig[GuideEnum.redShow1] = {
  des: "每次观看视频获得的红包\n都可以在这里提现",
  isBlackClose: true,
  audioName: "red_wd_guide_1",
  reportName: "red_wd_guide_1"
};
GuideConfig[GuideEnum.redShow2] = {
  des: "通关越多,提现比例越高！",
  isBlackClose: true,
  audioName: "red_wd_guide_2_s1",
  reportName: "red_wd_guide_2"
};
GuideConfig[GuideEnum.redShow3] = {
  isBlackClose: true,
  isUnShowText: true
};
GuideConfig[GuideEnum.redShow4] = {
  des: "金额满" + i("0.1元") + "可提现，\n预计再闯" + i("2关") + "即可满足，\n95%的用户已提现成功哟～",
  isBlackClose: true,
  scale: 1,
  audioName: "red_guide_4"
};
export var GuideConfig = GuideConfig;