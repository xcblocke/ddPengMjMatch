import { gameData } from './data/GameData';
import BasePage, { AnimType } from './view/BasePage';
import LocalData from './cyll/LocalData';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class debugPage extends BasePage {
  @property(cc.EditBox)
  goldLowLimit: cc.EditBox = null;
  @property(cc.EditBox)
  goldHighLimit: cc.EditBox = null;
  @property(cc.EditBox)
  nextMustMoney: cc.EditBox = null;
  @property(cc.EditBox)
  passLevelReward: cc.EditBox = null;
  @property(cc.Toggle)
  isOpenMingma: cc.Toggle = null;
  @property(cc.EditBox)
  mingmaMoney: cc.EditBox = null;
  @property(cc.Toggle)
  isOpenAutoGet: cc.Toggle = null;
  onLoad() {
    this._animInit({
      animType: AnimType.NONE
    });
  }
  _init() {
    var e = LocalData.getInstance().getDebugData();
    e && (gameData.debugData = e);
    this.goldLowLimit.string = gameData.debugData.goldLowLimit.toString();
    this.goldHighLimit.string = gameData.debugData.goldHighLimit.toString();
    this.nextMustMoney.string = gameData.debugData.nextMustMoney.toString();
    this.isOpenMingma.isChecked = gameData.debugData.isOpenMingma;
    this.mingmaMoney.string = gameData.debugData.mingmaMoney.toString();
    this.passLevelReward.string = gameData.debugData.passLevelReward.toString();
    this.isOpenAutoGet.isChecked = gameData.debugData.isOpenAutoGet;
  }
  migaMoneyCheckChange() {}
  openAutoGetCheckChange() {
    gameData.debugData.isOpenAutoGet = this.isOpenAutoGet.isChecked;
  }
  onDestroy() {}
  close() {
    this._hide();
  }
  save() {
    gameData.debugData.goldLowLimit = Number(this.goldLowLimit.string);
    gameData.debugData.goldHighLimit = Number(this.goldHighLimit.string);
    gameData.debugData.nextMustMoney = Number(this.nextMustMoney.string);
    gameData.debugData.isOpenMingma = this.isOpenMingma.isChecked;
    gameData.debugData.isOpenAutoGet = this.isOpenAutoGet.isChecked;
    gameData.debugData.mingmaMoney = Number(this.mingmaMoney.string);
    gameData.debugData.passLevelReward = Number(this.passLevelReward.string);
    if (Number(this.goldLowLimit.string) == Number(this.goldHighLimit.string)) {
      gameData.debugData.fixedMoney = Number(this.goldLowLimit.string);
    } else {
      gameData.debugData.fixedMoney = null;
    }
    LocalData.getInstance().setDebugData(JSON.stringify(gameData.debugData));
    EventMgr.trigger(GameEventType.MINGMABIAOJIA);
    this.close();
  }
  passLevel() {
    var e = this;
    GameSystem.submitGame({
      is_tg: 1,
      complete_flag: 1,
      skip: 1
    }).then(function () {
      EngineUtil.reconnectSuc();
      EventMgr.trigger(GameEventType.START_GAME);
      e._hide();
    }).catch(function () {
      EngineUtil.reconnectFai();
    });
  }
}