import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData } from './data/GameData';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class freePropPage extends BasePage {
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.SCALE,
      blackTime: 0.2,
      pageTime: 0.2
    });
  }
  _init() {}
  close() {
    PlayerDataSys.tipCardCount += gameData.free_prop.count;
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "rewardToastPage",
      data: {
        cash: 0,
        red: 0,
        propInfo: {
          type: gameData.free_prop.prop_id,
          num: gameData.free_prop.count
        }
      }
    });
    gameData.free_prop = {};
    this._hide();
  }
}