import PlayerDataSys from '../framework/controller/PlayerDataSys';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import SdkHelper from '../framework/SdkHelper';
import EngineUtil from '../framework/EngineUtil';
import { gameData } from '../data/GameData';
import GameSystem from '../system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
var _ = cc.color().fromHEX("#FFE1B2");
@ccclass
export default class signItem extends cc.Component {
  @property(cc.Node)
  can_get: cc.Node = null;
  @property(cc.Node)
  lock: cc.Node = null;
  @property(cc.Label)
  day: cc.Label = null;
  @property(cc.Label)
  showCash: cc.Label = null;
  @property(cc.Node)
  zg: cc.Node = null;
  @property(cc.Label)
  titleArr: cc.Label = [];
  signPage = null;
  id = "";
  condtion = "";
  canTouch = false;
  _inOperation = false;
  init(e, t) {
    var o = e._is_top,
      n = e.id,
      a = e.login_days,
      i = e.show_money,
      r = e.sign_up_day_limit,
      c = e.status,
      s = e.user_level,
      l = e.user_level_limit;
    this.signPage = t;
    this._inOperation = false;
    this.zg.active = !!o && a == r;
    this.id = n;
    this.showCash.string = "" + i;
    this.day.string = n;
    this.condtion = "";
    this.can_get.active = false;
    this.canTouch = false;
    if ("1" == this.id) {
      var u = this.node.getChildByName("first");
      u && (u.active = true);
      this.titleArr.forEach(function (e) {
        e.node.color = _;
      });
      this.showCash.fontSize = 48;
    }
    if (1 === c) {
      this.lock.active = true;
      this.condtion = "奖励已领取";
    } else {
      this.lock.active = false;
      if (a >= r) {
        if (l > s) this.condtion = "用户等级" + l + "级可领取，继续闯关吧！";else {
          this.can_get.active = true;
          this.canTouch = true;
        }
      } else this.condtion = "时间还没到哦～继续加油！";
    }
  }
  setGet() {
    this.can_get.active = false;
    this.lock.active = true;
    this.condtion = "奖励已领取";
  }
  click() {
    var e = this;
    if (this.condtion) EngineUtil.showCocosToast3(this.condtion);else {
      this.signPage.handNode.active = false;
      if (!this._inOperation) {
        SdkHelper.reportData("xc_reward_only", {
          game_level: gameData.gameLevel,
          lun_level: gameData.lun_level,
          turn_id: gameData.turnId,
          round_id: gameData.roundId,
          set_id: gameData.setId
        });
        this._inOperation = true;
        this.scheduleOnce(function () {
          e._inOperation = false;
        }, 0.5);
        GameSystem.sign({
          sign_id: this.id
        }).then(function (t) {
          if (t && 1 == t.code) {
            SdkHelper.reportData("sign_get_succ", {
              level: gameData.gameLevel,
              lun_level: gameData.lun_level,
              id: e.id
            });
            PlayerDataSys.setUserGoldBalance(t.data.gold_balance, false);
            var o = t.data.reward;
            PlayerDataSys.sign_in_info = t.data.info;
            o > 0 && EventMgr.trigger(GameEventType.PAGE_SHOW, {
              name: "rewardToastPage",
              data: {
                red: o,
                des: "恭喜获得"
              }
            });
            o > 0 && EventMgr.trigger(GameEventType.SHOWEFFECT, {
              num: 6,
              type: 1,
              cb: function () {
                EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE, {
                  start: PlayerDataSys.goldBalance - o,
                  end: PlayerDataSys.goldBalance
                });
                EventMgr.trigger(GameEventType.SHOWBALANCEEFFECT, {
                  type: 1,
                  num: o
                });
              }
            });
            e.setGet();
          }
        });
      }
    }
  }
  clickLock() {
    EngineUtil.showCocosToast3("奖励已领取，后边还有更多大奖！");
  }
}