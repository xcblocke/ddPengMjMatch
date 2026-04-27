import AudioManager from './framework/controller/AudioManager';
const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass
@menu("添加按钮统一音效")
export default class BtnClickSoundComp extends cc.Component {
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, function () {
      AudioManager.instance.playBtn();
    });
  }
  start() {}
}