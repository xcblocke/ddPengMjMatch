export default class Handler {
  once = false;
  _id = 0;
  caller = null;
  method = null;
  args = null;
  constructor(e = null, t = null, o = null, n = false) {
    this.setTo(e, t, o, n);
  }
  static create(t, o, n = null, a = true) {
    return Handler._pool.length ? Handler._pool.pop().setTo(t, o, n, a) : new Handler(t, o, n, a);
  }
  setTo(t, o, n, a = false) {
    this._id = Handler._gid++;
    this.caller = t;
    this.method = o;
    this.args = n;
    this.once = a;
    return this;
  }
  run() {
    if (null == this.method) return null;
    if (!this.caller || cc.isValid(this.caller)) {
      var e = this._id,
        t = this.method.apply(this.caller, this.args);
      this._id === e && this.once && this.recover();
      return t;
    }
    this.recover();
  }
  runWith(e) {
    if (null == this.method) return null;
    if (!this.caller || cc.isValid(this.caller)) {
      var t = this._id;
      if (null == e) var o = this.method.apply(this.caller, this.args);else o = this.args || e.unshift ? this.args ? this.method.apply(this.caller, this.args.concat(e)) : this.method.apply(this.caller, e) : this.method.call(this.caller, e);
      this._id === t && this.once && this.recover();
      return o;
    }
    this.recover();
  }
  clear() {
    this.caller = null;
    this.method = null;
    this.args = null;
    return this;
  }
  recover() {
    if (this._id > 0) {
      this._id = 0;
      Handler._pool.push(this.clear());
    }
  }
}
Handler._pool = [];
Handler._gid = 1;