import AdManager from '../Platform/AdManager';
import EngineUtil from '../EngineUtil';
import EventMgr from './EventMgr';
import BaseEventType from '../controller/BaseEventType';
import SdkHelper from '../SdkHelper';
import { GAME_NAME } from '../SystemConfig';
import PlayerDataSys from '../controller/PlayerDataSys';
import GlobalDataSys from '../controller/GlobalDataSys';
import GameEventType from './GameEventType';
export default class CallAndroid {
  static _instance = null;
  static getInstance() {
    null == this._instance && (this._instance = new CallAndroid());
    return this._instance;
  }
  static onBackPressed() {}
  static onGetOAID() {}
  ysdkLogin() {
    console.log("ysdkLogin");
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "ysdkLogin", "()V");
  }
  getNgister(e, t, o) {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getNgister", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", e, t, o);
  }
  getClientInfo() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getClientInfo", "()Ljava/lang/String;");
    EngineUtil.log("设备信息------");
    EngineUtil.log(e);
    return e;
  }
  getCookieInfo() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getCookieInfo", "()Ljava/lang/String;");
  }
  requestTDId() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "requestTDId", "()Ljava/lang/String;");
    console.log("同盾id", e);
    return e;
  }
  requestSMId() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "requestSMId", "()V");
  }
  showForceDialog(e, t) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showForceDialog", "(Ljava/lang/String;Ljava/lang/String;)V", e, t);
  }
  showForceToast(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showForceToast", "(Ljava/lang/String;)V", e);
  }
  wxLogin() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "wxLogin", "()V");
  }
  wxShare(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "wxShare", "(Ljava/lang/String;)V", e);
  }
  clipBoard(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "clipBoard", "(Ljava/lang/String;)V", e);
  }
  showInsertAd() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showInsertAd", "()V");
  }
  showSplashAd(e) {
    var t = e.slotId,
      o = e.bottom;
    EngineUtil.log("android.showSplashAd", e);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "loadSplashAd", "(II)V", t, o);
  }
  preloadSplashWf() {
    console.log("preloadSplashWf");
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "preloadSplashWf", "()V");
  }
  loadNewSplashAd(e, t) {
    SdkHelper.reportData("loadNewSplashAd", {
      type: e
    });
    console.log("loadNewSplashAd", e);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "loadNewSplashAd", "(II)V", e, t);
  }
  closeSplashAd() {
    EngineUtil.log("android.closeSplashAd");
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "closeSplashAd", "()V");
  }
  showRewardVideoAd(e) {
    EngineUtil.log("android.showRewardVideoAd ", e);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showRewardVideoAd", "(Ljava/lang/String;)V", e);
  }
  preLoadImgAd(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "preLoadImgAd", "(I)V", e);
  }
  showImgAd(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showImgAd", "(I)V", e);
  }
  closeImgAd() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "closeImgAd", "()V");
  }
  preLoadBannerAd(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "preLoadBannerAd", "(I)V", e);
  }
  showBannerAd(e, t, o, n, a, i) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showBannerAd", "(IIIIII)V", e, t, o, n, a, i);
  }
  closeBannerAd() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "closeBannerAd", "()V");
  }
  isNetworkAcailable() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "isNetworkAvailable", "()I");
    return Number(e);
  }
  showToast(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showToast", "(Ljava/lang/String;)V", e);
  }
  finishApp() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "finishActivity", "()V");
  }
  setEnterAgreementTime() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "setEnterAgreementTime", "()V");
  }
  getFirstLaunchTime() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "reportAppFirstLaunchTime", "()Ljava/lang/String;");
    EngineUtil.log("getFirstLaunchTime===" + e);
    return e || 0;
  }
  getEnterAgreementTime() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "reportAgreementTime", "()Ljava/lang/String;");
    EngineUtil.log("getEnterAgreementTime====" + e);
    return e || 0;
  }
  showNotification(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "showNotification", "(Ljava/lang/String;)V", e);
  }
  getForceSlotId() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getForceSlotId", "()I");
  }
  getNormalSlotId() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getNormalSlotId", "()I");
  }
  reportData(e, t, o = false) {
    var n = {};
    n.eventName = e;
    var i = [];
    i.push({
      paramName: "ts",
      paramValue: EngineUtil.getTimeStamp()
    });
    i.push({
      paramName: "game_name",
      paramValue: GAME_NAME
    });
    if (t) for (var r = Object.keys(t), c = 0; c < r.length; c++) {
      var l = {};
      l.paramName = r[c];
      l.paramValue = t[r[c]];
      i.push(l);
    }
    n.param = i;
    var u = JSON.stringify(n);
    if (cc.sys.isNative) if (o) {
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "reportCoreData", "(Ljava/lang/String;)V", u);
      EngineUtil.log("android", o + "埋点>>>>>>>>>>" + u);
    } else {
      jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "reportData", "(Ljava/lang/String;)V", u);
      EngineUtil.log("android", o + "埋点>>>>>>>>>>" + u);
    }
  }
  getBlackBox() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getBlackBox", "()Ljava/lang/String;");
  }
  getBd_did() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getBd_did", "()Ljava/lang/String;");
  }
  getScreenWidth() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getScreenWidth", "()I");
  }
  getScreenHeight() {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getScreenHeight", "()I");
  }
  hasNotchInScreen() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "hasNotchInScreen", "()Z");
    EngineUtil.log("android.hasNotchInScreen", e);
    return e;
  }
  getNotchHeight() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getStatusBarHeight", "()I");
    EngineUtil.log("android.getStatusBarHeight", e);
    var t = cc.view.getFrameSize();
    return e * cc.winSize.height / t.height;
  }
  setVibrator(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "setVibrator", "(I)V", e);
  }
  cancelVibrator() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "cancelVibrator", "()V");
  }
  decrypt(e) {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getDecryptData", "(Ljava/lang/String;)Ljava/lang/String;", e);
  }
  openKefu(e, t, o, n) {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "openKefu", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", e, t, o, n);
  }
  setUserInfo(e) {
    EngineUtil.log("android.setUserInfo---", e);
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "setUserInfo", "(Ljava/lang/String;)V", e);
  }
  initOtherSDK() {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "initOtherSDK", "()V");
  }
  getAesEncrypData(e) {
    EngineUtil.log("android.getAesEncrypData---", e);
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getAesEncrypData", "(Ljava/lang/String;)Ljava/lang/String;", e);
  }
  getAesDncrypData(e) {
    EngineUtil.log("android.getAesDncrypData---", e);
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getAesDncrypData", "(Ljava/lang/String;)Ljava/lang/String;", e);
  }
  getChannelName() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getChannelName", "()Ljava/lang/String;");
    EngineUtil.log("getChannelName==" + e);
    return e;
  }
  getVersionName() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getVersionName", "()Ljava/lang/String;");
    EngineUtil.log("getVersionName==" + e);
    return e;
  }
  getVersionCode() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getVersionCode", "()I");
    EngineUtil.log("getVersionCode==" + Number(e));
    return Number(e);
  }
  preloadWfUnionInteractionAd() {
    console.log("preloadWfUnionInteractionAd");
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "preloadWfUnionInteractionAd", "()V");
  }
  getActivityNumByDate(e) {
    return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getActivityNumByDate", "(Ljava/lang/String;)I", e);
  }
  getOAID() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getOAID", "()Ljava/lang/String;");
    EngineUtil.log("Android获取OAID,OAID", e);
    return e;
  }
  getMiddleConfig() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getConfig", "()Ljava/lang/String;");
    EngineUtil.log("Android获取中台配置,getMiddleConfig", e);
    return e;
  }
  playMusic(e) {
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "playBgMusic", "(Ljava/lang/String;)V", e);
  }
  getHSToken() {
    var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JavaScriptHelper", "getHSToken", "()Ljava/lang/String;");
    console.log("获取火山 getHSToken : ", e);
    return "null" == e ? "" : e;
  }
  onGetCpm() {}
  onYSDKLoginSuccess() {
    EngineUtil.log("Java调用Js onYSDKLoginSuccess");
    EngineUtil.log("android.onYSDKLoginSuccess");
    PlayerDataSys.isYSDKLoginSuccess = true;
    EventMgr.trigger(GameEventType.SHOW_YSDK_TOAST);
  }
  onGetHSToken(e) {
    console.log("获取火山dev_token", e);
    GlobalDataSys.initToken(e);
  }
  onGetAdInfo(e) {
    console.log("回传cpm");
    console.log("回传cpm " + e, JSON.stringify(e));
    AdManager.getInstance().onGetAdInfo(e);
  }
  onGetBdDid(e) {
    console.log("获取火山id", e);
  }
  onGetAuthorityFinish() {
    console.log("Android回调,获取用户权限完成");
    EventMgr.trigger(BaseEventType.SDKINIT_FINISH);
  }
  onVideoError(e) {
    console.log("Java调用Js onVideoError>>", e);
    AdManager.getInstance().onVideoError(e);
  }
  onVideoClose(e) {
    console.log("Java调用Js onVideoClose>>", e);
    AdManager.getInstance().onVideoClose(JSON.parse(e).data);
  }
  onVideoFinish(e) {
    EngineUtil.log("Java调用Js onVideoFinish>>", e);
    AdManager.getInstance().onVideoFinish(e);
  }
  onVideoOpensuccess(e) {
    EngineUtil.log("Java调用Js onVideoOpensuccess>>", e);
  }
  onAppStart() {
    EngineUtil.log("Java调用Js onAppStart");
    SdkHelper.reportData("app_start");
    SdkHelper.onAppStart();
  }
  onAppRestart() {
    EngineUtil.log("Java调用Js onAppReStart");
    SdkHelper.reportData("app_restart");
    SdkHelper.onAppRestart();
  }
  onAppPause() {
    EngineUtil.log("Java调用Js onAppPause");
    SdkHelper.reportData("app_pause");
    SdkHelper.onAppPause();
  }
  onAppResume() {
    EngineUtil.log("Java调用Js onAppResume");
    SdkHelper.reportData("app_resume");
    SdkHelper.onAppResume();
  }
  onAppStop() {
    console.log("Java调用Js onAppStop");
  }
  onAppDestory() {
    EngineUtil.log("Java调用Js onAppDestory");
    SdkHelper.reportData("app_destory");
  }
  onGetWechatCode(e) {
    EngineUtil.log("Java调用Js onGetWechatCode", e);
    EventMgr.trigger(BaseEventType.GET_WECHAT_CODE, e);
  }
  onSplashAdSkip() {
    EngineUtil.log("android.onSplashAdSkip");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdFinish() {
    EngineUtil.log("android.onSplashAdFinish");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdTimeOver() {
    EngineUtil.log("android.onSplashAdTimeOver");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdError() {
    EngineUtil.log("android.onSplashAdError");
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdShow() {}
  onInsertAdClick() {
    console.log("onInsertAdClick");
  }
  onInsertAdClose() {
    console.log("onInsertAdClose");
    AdManager.getInstance().onInsertAdClose();
  }
  onInsertAdShow() {
    console.log("onInsertAdShow");
  }
  onGetConfig(e) {
    EngineUtil.log("Java调用Js onGetConfig", e);
    EventMgr.trigger(BaseEventType.ON_GET_MIDDLE_CFG, e);
  }
  getSMId(e) {
    EventMgr.trigger(BaseEventType.ON_GET_SM_ID, e);
  }
}
window['callAndroid'] = CallAndroid.getInstance();