
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class buttonContrl extends cc.Component {
  @property(cc.Node)
  parentNodes: cc.Node = [];
  close(e) {
    e.target.parent.active = false;
  }
  show(e, t) {
    var o = t.split("-"),
      n = parseInt(o[0]),
      a = o[1];
    this.parentNodes[n - 1].getChildByName(a).active = true;
    this.parentNodes[n - 1].getComponentsInChildren(cc.EditBox).forEach(function (e) {
      return e.string = "";
    });
  }
}