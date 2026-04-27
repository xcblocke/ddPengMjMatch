import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class mainBtnGroupCtrl extends cc.Component {
  @property({
    type: cc.Node,
    displayName: "图鉴按钮"
  })
  tujianBtn: cc.Node = null;
  @property({
    type: cc.Node,
    displayName: "抽奖按钮"
  })
  lotteryBtn: cc.Node = null;
  @property({
    type: cc.Node,
    displayName: "签到按钮"
  })
  signInBtn: cc.Node = null;
  onLoad() {
    if (gameData.isOpenDemo) this.node.active = false;else {
      this.updateBtnState();
      EventMgr.listen(GameEventType.UPDATE_WHEEL_BUBBLE, this.updateWheelBubble, this);
      EventMgr.listen(GameEventType.UPDATE_MAIN_BTN_STATE, this.updateBtnState, this);
    }
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.UPDATE_MAIN_BTN_STATE, this.updateBtnState, this);
  }
  updateBtnState() {
    this.signInBtn.active = gameData.lun_level >= 5;
    this.lotteryBtn.active = gameData.lun_level >= 4;
    this.tujianBtn.active = gameData.lun_level >= 6;
    this.updateWheelBubble();
  }
  showTujianBtn() {
    this.tujianBtn.scale = 0;
    this.tujianBtn.active = true;
    cc.tween(this.tujianBtn).to(0.2, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
  }
  showLotteryBtn() {
    this.lotteryBtn.scale = 0;
    this.lotteryBtn.active = true;
    cc.tween(this.lotteryBtn).to(0.2, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
  }
  showSignBtn() {
    this.signInBtn.active = true;
    this.signInBtn.scale = 0;
    cc.tween(this.signInBtn).to(0.2, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
  }
  updateWheelBubble() {
    var e = this.lotteryBtn.getChildByPath("redRect");
    e.active = gameData.lucky_count > 0;
    e.active && e.getComponent(cc.Animation).play();
  }
}