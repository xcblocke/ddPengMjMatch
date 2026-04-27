import PlayerDataSys from './framework/controller/PlayerDataSys';
import BasePage from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData, GameState } from './data/GameData';
import GlobalApp from './common/GlobalApp';
import SetNode2Top from './common/SetNode2Top';
import { PropType } from './framework/enum/AllEnum';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class rewardToastPage extends BasePage {
  @property(cc.Node)
  content: cc.Node = null;
  @property(cc.Node)
  cash: cc.Node = null;
  @property(cc.Node)
  red: cc.Node = null;
  @property(cc.Layout)
  ly: cc.Layout = null;
  @property(cc.Label)
  cash_txt: cc.Label = null;
  @property(cc.Label)
  red_txt: cc.Label = null;
  @property(cc.Label)
  prop_txt: cc.Label = null;
  @property(cc.Node)
  propNode: cc.Node = null;
  @property(cc.Sprite)
  propIconSp: cc.Sprite = null;
  @property(cc.SpriteFrame)
  propIcons: cc.SpriteFrame = [];
  cash_reward = 0;
  gold_reward = 0;
  data = null;
  cb = null;
  onLoad() {
    this._lockInit({
      hasBlack: true,
      hasPeneLock: false,
      hasTouchLock: false
    });
    super.onLoad.call(this);
    this._animInit({
      endOpacity: 220
    });
  }
  onEnable() {
    super.onEnable.call(this);
    AudioManager.getInstance().playMusic("addbalance");
  }
  _init(e) {
    var t = this;
    console.log("reward toast data------------", e);
    var o = e.cash,
      n = e.red,
      a = e.propInfo;
    this.data = e;
    this.cash.active = false;
    this.red.active = false;
    this.propNode.active = false;
    this.cash_reward = o;
    this.gold_reward = n;
    this.cb = null == e ? void 0 : e.cb;
    this.ly.spacingX = 100;
    if (o > 0) {
      this.cash.active = true;
      PlayerDataSys.getCashBalanceWithUnit(gameData.luckyCash, "");
      this.cash_txt.string = PlayerDataSys.getCashBalanceWithUnit(o, "");
    }
    if (n > 0) {
      this.red.active = true;
      this.red_txt.string = PlayerDataSys.getGoldBalanceWithUnit(n, "");
    }
    if (a) {
      this.propNode.active = true;
      var i = 0;
      if (a.type == PropType.reshuffleCard) {
        i = 1;
      } else {
        if (a.type == PropType.tipCard) {
          i = 0;
        } else {
          a.type == PropType.freezeCard && (i = 2);
        }
      }
      this.propIconSp.spriteFrame = this.propIcons[i];
      this.prop_txt.string = a.num;
    }
    this.ly.spacingX = 80;
    setTimeout(function () {
      if (t.cash_reward > 0) {
        SetNode2Top.setTopZIndex(GlobalApp.GameMain.wxNode);
        EventMgr.trigger(GameEventType.SHOWEFFECT, {
          start: t.cash.parent.convertToWorldSpaceAR(t.cash.position),
          num: 3,
          type: 0,
          cb: function () {
            EventMgr.trigger(GameEventType.UPDATE_BALANCE, {
              start: PlayerDataSys.cashBalance - t.cash_reward,
              end: PlayerDataSys.cashBalance
            });
            EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
              type: 0,
              num: t.cash_reward
            });
          }
        });
      }
      if (t.gold_reward > 0) {
        SetNode2Top.setTopZIndex(GlobalApp.GameMain.goldNode);
        EventMgr.trigger(GameEventType.SHOWEFFECT, {
          start: t.red.parent.convertToWorldSpaceAR(t.red.position),
          num: t.gold_reward < 5 ? t.gold_reward : 5,
          type: 1,
          cb: function () {
            EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE, {
              start: PlayerDataSys.goldBalance - t.gold_reward,
              end: PlayerDataSys.goldBalance
            });
            EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
              type: 1,
              num: t.gold_reward
            });
          }
        });
      }
      AudioManager.getInstance().playMusic("addbalance");
    }, 200);
    if (gameData.gameState == GameState.gameing) {
      EventMgr.trigger(GameEventType.PAUSE_COUNT_DOWN);
      this.scheduleOnce(function () {
        EventMgr.trigger(GameEventType.RESUME_COUNT_DOWN);
      }, 1.5);
    }
    this.playAnim();
  }
  playAnim() {
    var e = this;
    this.content.x = -1000;
    cc.tween(this.content).to(0.2, {
      x: 0
    }).start();
    setTimeout(function () {
      var t;
      SetNode2Top.restoreNode(GlobalApp.GameMain.wxNode);
      SetNode2Top.restoreNode(GlobalApp.GameMain.goldNode);
      e._hide();
      EngineUtil.triggerPromise("turntablePage");
      null === (t = e.cb) || void 0 === t || t.call(e);
      if (e.data.propInfo) {
        var o = [];
        o.push({
          code: e.data.propInfo.type,
          wpos: cc.Vec3.ZERO
        });
        EventMgr.trigger(GameEventType.ADD_PROP_ANIM, {
          props: o
        });
        setTimeout(function () {
          EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
        }, 700);
      }
    }, 1500);
  }
}
