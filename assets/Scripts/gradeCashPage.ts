import BasePage from './view/BasePage';
import { gameData } from './data/GameData';
import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class gradeCashPage extends BasePage {
  @property(cc.Label)
  oldRate: cc.Label = null;
  @property(cc.Node)
  oldNode: cc.Node = null;
  @property(cc.Node)
  newNode: cc.Node = null;
  @property(cc.Label)
  newRate: cc.Label = null;
  @property(cc.Label)
  racteLabel: cc.Label = null;
  @property(cc.Node)
  btnNode: cc.Node = null;
  @property(cc.Node)
  btnNode2: cc.Node = null;
  @property(cc.Node)
  midNode: cc.Node = null;
  _onHide() {
    super._onHide.call(this);
    this._cb && this._cb();
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init(e) {
    var t = this;
    this._cb = null == e ? void 0 : e.cb;
    this.oldNode.active = false;
    this.newNode.active = false;
    this.btnNode2.active = false;
    this.btnNode.active = false;
    this.midNode.active = false;
    this.scheduleOnce(function () {
      t.oldNode.active = true;
      t.scheduleOnce(function () {
        t.newNode.active = true;
      }, 0.5);
    }, 0.5);
    this.scheduleOnce(function () {
      t.midNode.active = true;
    }, 1.4);
    this.scheduleOnce(function () {
      t.btnNode.active = true;
      t.btnNode2.active = true;
    }, 2);
    this.oldRate.string = `{"gkey_315":{"v1":"${gameData.gradeDis.old_tx_ratio.replace(\"倍\", \"\")}"}}`;
    this.newRate.string = `{"gkey_315":{"v1":"${gameData.gradeDis.new_tx_ratio.replace(\"倍\", \"\")}"}}`;
    this.racteLabel.string = `{"gkey_316":{"v1":"${gameData.gradeDis.new_tx_ratio.replace(\"倍\", \"\")}"}}`;
    gameData.gradeDis = {};
    AudioManager.getInstance().playMusic("levelUp");
  }
  close() {
    this._hide();
  }
  gotoRed() {
    var e = this,
      t = this._cb;
    this._cb = null;
    EventMgr.trigger(GameEventType.CLOSE_GAME_TIPS);
    AudioManager.getInstance().playMusic("btntouch");
    GameSystem.getGoldExtractInfo().then(function (e) {
      EngineUtil.reconnectSuc();
      console.log("gold extract info-------", e);
      e && 1 == e.code && EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "redWdPage",
        data: Object.assign(Object.assign({}, e.data), {
          cb: t
        })
      });
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.gotoRed();
      });
    });
    this._hide();
  }
  openWd() {}
}