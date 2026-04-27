import AudioManager from './framework/controller/AudioManager';
import BaseSystem from './framework/controller/BaseSystem';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import BaseEventType from './framework/controller/BaseEventType';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import AdManager from './framework/Platform/AdManager';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wxLoginPage extends BasePage {
  @property(cc.Node)
  closeNode: cc.Node = null;
  @property(cc.Node)
  agreePage: cc.Node = null;
  @property(cc.Node)
  agreeImg: cc.Node = null;
  hasAgree = false;
  couldTouch = true;
  wxType = "login";
  hasSuccess = false;
  hasImgAd = false;
  comeinTime = 0;
  autoNew = false;
  onLoad() {
    super.onLoad.call(this);
  }
  _init(e) {
    this.hasImgAd = false;
    this.hasSuccess = false;
    this.agreePage.active = true;
    this.hasAgree = false;
    this.setImg();
    var t = e.type,
      o = e.hasImgAd,
      n = e.autoNew;
    this.hasImgAd = o;
    this.wxType = t;
    this.couldTouch = true;
    this.autoNew = n || false;
    EventMgr.listen(BaseEventType.GET_WECHAT_CODE, this.getWxCode, this);
    this.comeinTime = new Date().getTime();
    SdkHelper.reportData("b_entry_page", {
      act_page: "bind_wx"
    });
    cc.sys.localStorage.getItem("newUserPage_wxLogin") || "login" != this.wxType && cc.sys.localStorage.setItem("newUserPage_wxLogin", "ok");
  }
  setImg() {
    this.agreeImg.active = this.hasAgree;
  }
  agreeBtnCall() {
    this.agreeImg.active = !this.agreeImg.active;
    this.hasAgree = this.agreeImg.active;
  }
  agree() {
    this.hasAgree = !this.hasAgree;
    this.setImg();
  }
  doAgree() {
    this.hasAgree = true;
    this.setImg();
    this.wxLogin();
  }
  deCancel() {
    AudioManager.getInstance().playMusic("btntouch");
    this._hide();
  }
  wxLogin() {
    var e = this;
    AudioManager.getInstance().playMusic("btntouch");
    if (this.hasAgree) {
      if (this.couldTouch) {
        SdkHelper.reportData("click_wxlogin");
        SdkHelper.reportData("start_registration", null, true);
        this.couldTouch = false;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(function () {
          e.couldTouch = true;
        }, 3);
        SdkHelper.callWxLogin();
      }
    } else this.agreePage.active = true;
  }
  getWxCode(e) {
    var t = this,
      o = {
        wechat_code: e
      },
      n = SdkHelper.requestTDId();
    n && "not_init" !== n && (o.black_box = n);
    cc.sys.os === cc.sys.OS_ANDROID && (o.bd_did = SdkHelper.getBD_did());
    switch (this.wxType) {
      case "login":
        BaseSystem.wechatLogin(o).then(function (e) {
          return t.loginBack(e);
        }).catch(function () {});
        break;
      case "bind":
        BaseSystem.wechatBind(o).then(function (e) {
          return t.loginBack(e);
        }).catch(function () {});
    }
  }
  loginBack(e) {
    var t = e.code;
    if (-2 != t) {
      SdkHelper.reportData("wx_login_success");
      this.hasSuccess = true;
      EngineUtil.log("微信登录成功");
      EngineUtil.log(e);
      PlayerDataSys.initUserId(e.data);
      PlayerDataSys.initWxData(e.data);
      1 == e.data.wechat_register && SdkHelper.reportData("register");
      SdkHelper.reportData("complete_registration", {
        code: t
      }, true);
      SdkHelper.reportData("wxLogin_finish", {
        code: t
      });
      if (2 == t) this.loginAgain();else {
        SdkHelper.showToast("登录成功");
        SdkHelper.reportData("b_leave_page", {
          act_page: "bind_wx",
          duration: new Date().getTime() - this.comeinTime
        });
        this._hide();
      }
    } else SdkHelper.showToast(e.message || "微信登录失败~");
  }
  loginAgain() {
    PageMgr.clear();
    AudioManager.getInstance().stopMusic("bg", true);
    cc.game.restart();
  }
  user_agreement() {
    var e = PlayerDataSys.getUserAgreementUrl(1);
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        is_first: true,
        title: "用户协议",
        url: e,
        index: 0
      },
      option: {
        reuse: false
      }
    });
  }
  privacy_agreement() {
    var e = PlayerDataSys.getPrivacyAgreementUrl();
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        is_first: true,
        title: "隐私条款",
        url: e,
        index: 1
      },
      option: {
        reuse: false
      }
    });
  }
  _onHide() {
    this.hasImgAd && AdManager.getInstance().showImgAd();
    super._onHide.call(this);
    EventMgr.ignore(BaseEventType.GET_WECHAT_CODE, this.getWxCode, this);
    if (this.hasSuccess) {
      EventMgr.trigger(GameEventType.WXLOGIN_FINISH);
      SdkHelper.reportData("close_wxLogin");
    }
  }
  close() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("b_leave_page", {
      act_page: "bind_wx",
      duration: new Date().getTime() - this.comeinTime
    });
    this._hide();
  }
}