import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
enum r {
  Cash = 0,
  Gold = 1,
}
@ccclass
export default class TopBar extends cc.Component {
  @property(cc.Label)
  label0: cc.Label = null;
  @property(cc.Label)
  label1: cc.Label = null;
  @property(cc.RichText)
  label2: cc.RichText = null;
  @property(cc.Node)
  goldNode: cc.Node = null;
  @property(cc.Node)
  cashBubbleNode: cc.Node = null;
  @property(cc.Node)
  goldBubbleNode: cc.Node = null;
  _cashBubbleTip = "";
  _goldBubbleTip = "";
  _curShowBubbleType = r.Cash;
  _goldBubbleTipFlag = false;
  onLoad() {
    EventMgr.listen(GameEventType.FRESH_RED_BUBBLE, this.freshBubble, this);
    EventMgr.listen(GameEventType.UPDATE_BALANCE, this.freshCashBubble, this);
    EventMgr.listen(GameEventType.HIDE_BUBBLE, this.hideBubble, this);
    EventMgr.listen(GameEventType.SHOW_BUBBLE, this.showBubble, this);
  }
  onDestroy() {
    EventMgr.ignoreAllByCaller(this);
  }
  start() {
    this.label0.string = PlayerDataSys.getCashBalance();
    this.label1.string = PlayerDataSys.getGoldBalance();
    this.cashBubbleNode.active = false;
    this.goldBubbleNode.active = false;
    if (gameData.isOpenDemo) this.goldNode.x = -173.033;else {
      this.goldNode.x = 173.033;
      this.loopShow();
    }
  }
  freshBubble() {
    if (gameData.canCashExtract) {
      this.hideBubble();
    } else {
      this.showBubble();
    }
    this.loopShow();
  }
  freshCashBubble() {
    this.loopShow();
  }
  hideBubble() {
    this.cashBubbleNode.opacity = 0;
    this.goldBubbleNode.opacity = 0;
  }
  showBubble() {
    this.cashBubbleNode.opacity = 255;
    this.goldBubbleNode.opacity = 255;
  }
  loopGoldBubble() {}
  loopShow() {
    if (!gameData.isOpenDemo) {
      this.cashBubbleNode.active = true;
      this.goldBubbleNode.active = true;
      if (gameData.goldBubbleTip && -1 != gameData.goldBubbleTip.indexOf("|")) {
        this._goldBubbleTipFlag = !this._goldBubbleTipFlag;
        if (this._goldBubbleTipFlag) {
          this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.goldBubbleTip.split("|")[0];
        } else {
          this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.goldBubbleTip.split("|")[1];
        }
      } else gameData.goldBubbleTip && (this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.goldBubbleTip);
      gameData.cashBubbleTip && (this.cashBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.cashBubbleTip);
      "" == gameData.goldBubbleTip && (this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = "");
    }
  }
}