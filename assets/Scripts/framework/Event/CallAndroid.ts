import AdManager from '../Platform/AdManager';
import EngineUtil from '../EngineUtil';
import EventMgr from './EventMgr';
import BaseEventType from '../controller/BaseEventType';
import SdkHelper from '../SdkHelper';
import { GAME_NAME } from '../SystemConfig';
import PlayerDataSys from '../controller/PlayerDataSys';
import GlobalDataSys from '../controller/GlobalDataSys';
import GameEventType from './GameEventType';

/** 全部为本地模拟，不调用 Android JavaScriptHelper JNI（便于无原生壳包体调试） */
function mockClientInfoJson(): string {
  return JSON.stringify({
    device_id: 'mock_android_' + EngineUtil.getRandId(),
    aid: 'mock_aid',
    ii: 'li',
    madr: 'madr',
    wmr: 'wmr',
    version_name: '1.0.1',
    channel_name: 'mock_channel'
  });
}

export default class CallAndroid {
  static _instance = null;
  static getInstance() {
    null == this._instance && (this._instance = new CallAndroid());
    return this._instance;
  }
  static onBackPressed() {}
  static onGetOAID() {}
  ysdkLogin() {
    console.log('[CallAndroid mock] ysdkLogin');
  }
  getNgister(e, t, o) {
    EngineUtil.log('[CallAndroid mock] getNgister', e, t, o);
    return '{"mock":true}';
  }
  getClientInfo() {
    var e = mockClientInfoJson();
    EngineUtil.log('设备信息------(mock)');
    EngineUtil.log(e);
    return e;
  }
  getCookieInfo() {
    return '{}';
  }
  requestTDId() {
    var e = 'mock_td_id';
    console.log('同盾id(mock)', e);
    return e;
  }
  requestSMId() {
    console.log('[CallAndroid mock] requestSMId');
  }
  showForceDialog(e, t) {
    EngineUtil.log('[CallAndroid mock] showForceDialog', e, t);
  }
  showForceToast(e) {
    EngineUtil.log('[CallAndroid mock] showForceToast', e);
  }
  wxLogin() {
    console.log('[CallAndroid mock] wxLogin');
  }
  wxShare(e) {
    EngineUtil.log('[CallAndroid mock] wxShare', e);
  }
  clipBoard(e) {
    EngineUtil.log('[CallAndroid mock] clipBoard', e);
  }
  showInsertAd() {
    EngineUtil.log('[CallAndroid mock] showInsertAd');
    setTimeout(function () {
      AdManager.getInstance().onInsertAdClose();
    }, 300);
  }
  showSplashAd(e) {
    var t = e.slotId,
      o = e.bottom;
    EngineUtil.log('android.showSplashAd(mock)', e);
    void t;
    void o;
  }
  preloadSplashWf() {
    console.log('[CallAndroid mock] preloadSplashWf');
  }
  loadNewSplashAd(e, t) {
    SdkHelper.reportData('loadNewSplashAd', {
      type: e
    });
    console.log('[CallAndroid mock] loadNewSplashAd', e, t);
  }
  closeSplashAd() {
    EngineUtil.log('[CallAndroid mock] android.closeSplashAd');
  }
  showRewardVideoAd(e) {
    EngineUtil.log('android.showRewardVideoAd(mock) ', e);
    var inst = CallAndroid.getInstance();
    setTimeout(function () {
      inst.onVideoClose(JSON.stringify({ data: { isReward: true } }));
    }, 150);
  }
  preLoadImgAd(e) {
    void e;
  }
  showImgAd(e) {
    void e;
  }
  closeImgAd() {}
  preLoadBannerAd(e) {
    void e;
  }
  showBannerAd(e, t, o, n, a, i) {
    void e;
    void t;
    void o;
    void n;
    void a;
    void i;
  }
  closeBannerAd() {}
  isNetworkAcailable() {
    return 1;
  }
  showToast(e) {
    EngineUtil.showCocosToast3(e);
  }
  finishApp() {
    EngineUtil.log('[CallAndroid mock] finishActivity');
  }
  setEnterAgreementTime() {}
  getFirstLaunchTime() {
    var e = String(Math.floor(Date.now() / 1000));
    EngineUtil.log('getFirstLaunchTime===(mock)' + e);
    return e || 0;
  }
  getEnterAgreementTime() {
    var e = String(Math.floor(Date.now() / 1000));
    EngineUtil.log('getEnterAgreementTime====(mock)' + e);
    return e || 0;
  }
  showNotification(e) {
    EngineUtil.log('[CallAndroid mock] showNotification', e);
  }
  getForceSlotId() {
    return 0;
  }
  getNormalSlotId() {
    return 0;
  }
  reportData(e, t, o = false) {
    var n = {};
    n.eventName = e;
    var i = [];
    i.push({
      paramName: 'ts',
      paramValue: EngineUtil.getTimeStamp()
    });
    i.push({
      paramName: 'game_name',
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
    EngineUtil.log('android(mock)', o + '埋点>>>>>>>>>>' + u);
  }
  getBlackBox() {
    return '';
  }
  getBd_did() {
    return '';
  }
  getScreenWidth() {
    return Math.round(cc.view.getFrameSize().width);
  }
  getScreenHeight() {
    return Math.round(cc.view.getFrameSize().height);
  }
  hasNotchInScreen() {
    EngineUtil.log('android.hasNotchInScreen(mock)', false);
    return false;
  }
  getNotchHeight() {
    var e = 0;
    EngineUtil.log('android.getStatusBarHeight(mock)', e);
    var t = cc.view.getFrameSize();
    return e * cc.winSize.height / t.height;
  }
  setVibrator(e) {
    void e;
  }
  cancelVibrator() {}
  decrypt(e) {
    return e;
  }
  openKefu(e, t, o, n) {
    EngineUtil.log('[CallAndroid mock] openKefu', e, t, o, n);
  }
  setUserInfo(e) {
    EngineUtil.log('android.setUserInfo---(mock)', e);
  }
  initOtherSDK() {
    var self = this;
    setTimeout(function () {
      self.onGetAuthorityFinish();
    }, 100);
  }
  getAesEncrypData(e) {
    EngineUtil.log('android.getAesEncrypData---(mock)', e);
    return e;
  }
  getAesDncrypData(e) {
    EngineUtil.log('android.getAesDncrypData---(mock)', e);
    return e;
  }
  getChannelName() {
    var e = 'mock_channel';
    EngineUtil.log('getChannelName==(mock)' + e);
    return e;
  }
  getVersionName() {
    var e = '1.0.0.0';
    EngineUtil.log('getVersionName==(mock)' + e);
    return e;
  }
  getVersionCode() {
    var e = 1;
    EngineUtil.log('getVersionCode==(mock)' + Number(e));
    return Number(e);
  }
  preloadWfUnionInteractionAd() {
    console.log('[CallAndroid mock] preloadWfUnionInteractionAd');
  }
  getActivityNumByDate(e) {
    void e;
    return 0;
  }
  getOAID() {
    var e = '';
    EngineUtil.log('Android获取OAID(mock)', e);
    return e;
  }
  getMiddleConfig() {
    var e = '{}';
    EngineUtil.log('Android获取中台配置,getMiddleConfig(mock)', e);
    return e;
  }
  playMusic(e) {
    EngineUtil.log('[CallAndroid mock] playBgMusic', e);
  }
  getHSToken() {
    var e = '';
    console.log('获取火山 getHSToken(mock) : ', e);
    return 'null' == e ? '' : e;
  }
  onGetCpm() {}
  onYSDKLoginSuccess() {
    EngineUtil.log('Java调用Js onYSDKLoginSuccess');
    EngineUtil.log('android.onYSDKLoginSuccess');
    PlayerDataSys.isYSDKLoginSuccess = true;
    EventMgr.trigger(GameEventType.SHOW_YSDK_TOAST);
  }
  onGetHSToken(e) {
    console.log('获取火山dev_token', e);
    GlobalDataSys.initToken(e);
  }
  onGetAdInfo(e) {
    console.log('回传cpm');
    console.log('回传cpm ' + e, JSON.stringify(e));
    AdManager.getInstance().onGetAdInfo(e);
  }
  onGetBdDid(e) {
    console.log('获取火山id', e);
  }
  onGetAuthorityFinish() {
    console.log('Android回调,获取用户权限完成');
    EventMgr.trigger(BaseEventType.SDKINIT_FINISH);
  }
  onVideoError(e) {
    console.log('Java调用Js onVideoError>>', e);
    AdManager.getInstance().onVideoError(e);
  }
  onVideoClose(e) {
    console.log('Java调用Js onVideoClose>>', e);
    AdManager.getInstance().onVideoClose(JSON.parse(e).data);
  }
  onVideoFinish(e) {
    EngineUtil.log('Java调用Js onVideoFinish>>', e);
    AdManager.getInstance().onVideoFinish(e);
  }
  onVideoOpensuccess(e) {
    EngineUtil.log('Java调用Js onVideoOpensuccess>>', e);
  }
  onAppStart() {
    EngineUtil.log('Java调用Js onAppStart');
    SdkHelper.reportData('app_start');
    SdkHelper.onAppStart();
  }
  onAppRestart() {
    EngineUtil.log('Java调用Js onAppReStart');
    SdkHelper.reportData('app_restart');
    SdkHelper.onAppRestart();
  }
  onAppPause() {
    EngineUtil.log('Java调用Js onAppPause');
    SdkHelper.reportData('app_pause');
    SdkHelper.onAppPause();
  }
  onAppResume() {
    EngineUtil.log('Java调用Js onAppResume');
    SdkHelper.reportData('app_resume');
    SdkHelper.onAppResume();
  }
  onAppStop() {
    console.log('Java调用Js onAppStop');
  }
  onAppDestory() {
    EngineUtil.log('Java调用Js onAppDestory');
    SdkHelper.reportData('app_destory');
  }
  onGetWechatCode(e) {
    EngineUtil.log('Java调用Js onGetWechatCode', e);
    EventMgr.trigger(BaseEventType.GET_WECHAT_CODE, e);
  }
  onSplashAdSkip() {
    EngineUtil.log('android.onSplashAdSkip');
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdFinish() {
    EngineUtil.log('android.onSplashAdFinish');
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdTimeOver() {
    EngineUtil.log('android.onSplashAdTimeOver');
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdError() {
    EngineUtil.log('android.onSplashAdError');
    EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  onSplashAdShow() {}
  onInsertAdClick() {
    console.log('onInsertAdClick');
  }
  onInsertAdClose() {
    console.log('onInsertAdClose');
    AdManager.getInstance().onInsertAdClose();
  }
  onInsertAdShow() {
    console.log('onInsertAdShow');
  }
  onGetConfig(e) {
    EngineUtil.log('Java调用Js onGetConfig', e);
    EventMgr.trigger(BaseEventType.ON_GET_MIDDLE_CFG, e);
  }
  getSMId(e) {
    EventMgr.trigger(BaseEventType.ON_GET_SM_ID, e);
  }
}
window['callAndroid'] = CallAndroid.getInstance();
