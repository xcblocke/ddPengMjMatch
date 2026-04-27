import AudioManager from './framework/controller/AudioManager';
import EngineUtil from './framework/EngineUtil';
import { PageEnum } from './framework/enum/AllEnum';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class GoldRewardPage extends BasePage {
  @property(cc.Node)
  closePageNode: cc.Node = null;
  @property(cc.Node)
  openPageNode: cc.Node = null;
  @property(cc.Label)
  mnLb: cc.Label = null;
  canClick = false;
  reward = 0;
  clickOpen() {
    var e = this;
    this.canClick = false;
    cc.tween(this.openPageNode).to(0.3, {
      y: 371.07
    }).call(function () {
      AudioManager.instance.playMusic("addbalance");
      var t = 2000 + Math.ceil(7999 * Math.random());
      EngineUtil.showNumTween(0.75, function (o) {
        e.mnLb.string = "" + Math.floor(t - (t - e.reward) * o);
      }, function () {
        e.canClick = true;
      });
      e.mnLb.string;
    }).to(0.3, {
      y: 742.843,
      opacity: 0
    }).call(function () {}).start();
  }
  async clickClose() {
    if (this.canClick) {
      await PageMgr.showPageByEnum(PageEnum.rewardToastPage, {
        red: this.reward
      });
      this.close();
      return;
    } else {
      return;
    }
  }
  _init(e) {
    AudioManager.instance.playMusic("goldRewardGuide");
    this.openPageNode.y = 0;
    this.openPageNode.opacity = 255;
    this.reward = null == e ? void 0 : e.reward;
  }
  _onHide() {
    super._onHide.call(this);
    AudioManager.instance.stopMusic("goldRewardGuide");
  }
  _onShow() {
    super._onShow.call(this);
  }
  close() {
    this._hide();
  }
}