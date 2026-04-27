var n = {};
var a = {};
class i {
  _pathList = null;
  static _instance = null;
  static get Instance() {
    null == i._instance && (i._instance = new i());
    return i._instance;
  }
  addPath(e) {
    this._pathList = this._pathList || {};
    Array.isArray(e) || (e = [e]);
    for (var t = 0; t < e.length; t++) {
      var o = cc.path.basename(e[t]);
      this._pathList[o] = this._pathList[o] || e[t];
    }
    cc.log(this._pathList);
  }
  initPool(e, t = 1, o = "") {
    o || (o = e.name);
    if (!this.hasPool(o)) {
      if (n[o]) for (var i = 0, r = n[o]; i < r.length; i++) {
        var c = r[i];
        this.destroyNode(c);
      }
      n[o] = [];
      a[o] = e;
      for (var s = 0; s < t; s++) {
        var l = cc.instantiate(e);
        l.active = false;
        n[o].push(l);
      }
    }
  }
  hasPool(e) {
    return a[e] && a[e].isValid;
  }
  putNode(e, t) {
    if (cc.isValid(t)) {
      var o = n[e];
      if (o) {
        if (o.findIndex(function (e) {
          return e == t;
        }) >= 0) {
          cc.error("putNode");
          t.active = false;
          t.opacity = 0;
        } else {
          t.stopAllActions();
          t.x = 0;
          t.y = 0;
          t.scale = 1;
          t.active = false;
          t.opacity = 0;
          t.removeFromParent(true);
          o.push(t);
        }
      } else console.error("putNode: pool %s not found", e);
    } else console.error("putNode: node param is invalid");
  }
  getNode(e) {
    var t = n[e];
    if (!t) {
      console.error("getNode: pool %s not found", e);
      return null;
    }
    var o = t.length > 0 ? t.pop() : cc.instantiate(a[e]);
    (o = cc.isValid(o) ? o : cc.instantiate(a[e])).active = true;
    o.stopAllActions();
    o.opacity = 0;
    return o;
  }
  reset() {
    if (n) {
      var e = n;
      for (var t in e) for (var o = e[t]; o.length > 0;) this.destroyNode(o.pop());
      n = {};
      a = {};
    }
  }
  getPool() {
    return n;
  }
  destroyNode(e) {
    if (cc.isValid(e)) {
      e.removeFromParent(false);
      e.destroy();
    } else console.error("Tools: destroyNode error, param is invalid");
  }
}
export default i.Instance;