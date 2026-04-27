import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class combineCashPage extends BasePage {
  @property(cc.Label)
  balanceLabel: cc.Label = null;
  @property(cc.Node)
  listNode: cc.Node = null;
  @property(cc.Node)
  singleNode: cc.Node = null;
  getCash() {}
  _onHide() {
    AudioManager.instance.stopMusic("yibingdakuan");
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }
  _init() {
    var e = this;
    AudioManager.instance.playMusic("yibingdakuan");
    var t = gameData.clearSubmitData.big_cash_verify_info.extract_list.reduce(function (e, t) {
      return {
        amount: e.amount + t.amount,
        id: "1"
      };
    });
    this.listNode.removeAllChildren();
    gameData.clearSubmitData.big_cash_verify_info.extract_list.forEach(function (t) {
      var o = cc.instantiate(e.singleNode);
      o.getChildByPath("layout/pt_mn").getComponent(cc.Label).string = PlayerDataSys.getCashBalanceWithUnit(t.amount, "");
      o.parent = e.listNode;
    });
    this.balanceLabel.string = PlayerDataSys.getCashBalanceWithUnit(t.amount, "元");
  }
  close() {
    this._hide();
  }
}