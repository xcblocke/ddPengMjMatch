import AudioManager from '../framework/controller/AudioManager';
import { Res } from '../common/ResourcesManager';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class clearPropEffect extends cc.Component {
  @property(sp.Skeleton)
  spine1: sp.Skeleton = null;
  @property(cc.Node)
  lizi1: cc.Node = null;
  @property(cc.Node)
  lizi2: cc.Node = null;
  @property(sp.Skeleton)
  spine2: sp.Skeleton = null;
  @property(sp.Skeleton)
  spine3: sp.Skeleton = null;
  @property(cc.Node)
  lizi3: cc.Node = null;
  @property(cc.Sprite)
  blocks: cc.Sprite = [];
  cb = null;
  onLoad() {
    var e = this;
    AudioManager.getInstance().playMusic("magic");
    this.spine1.setEventListener(function (t, o) {
      if ("lizi" == o.data.name) {
        e.lizi1.active = false;
        e.lizi2.active = true;
        setTimeout(function () {
          e.spine1.node.active = false;
          setTimeout(function () {
            e.spine3.node.active = true;
            e.spine2.node.active = true;
            AudioManager.getInstance().playMusic("shandian");
            e.spine2.setAnimation(0, "2", false);
            e.spine3.setAnimation(0, "2", false);
          }, 200);
          e.cb && e.cb();
        }, 500);
      }
    });
    this.spine2.setEventListener(function (t, o) {
      if ("lizi-2" == o.data.name) {
        e.spine2.node.active = false;
        e.spine3.node.active = false;
        e.lizi3.active = true;
      }
    });
  }
  initData(e) {
    var t = Res.getIconSpriteFrame("tile_" + e);
    if (t) for (var o = 0; o < this.blocks.length; o++) this.blocks[o].spriteFrame = t;
  }
  playAnim(e) {
    this.cb = e;
    this.spine1.node.active = true;
    this.spine1.setAnimation(0, "animation", false);
  }
  getWposList() {
    for (var e = [{
        x: 0,
        y: 375.9
      }, {
        x: -156.84,
        y: 239.4
      }, {
        x: 156.25,
        y: 239.4
      }], t = [], o = 0; o < this.blocks.length; o++) {
      var n = this.blocks[o].node.position;
      n.x += e[o].x;
      n.y += e[o].y;
      t.push(this.blocks[o].node.parent.convertToWorldSpaceAR(n));
    }
    console.log("wposList", t);
    return t;
  }
}