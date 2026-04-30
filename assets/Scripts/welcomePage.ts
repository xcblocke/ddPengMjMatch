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
  }
  close() {
    this._hide();
  }
}