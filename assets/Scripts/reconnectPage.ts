import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class reconnectPage extends BasePage {
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
    var t = e.err;
    console.log("reconnectPage err", JSON.stringify(t));
    this.descLabel.string = "网络连接不稳定,请检查网络后重试";
    -777 == t.code && (this.descLabel.string = "用户异常，禁止登录");
    var o = e.callback;
    this.reconnectFun = o;
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