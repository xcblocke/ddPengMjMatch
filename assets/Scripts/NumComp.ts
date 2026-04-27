import EventMgr from './framework/Event/EventMgr';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import GameEventType from './framework/Event/GameEventType';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class NumComp extends cc.Component {
  @property(cc.String)
  action: string = "";
  _bindTarget = {
    value: 0
  };
  onLoad() {
    EventMgr.listen(this.action, this.fresh, this);
  }
  fresh(e) {
    var t = this;
    if (e) {
      if ("number" == typeof e) {
        e = e.toFixed(2);
        this.node.getComponent(cc.Label).string = e.toString();
      } else if ("string" == typeof e) this.node.getComponent(cc.Label).string = e;else {
        var o = e.duration || 0.5;
        this._bindTarget = {
          value: e.start
        };
        this.node.scale = 1.2;
        cc.tween(this._bindTarget).to(o, {
          value: e.end
        }, {
          easing: "linear",
          progress: function (e, o, n, a) {
            var i = e + (o - e) * a;
            i = i.toFixed(2);
            if (t.action == GameEventType.UPDATE_BALANCE) {
              t.node.getComponent(cc.Label).string = PlayerDataSys.getCashBalanceWithUnit(i, "");
            } else {
              t.action == GameEventType.UPDATE_GOLDBALANCE && (t.node.getComponent(cc.Label).string = PlayerDataSys.getGoldBalanceWithUnit(i, ""));
            }
          }
        }).call(function () {
          if (t.action == GameEventType.UPDATE_BALANCE) {
            t.node.getComponent(cc.Label).string = PlayerDataSys.getCashBalance();
          } else {
            t.action == GameEventType.UPDATE_GOLDBALANCE && (t.node.getComponent(cc.Label).string = PlayerDataSys.getGoldBalance());
          }
          t.node.scale = 1;
        }).start();
      }
    } else this.node.getComponent(cc.Label).string = this.action == GameEventType.UPDATE_GOLDBALANCE ? PlayerDataSys.getGoldBalance() : PlayerDataSys.getCashBalance();
  }
  onDestroy() {
    EventMgr.ignore(this.action, this.fresh, this);
    EventMgr.ignoreAllByCaller(this);
  }
}