import { gameData } from './data/GameData';
import EventMgr from './framework/Event/EventMgr';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import AudioManager from './framework/controller/AudioManager';
import SdkHelper from './framework/SdkHelper';
import { gameConfig } from './data/GameConfig';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class LevelStart extends cc.Component {
  @property(cc.Node)
  csah_hf: cc.Node = null;
  @property(cc.Node)
  red_hf: cc.Node = null;
  @property(cc.Node)
  year_hf: cc.Node = null;
  @property(cc.Node)
  csah_tgbg: cc.Node = null;


  @property(cc.Node)
  coin_text2: cc.Node = null;
  @property(cc.RichText)
  coin_text2_hf: cc.RichText = null;
  @property(cc.RichText)
  cointext3_hf: cc.RichText = null;
  @property(cc.Node)
  coin_text3: cc.Node = null;


  @property(cc.Node)
  red_node1: cc.Node = null;
  @property(cc.Node)
  red_node2: cc.Node = null;
  @property(cc.Node)
  red_node3: cc.Node = null;
  @property(cc.Label)
  red2_tgbg: cc.Label = null;
  @property(cc.Label)
  red2_ratio1: cc.Label = null;
  @property(cc.Label)
  red2_ratio2: cc.Label = null;
  @property(cc.Label)
  red_text3: cc.Label = null;
  game_level = 0;
  init(e) {
    var t = this,
      o = e.cb || null;
    this.game_level = gameData.gameLevel;
    // 只保留一次开场横幅动画
    this.csah_hf.active = true;
    this.csah_tgbg.active = true;
    this.coin_text2.active = false;
    this.coin_text3.active = false;
    this.year_hf.active = false;
    this.red_hf.active = false;
    this.red_node1.active = false;
    this.red_node2.active = false;
    this.red_node3.active = false;
    this.csah_tgbg.getComponent(cc.Label).string = `{"gkey_230":{"v1":"${this.game_level}"}}`;
    this.csah_hf.stopAllActions();
    this.csah_hf.x = -500;
    this.csah_hf.opacity = 0;
    cc.tween(this.csah_hf).delay(0.4).to(0.2, {
      x: 0,
      opacity: 255
    }).delay(1.2).to(0.2, {
      x: 500,
      opacity: 0
    }).call(function () {
      t.csah_hf.active = false;
      t.csah_tgbg.active = false;
      t.node.active = false;
      o && o();
    }).start();
  }
  onDestroy() {
    this.unscheduleAllCallbacks();
    EventMgr.ignoreAllByCaller(this);
  }
  showCoinOne(e, t = "") {
    var o = this;
    if (gameData.gameLevel > 85) {
      this.node.active = false;
      e && e();
    } else {
      var n = Math.floor(this.game_level / 5) + 2,
        a = gameConfig.coinExtractLevel[n],
        i = gameConfig.exchangePercent3[n];
      this.csah_hf.active = true;
      this.coin_text2.active = true;
      this.csah_hf.opacity = 0;
      this.csah_hf.x = -500;
      this.csah_hf.stopAllActions();
     
      cc.tween(this.csah_hf).delay(0.7).to(0.2, {
        x: 0,
        opacity: 255
      }).delay(2.5).to(0.2, {
        x: 500,
        opacity: 0
      }).call(function () {
        o.csah_hf.active = false;
        o.coin_text2.active = false;
        if ("" != t) {
          if ("showGoldOne" == t && 3 == gameData.gameLevel) o.showGoldOne(e);else if ("showGoldTwo" == t) o.showGoldTwo(e);else if ("showGoldThree" == t) o.showGoldThree(e);else {
            o.node.active = false;
            e && e();
          }
        } else {
          o.node.active = false;
          e && e();
        }
      }).start();
    }
  }
  showCoinTwo(e, t = "") {
    var o = this;
    var n = EngineUtil.findIndex(gameConfig.coinExtractLevel, this.game_level),
      a = gameConfig.exchangePercent3[n];
    this.csah_hf.stopAllActions();
    this.csah_hf.active = true;
    this.coin_text3.active = true;
    this.csah_hf.opacity = 0;
    this.csah_hf.x = -500;
    if (1 == gameData.gameLevel) {
      this.coin_text3.active = false;
      this.csah_tgbg.active = true;
    } 
    cc.tween(this.csah_hf).delay(0.5).to(0.2, {
      x: 0,
      opacity: 255
    }).delay(2).to(0.2, {
      x: 500,
      opacity: 0
    }).call(function () {
      o.csah_hf.active = false;
      o.coin_text3.active = false;
      if ("" != t) {
        if ("showGoldOne" == t && 3 == gameData.gameLevel) o.showGoldOne(e);else if ("showGoldTwo" == t) o.showGoldTwo(e);else if ("showGoldThree" == t) o.showGoldThree(e);else {
          o.node.active = false;
          e && e();
        }
      } else {
        o.node.active = false;
        e && e();
      }
    }).start();
  }
  showGoldOne(e, t = "") {
    var o = this;
    if (PlayerDataSys.isOppoReviewer()) {
      this.node.active = false;
      e && e();
    } else {
      this.year_hf.stopAllActions();
      this.year_hf.active = true;
      this.year_hf.opacity = 0;
      this.year_hf.x = -500;
      cc.tween(this.year_hf).delay(0.5).to(0.2, {
        x: 0,
        opacity: 255
      }).delay(2.3).to(0.2, {
        x: 500,
        opacity: 0
      }).call(function () {
        o.year_hf.active = false;
        if ("" != t) {
          if ("showGoldTwo" == t) {
            o.showGoldTwo(e);
          } else {
            "showGoldThree" == t && o.showGoldThree(e);
          }
        } else {
          o.node.active = false;
          e && e();
        }
      }).start();
    }
  }
  showGoldTwo(e, t = "") {
    var o = this;
    this.red_hf.stopAllActions();
    this.red_hf.active = true;
    this.red_node2.active = true;
    this.red_hf.opacity = 0;
    this.red_hf.x = -500;
    var n = gameData.lun_level,
      a = EngineUtil.findIndex(gameConfig.goldExtractLevel, n),
      i = gameConfig.gold_extract_title[a - 1],
      c = gameConfig.gold_extract_title[a];
    this.red2_ratio1.string = "" + i;
    this.red2_ratio2.string = "" + c;
  
    cc.tween(this.red_hf).delay(0.5).to(0.2, {
      x: 0,
      opacity: 255
    }).delay(2.2).to(0.2, {
      x: 500,
      opacity: 0
    }).call(function () {
      o.red_hf.active = false;
      o.red_node2.active = false;
      if ("" != t) "showGoldThree" == t && o.showGoldThree(e);else {
        o.node.active = false;
        e && e();
      }
    }).start();
  }
  showGoldThree(e, t = "") {
    var o = this;
    this.red_hf.stopAllActions();
    this.red_hf.active = true;
    this.red_node3.active = true;
    this.red_hf.opacity = 0;
    this.red_hf.x = -500;
    var n = EngineUtil.findIndex(gameConfig.redBagLevel, this.game_level),
      a = [PlayerDataSys.level_3_show_gold_reward, 888];
    this.red_text3.string = a[n] + "";
    if (gameData.gameLevel <= 5)  {

    }
    else if (8 == gameData.gameLevel) {
      this.red_text3.string = "888";
    }
    4 == gameData.gameLevel && (this.red_text3.string = "1000");
    cc.tween(this.red_hf).delay(0.5).to(0.2, {
      x: 0,
      opacity: 255
    }).delay(2.5).to(0.2, {
      x: 500,
      opacity: 0
    }).call(function () {
      o.red_hf.active = false;
      o.red_node3.active = false;
      o.node.active = false;
      e && e();
    }).start();
  }
}
