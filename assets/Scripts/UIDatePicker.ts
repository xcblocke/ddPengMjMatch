import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import UIItemDay from './UIItemDay';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class UIDatePicker extends cc.Component {
  @property(cc.Label)
  lbYearMonth: cc.Label = null;
  @property(cc.Prefab)
  pfbDay: cc.Prefab = null;
  @property(cc.Node)
  ndDays: cc.Node = null;
  date = null;
  year = 0;
  month = 0;
  day = 0;
  cb = null;
  pfgListDay = [];
  start() {}
  onLoad() {
    this.initData();
    this.updateDate();
  }
  initData() {
    this.date = this.date ? this.date : new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.day = this.date.getDate();
    var e = 30;
    this.pfgListDay = [];
    var t = [1, 3, 5, 7, 8, 10, 12];
    console.log("this.month", t.includes(this.month + 1));
    t.includes(this.month + 1) && (e = 31);
    for (var o = 0; o < e; ++o) {
      var n = cc.instantiate(this.pfbDay);
      n.parent = this.ndDays;
      this.pfgListDay.push(n);
    }
  }
  setDate(e, t, o) {
    this.date = new Date(e, t, o);
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.day = this.date.getDate();
    this.updateDate();
  }
  updateDate() {
    var e = this;
    this.lbYearMonth.string = cc.js.formatStr("%s年%s月", this.year, this.month + 1);
    for (var t = new Date(this.year, this.month + 1, 0).getDate(), o = new Date(this.year, this.month, 1).getDay(), n = 0; n < this.pfgListDay.length; ++n) {
      var a = this.pfgListDay[n];
      if (n < t) {
        a.active = true;
        var i = o + n,
          l = Math.floor(i / 7),
          u = i % 7,
          p = 0.5 * -(this.ndDays.width - a.width) + u * a.width,
          d = 0.5 * (this.ndDays.height - a.height) - l * a.height;
        a.setPosition(p, d);
        a.getComponent(UIItemDay).setDay(n, n + 1, this.day === n + 1, function (t, o) {
          e.day = o;
          e.updateDate();
          var n = new Date(e.year, e.month, e.day);
          EventMgr.trigger(GameEventType.UPDATE_DATE_DATA, n);
        });
      } else a.active = false;
    }
  }
  onClickLeft() {
    if (this.month > 0) this.month -= 1;else {
      this.month = 11;
      this.year -= 1;
    }
    this.date.setFullYear(this.year);
    this.date.setMonth(this.month);
    this.updateDate();
  }
  onClickRight() {
    if (this.month < 11) this.month += 1;else {
      this.month = 0;
      this.year += 1;
    }
    this.date.setFullYear(this.year);
    this.date.setMonth(this.month);
    this.updateDate();
  }
  setPickDateCallback(e) {
    this.cb = e;
  }
  onClickClose() {
    this.cb && this.cb(this.year, this.month, this.day);
    this.node.parent = null;
  }
}