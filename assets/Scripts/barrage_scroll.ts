import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export class barrge_scoll extends cc.Component {
  @property([cc.Node])
  grpNode: Array<cc.Node> = [];
  mgs_normal = [];
  request_count = 0;
  curMsgIndex = 0;
  nextMsgIndex = 1;
  @property(cc.Node)
  msgPrefab: cc.Node = null;
  @property(cc.Node)
  maskNode: cc.Node = null;
  onLoad() {
    for (var e = 0; e < 1; e++) for (var t = this.grpNode[e], o = 0; o < 3; o++) {
      var n = cc.instantiate(this.msgPrefab);
      n.active = true;
      n.parent = t;
    }
  }
  onEnable() {
    this.grpNode[0].y = 0;
    this.node.opacity = 0;
    this.unschedule(this.request);
    this.scheduleOnce(this.request, 1);
  }
  onDisable() {
    this.unschedule(this.request);
  }
  runBarrage() {
    if (this.maskNode) {
      this.maskNode.removeAllChildren();
      this.setItem(true);
    }
  }
  request() {
    var e = this;
    if (this.mgs_normal.length > 3) {
      this.node.opacity = 255;
      return this.runBarrage();
    }
    GameSystem.getScrollMsg().then(function (t) {
      e.request_count = 0;
      if (t && 1 == t.code) {
        var o = t.data.dm_info;
        e.mgs_normal = o;
        e.runBarrage();
        e.node.opacity = 255;
      }
    }).catch(function () {
      if (e.request_count < 3) {
        e.request_count++;
        setTimeout(function () {
          e.request();
        }, 15000);
      }
    });
  }
  setItem(e) {
    for (var t = [], o = 0; o < 3 && this.mgs_normal.shift(); o++) t.push(this.mgs_normal.shift());
    3 == t.length && this.initItem(t, e);
    this.mgs_normal.length < 3 && this.request();
  }
  initItem(e, t) {
    var o = this,
      n = cc.instantiate(this.grpNode[0]);
    n.parent = this.maskNode;
    if (t) {
      n.setPosition(0, 0);
    } else {
      n.setPosition(0, -180);
    }
    for (var a = function a(t) {
        var o = e[t],
          a = n.children[t],
          i = a.getChildByName("mask").getChildByName("head"),
          c = a.getChildByName("content").getComponent(cc.RichText),
          s = "<color=#303F6B>" + o.msg + "</c>";
        s = s.replace(/#FFFCE1/g, "#303F6B").replace(/FBDD19/g, "00BB00");
        var l = o.image;
        l && EngineUtil.loadRemoteImg(l).then(function (e) {
          i.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e);
        }).catch(function (e) {
          console.log(e);
        });
        c.string = s;
      }, i = 0; i < e.length; i++) a(i);
    n.active = true;
    if (t) {
      cc.tween(n).delay(2).parallel(cc.tween().by(2, {
        y: 180
      }), cc.callFunc(function () {
        o.setItem(false);
      })).removeSelf().start();
    } else {
      cc.tween(n).to(2, {
        y: 0
      }).delay(2).parallel(cc.tween().by(2, {
        y: 180
      }), cc.callFunc(function () {
        o.setItem(false);
      })).removeSelf().start();
    }
  }
  runMsg() {
    var e = this;
    this.schedule(function () {
      e.grpNode[e.curMsgIndex].y = 0;
      cc.tween(e.grpNode[e.curMsgIndex]).to(1.5, {
        y: 500
      }).call(function () {
        if (0 == e.curMsgIndex) {
          e.curMsgIndex = 1;
        } else {
          e.curMsgIndex = 0;
        }
        if (1 == e.nextMsgIndex) {
          e.nextMsgIndex = 0;
        } else {
          e.nextMsgIndex = 1;
        }
      }).removeSelf().start();
      cc.tween(e.grpNode[e.curMsgIndex]).to(1.5, {
        y: 500
      }).call(function () {
        if (0 == e.curMsgIndex) {
          e.curMsgIndex = 1;
        } else {
          e.curMsgIndex = 0;
        }
        if (1 == e.nextMsgIndex) {
          e.nextMsgIndex = 0;
        } else {
          e.nextMsgIndex = 1;
        }
      }).removeSelf().start();
      e.grpNode[e.nextMsgIndex].y = -500;
      cc.tween(e.grpNode[e.nextMsgIndex]).to(1.5, {
        y: 0
      }).removeSelf().start();
    }, 20);
  }
}