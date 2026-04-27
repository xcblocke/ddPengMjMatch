const {
  ccclass,
  property
} = cc._decorator;
export var setSpriteFrame = function (e, t) {
  cc.resources.load(t, cc.SpriteFrame, function (t, o) {
    t || (e.getComponent(cc.Sprite).spriteFrame = o);
  });
};
export var getRandomElements = function (e, t) {
  for (var o, n, a = [], i = 0; i < t && i < e.length;) {
    var r = Math.floor(Math.random() * (e.length - i));
    a.push(e[r]);
    o = [e[e.length - 1 - i], e[r]], e[r] = o[0], e[e.length - 1 - i] = o[1];
    i++;
  }
  for (var c = t - i, s = 0; s < c; s++) {
    r = Math.floor(Math.random() * (e.length - s));
    a.push(e[r]);
    n = [e[e.length - 1 - s], e[r]], e[r] = n[0], e[e.length - 1 - s] = n[1];
  }
  return a;
};
export var shuffleArr = function (e) {
  for (var t, o = e.length, n = 0; n < o; n++) {
    var a = Math.floor(Math.random() * (e.length - n));
    t = [e[e.length - 1 - n], e[a]], e[a] = t[0], e[e.length - 1 - n] = t[1];
  }
};
export var randomPosOutScreen = function (e) {
  var t = new cc.Vec2(0, 0),
    o = Math.floor(101 * Math.random()) - 50;
  if (e.x > 147) {
    t.x = e.x + 360;
  } else {
    t.x = e.x - 360;
  }
  t.y = e.y + o;
  return t;
};
export var randomPosOutScreen2 = function (e) {
  var t = new cc.Vec2(0, 0);
  t.x = e.x - 720;
  t.y = e.y;
  return t;
};
export var uuid = function (e = 16, t = 16) {
  var o,
    n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
    a = [];
  t = t || n.length;
  if (e) for (o = 0; o < e; o++) a[o] = n[0 | Math.random() * t];else {
    var i;
    a[8] = a[13] = a[18] = a[23] = "-";
    a[14] = "4";
    for (o = 0; o < 36; o++) if (!a[o]) {
      i = 0 | 16 * Math.random();
      a[o] = n[19 == o ? 3 & i | 8 : i];
    }
  }
  return a.join("");
};
export var isIntersect = function (e, t) {
  return doRectanglesIntersect({
    x: e.pos.x,
    y: e.pos.y
  }, {
    x: e.pos.x + t.width,
    y: e.pos.y - t.height
  }, {
    x: t.pos.x,
    y: t.pos.y
  }, {
    x: t.pos.x + t.width,
    y: t.pos.y - t.height
  });
};
var a = Math.max;
var i = Math.min;
Math.abs;
export var doRectanglesIntersect = function (e, t, o, n) {
  return !(a(e.x, t.x) <= i(o.x, n.x) || i(e.x, t.x) >= a(o.x, n.x) || a(e.y, t.y) <= i(o.y, n.y) || i(e.y, t.y) >= a(o.y, n.y));
};