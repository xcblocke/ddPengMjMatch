import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
enum r {
  Coin = 0,
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
  coinBubbleNode: cc.Node = null;

  @property(cc.Node)
  goldBubbleNode: cc.Node = null;
  _coinBubbleTip = "";
  _goldBubbleTip = "";
  _curShowBubbleType = r.Coin;
  _goldBubbleTipFlag = false;
  onLoad() {
    EventMgr.listen(GameEventType.FRESH_RED_BUBBLE, this.freshBubble, this);
    EventMgr.listen(GameEventType.UPDATE_BALANCE, this.freshCoinBubble, this);
    EventMgr.listen(GameEventType.HIDE_BUBBLE, this.hideBubble, this);
    EventMgr.listen(GameEventType.SHOW_BUBBLE, this.showBubble, this);
  }
  onDestroy() {
    EventMgr.ignoreAllByCaller(this);
  }
  start() {
    let coinNode = this.node.getChildByName("coinNode")
    if (coinNode) {
      coinNode.active = false;
    }
    let level_info = this.node.getChildByName("level_info")
    if (level_info) {
      level_info.active = false;
    }

    this.label0.string = PlayerDataSys.getCoinBalance();
    this.label1.string = PlayerDataSys.getGoldBalance();
    this.coinBubbleNode.active = false;
    this.goldBubbleNode.active = false;
    if (gameData.isOpenDemo) this.goldNode.x = -173.033;else {
      this.goldNode.x = 173.033;
      this.loopShow();
    }
  }
  freshBubble() {
    if (gameData.canCoinExtract) {
      this.hideBubble();
    } else {
      this.showBubble();
    }
    this.loopShow();
  }
  freshCoinBubble() {
    this.loopShow();
  }
  hideBubble() {
    this.coinBubbleNode.opacity = 0;
    this.goldBubbleNode.opacity = 0;
  }
  showBubble() {
    this.coinBubbleNode.opacity = 255;
    this.goldBubbleNode.opacity = 255;
  }
  loopGoldBubble() {}
  loopShow() {
    if (!gameData.isOpenDemo) {
      this.coinBubbleNode.active = true;
      this.goldBubbleNode.active = true;
      if (gameData.goldBubbleTip && -1 != gameData.goldBubbleTip.indexOf("|")) {
        this._goldBubbleTipFlag = !this._goldBubbleTipFlag;
        if (this._goldBubbleTipFlag) {
          this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.goldBubbleTip.split("|")[0];
        } else {
          this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.goldBubbleTip.split("|")[1];
        }
      } else gameData.goldBubbleTip && (this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.goldBubbleTip);
      gameData.coinBubbleTip && (this.coinBubbleNode.getChildByName("label").getComponent(cc.RichText).string = gameData.coinBubbleTip);
      "" == gameData.goldBubbleTip && (this.goldBubbleNode.getChildByName("label").getComponent(cc.RichText).string = "");
    }
  }
}