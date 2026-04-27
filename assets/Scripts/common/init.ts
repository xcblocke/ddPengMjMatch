import HotUpdate from '../framework/Event/HotUpdate';
import GlobalApp from './GlobalApp';
const {
  ccclass,
  property
} = cc._decorator;
function s(e, t) {
  return e ? s(e.parent, t * e.scale) : t;
}
if (!cc.Node.prototype.getChildByPath) {
  cc.Node.prototype.getChildByPath = function (e) {
    return cc.find(e, this);
  };
  Object.defineProperty(cc.Node.prototype, "worldPosition", {
    get: function () {
      return this.convertToWorldSpaceAR(cc.v3(0, 0, 0)).add(cc.v3(-cc.winSize.width / 2, -cc.winSize.height / 2));
    },
    set: function (e) {
      this.parent || (this.parent = GlobalApp.GameMain.node);
      e = this.parent.convertToNodeSpaceAR(e).add(cc.v3(cc.winSize.width / 2, cc.winSize.height / 2));
      this.setPosition(e);
    }
  });
  Object.defineProperty(cc.Node.prototype, "worldScale", {
    get: function () {
      return s(null == this ? void 0 : this.parent, this.scale);
    }
  });
}
@ccclass
export default class init extends cc.Component {
  onLoad() {
    HotUpdate.getInstance().getBaseVersion();
    cc.director.loadScene("loadingScene");
  }
}