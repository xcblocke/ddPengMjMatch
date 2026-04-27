class _LoadRemotePlist {
  BRACE_REGEX = /[\{\}]/g;
  static _instance = null;
  static getInstance() {
    null == _LoadRemotePlist._instance && (_LoadRemotePlist._instance = new _LoadRemotePlist());
    return _LoadRemotePlist._instance;
  }
  parseSize(e) {
    var t = (e = e.slice(1, -1)).split(","),
      o = parseFloat(t[0]),
      n = parseFloat(t[1]);
    return new cc.Size(o, n);
  }
  parseVec2(e) {
    var t = (e = e.slice(1, -1)).split(","),
      o = parseFloat(t[0]),
      n = parseFloat(t[1]);
    return new cc.Vec2(o, n);
  }
  parseTriangles(e) {
    return e.split(" ").map(parseFloat);
  }
  parseVertices(e) {
    return e.split(" ").map(parseFloat);
  }
  parseRect(e) {
    var t = (e = e.replace(this.BRACE_REGEX, "")).split(",");
    return new cc.Rect(parseFloat(t[0] || 0), parseFloat(t[1] || 0), parseFloat(t[2] || 0), parseFloat(t[3] || 0));
  }
  parsePlist(e, t, o) {
    var n = e.metadata,
      a = e.frames,
      i = new cc.SpriteAtlas(),
      r = i._spriteFrames;
    for (var c in a) {
      var s = a[c],
        l = false,
        u = void 0,
        p = void 0,
        d = void 0;
      if (0 === n.format) {
        l = false;
        u = "{" + s.originalWidth + "," + s.originalHeight + "}";
        p = "{" + s.offsetX + "," + s.offsetY + "}";
        d = "{{" + s.x + "," + s.y + "},{" + s.width + "," + s.height + "}}";
      } else if (1 === n.format || 2 === n.format) {
        l = s.rotated;
        u = s.sourceSize;
        p = s.offset;
        d = s.frame;
      } else if (3 === n.format) {
        l = s.textureRotated;
        u = s.spriteSourceSize;
        p = s.spriteOffset;
        d = s.textureRect;
      }
      var f = new cc.SpriteFrame();
      t.add(f);
      f.setTexture(o, this.parseRect(d), !!l, this.parseVec2(p), this.parseSize(u));
      if (s.triangles) {
        var h = this.parseVertices(s.vertices),
          g = this.parseVertices(s.verticesUV);
        f.vertices = {
          triangles: this.parseTriangles(s.triangles),
          x: [],
          y: [],
          u: [],
          v: []
        };
        for (var _ = 0; _ < h.length; _ += 2) {
          f.vertices.x.push(h[_]);
          f.vertices.y.push(h[_ + 1]);
        }
        for (_ = 0; _ < g.length; _ += 2) {
          f.vertices.u.push(g[_]);
          f.vertices.v.push(g[_ + 1]);
        }
      }
      r[cc.path.mainFileName(c)] = f;
    }
    t.add(i);
    t.add(o);
    return i;
  }
  getRemotePlist(e, t) {
    var o = this,
      n = new Set();
    cc.assetManager.loadRemote(e, function (a, i) {
      if (a) return t(a);
      var r = i._$nativeAsset.metadata.realTextureFileName || i._$nativeAsset.metadata.textureFileName;
      r = cc.path.join(cc.path.dirname(e), r);
      cc.assetManager.loadRemote(r, {
        ext: ".png"
      }, function (e, a) {
        if (e) return t(e);
        var r = o.parsePlist(i._$nativeAsset, n, a);
        n.add(i);
        t(null, {
          atlas: r,
          assets: n
        });
      });
    });
  }
}
export default _LoadRemotePlist.getInstance();