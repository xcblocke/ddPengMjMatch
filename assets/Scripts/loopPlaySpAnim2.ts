const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass("LoopPlaySpAnim2")
@menu("自定义组件/common/LoopPlaySpAnim2")
export default class LoopPlaySpAnim2 extends cc.Component {
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
    displayName: "是否2个"
  })
  isTwo: boolean = false;
  animComp = null;
  onLoad() {
    var e = this;
    this.animComp = this.node.getComponent(sp.Skeleton);
    var t = this.animName || "animation",
      o = false;
    this.scheduleOnce(function () {
      e.animComp.setAnimation(0, t, false);
    }, this.delay);
    this.animComp.setCompleteListener(function (t) {
      if (0 != e.delay && o) {
        o = false;
      } else {
        if (e.isTwo && t.animation.name == e.animName) {
          e.playAnim2();
        } else {
          e.scheduleOnce(function () {
            e.playAnim1();
          }, e.cd);
        }
      }
    });
  }
  playAnim1() {
    this.animComp.setAnimation(0, this.animName, false);
  }
  playAnim2() {
    this.animComp.setAnimation(0, this.animName2, false);
  }
}