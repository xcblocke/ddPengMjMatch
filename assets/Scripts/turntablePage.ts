import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType } from './framework/enum/AllEnum';
import BreathComp from './common/BreathComp';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
enum l {
  Cxxp = 1,
  Qklw = 2,
  Tsyx = 3,
  XJ = 4,
  Hb = 5,
  Dehb = 6,
}
@ccclass
export default class turntablePage extends BasePage {
  @property(cc.Node)
  move_icon: cc.Node = null;
  @property(cc.Node)
  reward_icons: cc.Node = [];
  @property(cc.Node)
  topNode: cc.Node = null;
  @property(cc.RichText)
  tipsLabel: cc.RichText = null;
  @property(cc.Node)
  btnNode: cc.Node = null;
  @property(cc.Node)
  mapNode: cc.Node = null;
  @property(cc.Node)
  baciNode: cc.Node = null;
  @property(cc.Node)
  fullCloseBtnNode: cc.Node = null;
  luckyDrawList = null;
  needLevel = 0;
  move_idx = 0;
  reward = null;
  reward_type = "";
  isRunning = false;
  all_status = 0;
  cb = null;
  hadReq = false;
  run_count = 0;
  all_runCount = 0;
  _init(e) {
    this.cb = null == e ? void 0 : e.cb;
    this.playShowAnim();
    this.initData();
    SdkHelper.reportData("video", {
      page_id: "2",
      action_type: "show",
      level: gameData.gameLevel,
      force: false,
      ext_param: ""
    });
    if (gameData.lucky_count > 0) {
      this.btnNode.children[0].active = false;
      this.btnNode.getComponent(BreathComp).enabled = true;
    } else {
      this.btnNode.children[0].active = true;
      this.btnNode.getComponent(BreathComp).enabled = false;
    }
    AudioManager.getInstance().playMusic("Praise");
  }
  playShowAnim() {
    var e = this;
    this.move_icon.active = false;
    this.fullCloseBtnNode.opacity = 0;
    this.fullCloseBtnNode.active = false;
    this.mapNode.scale = 0;
    cc.tween(this.mapNode).delay(0.5).to(0.2, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
    this.baciNode.scale = 0;
    cc.tween(this.baciNode).delay(0.5).to(0.2, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
    this.btnNode.scale = 0;
    this.btnNode.getComponent(BreathComp).enabled = false;
    cc.tween(this.btnNode).delay(0.7).to(0.2, {
      scale: 1
    }, {
      easing: "backOut"
    }).call(function () {
      e.fullCloseBtnNode.active = true;
      cc.tween(e.fullCloseBtnNode).to(0.2, {
        opacity: 255
      }, {
        easing: "backOut"
      }).start();
      if (gameData.lucky_count > 0) {
        e.btnNode.children[0].active = false;
        e.btnNode.getComponent(BreathComp).enabled = true;
      } else e.btnNode.children[0].active = true;
    }).start();
  }
  async initData() {
    this.reward = null;
    this.reward_type = null;
    await this.reqData();
    this.initUI();
    return;
  }
  async initUI() {
    var e = this;
    this.all_status = 0;
    this.luckyDrawList.forEach(function (t) {
      1 == t.status && e.all_status++;
    });
    this.mapNode.children.forEach(function (e) {
      e.getChildByName("select").active = false;
      e.getChildByName("mask").active = false;
    });
    if (gameData.lucky_count > 0) {
      this.tipsLabel.string = `{"gkey_542":{"v1":"${gameData.lucky_count}"}}`;
    } else {
      this.tipsLabel.string = `{"gkey_543":{"v1":"${this.needLevel}"}}`;
    }
    this.all_status >= 8 && (this.topNode.active = false);
    this.mapNode.children.forEach(function (t, o) {
      var n = e.luckyDrawList[o],
        a = t.getChildByName("mask");
      a.active = n.status;
      var i = a.getChildByName("get"),
        r = a.getChildByName("await");
      if (1 == n.status) if (n.wait_day_limit > 0) {
        r.active = true;
        i.active = false;
      } else {
        r.active = false;
        i.active = true;
      }
    });
    return;
  }
  async reqData() {
    var e;
    if ((e = await GameSystem.luckyDrawInfo()).data) {
      this.luckyDrawList = e.data.info;
      this.needLevel = e.data.need_level;
    }
    return;
  }
  click_prize() {
    if (this.all_status >= 8) EngineUtil.showCocosToast3(`gkey_544`);else {
      if (gameData.lucky_count <= 0) return EngineUtil.showCocosToast3(`{"gkey_545":{"v1":"${this.needLevel}"}}`);
      if (!this.isRunning) {
        var e = this.checkCanDraw();
        if (null != e && !this.hadReq) {
          this.hadReq = true;
          gameData.lucky_count--;
          EventMgr.trigger(GameEventType.UPDATE_MAIN_BTN_STATE);
          this.runAni(e);
        }
      }
    }
  }
  checkCanDraw() {
    var e = 0,
      t = [...this.luckyDrawList];
    t.sort(function (e, t) {
      return e.bingo - t.bingo;
    });
    for (var o = 0; o < t.length; o++) if (0 == t[o].status) {
      e = Number(t[o].lucky_draw_id);
      break;
    }
    var n = this.luckyDrawList[e - 1],
      a = n.level_count_limit,
      i = n.success_count,
      r = n.lucky_draw_id,
      c = n.wait_day_limit,
      l = (n.show_money, n.money),
      u = n.type;
    if (i >= a) {
      if (1 == u) {
        if (c > 0) {
          this.reward_type = "cash_fake";
          this.reward = 0;
        } else {
          this.reward_type = "cash";
          this.reward = l;
        }
      } else {
        this.reward_type = "prop";
        this.reward = Number(r);
      }
      return e;
    }
    EngineUtil.showCocosToast3(`{"gkey_546":{"v1":"${(a - i)}"}}`);
    return null;
  }
  getUnfinishedRewardIndices() {
    for (var e, t, o, n = [], a = null !== (t = null === (e = this.reward_icons) || void 0 === e ? void 0 : e.length) && void 0 !== t ? t : 0, i = 0; i < a; i++) {
      var r = null === (o = this.luckyDrawList) || void 0 === o ? void 0 : o[i];
      r && 0 == r.status && n.push(i);
    }
    return n;
  }
  runAni(e) {
    this.isRunning = true;
    this.move_idx = e;
    AudioManager.getInstance().playMusic("prop_get");
    this.run_count = 0;
    this.all_runCount = 5 * this.reward_icons.length + e;
    this.unschedule(this.playMove);
    this.schedule(this.playMove, 0.025);
  }
  playMove() {
    if (this.run_count !== this.all_runCount) {
      AudioManager.getInstance().playMusic("btntouch");
      this.move_icon.active = true;
      var e = this.reward_icons.length,
        t = this.getUnfinishedRewardIndices(),
        o = this.run_count % e;
      if (t.length > 0) {
        var n = Math.max(0, Number(this.move_idx) - 1);
        o = this.run_count >= this.all_runCount - 1 ? n : t[this.run_count % t.length];
      }
      this.setSelectIndex(o);
      this.run_count++;
      if (this.all_runCount - 12 === this.run_count) {
        this.unschedule(this.playMove);
        this.schedule(this.playMove, 0.06);
      }
      if (this.all_runCount - 8 === this.run_count) {
        this.unschedule(this.playMove);
        this.schedule(this.playMove, 0.08);
      }
      if (this.all_runCount - 4 === this.run_count) {
        this.unschedule(this.playMove);
        this.schedule(this.playMove, 0.15);
      }
      if (this.all_runCount - 2 === this.run_count) {
        this.unschedule(this.playMove);
        this.schedule(this.playMove, 0.2);
      }
    } else {
      this.unschedule(this.playMove);
      this.scheduleOnce(this.getClose, 1);
    }
  }
  onTouchItem(e) {
    var t = Number(e.target.name),
      o = this.luckyDrawList[t],
      n = (o.bingo, o.wait_day_limit),
      a = o.end_time,
      i = o.video_count,
      r = o.video_count_limit,
      c = o.user_level_limit,
      s = o.xc_level,
      l = o.show_money,
      u = o.status,
      f = o.lucky_draw_id;
    if (u) {
      0 == Number(n) || EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wheelWdfPage",
        data: {
          cash: l,
          video_count: i,
          video_count_limit: r,
          user_level_limit: c,
          xc_level: s,
          end_time: 1000 * a,
          lucky_draw_id: f
        }
      });
    } else {
      EngineUtil.showCocosToast3(`gkey_547`);
    }
  }
  setSelectIndex(e) {
    var t = this;
    this.mapNode.children.forEach(function (o, n) {
      var a = t.luckyDrawList[n],
        i = o.getChildByName("select");
      if (a.status) {
        i.active = false;
      } else {
        i.active = n == e;
      }
    });
  }
  getClose() {
    var e = this;
    this.hadReq = false;
    console.log("this.reward", this.reward, this.reward_type);
    if (null != this.reward) {
      var t = this.cb,
        o = false,
        n = function () {
          if (!o) {
            o = true;
            t && t();
          }
        };
      this.cb = null;
      GameSystem.luckyDraw({
        tx_id: String(this.move_idx)
      }).then(function (o) {
        e.isRunning = false;
        if (!o || 1 != o.code || !o.data) {
          EngineUtil.showCocosToast3(o && o.message ? o.message : `gkey_548`);
          n();
          return;
        }
        var a = o.data,
          i = a.amount,
          r = a.info,
          c = a.lucky_bubble;
        gameData.lucky_bubble = c || "";
        EventMgr.trigger(GameEventType.UPDATE_WHEEL_BUBBLE);
        if ("cash" == e.reward_type) EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "wheelWdrPage",
          data: {
            cash: i,
            cb: n
          }
        });else if ("cash_fake" == e.reward_type) {
          var s = r && r[e.move_idx - 1];
          if (!s) {
            n();
            return;
          }
          var l = s.end_time,
            u = s.video_count,
            f = s.video_count_limit,
            h = s.user_level_limit,
            y = s.xc_level,
            v = s.show_money,
            b = s.lucky_draw_id;
          EventMgr.trigger(GameEventType.PAGE_SHOW, {
            name: "wheelWdfPage",
            data: {
              cash: v,
              video_count: u,
              video_count_limit: f,
              user_level_limit: h,
              xc_level: y,
              end_time: 1000 * l,
              lucky_draw_id: b,
              cb: n
            }
          });
        } else if ("prop" == e.reward_type) {
          var w = 0,
            P = 0;
          if (6 == e.reward) {
            w = PropType.reshuffleCard;
            P = 1;
          } else if (4 == e.reward) {
            w = PropType.freezeCard;
            P = 1;
          } else if (2 == e.reward) {
            w = PropType.tipCard;
            P = 3;
          }
          EventMgr.trigger(GameEventType.PAGE_SHOW, {
            name: "rewardToastPage",
            data: {
              cash: 0,
              red: 0,
              propInfo: {
                type: w,
                num: P
              },
              cb: n
            }
          });
          PlayerDataSys.setUserPropCount(o.data.prop_info, false);
          e.reward = null;
          e.reward_type = null;
        } else {
          n();
        }
      }).catch(function (t) {
        e.isRunning = false;
        console.error("luckyDraw error", t);
        EngineUtil.showCocosToast3(t && t.message ? t.message : `gkey_548`);
        n();
      });
    }
    this.cb && this.cb();
    this._hide();
  }
  _onHide() {
    super._onHide.call(this);
  }
  clickClose() {
    if (!this.hadReq) {
      this.cb && this.cb();
      AudioManager.getInstance().playMusic("btntouch");
      this._hide();
    }
  }
}
