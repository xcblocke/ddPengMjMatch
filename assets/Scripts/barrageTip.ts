import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
var PosArr = [cc.v2(600, -150), cc.v2(150, -70), cc.v2(-100, 0), cc.v2(250, 70), cc.v2(500, 150)];
@ccclass
export default class _barrageTip extends cc.Component {
  @property(cc.Node)
  mask: cc.Node = null;
  @property(cc.Node)
  text: cc.Node = null;
  standbyArr = new Array();
  showNodeArr = new Array();
  requestTimes = 0;
  onLoad() {
    EventMgr.listen(GameEventType.BARRAGEOTHER, this.pushStandby, this);
    EventMgr.listen(GameEventType.BARRAGESELF, this.insertSelf, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.BARRAGEOTHER, this.pushStandby, this);
    EventMgr.ignore(GameEventType.BARRAGESELF, this.insertSelf, this);
  }
  start() {
    this.requestMsg(this.reset.bind(this));
  }
  requestMsg(e) {
    var t = this;
    GameSystem.getScrollMsg().then(function (o) {
      if (o && 1 == o.code) {
        var n = o.data;
        if (n && n.size > 0) {
          var a = n.msg_list;
          t.node.active = true;
          e && e(a);
          return;
        }
      }
    }).catch(function () {
      try {
        t.requestTimes++;
        if (t.requestTimes > 3) {
          t.node.active = false;
          return;
        }
        t.scheduleOnce(function () {
          t.requestMsg(e);
        }, 10);
      } catch (e) {
        t.node && (t.node.active = false);
      }
    });
  }
  reset(e) {
    this.showNodeArr = [];
    if (e && e.length) {
      this.standbyArr = this.standbyArr.concat(e);
      for (var t = 0; t < 5; t++) {
        var o = cc.instantiate(this.text);
        this.showNodeArr.push(o);
        o.parent = this.mask;
        o.active = true;
        o.setPosition(cc.v2(PosArr[t]));
      }
      this.initRolling();
    }
  }
  initRolling() {
    for (var e = 2; e > 0; e--) {
      var t = this.showNodeArr[e];
      t.opacity = 2 == e ? 255 : 100;
      this.setItemString(t);
    }
    this.schedule(this.runRolling, 6);
  }
  runRolling() {
    for (var e = 0; e < this.showNodeArr.length; e++) {
      var t = this.showNodeArr[e];
      t.stopAllActions();
      this.runItem(t, e + 1);
    }
    var o = this.showNodeArr.splice(this.showNodeArr.length - 1, 1);
    this.showNodeArr.unshift(o[0]);
  }
  runItem(e, t) {
    t >= this.showNodeArr.length && (t = 0);
    var o = PosArr[t];
    if (0 == t) e.setPosition(o);else if (1 == t) {
      e.runAction(cc.spawn(cc.moveTo(0.5, o), cc.fadeTo(0.5, 100)));
      this.setItemString(e);
    } else if (2 == t) {
      e.runAction(cc.spawn(cc.moveTo(0.5, o), cc.fadeTo(0.5, 255)));
    } else {
      if (3 == t) {
        e.runAction(cc.spawn(cc.moveTo(0.5, o), cc.fadeTo(0.5, 100)));
      } else {
        e.runAction(cc.moveTo(0.5, o));
      }
    }
  }
  setItemString(item) {
    var text = this.standbyArr.shift(),
      _user_head = item.getChildByName("user_head"),
      _qipao_text = item.getChildByName("qipao_text");
    if (text) {
      _user_head.active = true;
      _qipao_text.active = true;
      var _desc = _qipao_text.getChildByName("desc").getComponent(cc.RichText),
        _head = _user_head.getChildByName("mask").getChildByName("head").getComponent(cc.Sprite),
        name = text.name,
        head = text.head,
        money = text.money;
      _desc.string = "<color=#ffffff>恭喜用户</c><color=#F40000>" + (name || "游客..") + "</c>,<color=#ffffff>自动提现</c><color=#F40000>" + money + eval("'元'") + "</color>";
      head && EngineUtil.loadRemoteImg(head).then(function (e) {
        e && (_head.spriteFrame = new cc.SpriteFrame(e));
      });
    } else {
      _user_head.active = false;
      _qipao_text.active = false;
      this.requestMsg(this.pushStandby.bind(this));
    }
  }
  pushStandby(e) {
    e && e.length && (this.standbyArr = this.standbyArr.concat(e));
  }
  insertSelf(e) {
    e && this.standbyArr.unshift(e);
  }
}