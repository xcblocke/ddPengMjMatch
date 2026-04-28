import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class _barrage_up extends cc.Component {
  @property(cc.Node)
  msgItem: cc.Node = null;
  @property(cc.Node)
  maskContent: cc.Node = null;
  msgList = new Array();
  start() {
    this.reqMsg();
  }
  reqMsg() {
    var e = this;
    this.unschedule(this.reqMsg);
    GameSystem.getScrollMsg().then(function (t) {
      if (t && 1 == t.code) {
        var o = t.data;
        if (o && o.size > 0) {
          var n = o.money_list;
          if (n && n.length) {
            e.msgList = e.msgList.concat(n);
            e.unschedule(e.runMsg);
            e.runMsg();
            e.schedule(e.runMsg, 2);
          }
        }
      }
    });
  }
  runMsg() {
    var _this = this,
      msg = this.msgList.shift();
    if (msg) {
      var name = msg.name,
        money = msg.money,
        msgItem_1 = cc.instantiate(this.msgItem),
        desc = msgItem_1.getComponent(cc.RichText);
      desc.string = `{"gkey_261":{"v1":"${name}","v2":"${money}","v3":"${eval(\"'元'\")}"}}`;
      msgItem_1.parent = this.maskContent;
      msgItem_1.active = true;
      msgItem_1.y = 100;
      msgItem_1.runAction(cc.sequence(cc.moveTo(0.8, 0, 0), cc.delayTime(0.8), cc.moveTo(0.8, 0, -100), cc.callFunc(function () {
        msgItem_1.parent = null;
        msgItem_1.destroy();
        _this.msgList.length <= 0 && _this.reqNextMsg();
      })));
    }
  }
  reqNextMsg() {
    this.scheduleOnce(this.reqMsg, 1.5);
  }
}