import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
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
    this.unschedule(this.updateCountTimeNode);
    this.countTimeNode.active = false;
    this.gameCountDownTime = e;
  }
  startCountDown() {
    this._pasuse = false;
    this.unschedule(this.updateCountTimeNode);
    gameData.globalCanClick = true;
  }
  update() {
    if (PageMgr.isHasShowPage()) {
      this.pauseCountDown();
    } else {
      this.resumeCountDown();
    }
  }
  updateCountTimeNode() {
    gameData.xc_count_wait_time++;
  }
  pauseCountDown() {
    this._pasuse = true;
    this.unschedule(this.updateCountTimeNode);
  }
  resumeCountDown() {
    this._pasuse = false;
    gameData.globalCanClick = true;
  }
  endCountDown() {
    this.unschedule(this.updateCountTimeNode);
  }
}