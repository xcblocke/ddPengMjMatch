import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdTipPage extends BasePage {
  @property(cc.RichText)
  desc_text: cc.RichText = null;
  _init(e) {
    var t = e.need_cash_balance;
    this.desc_text.string = "<color=#454F50>限于平台大额收付款需二次确认,为了给玩家提供更加便利的提现服务,我们经与平台协商后,为余额达到<color=#FF0000>" + t + "元</c>的玩家申请了免审核并即时到账的权益,故限制起提金额为<color=#FF0000>" + t + "元</c>,每位玩家限提<color=#FF0000>3</c>次。</c>";
  }
  clickClose() {
    EventMgr.trigger(GameEventType.UPATE_WITHDRAWPAGE);
    this._hide();
  }
}