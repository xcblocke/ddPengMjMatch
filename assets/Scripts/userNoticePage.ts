import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class userNoticePage extends BasePage {
  @property(cc.Toggle)
  Toggle: cc.Toggle = null;
  onLoad() {
    super.onLoad.call(this);
  }
  _init() {}
  toggleClick() {}
  close() {
    this._hide();
  }
}