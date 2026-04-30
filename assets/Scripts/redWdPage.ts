import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
import redWdItem from './prefab/redWdItem';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class redWdPage extends BasePage {
  @property(cc.Prefab)
  redWdItem: cc.Prefab = null;
  @property(cc.Node)
  scrollView: cc.Node = null;
  @property(cc.Node)
  maskView: cc.Node = null;
  @property(cc.Node)
  scrollContent: cc.Node = null;
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Label)
  gold_count: cc.Label = null;
  @property(cc.RichText)
  extract_count: cc.RichText = null;
  @property(cc.Node)
  user_head: cc.Node = null;
  @property(cc.Label)
  user_name: cc.Label = null;
  @property(cc.Node)
  zhedang_node: cc.Node = null;
  redWdItemArr = [];
  selectItemMgr = null;
  xc_level_need_xc_count = 0;
  step_xc_count = 0;
  gameSucc = false;
  max_id = 0;
  clickToast = "";
  cb = null;
  guide_count = 1;
  guide_step = 1;
  onLoad() {
    var t = this;
    super.onLoad.call(this);
    EventMgr.listen(GameEventType.UPDATE_RED_WD_INFO, this.updateInfo, this);
    this.bg.setContentSize(cc.winSize);
    this.node.y = cc.winSize.height / 2;
    this.scrollView.height = this.maskView.height = cc.winSize.height - 690;
    if (PlayerDataSys.isOppoReviewer()) {
      this.scrollContent.height = 3220;
    } else {
      this.scrollContent.height = 2050;
    }
    PlayerDataSys.headimgurl && EngineUtil.loadRemoteImg(PlayerDataSys.headimgurl).then(function (e) {
      e && (t.user_head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e));
    }).catch(function (e) {
      console.log(e);
    });
    var o = PlayerDataSys.nickname || `gkey_507`;
    this.user_name.string = EngineUtil.nameFormat(o);
    this.zhedang_node.y = 33 - cc.winSize.height;
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.UPDATE_RED_WD_INFO, this.updateInfo, this);
  }
  updateInfo(e) {
    this._init2(e, false);
  }
  _init(e, t = false) {
    var o = e.cb,
      n = e.level,
      a = e.gameSucc,
      i = e.gold_balance,
      c = e.info,
      s = e.step_xc_count,
      l = e.xc_level_need_xc_count;
    o && (this.cb = o || null);
    this.max_id = n;
    this.gameSucc = a || false;
    this.step_xc_count = s;
    this.xc_level_need_xc_count = l;
    this.clickToast = "";
    this.gold_count.string = i;
    this.setItems(c);
  }
  _init2(e, t = false) {
    var o = e.cb,
      n = e.level,
      a = e.gold_balance,
      i = e.info,
      c = e.step_xc_count,
      s = e.xc_level_need_xc_count;
    o && (this.cb = o || null);
    this.max_id = n;
    this.step_xc_count = c;
    this.xc_level_need_xc_count = s;
    this.clickToast = "";
    this.gold_count.string = a;
    this.setItems(i);
  }
  setTop(e, t, o, n) {
    this.extract_count.string = `{"gkey_508":{"v1":"${t}","v2":"${n}"}}`;
  }
  setItems(e) {
    for (var t = 0; t < e.length; t++) {
      var o = e[t],
        n = this.redWdItemArr[t];
      if (!n) {
        var a = cc.instantiate(this.redWdItem);
        a.parent = this.scrollContent;
        n = a.getComponent(redWdItem);
        this.redWdItemArr.push(n);
      }
      n.init(o, this.step_xc_count, this.xc_level_need_xc_count, this.max_id);
    }
    for (var i = this.redWdItemArr.length - 1; i >= 0; i--) {
      var r = this.redWdItemArr[i],
        c = r.tx_id,
        s = r.right_count,
        l = r.title,
        u = r.withdraw_percent,
        p = r.amount;
      Number(c) == this.max_id && this.setTop(s, l, u, p);
    }
  }
  setCondition() {
    this.selectItemMgr && this.selectItemMgr.withdraw_percent;
  }
  close() {
    this.cb && this.cb();
    this.cb = null;
    this._hide();
  }
  clickClose() {
    this.cb && this.cb();
    this.cb = null;
    AudioManager.getInstance().playMusic("btntouch");
    this._hide();
  }
  checkGuide() {
    if (!cc.sys.localStorage.getItem("redWdPage_guide")) {
      this.guide_step = 0;
      this.scrollContent.y = 0;
      this.scrollView.getComponent(cc.ScrollView).enabled = false;
      this.scheduleOnce(this.setGuideStep, 0.05);
      cc.sys.localStorage.setItem("redWdPage_guide", 1);
    }
  }
  setGuideStep() {
    this.guide_step++;
    1 == this.guide_step && SdkHelper.reportData("red_wd_guide_1");
  }
  hisBtnClick() {
    GameSystem.withdrawHistory().then(function (e) {
      if (e && 1 == e.code) {
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "wdRecordPage",
          data: e.data
        });
      } else {
        SdkHelper.showToast(e.message || `gkey_509`);
      }
    }).catch(function () {
      SdkHelper.showToast(`gkey_509`);
    });
  }
  clickWdDesc() {
    AudioManager.getInstance().playMusic("btntouch");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "wdDescribePage",
      data: {
        des: gameData.gold_extract_desc
      }
    });
  }
}