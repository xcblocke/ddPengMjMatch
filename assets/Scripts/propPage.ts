import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType, VideoType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import AdManager from './framework/Platform/AdManager';
import SdkHelper from './framework/SdkHelper';
import { gameConfig } from './data/GameConfig';
import GameSystem from './system/GameSystem';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
var a;
(a = {})[PropType.tipCard] = `gkey_486`;
a[PropType.reshuffleCard] = `gkey_152`;
a[PropType.freezeCard] = `{"gkey_487":{"v1":"${30}"}}`;
var v = a;
@ccclass
export default class propPage extends BasePage {
  @property(cc.Node)
  title: cc.Node = null;
  @property(cc.SpriteFrame)
  titles: cc.SpriteFrame = [];
  @property(cc.Node)
  icon: cc.Node = null;
  @property(cc.SpriteFrame)
  icons: cc.SpriteFrame = [];
  @property(cc.Label)
  tipsLb: cc.Label = null;
  @property(cc.Label)
  numLb: cc.Label = null;
  @property(cc.Label)
  goldBubbleLb: cc.Label = null;
  _type = 0;
  videoType = VideoType.TipCard;
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.SCALE,
      blackTime: 0.2,
      pageTime: 0.2
    });
  }
  _init(e) {
    var t = e.type - 1;
    this.title.getComponent(cc.Sprite).spriteFrame = this.titles[t];
    this.icon.getComponent(cc.Sprite).spriteFrame = this.icons[t];
    this.tipsLb.string = v[e.type];
    this._type = parseInt(e.type);
    SdkHelper.reportData("get_prop_page", {
      prop_id: e.type
    });
    var o = Number(gameConfig.paramConfig.show_red_bag.para_value);
    this.goldBubbleLb.string = "" + o;
    var n = 1;
    if (e.type == PropType.tipCard) {
      n = 3;
      this.videoType = VideoType.TipCard;
    } else if (e.type == PropType.reshuffleCard) {
      n = 1;
      this.videoType = VideoType.ReshuffleCard;
    } else if (e.type == PropType.freezeCard) {
      n = 1;
      this.videoType = VideoType.FreezeCard;
    }
    this.numLb.string = "x" + n;
  }
  close() {
    SdkHelper.reportData("get_prop_close", {
      prop_id: this._type
    });
    super._hide.call(this);
  }
  gotoAd() {
    var e = this;
    SdkHelper.reportData("get_prop_video", {
      idx: this._type
    });
    var t = function t() {
      AdManager.getInstance().playVideoAd(e.succFunc.bind(e), e.failFunc.bind(e));
    };
    if (PlayerDataSys.isOppoReviewer()) {
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "lookAdPage",
        data: {
          okCb: function () {
            t();
          },
          cancelCb: function () {}
        }
      });
    } else {
      t();
    }
  }
  failFunc() {
    SdkHelper.showForceToast(`gkey_314`);
    this.succFunc(false);
  }
  succFunc(e = true) {
    var t = this;
    SdkHelper.reportData("get_prop_succ", {
      prop_id: this._type
    });
    GameSystem.videoReward({
      video_type: this.videoType,
      force_type: 0,
      is_over: e
    }, this._type).then(function (o) {
      PlayerDataSys.setUserPropCount(o.prop_info, false);
      var n = function n() {
        var n = null,
          a = 0;
        if (e) {
          if (t._type == PropType.tipCard) {
            a = 3;
          } else {
            if (t._type == PropType.reshuffleCard) {
              a = 1;
            } else {
              t._type == PropType.freezeCard && (a = 1);
            }
          }
          n = {
            type: t._type,
            num: a
          };
        }
        (o.data.cash_reward > 0 || o.data.gold_reward > 0 || null != n) && EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "rewardToastPage",
          data: {
            cash: 0,
            red: 0,
            propInfo: n
          }
        });
        t._hide();
      };
      if (o.data.cash_reward > 0 || o.data.gold_reward > 0) {
        n();
      } else {
        setTimeout(function () {
          n();
        }, 500);
      }
      PlayerDataSys.setUserPropCount(o.data.prop_info, false);
    });
  }
}