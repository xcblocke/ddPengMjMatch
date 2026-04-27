import PlayerDataSys from './framework/controller/PlayerDataSys';
import SdkHelper from './framework/SdkHelper';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class helpCenterPage extends BasePage {
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Node)
  bgTitle: cc.Node = null;
  @property(cc.WebView)
  web: cc.WebView = null;
  _onCallback = false;
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.NONE
    });
    this.bg.width = cc.winSize.width;
    this.bg.height = cc.winSize.height;
    this.bgTitle.y = cc.winSize.height / 2;
    this.web.node.width = cc.winSize.width - 5;
    this.web.node.height = cc.winSize.height - 135;
  }
  start() {
    if (!this._onCallback) {
      this.web.setJavascriptInterfaceScheme("hxcc");
      this.web.setOnJSCallback(function (e, t) {
        console.log("XXxXX:>> web view callback :[" + t + "]");
        switch (t.replace("hxcc://", "")) {
          case "kefu":
            console.log("XXxXX:>> web view open kefu");
            var o = PlayerDataSys.headimgurl,
              n = PlayerDataSys.nickname,
              a = PlayerDataSys.gender;
            SdkHelper.reportData("open_kefu");
            SdkHelper.feedback(n, o, a);
        }
      });
      this._onCallback = true;
    }
  }
  _init(e) {
    var t = e.url;
    this.web.url = t;
  }
  webCall() {
    SdkHelper.showToast("网络异常，请检查网络~");
  }
  close() {
    this.web.node.off("error", this.webCall, this);
    this._hide();
  }
}