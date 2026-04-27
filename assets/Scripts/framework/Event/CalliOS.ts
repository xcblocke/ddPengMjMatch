import AudioManager from '../controller/AudioManager';
import PlayerDataSys from '../controller/PlayerDataSys';
import BaseEventType from '../controller/BaseEventType';
import EventMgr from './EventMgr';
import SdkHelper from '../SdkHelper';
import { GAME_NAME } from '../SystemConfig';
import EngineUtil from '../EngineUtil';
import AdManager from '../Platform/AdManager';
export default class CalliOS {
  prefix = "LoadJsb";
  static _instance = null;
  static getInstance() {
    null == this._instance && (this._instance = new CalliOS());
    return this._instance;
  }
  getNgister(e, t, o) {
    var n = jsb.reflection.callStaticMethod(this.prefix, "get:mutual:strikeOut:", e, t, o);
    console.log("getNgister", n);
    return n;
  }
  getClientInfo() {
    return jsb.reflection.callStaticMethod(this.prefix, "native");
  }
  getCookieInfo() {
    return jsb.reflection.callStaticMethod(this.prefix, "text");
  }
  getChannelName() {
    return jsb.reflection.callStaticMethod(this.prefix, "getChannelName");
  }
  getVersionName() {
    return jsb.reflection.callStaticMethod(this.prefix, "getVersionName");
  }
  finishActivity() {
    jsb.reflection.callStaticMethod(this.prefix, "unitActivity");
  }
  setUserInfo(e) {
    console.log("setUserInfo---", e);
    jsb.reflection.callStaticMethod(this.prefix, "info:", e);
  }
  wxLogin() {
    jsb.reflection.callStaticMethod(this.prefix, "position");
  }
  showSplashAd(e) {
    var t = e.bottom;
    jsb.reflection.callStaticMethod(this.prefix, "loadSplashAd:", String(t));
  }
  showRewardVideoAd(e) {
    EngineUtil.log("callStaticMethod.showRewardVideoAd ", e);
    var t = e.is_force;
    jsb.reflection.callStaticMethod(this.prefix, "managerInfo:afterWeInfo:", t ? "1" : "0", JSON.stringify(e));
  }
  preLoadImgAd(e, t, o) {
    jsb.reflection.callStaticMethod(this.prefix, "preLoadImgAd:height:", String(t), String(o));
  }
  showImgAd() {
    console.log("调用图文广告 IOS");
    jsb.reflection.callStaticMethod(this.prefix, "showImgAd");
  }
  closeImgAd() {
    jsb.reflection.callStaticMethod(this.prefix, "closeImgAd");
  }
  sendStatue(e) {
    jsb.reflection.callStaticMethod(this.prefix, "sendStatue:", String(e));
  }
  preLoadBannerAd(e, t, o) {
    jsb.reflection.callStaticMethod(this.prefix, "preLoadBannerAd:height:", String(t), String(o));
  }
  showBannerAd(e, t, o, n, a, i) {
    jsb.reflection.callStaticMethod(this.prefix, "showBannerAd:width:height:", String(n), String(a), String(i));
  }
  closeBannerAd() {
    jsb.reflection.callStaticMethod(this.prefix, "closeBannerAd");
  }
  getRewardVideoId(e) {
    return e ? jsb.reflection.callStaticMethod(this.prefix, "to") : jsb.reflection.callStaticMethod(this.prefix, "mobId");
  }
  reportData(e, t, o = false) {
    var n = {};
    n.eventName = e;
    var a = [];
    a.push({
      paramName: "ts",
      paramValue: EngineUtil.getTimeStamp()
    });
    a.push({
      paramName: "game_name",
      paramValue: GAME_NAME
    });
    if (t) for (var i = Object.keys(t), r = 0; r < i.length; r++) {
      var c = {};
      c.paramName = i[r];
      c.paramValue = t[i[r]];
      a.push(c);
    }
    n.param = a;
    var u = JSON.stringify(n);
    if (cc.sys.isNative) if (o) {
      jsb.reflection.callStaticMethod(this.prefix, "resignAcross:", u);
      EngineUtil.log("ios", o + "埋点>>>>>>>>>>" + u);
    } else {
      jsb.reflection.callStaticMethod(this.prefix, "reportPosition:", u);
      EngineUtil.log("ios", o + "埋点>>>>>>>>>>" + u);
    }
  }
  getBlackBox() {}
  getScreenWidth() {
    return jsb.reflection.callStaticMethod(this.prefix, "ad");
  }
  getScreenHeight() {
    return jsb.reflection.callStaticMethod(this.prefix, "client");
  }
  setVibrator() {
    jsb.reflection.callStaticMethod(this.prefix, "eventVibrato");
  }
  setVibratoLight() {
    jsb.reflection.callStaticMethod(this.prefix, "withLight");
  }
  cancelVibrator() {}
  decrypt(e) {
    return jsb.reflection.callStaticMethod(this.prefix, "tillExtra:", e);
  }
  encrypt(e) {
    return jsb.reflection.callStaticMethod(this.prefix, "theDoing:", e);
  }
  openKefu(e, t, o) {
    return jsb.reflection.callStaticMethod(this.prefix, "release:isSave:magnitudeerval_strong:", e, t, o);
  }
  showToast(e) {
    jsb.reflection.callStaticMethod(this.prefix, "content:time:create:", GAME_NAME + ":" + e, "2", "300");
  }
  showForceToast(e) {
    jsb.reflection.callStaticMethod(this.prefix, "disappear:outEntry:", e, "1.5");
  }
  getNetworkingStatus() {
    var e = jsb.reflection.callStaticMethod(this.prefix, "relation");
    console.log("网络状态变化" + e);
    return e;
  }
  getMiddleConfig() {
    return jsb.reflection.callStaticMethod(this.prefix, "everyGetConfig");
  }
  onVideoFailed(e) {
    AudioManager.getInstance().resumeMusic("bg", true);
    AdManager.getInstance().onVideoError(e);
  }
  onVideoClose(e) {
    AudioManager.getInstance().resumeMusic("bg", true);
    AdManager.getInstance().onVideoClose(JSON.parse(e));
  }
  onVideoFinish(e) {
    AdManager.getInstance().onVideoFinish(e);
  }
  onVideoOpenSuccess(e) {
    SdkHelper.reportData("b_look_video_onadshow", null);
    AudioManager.getInstance().pauseMusic("bg", true);
    console.log("Oc调用Js onVideoOpensuccess>>", e);
  }
  onSplashAdSkip() {
    console.log("onSplashAdSkip");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdclose() {
    console.log("onSplashAdTimeOver");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdFailed() {
    console.log("onSplashAdError");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdSuccess() {
    EventMgr.trigger(BaseEventType.SPLASH_SHOW);
  }
  onGetAdInfo(e) {
    console.log("cpmInfo:", JSON.parse(e));
    PlayerDataSys.uploadCpm(e);
  }
  onAppStart() {
    console.log("Oc调用Js onAppStart");
    this.reportData("app_start", null);
  }
  onAppPause() {
    console.log("Oc调用Js onAppPause");
    this.reportData("app_pause", null);
  }
  onAppResume() {
    console.log("Oc调用Js onAppResume");
    this.reportData("app_resume", null);
  }
  onAppStop() {
    console.log("Oc调用Js onAppStop");
  }
  onAppDestory() {
    console.log("Oc调用Js onAppDestory");
    this.reportData("app_destory", null);
  }
  onGetWechatCode(e) {
    console.log("Oc调用Js onGetWechatCode", e);
    EventMgr.trigger(BaseEventType.GET_WECHAT_CODE, e);
  }
  onAttachedToWindow() {
    console.log("onAttachedToWindow");
    this.hasNotchInScreen() && this.setNotchHeight();
  }
  hasNotchInScreen() {
    var e = jsb.reflection.callStaticMethod(this.prefix, "instance");
    console.log("hasNotchInScreen", e);
    return e;
  }
  getNotchHeight() {
    jsb.reflection.callStaticMethod(this.prefix, "caste");
  }
  setNotchHeight() {
    this.hasNotchInScreen() && this.getNotchHeight();
  }
  networkingReachabilityDidChange() {}
  onGetConfig(e) {
    console.log("ios调用Js 中台配置 onGetConfigNew", e);
    EventMgr.trigger(BaseEventType.ON_GET_MIDDLE_CFG, e);
  }
}
window['calliOS'] = CalliOS.getInstance();