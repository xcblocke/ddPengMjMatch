import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class networkFailedPage extends BasePage {
  reconnectFun = null;
  @property(cc.Label)
  descLabel: cc.Label = null;
  onLoad() {
    super.onLoad.call(this);
    EventMgr.listen(GameEventType.CLOSE_RECONNECT, this._hide, this);
    this._animInit({
      animType: AnimType.NONE
    });
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.CLOSE_RECONNECT, this._hide, this);
  }
  _init(e) {
    e.err;
    var t = e.callback;
    this.reconnectFun = t;
  }
  reconnect() {
    var e = this;
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "loadingPage",
      data: {
        callback: function () {
          e.reconnectFun(true);
        }
      }
    });
  }
}