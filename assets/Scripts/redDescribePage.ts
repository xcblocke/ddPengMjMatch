import AudioManager from './framework/controller/AudioManager';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class redDescribePage extends BasePage {
  @property(cc.Label)
  des: cc.Label = null;
  _init(e) {
    this.des.string = e.desc;
  }
  click_close() {
    AudioManager.getInstance().playMusic("btntouch");
    this._hide();
  }
}