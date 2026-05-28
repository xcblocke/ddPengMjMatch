import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import GlobalApp from './common/GlobalApp';
import { gameData } from './data/GameData';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
var a;
(a = {})[PropType.tipCard] = `gkey_550`;
a[PropType.reshuffleCard] = `gkey_152`;
a[PropType.freezeCard] = `{"v1":"${30}"}`;
var m = a;
@ccclass
export default class unlockPropPage extends BasePage {
  @property(cc.Sprite)
  propSp: cc.Sprite = null;
  @property(cc.SpriteFrame)
  propSpList: cc.SpriteFrame[] = [];
  @property(cc.Label)
  tipsLb: cc.Label = null;
  @property(cc.Node)
  btnNode: cc.Node = null;

  @property(cc.Button)
  cliamBtn: cc.Button = null;

  @property(cc.Animation)
  lightAnim: cc.Animation = null;

  isFlying = false;

  type = PropType.tipCard;
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init(e) {
    AudioManager.instance.playMusic("get");
    this.btnNode.opacity = 0;
    this.playLightAnim();
    this.type = e.info.type;
    this.cliamBtn.interactable = true;
    this.isFlying = false;
    cc.tween(this.btnNode).delay(0.5).to(1, {
      opacity: 255
    }).start();
    var t = JSON.parse(cc.sys.localStorage.getItem("unLockPropGuide")) || [];
    t.push(gameData.gameLevel.toString());
    cc.sys.localStorage.setItem("unLockPropGuide", JSON.stringify(t));
    this.propSp.spriteFrame = this.propSpList[this.type - 1];
    this.tipsLb.string = m[this.type];
  }

  playLightAnim() {
    let animWrap = this.lightAnim.play("light");
    animWrap.wrapMode = cc.WrapMode.Loop;
  }

  playPropFlyAnim() {
    if(this.isFlying) return;
    this.isFlying = true;
    var e = this,
      t = cc.instantiate(this.propSp.node);
    t.parent = this.propSp.node.parent;
    this.cliamBtn.interactable = false;
    this.propSp.node.parent.convertToWorldSpaceAR(this.propSp.node.position);
    var o = null;
    if (this.type == PropType.tipCard) {
      o = GlobalApp.GameMain.propContainer.getChildByName("tipBtn");
    } else {
      if (this.type == PropType.reshuffleCard) {
        o = GlobalApp.GameMain.propContainer.getChildByName("reshuffleCard");
      } else {
        this.type == PropType.freezeCard && (o = GlobalApp.GameMain.propContainer.getChildByName("freeze"));
      }
    }
    var n = o.parent.convertToWorldSpaceAR(o.position),
      a = t.parent.convertToNodeSpaceAR(n);
    t.scale = 0.6;
    AudioManager.instance.playMusic("xiu");
    AudioManager.instance.playMusic("dztx");
    if (this.type == PropType.tipCard) {
      PlayerDataSys.tipCardCount = 3;
    } else {
      if (this.type == PropType.reshuffleCard) {
        PlayerDataSys.reshuffleCardCount = 1;
      } else {
        this.type == PropType.freezeCard && (PlayerDataSys.freezeCardCount = 1);
      }
    }
    cc.tween(t)
    .to(0.7, {position: a,scale: 0}, {easing: "backIn"})
    .call(function () {
     
        cc.tween(o)
        .to(0.1, { scale: 1.1})
        .to(0.1, {scale: 1})
        .to(0.1, {scale: 0.9})
        .to(0.1, {scale: 1})
        .start();
      EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
     
      t.destroy();
      e.close();
    }).start();
  }
  close() {
    this._hide();
  }
}