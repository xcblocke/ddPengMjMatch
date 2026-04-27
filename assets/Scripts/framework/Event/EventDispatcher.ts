import EventHandler from '../../EventHandler';
export default class EventDispatcher {
  _events = null;
  hasListener(e) {
    return !(!this._events || !this._events[e]);
  }
  event(e, t = null) {
    if (!this._events || !this._events[e]) return false;
    var o = this._events[e];
    if (o.run) {
      o.once && delete this._events[e];
      o.check(this, e) && (null != t ? o.runWith(t) : o.run());
    } else {
      for (var n = 0, a = o.length; n < a; n++) {
        var i = o[n];
        i && i.check(this, e) && (null != t ? i.runWith(t) : i.run());
        if (!i || i.once) {
          o.splice(n, 1);
          n--;
          a--;
        }
      }
      0 === o.length && this._events && delete this._events[e];
    }
    return true;
  }
  on(e, t, o, n = null) {
    return this._createListener(e, t, o, n, false);
  }
  once(e, t, o, n = null) {
    return this._createListener(e, t, o, n, true);
  }
  _createListener(e, t, o, a, i, r = true) {
    r && this.off(e, t, o, i);
    var c = EventHandler.create(t || this, o, a, i);
    c.register(this, e);
    this._events || (this._events = {});
    var s = this._events;
    if (s[e]) {
      if (s[e].run) {
        s[e] = [s[e], c];
      } else {
        s[e].push(c);
      }
    } else {
      s[e] = c;
    }
    return this;
  }
  off(e, t, o, n = false) {
    if (!this._events || !this._events[e]) return this;
    var a = this._events[e];
    if (null != a) if (a.run) {
      if ((!t || a.caller === t) && (null == o || a.method === o) && (!n || a.once)) {
        delete this._events[e];
        a.recover();
      }
    } else {
      for (var i = 0, r = a.length, c = 0; c < r; c++) {
        var s = a[c];
        if (s) {
          if (s && (!t || s.caller === t) && (null == o || s.method === o) && (!n || s.once)) {
            i++;
            a[c] = "NULL";
            s.recover();
          }
        } else {
          a[c] = "NULL";
          i++;
        }
      }
      if (i === r) delete this._events[e];else if (i > 0) {
        for (var l = 0, u = 0; u < r; ++u) {
          var p = a[u];
          if (null == p) {
            a.splice(u);
            break;
          }
          if ("NULL" == p) a[u] = null;else {
            if (u != l) {
              a[l] = p;
              a[u] = null;
            }
            ++l;
          }
        }
        a.length = r - i;
      }
    }
    return this;
  }
  offAll(e = null) {
    var t = this._events;
    if (!t) return this;
    if (e) {
      this._recoverHandlers(t[e]);
      delete t[e];
    } else {
      for (var o in t) this._recoverHandlers(t[o]);
      this._events = null;
    }
    return this;
  }
  offAllCaller(e) {
    if (e && this._events) for (var t in this._events) this.off(t, e, null);
    return this;
  }
  _recoverHandlers(e) {
    if (e) if (e.run) e.recover();else for (var t = e.length - 1; t > -1; t--) if (e[t]) {
      e[t].recover();
      e[t] = null;
    }
  }
}