import EngineUtil from '../framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class ResourcesManager {
  _iconFrames = [];
  _mahjongFrames = [];
  _prefabs = [];
  _bgFrames = [];
  static _instance = null;
  static getInstance() {
    this._instance || (this._instance = new ResourcesManager());
    return this._instance;
  }
  getIconSpriteFrame(e) {
    return this._iconFrames.find(function (t) {
      return t.name == e;
    });
  }
  getMahjongSpriteFrame(e) {
    return this._mahjongFrames.find(function (t) {
      return t.name == e;
    });
  }
  getPrefab(e) {
    return this._prefabs.find(function (t) {
      return t.name == e;
    });
  }
  getBgSpriteFrame(e) {
    return this._bgFrames.find(function (t) {
      return t.name == e;
    });
  }
  loadDir(e, t, o) {
    return new Promise(function (n, a) {
      if (e) {
        e.loadDir(t, o, function (e, t) {
          if (e) {
            a(e);
          } else {
            n(t);
          }
        });
      } else {
        a();
      }
    });
  }
  async loadGameRes() {
    var e = this;
    return new Promise(async function (t, o) {
      const __async_this = e;
      var e_local, n, a, r, c, s;
      try {
        e_local = cc.assetManager.getBundle("resources");
        n = __async_this;
        n._iconFrames = await __async_this.loadDir(e_local, "preload/icons", cc.SpriteFrame);
        a = __async_this;
        a._bgFrames = await __async_this.loadDir(e_local, "preload/bg", cc.SpriteFrame);
        r = __async_this;
        r._mahjongFrames = await __async_this.loadDir(e_local, "preload/mj", cc.SpriteFrame);
        c = __async_this;
        c._prefabs = await __async_this.loadDir(e_local, "preload/prefabs", cc.Prefab);
        t();
      } catch (__error_0_0) {
        s = __error_0_0;
        console.log(s);
        o(s);
      }
      return;
    });
  }
  async loadBgRes(e, t, o) {
    var n,
      a = this;
    n = e.map(function (o, n) {
      return EngineUtil.loadRemoteImg(o, ".jpg").then(function (e) {
        var t = o.substring(o.lastIndexOf("/") + 1, o.lastIndexOf("."));
        a._bgFrames[t] = e;
      }).catch(function (e) {
        console.error("Failed to load bg", e);
      }).finally(function () {
        t(n + 1, e.length);
      });
    });
    Promise.all(n).then(function () {
      o();
    }).catch(function (e) {
      console.error("Failed to load images", e);
      o();
    });
    return;
  }
  releaseAll() {
    for (var e = cc.assetManager.getBundle("resources"), t = 0; t < this._prefabs.length; t++) {
      this._prefabs[t].decRef();
      var o = "res/preload/prefabs/" + this._prefabs[t].name;
      e.release(o, cc.Prefab);
    }
    for (t = 0; t < this._iconFrames.length; t++) {
      this._iconFrames[t].decRef();
      o = "res/preload/icons/" + this._iconFrames[t].name;
      e.release(o, cc.SpriteFrame);
    }
  }
}
export var Res = ResourcesManager.getInstance();