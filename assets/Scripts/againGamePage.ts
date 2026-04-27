import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class againGamePage extends BasePage {
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
    super._hide.call(this);
  }
  continueGame() {
    this.close();
  }
  againGame() {
    EventMgr.trigger(GameEventType.START_GAME, true);
    this.close();
  }
}