import CallAndroid from '../Event/CallAndroid';
import SdkHelper from '../SdkHelper';
import EventMgr from '../Event/EventMgr';
import BaseEventType from '../controller/BaseEventType';
import CalliOS from '../Event/CalliOS';
import EngineUtil from '../EngineUtil';
import GlobaldataMgr from '../data/GlobaldataMgr';
import AudioManager from '../controller/AudioManager';
import GlobalApp from '../../common/GlobalApp';
export default class AdManager {
  noAdTest = false;
  videoSuccessFun = null;
  videoFailFun = null;
  insertCloseFun = null;
  splash_timer = null;
  splash_finished = false;
  lastTouchDate = 0;
  interval = 2;
  adBack = false;
  cpm_data = {
    activity_num: "",
    activity_date: "",
    cpm: 1,
    isApp: "true",
    source: "test",
    unitId: "",
    isClose: ""
  };
  static _instance = null;
  static getInstance() {
    this._instance || (this._instance = new AdManager());
    return this._instance;
  }
  init() {
    this.addEvent();
  }
  onGetAdInfo(e) {
    if (e) {
      var t = (e = JSON.parse(e)).cpm,
        o = e.source,
        n = e.unitId,
        i = e.isApp,
        r = e.isClose,
        c = EngineUtil.formatDate(new Date().getTime()),
        l = SdkHelper.getActivityNumByDate(c);
      this.cpm_data = {
        cpm: t,
        isApp: i,
        source: o,
        unitId: n,
        isClose: r,
        activity_date: c,
        activity_num: l
      };
    }
  }
  addEvent() {
    EventMgr.listen(BaseEventType.SPLASH_SHOW, this.clearSplashTimer, this);
    EventMgr.listen(BaseEventType.SPLASH_FINISH, this.splashFinish, this);
  }
  clearSplashTimer() {
    this.splash_timer && clearTimeout(this.splash_timer);
  }
  splashFinish() {
    this.splash_finished = true;
  }
  showSplashAd(e) {
    var t = this;
    if (cc.sys.isNative && !this.noAdTest) {
      if (cc.sys.os != cc.sys.OS_ANDROID) {
        this.splash_timer && clearTimeout(this.splash_timer);
        this.splash_timer = setTimeout(function () {
          t.splash_finished || EventMgr.trigger(BaseEventType.SPLASH_FINISH);
        }, 5000);
        this.adBack = true;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
          CallAndroid.getInstance().showSplashAd({
            bottom: e
          });
        } else {
          cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().showSplashAd({
            bottom: e
          });
        }
      } else this.loadNewSplashAd(1, 0);
    } else EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  preloadSplashWf() {
    cc.sys.os === cc.sys.OS_ANDROID && CallAndroid.getInstance().preloadSplashWf();
  }
  loadNewSplashAd(e, t) {
    var o = this;
    console.log("展示开屏>AD");
    if (cc.sys.isNative) {
      this.splash_timer && clearTimeout(this.splash_timer);
      this.splash_timer = setTimeout(function () {
        o.splash_finished || EventMgr.trigger(BaseEventType.SPLASH_FINISH);
      }, 5000);
      this.adBack = true;
      if (cc.sys.os == cc.sys.OS_ANDROID) {
        CallAndroid.getInstance().loadNewSplashAd(e, t);
      } else {
        cc.sys.os, cc.sys.OS_IOS;
      }
    } else EventMgr.trigger(BaseEventType.SPLASH_FINISH);
  }
  closeSplashAd() {
    cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && CallAndroid.getInstance().closeSplashAd();
  }
  reloadInsertAd() {
    GlobaldataMgr.reviewing_insert_ad || cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && CallAndroid.getInstance().preloadWfUnionInteractionAd();
  }
  showInsertAd(e) {
    if (!GlobaldataMgr.reviewing_insert_ad) {
      EngineUtil.log("播放插屏android");
      if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
          this.insertCloseFun = e || null;
          CallAndroid.getInstance().showInsertAd();
        }
      } else e && e();
    }
  }
  onInsertAdClick() {
    console.log("onInsertAdClick");
  }
  onInsertAdClose() {
    console.log("onInsertAdClose");
    this.insertCloseFun && this.insertCloseFun();
  }
  onInsertAdShow() {
    console.log("onInsertAdShow");
  }
  showImgAd() {
    cc.sys.isNative && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().showImgAd());
  }
  closeImgAd() {
    cc.sys.isNative && (cc.sys.os == cc.sys.OS_ANDROID ? CallAndroid.getInstance().closeImgAd() : cc.sys.os == cc.sys.OS_IOS && CalliOS.getInstance().closeImgAd());
  }
  playVideoAd(e, t, o = false) {
    var a = this;
    var i = new Date().getTime() / 1000;
    i < this.lastTouchDate && (this.lastTouchDate = i);
    if (this.lastTouchDate && i - this.lastTouchDate < this.interval) {
      setTimeout(function () {
        a.doVideoFail({
          throttled: true
        });
      }, 0);
      return;
    }
    this.lastTouchDate = i;
    if (cc.sys.isBrowser || !cc.sys.isNative || this.noAdTest) {
      e && e();
      return;
    }
    this.adBack = true;
    this.videoSuccessFun = e;
    this.videoFailFun = t;
    var r = {
      is_force: o,
      slotId: 0
    };
    GlobalApp.AdSchedule.startSchedule(function () {
      a.doVideoFail(r);
    });
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      CallAndroid.getInstance().showRewardVideoAd(JSON.stringify(r));
    } else {
      CalliOS.getInstance().showRewardVideoAd(r);
    }
  }
  onVideoFinish(e) {
    console.log("广告播放完成", e);
    GlobalApp.AdSchedule.stopSchedule();
  }
  onVideoClose(e) {
    var t = this,
      o = e.isReward;
    console.log("onVideoClose", e, JSON.stringify(e), o);
    GlobalApp.AdSchedule.stopSchedule();
    if (o) {
      setTimeout(function () {
        if (t.videoSuccessFun) {
          t.videoSuccessFun(e);
          t.videoSuccessFun = null;
        }
      }, 300);
    } else {
      this.doVideoFail(e);
    }
    cc.sys.os == cc.sys.OS_IOS && AudioManager.getInstance().playMusic("bg", true, true);
  }
  onVideoError(e) {
    SdkHelper.reportData("on_vide_error", {
      ad_type: e.ad_type
    });
    GlobalApp.AdSchedule.stopSchedule();
    this.doVideoFail(e);
    SdkHelper.showToast(`gkey_303`);
  }
  doVideoFail(e) {
    var t = this;
    GlobalApp.AdSchedule.stopSchedule();
    setTimeout(function () {
      if (t.videoFailFun) {
        t.videoFailFun(e);
        t.videoFailFun = null;
      }
    }, 300);
  }
  preLoadGraphicAd() {}
  preLoadHomeAd() {}
  showHomeAd() {}
  closeHomeAd() {}
  preLoadBannerAd() {}
  showBannerAd(e) {
    var t = cc.view.getFrameSize(),
      o = cc.winSize;
    console.log("frameSize", t.width, t.height);
    console.log("winSize", o.width, o.height);
    var a = t.height > 2000 ? 1.03 : 1,
      i = 0.9135802469135802 * t.width * a,
      r = 0.25925925925925924 * t.width * a,
      c = t.width / o.width;
    console.log("bannerSize", i, r, c);
    t.width;
    var s = (o.height - e) * c - r,
      l = e * c;
    CallAndroid.getInstance().showBannerAd(0, s, 0, l, i, r);
  }
  clear() {
    EventMgr.ignore(BaseEventType.SPLASH_SHOW, this.clearSplashTimer, this);
    EventMgr.ignore(BaseEventType.SPLASH_FINISH, this.clearSplashTimer, this);
  }
}