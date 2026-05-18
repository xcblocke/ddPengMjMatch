export default class RandomUtil {
  seed = new Date().getTime();
  static seed = new Date().getTime();
  get value() {
    return this.range(0, 1);
  }
  get insideUnitCircle() {
    var e = this.range(0, 360),
      t = this.range(1, 0);
    return {
      x: t * Math.cos(e * Math.PI / 180),
      y: t * Math.sin(e * Math.PI / 180)
    };
  }
  get onUnitCircle() {
    var e = this.range(0, 360);
    return {
      x: Math.cos(e * Math.PI / 180),
      y: Math.sin(e * Math.PI / 180)
    };
  }
  static get value() {
    return this.range(1, 0);
  }
  static get insideUnitCircle() {
    var e = this.range(0, 360),
      t = this.range();
    return {
      x: t * Math.cos(e * Math.PI / 180),
      y: t * Math.sin(e * Math.PI / 180)
    };
  }
  static get onUnitCircle() {
    var e = this.range(0, 360);
    return {
      x: Math.cos(e * Math.PI / 180),
      y: Math.sin(e * Math.PI / 180)
    };
  }
  constructor(e) {
    this.seed = e;
    this.seed || 0 == this.seed || (this.seed = new Date().getTime());
  }
  static range(t = 0, a = 1) {
    RandomUtil.seed || 0 == RandomUtil.seed || (RandomUtil.seed = new Date().getTime());
    a = a || 1;
    t = t || 0;
    RandomUtil.seed = (9301 * RandomUtil.seed + 49297) % 233280;
    return t + RandomUtil.seed / 233280 * (a - t);
  }
  static rangeInt(t, a) {
    var n = a - t,
      o = RandomUtil.range(0, 1);
    return t + Math.round(o * n);
  }
  static rangeIntByArr(t) {
    return t.length < 2 ? 0 : RandomUtil.rangeInt(t[0], t[1]);
  }
  static rangeByArr(t) {
    return t.length < 2 ? 0 : RandomUtil.range(t[0], t[1]);
  }
  static rangeFromArr(t) {
    return t[RandomUtil.rangeInt(0, t.length - 1)];
  }
  static getValueByWeight(t, a) {
    for (var n = RandomUtil.range(0, 100), o = 0, i = 0; i < t.length; i++) {
      var r = a[i] + o;
      if (n <= r) return t[i];
      o = r;
    }
    return null;
  }
  static getRandomPosInRect(t) {
    var a = t.x,
      n = t.width + t.x,
      o = t.y,
      i = t.height + t.y,
      r = RandomUtil.rangeInt(n, a),
      s = RandomUtil.rangeInt(i, o);
    return cc.v3(r, s, 0);
  }
  static shuffle(e) {
    for (var t, a, n = e.length; n;) {
      a = Math.floor(Math.random() * n--);
      t = e[n];
      e[n] = e[a];
      e[a] = t;
    }
    return e;
  }
  static getRandomNum(e, t, a) {
    return a ? Math.floor(Math.random() * (t - e + 1) + e) : Math.floor(Math.random() * (t - e) + e);
  }
  static randomItem(e, t) {
    if (e.length <= t) return e;
    for (var a = this.copyList(e), n = [], o = 0; o < t; o++) {
      var i = this.randomInt(a.length),
        r = a[i];
      n.push(r);
      a.splice(i, 1);
    }
    return n;
  }
  static copyList(e) {
    for (var t = [], a = 0; a < e.length; a++) {
      var n = e[a];
      t.push(n);
    }
    return t;
  }
  static randomInt(e) {
    return Math.floor(Math.random() * e);
  }
  static uniformValue(e = 0, t = 1) {
    return e + (t - e) * this._uniform(Date.now());
  }
  static _uniform(e) {
    return (e = (9301 * e + 49297) % 233280) / 233280;
  }
  range(e, t) {
    this.seed || 0 == this.seed || (this.seed = new Date().getTime());
    t = t || 1;
    e = e || 0;
    this.seed = (9301 * this.seed + 49297) % 233280;
    return e + this.seed / 233280 * (t - e);
  }
}