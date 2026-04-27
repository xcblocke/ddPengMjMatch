import { RequestType } from './RequestType';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import EngineUtil from '../framework/EngineUtil';
import Service from './Service';
import GameSystem from '../system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class barrageTip_move extends cc.Component {
  @property(cc.Node)
  text: cc.Node = null;
  @property(cc.Boolean)
  isWufu: boolean = false;
  standbyArr = new Array();
  requestTimes = 0;
  itemPool = new cc.NodePool();
  randomIndex = 0;
  onLoad() {
    EventMgr.listen(GameEventType.BARRAGEOTHER, this.pushStandby, this);
    EventMgr.listen(GameEventType.BARRAGESELF, this.insertSelf, this);
    EventMgr.listen(GameEventType.UPDATE_DANMU, this.setOpen, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.BARRAGEOTHER, this.pushStandby, this);
    EventMgr.ignore(GameEventType.BARRAGESELF, this.insertSelf, this);
    EventMgr.ignore(GameEventType.UPDATE_DANMU, this.setOpen, this);
  }
  setOpen() {
    if ("open" == EngineUtil.localStorageGetItem("barrageIsOpen", "open")) {
      this.show();
    } else {
      this.hide();
    }
  }
  onEnable() {
    if ("open" == EngineUtil.localStorageGetItem("barrageIsOpen", "open")) {
      this.show();
    } else {
      this.hide();
    }
  }
  show() {
    this.node.active = true;
  }
  hide() {
    this.node.active = false;
  }
  start() {
    this.requestMsg(this.initView.bind(this));
  }
  requestMsg(e) {
    var t = this;
    (this.isWufu ? Service.commonApiPost(RequestType.wfScrollMsg) : GameSystem.getScrollMsg()).then(function (o) {
      if (o && 1 == o.code) {
        var n = o.data;
        if (n && n.size > 0) {
          var a = n.dm_info;
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
  initView(e) {
    e && e.length && (this.standbyArr = this.standbyArr.concat(e));
    this.createByTime();
    this.schedule(this.createByTime, 20);
  }
  createByTime() {
    this.createItem();
    this.scheduleOnce(this.createItem, 10);
  }
  createItem() {
    var e = this,
      t = this.standbyArr.shift();
    if (t) {
      var o = this.itemPool.get() || cc.instantiate(this.text);
      this.randomIndex >= 100 && (this.randomIndex = 0);
      this.setItemString(o, t);
      var n = cc.winSize.width / 2 + 100;
      o.setPosition(cc.v2(n, 0));
      o.active = true;
      o.parent = this.node;
      o.runAction(cc.sequence(cc.moveBy(14, cc.v2(2 * -cc.winSize.width, 0)), cc.callFunc(function () {
        o.active = false;
        e.itemPool.put(o);
      })));
      this.randomIndex++;
    } else {
      this.unschedule(this.createItem);
      this.requestMsg(this.pushStandby.bind(this));
    }
  }
  setItemString(e, t) {
    var o = e.getChildByName("user_head"),
      n = e.getChildByName("desc").getComponent(cc.RichText),
      a = o.getChildByName("mask").getChildByName("head").getComponent(cc.Sprite),
      i = t.image,
      r = t.msg;
    n.string = r;
    i && EngineUtil.loadRemoteImg(i).then(function (e) {
      e && (a.spriteFrame = new cc.SpriteFrame(e));
    }).catch(function () {});
  }
  pushStandby(e) {
    if (e && e.length) {
      this.unschedule(this.createByTime);
      this.schedule(this.createByTime, 20);
      this.unschedule(this.createItem);
      this.standbyArr = this.standbyArr.concat(e);
    }
  }
  insertSelf(e) {
    e && this.standbyArr.unshift(e);
  }
}