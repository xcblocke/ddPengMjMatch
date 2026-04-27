import { DebugType } from './framework/debug/DebugConfig';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class DebugItem extends cc.Component {
  @property(cc.Node)
  inputNode: cc.Node = null;
  @property(cc.Node)
  buttonNode: cc.Node = null;
  @property(cc.Node)
  toggleNode: cc.Node = null;
  @property(cc.Node)
  sliderNode: cc.Node = null;
  @property(cc.Node)
  showTextNode: cc.Node = null;
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property(cc.Label)
  btnLabel: cc.Label = null;
  @property(cc.Label)
  watchLabel: cc.Label = null;
  watchTimer = null;
  watchValueFunc = null;
  init(e) {
    var t, o, n, a, i, c;
    this.titleLabel.string = e.title;
    this.func = e.func;
    this.inputNode.active = e.type === DebugType.EditBox;
    this.buttonNode.active = e.type === DebugType.Button;
    this.toggleNode.active = e.type === DebugType.Toggle;
    this.sliderNode.active = e.type === DebugType.Slider;
    this.watchLabel.node.active = e.type === DebugType.Watch;
    this.showTextNode.active = e.type === DebugType.showText;
    this.btnLabel.string = (null === (t = e.params) || void 0 === t ? void 0 : t.btnLabel) || "触发";
    this.sliderNode.getComponentsInChildren(cc.Slider)[0].progress = (null === (o = e.params) || void 0 === o ? void 0 : o.progress) || 0;
    this.toggleNode.getComponentsInChildren(cc.Toggle)[0].isChecked = (null === (n = e.params) || void 0 === n ? void 0 : n.toggle) || false;
    this.inputNode.getComponentsInChildren(cc.EditBox)[0].string = (null === (a = e.params) || void 0 === a ? void 0 : a.editBox) || "";
    if (e.type === DebugType.Watch) {
      this.watchValueFunc = null === (i = e.params) || void 0 === i ? void 0 : i.watchValue;
      this.startWatch((null === (c = e.params) || void 0 === c ? void 0 : c.watchInterval) || 500);
    }
  }
  start() {}
  startWatch(e) {
    var t = this;
    this.watchValueFunc && (this.watchTimer = setInterval(function () {
      try {
        var e = t.watchValueFunc();
        t.watchLabel.string = "" + e;
      } catch (e) {
        t.watchLabel.string = "错误: " + e.message;
      }
    }, e));
  }
  stopWatch() {
    if (this.watchTimer) {
      clearInterval(this.watchTimer);
      this.watchTimer = null;
    }
  }
  event() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    if (e[0] instanceof cc.Slider) {
      this.func(this, e[0].progress);
    } else {
      if (e[0] instanceof cc.Toggle) {
        this.func(this, e[0].isChecked);
      } else {
        if (e[1] instanceof cc.EditBox) {
          this.func(this, e[0]);
        } else {
          this.func(this);
        }
      }
    }
  }
  onDestroy() {
    this.stopWatch();
  }
}