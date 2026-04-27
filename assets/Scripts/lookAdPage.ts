import BasePage from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class lookAdPage extends BasePage {
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      endOpacity: 220
    });
  }
  _init(e) {
    this.okCb = e.okCb;
    this.cancelCb = e.cancelCb;
  }
  onBtn1() {
    AudioManager.getInstance().playMusic("btntouch");
    this.cancelCb && this.cancelCb();
    this._hide();
  }
  onBtn2() {
    AudioManager.getInstance().playMusic("btntouch");
    this.okCb && this.okCb();
    this._hide();
  }
}