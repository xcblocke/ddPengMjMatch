import { gameData } from './data/GameData';
export var playFailedAnim = function (e, t, o = null) {
  var n;
  n = [3, 3, -3, 3, 3, -3, -3, -3][t];
  var a = e.position;
  cc.tween(e).sequence(cc.tween().by(0.05, {
    position: cc.v3(-n, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(n, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(n, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(-n, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(-n / 2, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(n / 2, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(n / 2, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(-n / 2, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(-n / 3, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(n / 3, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(n / 3, 0, 0)
  }, {
    easing: "elasticIn"
  }), cc.tween().by(0.05, {
    position: cc.v3(-n / 3, 0, 0)
  }, {
    easing: "elasticIn"
  })).call(function () {
    e.position = a;
    o && o();
  }).start();
};
export var shakeAnim = function (e, t = null) {
  cc.tween(e).sequence(cc.tween().by(0.05, {
    position: cc.v3(-10, 0, 0)
  }), cc.tween().by(0.05, {
    position: cc.v3(20, 0, 0)
  }), cc.tween().by(0.05, {
    position: cc.v3(-20, 0, 0)
  }), cc.tween().by(0.05, {
    position: cc.v3(20, 0, 0)
  }), cc.tween().by(0.05, {
    position: cc.v3(-20, 0, 0)
  }), cc.tween().by(0.05, {
    position: cc.v3(10, 0, 0)
  })).call(function () {
    t && t();
  }).start();
};
export var fly2TargetNode = function (e, t, o) {
  var a = t.parent.convertToWorldSpaceAR(t.position),
    i = gameData.gameUIRoot.parent.convertToNodeSpaceAR(a);
  t.parent = gameData.gameUIRoot.parent;
  t.position = i;
  var r = e.parent.convertToWorldSpaceAR(e.position),
    c = t.parent.convertToNodeSpaceAR(r);
  c.y += 80;
  var s,
    l,
    u = t.position,
    p = cc.v2(c).sub(cc.v2(u));
  s = cc.v2(c.x - p.x / 7 * 1, c.y + 250);
  l = cc.v2(c.x - p.x / 7 * 1, c.y + 250);
  console.log(s, l, c);
  var d = [s, l, new cc.Vec2(c.x, c.y)],
    f = cc.bezierTo(0.2, d);
  cc.tween(t).parallel(cc.tween().then(f), cc.tween().to(0.2, {
    scale: 0.5
  })).call(function () {
    cc.tween(t).to(0.01, {
      position: cc.v3(70, 0, 0)
    }).call(function () {
      o && o();
    }).start();
  }).start();
};
export var fly2TargetNode2 = function (e, t, o) {
  var n = t.parent.convertToNodeSpaceAR(e.convertToWorldSpaceAR(cc.v3(0, 0, 0))),
    a = cc.v2(n).sub(cc.v2(t.position)).mag() / 500;
  t.zIndex = 9999;
  cc.tween(t).to(a, {
    position: n
  }, {
    easing: "expoIn"
  }).call(function () {
    o && o();
  }).start();
};
export var floatAnim = function (e) {
  cc.tween(e).sequence(cc.tween().by(0.3, {
    position: cc.v3(0, 5, 0)
  }), cc.tween().by(0.3, {
    position: cc.v3(0, -5, 0)
  }), cc.tween().by(0.3, {
    position: cc.v3(0, -5, 0)
  }), cc.tween().by(0.3, {
    position: cc.v3(0, 5, 0)
  })).repeatForever().start();
};
export var clearAnim = function (e, t) {
  var o,
    a = [new cc.Vec3(-45, 288, 0)],
    i = [new cc.Vec3(-90, 288, 0), new cc.Vec3(0, 288, 0)],
    r = [new cc.Vec3(-135, 288, 0), new cc.Vec3(-45, 288, 0), new cc.Vec3(45, 288, 0)];
  if (1 == e.length) {
    o = a;
  } else {
    if (2 == e.length) {
      o = i;
    } else {
      3 == e.length && (o = r);
    }
  }
  e.forEach(function (e, a) {
    e.zIndex = 9999;
    var i = e.parent.convertToWorldSpaceAR(e.position),
      r = gameData.gameUIRoot.convertToNodeSpaceAR(i);
    e.parent = gameData.gameUIRoot;
    e.position = r;
    cc.tween(e).to(0.2, {
      position: o[a]
    }).delay(0.4).call(function () {
      0 == a && t && t();
    }).start();
  });
};
export var playBubbleAnim = function (e) {
  cc.tween(e).sequence(cc.tween().to(0.1, {
    scale: 0
  }), cc.tween().delay(5), cc.tween().to(0.1, {
    scale: 1
  }), cc.tween().delay(5)).repeatForever().start();
};
export var scaleAnim = function (e, t = null) {
  var o = 0.2 * Math.random(),
    n = e.scale;
  e.stopAllActions();
  cc.tween(e).delay(o).sequence(cc.tween().to(0.2, {
    scale: n + 0.2
  }), cc.tween().to(0.2, {
    scale: n
  })).call(function () {
    t && t();
  }).start();
};
export var playArrowAnim = function (e) {
  e.stopAllActions();
  var t = e.y;
  cc.tween(e).sequence(cc.tween().to(0.2, {
    y: t - 20
  }), cc.tween().to(0.2, {
    y: t
  })).repeatForever().start();
};