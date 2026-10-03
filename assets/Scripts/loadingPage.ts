import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class loadingPage extends BasePage {
  @property(cc.Label)
  label: cc.Label = null;
  _init(e) {
    this.label.string = `gkey_332`;
    e && e.callback && e.callback();
  }
}