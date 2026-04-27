import { Constants } from './Constants';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass("SizeFill")
export class SizeFill extends cc.Component {
  @property({
    type: cc.Float
  })
  maxWidth: number = 0;
  privPercent = -1;
  onLoad() {
    0 == this.maxWidth && (this.maxWidth = this.node.width);
  }
  setFill(e) {
    e = Constants.Clamp01(e);
    this.node.width = this.maxWidth * e;
    this.privPercent = e;
  }
  animTo(e) {
    var t = this;
    if (-1 == this.privPercent) this.setFill(e);else {
      var o = this.privPercent;
      cc.tween(this.node).to(0.1, {}, {
        onUpdate: function (n, a) {
          t.setFill(o + (e - o) * a);
        },
        easing: "linear"
      }).start();
    }
  }
}