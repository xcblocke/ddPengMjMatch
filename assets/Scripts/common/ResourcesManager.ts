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
  loadDir(e, t, o, n?) {
    return new Promise(function (a, r) {
      if (e) {
        var i = function (e, t) {
          if (e) {
            r(e);
          } else {
            a(t);
          }
        };
        if (n) {
          e.loadDir(t, o, n, i);
        } else {
          e.loadDir(t, o, i);
        }
      } else {
        r();
      }
    });
  }
  /**
   * 加载游戏运行所需 resources 子目录；onProgress 为整体 0~1，含每个 loadDir 内部进度（较平滑）
   */
  async loadGameRes(onProgress?: (p: number) => void) {
    var e = this;
    return new Promise(async function (t, o) {
      const __async_this = e;
      var e_local,
        n,
        a,
        r,
        c,
        s,
        dirs = [{
          path: "preload/icons",
          type: cc.SpriteFrame
        }, {
          path: "preload/bg",
          type: cc.SpriteFrame
        }, {
          path: "preload/mj",
          type: cc.SpriteFrame
        }, {
          path: "preload/prefabs",
          type: cc.Prefab
        }],
        totalDirs = dirs.length,
        u = function (dirIndex, finished, dirTotal) {
          if (!onProgress || !dirTotal || dirTotal <= 0) return;
          var p = (dirIndex + finished / dirTotal) / totalDirs;
          onProgress(p > 1 ? 1 : p);
        };
      try {
        e_local = cc.assetManager.getBundle("resources");
        n = __async_this;
        n._iconFrames = await __async_this.loadDir(e_local, dirs[0].path, dirs[0].type, function (t, o) {
          u(0, t, o);
        });
        a = __async_this;
        a._bgFrames = await __async_this.loadDir(e_local, dirs[1].path, dirs[1].type, function (t, o) {
          u(1, t, o);
        });
        r = __async_this;
        r._mahjongFrames = await __async_this.loadDir(e_local, dirs[2].path, dirs[2].type, function (t, o) {
          u(2, t, o);
        });
        c = __async_this;
        c._prefabs = await __async_this.loadDir(e_local, dirs[3].path, dirs[3].type, function (t, o) {
          u(3, t, o);
        });
        onProgress && onProgress(1);
        t(undefined);
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