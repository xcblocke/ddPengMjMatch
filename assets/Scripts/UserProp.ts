import AudioManager from './framework/controller/AudioManager';
import { PropType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData } from './data/GameData';
import { gameConfig } from './data/GameConfig';
import card from './prefab/card';
import GameSystem from './system/GameSystem';
import GameMain from './GameMain';
import PlayerDataSys from './framework/controller/PlayerDataSys';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class UserProp extends cc.Component {
  rootComp = null;
  operAction = null;
  _operateTipRunning = false;
  _operateTipOverlay = null;
  onLoad() {
    this.rootComp = this.node.getComponent(GameMain);
    this.addEvents();
  }
  addEvents() {
    EventMgr.listen(GameEventType.USER_FREEZE, this.userFreeze, this);
    EventMgr.listen(GameEventType.USER_OPERATE_TIP, this.userOperateTip, this);
    EventMgr.listen(GameEventType.USER_RESHUFFLE_CARD, this.refreshProp, this);
    EventMgr.listen(GameEventType.FULL_SCREEN_CLICK, this.stopOperateTipLoop, this);
    EventMgr.listen(GameEventType.FULL_SCREEN_MOVE, this.stopOperateTipLoop, this);
    EventMgr.listen(GameEventType.TEACHING_OPERATE_TIP, this.teachingOperateTip, this);
  }
  userFreeze() {
    gameData.isUseFreeze = true;
    this.rootComp.showFreezeTip();
    this.requestUseProp(PropType.freezeCard);
  }
  userOperateTip() {
    if (Number(PlayerDataSys.tipCardCount || 0) <= 0) return;
    this.operAction = null;
    this.startOperateTipLoop();
    AudioManager.getInstance().playMusic("Prop_tip");
    this.requestUseProp(PropType.tipCard);
  }
  refreshProp(e = false) {
    var t,
      o,
      n,
      a,
      i,
      r,
      h = this;
    if (!e && Number(PlayerDataSys.reshuffleCardCount || 0) <= 0) return Promise.resolve();
    gameData.globalCanClick = false;
    EventMgr.trigger(GameEventType.UPDATE_BACK_STEP_STATE);
    AudioManager.getInstance().playMusic("Prop_stirringrod");
    e || this.requestUseProp(PropType.reshuffleCard);
    var g = this.rootComp.gridRows,
      _ = this.rootComp.gridCols;
    if (g <= 0 || _ <= 0) return Promise.resolve();
    for (var y = [], m = 0; m < g; m++) for (var v = 0; v < _; v++) (N = null !== (n = null === (o = null === (t = this.rootComp.cardGrid) || void 0 === t ? void 0 : t[m]) || void 0 === o ? void 0 : o[v]) && void 0 !== n ? n : null) && N.node && N.node.isValid && y.push(N);
    if (0 === y.length) return Promise.resolve();
    var b = [];
    for (m = 0; m < g; m++) for (v = 0; v < _; v++) b.push({
      row: m,
      col: v
    });
    for (var w = b.length - 1; w > 0; w--) {
      var S = Math.floor(Math.random() * (w + 1)),
        E = b[w];
      b[w] = b[S];
      b[S] = E;
    }
    var P = b.slice(0, y.length),
      C = null !== (i = null === (a = gameConfig.getReshuffleClusterConfig) || void 0 === a ? void 0 : a.call(gameConfig)) && void 0 !== i ? i : null;
    this.clusterShuffle(y, P, g, _, C || void 0);
    var D = this.rootComp.scaledCardWidth + this.rootComp.gapX,
      O = this.rootComp.scaledCardHeight + this.rootComp.gapY,
      T = (_ - 1) * D + this.rootComp.scaledCardWidth,
      A = (g - 1) * O + this.rootComp.scaledCardHeight,
      k = cc.v3(0.5 * T, 0.5 * -A, 0),
      R = new Map();
    for (m = 0; m < g; m++) for (v = 0; v < _; v++) (null === (r = this.rootComp.cardGrid) || void 0 === r ? void 0 : r[m]) && (this.rootComp.cardGrid[m][v] = null);
    for (w = 0; w < P.length; w++) {
      var I = P[w],
        N = y[w],
        M = I.row,
        x = I.col;
      N.cardData.x = x;
      N.cardData.y = M;
      N.row = M;
      N.col = x;
      this.rootComp.cardGrid[M][x] = N;
      R.set(N, cc.v3(x * D, -M * O, 0));
    }
    gameData.globalCanClick = false;
    return new Promise(function (e) {
      for (var t = 0, o = y.length, n = function n(n) {
          var a = n.node,
            i = R.get(n);
          if (!a || !a.isValid || !i) {
            t++;
            return "continue";
          }
          cc.Tween.stopAllByTarget(a);
          cc.tween(a).to(0.18, {
            position: k
          }, {
            easing: "quadIn"
          }).to(0.22, {
            position: i
          }, {
            easing: "quadOut"
          }).call(function () {
            var a;
            n.setZIndex();
            if (++t >= o) {
              var i = h.rootComp.mahjongContainer;
              if (i && i.isValid) for (var r = [...y].sort(function (e, t) {
                  var o,
                    n,
                    a,
                    i,
                    r,
                    c,
                    s,
                    l,
                    u = null !== (n = null === (o = null == e ? void 0 : e.cardData) || void 0 === o ? void 0 : o.y) && void 0 !== n ? n : 0,
                    p = null !== (i = null === (a = null == e ? void 0 : e.cardData) || void 0 === a ? void 0 : a.x) && void 0 !== i ? i : 0,
                    d = null !== (c = null === (r = null == t ? void 0 : t.cardData) || void 0 === r ? void 0 : r.y) && void 0 !== c ? c : 0,
                    f = null !== (l = null === (s = null == t ? void 0 : t.cardData) || void 0 === s ? void 0 : s.x) && void 0 !== l ? l : 0;
                  return u === d ? p - f : u - d;
                }), s = 0; s < r.length; s++) {
                var l = null === (a = r[s]) || void 0 === a ? void 0 : a.node;
                l && l.isValid && l.parent === i && l.setSiblingIndex(s);
              }
              gameData.globalCanClick = true;
              e();
            }
          }).start();
        }, a = 0, i = y; a < i.length; a++) n(i[a]);
    });
  }
  startOperateTipLoop() {
    if (!this._operateTipRunning) {
      this._operateTipRunning = true;
      this._operateTipOverlay || (this._operateTipOverlay = this.ensureOperateTipOverlay());
      this._operateTipOverlay.active = true;
      this._playOperateTipOnce();
    }
  }
  stopOperateTipLoop() {
    var e, t, o;
    if (this._operateTipRunning) {
      this._operateTipRunning = false;
      this.unscheduleAllCallbacks();
      if (this._operateTipOverlay) {
        this._operateTipOverlay.getChildByName("content").removeAllChildren();
        this._operateTipOverlay.active = false;
      }
      for (var n = this.rootComp.gridRows, a = this.rootComp.gridCols, i = 0; i < n; i++) for (var r = 0; r < a; r++) {
        var c = null !== (o = null === (t = null === (e = this.rootComp.cardGrid) || void 0 === e ? void 0 : e[i]) || void 0 === t ? void 0 : t[r]) && void 0 !== o ? o : null;
        c && (c.selected = false);
      }
      gameData.globalCanClick = true;
    }
  }
  _playOperateTipOnce() {
    var e,
      t = this;
    if (this._operateTipRunning) {
      var o = this._operateTipOverlay || this.ensureOperateTipOverlay();
      o.getChildByName("content").removeAllChildren();
      o.active = true;
      var n = null === (e = this.rootComp) || void 0 === e ? void 0 : e._touchCtrl;
      this.operAction || (this.operAction = n && "function" == typeof n.getOperateTipAction ? n.getOperateTipAction() : null);
      if (this.operAction) {
        console.log("this.operAction", this.operAction);
        this.createHandNode(o).then(function (e) {
          t._operateTipRunning && (e ? "eliminate" === t.operAction.kind ? t._playEliminateHint(e, t.operAction.a, t.operAction.b) : t._playMoveHint(e, t.operAction.startCard, t.operAction.groupCards || [], t.operAction.direction, t.operAction.steps, t.operAction.toRow, t.operAction.toCol, t.operAction.elimA, t.operAction.elimB) : t.scheduleOnce(function () {
            return t._playOperateTipOnce();
          }, 1));
        });
      } else this.scheduleOnce(function () {
        return t._playOperateTipOnce();
      }, 1);
    }
  }
  _playEliminateHint(e, t, o) {
    var n = this._operateTipOverlay || this.ensureOperateTipOverlay(),
      a = t.node.convertToWorldSpaceAR(cc.v2(0, 0)),
      i = o.node.convertToWorldSpaceAR(cc.v2(0, 0)),
      r = n.convertToNodeSpaceAR(a),
      c = n.convertToNodeSpaceAR(i),
      s = cc.v3(0.5 * (r.x + c.x), 0.5 * (r.y + c.y), 0);
    this.operAction.isAdjacent || (s = cc.v3(r.x + 20, r.y, 0));
    e.children[0].getComponent(sp.Skeleton).setAnimation(0, "click", true);
    e.setPosition(s.x + 30, s.y - 100 * this.rootComp.cardScale);
    e.active = true;
    if (s.x < 500) {
      e.scaleX = -0.4;
      e.scaleY = 0.4;
    } else {
      e.scaleX = 0.4;
      e.scaleY = 0.4;
    }
    t.selected = true;
    o.selected = true;
  }
  _playMoveHint(e, t, o, n, a, i, r, c, s) {
    for (var l = this, u = this._operateTipOverlay || this.ensureOperateTipOverlay(), p = (o && o.length > 0 ? o : [t]).filter(function (e) {
        return e && e.node && e.node.isValid;
      }), d = [], f = 0, h = p; f < h.length; f++) {
      var g = h[f],
        _ = this._createTipGhost(u, g, 220);
      _ && d.push({
        card: g,
        node: _
      });
    }
    var y = t.node.convertToWorldSpaceAR(cc.v2(0, 0)),
      m = u.convertToNodeSpaceAR(y),
      v = this.rootComp.scaledCardWidth + this.rootComp.gapX,
      b = this.rootComp.scaledCardHeight + this.rootComp.gapY,
      w = cc.v2(r * v, -i * b),
      S = this.rootComp.mahjongContainer.convertToWorldSpaceAR(w),
      E = u.convertToNodeSpaceAR(S),
      P = {
        left: -1,
        right: 1,
        up: 0,
        down: 0
      }[n],
      C = {
        left: 0,
        right: 0,
        up: -1,
        down: 1
      }[n];
    e.children[0].getComponent(sp.Skeleton).setAnimation(0, "dj", true);
    e.active = true;
    cc.Tween.stopAllByTarget(e);
    e.setPosition(m.x + 50, m.y - 100);
    if (m.x < 500) {
      e.scaleX = -0.4;
      e.scaleY = 0.4;
    } else {
      e.scaleX = 0.4;
      e.scaleY = 0.4;
    }
    var D = d.find(function (e) {
      return e.card.cardData.type === s.cardData.type;
    });
    if (D) {
      D.node.getChildByPath("root/content/buleSelect").active = false;
      D.node.getChildByPath("root/content/cardBg").opacity = 220;
      D.node.getChildByPath("root/content/huaBg").opacity = 220;
    }
    cc.tween(e).to(0.5, {
      position: cc.v3(E.x + 50, E.y - 100, 0)
    }, {
      easing: "quadOut"
    }).call(function () {
      c.selected = true;
      s.selected = true;
    }).start();
    for (var O = 0, T = d; O < T.length; O++) {
      var A = T[O],
        k = (g = A.card).cardData.y + C * a,
        R = g.cardData.x + P * a,
        I = cc.v2(R * v, -k * b),
        N = this.rootComp.mahjongContainer.convertToWorldSpaceAR(I),
        M = u.convertToNodeSpaceAR(N);
      cc.Tween.stopAllByTarget(A.node);
      cc.tween(A.node).to(0.5, {
        position: cc.v3(M.x, M.y, 0)
      }, {
        easing: "quadOut"
      }).start();
    }
    this.scheduleOnce(function () {
      cc.Tween.stopAllByTarget(e);
      cc.tween(e).to(0.12, {
        opacity: 0
      }).start();
      for (var t = 0, o = d; t < o.length; t++) {
        var n = o[t];
        cc.Tween.stopAllByTarget(n.node);
        cc.tween(n.node).to(0.12, {
          opacity: 0
        }).start();
      }
      l._operateTipRunning && l.scheduleOnce(function () {
        l._operateTipRunning && l._playOperateTipOnce();
      }, 0.13999999999999999);
    }, 1);
  }
  _createTipGhost(e, t, o = 220, n = false) {
    if (!t || !t.node || !t.node.isValid) return null;
    var a = cc.instantiate(t.node);
    a.parent = e.getChildByName("content");
    a.zIndex = 5;
    var i = function i(e, t) {
      e.opacity = t;
      e.children.forEach(function (e) {
        return i(e, t);
      });
    };
    i(a, o);
    var r = t.node.convertToWorldSpaceAR(cc.v2(0, 0)),
      c = e.convertToNodeSpaceAR(r);
    a.setPosition(c.x, c.y);
    if (n) {
      var s = a.getComponent(card);
      s && (s.selected = true);
    }
    return a;
  }
  ensureOperateTipOverlay() {
    var t = this.rootComp.node.getChildByName("__operate_tip_overlay__");
    if (!t) {
      (t = new cc.Node("__operate_tip_overlay__")).parent = this.rootComp.node;
      t.zIndex = 99999;
    }
    return t;
  }
  clusterShuffle(e, t, o, n, a) {
    var r = Object.assign(Object.assign({}, {
      neighborWeight: 3,
      rowWeight: 1,
      colWeight: 1,
      iterations: 600,
      temperature: 0.35
    }), a || {});
    if (!(e.length <= 1 || t.length !== e.length)) {
      for (var c = e.length - 1; c > 0; c--) {
        var s = Math.floor(Math.random() * (c + 1)),
          l = e[c];
        e[c] = e[s];
        e[s] = l;
      }
      var u = new Map();
      for (c = 0; c < t.length; c++) {
        var p = t[c];
        u.set(1000 * p.row + p.col, c);
      }
      for (var d = function d() {
          for (var o, n, a, i, c, s, l, p, d = 0, f = 0; f < t.length; f++) {
            var h = t[f];
            if (null != (v = null === (n = null === (o = e[f]) || void 0 === o ? void 0 : o.cardData) || void 0 === n ? void 0 : n.type)) {
              var g = u.get(1000 * h.row + (h.col + 1));
              null != g && (null === (i = null === (a = e[g]) || void 0 === a ? void 0 : a.cardData) || void 0 === i ? void 0 : i.type) === v && (d += r.neighborWeight);
              var _ = u.get(1000 * (h.row + 1) + h.col);
              null != _ && (null === (s = null === (c = e[_]) || void 0 === c ? void 0 : c.cardData) || void 0 === s ? void 0 : s.type) === v && (d += r.neighborWeight);
            }
          }
          var y = new Map(),
            m = new Map();
          for (f = 0; f < t.length; f++) {
            var v;
            h = t[f];
            if (null != (v = null === (p = null === (l = e[f]) || void 0 === l ? void 0 : l.cardData) || void 0 === p ? void 0 : p.type)) {
              y.has(h.row) || y.set(h.row, new Map());
              m.has(h.col) || m.set(h.col, new Map());
              var b = y.get(h.row),
                w = m.get(h.col);
              b.set(v, (b.get(v) || 0) + 1);
              w.set(v, (w.get(v) || 0) + 1);
            }
          }
          var S = function S(e) {
            return e > 1 ? e * (e - 1) / 2 : 0;
          };
          y.forEach(function (e) {
            e.forEach(function (e) {
              d += r.rowWeight * S(e);
            });
          });
          m.forEach(function (e) {
            e.forEach(function (e) {
              d += r.colWeight * S(e);
            });
          });
          return d;
        }, f = d(), h = f, g = Math.max(0, Math.floor(r.iterations)), _ = Math.max(0, r.temperature), y = 0; y < g; y++) {
        var m = Math.floor(Math.random() * e.length),
          v = Math.floor(Math.random() * e.length);
        v === m && (v = (v + 1) % e.length);
        l = e[m];
        e[m] = e[v];
        e[v] = l;
        var b = d(),
          w = b - h;
        if (w >= 0) (h = b) > f && (f = h);else {
          var S = _ * (1 - y / Math.max(1, g));
          if (S > 0 && Math.random() < Math.exp(w / (10 * S))) h = b;else {
            var E = e[m];
            e[m] = e[v];
            e[v] = E;
          }
        }
      }
    }
  }
  createHandNode(e) {
    return new Promise(function (t) {
      cc.resources.load("prefabs/handNode", cc.Prefab, function (o, n) {
        if (!o && n) {
          var a = cc.instantiate(n);
          a.parent = e.getChildByName("content");
          a.active = false;
          a.scale = 0.4;
          a.zIndex = 999;
          t(a);
        } else {
          console.error(o);
          t(null);
        }
      });
    });
  }
  requestUseProp(e) {
    var t = this;
    var countBeforeUse = e == PropType.reshuffleCard ? Number(PlayerDataSys.reshuffleCardCount || 0) : e == PropType.tipCard ? Number(PlayerDataSys.tipCardCount || 0) : Number(PlayerDataSys.freezeCardCount || 0);
    if (countBeforeUse <= 0) return;
    gameData.isOpenDemo || GameSystem.useProp({
      is_revive: 0,
      prop_id: e,
      level: gameData.id
    }).then(function () {
      EventMgr.trigger(GameEventType.REFRESH_BOTTLE_AD_TEXT, t);
    });
  }
  teachingOperateTip(e) {
    this.operAction = e;
    this.startOperateTipLoop();
  }
  onDestroy() {
    this.unscheduleAllCallbacks();
  }
}