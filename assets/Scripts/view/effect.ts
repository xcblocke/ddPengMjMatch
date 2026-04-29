import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import EngineUtil from '../framework/EngineUtil';
import PageMgr from './PageMgr';
import PlayerDataSys from '../framework/controller/PlayerDataSys';
import { gameData } from '../data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
export enum EffectType {
  Cash = 0,
  Red = 1,
  Diamond = 2,
  Dollar = 3,
}
@ccclass
export default class effect extends cc.Component {
  @property(cc.Prefab)
  effectPrefab: cc.Prefab = null;
  effectPool = new cc.NodePool();
  @property(cc.Node)
  balanceUi: cc.Node = null;
  @property(cc.Node)
  redUi: cc.Node = null;
  @property(cc.Node)
  dollarUi: cc.Node = null;
  @property(cc.Prefab)
  balanceEffect: cc.Prefab = null;
  @property(cc.Node)
  effectNode: cc.Node = null;
  @property(cc.SpriteFrame)
  typeIcon: cc.SpriteFrame = [];
  endNode = null;
  effectCb = null;
  onLoad() {
    EventMgr.listen(GameEventType.SHOWEFFECT, this.addEffects, this);
    EventMgr.listen(GameEventType.SHOWBALANCEEFFECT, this.showBalanceEffect, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.SHOWEFFECT, this.addEffects, this);
    EventMgr.ignore(GameEventType.SHOWBALANCEEFFECT, this.showBalanceEffect, this);
  }
  start() {
    PageMgr.setEffectNode(this.node);
    PageMgr.setEffectNode2(this.effectNode);
  }
  addEffects(e) {
    var t,
      o,
      n = e || {},
      a = n.num,
      i = n.start,
      c = n.end,
      s = n.type,
      l = n.cb,
      u = n.rnum,
      p = n.from,
      f = n.isworldPos;
    console.log("addEffects", a, p, s);
    s || (s = 0);
    if (s == EffectType.Cash) {
      this.endNode = this.balanceUi;
    } else if (s == EffectType.Dollar) {
      this.endNode = this.dollarUi;
    } else {
      s == EffectType.Red && (this.endNode = this.redUi);
    }
    gameData.isOpenDemo && (c = this.redUi);
    o = c ? f ? c : this.node.convertToNodeSpaceAR(c.convertToWorldSpaceAR(cc.v2(0, 0))) : this.node.convertToNodeSpaceAR(this.endNode.convertToWorldSpaceAR(cc.v2(0, 0)));
    t = i ? f ? i : 0 == i.x && 0 == i.y ? cc.v2(0, 350) : this.node.convertToNodeSpaceAR(i) : cc.v2(0, 0);
    var h = a || 3;
    h > 3 && (h = 3);
    h = 6;
    for (var g = 0; g < h; g++) this.addEffect(t, o, s, u, g == h - 1 ? l : null, 0.05 * g);
  }
  addEffect2(e, t, o, n, a, i) {
    var r = this,
      c = this.effectPool.size() > 0 ? this.effectPool.get() : cc.instantiate(this.effectPrefab);
    c.scale = 0.5;
    c.setPosition(e);
    c.getComponent(cc.Sprite).spriteFrame = this.typeIcon[o];
    var s = cc.find("num", c);
    if (n) {
      s.getComponent(cc.Label).string = 0 == o ? "+" + PlayerDataSys.getCashBalance(n) : "+" + PlayerDataSys.getGoldBalance(n);
    } else {
      s.active = false;
    }
    var l = [cc.v2(e.x + 100, e.y + 100), cc.v2(t.x - 100, t.y + 50), t],
      u = cc.bezierTo(0.7, l).easing(cc.easeIn(2));
    c.opacity = 0;
    c.runAction(cc.sequence(cc.delayTime(i), cc.fadeTo(0.001, 255), u, cc.callFunc(function () {
      r.recoveryEffect(c, a);
    })));
    this.effectNode.addChild(c);
  }
  addEffect(e, t, o, n, a, i) {
    var r = this,
      c = this.effectPool.size() > 0 ? this.effectPool.get() : cc.instantiate(this.effectPrefab);
    c.scale = 0.5;
    c.setPosition(e);
    c.getComponent(cc.Sprite).spriteFrame = this.typeIcon[o];
    var s = cc.find("num", c);
    if (n) {
      s.getComponent(cc.Label).string = 0 == o ? "+" + PlayerDataSys.getCashBalance(n) : "+" + PlayerDataSys.getGoldBalance(n);
    } else {
      s.active = false;
    }
    var u = [cc.v2(e.x + 100, e.y + 100), cc.v2(t.x - 100, t.y + 50), t],
      d = (EngineUtil.getRandomNum(8, 10), cc.bezierTo(0.5, u).easing(cc.easeOut(2)));
    c.opacity = 0;
    c.runAction(cc.sequence(cc.delayTime(i), cc.fadeTo(0.001, 255), d, cc.callFunc(function () {
      r.recoveryEffect(c, a);
    })));
    this.node.addChild(c);
  }
  recoveryEffect(e, t) {
    cc.Tween.stopAllByTarget(e);
    e.scale = 0.7;
    this.effectPool.put(e);
    t && t();
  }
  showBalanceEffect(e) {
    console.log("showBalanceEffect", e);
    if (e) {
      var t = e.num,
        o = e.type,
        n = null;
      n = 0 == o ? this.balanceUi : this.redUi;
      gameData.isOpenDemo && (n = this.redUi);
      var a = cc.instantiate(this.balanceEffect),
        i = this.node.convertToNodeSpaceAR(n.convertToWorldSpaceAR(cc.v2(0, 0)));
      i.y -= 50;
      i.x -= 0 == o ? 80 : 140;
      a.setPosition(cc.v2(i.x, i.y));
      var r = a.getChildByName("num").getComponent(cc.Label);
      a.getChildByName("effect_hb").active = false;
      a.getChildByName("effect_jb").active = false;
      if (o) {
        r.string = "+" + PlayerDataSys.getGoldBalanceWithUnit(t);
        a.getChildByName("effect_jb").active = true;
      } else {
        r.string = "+" + PlayerDataSys.getCashBalanceWithUnit(t);
        a.getChildByName("effect_hb").active = true;
      }
      a.parent = this.effectNode;
      a.runAction(cc.sequence(cc.moveBy(1, 0, 80), cc.callFunc(function () {
        a.parent = null;
        a.destroy();
      })));
    }
  }
}