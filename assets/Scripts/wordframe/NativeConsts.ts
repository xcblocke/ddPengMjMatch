export class NativeConsts {
  static isAndroid = cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID;
  static isIOS = cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS;
  static get NativeClassPath() {
    return this.isAndroid ? "org.cocos2dx.javascript.bridge.JSFunction" : this.isIOS ? "NativeOcClass" : "";
  }
  static get callNative() {
    return NativeConsts.isAndroid ? "callNative" : "callNative:";
  }
  static get appInfo() {
    return NativeConsts.isAndroid ? "getCommentInfo" : "getCommentInfo:";
  }
  static get openNativeView() {
    return NativeConsts.isAndroid ? "openNativeView" : "openNativeView:";
  }
  static get openWebView() {
    return NativeConsts.isAndroid ? "openWebView" : "openWebView:";
  }
  static get sensorHit() {
    return NativeConsts.isAndroid ? "sensorHit" : "sensorHit:";
  }
  static get copyText() {
    return NativeConsts.isAndroid ? "copyText" : "copyText:";
  }

  static get onClientCallCocos() {
    return NativeConsts.isAndroid ? "onClientCallCocos" : "onClientCallCocos:";
  }

  static get getTDBlackBox() {
    return NativeConsts.isAndroid ? "getTDBlackBox" : "getTDBlackBox:";
  }

  static get Rsa() {
    return NativeConsts.isAndroid ? "RsaService" : "RsaService:";
  }
  static get RsaCallBack() {
    return NativeConsts.isAndroid ? "RsaCallback" : "RsaCallback:";
  }
  static get deviceVibrate() {
    return NativeConsts.isAndroid ? "deviceVibrate" : "deviceVibrate:";
  }
  static get openAgreement() {
    return NativeConsts.isAndroid ? "openAgreement" : "openAgreement:";
  }
  static get openPrivacy() {
    return NativeConsts.isAndroid ? "openPrivacy" : "openPrivacy:";
  }
  static get openKefu() {
    return NativeConsts.isAndroid ? "openKefu" : "openKefu:";
  }
  static get openChat() {
    return NativeConsts.isAndroid ? "openChat" : "openChat:";
  }
  static get checkVersion() {
    return NativeConsts.isAndroid ? "checkVersion" : "checkVersion:";
  }
  static get openAbout() {
    return NativeConsts.isAndroid ? "openAbout" : "openAbout:";
  }
  static get logoutApp() {
    return NativeConsts.isAndroid ? "logoutApp" : "logoutApp:";
  }
  static get unregistApp() {
    return NativeConsts.isAndroid ? "unRegist" : "unRegist:";
  }
  static get userSessionTimeout() {
    return NativeConsts.isAndroid, "userSessionTimeout";
  }
}
