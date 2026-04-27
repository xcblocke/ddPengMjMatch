export var DEFAULT_GROUP_CONF = {
  1: [1, 4, 6, 7, 8, 9, 21, 22, 23, 25, 26, 27, 28, 11, 12, 13, 15, 16, 17, 18, 34, 35, 36, 37, 31, 32, 33, 41, 45],
  2: [2, 4, 6, 7, 8, 9, 21, 22, 24, 26, 27, 28, 29, 12, 13, 15, 17, 18, 19, 34, 35, 36, 37, 31, 32, 33, 42, 46],
  3: [1, 3, 4, 5, 6, 7, 9, 21, 23, 25, 26, 28, 29, 11, 13, 14, 16, 17, 18, 19, 34, 35, 36, 37, 31, 32, 33, 43, 47],
  4: [1, 3, 4, 6, 8, 9, 21, 23, 25, 26, 27, 28, 11, 12, 13, 15, 16, 17, 19, 34, 35, 36, 37, 31, 32, 33, 44, 48],
  5: [1, 5, 9, 21, 25, 29, 11, 15, 19, 35, 36, 31, 32, 33, 41],
  6: [2, 4, 8, 22, 25, 28, 12, 15, 18, 34, 37, 31, 32, 33, 42],
  7: [3, 6, 7, 21, 23, 26, 13, 16, 19, 34, 35, 31, 32, 33, 43],
  8: [1, 4, 9, 44, 36, 37, 24, 27, 29, 11, 14, 17, 31, 32, 33]
};
export var DEFAULT_FLOWER_LIST = [101, 102, 103, 104];
var a = [[0, 1], [1, 0], [0, -1], [-1, 0]];
export var generateLevelContent = function (e, t, o, n, a, s, u, p, f, h, g) {
  if (!h[u]) throw new Error("Invalid group: " + u);
  if (n <= 0 || o <= 0) throw new Error("element_type_count and element_double_num must be positive");
  console.log("generateLevelContent", e, t, o, n, a, s, u, p, f, h, g);
  for (var _ = 0; _ < 50; _ += 1) {
    for (var y = i(a, s), m = [], v = 0; v < t; v += 1) for (var b = 0; b < e; b += 1) m.push([v, b]);
    for (var w = c(t, e, y, m), S = l(r(n, o, u, p, h, g), w, t, e, g), E = new Set(), P = 0, C = S; P < C.length; P++) for (var D = 0, O = C[P]; D < O.length; D++) {
      var T = O[D];
      0 !== T && E.add(T);
    }
    if (E.size === n + p) return {
      mapData: d(S, t, e),
      elementTypes: Array.from(E)
    };
  }
  throw new Error("Failed to generate level content after retries");
};
function i(e, t) {
  for (var o, n = {
      1: e
    }, a = 0; a < t; a += 1) {
    var i = (2, 4, Math.floor(3 * Math.random()) + 2);
    n[i] = (null !== (o = n[i]) && void 0 !== o ? o : 0) + 1;
  }
  return n;
}
function r(e, t, o, a, i, r) {
  var c = [...i[o]];
  if (e > c.length) throw new Error("element_type_count(" + e + ") exceeds group size(" + c.length + ")");
  if (a > r.length) throw new Error("flower_num(" + a + ") exceeds flowerList length (" + r.length + ")");
  for (var s = m(c, e), l = m([...r], a), u = [...s], p = t - s.length - a, d = [...s], f = 0; f < p; f += 1) {
    if (0 === d.length) throw new Error("No available element type to fill pairs");
    for (var h = y(d); _(u, h) >= 3;) {
      var g = d.indexOf(h);
      g >= 0 && d.splice(g, 1);
      if (0 === d.length) throw new Error("No available element type after filtering");
      h = y(d);
    }
    u.push(h);
  }
  u.push.apply(u, l);
  v(u);
  return u;
}
function c(e, t, o, a) {
  for (var i, r = Array.from({
      length: e
    }, function (e, o) {
      return Array.from({
        length: t
      }, function (e, t) {
        return !a.some(function (e) {
          var n = e[0],
            a = e[1];
          return n === o && a === t;
        });
      });
    }), c = {}, l = 0, u = Object.keys(o); l < u.length; l++) {
    var p = u[l],
      d = Number(p),
      f = o[d];
    c[d] = null !== (i = c[d]) && void 0 !== i ? i : [];
    for (var g = false; c[d].length < f && !g;) {
      var _ = [...a];
      v(_);
      for (var m = false, b = 0, w = _; b < w.length; b++) {
        var S = w[b],
          E = S[0],
          P = S[1],
          C = s(E, P, d, t, e, r);
        if (0 !== C.length) {
          var D = y(C),
            O = D[0],
            T = D[1];
          c[d].push([[E, P], [O, T]]);
          r[E][P] = true;
          r[O][T] = true;
          h(a, E, P);
          h(a, O, T);
          m = true;
          break;
        }
      }
      m || (g = true);
    }
  }
  c[100] = [...a];
  return c;
}
function s(e, t, o, n, a, i) {
  for (var r = [], c = 0; c < a; c += 1) for (var s = 0; s < n; s += 1) i[c][s] || Math.abs(c - e) + Math.abs(s - t) !== o || r.push([c, s]);
  return r;
}
function l(e, t, o, n, a) {
  for (var i, r, c, s, l, d = e.flatMap(function (e) {
      return [e, e];
    }), f = Array.from({
      length: o
    }, function () {
      return Array.from({
        length: n
      }, function () {
        return 0;
      });
    }), _ = {}, y = Object.keys(t).map(Number).sort(function (e, t) {
      return e - t;
    }), m = new Map(), v = 0, b = y; v < b.length; v++) if (100 !== (T = b[v])) {
    for (var w = null !== (i = t[T]) && void 0 !== i ? i : [], S = [], E = function E(e) {
        var t = e[0],
          i = t[0],
          r = t[1],
          c = e[1],
          s = c[0],
          l = c[1],
          p = -1;
        if (1 === T) {
          if ((p = d.findIndex(function (e) {
            return !a.includes(e);
          })) < 0) {
            S.push(e);
            return "continue";
          }
        } else {
          var h = new Set();
          u(f, o, n, i, r, h);
          u(f, o, n, s, l, h);
          if ((p = d.findIndex(function (e) {
            return !h.has(e);
          })) < 0) {
            S.push(e);
            return "continue";
          }
        }
        var _ = d[p];
        d.splice(p, 1);
        var y = d[p];
        d.splice(p, 1);
        f[i][r] = _;
        f[s][l] = y;
        g(m, _, [i, r]);
        g(m, y, [s, l]);
      }, P = 0, C = w; P < C.length; P++) E(C[P]);
    _[T] = S;
  }
  for (var D = 0, O = Object.keys(_); D < O.length; D++) for (var T = O[D], A = 0, k = w = _[Number(T)]; A < k.length; A++) {
    var R = k[A],
      I = R[0],
      N = I[0],
      M = I[1],
      x = R[1],
      L = x[0],
      G = x[1];
    f[N][M] = null !== (r = d.pop()) && void 0 !== r ? r : 0;
    f[L][G] = null !== (c = d.pop()) && void 0 !== c ? c : 0;
  }
  for (var B = null !== (s = t[100]) && void 0 !== s ? s : [], F = 0, j = [d.filter(function (e, t) {
      return t % 2 == 0;
    }), d.filter(function (e, t) {
      return t % 2 != 0;
    })]; F < j.length; F++) for (var U = 0, H = j[F]; U < H.length; U++) {
    var V = H[U],
      W = null !== (l = m.get(V)) && void 0 !== l ? l : [],
      z = p(W, B);
    N = z[0], M = z[1];
    f[N][M] = V;
    W.push([N, M]);
    m.set(V, W);
    h(B, N, M);
  }
  return f;
}
function u(e, t, o, n, i, r) {
  for (var c = 0, s = a; c < s.length; c++) {
    var l = s[c],
      u = i + l[0],
      p = n + l[1];
    u >= 0 && u < o && p >= 0 && p < t && 0 !== e[p][u] && r.add(e[p][u]);
  }
}
function p(e, t) {
  if (0 === t.length) throw new Error("No available position in xyList");
  if (0 === e.length) return t[0];
  for (var o = new Map(), n = 0, a = t; n < a.length; n++) {
    for (var i = a[n], r = i[0], c = i[1], s = Number.MAX_SAFE_INTEGER, l = 0, u = e; l < u.length; l++) {
      var p = u[l],
        d = p[0],
        f = p[1];
      s = Math.min(s, Math.abs(r - d) + Math.abs(c - f));
    }
    o.set(s, [r, c]);
  }
  var h = Math.max.apply(Math, Array.from(o.keys()));
  return o.get(h);
}
function d(e, t, o) {
  for (var n = [], a = 0; a < t; a += 1) {
    for (var i = [], r = 0; r < o; r += 1) i.push({
      id: f(r, a),
      type: e[a][r],
      x: r,
      y: a
    });
    n.push(i);
  }
  return n;
}
function f(e, t) {
  var o = Array.from({
      length: 8
    }, function () {
      return b("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }),
    a = Array.from({
      length: 8
    }, function () {
      return b("0123456789");
    }),
    i = [...o, ...a];
  v(i);
  return i.join("") + "-" + String(t).padStart(2, "0") + "-" + String(e).padStart(2, "0");
}
function h(e, t, o) {
  var n = e.findIndex(function (e) {
    var n = e[0],
      a = e[1];
    return n === t && a === o;
  });
  n >= 0 && e.splice(n, 1);
}
function g(e, t, o) {
  var n,
    a = null !== (n = e.get(t)) && void 0 !== n ? n : [];
  a.push(o);
  e.set(t, a);
}
function _(e, t) {
  for (var o = 0, n = 0, a = e; n < a.length; n++) a[n] === t && (o += 1);
  return o;
}
function y(e) {
  if (0 === e.length) throw new Error("Cannot choose from empty array");
  return e[Math.floor(Math.random() * e.length)];
}
function m(e, t) {
  if (t < 0 || t > e.length) throw new Error("Invalid sample size: " + t);
  var o = [...e];
  v(o);
  return o.slice(0, t);
}
function v(e) {
  for (var t, o = e.length - 1; o > 0; o -= 1) {
    var n = Math.floor(Math.random() * (o + 1));
    t = [e[n], e[o]], e[o] = t[0], e[n] = t[1];
  }
}
function b(e) {
  return e[Math.floor(Math.random() * e.length)];
}