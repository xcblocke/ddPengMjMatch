import PlayerDataSys from '../framework/controller/PlayerDataSys';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import EngineUtil from '../framework/EngineUtil';
import GameSystem from '../system/GameSystem';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class redWdItem extends cc.Component {
  @property(cc.Sprite)
  itemBg: cc.Sprite = null;
  @property(cc.SpriteFrame)
  icon: cc.SpriteFrame = [];
  @property(cc.Label)
  title_lab: cc.Label = null;
  @property(cc.Label)
  amountText: cc.Label = null;
  @property(cc.Node)
  cantBtn: cc.Node = null;
  @property(cc.Node)
  is_now: cc.Node = null;
  @property(cc.Node)
  is_cond: cc.Node = null;
  @property(cc.Label)
  kdz_labe: cc.Label = null;
  @property(cc.Label)
  item_level: cc.Label = null;
  tx_id = "";
  withdraw_percent = 0;
  amount = 0;
  level = 0;
  level_limit = 0;
  right_count = 0;
  right_count_limit = 0;
  sign = 0;
  sign_limit = 0;
  sign_pass = 0;
  sign_pass_limit = 0;
  title = "1倍";
  step_xc_count = 0;
  xc_level_need_xc_count = 0;
  max_id = 0;
  wdReq = false;
  init(e, t, o, n) {
    this.xc_level_need_xc_count = o;
    this.step_xc_count = t;
    this.max_id = n;
    var a = e.sign_pass,
      i = e.level_limit,
      r = e.right_count_limit,
      c = e.right_count,
      s = e.level,
      u = e.sign_limit,
      p = e.withdraw_percent,
      d = e.sign_pass_limit,
      f = e.title,
      h = e.amount,
      g = void 0 === h ? 0 : h,
      _ = (e.grade, e.id),
      y = e.sign,
      m = void 0 === y ? 0 : y;
    this.right_count = c;
    this.right_count_limit = r;
    this.tx_id = _;
    this.title = f;
    this.level = s;
    this.sign_pass = a;
    this.level_limit = i;
    this.withdraw_percent = p;
    this.sign_limit = u;
    this.sign_pass_limit = d;
    this.sign = m;
    this.amount = g;
    (0.01 * g).toFixed(2);
    this.item_level.string = "闯关" + r + "次";
    this.title_lab.string = f;
    this.amountText.string = g + "元";
    this.cancel();
    if (this.max_id == Number(this.tx_id)) {
      this.is_now.active = true;
      this.is_cond.active = false;
      this.cantBtn.active = false;
      this.itemBg.getComponent(cc.Sprite).spriteFrame = this.icon[0];
      this.title_lab.node.color = EngineUtil.getColor("#FF0202");
      this.amountText.node.color = EngineUtil.getColor("#FF2700");
      this.kdz_labe.node.color = EngineUtil.getColor("#B5B5B5");
    } else if (this.max_id > Number(this.tx_id)) {
      if (0.022 == this.withdraw_percent || i > 0) {
        this.is_now.active = true;
        this.is_cond.active = false;
        this.cantBtn.active = false;
        this.itemBg.getComponent(cc.Sprite).spriteFrame = this.icon[0];
        this.title_lab.node.color = EngineUtil.getColor("#FF0202");
        this.amountText.node.color = EngineUtil.getColor("#FF2700");
        this.kdz_labe.node.color = EngineUtil.getColor("#B5B5B5");
      } else {
        this.is_now.active = false;
        this.is_cond.active = false;
        this.cantBtn.active = true;
        this.itemBg.getComponent(cc.Sprite).spriteFrame = this.icon[1];
        this.title_lab.node.color = EngineUtil.getColor("#B5B5B5");
        this.amountText.node.color = EngineUtil.getColor("#B5B5B5");
        this.kdz_labe.node.color = EngineUtil.getColor("#B5B5B5");
      }
      if ("4" == this.tx_id) {
        this.is_now.active = true;
        this.is_cond.active = false;
        this.cantBtn.active = false;
        this.itemBg.getComponent(cc.Sprite).spriteFrame = this.icon[0];
        this.title_lab.node.color = EngineUtil.getColor("#FF0202");
        this.amountText.node.color = EngineUtil.getColor("#FF2700");
        this.kdz_labe.node.color = EngineUtil.getColor("#B5B5B5");
      }
    } else {
      this.cantBtn.active = false;
      this.is_now.active = false;
      this.is_cond.active = true;
      this.itemBg.getComponent(cc.Sprite).spriteFrame = this.icon[0];
      this.title_lab.node.color = EngineUtil.getColor("#FF6E47");
      this.amountText.node.color = EngineUtil.getColor("#FF2700");
      this.kdz_labe.node.color = EngineUtil.getColor("#B5B5B5");
    }
  }
  select() {}
  cancel() {}
  cant() {}
  lockClick() {
    var e = this.getCondition();
    e && EngineUtil.showCocosToast3(e);
  }
  cantClick() {
    EngineUtil.showCocosToast3("已升级，并为你选择了当前最高比例");
  }
  withdrawClick() {
    var e = this;
    if (this.amount < 0.1) EngineUtil.showCocosToast3("可提现金额不足0.1元 继续闯关赚钱吧");else {
      var t = this.getCondition();
      if (t) {
        EngineUtil.showCocosToast3(t);
      } else {
        GameSystem.gotoGoldWithdraw({
          tx_id: this.tx_id
        }).then(function (t) {
          console.log("red withdraw res-----------", t);
          e.wdReq = false;
          if (t && 1 == t.code) {
            var o = t.data,
              n = o.amount,
              a = o.gold_balance,
              i = o.account_time;
            EventMgr.trigger(GameEventType.PAGE_SHOW, {
              name: "redWdSuccPage",
              data: {
                amount: n,
                account_time: i
              }
            });
            PlayerDataSys.setUserGoldBalance(a);
          }
        }).catch(function () {
          e.wdReq = false;
        });
      }
    }
  }
  getCondition() {
    return this.right_count_limit - this.right_count > 0 ? "再闯关" + (this.right_count_limit - this.right_count) + "次 可使用" + this.title + "提现" : this.sign_limit > 0 && this.sign_limit > this.sign ? this.sign_pass_limit > this.sign_pass ? "再通关" + (this.sign_pass_limit - this.sign_pass) + "次,完成今日打卡" : "再打卡" + (this.sign_limit - this.sign) + "天,可使用" + this.title + "提现" : this.level_limit > 0 ? this.level >= 29 ? "继续游戏即将升级,30级可使用" + this.title + "提现" : "再看" + (this.xc_level_need_xc_count - this.step_xc_count) + "个视频可升级,30级可使用" + this.title + "提现" : "";
  }
}