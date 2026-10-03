import PlayerDataSys from '../framework/controller/PlayerDataSys';
import EngineUtil from '../framework/EngineUtil';
import { gameConfig } from '../data/GameConfig';
import { gameData } from '../data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class levelItem extends cc.Component {
  @property(cc.Node)
  levelNode: cc.Node = null;
  @property(cc.Label)
  level_num: cc.Label = null;
  @property(cc.Node)
  lock_node: cc.Node = null;
  @property(cc.Node)
  unlock_node: cc.Node = null;
  @property(cc.Node)
  current_node: cc.Node = null;
  @property(cc.Node)
  last_node: cc.Node = null;


  @property(cc.Node)
  balance_bubble_node: cc.Node = null;
  @property(cc.Node)
  login_bubble_node: cc.Node = null;
  @property(cc.Node)
  red_bubble_node: cc.Node = null;
  @property(cc.Label)
  red_num: cc.Label = null;
  @property(cc.Node)
  round_node: cc.Node = null;
  @property(cc.Label)
  signNum: cc.Label = null;
  @property(cc.Node)
  green_arrow: cc.Node = null;
  @property(cc.Node)
  gray_arrow: cc.Node = null;
  @property(cc.Label)
  round_label: cc.Label = null;
  @property(cc.Node)
  jindu: cc.Node = null;
  current_num = 0;
  is_last = false;
  init(e) {
    var t = e.num,
      o = e.is_last,
      n = void 0 !== o && o;
    this.is_last = n;
    this.current_num = t;
    this.level_num.string = "" + t;
    this.updateInfo();
  }
  updateInfo() {
    var e = this,
      t = EngineUtil.findIndex(gameConfig.redBagLevel, this.current_num);
    if (t >= 0 && gameData.gameLevel <= gameConfig.redBagLevel[t]) {
      this.red_bubble_node.active = true;
      this.red_num.string = "" + gameData.red_bag_value[t];
    } else this.red_bubble_node.active = false;
    if (4 == this.current_num) {
      this.login_bubble_node.active = true;
      this.signNum.string = "" + PlayerDataSys.level_3_show_gold_reward;
    } else this.login_bubble_node.active = false;
    if (gameConfig.coinExtractLevel.includes(this.current_num)) {
      this.balance_bubble_node.active = true;
    } else {
      this.balance_bubble_node.active = false;
    }
    3 == this.current_num && (this.balance_bubble_node.active = true);
    if (this.current_num == gameData.gameLevel) {
      if (gameData.turnMax > 1) {
        if (gameData.roundMax > 1) {
          if (gameData.setMax > 1) {
            if (1 == gameData.setId) {
              this.round_node.active = true;
              this.round_label.string = `{"gkey_468":{"v1":"${gameData.turnId}","v2":"${gameData.turnMax}","v3":"${gameData.roundId}","v4":"${gameData.roundMax}"}}`;
            } else {
              this.round_node.active = true;
              this.round_label.string = `{"gkey_469":{"v1":"${gameData.turnId}","v2":"${gameData.turnMax}","v3":"${gameData.roundId}","v4":"${gameData.roundMax}","v5":"${gameData.setId}","v6":"${gameData.setMax}"}}`;
            }
          } else if (1 == gameData.roundId) {
            this.round_node.active = true;
            this.round_label.string = `{"gkey_470":{"v1":"${gameData.turnId}","v2":"${gameData.turnMax}"}}`;
          } else {
            this.round_node.active = true;
            this.round_label.string = `{"gkey_468":{"v1":"${gameData.turnId}","v2":"${gameData.turnMax}","v3":"${gameData.roundId}","v4":"${gameData.roundMax}"}}`;
          }
        } else if (1 == gameData.turnId) this.round_node.active = false;else {
          this.round_node.active = true;
          this.round_label.string = `{"gkey_470":{"v1":"${gameData.turnId}","v2":"${gameData.turnMax}"}}`;
        }
      } else if (gameData.roundMax > 1) {
        if (1 == gameData.roundId) this.round_node.active = false;else {
          this.round_node.active = true;
          this.round_label.string = `{"gkey_325":{"v1":"${gameData.roundId}","v2":"${gameData.roundMax}"}}`;
        }
      } else this.round_node.active = false;
    } else this.round_node.active = false;
    if (this.round_node.active) {
      this.scheduleOnce(function () {
        e.round_node.width = e.round_label.node.width + 20;
      });
      this.round_node.parent.getComponent(cc.Layout).paddingTop = -10;
    } else this.round_node.parent.getComponent(cc.Layout).paddingTop = 0;
    this.levelNode.active = true;
    if (this.is_last) {
      this.jindu.active = false;
      this.last_node.active = true;
      this.current_node.active = false;
      this.lock_node.active = false;
      this.unlock_node.active = false;
      this.green_arrow.active = false;
      this.gray_arrow.active = false;
      this.balance_bubble_node.children[0].getComponent(cc.Label).string = `gkey_471`;
    } else {
      this.balance_bubble_node.children[0].getComponent(cc.Label).string = `gkey_003`;
      this.last_node.active = false;
      this.jindu.active = false;
      console.log("gameData.gameLevel", gameData.gameLevel);
      if (gameData.gameLevel < this.current_num) {
        this.level_num.node.active = true;
        this.level_num.node.getComponent(cc.LabelOutline).color = EngineUtil.getColor("#494949");
        this.lock_node.active = true;
        this.unlock_node.active = false;
        this.current_node.active = false;
        this.green_arrow.active = false;
        this.gray_arrow.active = true;
      } else if (gameData.gameLevel == this.current_num) {
        this.level_num.node.active = true;
        this.level_num.node.getComponent(cc.LabelOutline).color = EngineUtil.getColor("#875300");
        this.lock_node.active = false;
        this.unlock_node.active = false;
        this.current_node.active = true;
        this.green_arrow.active = true;
        this.gray_arrow.active = false;
      } else if (gameData.gameLevel > this.current_num) {
        this.level_num.node.active = false;
        this.levelNode.active = false;
        this.jindu.active = true;
        this.lock_node.active = false;
        this.unlock_node.active = true;
        this.current_node.active = false;
        this.green_arrow.active = false;
        this.gray_arrow.active = true;
        this.balance_bubble_node.active = false;
        this.login_bubble_node.active = false;
      }
    }
    this.green_arrow.active = false;
    this.gray_arrow.active = false;
  }
}