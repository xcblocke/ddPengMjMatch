import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType, VideoType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import { gameConfig } from './data/GameConfig';
import GameSystem from './system/GameSystem';
import BasePage, { AnimType } from './view/BasePage';
import { propCostDollar } from './config';
import EngineUtil from './framework/EngineUtil';
import { gameData } from './data/GameData';
import AudioManager from './framework/controller/AudioManager';
import GlobalApp from './common/GlobalApp';
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
  // @property(cc.Node)
  // title: cc.Node = null;
  @property(cc.SpriteFrame)
  titles: cc.SpriteFrame[] = [];
  @property(cc.Node)
  icon: cc.Node = null;
  @property(cc.SpriteFrame)
  icons: cc.SpriteFrame[] = [];
  @property(cc.Label)
  tipsLb: cc.Label = null;
  @property(cc.Label)
  numLb: cc.Label = null;

  @property(cc.Label)
  numLbCostDollar: cc.Label = null;

  @property(cc.Label)
  goldBubbleLb: cc.Label = null;

  @property(cc.Button)
  cliamBtn: cc.Button = null;

  isFlying = false;

  _type = 0;
  /** 本弹窗一次兑换的道具张数（与 numLb 的 xN 一致） */
  _buyCount = 1;
  /** 本弹窗一次消耗的总金币（与 numLbCostDollar 一致） */
  _totalCostDollar = 0;
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
    this.cliamBtn.interactable = true;
    this.isFlying = false;
    var t = e.type - 1;
    // this.title.getComponent(cc.Sprite).spriteFrame = this.titles[t];
    this.icon.getComponent(cc.Sprite).spriteFrame = this.icons[t];
    this.tipsLb.string = v[e.type];
    this._type = parseInt(e.type);
    SdkHelper.reportData("get_prop_page", {
      prop_id: e.type
    });
    var o = Number(gameConfig.paramConfig.show_red_bag.para_value);
    this.goldBubbleLb.string = "" + o;
    var n = 1;
    let costDollarNum = 0;
    if (e.type == PropType.tipCard) {
      n = 3;
      costDollarNum = propCostDollar[PropType.tipCard] * n;
      this.videoType = VideoType.TipCard;
    } else if (e.type == PropType.reshuffleCard) {
      n = 1;
      costDollarNum = propCostDollar[PropType.reshuffleCard] * n;
      this.videoType = VideoType.ReshuffleCard;
    } else if (e.type == PropType.freezeCard) {
      n = 1;
      costDollarNum = propCostDollar[PropType.freezeCard] * n;
      this.videoType = VideoType.FreezeCard;
    }
    this.numLb.string = "x" + n;
    this.numLbCostDollar.string = "" + costDollarNum;
    this._buyCount = n;
    this._totalCostDollar = costDollarNum;
  }
  close() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("get_prop_close", {
      prop_id: this._type
    });
    super._hide.call(this);
  }
  gotoAd() {
    if(this.isFlying) return; 
    
    AudioManager.getInstance().playMusic("btntouch");
    // Replace ad flow with coin exchange flow.
    SdkHelper.reportData("get_prop_video", {
      idx: this._type
    });
    const cost = Number(this._totalCostDollar) || 0;
    const addNum = Math.max(1, Math.floor(Number(this._buyCount) || 1));
    if (cost <= 0) {
      EngineUtil.showCocosToast3("兑换失败");
      return;
    }
    if (Number(gameData.dollarBalance || 0) < cost) {
      EngineUtil.showCocosToast3("金币不足，兑换失败");
      return;
    }

    this.isFlying = true;
    this.cliamBtn.interactable = false;

    gameData.dollarBalance = Number(gameData.dollarBalance || 0) - cost;
    EngineUtil.setLocalData("user_dollar_balance", String(gameData.dollarBalance));
    EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, gameData.dollarBalance);
    if (this._type == PropType.tipCard) {
      PlayerDataSys.tipCardCount = Number(PlayerDataSys.tipCardCount || 0) + addNum;
      this.playPropFlyAnim();
    } else if (this._type == PropType.reshuffleCard) {
      PlayerDataSys.reshuffleCardCount = Number(PlayerDataSys.reshuffleCardCount || 0) + addNum;
      this.playPropFlyAnim();
    } else {
      EngineUtil.showCocosToast3("兑换失败");
      return;
    }
    // EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT, null);
    // this._hide();
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
        (o.data.coin_reward > 0 || o.data.gold_reward > 0 || null != n) && EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "rewardToastPage",
          data: {
            coin: 0,
            red: 0,
            propInfo: n
          }
        });
        t._hide();
      };
      if (o.data.coin_reward > 0 || o.data.gold_reward > 0) {
        n();
      } else {
        setTimeout(function () {
          n();
        }, 500);
      }
      PlayerDataSys.setUserPropCount(o.data.prop_info, false);
    });
  }

  playPropFlyAnim() {
    var e = this,
      t = cc.instantiate(this.icon);
    t.parent = this.icon.parent;
    this.cliamBtn.interactable = false;
    this.icon.parent.convertToWorldSpaceAR(this.icon.position);
    var o = null;
    if (this._type == PropType.tipCard) {
      o = GlobalApp.GameMain.propContainer.getChildByName("tipBtn");
    } else {
      if (this._type == PropType.reshuffleCard) {
        o = GlobalApp.GameMain.propContainer.getChildByName("reshuffleCard");
      } else {
        this._type == PropType.freezeCard && (o = GlobalApp.GameMain.propContainer.getChildByName("freeze"));
      }
    }
    var n = o.parent.convertToWorldSpaceAR(o.position),
      a = t.parent.convertToNodeSpaceAR(n);
    t.scale = 0.6;
    AudioManager.instance.playMusic("xiu");
    AudioManager.instance.playMusic("dztx");
  
    cc.tween(t).to(0.7, {
      position: a,
      scale: 0
    }, {
      easing: "backIn"
    }).call(function () {
      cc.tween(o).to(0.1, {
        scale: 1.1
      }).to(0.1, {
        scale: 1
      }).to(0.1, {
        scale: 0.9
      }).to(0.1, {
        scale: 1
      }).start();
      EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
      t.destroy();
      // e.close();
      e._hide();
    }).start();
  }
}