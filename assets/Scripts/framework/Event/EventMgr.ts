import EventDispatcher from './EventDispatcher';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class EventMgr {
  static dispatcher = new EventDispatcher();
  static listen(e, t, o, n) {
    this.dispatcher.off(e, o, t);
    this.dispatcher.on(e, o, t, n);
  }
  static ignore(e, t, o) {
    this.dispatcher.off(e, o, t, false);
  }
  static ignoreAllByEvent(e) {
    this.dispatcher.offAll(e);
  }
  static ignoreAllByCaller(e) {
    this.dispatcher.offAllCaller(e);
  }
  static trigger(e, t) {
    this.dispatcher.event(e, t);
  }
}