import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { Res } from './common/ResourcesManager';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class debugLayer extends cc.Component {
  @property(cc.EditBox)
  cardEditBox: cc.EditBox = null;
  @property(cc.EditBox)
  timeEditBox: cc.EditBox = null;
  @property(cc.Node)
  cardContainer: cc.Node = null;
  @property(cc.Node)
  cardItem: cc.Node = null;
  onLoad() {
    this.initCard();
  }
  initCard() {
    for (var e = 0; e < 34; e++) {
      var t = cc.instantiate(this.cardItem),
        o = t.getComponent(cc.Sprite);
      t.getComponentInChildren(cc.Label).string = "" + (e + 1);
      o.spriteFrame = Res.getIconSpriteFrame("s" + (e + 1));
      t.parent = this.cardContainer;
    }
  }
  saveBtnClick() {
    var e,
      t = [];
    this.cardEditBox.string.split(",").forEach(function (e) {
      t.push(Number(e));
    });
    e = Number(this.timeEditBox.string);
    EventMgr.trigger(GameEventType.DEBUGLAYER_DATA, {
      card: t,
      delaytime: e
    });
    this.close();
  }
  close() {
    this.node.active = false;
  }
}