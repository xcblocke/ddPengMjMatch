import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class LevelStartTop extends cc.Component {
  @property(sp.Skeleton)
  tops: sp.Skeleton = [];
  @property(cc.Node)
  locks: cc.Node = [];
  @property(cc.Node)
  passs: cc.Node = [];
  @property(cc.Node)
  nows: cc.Node = [];
  @property(cc.Label)
  nowLevels: cc.Label = [];
  @property(cc.Label)
  passLevels: cc.Label = [];
  now_idx = 0;
  onLoad() {
    for (var e = this, t = 0; t < this.tops.length; t++) this.tops[t].setCompleteListener(function (t) {
      "jindiC" == t.animation.name && (e.node.active = false);
    });
  }
  onEnable() {
    this.nows.forEach(function (e) {
      return e.active = false;
    });
    this.locks.forEach(function (e) {
      return e.active = false;
    });
    this.passs.forEach(function (e) {
      return e.active = false;
    });
    var e = gameData.gameLevel;
    this.now_idx = e > 3 ? 2 : e - 1;
    if (e > 3) for (var t = e - 2, o = 0; o < 4; o++) {
      this.nowLevels[o].string = String(t + o);
      this.passLevels[o].string = String(t + o);
    }
    this.setNow();
    this.setPass();
    this.setLock();
    this.unschedule(this.outAll);
    this.scheduleOnce(this.outAll, 1.5);
  }
  setPass() {
    for (var e = 0; e < this.passs.length; e++) if (e < this.now_idx) {
      this.tops[e].setAnimation(0, "yindiJ", false);
      this.locks[e].active = false;
      this.nows[e].active = false;
      this.passs[e].active = true;
    }
  }
  setNow() {
    this.tops[this.now_idx].setAnimation(0, "jindiJ", false);
    this.locks[this.now_idx].active = false;
    this.nows[this.now_idx].active = true;
    this.passs[this.now_idx].active = false;
  }
  setLock() {
    for (var e = 0; e < this.locks.length; e++) if (e > this.now_idx) {
      this.tops[e].setAnimation(0, "yindiJ", false);
      this.locks[e].active = true;
      this.nows[e].active = false;
      this.passs[e].active = false;
    }
  }
  outAll() {
    for (var e = 0; e < this.tops.length; e++) if (e == this.now_idx) {
      this.tops[e].setAnimation(0, "jindiC", false);
    } else {
      this.tops[e].setAnimation(0, "yindiC", false);
    }
  }
}