import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import PlayerDataSys from './framework/controller/PlayerDataSys';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class taskItem extends cc.Component {
  @property(cc.Node)
  btns: cc.Node = [];
  @property(cc.Label)
  condition_desc: cc.Label = null;
  @property(cc.Label)
  reward_count: cc.Label = null;
  @property(cc.Node)
  reviewNodes: cc.Node = [];
  @property(cc.Node)
  reviewShowNodes: cc.Node = [];
  @property(cc.Label)
  reviewReward: cc.Label = null;
  task_id = "";
  reward_cash = 0;
  onLoad() {}
  start() {}
  setData(e) {
    var t = e.need_amount,
      o = e.reward_cash,
      n = e.status,
      a = e.task_id;
    this.task_id = a;
    this.reward_cash = o;
    this.condition_desc.string = `{"gkey_530":{"v1":"${t}"}}`;
    this.reward_count.string = "" + PlayerDataSys.getCashBalance(o);
    for (var i = 0; i < this.btns.length; i++) this.btns[i].active = i == n;
    if (PlayerDataSys.is_reviewer) {
      this.reviewReward.string = "x" + PlayerDataSys.getCashBalance(o);
      this.reviewShowNodes.forEach(function (e) {
        return e.active = true;
      });
      this.reviewNodes.forEach(function (e) {
        return e.active = false;
      });
    } else {
      this.reviewShowNodes.forEach(function (e) {
        return e.active = false;
      });
      this.reviewNodes.forEach(function (e) {
        return e.active = true;
      });
    }
  }
  clickGetBtn() {
    AudioManager.getInstance().playMusic("btntouch");
    SdkHelper.reportData("task_reward_click");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "taskRewardPage",
      data: {
        task_id: this.task_id,
        cash: this.reward_cash
      }
    });
  }
  clickCloseBtn() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.CLOSE_TASKLIST);
  }
}