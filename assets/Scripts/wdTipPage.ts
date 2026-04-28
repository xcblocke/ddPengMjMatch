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
    this.desc_text.string = `{"gkey_576":{"v1":"${t}","v2":"${t}"}}`;
  }
  clickClose() {
    EventMgr.trigger(GameEventType.UPATE_WITHDRAWPAGE);
    this._hide();
  }
}