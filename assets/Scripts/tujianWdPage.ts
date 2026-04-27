import AudioManager from './framework/controller/AudioManager';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class tujianWdPage extends BasePage {
  @property(cc.Sprite)
  time_circle: cc.Sprite = null;
  @property(cc.Label)
  time_label: cc.Label = null;
  @property(cc.Node)
  titleLy: cc.Node = null;
  @property(cc.Label)
  cash_num: cc.Label = null;
  cb = null;
  wd_status = false;
  extract_status = 0;
  cash_threshold = false;
  levle_threshold = false;
  timerCallback = null;
  amount = 0;
  type = "";
  _init(e) {
    var t = this;
    this.cb = null == e ? void 0 : e.cb;
    this.amount = null == e ? void 0 : e.amount;
    this.type = null == e ? void 0 : e.type;
    this.cash_num.string = "" + this.amount;
    this.time_circle.fillRange = 1;
    this.titleLy.children.forEach(function (e, o) {
      e.active = o == Number(t.type) - 1;
    });
    this.time_circle.node.stopAllActions();
    cc.tween(this.time_circle).to(4, {
      fillRange: 0
    }).call(function () {
      t.goWidthDraw(null, true);
    }).start();
    var o = 3;
    this.time_label.string = "4";
    this.unscheduleAllCallbacks();
    this.timerCallback = this.schedule(function () {
      t.time_label.string = "" + o--;
    }, 1, 3);
  }
  goWidthDraw(e, t = false) {
    t || AudioManager.getInstance().playMusic("btntouch");
    this.unschedule(this.timerCallback);
    this.wd_status = true;
    AudioManager.getInstance().stopCash("finish_step_wd");
    this.cb && this.cb();
    this._hide();
  }
}