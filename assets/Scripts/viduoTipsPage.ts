import SdkHelper from './framework/SdkHelper';
import BasePage, { AnimType } from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import VideoTipsHelper from './common/VideoTipsHelper';

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
    VideoTipsHelper.onCancel();
    super._hide.call(this);
  }
  gotoAd() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("video_tips_ok");
    super._hide.call(this);
    VideoTipsHelper.onConfirm();
  }
}
