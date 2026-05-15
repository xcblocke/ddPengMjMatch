// import { AutoConfig } from "../utils/AutoConfig";
// import { gamebase } from "../../frame/event/Boot";

import { AutoConfig } from "./AutoConfig";

const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export class HttpHeaderMessage {
  product = "qzrymm";
  appId = "1824";
  pkgId = "1429";
  accessKey = "06dd7eee8606cc93e1a80840fcc3e930_2570706237";
  accept = "default";
  ass_token = "";
  appVersion = "1.0.0";
  brand = "default";
  bs = "default";
  gps = "default";
  os = "android";
  deviceId = "";
  osVersion = "default";
  romVersion = "default";
  oaid = "";
  channel = "default";
  isPass = false;
  isNewUser = 0;
  channelUser = 0;
  env = "production";
  userId = "";
  isPassAndMarket = 1;
  hotVersion = "";
  blackBox = "";
  currentChannel = "default";
  isAnonymous = false;
  VERSION_CODE = 100;
  BLACK_OCPC = "0";
  MAX_ECPM = 50;
  HEAD_MODEL = "";
  HEAD_USERAGENT = "";
  caid = "";
  mac = "";
  androidId = "";
  hostSuffix = "hnshamu.com";
  version = "v2";
}
@ccclass
export default class DataManager {
  resVersion = "100";
  m_headerMessage:HttpHeaderMessage = null;
  bulletScreen = true;
  touchShockState = true;
  BLACK_CHAT = "qq";
  gCompany = "";
  static _m_instance: DataManager = null;
  static getInstance() {
    if (null == this._m_instance) {
      this._m_instance = new DataManager();
      // gamebase.data_manager = this;
    }
    return this._m_instance;
  }

  initConfig() {
    this.m_headerMessage = new HttpHeaderMessage();
    if ("production" == this.m_headerMessage.env) {
      this.resVersion = "100";
    } else {
      this.resVersion = "debug_101";
    }
  }
  setAppInfo(e) {
    if (e) {
      this.m_headerMessage || (this.m_headerMessage = new HttpHeaderMessage());
      this.m_headerMessage.appId = e.appId;
      this.m_headerMessage.accessKey = e.accessKey;
      this.m_headerMessage.deviceId = e.deviceId;
      this.m_headerMessage.brand = e.brand;
      this.m_headerMessage.gps = e.gps;
      this.m_headerMessage.bs = e.bs;
      this.m_headerMessage.appVersion = e.appVersion;
      this.m_headerMessage.os = e.os;
      this.m_headerMessage.channel = e.channel;
      this.m_headerMessage.romVersion = e.romVersion;
      this.m_headerMessage.osVersion = e.osVersion;
      this.m_headerMessage.pkgId = e.pkgId;
      this.m_headerMessage.env = e.env;
      this.m_headerMessage.userId = e.userId;
      this.m_headerMessage.appId = e.appId;
      this.m_headerMessage.oaid = e.oaid;
      this.m_headerMessage.isPass = "1" == e.isPass;
      this.m_headerMessage.isNewUser = parseInt(e.isNewUser);
      this.m_headerMessage.channelUser = parseInt(e.channelUser);
      this.m_headerMessage.isPassAndMarket = parseInt(e.isPassAndMarket);
      this.m_headerMessage.hotVersion = AutoConfig.hotVersion;
      this.m_headerMessage.currentChannel = e.currentChannel;
      this.m_headerMessage.isAnonymous = "1" == e.isAnonymous;
      null != this.m_headerMessage.currentChannel && null != this.m_headerMessage.currentChannel || (this.m_headerMessage.currentChannel = this.m_headerMessage.channel);
      "default" == this.m_headerMessage.appVersion && (this.m_headerMessage.appVersion = "1.0.0");
      null != this.m_headerMessage.isNewUser && null != this.m_headerMessage.isNewUser || (this.m_headerMessage.isNewUser = 0);
      null != this.m_headerMessage.channelUser && null != this.m_headerMessage.channelUser || (this.m_headerMessage.channelUser = 0);
      null != this.m_headerMessage.isPassAndMarket && null != this.m_headerMessage.isPassAndMarket || (this.m_headerMessage.isPassAndMarket = 1);
      null != e.VERSION_CODE && (this.m_headerMessage.VERSION_CODE = parseInt(e.VERSION_CODE));
      null != e.BLACK_OCPC && (this.m_headerMessage.BLACK_OCPC = e.BLACK_OCPC);
      if (null != e.MAX_ECPM) {
        this.m_headerMessage.MAX_ECPM = parseInt(e.MAX_ECPM);
        console.log("Max eCPM: " + this.m_headerMessage.MAX_ECPM);
      }
      null != e.HEAD_MODEL && (this.m_headerMessage.HEAD_MODEL = e.HEAD_MODEL);
      null != e.HEAD_USERAGENT && (this.m_headerMessage.HEAD_USERAGENT = e.HEAD_USERAGENT);
      null != e.caid && (this.m_headerMessage.caid = e.caid);
      null != e.MAC && (this.m_headerMessage.mac = e.MAC);
      null != e.BLACK_CHAT && (this.BLACK_CHAT = e.BLACK_CHAT);
      null != e.Company && (this.gCompany = e.Company);
      null != e.androidId && (this.m_headerMessage.androidId = e.androidId);
      null != e.hostSuffix && (this.m_headerMessage.hostSuffix = e.hostSuffix);
      console.log("Host suffix: " + e.hostSuffix);
    }
  }
  getHttpHeaderMessage() {
    return this.m_headerMessage;
  }
  getIsEditorPlatform() {
    return cc.sys.platform === cc.sys.DESKTOP_BROWSER || cc.sys.platform === cc.sys.MOBILE_BROWSER;
  }
  getServerUrl() {
    return "production" == this.m_headerMessage.env ? this.m_headerMessage.hostSuffix && this.m_headerMessage.hostSuffix.length > 0 ? "https://bp-api." + this.m_headerMessage.hostSuffix : "https://bp-api.shinet.cn" : "http://bp-api.coohua.top";
  }
  getGameVersion() {
    return this.m_headerMessage.appVersion + "(" + this.resVersion + ")";
  }
  getAppVersion() {
    return "" + this.m_headerMessage.appVersion;
  }
  getUserId() {
    return this.m_headerMessage.userId;
  }
  getIsPassAndMarket() {
    return this.m_headerMessage.isPassAndMarket;
  }
  getIsPassIos() {
    return this.m_headerMessage.isPass;
  }
  isDebug() {
    return "production" != this.m_headerMessage.env;
  }
  getProduct() {
    return this.m_headerMessage.product;
  }
  isCurVersionAboveVersion(e) {
    return this._compareVersions(this.m_headerMessage.appVersion, e) <= 0;
  }
  getGCompany() {
    return this.gCompany;
  }
  user_id() {
    return this.m_headerMessage.accessKey.split("_")[1];
  }
  app_id() {
    return this.m_headerMessage.appId;
  }
  _compareVersions(e, t) {
    for (var a = e.split("."), n = t.split("."), o = 0; o < a.length; ++o) {
      var i = parseInt(a[o]),
        r = parseInt(n[o] || "0");
      if (i > r) return -1;
      if (i < r) return 1;
    }
    return a.length === n.length ? 0 : a.length > n.length ? -1 : 1;
  }
}
