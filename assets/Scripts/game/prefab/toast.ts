const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class toast extends cc.Component {
  @property(cc.Node)
  money: cc.Node = null;
  @property(cc.Label)
  label: cc.Label = null;
  start() {}
  init(e, t) {
    this.money.getChildByName("num").getComponent(cc.Label).string = e;
    this.label.getComponent(cc.Label).string = t;
  }
}