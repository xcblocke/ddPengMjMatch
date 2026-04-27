import AnimationConfig, { AnimMode, EasingType, AnimType } from './AnimationConfig';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class AdvancedAnimComponent extends cc.Component {
  @property({
    type: [AnimationConfig],
    tooltip: "动画配置列表"
  })
  animConfigs: [AnimationConfig] = [];
  @property({
    tooltip: "自动开始播放"
  })
  autoPlay = false;
  @property({
    tooltip: "循环播放"
  })
  loop = false;
  originalState = {
    position: cc.v3(0, 0, 0),
    rotation: 0,
    scale: cc.v2(1, 1),
    opacity: 255
  };
  readIndex = 0;
  onLoad() {
    this.storeOriginalState();
    this.autoPlay && this.play();
  }
  onDestroy() {
    this.stop();
  }
  play() {
    var e;
    this.stop();
    null === (e = this.evalTweens()) || void 0 === e || e.start();
  }
  stop() {
    cc.Tween.stopAllByTarget(this.node);
    this.currentTween = null;
  }
  reset() {
    this.node.position = this.originalState.position;
    this.node.angle = this.originalState.rotation;
    this.node.setScale(this.originalState.scale);
    this.node.opacity = this.originalState.opacity;
  }
  storeOriginalState() {
    this.originalState.position = this.node.position.clone();
    this.originalState.rotation = this.node.angle;
    this.originalState.scale = new cc.Vec2(this.node.scaleX, this.node.scaleY);
    this.originalState.opacity = this.node.opacity;
  }
  evalTweens() {
    var e = this;
    if (this.readIndex >= this.animConfigs.length) {
      if (!this.loop) return null;
      this.readIndex = 0;
      this.reset();
    }
    for (var t = cc.tween().target(this.node), o = [];;) {
      if (this.readIndex >= this.animConfigs.length) {
        if (!this.loop) break;
        this.readIndex = 0;
      }
      var n = this.animConfigs[this.readIndex],
        a = this.createAnimTween(n);
      if (n.mode == AnimMode.SEQUENCE) {
        if (o.length > 0) {
          t.parallel.apply(t, o);
          break;
        }
        this.readIndex++;
        t.then(a);
        break;
      }
      o.push(a);
      this.readIndex++;
    }
    t.call(function () {
      var t = e.evalTweens();
      null != t && t.start();
    });
    return t;
  }
  createAnimTween(e) {
    var t = cc.tween();
    t.delay(e.delay);
    var o = e.duration,
      n = cc.easing[EasingType[e.easing]] || cc.easing.quadIn;
    switch (e.type) {
      case AnimType.MOVE:
        this.setupMoveTween(t, e, o, n);
        break;
      case AnimType.ROTATE:
        this.setupRotateTween(t, e, o, n);
        break;
      case AnimType.SCALE:
        this.setupScaleTween(t, e, o, n);
        break;
      case AnimType.FADE:
        this.setupFadeTween(t, e, o, n);
    }
    return t;
  }
  setupMoveTween(e, t, o, n) {
    var a = t.startPosition ? cc.v3(t.startPosition.x, t.startPosition.y, 0) : this.node.position.clone(),
      i = cc.v3(t.targetPosition.x, t.targetPosition.y, 0);
    e.to(0, {
      position: a
    }).to(o, {
      position: i
    }, {
      easing: n
    });
  }
  setupRotateTween(e, t, o, n) {
    var a,
      i = null !== (a = t.startRotation) && void 0 !== a ? a : this.node.angle,
      r = t.targetRotation;
    e.to(0, {
      angle: i
    }).to(o, {
      angle: r
    }, {
      easing: n
    });
  }
  setupScaleTween(e, t, o, n) {
    var a,
      i = null !== (a = t.startScale) && void 0 !== a ? a : new cc.Vec2(this.node.scaleX, this.node.scaleY),
      r = t.targetScale;
    e.to(0, {
      scaleX: i.x,
      scaleY: i.y
    }).to(o, {
      scaleX: r.x,
      scaleY: r.y
    }, {
      easing: n
    });
  }
  setupFadeTween(e, t, o, n) {
    var a = -1 == t.startOpacity ? this.node.opacity : t.startOpacity,
      i = t.targetOpacity;
    e.to(0, {
      opacity: a
    }).to(o, {
      opacity: i
    }, {
      easing: n
    });
  }
}