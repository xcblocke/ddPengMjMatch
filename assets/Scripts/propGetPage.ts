import { PropType } from './framework/enum/AllEnum';
import SdkHelper from './framework/SdkHelper';
import BasePage, { AnimType } from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import buttonMgr from './system/buttonMgr';
const {
  ccclass,
  property
} = cc._decorator;

@ccclass
export default class propGetPage extends BasePage {
  _propType = PropType.tipCard;

  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.SCALE,
      blackTime: 0.2,
      pageTime: 0.2
    });
  }
  _init(e) {
    this._propType = e && e.type ? e.type : PropType.tipCard;
    SdkHelper.reportData("get_prop_confirm_page", {
      prop_id: this._propType
    });
  }
  close() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("get_prop_confirm_close", {
      prop_id: this._propType
    });
    super._hide.call(this);
  }
  gotoAd() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("get_prop_confirm_ok", {
      prop_id: this._propType
    });
    var e = this._propType;
    super._hide.call(this);
    var t = buttonMgr.ins;
    t ? t.watchVideoForProp(e) : console.error("propGetPage: buttonMgr not found");
  }
}
