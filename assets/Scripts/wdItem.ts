import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdItem extends cc.Component {
  @property(cc.Label)
  wd_ratio: cc.Label = null;
  @property(cc.Label)
  wd_level_num: cc.Label = null;
  @property(cc.Label)
  kdz_label: cc.Label = null;
  @property(cc.Label)
  kdz_num_label: cc.Label = null;
  @property(cc.Node)
  hengxian: cc.Node = null;
  @property(cc.Sprite)
  item_sprite: cc.Sprite = null;
  @property(cc.SpriteFrame)
  item_sprite_frame: cc.SpriteFrame = [];
  @property(cc.Sprite)
  btn_sprite: cc.Sprite = null;
  @property(cc.Label)
  btn_label: cc.Label = null;
  @property(cc.SpriteFrame)
  btn_sprite_frame: cc.SpriteFrame = [];
  @property(cc.Node)
  finish_return: cc.Node = null;
  @property(cc.Node)
  common_return: cc.Node = null;
  extract_status = 0;
  status = 0;
  wd_item_id = 0;
  withdraw_percent = 0;
  extract_amount = 0;
  cash_limit = 0;
  limit_days_begin_time = 0;
  limit_days_end_time = 0;
  withdraw_percent_3 = 0;
  extract_info = null;
  init(e) {
    if (e) {
      var t = e.amount,
        o = (e.cash, e.cash_limit),
        n = e.extract_status,
        a = e.extract_amount,
        i = e.id,
        r = (e.level_target, e.level_target_limit),
        c = e.limit_days_begin_time,
        p = e.limit_days_end_time,
        d = (e.sign, e.sign_limit, e.sign_pass, e.sign_pass_limit, e.user_grade, e.user_grade_limit, e.video_count, e.video_count_limit, e.wait_day_limit, e.withdraw_percent),
        f = e.withdraw_percent_3,
        h = e.status;
      this.extract_status = n;
      this.status = h;
      this.wd_item_id = i;
      this.withdraw_percent = d;
      this.extract_amount = a;
      this.cash_limit = o;
      this.extract_info = e;
      this.limit_days_begin_time = c;
      this.limit_days_end_time = p;
      this.withdraw_percent_3 = f;
      if (1 == Number(i)) {
        this.hengxian.active = false;
      } else {
        this.hengxian.active = true;
      }
      if (gameData.gameLevel > 2) {
        this.wd_ratio.string = Math.floor(100 * f) + "%";
      } else {
        this.wd_ratio.string = Math.floor(100 * d) + "%";
      }
      this.wd_level_num.string = `{"gkey_064":{"v1":"${r}"}}`;
      if (1 == Number(i) || 2 == Number(i)) {
        if (1 == h) {
          this.setItemStatus(0, `gkey_066`, 40, "#B5B5B5", "#B5B5B5", "#B5B5B5", 1);
          this.kdz_label.string = `gkey_066`;
          this.kdz_num_label.string = `{"gkey_039":{"v1":"${PlayerDataSys.getCashBalance(a)}"}}`;
          if (2 == Number(i)) {
            this.finish_return.active = true;
            this.common_return.active = false;
          } else {
            this.finish_return.active = false;
            this.common_return.active = false;
          }
        } else {
          this.setItemStatus(2, `gkey_156`, 40, "#FF0202", "#729980", "#00B26E", 0);
          this.kdz_label.string = `gkey_065`;
          this.kdz_num_label.string = `{"gkey_039":{"v1":"${t}"}}`;
          if (2 == Number(i)) {
            this.finish_return.active = false;
            this.common_return.active = true;
          } else {
            this.finish_return.active = false;
            this.common_return.active = false;
          }
        }
      } else {
        var g = cc.sys.localStorage.getItem("make_up_reward") || "0";
        this.finish_return.active = false;
        this.common_return.active = true;
        this.kdz_label.string = `gkey_065`;
        if (1 == h) this.kdz_num_label.string = `{"gkey_039":{"v1":"${PlayerDataSys.getCashBalance(a - Number(g))}"}}`;else {
          this.kdz_num_label.string = `{"gkey_039":{"v1":"${t}"}}`;
          var _ = this.withdraw_percent_3 * Number(g);
          _ < 100 * t && (this.kdz_num_label.string = `{"gkey_039":{"v1":"${PlayerDataSys.getCashBalance(100 * t - _)}"}}`);
        }
        if (0 == n) {
          this.setItemStatus(2, `gkey_156`, 40, "#FF0202", "#729980", "#00B26E", 0);
        } else {
          if (1 == n) {
            if (JSON.parse(EngineUtil.getLocalData("wd_click_status") || "[]")[this.wd_item_id - 1]) {
              this.setItemStatus(1, `gkey_552`, 36, "#FF0202", "#729980", "#00B26E", 0);
            } else {
              this.setItemStatus(2, `gkey_156`, 40, "#FF0202", "#729980", "#00B26E", 0);
            }
          } else {
            n >= 2 && this.setItemStatus(1, `gkey_552`, 36, "#FF0202", "#729980", "#00B26E", 0);
          }
        }
      }
    }
  }
  onClickWd() {
    var e;
    e = {
      amount: PlayerDataSys.cashBalance,
      extract_amount: this.extract_amount,
      cash_balance: 0,
      gameSucc: false,
      extract_status: this.extract_status,
      wd_index: Number(this.wd_item_id - 1),
      limit_days_begin_time: 1000 * this.limit_days_begin_time,
      limit_days_end_time: 1000 * this.limit_days_end_time,
      extract_info: this.extract_info
    };
    if (0 == this.extract_status) {
      EngineUtil.showCocosToast3(`gkey_553`);
    } else {
      this.extract_status >= 1 && (1 == Number(this.wd_item_id) || 2 == Number(this.wd_item_id) ? EngineUtil.showCocosToast3(`gkey_066`) : EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wdSuccFakePage",
        data: e
      }));
    }
  }
  setItemStatus(e, t, o, n, a, i, r) {
    this.btn_sprite.spriteFrame = this.btn_sprite_frame[e];
    this.btn_label.string = t;
    this.btn_label.fontSize = o;
    this.wd_ratio.node.color = EngineUtil.getColor(n);
    this.item_sprite.spriteFrame = this.item_sprite_frame[r];
    this.kdz_label.node.color = EngineUtil.getColor(a);
    this.kdz_num_label.node.color = EngineUtil.getColor(i);
  }
}