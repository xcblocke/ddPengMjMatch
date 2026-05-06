import { gameData } from './data/GameData';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class LvBoard extends cc.Component {
  @property(cc.Sprite)
  pro_in: cc.Sprite = null;
  @property(cc.Label)
  lvLabel: cc.Label = null;
  @property(cc.Node)
  icon2: cc.Node = null;
  @property([cc.SpriteFrame])
  iconArr: Array<cc.SpriteFrame> = [];
  @property(cc.Label)
  progressLb: cc.Label = null;
  @property(cc.Label)
  rewardLb: cc.Label = null;
  @property(cc.Label)
  tipLb: cc.Label = null;
  freshInfo() {
    this.tipLb.string = `{"gkey_334":{"v1":"${(gameData.totalClearNum - gameData.curClearNum) / 3}"}}`;
    this.lvLabel.string = `{"gkey_064":{"v1":"${gameData.gameLevel}"}}`;
    var e = gameData.curClearNum / gameData.totalClearNum;
    this.pro_in.fillRange = e;
    this.progressLb.string = Math.floor(100 * e) + "%";
    var t = gameData.levelupCoin;
    this.rewardLb.string = PlayerDataSys.getCoinBalanceWithUnit(t);
  }
  onLoad() {
    EventMgr.listen(GameEventType.FRESH_GAME_LEVELINFO, this.freshInfo, this);
  }
  start() {}
  onDestroy() {
    EventMgr.ignoreAllByCaller(this);
  }
  showToast() {
    var e = gameData.rewardInfo,
      t = e.reward,
      o = e.need_hc_count;
    EngineUtil.showCocosToast3(`{"gkey_334":{"v1":"${(o - gameData.curClearNum)}"}}` + PlayerDataSys.getCoinBalanceWithUnit(t));
  }
}