import PlayerDataSys from '../framework/controller/PlayerDataSys';
import SdkHelper from '../framework/SdkHelper';
import EngineUtil from '../framework/EngineUtil';
import { privacy } from '../config';
import PageBase from './PageBase';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class Page4 extends PageBase {
  @property(cc.WebView)
  webView: cc.WebView = null;
  @property(cc.Label)
  versionLb: cc.Label = null;
  @property(cc.Label)
  title: cc.Label = null;
  @property(cc.Label)
  privacyLb: cc.Label = null;
  @property(cc.EditBox)
  page4Editbox: cc.EditBox = null;
  onLoad() {
    this.versionLb.string = SdkHelper.getVersionName();
    var e = PlayerDataSys.getPrivacyAgreementUrl();
    this.webView.url = e;
    this.privacyLb.string = privacy;
  }
  initUI() {
    var e = this.node.getChildByName("nodeStory1"),
      t = this.node.getChildByName("nodeStory2"),
      o = this.node.getChildByName("nodeStory3"),
      n = this.node.getChildByName("nodeStory4");
    e.active = false;
    t.active = false;
    o.active = false;
    n.active = false;
    this.page4Editbox.string = "";
  }
  setTitle(e) {
    this.title.string = e;
  }
  setTip() {}
  showPop(e, t) {
    this.initUI();
    this.node.getChildByName(t).active = true;
  }
  closePop() {
    this.node.getChildByName("nodeStory1").active = false;
    this.node.getChildByName("nodeStory2").active = false;
    this.node.getChildByName("nodeStory3").active = false;
    this.node.getChildByName("nodeStory4").active = false;
  }
  onBtnFeedbackSuccess() {
    console.log(`gkey_467`);
    EngineUtil.showCocosToast3("反馈成功");
  }
}