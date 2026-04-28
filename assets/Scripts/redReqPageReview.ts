import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class redReqPageReview extends BasePage {
  @property(cc.Label)
  userName: cc.Label = null;
  @property(cc.Node)
  head: cc.Node = null;
  @property(cc.RichText)
  wait: cc.RichText = null;
  @property(cc.Animation)
  pro_d1: cc.Animation = null;
  @property(cc.Animation)
  pro_d2: cc.Animation = null;
  @property(cc.Animation)
  pro_d3: cc.Animation = null;
  @property(cc.Animation)
  pro_d4: cc.Animation = null;
  @property(cc.Animation)
  pro_d5: cc.Animation = null;
  @property(cc.Node)
  pro_desc1: cc.Node = null;
  @property(cc.Node)
  pro_desc2: cc.Node = null;
  @property(cc.Node)
  pro_desc3: cc.Node = null;
  @property(cc.Node)
  pro_desc4: cc.Node = null;
  @property(cc.Node)
  pro_desc5: cc.Node = null;
  @property(cc.Node)
  pro_wait4: cc.Node = null;
  @property(cc.Node)
  pro_wait5: cc.Node = null;
  @property(cc.Node)
  btn_node: cc.Node = null;
  @property(cc.Label)
  rate_num: cc.Label = null;
  @property(cc.RichText)
  title: cc.RichText = null;
  @property(cc.RichText)
  title_sub1: cc.RichText = null;
  @property(cc.RichText)
  title_sub2: cc.RichText = null;
  @property(cc.Node)
  aniLine: cc.Node = null;
  @property(cc.Label)
  tips: cc.Label = null;
  @property(cc.Node)
  bottomNode: cc.Node = null;
  extract_amount = 0;
  extract_data = null;
  pageType = "wd";
  @property(cc.Node)
  bottomNode2: cc.Node = null;
  _data = null;
  start() {}
  onEnable() {
    super.onEnable.call(this);
    this.unscheduleAllCallbacks();
  }
  _init(e) {
    this._data = e.server_data;
    this.aniLine.height = 0;
    this.pro_d1.node.opacity = 0;
    this.pro_d2.node.opacity = 0;
    this.pro_d3.node.opacity = 0;
    this.pro_d4.node.opacity = 0;
    this.pro_d5.node.opacity = 0;
    this.pro_d3.node.parent.opacity = 0;
    this.pro_d4.node.parent.opacity = 0;
    this.pro_d5.node.parent.opacity = 0;
    this.pro_wait4.opacity = 0;
    this.pro_wait5.opacity = 0;
    this.btn_node.opacity = 0;
    this.pro_desc1.opacity = 0;
    this.pro_desc2.opacity = 0;
    this.pro_desc3.opacity = 0;
    this.pro_desc4.opacity = 0;
    this.pro_desc5.opacity = 0;
    this.title_sub1.node.active = false;
    this.title_sub2.node.active = false;
    this.bottomNode.opacity = 0;
    this.bottomNode2.opacity = 0;
    this.pageType = e.wdType;
    var t = e.skipAni || false;
    this.playAni(this.pro_d1, "wdTurn", t);
    this.initBottom();
    this.updateInfo(e.wdType);
  }
  updateInfo(e = "wd") {
    var t = this._data.cash_extract_limit_info.extract_status,
      o = this._data.cash_extract_limit_info;
    switch (t) {
      case 2:
        this.pro_wait4.getComponent(cc.RichText).string = `{"gkey_490":{"v1":"${o.waiting_audit.num}"}}` + o.waiting_audit.rate;
        break;
      case 3:
        this.pro_wait5.getComponent(cc.RichText).string = `{"gkey_491":{"v1":"${o.line_up.num}","v2":"${o.line_up.limit_day}"}}`;
    }
    if ("redWd" == e) {
      this.pro_desc1.getComponent(cc.Label).string = `gkey_492`;
      this.pro_desc2.getComponent(cc.Label).string = `gkey_493`;
    }
  }
  playAni(e, t = null, o = false) {
    var n = this;
    console.log("playAni == " + e.node.name + "   aniName == " + t);
    e.node.active = true;
    e.node.opacity = 255;
    var a = this._data.cash_extract_limit_info.extract_status;
    console.log("status", a);
    var i = function i() {
      console.log("playAni finished == " + e.node.name);
      if (e == n.pro_d1) {
        n.playLineAnim(100, function () {
          n.playAni(n.pro_d2, null, o);
        });
        n.playShowSacleAnim(n.pro_desc1);
      } else if (e == n.pro_d2) {
        n.pro_d3.node.parent.active = true;
        n.pro_d3.node.parent.opacity = 255;
        n.playLineAnim(200, function () {
          n.playAni(n.pro_d3, null, o);
        });
        n.playShowSacleAnim(n.pro_desc2);
      } else if (e == n.pro_d3) {
        n.pro_desc3.active = true;
        n.pro_desc3.opacity = 255;
        n.pro_d4.node.parent.active = true;
        n.pro_d4.node.parent.opacity = 255;
        if (a > 0) {
          var t = 2 == a ? "wdTurnWait" : "wdTurn";
          n.playLineAnim(300, function () {
            n.playAni(n.pro_d4, t, o);
          });
          n.playShowSacleAnim(n.pro_desc3);
        }
      } else if (e == n.pro_d4) {
        n.pro_wait4.active = false;
        n.pro_desc4.active = true;
        n.pro_wait4.opacity = 0;
        n.pro_desc4.opacity = 255;
        n.pro_desc4.getComponent(cc.Label).string = 3 == a ? `gkey_494` : `gkey_495`;
        if (2 == a) {
          n.pro_wait4.active = true;
          n.pro_wait4.opacity = 255;
        } else {
          var i = 3 == a ? "wdTurnWait" : "wdTurn";
          n.playLineAnim(400, function () {
            n.playAni(n.pro_d5, i, o);
          });
          n.pro_d5.node.parent.active = true;
          n.pro_d5.node.parent.opacity = 255;
        }
        n.playShowSacleAnim(n.pro_desc4);
        setTimeout(function () {
          n.bottomNode.active = true;
          n.bottomNode.opacity = 255;
          setTimeout(function () {
            n.bottomNode2.active = true;
            n.bottomNode2.opacity = 255;
            if (2 == a) {
              n.btn_node.active = true;
              n.btn_node.opacity = 255;
            }
          }, 500);
        }, 1000);
      } else if (e == n.pro_d5) {
        n.pro_wait5.active = false;
        n.pro_desc5.active = true;
        n.pro_wait5.opacity = 0;
        n.pro_desc5.opacity = 255;
        n.pro_desc5.getComponent(cc.Label).string = a > 2 ? `gkey_496` : `gkey_497`;
        console.log(n.pro_desc5.getComponent(cc.Label).string);
        n.pro_wait5.active = a > 2;
        setTimeout(function () {
          n.bottomNode.opacity = 255;
          setTimeout(function () {
            n.bottomNode2.opacity = 255;
            n.btn_node.opacity = 255;
          }, 500);
        }, 1000);
      }
      e.off("finished");
    };
    if (o) i();else {
      e.play(t);
      e.on("finished", function () {
        i();
      });
    }
  }
  withdraw() {
    this.clickClose();
  }
  initBottom() {
    var e = this,
      t = this._data.cash_extract_limit_info;
    this.rate_num.string = t.extract_rate;
    this.userName.string = EngineUtil.nameFormat(PlayerDataSys.nickname);
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (t) {
      e.head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
    }).catch(function (e) {
      console.log(e);
    });
    var o = t.extract_status;
    t.need_god_animal_count, t.obtain_god_animal_count;
    switch (o) {
      case 1:
        this.title.string = `{"gkey_498":{"v1":"${t.no_audit_level}"}}`;
        this.tips.string = `gkey_499`;
        break;
      case 2:
        if ("redWd" == this.pageType) {
          this.title.string = `gkey_500`;
        } else {
          this.title.string = `gkey_501`;
        }
        this.title_sub1.string = `{"gkey_502":{"v1":"${t.need_sign_days}","v2":"${t.sign_days}"}}`;
        this.title_sub2.string = `{"gkey_503":{"v1":"${t.need_sign_level_count}","v2":"${t.sign_level_count}","v3":"${t.need_sign_level_count}"}}`;
        this.title_sub1.node.active = true;
        this.title_sub2.node.active = true;
        this.tips.string = `gkey_499`;
        break;
      case 3:
        this.title.string = `{"gkey_504":{"v1":"${t.need_xc_level}"}}`;
        this.title_sub1.string = `{"gkey_505":{"v1":"${t.xc_level}","v2":"${t.need_xc_level}"}}`;
        this.title_sub1.node.active = true;
        this.tips.string = `gkey_506`;
        break;
      default:
        console.log("wdReqPageReview error extract_status  == ", o);
    }
  }
  clickClose() {
    if (255 == this.btn_node.opacity) {
      AudioManager.getInstance().playMusic("btntouch");
      AudioManager.getInstance().stopMusic("wd_req_review", false);
      SdkHelper.reportData("wd_req_page_review_close");
      this._hide();
      EventMgr.trigger(GameEventType.UPDATEWDPAGE);
    }
  }
  playShowSacleAnim(e) {
    e.active = true;
    e.scale = 0;
    e.opacity = 255;
    cc.tween(e).to(0.1, {
      scale: 1
    }).start();
  }
  playLineAnim(e, t) {
    cc.tween(this.aniLine).to(0.3, {
      height: e
    }).call(function () {
      t();
    }).start();
  }
}