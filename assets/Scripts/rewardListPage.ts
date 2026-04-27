import BasePage from './view/BasePage';
import PlayerDataSys from './framework/controller/PlayerDataSys';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class rewardListPage extends BasePage {
  listV = null;
  _data = null;
  @property(cc.Node)
  view: cc.Node = null;
  @property(cc.ScrollView)
  list: cc.ScrollView = null;
  @property(cc.Node)
  item: cc.Node = null;
  _init() {
    var e = this;
    PlayerDataSys.rewardList.length > 2 && setTimeout(function () {
      e.list.scrollToBottom();
    }, 0);
    this.view.removeAllChildren();
    this.initList();
  }
  initList() {
    this._data = PlayerDataSys.rewardList;
    this.initListUI();
  }
  initListUI() {
    var e = this;
    this._data.forEach(function (t, o) {
      var n = cc.instantiate(e.item);
      n.x = 0;
      n.active = true;
      n.getChildByName("deletItem").name = "deletItem_" + o;
      n.parent = e.view;
      var a = n.children[0],
        i = PlayerDataSys.getCNGoldBalanceNum(t);
      if (i.indexOf(".") > 0) {
        a.getComponent(cc.Label).string = "￥" + i;
      } else {
        a.getComponent(cc.Label).string = "￥" + i + ".00";
      }
    });
  }
  onClose() {
    this._hide();
  }
  deleteAll() {
    PlayerDataSys.rewardList = [];
    this._init();
  }
  deleteItem(e) {
    console.log("e.target.name", e.target.name);
    var t = e.target,
      o = parseInt(t.name.split("_")[1]);
    PlayerDataSys.rewardList.splice(o, 1);
    this._init();
  }
}