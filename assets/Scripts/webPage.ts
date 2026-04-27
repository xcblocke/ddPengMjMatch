import AudioManager from './framework/controller/AudioManager';
import BaseSystem from './framework/controller/BaseSystem';
import SdkHelper from './framework/SdkHelper';
import BasePage, { AnimType } from './view/BasePage';
import PlayerDataSys from './framework/controller/PlayerDataSys';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class webPage extends BasePage {
  @property(cc.WebView)
  webView: cc.WebView = null;
  @property(cc.Node)
  ysxx: cc.Node = null;
  @property(cc.Node)
  yhxy: cc.Node = null;
  onLoad() {
    this._animInit({
      animType: AnimType.NONE,
      blackTime: 0.1
    });
    super.onLoad.call(this);
    this.webView.node.on("error", this.webCall, this);
  }
  _init(e) {
    var t = e.title,
      o = e.noReport,
      n = void 0 !== o && o,
      a = e.index,
      i = e.is_first,
      r = e.url;
    console.log("url:", r);
    this.ysxx.active = false;
    this.yhxy.active = false;
    switch (a) {
      case 0:
        SdkHelper.reportData("open_UserAgreement");
        this.yhxy.active = true;
        break;
      case 1:
        SdkHelper.reportData("open_PrivacyAgreement");
        this.ysxx.active = true;
        break;
      default:
        return;
    }
    i || PlayerDataSys.is_reviewer;
    this.webView.url = r;
    this.agreementForce(t, n);
  }
  agreementForce(e, t = false) {
    if ("实名认证规则" != e) {
      var o = "";
      if ("用户协议" == e) {
        o = "user";
        if (t) {
          cc.sys.localStorage.setItem("user_LastAgreement", this.webView.url);
          return;
        }
      } else {
        if ("隐私政策" != e) return;
        o = "privacy";
        if (t) {
          cc.sys.localStorage.setItem("user_LastPrivacy", this.webView.url);
          return;
        }
      }
      console.log("agreementForce requesData\nurl=" + this.webView.url + "\ntype=" + o);
      BaseSystem.agreementForce({
        url: this.webView.url,
        type: o
      });
    }
  }
  webCall() {
    SdkHelper.showToast("网络异常，请检查网络~");
  }
  close() {
    AudioManager.getInstance().playMusic("btntouch");
    this.webView.node.off("error", this.webCall, this);
    this._hide();
  }
}