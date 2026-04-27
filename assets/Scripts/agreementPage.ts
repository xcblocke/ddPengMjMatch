import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class agreementPage extends BasePage {
  @property(cc.Label)
  viewLab: cc.Label = null;
  onLoad() {
    super.onLoad.call(this);
  }
  onEnable() {
    super.onEnable.call(this);
    SdkHelper.reportData("open_userGuide");
    EngineUtil.setLocalData("b_first_show_agreement", "1");
  }
  showUserAgreement() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("u_click_user_agreement");
    var e = PlayerDataSys.getUserAgreementUrl(1);
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        is_first: true,
        title: "用户协议",
        url: e,
        index: 0,
        noReport: true
      },
      option: {
        reuse: false
      }
    });
  }
  showPrivacyAgreement() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("u_click_user_privacy");
    var e = PlayerDataSys.getPrivacyAgreementUrl();
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        is_first: true,
        title: "隐私政策",
        url: e,
        index: 1,
        noReport: true
      },
      option: {
        reuse: false
      }
    });
  }
  agree() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("agree_userGuide");
    EngineUtil.setLocalData("user_agreement", "1");
    EngineUtil.setLocalData("show_agreement_report", "1");
    this._hide();
  }
  disAgree() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("cancel_userGuide");
    EngineUtil.setLocalData("cancel_agreement_report", "1");
    SdkHelper.finishApp();
  }
  _onHide() {
    super._onHide.call(this);
    setTimeout(function () {
      SdkHelper.initOtherSDK(true);
    }, 1000);
  }
}