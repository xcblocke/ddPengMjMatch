import AudioManager from '../framework/controller/AudioManager';
import clearPropEffect from './clearPropEffect';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class test extends cc.Component {
  @property(clearPropEffect)
  comp: clearPropEffect = null;
  @property(sp.Skeleton)
  spine: sp.Skeleton = null;
  onLoad() {
    AudioManager.getInstance().init();
    this.spine.setAnimation(0, "show_3", false);
  }
  click() {
    this.spine.setAnimation(0, "1d1", false);
    cc.tween(this.spine.node).to(0.26666666666666666, {
      position: cc.v3(-200, 200, 0)
    }).start();
  }
  loop() {
    this.spine.setAnimation(0, "1d1", false);
  }
  click2() {}
}