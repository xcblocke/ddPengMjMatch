import AudioManager from './framework/controller/AudioManager';
import { CardSkinType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { Res } from './common/ResourcesManager';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
enum r {
  Card = 1,
  GameBg = 2,
  HuaCard = 3,
}
@ccclass
export default class unlockHuaCardPage extends BasePage {
  @property(cc.SpriteFrame)
  titleSpriteFrameList: cc.SpriteFrame = [];
  @property(cc.Label)
  tipsLb: cc.Label = null;
  @property(cc.Sprite)
  titleSp: cc.Sprite = null;
  @property(cc.Node)
  btnNode: cc.Node = null;
  @property(cc.Node)
  cardNode: cc.Node = null;
  @property(cc.Sprite)
  cardIcon: cc.Sprite = null;
  @property(cc.Node)
  gameBgNode: cc.Node = null;
  @property(cc.Sprite)
  gameBgIcon: cc.Sprite = null;
  @property(cc.Node)
  huaCardNode: cc.Node = null;
  @property(cc.Node)
  huaCardLy: cc.Node = null;
  type = r.Card;
  id = 0;
  name = "";
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init(e) {
    this.btnNode.opacity = 0;
    AudioManager.instance.playMusic("get");
    this.type = e.type;
    this.id = e.id;
    this.name = e.name;
    this.initUI();
    cc.tween(this.btnNode).delay(0.5).to(1, {
      opacity: 255
    }).start();
    this.titleSp.spriteFrame = this.titleSpriteFrameList[this.type - 1];
    var t = JSON.parse(cc.sys.localStorage.getItem("unLockHuaCardGuide")) || [];
    t.push(gameData.lun_level.toString());
    cc.sys.localStorage.setItem("unLockHuaCardGuide", JSON.stringify(t));
  }
  initUI() {
    this.cardNode.active = false;
    this.gameBgNode.active = false;
    this.huaCardNode.active = false;
    this.tipsLb.string = this.name;
    if (this.type == r.Card) {
      gameData.gameSkinData.cardSkin = this.id;
      28 == this.id && (gameData.gameSkinData.cardSkin = CardSkinType.CardSkin4);
      this.cardNode.active = true;
      this.cardIcon.spriteFrame = Res.getBgSpriteFrame("cardskin_" + gameData.gameSkinData.cardSkin);
    } else if (this.type == r.GameBg) {
      gameData.gameSkinData.bgSkin = this.id - 3;
      this.gameBgNode.active = true;
      this.gameBgIcon.spriteFrame = Res.getBgSpriteFrame("smallBg" + gameData.gameSkinData.bgSkin);
    } else if (this.type == r.HuaCard) {
      gameData.gameSkinData.specialCardSkin = this.id - 7;
      this.huaCardNode.active = true;
      this.huaCardLy.children.forEach(function (e, t) {
        e.getChildByPath("icon").getComponent(cc.Sprite).spriteFrame = Res.getMahjongSpriteFrame("hua_" + gameData.gameSkinData.specialCardSkin + "_" + (101 + t));
      });
    }
  }
  close() {
    GameSystem.syncTujianData({
      select_data: {
        1: "" + (gameData.gameSkinData.cardSkin == CardSkinType.CardSkin4 ? 28 : gameData.gameSkinData.cardSkin),
        2: "" + (gameData.gameSkinData.bgSkin + 3),
        3: "" + (gameData.gameSkinData.specialCardSkin + 7)
      }
    });
    EventMgr.trigger(GameEventType.UPDATE_GAME_SKIN_DATA);
    this._hide();
  }
}