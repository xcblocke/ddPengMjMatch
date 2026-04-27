import AudioManager from './framework/controller/AudioManager';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdDescribePage extends BasePage {
  @property(cc.RichText)
  desc: cc.RichText = null;
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  _init(e) {
    this.scrollView.scrollToTop(0);
    if (e) {
      var t = e.des;
      this.desc.string = t;
    }
  }
  click_close() {
    AudioManager.getInstance().playMusic("btntouch");
    this._hide();
  }
}