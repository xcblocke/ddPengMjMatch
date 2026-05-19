import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import { CUSTOMER_SERVICE } from './framework/SystemConfig';
import EngineUtil from './framework/EngineUtil';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
import ClientData from './framework/Event/ClientData';
import UrlMgr from './service/UrlMgr';
import { A } from './center/api';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class SetUpPage extends BasePage {
  cb = null;
  @property(cc.Label)
  versionLabel: cc.Label = null;

  @property(cc.Label)
  uidLabel: cc.Label = null;

  @property(cc.Node)
  musicNormalNode: cc.Node = null;
  @property(cc.Node)
  musicUnNode: cc.Node = null;
  @property(cc.Node)

  @property(cc.Node)
  effectNormalNode: cc.Node = null;
  @property(cc.Node)
  effectUnNode: cc.Node = null;


  @property(cc.Node)
  shakeNormalNode: cc.Node = null;
  @property(cc.Node)
  shakeUnNode: cc.Node = null;


  comeinTime = 0;
  start() {

  }
  _init() {
    this.setInfo();
  }
  onEnable() {
    super.onEnable.call(this);

    this.comeinTime = new Date().getTime();
    SdkHelper.reportData("b_entry_page", {
      act_page: "setting_page"
    });
    EventMgr.listen(GameEventType.WXLOGIN_FINISH, this.setInfo, this);
    EventMgr.listen(GameEventType.CLOSE_PERSONPAGE, this._hide, this);
  }
  onDisable() {
    EventMgr.ignore(GameEventType.WXLOGIN_FINISH, this.setInfo, this);
    EventMgr.ignore(GameEventType.CLOSE_PERSONPAGE, this._hide, this);
  }
  setInfo() {
    this.versionLabel.string = "v" + (A.a2.length == 0 ? "v1.1.0" : A.a2);
    this.uidLabel.string = "ID:" + (A.c0.length == 0 ? "001": A.c0);
    this.musicNormalNode.active = AudioManager.getInstance().getMusicState();
    this.musicUnNode.active = !AudioManager.getInstance().getMusicState();
    this.effectNormalNode.active = AudioManager.getInstance().getAudioState();
    this.effectUnNode.active = !AudioManager.getInstance().getAudioState();
    this.shakeNormalNode.active = AudioManager.getInstance().getVibratorState();
    this.shakeUnNode.active = !AudioManager.getInstance().getVibratorState();
  }
  onBtn(e, t) {
    AudioManager.getInstance().playMusic("btntouch");
    if ("zd" == t) {
      this.touchZdBtn();
    } else {
      if ("yx" == t) {
        this.effectTouch();
      } else {
        if ("yy" == t) {
          this.musicTouch();
        }
      }
    }
  }
  touchZdBtn() {
    if (AudioManager.getInstance().getVibratorState()) {
      AudioManager.getInstance().closeVibrator();
    } else {
      AudioManager.getInstance().openVibrator();
    }
    this.shakeNormalNode.active = AudioManager.getInstance().getVibratorState();
    this.shakeUnNode.active = !AudioManager.getInstance().getVibratorState();
    SdkHelper.reportData("click_vibrateTouch");
  }

  effectTouch() {
    if (AudioManager.getInstance().getAudioState()) {
      AudioManager.getInstance().closeAudio();
    } else {
      AudioManager.getInstance().openAudio();
    }
    this.effectNormalNode.active = AudioManager.getInstance().getAudioState();
    this.effectUnNode.active = !AudioManager.getInstance().getAudioState();
    SdkHelper.reportData("click_soundTouch");
  }

  onLabelBtn(e, t) {
    AudioManager.getInstance().playMusic("btntouch");
    if ("yh" == t) {
      // this.userAgreement();
    } else {
      if ("ys" == t) {
        this.privacyPolicy();
      }

    }
  }
  musicTouch() {
    if (AudioManager.getInstance().getMusicState()) {
      AudioManager.getInstance().closeBg();
    } else {
      AudioManager.getInstance().openBg();
    }
    this.musicNormalNode.active = AudioManager.getInstance().getMusicState();
    this.musicUnNode.active = !AudioManager.getInstance().getMusicState();
    SdkHelper.reportData("click_musicTouch");
  }
  customerService() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("click_help_center");
    var e = CUSTOMER_SERVICE;
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "helpCenterPage",
      data: {
        url: e
      }
    });
  }

  privacyPolicy() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("u_click_user_privacy");
    // var e = PlayerDataSys.getPrivacyAgreementUrl();
    // EventMgr.trigger(GameEventType.PAGE_SHOW, {
    //   name: "webPage",
    //   data: {
    //     title: `gkey_257`,
    //     url: e,
    //     index: 1
    //   },
    //   option: {
    //     reuse: false
    //   }
    // });
    if (cc.sys.isNative) { // 判断是否为原生平台 (Android/iOS)
        cc.sys.openURL(UrlMgr.getInstance().privacyUrl);
        console.log(`尝试在系统浏览器中打开：${UrlMgr.getInstance().privacyUrl}`);
    } else {
        // Web端预览时的备用方案
        window.open(UrlMgr.getInstance().privacyUrl, '_blank');
    }
  }

  logout() {
    if (PlayerDataSys.bindwx) {
      PageMgr.clear();
      EngineUtil.setLocalData("yid", "");
      AudioManager.getInstance().stopMusic("bg", true);
      cc.game.restart();
    } else EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "wxLoginPage",
      data: {
        type: "bind"
      }
    });
  }
  onClose() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("b_leave_page", {
      act_page: "setting_page",
      duration: new Date().getTime() - this.comeinTime
    });
    this._hide();
  }
  openDebug() {
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "debugPage"
    });
  }

  reStartGame() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.RESTART_GAME);
    this._hide();
  }
}