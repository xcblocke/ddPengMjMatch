const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class adScroll extends cc.Component {
  @property([cc.SpriteFrame])
  adSpriteFrames: Array<cc.SpriteFrame> = [];
  @property(cc.Node)
  baseNode: cc.Node = null;
  @property(cc.Node)
  rootNode: cc.Node = null;
  nextIndex = 0;
  baseI = 0;
  baseDt = 0;
  onLoad() {
    var e = (cc.winSize.width - this.baseNode.width) / (this.baseNode.width + this.rootNode.getComponent(cc.Layout).spacingX) + 4;
    this.rootNode.removeAllChildren();
    this.nextIndex = Math.floor(e);
    for (var t = 0; t < this.nextIndex; t++) {
      var o = cc.instantiate(this.baseNode);
      o.getComponentInChildren(cc.Sprite).spriteFrame = this.adSpriteFrames[t % this.adSpriteFrames.length];
      this.rootNode.addChild(o);
    }
  }
  addNew() {
    var e = cc.instantiate(this.baseNode);
    e.getComponentInChildren(cc.Sprite).spriteFrame = this.adSpriteFrames[this.nextIndex % this.adSpriteFrames.length];
    this.rootNode.addChild(e);
    this.nextIndex++;
    var t = this.baseI++;
    this.rootNode.children[t].removeComponent(cc.Sprite);
    this.rootNode.children[t].removeAllChildren();
  }
  start() {}
  update(e) {
    this.rootNode.getComponent(cc.Layout).paddingLeft -= 150 * e;
    -Math.floor(this.rootNode.getComponent(cc.Layout).paddingLeft / 60) - 2 < this.baseI || this.addNew();
  }
}