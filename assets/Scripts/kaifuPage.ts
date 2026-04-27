import BasePage from './view/BasePage';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class kaifuPage extends BasePage {
  @property(cc.Node)
  bd: cc.Node = null;
  @property(cc.Node)
  root: cc.Node = null;
  _pos0 = null;
  _pos1 = null;
  _cb = null;
  _init(e) {
    this._cb = null == e ? void 0 : e.cb;
    this.initHead();
  }
  endShow() {
    this._cb && this._cb();
    this._hide();
  }
  initHead() {
    var e = this;
    this.root.destroyAllChildren();
    var t = cc.instantiate(this.bd);
    t.name = "border";
    t.active = true;
    t.setPosition(this.bd.getPosition());
    this.root.addChild(t);
    for (var o = 0; o < 7; o++) {
      var n = cc.find("t" + o, t),
        a = cc.find("headnode/head", n);
      EngineUtil.setNodeSprieFrame(a, "heads/" + o);
      if (0 == o) {
        cc.tween(n).parallel(cc.tween(n).by(0.8, {
          position: cc.v3(-111, 0, 0)
        }), cc.tween(n).to(0.8, {
          scale: 0.5
        })).start();
      } else {
        if (6 == o) {
          cc.tween(n).parallel(cc.tween(n).by(0.8, {
            position: cc.v3(-111, 0, 0)
          }), cc.tween(n).to(0.8, {
            scale: 1
          })).delay(1).call(function () {
            e.endShow();
          }).start();
        } else {
          cc.tween(n).by(0.8, {
            position: cc.v3(-111, 0, 0)
          }).start();
        }
      }
    }
    for (o = 0; o < 3; o++) for (var i = cc.find("content/r" + (o + 1), this.node), r = 0; r < 6; r++) {
      var s = cc.find("t" + r + "/headnode/head", i),
        l = "heads/" + (7 + 6 * o + r);
      EngineUtil.setNodeSprieFrame(s, l);
    }
  }
}