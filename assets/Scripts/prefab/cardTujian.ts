
import { Res } from '../common/ResourcesManager';
import GlobalApp from '../common/GlobalApp';
import { Constants } from '../common/Constants';
import { gameData } from '../data/GameData';

const {
  ccclass,
  property
} = cc._decorator;
export var ClearAnimType = {
  Normal: "normal",
  Horizontal: "horizontal",
  Vertical: "vertical"
};
@ccclass
export default class cardTujian extends cc.Component {
  
  // @property(cc.Sprite)
  // cardBgSp: cc.Sprite = null;
  @property(cc.Sprite)
  cardSp: cc.Sprite = null;
 
 
  _cardData = null;
  
  get cardData() {
    return this._cardData;
  }
  set cardData(e) {
    this._cardData = e;

  }
 
  
  init(e) {
    this.cardData = e;
    // this.initEvent();
    this.initUI();
    // this.setZIndex();
  }
 
  
 
  initUI() {
    // console.log("initUI.............", this.cardData);
    if (this.cardSp && this.cardData) {
      this.cardSp.spriteFrame = Res.getMahjongSpriteFrame(this.getCardUrl());
    }
    // this.playEnterAnim();
  }
  
  getCardUrl() {
    return Constants.isSpecialCard(this.cardData.type) ? "hua_" + gameData.gameSkinData.specialCardSkin + "_" + this.cardData.type : "mj_" + gameData.gameSkinData.cardSkin + "_" + this.cardData.type;
  }
 

  _scheduleDestroyParticleRoot(root: cc.Node) {
    let maxT = 0.15;
    const visit = (node: cc.Node) => {
      const p = node.getComponent(cc.ParticleSystem);
      if (p) {
        const t = (p.duration || 0) + (p.life || 0) + (p.lifeVar || 0);
        maxT = Math.max(maxT, t);
      }
      const ch = node.children;
      for (let i = 0; i < ch.length; i++) visit(ch[i]);
    };
    visit(root);
    const gm = GlobalApp.GameMain;
    if (gm && gm.node && gm.node.isValid) {
      gm.scheduleOnce(() => {
        if (root && root.isValid) root.destroy();
      }, maxT + 0.12);
    } else if (root && root.isValid) {
      root.runAction(cc.sequence(cc.delayTime(maxT + 0.12), cc.callFunc(() => root.destroy())));
    }
  }
}