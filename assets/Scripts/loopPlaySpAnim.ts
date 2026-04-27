const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass("LoopPlaySpAnim")
@menu("自定义组件/common/LoopPlaySpAnim")
export default class LoopPlaySpAnim extends cc.Component {
  @property(cc.Integer)
  delay: number = 5;
  @property(cc.Integer)
  cd: number = 5;
  @property(cc.String)
  animName: string = "animation";
  @property(cc.String)
  animName2: string = "animation";
  @property({
    type: cc.Boolean,
    displayName: "随机播放"
  })
  random: boolean = false;
  @property({
    type: cc.Boolean,
    displayName: "播放结束是否隐藏"
  })
  isEndHide: boolean = true;
  animComp = null;
  onLoad() {
    var e = this;
    this.animComp = this.node.getComponent(sp.Skeleton);
    var t = this.animName || "animation",
      o = true;
    if (this.random) {
      this.scheduleOnce(function () {
        e.animComp.setAnimation(0, t, false);
      }, 2 * Math.random());
    } else {
      this.scheduleOnce(function () {
        e.animComp.setAnimation(0, t, false);
      }, this.delay);
    }
    this.animComp.setCompleteListener(function (n) {
      if (0 != e.delay && o) o = false;else if (n.animation.name == t || n.animation.name == e.animName2) {
        e.isEndHide && (e.animComp.node.opacity = 0);
        if (e.random) {
          e.playAnim();
        } else {
          e.scheduleOnce(function () {
            e.playAnim();
          }, e.cd);
        }
      }
    });
  }
  playAnim() {
    this.animComp.node.opacity = 255;
    this.animComp.setAnimation(0, this.animName, false);
  }
  onDestroy() {}
}