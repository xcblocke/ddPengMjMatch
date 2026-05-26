import EngineUtil from '../framework/EngineUtil';
import LaunchLoadScheduler from './LaunchLoadScheduler';
import LoadWord from '../wordframe/LoadWord';
const {
  ccclass,
  property
} = cc._decorator;

type PrefabRecord = {
  prefab: cc.Prefab;
  dir: string;
};

@ccclass
export default class ResourcesManager {
  _iconFrames: cc.SpriteFrame[] = [];
  _mahjongFrames: cc.SpriteFrame[] = [];
  _prefabs: cc.Prefab[] = [];
  _bgFrames: cc.SpriteFrame[] = [];
  _prefabRecords: PrefabRecord[] = [];
  _launchAssetsLoaded = false;
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
    if (Array.isArray(this._bgFrames)) {
      return this._bgFrames.find(function (t) {
        return t && t.name == e;
      });
    }
    return this._bgFrames[e];
  }
  isLaunchAssetsLoaded() {
    return this._launchAssetsLoaded;
  }
  markLaunchAssetsLoaded() {
    this._launchAssetsLoaded = true;
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
  private releaseSpriteList(bundle: cc.AssetManager.Bundle, list: cc.SpriteFrame[], dirPath: string) {
    if (!bundle || !list || !list.length) return;
    for (var i = 0; i < list.length; i++) {
      var sf = list[i];
      if (!sf) continue;
      try {
        sf.decRef();
        bundle.release(dirPath + sf.name, cc.SpriteFrame);
      } catch (err) {
        console.warn("releaseSpriteList", dirPath, sf.name, err);
      }
    }
  }
  /** 加载并追加单个 Prefab 目录到缓存 */
  async appendPrefabsFromDir(dir: string): Promise<void> {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) {
      throw new Error("resources bundle not found");
    }
    var list = (await this.loadDir(bundle, dir, cc.Prefab)) as cc.Prefab[];
    if (!list || !list.length) return;
    for (var i = 0; i < list.length; i++) {
      this._prefabRecords.push({
        prefab: list[i],
        dir: dir
      });
      this._prefabs.push(list[i]);
    }
  }

  async loadSpriteDir(dir: string): Promise<void> {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) {
      throw new Error("resources bundle not found");
    }
    var list = (await this.loadDir(bundle, dir, cc.SpriteFrame)) as cc.SpriteFrame[];
    if (dir === "preload/icons") {
      this._iconFrames = list || [];
    } else if (dir === "preload/bg") {
      this._bgFrames = list || [];
    } else if (dir === "preload/mj") {
      this._mahjongFrames = list || [];
    }
  }

  /** 原生分批加载 preload/mj，不阻塞 UI 进度条 */
  async loadMahjongSpritesBatched(): Promise<void> {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) {
      throw new Error("resources bundle not found");
    }
    await new Promise<void>(function (resolve, reject) {
      bundle.preloadDir("preload/mj", cc.SpriteFrame, function () {}, function (err) {
        if (err) reject(err);
        else resolve();
      });
    }).catch(function () {});
    await LaunchLoadScheduler.yieldFrames(2);

    var infos = bundle.getDirWithPath("preload/mj", cc.SpriteFrame) || [];
    var paths: string[] = [];
    for (var i = 0; i < infos.length; i++) {
      if (infos[i] && infos[i].path) {
        paths.push(infos[i].path);
      }
    }
    if (!paths.length) {
      this._mahjongFrames = (await this.loadDir(bundle, "preload/mj", cc.SpriteFrame)) as cc.SpriteFrame[] || [];
      return;
    }

    var batchSize = 8;
    var mjFrames: cc.SpriteFrame[] = [];
    for (var start = 0; start < paths.length; start += batchSize) {
      var batch = paths.slice(start, start + batchSize);
      var batchAssets = await Promise.all(batch.map(function (assetPath) {
        return new Promise<cc.SpriteFrame>(function (resolve, reject) {
          bundle.load(assetPath, cc.SpriteFrame, function (err, asset) {
            if (err) reject(err);
            else resolve(asset as cc.SpriteFrame);
          });
        });
      }));
      for (var b = 0; b < batchAssets.length; b++) {
        if (batchAssets[b]) {
          mjFrames.push(batchAssets[b]);
        }
      }
      await LaunchLoadScheduler.yieldFrames(1);
    }
    this._mahjongFrames = mjFrames;
  }

  /**
   * 分步串行预加载（与进度条解耦）：场景 → prefabs → preload/prefabs → newHand → bg → mj → icons
   */
  async loadSequentialLaunch(sceneName: string, preloadNewHand: boolean): Promise<void> {
    var useNative = LaunchLoadScheduler.useStagedNativeLoad();
    if (useNative) {
      LaunchLoadScheduler.applyDownloadThrottle();
    }
    try {
      await new Promise<void>(function (resolve, reject) {
        cc.director.preloadScene(sceneName, function () {}, function (err) {
          if (err) reject(err);
          else resolve();
        });
      });
      await LaunchLoadScheduler.yieldFrames(useNative ? 2 : 0);

      await this.appendPrefabsFromDir("prefabs");
      await LaunchLoadScheduler.yieldFrames(useNative ? 1 : 0);

      await this.appendPrefabsFromDir("preload/prefabs");
      await LaunchLoadScheduler.yieldFrames(useNative ? 1 : 0);

      if (preloadNewHand) {
        await LoadWord.preloadNewHand();
      }
      await LaunchLoadScheduler.yieldFrames(useNative ? 1 : 0);

      await this.loadSpriteDir("preload/bg");
      await LaunchLoadScheduler.yieldFrames(useNative ? 1 : 0);

      if (useNative) {
        await this.loadMahjongSpritesBatched();
      } else {
        await this.loadSpriteDir("preload/mj");
      }
      await LaunchLoadScheduler.yieldFrames(useNative ? 1 : 0);

      await this.loadSpriteDir("preload/icons");
      this.markLaunchAssetsLoaded();
    } finally {
      if (useNative) {
        LaunchLoadScheduler.restoreDownloadThrottle();
      }
    }
  }

  /**
   * Loading 阶段预加载 resources 下两处 Prefab 目录，合并到 _prefabs。
   * @param onDirProgress (dirIndex, 0~1) dirIndex: 0=prefabs, 1=preload/prefabs
   */
  async loadLaunchPrefabs(onDirProgress?: (dirIndex: number, p: number) => void) {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) {
      throw new Error("resources bundle not found");
    }
    var dirs = ["prefabs", "preload/prefabs"];
    var all: cc.Prefab[] = [];
    var records: PrefabRecord[] = [];
    for (var i = 0; i < dirs.length; i++) {
      var list = (await this.loadDir(bundle, dirs[i], cc.Prefab, function (finished, total) {
        if (onDirProgress && total > 0) {
          onDirProgress(i, finished / total);
        }
      })) as cc.Prefab[];
      if (list && list.length) {
        for (var j = 0; j < list.length; j++) {
          records.push({
            prefab: list[j],
            dir: dirs[i]
          });
        }
        all = all.concat(list);
      }
      onDirProgress && onDirProgress(i, 1);
    }
    this._prefabRecords = records;
    this._prefabs = all;
  }

  /**
   * 主场景必需贴图。Web 可并行；原生请用 loadEssentialSpritesStaged。
   */
  async loadEssentialSprites(): Promise<void> {
    if (LaunchLoadScheduler.useStagedNativeLoad()) {
      return this.loadEssentialSpritesStaged();
    }
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) {
      throw new Error("resources bundle not found");
    }
    var dirs = [{
      path: "preload/icons",
      assign: function (self, list) {
        self._iconFrames = list || [];
      }
    }, {
      path: "preload/bg",
      assign: function (self, list) {
        self._bgFrames = list || [];
      }
    }, {
      path: "preload/mj",
      assign: function (self, list) {
        self._mahjongFrames = list || [];
      }
    }];
    var self = this;
    await Promise.all(dirs.map(function (dir) {
      return self.loadDir(bundle, dir.path, cc.SpriteFrame).then(function (list) {
        dir.assign(self, list as cc.SpriteFrame[]);
      });
    }));
  }

  /**
   * 原生分帧加载：先小图 bg/icons，麻将牌面按批 load + 每批让出主线程（避免 248 张同帧 decode）。
   * @param onProgress 0~1 整体贴图加载进度
   */
  async loadEssentialSpritesStaged(onProgress?: (p: number) => void): Promise<void> {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) {
      throw new Error("resources bundle not found");
    }
    var self = this;
    var report = function (p: number) {
      onProgress && onProgress(p > 1 ? 1 : p < 0 ? 0 : p);
    };

    var smallDirs = ["preload/icons", "preload/bg"];
    for (var s = 0; s < smallDirs.length; s++) {
      var smallList = (await this.loadDir(bundle, smallDirs[s], cc.SpriteFrame)) as cc.SpriteFrame[];
      if (smallDirs[s] === "preload/icons") {
        self._iconFrames = smallList || [];
      } else {
        self._bgFrames = smallList || [];
      }
      report((s + 1) / (smallDirs.length + 1) * 0.12);
      await LaunchLoadScheduler.yieldFrames(1);
    }

    await new Promise<void>(function (resolve, reject) {
      bundle.preloadDir("preload/mj", cc.SpriteFrame, function () {}, function (err) {
        if (err) reject(err);
        else resolve();
      });
    }).catch(function () {
      /* preload 失败仍尝试分批 load */
    });
    await LaunchLoadScheduler.yieldFrames(2);

    var infos = bundle.getDirWithPath("preload/mj", cc.SpriteFrame) || [];
    var paths: string[] = [];
    for (var i = 0; i < infos.length; i++) {
      if (infos[i] && infos[i].path) {
        paths.push(infos[i].path);
      }
    }

    if (!paths.length) {
      var fallback = (await this.loadDir(bundle, "preload/mj", cc.SpriteFrame)) as cc.SpriteFrame[];
      self._mahjongFrames = fallback || [];
      report(1);
      return;
    }

    var batchSize = 8;
    var mjFrames: cc.SpriteFrame[] = [];
    var mjBaseProgress = 0.12;

    for (var start = 0; start < paths.length; start += batchSize) {
      var batch = paths.slice(start, start + batchSize);
      var batchAssets = await Promise.all(batch.map(function (assetPath) {
        return new Promise<cc.SpriteFrame>(function (resolve, reject) {
          bundle.load(assetPath, cc.SpriteFrame, function (err, asset) {
            if (err) reject(err);
            else resolve(asset as cc.SpriteFrame);
          });
        });
      }));
      for (var b = 0; b < batchAssets.length; b++) {
        if (batchAssets[b]) {
          mjFrames.push(batchAssets[b]);
        }
      }
      report(mjBaseProgress + (Math.min(start + batch.length, paths.length) / paths.length) * (1 - mjBaseProgress));
      await LaunchLoadScheduler.yieldFrames(1);
    }

    self._mahjongFrames = mjFrames;
    report(1);
  }

  /** 释放 loading 阶段预加载的 SpriteFrame（icons / bg / mj） */
  releaseLaunchSprites() {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) return;
    this.releaseSpriteList(bundle, this._iconFrames, "preload/icons/");
    this.releaseSpriteList(bundle, this._mahjongFrames as cc.SpriteFrame[], "preload/mj/");
    if (Array.isArray(this._bgFrames)) {
      this.releaseSpriteList(bundle, this._bgFrames, "preload/bg/");
    }
    this._iconFrames = [];
    this._mahjongFrames = [];
    this._bgFrames = [];
  }

  /** 释放 loading 阶段预加载的 Prefab（按实际目录路径） */
  releaseLaunchPrefabs() {
    var bundle = cc.assetManager.getBundle("resources");
    if (!bundle) return;
    for (var i = 0; i < this._prefabRecords.length; i++) {
      var record = this._prefabRecords[i];
      if (!record || !record.prefab) continue;
      try {
        record.prefab.decRef();
        bundle.release(record.dir + "/" + record.prefab.name, cc.Prefab);
      } catch (err) {
        console.warn("releaseLaunchPrefabs", record.dir, record.prefab.name, err);
      }
    }
    this._prefabRecords = [];
    this._prefabs = [];
  }

  /**
   * 释放 loading 预加载的 resources 资源。
   * 仅在回到 loading、重新预加载、或退出对局前调用；mainScene 运行中勿调。
   */
  releaseLaunchAssets() {
    this.releaseLaunchSprites();
    this.releaseLaunchPrefabs();
    this._launchAssetsLoaded = false;
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
        var prefabList = await __async_this.loadDir(e_local, dirs[3].path, dirs[3].type, function (t, o) {
          u(3, t, o);
        });
        c._prefabs = prefabList as cc.Prefab[];
        c._prefabRecords = (prefabList as cc.Prefab[] || []).map(function (p) {
          return {
            prefab: p,
            dir: "preload/prefabs"
          };
        });
        onProgress && onProgress(1);
        __async_this.markLaunchAssetsLoaded();
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

  /** @deprecated 请使用 releaseLaunchAssets */
  releaseAll() {
    this.releaseLaunchAssets();
  }
}
export var Res = ResourcesManager.getInstance();
