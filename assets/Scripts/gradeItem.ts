import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import SdkHelper from './framework/SdkHelper';
import PlayerDataSys from './framework/controller/PlayerDataSys';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class gradeItem extends cc.Component {
  @property(cc.Node)
  icon: cc.Node = null;
  @property(cc.Label)
  desc: cc.Label = null;
  @property(cc.Node)
  pro_node: cc.Node = null;
  @property(cc.Sprite)
  pro_spr: cc.Sprite = null;
  @property(cc.Label)
  pro_count: cc.Label = null;
  @property(cc.Label)
  count: cc.Label = null;
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Label)
  label_grade: cc.Label = null;
  @property(cc.Label)
  label_unlock: cc.Label = null;
  @property(cc.Node)
  btns: cc.Node = [];
  grade_id = 0;
  success_count = 0;
  _toast = "";
  _isMask = false;
  _isLast = false;
  onLoad() {}
  start() {}
  init(e, t, o, n) {
    this.success_count = t;
    this._isMask = o;
    this._isLast = n;
    this.setBtns(e);
    this.setPro(e);
    this.setView(e);
  }
  changeBg(e) {
    this.bg.active = e;
  }
  setBtns(e) {
    var t = e.status,
      o = e.level_num;
    this.btns.forEach(function (e) {
      e.active = false;
    });
    var n = this.success_count > o ? o : this.success_count;
    this.pro_count.string = this._isLast ? "" : n + "/" + o;
    this.pro_spr.fillRange = n / o;
    this.btns[Number(t)].active = true;
    this.desc.string = this._isLast ? `gkey_317` : `{"gkey_318":{"v1":"${o}"}}`;
    this._toast = this._isLast ? `gkey_317` : `{"gkey_319":{"v1":"${o}"}}`;
    if (this._isMask) {
      this.label_unlock.node.parent.active = true;
      this.label_unlock.string = `{"gkey_320":{"v1":"${e.pre_level}"}}`;
    } else this.label_unlock.node.parent.active = false;
    if (this._isLast) {
      this.btns[1].active = false;
      this.btns[0].active = true;
    }
  }
  setEnd() {
    this.btns.forEach(function (e) {
      e.active = false;
    });
    this.btns[2].active = true;
  }
  setPro(e) {
    e.level_num <= 0 && (this.pro_node.active = false);
  }
  setView(e) {
    var t = e.id,
      o = e.cash;
    this.grade_id = t;
    var n = PlayerDataSys.getCNCashNum(o);
    this.count.string = "" + n;
    var a = e.grade;
    a.length > 3 && (a = a.slice(0, 2) + "\n" + a.slice(2));
    this.label_grade.string = a;
  }
  clickGetReward() {
    SdkHelper.reportData("get_grade_reward");
    EventMgr.trigger(GameEventType.GET_LEVELREWARD, {
      id: this.grade_id
    });
  }
  clickUndid() {
    EngineUtil.showCocosToast3(this._toast);
  }
  clickHasGet() {
    EngineUtil.showCocosToast3(`gkey_321`);
  }
}