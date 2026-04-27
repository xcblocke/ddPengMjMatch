import { GAME_NAME } from '../framework/SystemConfig';
export default class PageBase extends cc.Component {
  curSelectIndex = "";
  onLoad() {
    this.initEvent();
    this.initData();
    this.initUI();
  }
  initEvent() {}
  onDestroy() {}
  initData() {}
  initUI() {}
  setTitle() {}
  setTip() {}
  collect(e) {
    var t = e.node.getComponent(cc.Toggle).isChecked,
      o = localStorage.getItem(GAME_NAME + "ids");
    o = o ? JSON.parse(o) : [];
    if (t) {
      o.push(this.curSelectIndex);
    } else {
      o.splice(o.indexOf(this.curSelectIndex), 1);
    }
    localStorage.setItem(GAME_NAME + "ids", JSON.stringify(o));
  }
  isCollected() {
    var e = localStorage.getItem(GAME_NAME + "ids");
    return (e = e ? JSON.parse(e) : []).includes(this.curSelectIndex);
  }
}