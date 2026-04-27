import Service from '../../service/Service';
import GlobaldataMgr from '../data/GlobaldataMgr';
import BaseEventType from './BaseEventType';
import EventMgr from '../Event/EventMgr';
import HotUpdate from '../Event/HotUpdate';
import ClientData from '../Event/ClientData';
import SdkHelper from '../SdkHelper';
import { USER_AGREEMENT, PRIVACY_AGREEMENT } from '../SystemConfig';
import EngineUtil from '../EngineUtil';
class _GlobalDataSys {
  game_time = 0;
  insertAdTimer = null;
  nextPlayInsert = false;
  initInsertTimer = false;
  dev_token = cc.sys.localStorage.getItem("dev_token") || "";
  static _instance = null;
  constructor() {
    EventMgr.listen(BaseEventType.ON_GET_SM_ID, this.onGetSmId, this);
  }
  static _getInstance() {
    this._instance || (_GlobalDataSys._instance = new _GlobalDataSys());
    return _GlobalDataSys._instance;
  }
  init() {
    this.resetGameTime();
  }
  onGetSmId(e) {
    console.log("数盟上报", e);
    SdkHelper.reportData("shumeng_report", {
      id: e
    });
    Service.ShuMengReport({
      did: e
    }, function () {});
  }
  appPause() {
    GlobaldataMgr.pauseTime = EngineUtil.getTimeStamp();
  }
  updeteGameTime() {
    var e = EngineUtil.getTimeStamp() - this.game_time;
    SdkHelper.reportData("game_time", {
      time: e
    });
    this.game_time = EngineUtil.getTimeStamp();
  }
  resetGameTime() {
    this.game_time = EngineUtil.getTimeStamp();
  }
  getPauseTime() {
    return GlobaldataMgr.pauseTime;
  }
  clearPauseTime() {
    GlobaldataMgr.pauseTime = 0;
  }
  initInsertAd() {
    if (!this.initInsertTimer) {
      this.initInsertTimer = true;
      this.resetInsertAd();
    }
  }
  resetInsertAd() {
    var e = this;
    this.nextPlayInsert = false;
    if (this.insertAdTimer) {
      clearTimeout(this.insertAdTimer);
      this.insertAdTimer = null;
    }
    this.insertAdTimer = setTimeout(function () {
      e.nextPlayInsert = true;
      console.log("插屏设置成播放");
    }, 60000);
    EngineUtil.log("重置插屏倒计时~", this.nextPlayInsert);
  }
  clearInsertTimer() {
    if (this.insertAdTimer) {
      clearTimeout(this.insertAdTimer);
      this.insertAdTimer = null;
      this.nextPlayInsert = false;
    }
  }
  getUserAgreement(e = false, t = false, o = false) {
    this.getClientData();
    var n = USER_AGREEMENT;
    HotUpdate.getInstance().isOnlineRelease() || (n += "&debug=true");
    GlobaldataMgr.reviewing && (n += "&rule=1");
    t && (n += "&isWxLoginPage=1");
    e && (n += "&isAgreeMentPage=1");
    return (n += o ? "&fd=1" : "&fd=" + (GlobaldataMgr.reviewing ? 1 : 0)) + "&" + SdkHelper.getUrlSplicingString();
  }
  getPrivacyAgreement(e = false, t = false, o = false) {
    this.getClientData();
    var n = PRIVACY_AGREEMENT;
    return (n += o ? "&fd=1" : "&fd=" + (GlobaldataMgr.reviewing ? 1 : 0)) + "&" + SdkHelper.getUrlSplicingString();
  }
  getClientData() {
    console.log("------获取客户端数据,版本号", ClientData.version_name);
    "" == ClientData.channel_name && (ClientData.channel_name = SdkHelper.getChannelName());
    "" == ClientData.version_name && (ClientData.version_name = SdkHelper.getVersionName());
    0 == ClientData.version_code && (ClientData.version_code = SdkHelper.getVersionCode());
    ClientData.genUrlString();
  }
  initToken(e) {
    if (e && "null" != e) {
      this.dev_token = e;
      cc.sys.localStorage.setItem("dev_token", e);
    } else !cc.sys.isBrowser && cc.sys.isNative && console.warn("获取到火山dev_token为空" + e);
  }
}
export default _GlobalDataSys._getInstance();