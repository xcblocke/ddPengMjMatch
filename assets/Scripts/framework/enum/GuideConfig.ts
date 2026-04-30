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
  des: `gkey_298`,
  audioName: "",
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
  des: `gkey_299`,
  audioName: "",
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
  des: `gkey_300`,
  isBlackClose: true,
  audioName: "",
  reportName: ""
};
GuideConfig[GuideEnum.redShow2] = {
  des: `gkey_212`,
  isBlackClose: true,
  audioName: "",
  reportName: ""
};
GuideConfig[GuideEnum.redShow3] = {
  isBlackClose: true,
  isUnShowText: true
};
GuideConfig[GuideEnum.redShow4] = {
  des: `{"gkey_301":{"v1":"${i(\"0.1元\")}","v2":"${i(\"2关\")}"}}`,
  isBlackClose: true,
  scale: 1,
  audioName: ""
};
export var GuideConfig = GuideConfig;