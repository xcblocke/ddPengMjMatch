import SdkHelper from './framework/SdkHelper';
import BasePage, { AnimType } from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import buttonMgr from './system/buttonMgr';

const { ccclass } = cc._decorator;

@ccclass
export default class viduoTipsPage extends BasePage {
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.SCALE,
      blackTime: 0.2,
      pageTime: 0.2
    });
  }
  close() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("video_tips_close");
    buttonMgr.ins && buttonMgr.ins.onVideoTipsCancel();
    super._hide.call(this);
  }
  gotoAd() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("video_tips_ok");
    super._hide.call(this);
    buttonMgr.ins && buttonMgr.ins.onVideoTipsConfirm();
  }
}
