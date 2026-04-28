import AudioManager from './framework/controller/AudioManager';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wheelWdrPage extends BasePage {
  @property(cc.Label)
  cash_num: cc.Label = null;
  @property(cc.Node)
  user_head: cc.Node = null;
  @property(cc.Label)
  user_name: cc.Label = null;
  @property(cc.Animation)
  idle_node: cc.Animation = [];
  @property(cc.Node)
  info: cc.Node = [];
  @property(cc.Node)
  line: cc.Node = null;
  @property(cc.Node)
  continue_btn: cc.Node = null;
  cb = null;
  animationConfigs = [{
    anim: null,
    name: "idle_1"
  }, {
    anim: null,
    name: "idle_2"
  }, {
    anim: null,
    name: "idle_3"
  }, {
    anim: null,
    name: "idle_4"
  }];
  _init(e) {
    var t = this;
    if (e) {
      var o = e.cash;
      e.wheel_id, e.guide_page;
      this.cb = null == e ? void 0 : e.cb;
      this.cash_num.string = PlayerDataSys.getCashBalance(o);
    }
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (e) {
      e && (t.user_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e));
    }).catch(function (e) {
      console.log(e);
    });
    var n = PlayerDataSys.nickname || `gkey_507`;
    this.user_name.string = EngineUtil.nameFormat(n);
    this.continue_btn.active = false;
    this.animationConfigs[0].anim = this.idle_node[0];
    this.animationConfigs[1].anim = this.idle_node[1];
    this.animationConfigs[2].anim = this.idle_node[2];
    this.animationConfigs[3].anim = this.idle_node[3];
    for (var a = 0; a < this.idle_node.length; a++) this.idle_node[a].node.active = 0 == a;
    for (a = 0; a < this.info.length; a++) this.info[a].active = 0 == a;
    this.line.height = 10;
    this.scheduleOnce(function () {
      t.playAnimationsSequence();
    }, 0.1);
  }
  playAnimationAsync(e, t, o) {
    var n = this;
    return new Promise(function (a) {
      if (e) {
        var i = e.getClips();
        if (0 !== i.length) {
          var r = i[0].name;
          e.off("finished");
          e.on("finished", function () {
            n.onAnimationFinish(t, o);
            e.off("finished");
            a();
          }, n);
          e.play(r);
        } else {
          console.warn("动画 " + t + " 没有clip");
          a();
        }
      } else {
        console.warn("动画 " + t + " 不存在");
        a();
      }
    });
  }
  async playAnimationsSequence() {
    var e, t;
    e = 0;
    while (e < this.animationConfigs.length) {
      t = this.animationConfigs[e];
      await this.playAnimationAsync(t.anim, t.name, e);
      e++;
    }
    this.onAllAnimationsComplete();
    return;
  }
  playAnimationsWithChain() {
    var e = this;
    this.playAnimationAsync(this.idle_node[0], "idle_1", 0).then(function () {
      return e.playAnimationAsync(e.idle_node[1], "idle_2", 1);
    }).then(function () {
      return e.playAnimationAsync(e.idle_node[2], "idle_3", 2);
    }).then(function () {
      return e.playAnimationAsync(e.idle_node[3], "idle_4", 3);
    }).then(function () {
      return e.onAllAnimationsComplete();
    });
  }
  onAnimationFinish(e, t) {
    EngineUtil.log("第 " + (t + 1) + " 个动画 " + e + " 播放完成");
    switch (t) {
      case 0:
        EngineUtil.log("idle_1 finish");
        this.info[1].active = true;
        this.idle_node[1].node.active = true;
        this.line.height = 110;
        AudioManager.getInstance().playCash("ding");
        break;
      case 1:
        EngineUtil.log("idle_2 finish");
        this.info[2].active = true;
        this.idle_node[2].node.active = true;
        this.line.height = 220;
        AudioManager.getInstance().playCash("ding");
        break;
      case 2:
        EngineUtil.log("idle_3 finish");
        this.info[3].active = true;
        this.idle_node[3].node.active = true;
        this.line.height = 320;
        AudioManager.getInstance().playCash("ding");
        break;
      case 3:
        EngineUtil.log("idle_4 finish");
        this.line.height = 320;
        AudioManager.getInstance().playCash("ding");
        this.continue_btn.active = true;
    }
  }
  onAllAnimationsComplete() {
    EngineUtil.log("所有动画播放完成！");
  }
  stopAllAnimations() {
    [this.idle_node[0], this.idle_node[1], this.idle_node[2], this.idle_node[3]].forEach(function (e) {
      if (e) {
        e.stop();
        e.off("finished");
      }
    });
  }
  clickClose() {
    AudioManager.getInstance().playMusic("btntouch");
    this.stopAllAnimations();
    EngineUtil.triggerPromise("turntablePage");
    this.cb && this.cb();
    this._hide();
  }
  start() {}
}
