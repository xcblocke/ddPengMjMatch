import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { CardSkinType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import { Res } from './common/ResourcesManager';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class tujianPage extends BasePage {
  @property(cc.Label)
  totalCashLabel: cc.Label = null;
  @property(cc.Sprite)
  totalPro: cc.Sprite = null;
  @property(cc.Label)
  totalProLabel: cc.Label = null;
  @property(cc.Node)
  tabBarContent: cc.Node = null;
  @property(cc.Node)
  page1: cc.Node = null;
  @property(cc.Node)
  page2: cc.Node = null;
  @property(cc.Node)
  page3: cc.Node = null;
  @property(cc.ScrollView)
  page1ScrollView: cc.ScrollView = null;
  @property(cc.ScrollView)
  page2ScrollView: cc.ScrollView = null;
  @property(cc.ScrollView)
  page3ScrollView: cc.ScrollView = null;
  @property(cc.Node)
  page1Content: cc.Node = null;
  @property(cc.Node)
  page2Content: cc.Node = null;
  @property(cc.Node)
  page3Content: cc.Node = null;
  @property(cc.Node)
  huaItem: cc.Node = null;
  curTabIndex = -1;
  cb = null;
  data = null;
  onLoad() {
    super.onLoad.call(this);
  }
  _init(e) {
    this.cb = e.cb || null;
    this.data = e;
    this.initUI();
  }
  initUI() {
    this.initTopUI();
    this.initTabUI();
    this.initPage1();
    this.initPage2();
    this.initPage3();
    this.setCurTabIndex(0);
  }
  initTabUI() {
    var e = this;
    this.tabBarContent.children.forEach(function (t, o) {
      var n = t.getChildByName("normalBg"),
        a = t.getChildByName("selectBg"),
        i = t.getChildByPath("normalBg/tab_bg1_jindu_bg/proBar"),
        r = t.getChildByPath("normalBg/tab_bg1_jindu_bg/proNum"),
        c = t.getChildByPath("selectBg/tab_bg_xuanzhong_jindu_bg/proBar"),
        s = t.getChildByPath("selectBg/tab_bg_xuanzhong_jindu_bg/proNum");
      n.active = o != e.curTabIndex;
      a.active = o == e.curTabIndex;
      var l = 0,
        u = "";
      if (0 == o) {
        l = e.getBgCollectCount() / e.data.info[0].list.length;
        u = e.getBgCollectCount() + "/" + e.data.info[0].list.length;
      } else if (1 == o) {
        l = e.getCardCollectCount() / e.data.info[1].list.length;
        u = e.getCardCollectCount() + "/" + e.data.info[1].list.length;
      } else {
        l = e.getSpecialCardCollectCount() / e.data.info[2].list.length;
        u = e.getSpecialCardCollectCount() + "/" + e.data.info[2].list.length;
      }
      i.getComponent(cc.Sprite).fillRange = l;
      c.getComponent(cc.Sprite).fillRange = l;
      r.getComponent(cc.Label).string = "" + u;
      s.getComponent(cc.Label).string = "" + u;
    });
  }
  initTopUI() {
    this.totalCashLabel.string = "" + PlayerDataSys.getCNCashNum(this.data.extract_info.show_money);
    this.totalPro.fillRange = this.data.extract_info.collection_count / this.data.extract_info.collection_count_limit;
    this.totalProLabel.string = this.data.extract_info.collection_count + "/" + this.data.extract_info.collection_count_limit;
  }
  initPage1() {
    var e = this,
      t = this.page1.getChildByPath("top/topBg/green"),
      o = this.page1.getChildByPath("top/topBg/orange");
    t.active = 0 == this.data.info[0].extract_status;
    o.active = 0 != this.data.info[0].extract_status;
    var n = this.page1.getChildByPath("top/tipbg/tip"),
      a = this.data.info[0].list.find(function (e) {
        return 1 == e.lock;
      });
    n.getComponent(cc.RichText).string = a ? `{"gkey_531":{"v1":"${(a.level_count_limit - a.current_level_count)}"}}` : `gkey_532`;
    this.page1Content.children.forEach(function (t, o) {
      var n = t.getChildByName("lock"),
        a = t.getChildByName("select");
      n.active = 1 == e.data.info[0].list[o].lock;
      if (gameData.gameSkinData.cardSkin == CardSkinType.CardSkin4) {
        a.active = 28 == Number(e.data.info[0].list[o].id);
      } else {
        a.active = gameData.gameSkinData.cardSkin == Number(e.data.info[0].list[o].id);
      }
      t.getChildByPath("lock/ly/level").getComponent(cc.Label).string = `{"gkey_533":{"v1":"${e.data.info[0].list[o].level_count_limit}"}}`;
    });
  }
  initPage2() {
    var e = this,
      t = this.page2.getChildByPath("top/topBg/green"),
      o = this.page2.getChildByPath("top/topBg/orange");
    t.active = 0 == this.data.info[1].extract_status;
    o.active = 0 != this.data.info[1].extract_status;
    var n = this.page2.getChildByPath("top/tipbg/tip"),
      a = this.data.info[1].list.find(function (e) {
        return 1 == e.lock;
      });
    n.getComponent(cc.RichText).string = a ? `{"gkey_534":{"v1":"${(a.level_count_limit - a.current_level_count)}"}}` : `gkey_535`;
    console.log("gameData.gameSkinData.bgSkin", gameData.gameSkinData.bgSkin);
    this.page2Content.children.forEach(function (t, o) {
      var n = t.getChildByName("lock"),
        a = t.getChildByName("select");
      n.active = 1 == e.data.info[1].list[o].lock;
      a.active = gameData.gameSkinData.bgSkin == Number(e.data.info[1].list[o].id) - 3;
      t.getChildByPath("lock/ly/level").getComponent(cc.Label).string = `{"gkey_533":{"v1":"${e.data.info[1].list[o].level_count_limit}"}}`;
    });
  }
  initPage3() {
    var e = this,
      t = this.page3.getChildByPath("top/topBg/green"),
      o = this.page3.getChildByPath("top/topBg/orange");
    t.active = 0 == this.data.info[2].extract_status;
    o.active = 0 != this.data.info[2].extract_status;
    var n = this.page3.getChildByPath("top/tipbg/tip"),
      a = this.data.info[2].list.find(function (e) {
        return 1 == e.lock;
      });
    n.getComponent(cc.RichText).string = a ? `{"gkey_536":{"v1":"${(a.level_count_limit - a.current_level_count)}"}}` : `gkey_537`;
    for (var i = 0; i < this.data.info[2].list.length; i++) {
      var r = this.page3Content.children[i];
      r || (r = cc.instantiate(this.huaItem));
      r.name = "" + (i + 1);
      r.parent = this.page3Content;
      r.active = true;
      r.getChildByName("name").getComponent(cc.Label).string = this.data.info[2].list[i].name;
      for (var c = r.getChildByPath("bg_1/ly"), s = 0; s < 4; s++) {
        var l = c.children[s],
          u = l.getChildByPath("icon"),
          p = l.getChildByName("lock"),
          h = this.data.info[2].list[i].id;
        u.getComponent(cc.Sprite).spriteFrame = Res.getMahjongSpriteFrame("hua_" + (Number(h) - 7) + "_10" + (s + 1));
        p.active = 1 == this.data.info[2].list[i].lock;
      }
    }
    this.page3Content.children.forEach(function (t, o) {
      var n = t.getChildByName("lock"),
        a = t.getChildByName("select");
      n.active = 1 == e.data.info[2].list[o].lock;
      a.active = gameData.gameSkinData.specialCardSkin == Number(e.data.info[2].list[o].id) - 7;
      t.getChildByPath("lock/ly/level").getComponent(cc.Label).string = `{"gkey_533":{"v1":"${e.data.info[2].list[o].level_count_limit}"}}`;
    });
  }
  getBgCollectCount() {
    var e = 0;
    this.data.info[0].list.forEach(function (t) {
      e += 1 == t.lock ? 0 : 1;
    });
    return e;
  }
  getCardCollectCount() {
    var e = 0;
    this.data.info[1].list.forEach(function (t) {
      e += 1 == t.lock ? 0 : 1;
    });
    return e;
  }
  getSpecialCardCollectCount() {
    var e = 0;
    this.data.info[2].list.forEach(function (t) {
      e += 1 == t.lock ? 0 : 1;
    });
    return e;
  }
  getSelectBgSkinIndex() {
    return this.data.info[0].list.find(function (e) {
      return 1 == e.favorite;
    }).id;
  }
  getSelectCardSkinIndex() {
    return this.data.info[1].list.find(function (e) {
      return 1 == e.favorite;
    }).id;
  }
  getSelectSpecialCardSkinIndex() {
    return this.data.info[2].list.find(function (e) {
      return 1 == e.favorite;
    }).id;
  }
  setCurTabIndex(e) {
    if (this.curTabIndex != e) {
      this.curTabIndex = e;
      this.initTabUI();
      this.page1.active = 0 == e;
      this.page2.active = 1 == e;
      this.page3.active = 2 == e;
      this.page1ScrollView.scrollToTop();
      this.page2ScrollView.scrollToTop();
      this.page3ScrollView.scrollToTop();
    }
  }
  onTabClick(e) {
    AudioManager.getInstance().playMusic("click");
    var t = Number(e.target.name);
    t != this.curTabIndex && this.setCurTabIndex(t);
  }
  onPage1ItemClick(e) {
    AudioManager.getInstance().playMusic("click");
    console.log("onPage1ItemClick", e.target.name, gameData.gameSkinData.cardSkin);
    var t = Number(e.target.name),
      o = this.data.info[0].list[t - 1];
    if (1 != o.lock) {
      if (t != gameData.gameSkinData.cardSkin) {
        gameData.gameSkinData.cardSkin = t;
        this.data.info[0].list.forEach(function (e, o) {
          e.favorite = o == t ? 1 : 0;
        });
        this.initPage1();
      } else EngineUtil.showCocosToast2(`gkey_538`);
    } else EngineUtil.showCocosToast2(`{"gkey_539":{"v1":"${(o.level_count_limit - o.current_level_count)}"}}`);
  }
  onPage2ItemClick(e) {
    AudioManager.getInstance().playMusic("click");
    console.log("onPage2ItemClick", e.target.name, gameData.gameSkinData.bgSkin);
    var t = Number(e.target.name),
      o = this.data.info[1].list[t - 1];
    if (1 != o.lock) {
      if (t != gameData.gameSkinData.bgSkin) {
        gameData.gameSkinData.bgSkin = t;
        this.data.info[1].list.forEach(function (e, o) {
          e.favorite = o == t ? 1 : 0;
        });
        this.initPage2();
      } else EngineUtil.showCocosToast2(`gkey_538`);
    } else EngineUtil.showCocosToast2(`{"gkey_539":{"v1":"${(o.level_count_limit - o.current_level_count)}"}}`);
  }
  onPage3ItemClick(e) {
    AudioManager.getInstance().playMusic("click");
    console.log("onPage3ItemClick", e.target.name, gameData.gameSkinData.specialCardSkin);
    var t = Number(e.target.name),
      o = this.data.info[2].list[t - 1];
    if (1 != o.lock) {
      if (t != gameData.gameSkinData.specialCardSkin) {
        gameData.gameSkinData.specialCardSkin = t;
        this.data.info[2].list.forEach(function (e, o) {
          e.favorite = o == t ? 1 : 0;
        });
        this.initPage3();
      } else EngineUtil.showCocosToast2(`gkey_538`);
    } else EngineUtil.showCocosToast2(`{"gkey_539":{"v1":"${(o.level_count_limit - o.current_level_count)}"}}`);
  }
  close() {
    GameSystem.syncTujianData({
      select_data: {
        1: "" + (gameData.gameSkinData.cardSkin == CardSkinType.CardSkin4 ? 28 : gameData.gameSkinData.cardSkin),
        2: "" + (gameData.gameSkinData.bgSkin + 3),
        3: "" + (gameData.gameSkinData.specialCardSkin + 7)
      }
    });
    EventMgr.trigger(GameEventType.UPDATE_GAME_SKIN_DATA);
    this._hide();
  }
  allBtn() {
    var e,
      t = this.data.extract_info;
    this.data.extract_info = t;
    e = t.collection_count == t.collection_count_limit ? `{"gkey_540":{"v1":"${t.user_grade_limit}"}}` : `{"gkey_541":{"v1":"${(t.collection_count_limit - t.collection_count)}"}}`;
    EngineUtil.showCocosToast2(e);
  }
}