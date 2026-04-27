import BasePage from './view/BasePage';
const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass
@menu("自定义组件/common/CommonTitleSpine")
export default class commonTitleSpine extends cc.Component {
  @property(cc.String)
  showAnimName: string = "cx";
  @property(cc.String)
  idleAnimName: string = "dj";
  @property(BasePage)
  basePage: BasePage = null;
  onLoad() {
    var e = this;
    this.node.getComponent(sp.Skeleton).setCompleteListener(function (t) {
      t.animation.name == e.showAnimName && e.node.getComponent(sp.Skeleton).setAnimation(0, e.idleAnimName, true);
    });
    this.node.getComponent(sp.Skeleton).setEventListener(function (t, o) {
      e.basePage && e.basePage.onSpineEvent(o.data.name);
    });
  }
  onEnable() {
    this.node.getComponent(sp.Skeleton).setAnimation(0, this.showAnimName, false);
  }
}