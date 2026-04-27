import AudioManager from './framework/controller/AudioManager';
import BaseSystem from './framework/controller/BaseSystem';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import { CUSTOMER_SERVICE } from './framework/SystemConfig';
import EngineUtil from './framework/EngineUtil';
import Service from './service/Service';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class SetUpPage extends BasePage {
  cb = null;
  @property(cc.Label)
  nameLabel: cc.Label = null;
  @property(cc.Label)
  lvLabel: cc.Label = null;
  @property(cc.Label)
  IDLabel: cc.Label = null;
  @property(cc.Sprite)
  head: cc.Sprite = null;
  @property(cc.Sprite)
  musicImg: cc.Sprite = null;
  @property(cc.Sprite)
  soundImg: cc.Sprite = null;
  @property(cc.Sprite)
  gxhImg: cc.Sprite = null;
  @property(cc.Sprite)
  zdImg: cc.Sprite = null;
  @property(cc.Node)
  musicLabel0: cc.Node = null;
  @property(cc.Node)
  musicLabel1: cc.Node = null;
  @property(cc.Node)
  soundLabel0: cc.Node = null;
  @property(cc.Node)
  soundLabel1: cc.Node = null;
  @property(cc.Node)
  gxhLabel0: cc.Node = null;
  @property(cc.Node)
  gxhLabel1: cc.Node = null;
  @property(cc.Node)
  zdLabel0: cc.Node = null;
  @property(cc.Node)
  zdLabel1: cc.Node = null;
  @property(cc.Label)
  helpLb: cc.Label = null;
  @property(cc.Label)
  adLb: cc.Label = null;
  @property(cc.SpriteFrame)
  turnImgs: cc.SpriteFrame = [];
  @property(cc.Node)
  demoNode: cc.Node = null;
  @property(cc.EditBox)
  levelEditBox: cc.EditBox = null;
  @property(cc.Sprite)
  barrageImg: cc.Sprite = null;
  comeinTime = 0;
  start() {
    this.demoNode.active = gameData.isOpenDemo;
  }
  _init() {
    this.setInfo();
  }
  onEnable() {
    super.onEnable.call(this);
    this.helpLb.string = PlayerDataSys.isTencent() ? "客服通道" : "帮助中心";
    var t = "xiaomi" == SdkHelper.getChannelName().toLowerCase();
    this.adLb.string = t ? "个性化广告" : "个性化推荐";
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
    var e = this,
      t = PlayerDataSys.nickname || "游客";
    this.nameLabel.string = this.nameFormat(t);
    this.IDLabel.string = "ID:" + PlayerDataSys.userid;
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (t) {
      e.head.spriteFrame = new cc.SpriteFrame(t);
    }).catch(function (e) {
      console.log(e);
    });
    this.musicImg.spriteFrame = this.turnImgs[Number(AudioManager.getInstance().getMusicState())];
    this.soundImg.spriteFrame = this.turnImgs[Number(AudioManager.getInstance().getAudioState())];
    this.gxhImg.spriteFrame = this.turnImgs[PlayerDataSys.reco_switch];
    this.zdImg.spriteFrame = this.turnImgs[Number(AudioManager.getInstance().getVibratorState())];
    var o = PlayerDataSys.user_level;
    this.lvLabel.string = "" + o;
    var n = EngineUtil.localStorageGetItem("barrageIsOpen", "close");
    this.barrageImg.spriteFrame = "open" == n ? this.turnImgs[1] : this.turnImgs[0];
  }
  nameFormat(e) {
    for (var t = e.split(""), o = t.length, n = 0, a = "", i = "", r = new RegExp("[一-龥]+"), c = 0; c < o; c++) {
      var s = t[c];
      if (r.test(s)) {
        n += 2;
      } else {
        n++;
      }
      if (n > 12) {
        i = "...";
        break;
      }
      a += s;
    }
    return a + i;
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
        } else {
          if ("gx" == t) {
            this.touchPersonality();
          } else {
            "dm" == t && this.touchBarrageBtn();
          }
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
    this.zdImg.spriteFrame = this.turnImgs[Number(AudioManager.getInstance().getVibratorState())];
    SdkHelper.reportData("click_vibrateTouch");
  }
  touchBarrageBtn() {
    AudioManager.getInstance().playMusic("btntouch");
    var e = EngineUtil.localStorageGetItem("barrageIsOpen", "close");
    EngineUtil.localStorageSetItem("barrageIsOpen", "open" == e ? "close" : "open");
    var t = EngineUtil.localStorageGetItem("barrageIsOpen", "close");
    this.barrageImg.spriteFrame = "open" == t ? this.turnImgs[1] : this.turnImgs[0];
    SdkHelper.reportData("click_barrageTouch", {
      state: t
    });
    EventMgr.trigger(GameEventType.UPDATE_DANMU);
  }
  effectTouch() {
    if (AudioManager.getInstance().getAudioState()) {
      AudioManager.getInstance().closeAudio();
    } else {
      AudioManager.getInstance().openAudio();
    }
    this.soundImg.spriteFrame = this.turnImgs[Number(AudioManager.getInstance().getAudioState())];
    SdkHelper.reportData("click_soundTouch");
  }
  touchPersonality() {
    var e = this,
      t = PlayerDataSys.reco_switch ? 0 : 1;
    BaseSystem.setReco({
      reco_switch: t
    }).then(function (o) {
      if (o && 1 == o.code) {
        PlayerDataSys.reco_switch = t;
        e.gxhImg.spriteFrame = e.turnImgs[t];
        if (t) {
          SdkHelper.reportData("reco_switch_open");
        } else {
          SdkHelper.reportData("reco_switch_close");
        }
      }
    }).catch(function () {});
  }
  onLabelBtn(e, t) {
    AudioManager.getInstance().playMusic("btntouch");
    if ("yh" == t) {
      this.userAgreement();
    } else {
      if ("ys" == t) {
        this.privacyPolicy();
      } else {
        if ("gy" == t) {
          this.aboutUs();
        } else {
          if ("zx" == t) {
            this.remove();
          } else {
            if ("tc" == t) {
              this.logout();
            } else {
              if ("bz" == t) {
                this.customerService();
              } else {
                "dm" == t && this.touchBarrageBtn();
              }
            }
          }
        }
      }
    }
  }
  musicTouch() {
    if (AudioManager.getInstance().getMusicState()) {
      AudioManager.getInstance().closeBg();
    } else {
      AudioManager.getInstance().openBg();
    }
    this.musicImg.spriteFrame = this.turnImgs[Number(AudioManager.getInstance().getMusicState())];
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
  aboutUs() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "aboutPage"
    });
  }
  userAgreement() {
    SdkHelper.reportData("u_click_user_agreement");
    AudioManager.getInstance().playMusic("btntouch");
    var e = PlayerDataSys.getUserAgreementUrl(0);
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        title: "用户协议",
        url: e,
        index: 0
      },
      option: {
        reuse: false
      }
    });
  }
  privacyPolicy() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("u_click_user_privacy");
    var e = PlayerDataSys.getPrivacyAgreementUrl();
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        title: "隐私政策",
        url: e,
        index: 1
      },
      option: {
        reuse: false
      }
    });
  }
  remove() {
    if (PlayerDataSys.bindwx) {
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "removeUserPage"
      });
    } else {
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wxLoginPage",
        data: {
          type: "bind"
        }
      });
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
  passClick() {
    GameSystem.submitGame({
      is_tg: 1,
      complete_flag: 1,
      skip: 1
    }).then(function (e) {
      EngineUtil.reconnectSuc();
      var t = e.is_extract,
        o = !!t,
        n = {
          type: 5,
          is_force: e.levelup_force_flag,
          is_extract: t,
          cb: function () {
            o || EventMgr.trigger(GameEventType.START_GAME);
          },
          tg_progress_info: e.tg_progress_info
        };
      if (gameData.isOpenDemo) {
        EventMgr.trigger(GameEventType.START_GAME);
      } else {
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "settleMentPage",
          data: n
        });
      }
    }).catch(function () {});
    this._hide();
  }
  updateLevelClick() {
    var e = this.levelEditBox.string;
    Service.updateLevel({
      level: parseInt(e)
    }).then(function () {
      EventMgr.trigger(GameEventType.START_GAME);
    }).catch(function () {});
    this._hide();
  }
  reStartGame() {
    EventMgr.trigger(GameEventType.RESTART_GAME);
    this._hide();
  }
}