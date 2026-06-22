import { CardSkinType } from '../framework/enum/AllEnum';
import { Res } from '../common/ResourcesManager';
import GlobalApp from '../common/GlobalApp';
import { Constants } from '../common/Constants';
import { gameData } from '../data/GameData';
import AudioManager from '../framework/controller/AudioManager';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
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
export default class card extends cc.Component {
  @property(cc.SpriteFrame)
  cardBgSpList: cc.SpriteFrame = [];
  @property(cc.Sprite)
  cardBgSp: cc.Sprite = null;
  @property(cc.Sprite)
  cardSp: cc.Sprite = null;
  @property(cc.Node)
  content: cc.Node = null;
  @property(cc.Node)
  blueSelect: cc.Node = null;
  @property(cc.Node)
  yellowSelect: cc.Node = null;
  @property(cc.Node)
  huaBgNode: cc.Node = null;
  @property(cc.Prefab)
  clearEffect: cc.Prefab = null;
  @property(cc.Prefab)
  specialClearEffect: cc.Prefab = null;
  row = 0;
  col = 0;
  _selected = false;
  _cardData = null;
  get selected() {
    return this._selected;
  }
  set selected(e) {
    this._selected = e;
    this.yellowSelect.active = false;
    this.blueSelect && (this.blueSelect.active = e);
  }
  get cardData() {
    return this._cardData;
  }
  set cardData(e) {
    this._cardData = e;
    this.setZIndex();
  }
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    EventMgr.ignore(GameEventType.UPDATE_GAME_SKIN_DATA, this.updateGameSkinData, this);
  }
  init(e) {
    this.cardData = e;
    this.initEvent();
    this.initUI();
    this.setZIndex();
  }
  initEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    EventMgr.listen(GameEventType.UPDATE_GAME_SKIN_DATA, this.updateGameSkinData, this);
  }
  setZIndex() {
    this.node.zIndex = 100 * this.cardData.y + this.cardData.x;
  }
  onTouchStart(e) {
    if (gameData.globalCanClick && (-1 != GlobalApp.GameMain.teachingStepCardList.indexOf(this.cardData.id) || 1 != gameData.gameLevel)) {
      var t = GlobalApp.TouchCtrl;
      if (t && "function" == typeof t.onCardTouchStart) {
        var o = e.getLocation();
        t.onCardTouchStart(this, cc.v2(o.x, o.y));
      }
    }
  }
  onTouchMove(e) {
    if (gameData.globalCanClick && (-1 != GlobalApp.GameMain.teachingStepCardList.indexOf(this.cardData.id) || 1 != gameData.gameLevel)) {
      var t = GlobalApp.TouchCtrl;
      if (t && "function" == typeof t.onCardTouchMove) {
        var o = e.getLocation();
        t.onCardTouchMove(this, cc.v2(o.x, o.y));
      }
    }
  }
  onTouchCancel(e) {
    if (gameData.globalCanClick && (-1 != GlobalApp.GameMain.teachingStepCardList.indexOf(this.cardData.id) || 1 != gameData.gameLevel)) {
      var t = GlobalApp.TouchCtrl;
      if (t && "function" == typeof t.onCardTouchEnd) {
        var o = e.getLocation();
        t.onCardTouchEnd(this, cc.v2(o.x, o.y));
      }
    }
  }
  onTouchEnd(e) {
    if (gameData.globalCanClick && (-1 != GlobalApp.GameMain.teachingStepCardList.indexOf(this.cardData.id) || 1 != gameData.gameLevel)) {
      var t = GlobalApp.TouchCtrl;
      if (t && "function" == typeof t.onCardTouchEnd) {
        var o = e.getLocation();
        t.onCardTouchEnd(this, cc.v2(o.x, o.y));
      }
    }
  }
  updateGameSkinData() {
    this.cardBgSp.spriteFrame = this.cardBgSpList[gameData.gameSkinData.cardSkin - 1];
    this.cardSp.spriteFrame = Res.getMahjongSpriteFrame(this.getCardUrl());
  }
  initUI() {
    console.log("initUI.............", this.cardData);
    if (this.cardSp && this.cardData) {
      if (Constants.isSpecialCard(this.cardData.type)) {
        this.huaBgNode.active = true;
      } else {
        this.huaBgNode.active = false;
      }
      this.cardBgSp.spriteFrame = this.cardBgSpList[gameData.gameSkinData.cardSkin - 1];
      this.cardSp.spriteFrame = Res.getMahjongSpriteFrame(this.getCardUrl());
    }
    this.playEnterAnim();
  }
  showChooseIcon() {
    this.yellowSelect.active = true;
  }
  hideChooseIcon() {
    this.yellowSelect.active = false;
  }
  getCardUrl() {
    return Constants.isSpecialCard(this.cardData.type) ? "hua_" + gameData.gameSkinData.specialCardSkin + "_" + this.cardData.type : "mj_" + gameData.gameSkinData.cardSkin + "_" + this.cardData.type;
  }
  playEnterAnim() {
    if (this.content && this.content.isValid) {
      var e = this.content;
      cc.Tween.stopAllByTarget(e);
      var t = e.parent;
      if (t) {
        var o = e.parent.convertToWorldSpaceAR(e.position);
        e.anchorX = 1;
        e.anchorY = 1;
        var n = t.convertToNodeSpaceAR(o);
        n.x += e.width / 2;
        n.y += e.height / 2;
        e.setPosition(n);
        e.children.forEach(function (t) {
          if (t && t.isValid) {
            var o = t.parent;
            if (o) {
              var n = o.convertToWorldSpaceAR(t.position);
              t.anchorX = 1;
              t.anchorY = 1;
              var a = o.convertToNodeSpaceAR(n);
              if ("cardSp" == t.name) {
                a.x -= (e.width - t.width) / 2;
                a.y -= (e.height - t.height) / 2;
              }
              t.setPosition(a);
            }
          }
        });
        e.setScale(1.2);
        e.opacity = 0;
        e.angle = -30;
        var a = 0.2 + 0.1 * this.cardData.y;
        cc.tween(e).delay(a).to(0.4, {
          scale: 1,
          opacity: 255,
          angle: 0
        }).call(function () {
          var o = e.parent.convertToWorldSpaceAR(e.position);
          e.anchorX = 0.5;
          e.anchorY = 0.5;
          var n = t.convertToNodeSpaceAR(o);
          n.x -= e.width / 2;
          n.y -= e.height / 2;
          e.setPosition(n);
          e.children.forEach(function (t) {
            if (t && t.isValid) {
              var o = t.parent;
              if (o) {
                var n = o.convertToWorldSpaceAR(t.position);
                t.anchorX = 0.5;
                t.anchorY = 0.5;
                var a = o.convertToNodeSpaceAR(n);
                if ("cardSp" == t.name) {
                  a.x += (e.width - t.width) / 2;
                  a.y += (e.height - t.height) / 2;
                }
                t.setPosition(a);
              }
            }
          });
        }).start();
      }
    }
  }
  shakeAnim(e = 10) {
    var t = this;
    if (this.content && this.content.isValid) {
      cc.Tween.stopAllByTarget(this.content);
      this.content.angle = 0;
      cc.tween(this.content).to(0.1, {
        angle: e
      }).to(0.1, {
        angle: -e
      }).to(0.1, {
        angle: e / 2
      }).to(0.1, {
        angle: -e / 2
      }).call(function () {
        t.content.angle = 0;
      }).start();
    }
  }
  playEliminateScaleFade(e = ClearAnimType.Normal) {
    if (this.node && this.node.isValid) {
      this.selected = false;
      this.node.pauseSystemEvents(true);
      this.playSingleEliminateTween(void 0, e);
    }
  }
  playEliminateMoveToThenScaleFade(e, t = ClearAnimType.Normal) {
    if (e && this.node && this.node.isValid) {
      this.selected = false;
      this.node.pauseSystemEvents(true);
      this.playSingleEliminateTween(e, t);
    }
  }
  playSingleEliminateTween(e, t = ClearAnimType.Normal) {
    var o = this;
    if (this.node && this.node.isValid) {
      cc.Tween.stopAllByTarget(this.node);
      var n = e ? 0.15 : 0,
        a = cc.tween(this.node),
        i = new cc.Vec3(1.2, 1.2, 1),
        c = new cc.Vec3(1, 1, 1);
      if (e) {
        if (t === ClearAnimType.Vertical) {
          c.y = 0.5;
          i = new cc.Vec3(1, 1, 1);
        } else if (t === ClearAnimType.Horizontal) {
          c.x = 0.8;
          i = new cc.Vec3(1.2, 1, 1);
        }
        if (t !== ClearAnimType.Normal) {
          a = a.to(n, {
            position: e
          }, {
            easing: "backIn"
          });
          cc.tween(this.content).to(0.9 * n, {
            scaleX: c.x,
            scaleY: c.y
          }).to(0.1 * n, {
            scaleX: i.x,
            scaleY: i.y
          }).start();
        }
      }
      a.call(function () {
        o.playClearEffect();
        cc.tween(o.content).to(0.08, {
          scaleX: i.x,
          scaleY: i.y
        }).call(function () {
          o.node && o.node.isValid && o.node.destroy();
        }).start();
      });
      a.start();
    }
  }
  playClearAudio() {
    // if (Constants.isSpecialCard(this.cardData.type)) {
    //   AudioManager.getInstance().playMusic("card/huaCard");
    // } else {
    //   AudioManager.getInstance().playMusic("card/" + this.cardData.type);
    // }
  }
  playClearEffect() {
    if (this.clearEffect) {
      if (Constants.isSpecialCard(this.cardData.type)) {
        var e = cc.instantiate(this.specialClearEffect);
        e.parent = GlobalApp.GameMain.node;
        var t = this.content.parent.convertToWorldSpaceAR(this.content.position),
          o = GlobalApp.GameMain.node.convertToNodeSpaceAR(t);
        e.position = o;
        e.getComponent(sp.Skeleton).setAnimation(0, "cycle", false);
        e.getComponent(sp.Skeleton).setCompleteListener(function () {
          e.destroy();
        });
      }
      var n = cc.instantiate(this.clearEffect);
      n.parent = GlobalApp.GameMain.node.getChildByName("effectNode") || GlobalApp.GameMain.node;
      var a = this.content.parent.convertToWorldSpaceAR(this.content.position),
        i = GlobalApp.GameMain.node.convertToNodeSpaceAR(a);
      n.position = i;
      // var r = "";
      // if (Constants.isSpecialCard(this.cardData.type)) r = "0";else {
      //   r = gameData.gameSkinData.cardSkin.toString();
      //   gameData.gameSkinData.cardSkin == CardSkinType.CardSkin4 && (r = "3");
      // }
      // n.getComponent(sp.Skeleton).setSkin(r);
      // n.getComponent(sp.Skeleton).setAnimation(0, "start1", false);
      // n.getComponent(sp.Skeleton).setCompleteListener(function () {
      //   n.destroy();
      // });
      const pss = n.getComponentInChildren(cc.ParticleSystem);
      if (pss) {
        pss.resetSystem();
        this._scheduleDestroyParticleRoot(n);
      }
    }
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