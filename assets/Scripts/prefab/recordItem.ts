const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class recordItem extends cc.Component {
  @property(cc.Label)
  time_label: cc.Label = null;
  @property(cc.Label)
  cash_label: cc.Label = null;
  @property(cc.Node)
  fail_tip: cc.Node = null;
  @property(cc.Node)
  success_node: cc.Node = null;
  @property(cc.Node)
  fail_node: cc.Node = null;
  @property(cc.Node)
  reviewing_node: cc.Node = null;
  init(e) {
    this.fail_tip.active = false;
    this.success_node.active = false;
    this.fail_node.active = false;
    this.reviewing_node.active = false;
    var t = e.extract_time,
      o = (e.l_status_message, e.amount),
      n = e.l_status;
    this.time_label.string = t;
    this.cash_label.string = o;
    if (5 == n) this.success_node.active = true;else if (1 == n) this.reviewing_node.active = true;else {
      this.fail_tip.active = true;
      this.fail_node.active = true;
    }
  }
  start() {}
}