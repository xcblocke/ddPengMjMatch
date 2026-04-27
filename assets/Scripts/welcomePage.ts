import AudioManager from './framework/controller/AudioManager';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class welcomePage extends BasePage {
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init() {
    AudioManager.instance.playMusic("first_1");
  }
  close() {
    AudioManager.instance.stopMusic("first_1", false);
    this._hide();
  }
}