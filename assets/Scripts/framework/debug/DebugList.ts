import DebugItem from '../../DebugItem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class DebugList extends cc.Component {
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property(cc.Label)
  switchLabel: cc.Label = null;
  @property(cc.Node)
  itemNode: cc.Node = null;
  @property(cc.Node)
  itemRootNode: cc.Node = null;
  openClose() {
    this.itemRootNode.active = !this.itemRootNode.active;
    this.switchLabel.string = this.itemRootNode.active ? `gkey_026` : `gkey_288`;
  }
  init(e) {
    var t = this;
    this.itemRootNode.active = false;
    this.switchLabel.string = `gkey_288`;
    this.titleLabel.string = e.title;
    this.itemRootNode.destroyAllChildren();
    e.children.forEach(function (e) {
      var o = cc.instantiate(t.itemNode);
      o.active = true;
      o.addComponent(DebugItem);
      o.getComponent(DebugItem).init(e);
      t.itemRootNode.addChild(o);
    });
    this.openClose();
    e.isOpen || this.openClose();
  }
  start() {}
}