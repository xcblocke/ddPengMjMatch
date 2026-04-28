import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class topBarrage extends cc.Component {
  @property(cc.Node)
  top_head: cc.Node = null;
  @property(cc.Label)
  top_name: cc.Label = null;
  @property(cc.RichText)
  top_desc: cc.RichText = null;
  @property(cc.Label)
  top_date: cc.Label = null;
  @property(cc.Label)
  top_count: cc.Label = null;
  @property(sp.Skeleton)
  caidai: sp.Skeleton = null;
  @property(sp.Skeleton)
  caidai1: sp.Skeleton = null;
  bigInfos = [];
  onLoad() {
    this.bigInfos = [];
    this.node.y = cc.winSize.height / 2 + 220;
    EventMgr.listen(GameEventType.SHOW_TOPBIGBARRAGE, this.show, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.SHOW_TOPBIGBARRAGE, this.show, this);
  }
  show() {
    var e = this;
    if (this.bigInfos.length) {
      this.createOne();
    } else {
      GameSystem.getBigMsg().then(function (t) {
        if (t && 1 == t.code) {
          var o = t.data.dm_info;
          if (o && o.length) {
            e.bigInfos = o;
            e.createOne();
          }
        }
      });
    }
  }
  createOne() {
    var e = this.bigInfos.shift();
    if (e) {
      var t = e.image,
        o = e.msg,
        n = e.name,
        a = e.amount;
      this.top_head.getComponent(cc.Sprite).spriteFrame = null;
      t && EngineUtil.loaderHead(t, this.top_head);
      this.top_desc && (this.top_desc.string = o);
      this.top_name && (this.top_name.string = n);
      this.top_count && (this.top_count.string = `{"gkey_039":{"v1":"${a}"}}`);
      this.showTop();
    }
  }
  showTop() {
    var e = this,
      t = this.node.y = cc.winSize.height / 2 + 220;
    this.node.stopAllActions();
    var o = cc.winSize.height / 2 - 50;
    this.caidai.node.active = true;
    this.caidai1.node.active = true;
    cc.tween(this.node).to(0.3, {
      y: o
    }).call(function () {
      e.caidai.setAnimation(0, "animation", false);
      e.caidai1.setAnimation(0, "animation", false);
    }).delay(3).to(0.3, {
      y: t
    }).start();
  }
}