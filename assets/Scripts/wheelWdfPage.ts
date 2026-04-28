import AudioManager from './framework/controller/AudioManager';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wheelWdfPage extends BasePage {
  @property(cc.Label)
  cash_num: cc.Label = null;
  @property(cc.Node)
  uesr_head: cc.Node = null;
  @property(cc.Label)
  user_name: cc.Label = null;
  @property(cc.RichText)
  limit_info: cc.RichText = null;
  @property(cc.Node)
  limit_desc: cc.Node = null;
  @property(cc.Animation)
  idle_node: cc.Animation = [];
  @property(cc.Node)
  info: cc.Node = [];
  @property(cc.Node)
  line: cc.Node = null;
  @property(cc.Node)
  continue_btn: cc.Node = null;
  cb = null;
  lucky_draw_id = 0;
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
  STORAGE_KEY = "wheel_wdf_open";
  _init(e) {
    var t = this;
    if (e) {
      var o = e.cash,
        n = (e.video_count, e.video_count_limit, e.user_level_limit),
        a = e.xc_level,
        i = e.end_time,
        r = e.lucky_draw_id,
        c = e.level_count_limit,
        s = e.level_count;
      this.cb = null == e ? void 0 : e.cb;
      this.lucky_draw_id = Number(r) || 0;
      this.cash_num.string = "" + PlayerDataSys.getCNGoldBalanceNum(o);
      this.unscheduleAllCallbacks();
      if (i > Date.now()) {
        this.limit_desc.active = false;
        var p = EngineUtil.getRemainTime(i);
        this.limit_info.string = `gkey_294` == p ? `gkey_578` : `{"gkey_579":{"v1":"${EngineUtil.getRemainTime(i)}"}}`;
        this.schedule(function () {
          var e = EngineUtil.getRemainTime(i);
          t.limit_info.string = `gkey_294` == e ? `gkey_578` : `{"gkey_579":{"v1":"${EngineUtil.getRemainTime(i)}"}}`;
        }, 1);
      } else if (s < c) {
        this.limit_desc.active = true;
        this.limit_info.string = `{"gkey_580":{"v1":"${s}","v2":"${c}"}}`;
      } else a < n && (this.limit_info.string = `{"gkey_581":{"v1":"${a}","v2":"${n}"}}`);
    }
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (e) {
      e && (t.uesr_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e));
    }).catch(function (e) {
      console.log(e);
    });
    var d = PlayerDataSys.nickname || `gkey_507`;
    this.user_name.string = EngineUtil.nameFormat(d);
    if (this.hasUsed(this.lucky_draw_id)) {
      for (var f = 0; f < this.idle_node.length; f++) this.idle_node[f].node.active = true;
      for (f = 0; f < this.info.length; f++) this.info[f].active = true;
      this.continue_btn.active = true;
      var h = this.idle_node[3],
        g = h.getClips()[0].name;
      h.play(g);
      var _ = h.getAnimationState(g);
      _ && (_.wrapMode = cc.WrapMode.Loop);
    } else {
      this.continue_btn.active = false;
      this.animationConfigs[0].anim = this.idle_node[0];
      this.animationConfigs[1].anim = this.idle_node[1];
      this.animationConfigs[2].anim = this.idle_node[2];
      this.animationConfigs[3].anim = this.idle_node[3];
      for (f = 0; f < this.idle_node.length; f++) this.idle_node[f].node.active = 0 == f;
      for (f = 0; f < this.info.length; f++) this.info[f].active = 0 == f;
      this.markUsed(this.lucky_draw_id);
      this.line.height = 10;
      this.scheduleOnce(function () {
        t.playAnimationsSequence();
      }, 0.1);
    }
  }
  playAnimationAsync(e, t, o, n = false) {
    var a = this;
    return new Promise(function (i) {
      if (e) {
        var r = e.getClips();
        if (0 !== r.length) {
          var c = r[0].name;
          e.off("finished");
          if (n) {
            e.play(c);
            var s = e.getAnimationState(c);
            s && (s.wrapMode = cc.WrapMode.Loop);
            a.onAnimationFinish(t, o);
            i();
          } else {
            e.on("finished", function () {
              a.onAnimationFinish(t, o);
              e.off("finished");
              i();
            }, a);
            e.play(c);
          }
        } else {
          console.warn("动画 " + t + " 没有clip");
          i();
        }
      } else {
        console.warn("动画 " + t + " 不存在");
        i();
      }
    });
  }
  async playAnimationsSequence() {
    var e, t, o, n;
    e = 0;
    while (e < this.animationConfigs.length - 1) {
      t = this.animationConfigs[e];
      await this.playAnimationAsync(t.anim, t.name, e, false);
      e++;
    }
    await this.delay(0.5);
    o = this.animationConfigs.length - 1;
    n = this.animationConfigs[o];
    await this.playAnimationAsync(n.anim, n.name, o, true);
    this.onAllAnimationsComplete();
    return;
  }
  delay(e) {
    var t = this;
    return new Promise(function (o) {
      t.scheduleOnce(function () {
        o();
      }, e);
    });
  }
  playAnimationsWithChain() {
    var e = this;
    this.playAnimationAsync(this.idle_node[0], "idle_1", 0, false).then(function () {
      return e.playAnimationAsync(e.idle_node[1], "idle_2", 1, false);
    }).then(function () {
      return e.playAnimationAsync(e.idle_node[2], "idle_3", 2, false);
    }).then(function () {
      return e.playAnimationAsync(e.idle_node[3], "idle_4", 3, true);
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
        EngineUtil.log("idle_4 finish - 开始循环播放");
        this.line.height = 320;
        AudioManager.getInstance().playCash("ding");
        this.continue_btn.active = true;
    }
  }
  onAllAnimationsComplete() {
    EngineUtil.log("所有动画播放完成！最后一个动画正在循环播放中...");
  }
  stopAllAnimations() {
    this.idle_node.forEach(function (e) {
      if (e) {
        e.stop();
        e.off("finished");
      }
    });
  }
  playLastAnimationLoop() {
    var e = this.idle_node[3];
    if (e) {
      var t = e.getClips();
      if (0 !== t.length) {
        var o = t[0].name;
        e.play(o);
        var n = e.getAnimationState(o);
        n && (n.wrapMode = cc.WrapMode.Loop);
      } else console.warn("最后一个动画没有clip");
    } else console.warn("最后一个动画不存在");
  }
  stopLastAnimationLoop() {
    var e = this.idle_node[3];
    e && e.stop();
  }
  hasUsed(e) {
    return -1 !== JSON.parse(cc.sys.localStorage.getItem(this.STORAGE_KEY) || "[]").indexOf(e);
  }
  markUsed(e) {
    var t = JSON.parse(cc.sys.localStorage.getItem(this.STORAGE_KEY) || "[]");
    if (-1 === t.indexOf(e)) {
      t.push(e);
      cc.sys.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(t));
    }
  }
  clear(e) {
    var t = JSON.parse(cc.sys.localStorage.getItem(this.STORAGE_KEY) || "[]"),
      o = t.indexOf(e);
    if (-1 !== o) {
      t.splice(o, 1);
      cc.sys.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(t));
    }
  }
  clickClose() {
    AudioManager.getInstance().playMusic("btntouch");
    EngineUtil.triggerPromise("turntablePage");
    this.cb && this.cb();
    this._hide();
  }
  start() {}
}
