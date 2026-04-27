import AudioManager from './framework/controller/AudioManager';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class levelClearPayoutsPage extends BasePage {
  @property(cc.Node)
  contentNode: cc.Node = null;
  @property(cc.Node)
  btnNode: cc.Node = null;
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init() {
    AudioManager.instance.playCash("first");
    this.playAnim();
  }
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.FADE,
      blackTime: 0.2,
      pageTime: 0.2
    });
  }
  playAnim() {
    var e = this;
    this.btnNode.active = false;
    this.contentNode.children.forEach(function (t, o) {
      t.x = -1000;
      cc.tween(t).delay(0.1 * o).to(0.5, {
        x: 0
      }, {
        easing: "backInOut"
      }).call(function () {
        o == e.contentNode.children.length - 1 && (e.btnNode.active = true);
      }).start();
    });
  }
  async close() {
    AudioManager.instance.stopCash("first");
    this._hide();
    return;
  }
}