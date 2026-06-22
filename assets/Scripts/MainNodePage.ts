import { gameData } from './data/GameData';
import PageMgr from './view/PageMgr';
import BasePage, { AnimType } from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import GameEventType from './framework/Event/GameEventType';
import EventMgr from './framework/Event/EventMgr';
const {
  ccclass,
  property
} = cc._decorator;

@ccclass
export default class MainNodePage extends BasePage {

  @property(cc.Label)
  coinTextLabel: cc.Label = null;

  @property(cc.Label)
  levelTextLabel: cc.Label = null;

  @property(cc.Button)
  btnLevel: cc.Button = null;

  @property(cc.Button)
  tujianBtn: cc.Button = null;

  onLoad() {
    this._animInit({
      animType: AnimType.NONE
    });
    this._lockInit({
      hasBlack: false
    });
    super.onLoad();
  }

  _init() {
    this.initCoin();
  }

  initCoin() {
    if (this.coinTextLabel) {
      this.coinTextLabel.string = String(gameData.dollarBalance || 0);
    }
  }

  onClickLevelBtn() {
    AudioManager.getInstance().playMusic("click");
    this.node.destroy();
  }

  onClickSet() {
    AudioManager.getInstance().playMusic("click");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "SetUpPage"
    });
  }

  onClickTujian() {
    AudioManager.getInstance().playMusic("click");
    PageMgr.showPage({
      name: "TujianNodePage"
    });
  }
}