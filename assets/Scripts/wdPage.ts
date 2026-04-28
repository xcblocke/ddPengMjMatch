import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import BasePage from './view/BasePage';
import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdPage extends BasePage {
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Label)
  user_cash_num: cc.Label = null;
  @property(cc.Node)
  user_head: cc.Node = null;
  @property(cc.Label)
  user_name: cc.Label = null;
  @property(cc.RichText)
  double_info: cc.RichText = null;
  @property(cc.Node)
  content_node: cc.Node = null;
  @property(cc.Prefab)
  item_prefab: cc.Prefab = null;
  @property(cc.Node)
  scrollview: cc.Node = null;
  @property(cc.RichText)
  dqtj_label: cc.RichText = null;
  @property(cc.Node)
  zhedang_node: cc.Node = null;
  @property(cc.Node)
  back_hand: cc.Node = null;
  gameSucc = false;
  cb = null;
  onLoad() {
    super.onLoad.call(this);
    this.bg.setContentSize(cc.winSize);
    this.node.y = cc.winSize.height / 2;
    this.scrollview.height = cc.winSize.height - 700;
    this.zhedang_node.y = 33 - cc.winSize.height;
    EventMgr.listen(GameEventType.UPDATE_WD_INFO, this.updateInfo, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.UPDATE_WD_INFO, this.updateInfo, this);
  }
  updateInfo(e) {
    this._init(e, true);
    this.back_hand.active = true;
  }
  _init(e, t = false) {
    var o = this;
    EngineUtil.getLocalData("wd_click_status") || EngineUtil.setLocalData("wd_click_status", "[1,1]");
    var n = e.info,
      a = e.auto_wd,
      i = void 0 !== a && a,
      p = e.extract_status,
      f = void 0 === p ? 0 : p,
      h = e.gameSucc,
      g = void 0 !== h && h,
      _ = e.cash_threshold,
      y = void 0 !== _ && _,
      m = e.levle_threshold,
      v = void 0 !== m && m,
      b = e.wd_desc,
      w = void 0 === b ? "" : b,
      S = e.cb;
    e.cb && (this.cb = S);
    console.log("wdPage", e);
    if (gameData.gameLevel <= 2) this.dqtj_label.string = `gkey_554`;else {
      for (var E = 0, P = 0, C = 0, D = 0, O = 2; O < n.length; O++) if (n[O].extract_status <= 1) {
        E = n[O].level_target_limit;
        P = n[O].cash_limit;
        C = n[O].extract_status;
        D = n[O].withdraw_percent_3;
        break;
      }
      if (0 == C) {
        if (E == gameData.gameLevel) this.dqtj_label.string = `{"gkey_555":{"v1":"${PlayerDataSys.getCashBalance(PlayerDataSys.cashBalance * D)}"}}`;else {
          var T;
          T = 0 == E ? `gkey_556` : `{"gkey_557":{"v1":"${(E - gameData.successCount)}","v2":"${PlayerDataSys.getCashBalance(PlayerDataSys.cashBalance * D)}"}}`;
          this.dqtj_label.string = T;
        }
      } else this.dqtj_label.string = `{"gkey_558":{"v1":"${PlayerDataSys.getCashBalance(P)}","v2":"${PlayerDataSys.getCashBalance(P - PlayerDataSys.cashBalance)}"}}`;
    }
    "" != w && (this.dqtj_label.string = w);
    t || (this.gameSucc = g || false);
    this.user_cash_num.string = PlayerDataSys.getCashBalance();
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (e) {
      e && (o.user_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e));
    }).catch(function (e) {
      console.log(e);
    });
    this.createItem(n);
    var A = PlayerDataSys.nickname || `gkey_507`;
    this.user_name.string = EngineUtil.nameFormat(A);
    if (i) {
      this.scheduleOnce(function () {
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "steAutoWdPage",
          data: {
            gameSucc: o.gameSucc,
            extract_status: f,
            cash_threshold: y,
            levle_threshold: v,
            info: n,
            cb: o.cb
          }
        });
        gameData.load_guide = false;
      });
    } else {
      t || AudioManager.getInstance().playCash("wd_cash_page");
    }
  }
  createItem(e) {
    for (var t = 0; t < e.length; t++) if (this.content_node.childrenCount >= e.length) this.content_node.children[t].getComponent("wdItem").init(e[t]);else {
      var o = cc.instantiate(this.item_prefab);
      o.parent = this.content_node;
      o.getComponent("wdItem").init(e[t]);
    }
  }
  closePage() {
    AudioManager.getInstance().playMusic("btntouch");
    AudioManager.getInstance().stopCash("wd_cash_page");
    this.back_hand.active = false;
    this.cb && this.cb();
    this._hide();
  }
  clickSet() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "SetUpPage"
    });
  }
  clickWdDesc() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "wdDescribePage",
      data: {
        des: gameData.cash_extract_desc
      }
    });
  }
}