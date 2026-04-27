import Handler from './Handler';
export default class EventHandler extends Handler {
  static _pool = null;
  constructor(t, o, n, a) {
    super(t, o, n, a);
  }
  static create(e, o, n = null, a = true) {
    return EventHandler._pool.length ? EventHandler._pool.pop().setTo(e, o, n, a) : new EventHandler(e, o, n, a);
  }
  recover() {
    if (this._id > 0) {
      this._id = 0;
      EventHandler._pool.push(this.clear());
    }
  }
  register(e, t) {
    this._dispatcher = e;
    this._type = t;
  }
  check(e, t) {
    return !(this._dispatcher && this._dispatcher != e || this._type && this._type != t);
  }
}
EventHandler._pool = [];