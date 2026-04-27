import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { gameData } from './data/GameData';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdSuccPage2 extends BasePage {
  @property(cc.Label)
  amount: cc.Label = null;
  @property(cc.Label)
  userName: cc.Label = null;
  @property(cc.Node)
  head: cc.Node = null;
  guide_cb = null;
  resData = null;
  gameSucc = false;
  _init(t) {
    var o = t.amount,
      n = t.gameSucc,
      a = t.cb,
      i = t.resData;
    console.log("======== init wd success page", a);
    this.gameSucc = n || false;
    this.resData = i;
    this.guide_cb = a || null;
    this.amount.string = o < 1 ? "" + o : PlayerDataSys.getCNCashNum(o);
    this.userName.string = EngineUtil.nameFormat(PlayerDataSys.nickname);
    PlayerDataSys.headimgurl && EngineUtil.loaderHead(PlayerDataSys.headimgurl, this.head);
    AudioManager.getInstance().playMusic("wd_succ");
    AudioManager.getInstance().playMusic("yanhua");
    super._init.call(this, t);
  }
  clickClose() {
    AudioManager.getInstance().stopEffect("yanhua");
    console.log("========", null == this.guide_cb);
    this.guide_cb && this.guide_cb();
    EventMgr.trigger(GameEventType.REFRESH_MYBALANCE);
    PlayerDataSys.guideStep;
    this._hide();
  }
  showRewardList() {
    gameData.isOpenDemo && EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "rewardListPage",
      data: {
        amount: 1
      }
    });
    this.clickClose();
  }
}