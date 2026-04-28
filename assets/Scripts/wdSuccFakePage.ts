import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameConfig } from './data/GameConfig';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdSuccFakePage extends BasePage {
  @property(cc.RichText)
  top_desc: cc.RichText = null;
  @property(cc.Label)
  cash_num: cc.Label = null;
  @property(cc.Label)
  sksj_label: cc.Label = null;
  @property(cc.RichText)
  dzsj_label: cc.RichText = null;
  @property(cc.RichText)
  skts_label: cc.RichText = null;
  gameSucc = false;
  cb = null;
  data = null;
  cash_balance = 0;
  limit_days_begin_time = 0;
  limit_days_end_time = 0;
  sign = 0;
  sign_limit = 0;
  sign_pass = 0;
  sign_pass_limit = 0;
  user_grade = 0;
  user_grade_limit = 0;
  video_count = 0;
  video_count_limit = 0;
  withdraw_percent_3 = 0;
  collection_count = 0;
  collection_count_limit = 0;
  status_timeout = null;
  _init(e) {
    this.data = e;
    var t = e.amount,
      o = e.extract_amount,
      n = e.gameSucc,
      a = e.cash_balance,
      i = e.extract_status,
      r = e.wd_index,
      c = e.cb,
      s = (e.limit_days_begin_time, e.limit_days_end_time),
      l = e.extract_info;
    this.gameSucc = n || false;
    this.cash_balance = a;
    this.cb = c;
    var h = l.cash_limit,
      g = l.withdraw_percent_3,
      _ = l.sign,
      y = l.sign_limit,
      m = l.sign_pass,
      v = l.sign_pass_limit,
      b = l.user_grade,
      w = l.user_grade_limit,
      S = l.video_count,
      E = l.video_count_limit,
      P = l.collection_count,
      C = l.collection_count_limit;
    this.sign = _;
    this.sign_limit = y;
    this.sign_pass = m;
    this.sign_pass_limit = v;
    this.user_grade = b;
    this.user_grade_limit = w;
    this.video_count = S;
    this.video_count_limit = E;
    this.withdraw_percent_3 = g;
    this.collection_count = P;
    this.collection_count_limit = C;
    if (1 == i) this.cash_num.string = PlayerDataSys.getCashBalance();else {
      var D = cc.sys.localStorage.getItem("make_up_reward") || "0",
        O = o || t;
      this.cash_num.string = PlayerDataSys.getCNCashNum(O - Number(D));
    }
    var T = EngineUtil.getLocalData("wd_time"),
      A = JSON.parse(T || "[]"),
      k = A[r];
    k || (k = Date.now());
    this.sksj_label.string = EngineUtil.formatDateTime(k);
    this.limit_days_begin_time = A[r];
    this.limit_days_end_time = s;
    gameConfig.cashExtractLevel[r + 1], gameData.successCount;
    this.updateStatus(i, g, h);
    var R = JSON.parse(EngineUtil.getLocalData("wd_click_status") || "[]");
    R.splice(r, 1, 1);
    EngineUtil.setLocalData("wd_click_status", JSON.stringify(R));
    this.unschedule(this.status_timeout);
  }
  updateStatus(e, t, o) {
    var n = this;
    if (1 == e) {
      this.dzsj_label.string = `{"gkey_560":{"v1":"${PlayerDataSys.getCashBalanceWithUnit(o - PlayerDataSys.cashBalance)}"}}`;
      this.top_desc.string = `{"gkey_561":{"v1":"${100 * t}","v2":"${PlayerDataSys.getCashBalance(o)}","v3":"${PlayerDataSys.getCashBalanceWithUnit(o - PlayerDataSys.cashBalance)}"}}`;
      this.skts_label.string = `{"gkey_562":{"v1":"${PlayerDataSys.getCashBalanceWithUnit(o - PlayerDataSys.cashBalance)}"}}`;
    } else if (2 == e) {
      this.dzsj_label.string = "" + EngineUtil.formatDateTime(this.limit_days_end_time);
      var a = EngineUtil.getRemainTime(this.limit_days_end_time);
      this.skts_label.string = `gkey_563`;
      this.top_desc.string = `gkey_294` == a ? `gkey_564` : `{"gkey_565":{"v1":"${a}"}}`;
      this.status_timeout = function () {
        n.schedule(function () {
          var e = EngineUtil.getRemainTime(n.limit_days_end_time);
          n.top_desc.string = `gkey_294` == e ? `gkey_564` : `{"gkey_565":{"v1":"${e}"}}`;
        }, 1);
      };
    } else if (3 == e) {
      this.skts_label.string = `{"gkey_566":{"v1":"${this.sign}","v2":"${this.sign_limit}"}}`;
      this.dzsj_label.string = `{"gkey_567":{"v1":"${this.sign}","v2":"${this.sign_limit}","v3":"${this.sign_pass}","v4":"${this.sign_pass_limit}"}}`;
      this.top_desc.string = `gkey_568`;
    } else if (4 == e) {
      this.skts_label.string = `{"gkey_569":{"v1":"${this.collection_count}","v2":"${this.collection_count_limit}"}}`;
      this.dzsj_label.string = `{"gkey_570":{"v1":"${this.collection_count}","v2":"${this.collection_count_limit}"}}`;
      this.top_desc.string = `gkey_568`;
    } else if (5 == e) {
      this.skts_label.string = `{"gkey_571":{"v1":"${this.user_grade}","v2":"${this.user_grade_limit}"}}`;
      this.dzsj_label.string = `{"gkey_572":{"v1":"${this.user_grade}","v2":"${this.user_grade_limit}"}}`;
      this.top_desc.string = `gkey_568`;
    }
  }
  start() {}
  closePage() {
    AudioManager.getInstance().playMusic("btntouch");
    AudioManager.getInstance().stopMusic("wd_succ", false);
    if (this.cash_balance > 0) {
      var e = Object.assign(Object.assign({}, this.data), {
        withdraw_percent_3: this.withdraw_percent_3
      });
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wdReturnPage",
        data: e
      });
    } else this.gotoWdPage();
    this._hide();
  }
  gotoWdPage() {
    var e = this;
    GameSystem.getExtractInfo().then(function (t) {
      EngineUtil.reconnectSuc();
      if (t && 1 == t.code) {
        var o = Object.assign(Object.assign({}, t.data), {
          gameSucc: e.gameSucc,
          auto_wd: false,
          cash_threshold: false
        });
        EventMgr.trigger(GameEventType.UPDATE_WD_INFO, o);
      }
    }).catch(function (t) {
      EngineUtil.reconnectFai();
      EngineUtil.httpErr(t, function () {
        e.gotoWdPage();
      });
    });
  }
}