import PlayerDataSys from './framework/controller/PlayerDataSys';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class loginItem extends cc.Component {
  @property(cc.Label)
  cash: cc.Label = null;
  @property(cc.Node)
  can: cc.Node = null;
  @property(cc.Label)
  can_desc: cc.Label = null;
  @property(cc.Node)
  next: cc.Node = null;
  @property(cc.Node)
  many: cc.Node = null;
  @property(cc.Label)
  many_desc: cc.Label = null;
  @property(cc.Node)
  over: cc.Node = null;
  @property(cc.Label)
  over_desc: cc.Label = null;
  @property(cc.Label)
  over_cash: cc.Label = null;
  @property(cc.Node)
  overdue: cc.Node = null;
  @property(cc.Label)
  overdue_desc: cc.Label = null;
  @property(cc.Node)
  zuigao: cc.Node = null;
  tx_id = "";
  next_cash = 0;
  many_day = 0;
  show_money = 0;
  true_money = 0;
  init(e) {
    this.setView(e);
  }
  setView(e) {
    var t = e.true_money,
      o = e.status,
      n = e.login_days,
      a = e.id,
      i = e._is_top,
      c = e.sign_up_day_limit,
      s = e.show_money;
    this.tx_id = "";
    this.next_cash = 0;
    this.many_day = 0;
    this.show_money = s;
    this.true_money = t;
    this.many_desc.string = this.overdue_desc.string = this.over_desc.string = this.can_desc.string = `{"gkey_333":{"v1":"${c}"}}`;
    this.over_cash.string = this.cash.string = PlayerDataSys.getCashBalance(s);
    this.can.active = false;
    this.next.active = false;
    this.many.active = false;
    this.over.active = false;
    this.overdue.active = false;
    this.zuigao.active = false;
    n > c && (o ? this.over.active = true : this.overdue.active = true);
    o && n == c && (this.over.active = true);
    if (!o && n == c) {
      this.can.active = true;
      this.tx_id = a;
      i && (this.zuigao.active = true);
    }
    if (!o && n == c - 1) {
      this.next.active = true;
      this.next_cash = s;
    }
    if (!o && n < c - 1) {
      this.many.active = true;
      this.many_day = c - n;
    }
  }
}