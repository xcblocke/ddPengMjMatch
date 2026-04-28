import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import signItem from './prefab/signItem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
var g = [1, 7, 14, 15];
@ccclass
export default class signPage extends BasePage {
  @property(cc.Node)
  content: cc.Node = null;
  @property(cc.Node)
  handNode: cc.Node = null;
  @property(cc.RichText)
  title: cc.RichText = null;
  @property(cc.Node)
  item: cc.Node = null;
  @property(cc.Node)
  bigItem: cc.Node = null;
  items = [];
  cb = null;
  gameSucc = false;
  is_guide = false;
  _init(e) {
    this.handNode.active = false;
    PlayerDataSys.sign_in_info = [];
    AudioManager.getInstance().playMusic("Praise");
    this.is_guide = null == e ? void 0 : e.is_guide;
    this.cb = (null == e ? void 0 : e.cb) || null;
    this.gameSucc = this.gameSucc || (null == e ? void 0 : e.gameSucc) || false;
    e = (null == e ? void 0 : e.info) || PlayerDataSys.sign_in_info || null;
    this.title.string = `{"gkey_524":{"v1":"${e[0].login_days}"}}`;
    for (var t = 0; t < e.length; t++) {
      var o = e[t],
        n = this.items[t];
      if (!n) {
        (n = g.includes(t) ? cc.instantiate(this.bigItem) : cc.instantiate(this.item)).parent = this.content;
        n.active = true;
        this.items.push(n);
      }
      n.getComponent(signItem).init(o, this);
    }
  }
  _onShow() {
    super._onShow.call(this);
    for (var t = 0; t < this.items.length; t++) {
      var o = this.items[t].getComponent(signItem);
      if (o.canTouch) {
        var n = o.node.parent.convertToWorldSpaceAR(o.node.position);
        this.showHand(n);
        break;
      }
    }
  }
  showHand(e) {
    this.handNode.active = true;
    this.handNode.position = this.handNode.parent.convertToNodeSpaceAR(e);
  }
  _onHide() {
    super._onHide.call(this);
    this.is_guide && EventMgr.trigger(GameEventType.MAINBTNGUIDE, {
      index: 3
    });
    this.is_guide = false;
  }
  close() {
    EventMgr.trigger(GameEventType.SIGN_POP);
    this.gameSucc = false;
    AudioManager.getInstance().playMusic("btntouch");
    this.cb && this.cb();
    this._hide();
  }
}