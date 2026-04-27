const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class BreathComp extends cc.Component {
  start() {
    cc.tween(this.node).to(0.5, {
      scale: 1.1
    }).to(0.5, {
      scale: 1
    }).union().repeatForever().start();
  }
}