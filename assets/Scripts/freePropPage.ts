import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData } from './data/GameData';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;

/** Same outcome as closing freePropPage: grant props + toast, without opening the modal. */
export function applyFreePropRewardIfAny() {
  var fp = gameData.free_prop;
  if (!fp || "object" != typeof fp || 0 === Object.keys(fp).length) {
    return;
  }
  PlayerDataSys.tipCardCount += fp.count;
  EventMgr.trigger(GameEventType.PAGE_SHOW, {
    name: "rewardToastPage",
    data: {
      balance: 0,
      red: 0,
      propInfo: {
        type: fp.prop_id,
        num: fp.count
      }
    }
  });
  gameData.free_prop = {};
}

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
    applyFreePropRewardIfAny();
    this._hide();
  }
}