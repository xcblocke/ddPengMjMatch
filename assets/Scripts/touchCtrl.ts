import { ClearAnimType } from './prefab/card';
import { Constants } from './common/Constants';
import AudioManager from './framework/controller/AudioManager';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData, GameState } from './data/GameData';
import GlobalApp from './common/GlobalApp';
import { GuideEnum } from './framework/enum/GuideConfig';
import SdkHelper from './framework/SdkHelper';
import { FailedType } from './framework/enum/AllEnum';
import { trackCreatorEvent } from './common/GameTrackUtil';
const {
  ccclass
} = cc._decorator;
@ccclass
export default class touchCtrl extends cc.Component {
  _gameMain = null;
  _isDragging = false;
  _dragStartPos = null;
  _touchCard = null;
  _lockedDragAxis = null;
  _dragGroup = [];
  _pendingEliminateChoice = [];
  _pendingEliminateChoiceCard = null;
  init(e) {
    this._gameMain = e;
  }
  onCardTouchStart(e, t) {
    if (this._gameMain && gameData.globalCanClick && !this._gameMain.isMahjongSpawning) {
      this._touchCard = e;
      this._isDragging = false;
      this._dragStartPos = t ? t.clone() : null;
      this._lockedDragAxis = null;
      this._dragGroup = [];
      this.deselectAllExcept(e);
      e.selected = true;
    }
  }
  onCardTouchMove(e, t) {
    var o = this;
    if (this._gameMain && this._touchCard && this._touchCard === e && this._dragStartPos && !this._gameMain.isMahjongSpawning) {
      var n = t.sub(this._dragStartPos);
      if (!(!this._isDragging && Math.abs(n.x) < 15 && Math.abs(n.y) < 15)) {
        this._isDragging || (this._isDragging = true);
        if (!this._lockedDragAxis) {
          var a = Math.abs(n.x) >= Math.abs(n.y) ? "horizontal" : "vertical";
          if (!function () {
            if ("horizontal" === a) {
              var t = o.getDragGroup(e, "left"),
                n = o.getDragGroup(e, "right");
              return o.getMaxDragSteps(t, "left") > 0 || o.getMaxDragSteps(n, "right") > 0;
            }
            var i = o.getDragGroup(e, "up"),
              r = o.getDragGroup(e, "down");
            return o.getMaxDragSteps(i, "up") > 0 || o.getMaxDragSteps(r, "down") > 0;
          }()) return;
          this._lockedDragAxis = a;
        }
        var i = this._lockedDragAxis;
        if (i) {
          var r = "horizontal" === i ? n.x >= 0 ? "right" : "left" : n.y <= 0 ? "down" : "up",
            c = this.getDragGroup(e, r),
            s = this.getMaxDragSteps(c, r);
          if (0 !== s) {
            if (this._dragGroup.length > 0 && (this._dragGroup.length !== c.length || !this._dragGroup.every(function (e, t) {
              return e === c[t];
            }))) for (var l = 0, u = this._dragGroup; l < u.length; l++) {
              O = u[l], T = this.getCardBasePosition(O);
              O.node.setPosition(T);
            }
            this._dragGroup = c;
            this.drawOperationAxisRects(e);
            var p = this._gameMain.getMahjongContainer(),
              d = p.convertToNodeSpaceAR(this._dragStartPos),
              f = p.convertToNodeSpaceAR(t),
              h = f.x - d.x,
              g = f.y - d.y,
              _ = 0,
              y = 0,
              m = this._gameMain.getCellW(),
              v = this._gameMain.getCellH();
            if ("horizontal" === i) {
              var b = s * m;
              if ("right" === r) {
                var w = Math.max(0, h);
                _ = Math.min(b, w);
              } else {
                w = Math.min(0, h);
                _ = Math.max(-b, w);
              }
            } else {
              b = s * v;
              if ("down" === r) {
                w = Math.min(0, g);
                y = Math.max(-b, w);
              } else {
                w = Math.max(0, g);
                y = Math.min(b, w);
              }
            }
            for (var S = 0, E = c; S < E.length; S++) {
              O = E[S];
              var P = this.getCardBasePosition(O);
              O.node.setPosition(P.x + _, P.y + y);
            }
          } else {
            for (var C = 0, D = this._dragGroup; C < D.length; C++) {
              var O = D[C],
                T = this.getCardBasePosition(O);
              O.node.setPosition(T);
            }
            this._dragGroup = [];
          }
        }
      }
    }
  }
  onCardTouchEnd(e, t) {
    if (this._gameMain && this._touchCard && this._touchCard === e) {
      if (this._pendingEliminateChoiceCard && e.cardData.id != this._pendingEliminateChoiceCard.cardData.id) this.eliminatePair(this._pendingEliminateChoiceCard, e);else if (this._isDragging) {
        var o = this._lockedDragAxis;
        if (!o) {
          this._doClickEliminate(e);
          this._resetTouchState();
          e.selected = false;
          return;
        }
        var n = t.sub(this._dragStartPos),
          a = "horizontal" === o ? n.x >= 0 ? "right" : "left" : n.y <= 0 ? "down" : "up",
          i = this.getDragGroup(e, a),
          r = this.getMaxDragSteps(i, a),
          c = this._gameMain.getCellW(),
          s = this._gameMain.getCellH(),
          l = 0;
        if ("horizontal" === o) {
          var u = this.getCardBasePosition(e),
            p = (e.node.position.x - u.x) / c;
          l = "right" === a ? Math.min(r, Math.max(0, Math.round(p))) : Math.min(r, Math.max(0, Math.round(-p)));
        } else {
          u = this.getCardBasePosition(e), p = (e.node.position.y - u.y) / s;
          l = "down" === a ? Math.min(r, Math.max(0, Math.round(-p))) : Math.min(r, Math.max(0, Math.round(p)));
        }
        if (0 !== l) this.commitDragMove(i, a, Math.abs(l), e);else {
          for (var d = 0, f = this._dragGroup.length > 0 ? this._dragGroup : i; d < f.length; d++) {
            var h = f[d],
              g = this.getCardBasePosition(h);
            h.node.setPosition(g);
          }
          this._doClickEliminate(e);
        }
      } else this._doClickEliminate(e);
      e.selected = false;
      this.clearOperationAxisRects();
      this._resetTouchState();
    }
  }
  onCardTouchCancel(e, t) {
    this.onCardTouchEnd(e, t);
  }
  _doClickEliminate(e) {
    var t,
      o = this.findEliminablePairs(e);
    if (o.horizontal.length + o.vertical.length > 1) {
      var n = [...o.horizontal, ...o.vertical];
      this.showEliminateChoice(e, n);
    } else if (o.horizontal.length > 0) {
      this.eliminatePair(e, o.horizontal[0]);
    } else {
      if (o.vertical.length > 0) {
        this.eliminatePair(e, o.vertical[0]);
      } else {
        this._shakeSameTypeCards(null === (t = e.cardData) || void 0 === t ? void 0 : t.type);
      }
    }
  }
  _shakeSameTypeCards(e) {
    var t, o, n, a, i;
    AudioManager.getInstance().playMusic("Mahjong_Click");
    if (e) for (var r = null !== (o = null === (t = this._gameMain) || void 0 === t ? void 0 : t.gridRows) && void 0 !== o ? o : 0, c = null !== (a = null === (n = this._gameMain) || void 0 === n ? void 0 : n.gridCols) && void 0 !== a ? a : 0, s = 0; s < r; s++) for (var u = 0; u < c; u++) {
      var p = this.getCardAt(s, u);
      p && (null === (i = p.cardData) || void 0 === i ? void 0 : i.type) === e && p.shakeAnim();
    }
  }
  getCardAt(e, t) {
    if (e < 0 || e >= this._gameMain.gridRows || t < 0 || t >= this._gameMain.gridCols) return null;
    var o = this._gameMain.cardGrid[e];
    if (!o || t >= o.length) return null;
    var n = o[t];
    return null == n ? null : n.node && !n.node.isValid ? null : n;
  }
  setCardAt(e, t, o) {
    if (!(e < 0 || e >= this._gameMain.gridRows || t < 0 || t >= this._gameMain.gridCols)) {
      this._gameMain.cardGrid[e] || (this._gameMain.cardGrid[e] = []);
      this._gameMain.cardGrid[e][t] = o;
    }
  }
  findEliminablePairs(e) {
    for (var t = e.cardData.x, o = e.cardData.y, n = e.cardData.type, a = [], i = [], r = t - 1; r >= 0; r--) if (s = this.getCardAt(o, r)) {
      if (s.cardData.type === n) {
        a.push(s);
        break;
      }
      break;
    }
    for (r = t + 1; r < this._gameMain.gridCols; r++) if (s = this.getCardAt(o, r)) {
      if (s.cardData.type === n) {
        a.push(s);
        break;
      }
      break;
    }
    for (var c = o - 1; c >= 0; c--) if (s = this.getCardAt(c, t)) {
      if (s.cardData.type === n) {
        i.push(s);
        break;
      }
      break;
    }
    for (c = o + 1; c < this._gameMain.gridRows; c++) {
      var s;
      if (s = this.getCardAt(c, t)) {
        if (s.cardData.type === n) {
          i.push(s);
          break;
        }
        break;
      }
    }
    return {
      horizontal: a,
      vertical: i
    };
  }
  eliminatePair(e, t) {
    this._eliminatePairInternal(e, t, true);
    this._pendingEliminateChoice = [];
    this._pendingEliminateChoiceCard = null;
  }
  _eliminatePairInternal(e, t, o) {
    var n,
      a,
      i,
      r,
      h,
      _,
      y,
      m,
      v = this;
    console.log("_eliminatePairInternal", e.cardData.type, t.cardData.type, o);
    AudioManager.getInstance().playMusic("Mahjong_Broken");
    // if (Constants.isSpecialCard(e.cardData.type)) {
    //   AudioManager.getInstance().playMusic("card/huaCard");
    // } else {
    //   AudioManager.getInstance().playMusic("card/" + e.cardData.type);
    // }
    var b = cc.v3(0.5 * (e.node.position.x + t.node.position.x), 0.5 * (e.node.position.y + t.node.position.y), 0.5 * (e.node.position.z + t.node.position.z));
    b = e.node.parent.convertToWorldSpaceAR(b);
    EventMgr.trigger(GameEventType.UPDATE_COMBO_COUNT, b);
    var w = e.cardData.y,
      S = e.cardData.x,
      E = t.cardData.y,
      P = t.cardData.x;
    this.setCardAt(w, S, null);
    this.setCardAt(E, P, null);
    if (Math.abs((null !== (a = null === (n = null == e ? void 0 : e.cardData) || void 0 === n ? void 0 : n.x) && void 0 !== a ? a : 0) - (null !== (r = null === (i = null == t ? void 0 : t.cardData) || void 0 === i ? void 0 : i.x) && void 0 !== r ? r : 0)) + Math.abs((null !== (_ = null === (h = null == e ? void 0 : e.cardData) || void 0 === h ? void 0 : h.y) && void 0 !== _ ? _ : 0) - (null !== (m = null === (y = null == t ? void 0 : t.cardData) || void 0 === y ? void 0 : y.y) && void 0 !== m ? m : 0)) === 1) {
      e.playEliminateScaleFade(ClearAnimType.Normal);
      t.playEliminateScaleFade(ClearAnimType.Normal);
    } else {
      var C = e.node.position,
        D = t.node.position,
        O = cc.v3(0.5 * (C.x + D.x), 0.5 * (C.y + D.y), 0.5 * (C.z + D.z)),
        T = cc.v2(D.x - C.x, D.y - C.y),
        A = T.mag(),
        k = A > 0.0001 ? cc.v2(T.x / A, T.y / A) : cc.v2(1, 0),
        R = function R(e, t) {
          var o,
            n,
            a = e.getContentSize(),
            i = Math.abs(a.width * (null !== (o = e.scaleX) && void 0 !== o ? o : 1)),
            r = Math.abs(a.height * (null !== (n = e.scaleY) && void 0 !== n ? n : 1));
          return 0.5 * (Math.abs(t.x) * i + Math.abs(t.y) * r);
        },
        I = 0.5 * (R(e.node, k) + R(t.node, k) + -5),
        N = cc.v3(O.x - k.x * I, O.y - k.y * I, O.z),
        M = cc.v3(O.x + k.x * I, O.y + k.y * I, O.z),
        x = ClearAnimType.Normal;
      o && (x = Math.abs(k.y) > Math.abs(k.x) ? ClearAnimType.Vertical : ClearAnimType.Horizontal);
      if (Constants.isSpecialCard(e.cardData.type)) {
        AudioManager.getInstance().playMusic("SelectMerge_Flower");
      } else {
        AudioManager.getInstance().playMusic("SelectMerge");
      }
      e.playEliminateMoveToThenScaleFade(N, x);
      t.playEliminateMoveToThenScaleFade(M, x);
    }
    SdkHelper.setVibrator();
    o && this._shouldTriggerExtraEliminate(e, t) && this.scheduleOnce(function () {
      v._triggerExtraEliminate(e, t);
    }, 0.7);
    var L = e.node.parent.convertToWorldSpaceAR(e.node.position),
      G = t.node.parent.convertToWorldSpaceAR(t.node.position);
    this.scheduleOnce(function () {
      EventMgr.trigger(GameEventType.SUBMIT, {
        type: 1,
        pos0: L,
        pos1: G
      });
      v._shouldTriggerExtraEliminate(e, t) || v._onAfterEliminateCheck();
    }, 0.1);
    if (1 == gameData.gameLevel) {
      const completedStep = GlobalApp.GameMain._teachingStep;
      if (completedStep > 0) {
        trackCreatorEvent(474, completedStep);
      }
      GlobalApp.GameMain.hideTeachingGuide();
      this.scheduleOnce(function () {
        GlobalApp.GameMain.showNextTeachingStep();
      }, 0.5);
    }
    if (o) {
      trackCreatorEvent(475, `${e.cardData.type},${t.cardData.type}`);
    }
    SdkHelper.reportData("xc_card");
    console.log("card", this._gameMain.cardGrid);
  }
  _getCardAtFromGrid(e, t, o) {
    if (t < 0 || t >= this._gameMain.gridRows || o < 0 || o >= this._gameMain.gridCols) return null;
    var n = e[t];
    if (!n || o >= n.length) return null;
    var a = n[o];
    return null == a ? null : a.node && !a.node.isValid ? null : a;
  }
  _findEliminablePairsInGrid(e, t, o) {
    var n = this._getCardAtFromGrid(e, t, o);
    if (!n) return {
      horizontal: null,
      vertical: null
    };
    for (var a = n.cardData.type, i = null, r = null, c = o - 1; c >= 0; c--) if (l = this._getCardAtFromGrid(e, t, c)) {
      if (l.cardData.type === a) {
        i = l;
        break;
      }
      break;
    }
    if (!i) for (c = o + 1; c < this._gameMain.gridCols; c++) if (l = this._getCardAtFromGrid(e, t, c)) {
      if (l.cardData.type === a) {
        i = l;
        break;
      }
      break;
    }
    for (var s = t - 1; s >= 0; s--) if (l = this._getCardAtFromGrid(e, s, o)) {
      if (l.cardData.type === a) {
        r = l;
        break;
      }
      break;
    }
    if (!r) for (s = t + 1; s < this._gameMain.gridRows; s++) {
      var l;
      if (l = this._getCardAtFromGrid(e, s, o)) {
        if (l.cardData.type === a) {
          r = l;
          break;
        }
        break;
      }
    }
    return {
      horizontal: i,
      vertical: r
    };
  }
  hasAnyEliminablePair() {
    for (var e = this._gameMain.gridRows, t = this._gameMain.gridCols, o = 0; o < e; o++) for (var n = 0; n < t; n++) if (P = this.getCardAt(o, n)) {
      var a = this.findEliminablePairs(P);
      console.log("pair111", a);
      if (a.horizontal.length > 0 || a.vertical.length > 0) return true;
    }
    var i = ["left", "right", "up", "down"],
      r = {
        left: -1,
        right: 1,
        up: 0,
        down: 0
      },
      c = {
        left: 0,
        right: 0,
        up: -1,
        down: 1
      };
    for (o = 0; o < e; o++) for (n = 0; n < t; n++) {
      var s = this.getCardAt(o, n);
      if (s) for (var l = 0, u = i; l < u.length; l++) {
        var p = u[l],
          d = this.getDragGroup(s, p),
          f = this.getMaxDragSteps(d, p);
        if (!(f <= 0)) for (var h = r[p], g = c[p], _ = 1; _ <= f; _++) {
          for (var y = [], m = 0; m < e; m++) {
            y[m] = [];
            for (var v = 0; v < t; v++) y[m][v] = this.getCardAt(m, v);
          }
          for (var b = 0, w = d; b < w.length; b++) y[(P = w[b]).cardData.y][P.cardData.x] = null;
          for (var S = 0, E = d; S < E.length; S++) {
            var P,
              C = (P = E[S]).cardData.y + g * _,
              D = P.cardData.x + h * _;
            y[C][D] = P;
          }
          var O = s.cardData.y + g * _,
            T = s.cardData.x + h * _;
          a = this._findEliminablePairsInGrid(y, O, T);
          console.log("pair222", a, s);
          if (a.horizontal || a.vertical) return true;
        }
      }
    }
    return false;
  }
  getOperateTipAction() {
    for (var e = this._gameMain.gridRows, t = this._gameMain.gridCols, o = [], n = 0; n < e; n++) for (var a = 0; a < t; a++) if (I = this.getCardAt(n, a)) {
      for (var i = this.findEliminablePairs(I), r = 0, c = i.horizontal; r < c.length; r++) {
        var s = c[r];
        o.push({
          a: I,
          b: s
        });
      }
      for (var l = 0, u = i.vertical; l < u.length; l++) {
        var p = u[l];
        o.push({
          a: I,
          b: p
        });
      }
    }
    if (o.length > 0) {
      var d = o[Math.floor(Math.random() * o.length)],
        f = Math.abs(d.a.cardData.x - d.b.cardData.x),
        h = Math.abs(d.a.cardData.y - d.b.cardData.y);
      return {
        kind: "eliminate",
        a: d.a,
        b: d.b,
        isAdjacent: f + h === 1
      };
    }
    var g = ["left", "right", "up", "down"],
      _ = {
        left: -1,
        right: 1,
        up: 0,
        down: 0
      },
      y = {
        left: 0,
        right: 0,
        up: -1,
        down: 1
      };
    for (n = 0; n < e; n++) for (a = 0; a < t; a++) {
      var m = this.getCardAt(n, a);
      if (m) for (var v = 0, b = g; v < b.length; v++) {
        var w = b[v],
          S = this.getDragGroup(m, w),
          E = this.getMaxDragSteps(S, w);
        if (!(E <= 0)) {
          f = _[w], h = y[w];
          for (var P = 1; P <= E; P++) {
            for (var C = [], D = 0; D < e; D++) {
              C[D] = [];
              for (var O = 0; O < t; O++) C[D][O] = this.getCardAt(D, O);
            }
            for (var T = 0, A = S; T < A.length; T++) C[(I = A[T]).cardData.y][I.cardData.x] = null;
            for (var k = 0, R = S; k < R.length; k++) {
              var I,
                N = (I = R[k]).cardData.y + h * P,
                M = I.cardData.x + f * P;
              C[N][M] = I;
            }
            var x = m.cardData.y + h * P,
              L = m.cardData.x + f * P,
              G = this._findEliminablePairsInGrid(C, x, L);
            if (G.horizontal) return {
              kind: "move",
              startCard: m,
              groupCards: S.slice(),
              direction: w,
              steps: P,
              toRow: x,
              toCol: L,
              elimA: m,
              elimB: G.horizontal
            };
            if (G.vertical) return {
              kind: "move",
              startCard: m,
              groupCards: S.slice(),
              direction: w,
              steps: P,
              toRow: x,
              toCol: L,
              elimA: m,
              elimB: G.vertical
            };
          }
        }
      }
    }
    return null;
  }
  _onAfterEliminateCheck() {
    if (gameData.gameState !== GameState.gameing) {
      return;
    }
    var e = this.hasAnyEliminablePair();
    console.log("hasMore", e);
    if (!e) {
      console.log("无牌可消");
      gameData.skipVideoTipsForRevive = true;
      this._gameMain.gameOver({
        type: FailedType.Normal
      });
    }
  }
  _shouldTriggerExtraEliminate(e, t) {
    var o,
      n,
      a = null === (o = e.cardData) || void 0 === o ? void 0 : o.type,
      i = null === (n = t.cardData) || void 0 === n ? void 0 : n.type;
    return Constants.isSpecialCard(a) || Constants.isSpecialCard(i);
  }
  _triggerExtraEliminate(e, t) {
    for (var o, n = this, a = [], i = 0; i < this._gameMain.gridRows; i++) for (var r = 0; r < this._gameMain.gridCols; r++) {
      var c = this.getCardAt(i, r);
      c && c.node && c.node.isValid && c !== e && c !== t && a.push(c);
    }
    if (!(a.length < 2)) {
      var l = function l(e) {
          var t,
            o = null === (t = e.cardData) || void 0 === t ? void 0 : t.type;
          return !!Constants.isSpecialCard(o) || n._hasAdjacentSameType(e);
        },
        u = a.filter(function (e) {
          return !l(e);
        }),
        p = u.length > 0 ? u : a,
        d = p[Math.floor(Math.random() * p.length)],
        f = null === (o = d.cardData) || void 0 === o ? void 0 : o.type,
        h = null,
        g = a.filter(function (e) {
          return e !== d;
        }),
        _ = g.filter(function (e) {
          var t;
          return (null === (t = e.cardData) || void 0 === t ? void 0 : t.type) === f;
        }),
        y = _.filter(function (e) {
          return !l(e);
        }),
        m = y.length > 0 ? y : _;
      if (m.length > 0) h = m[Math.floor(Math.random() * m.length)];else {
        var v = g.filter(function (e) {
            return !l(e);
          }),
          b = v.length > 0 ? v : g;
        b.length > 0 && (h = b[Math.floor(Math.random() * b.length)]);
      }
      d && h && this._eliminatePairInternal(d, h, false);
    }
  }
  _hasAdjacentSameType(e) {
    if (!e || !e.cardData) return false;
    var t = e.cardData.y,
      o = e.cardData.x,
      n = e.cardData.type;
    return [this.getCardAt(t, o - 1), this.getCardAt(t, o + 1), this.getCardAt(t - 1, o), this.getCardAt(t + 1, o)].some(function (e) {
      return e && e.cardData && e.cardData.type === n;
    });
  }
  showEliminateChoice(e, t) {
    this._pendingEliminateChoice = [...t];
    this._pendingEliminateChoiceCard = e;
    GlobalApp.PackagingProcessGuide.showGuideNode({
      guideType: GuideEnum.guideEliminateChoice,
      nodes: [...[e.node], ...t.map(function (e) {
        return e.node;
      })]
    });
    setTimeout(function () {
      e.selected = true;
      t.forEach(function (e) {
        return e.showChooseIcon();
      });
    }, 1);
  }
  getDragGroup(e, t) {
    var o = e.cardData.x,
      n = e.cardData.y,
      a = [];
    if ("right" === t) for (var i = o; i < this._gameMain.gridCols && (c = this.getCardAt(n, i)); i++) a.push(c);else if ("left" === t) for (i = o; i >= 0 && (c = this.getCardAt(n, i)); i--) a.push(c);else if ("down" === t) for (var r = n; r < this._gameMain.gridRows && (c = this.getCardAt(r, o)); r++) a.push(c);else for (r = n; r >= 0; r--) {
      var c;
      if (!(c = this.getCardAt(r, o))) break;
      a.push(c);
    }
    return a;
  }
  getMaxDragSteps(e, t) {
    if (0 === e.length) return 0;
    if ("left" === t || "right" === t) {
      var o = e[0].cardData.y,
        n = e.map(function (e) {
          return e.cardData.x;
        }).sort(function (e, t) {
          return e - t;
        }),
        a = n[0],
        i = n[n.length - 1];
      if ("left" === t) {
        for (var r = 0; a - 1 - r >= 0 && !this.getCardAt(o, a - 1 - r);) r++;
        return r;
      }
      for (r = 0; i + 1 + r < this._gameMain.gridCols && !this.getCardAt(o, i + 1 + r);) r++;
      return r;
    }
    var c = e[0].cardData.x,
      s = e.map(function (e) {
        return e.cardData.y;
      }).sort(function (e, t) {
        return e - t;
      }),
      l = s[0],
      u = s[s.length - 1];
    if ("up" === t) {
      for (r = 0; l - 1 - r >= 0 && !this.getCardAt(l - 1 - r, c);) r++;
      return r;
    }
    for (r = 0; u + 1 + r < this._gameMain.gridRows && !this.getCardAt(u + 1 + r, c);) r++;
    return r;
  }
  commitDragMove(e, t, o, n) {
    if (!(o <= 0)) {
      for (var a = "left" === t ? -o : "right" === t ? o : 0, i = "up" === t ? -o : "down" === t ? o : 0, c = this._gameMain.scaledCardWidth + this._gameMain.gapX, s = this._gameMain.scaledCardHeight + this._gameMain.gapY, l = [], u = 0, p = e; u < p.length; u++) {
        var d = p[u];
        l.push({
          card: d,
          row: d.cardData.y,
          col: d.cardData.x,
          posX: d.cardData.x * c,
          posY: -d.cardData.y * s
        });
      }
      for (var f = 0, h = e; f < h.length; f++) {
        var g = (d = h[f]).cardData.y,
          _ = d.cardData.x;
        this.setCardAt(g, _, null);
      }
      for (var y = 0, m = e; y < m.length; y++) {
        var v = (d = m[y]).cardData.x + a,
          b = d.cardData.y + i;
        d.cardData.x = v;
        d.cardData.y = b;
        d.setZIndex();
        this.setCardAt(b, v, d);
        var w = v * c,
          S = -b * s;
        d.node.setPosition(w, S);
      }
      var E = n || e[0];
      if (E && E.node && E.node.isValid) {
        var P = this.findEliminablePairs(E);
        if (P.horizontal.length + P.vertical.length > 1) {
          var C = [...P.horizontal, ...P.vertical];
          this.showEliminateChoice(E, C);
          return;
        }
        if (P.horizontal.length > 0) {
          this.eliminatePair(E, P.horizontal[0]);
          return;
        }
        if (P.vertical.length > 0) {
          this.eliminatePair(E, P.vertical[0]);
          return;
        }
      }
      this.revertDragMoveWithTween(e, l, c, s);
    }
  }
  revertDragMoveWithTween(e, t) {
    AudioManager.getInstance().playMusic("DragBack");
    for (var o = 0, n = e; o < n.length; o++) {
      var a = n[o];
      this.setCardAt(a.cardData.y, a.cardData.x, null);
    }
    for (var i = 0, r = t; i < r.length; i++) {
      var c = r[i];
      if ((a = c.card) && a.node && a.node.isValid) {
        a.cardData.x = c.col;
        a.cardData.y = c.row;
        a.setZIndex();
        this.setCardAt(c.row, c.col, a);
        cc.tween(a.node).to(0.1, {
          position: cc.v3(c.posX, c.posY, 0)
        }, {
          easing: "quadIn"
        }).start();
      }
    }
  }
  deselectAllExcept(e) {
    for (var t = 0; t < this._gameMain.gridRows; t++) for (var o = 0; o < this._gameMain.gridCols; o++) {
      var n = this.getCardAt(t, o);
      n && n !== e && (n.selected = false);
    }
  }
  getCardBasePosition(e) {
    var t = this._gameMain.scaledCardWidth + this._gameMain.gapX,
      o = this._gameMain.scaledCardHeight + this._gameMain.gapY,
      n = e.cardData.x,
      a = e.cardData.y;
    return cc.v2(n * t, -a * o);
  }
  _resetTouchState() {
    this._touchCard = null;
    this._dragStartPos = null;
    this._isDragging = false;
    this._lockedDragAxis = null;
    this._dragGroup = [];
  }
  resetInteractionState() {
    this._resetTouchState();
    this._pendingEliminateChoice = [];
    this._pendingEliminateChoiceCard = null;
    this.clearOperationAxisRects();
  }
  findEliminablePairsAtVirtual(e, t, o) {
    for (var n = this, a = e.cardData.type, i = e.cardData.y, r = e.cardData.x, c = [], s = [], l = r, u = r, p = r - 1; p >= 0 && (_ = this.getCardAt(i, p)); p--) l = p;
    for (p = r + 1; p < this._gameMain.gridCols && (_ = this.getCardAt(i, p)); p++) u = p;
    for (var d = i, f = i, h = i - 1; h >= 0 && (_ = this.getCardAt(h, r)); h--) d = h;
    for (h = i + 1; h < this._gameMain.gridRows && (_ = this.getCardAt(h, r)); h++) f = h;
    var g = function g(e, t) {
      return e === i && t === r ? null : e === i && t >= l && t <= u ? null : t === r && e >= d && e <= f ? null : n.getCardAt(e, t);
    };
    for (p = o - 1; p >= 0; p--) if (_ = g(t, p)) {
      if (_.cardData.type === a) {
        c.push(_);
        break;
      }
      break;
    }
    for (p = o + 1; p < this._gameMain.gridCols; p++) if (_ = g(t, p)) {
      if (_.cardData.type === a) {
        c.push(_);
        break;
      }
      break;
    }
    for (h = t - 1; h >= 0; h--) if (_ = g(h, o)) {
      if (_.cardData.type === a) {
        s.push(_);
        break;
      }
      break;
    }
    for (h = t + 1; h < this._gameMain.gridRows; h++) {
      var _;
      if (_ = g(h, o)) {
        if (_.cardData.type === a) {
          s.push(_);
          break;
        }
        break;
      }
    }
    return {
      horizontal: c,
      vertical: s
    };
  }
  drawOperationAxisRects(e) {
    var t,
      o,
      n = this._gameMain,
      a = n && n.operationGridLine;
    if (a && e && e.node) {
      var i = null !== (t = n.gridRows) && void 0 !== t ? t : 0,
        r = null !== (o = n.gridCols) && void 0 !== o ? o : 0;
      if (!(i <= 0 || r <= 0)) {
        var c = n.scaledCardWidth,
          s = n.scaledCardHeight,
          l = c + n.gapX,
          u = s + n.gapY,
          p = (r - 1) * l + c,
          d = (i - 1) * u + s,
          f = e.node.x,
          h = e.node.y,
          g = Math.round(f / l),
          _ = Math.round(-h / u);
        g = Math.max(0, Math.min(r - 1, g));
        _ = Math.max(0, Math.min(i - 1, _));
        var y = this.findEliminablePairsAtVirtual(e, _, g),
          m = y.horizontal.length > 0,
          v = y.vertical.length > 0;
        a.clear();
        a.lineWidth = 0.5;
        var b = new cc.Color(255, 255, 255, 160),
          w = new cc.Color(255, 255, 255, 40),
          S = new cc.Color(255, 220, 0, 220),
          E = new cc.Color(255, 220, 0, 70),
          P = -_ * u - u,
          C = Math.max(0, u - 0),
          D = 0.5 * (u - C);
        a.strokeColor = m ? S : b;
        a.fillColor = m ? E : w;
        a.rect(0, P + D, p, C);
        a.fill();
        a.stroke();
        var O = g * l,
          T = Math.max(0, l - 0),
          A = 0.5 * (l - T),
          k = Math.max(0, d - 0),
          R = 0.5 * (d - k);
        a.strokeColor = v ? S : b;
        a.fillColor = v ? E : w;
        a.rect(O + A, -d + R, T, k);
        a.fill();
        a.stroke();
      }
    }
  }
  clearOperationAxisRects() {
    var e = this._gameMain,
      t = e && e.operationGridLine;
    t && t.clear();
  }
}