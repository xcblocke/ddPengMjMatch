import AudioManager from './framework/controller/AudioManager';
import { FailedType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import TimeUtils from './framework/Utils/TimeUtils';
import { gameData } from './data/GameData';
import PageMgr from './view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class countDown extends cc.Component {
  @property(cc.Node)
  countTimeNode: cc.Node = null;
  _pasuse = false;
  gameCountDownTime = 0;
  get pause() {
    return this._pasuse;
  }
  onLoad() {
    this.addEvents();
  }
  addEvents() {
    EventMgr.listen(GameEventType.START_COUNT_DOWN, this.startCountDown, this);
    EventMgr.listen(GameEventType.PAUSE_COUNT_DOWN, this.pauseCountDown, this);
    EventMgr.listen(GameEventType.RESUME_COUNT_DOWN, this.resumeCountDown, this);
    EventMgr.listen(GameEventType.END_COUNT_DOWN, this.endCountDown, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.START_COUNT_DOWN, this.startCountDown, this);
    EventMgr.ignore(GameEventType.PAUSE_COUNT_DOWN, this.pauseCountDown, this);
    EventMgr.ignore(GameEventType.RESUME_COUNT_DOWN, this.resumeCountDown, this);
    EventMgr.ignore(GameEventType.END_COUNT_DOWN, this.endCountDown, this);
  }
  showCountTimeNode(e) {
    if (1 != gameData.gameLevel) {
      this.countTimeNode.active = true;
      this.gameCountDownTime = e;
      this.countTimeNode.getChildByName("time").getComponent(cc.Label).string = TimeUtils.msToHMS(1000 * this.gameCountDownTime, ":", false).toString();
    }
  }
  startCountDown() {
    this._pasuse = false;
    if (!gameData.isUseFreeze) {
      var e = this.countTimeNode.getChildByName("time");
      e.color = cc.Color.WHITE;
      e.getComponent(cc.Label).string = TimeUtils.msToHMS(1000 * this.gameCountDownTime, ":", false).toString();
      this.schedule(this.updateCountTimeNode, 1);
    }
  }
  update() {
    if (PageMgr.isHasShowPage()) {
      this.pauseCountDown();
    } else {
      this.resumeCountDown();
    }
  }
  updateCountTimeNode() {
    this.gameCountDownTime--;
    gameData.xc_count_wait_time++;
    var e = this.countTimeNode.getChildByName("time");
    e.getComponent(cc.Label).string = TimeUtils.msToHMS(1000 * this.gameCountDownTime, ":", false).toString();
    if (10 == this.gameCountDownTime) {
      e.color = cc.Color.RED;
      AudioManager.getInstance().playAudioQueue(["clock", "TimeOut"]);
    }
    this.gameCountDownTime <= 1 && (gameData.globalCanClick = false);
    if (this.gameCountDownTime <= 0) {
      this.unschedule(this.updateCountTimeNode);
      this.countTimeNode.active = false;
      EventMgr.trigger(GameEventType.GAME_OVER, {
        type: FailedType.TIME_OUT
      });
    }
  }
  pauseCountDown() {
    this._pasuse = true;
    this.unschedule(this.updateCountTimeNode);
  }
  resumeCountDown() {
    if (!gameData.isUseFreeze) {
      if (gameData.countdownTime > 0 && this._pasuse) {
        this.unschedule(this.updateCountTimeNode);
        this.schedule(this.updateCountTimeNode, 1);
      }
      this._pasuse = false;
    }
  }
  endCountDown() {
    this.unschedule(this.updateCountTimeNode);
  }
}