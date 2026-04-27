import ClientData from './ClientData';
import PlayerDataSys from '../controller/PlayerDataSys';
export default class HotUpdate {
  _updating = false;
  _canRetry = false;
  _failCount = 0;
  _canUpdate = false;
  _checkListener = null;
  _updateListener = null;
  _baseVersion = null;
  _curVersion = null;
  _isOnlineRelease = null;
  static _instance = null;
  get canRetry() {
    return this._canRetry;
  }
  get failCount() {
    return this._failCount;
  }
  get canUpdate() {
    return this._canUpdate;
  }
  set checkListener(e) {
    this._checkListener = e;
  }
  set updateListener(e) {
    this._updateListener = e;
  }
  constructor() {
    if (!cc.sys.isBrowser && cc.sys.isNative) {
      this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
      cc.log("Storage path for remote asset : " + this._storagePath);
      this.versionCompareHandle = function (e, t) {
        console.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
        for (var o = e.split("."), n = t.split("."), a = 0; a < o.length; ++a) {
          var i = parseInt(o[a]),
            r = parseInt(n[a] || "0");
          if (i !== r) return i - r;
        }
        return n.length > o.length ? -1 : 0;
      };
      this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
      this._am.setVerifyCallback(function (e, t) {
        var o = t.compressed,
          n = t.md5,
          a = t.path;
        t.size;
        if (o) {
          console.log("Verification passed : " + a);
          return true;
        }
        console.log("Verification passed : " + a + " (" + n + ")");
        return true;
      });
      console.log("Hot update is ready, please check or directly update.");
    }
  }
  static getInstance() {
    this._instance || (this._instance = new HotUpdate());
    return this._instance;
  }
  checkCb(e) {
    this._canUpdate = false;
    cc.log("Code: " + e.getEventCode());
    switch (e.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        console.log("No local manifest file found, hot update skipped.");
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
        console.log("Fail to download manifest file, hot update skipped0.");
        break;
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        console.log("Fail to parse manifest file, hot update skipped0.");
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        console.log("Already up to date with the latest remote version.");
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        console.log("New version found, please try to update. (" + this._am.getTotalBytes() + ")");
        this._canUpdate = true;
        break;
      default:
        return;
    }
    this._am.setEventCallback(null);
    this._updating = false;
    this._checkListener && this._checkListener(this._canUpdate);
  }
  updateCb(e) {
    var t = false,
      o = false,
      n = e.getEventCode(),
      a = {
        code: n
      };
    switch (n) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        console.log("No local manifest file found, hot update skipped.");
        o = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        a.byte_percent = e.getPercent();
        a.file_percent = e.getPercentByFile();
        a.file_downloaded = e.getDownloadedFiles();
        a.file_total = e.getTotalFiles();
        a.byte_downloaded = e.getDownloadedBytes();
        a.byte_total = e.getTotalBytes();
        var i = e.getMessage();
        i && console.log("Updated file: " + i);
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
        console.log("Fail to download manifest file, hot update skipped1.");
        o = true;
        break;
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        console.log("Fail to parse manifest file, hot update skipped1.");
        o = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        console.log("Already up to date with the latest remote version.");
        o = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        console.log("Update finished. " + e.getMessage());
        t = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        console.log("Update failed. " + e.getMessage());
        this._updating = false;
        this._canRetry = true;
        o = true;
        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        console.log("Asset update error: " + e.getAssetId() + ", " + e.getMessage());
        o = true;
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        console.log("Asset decompress" + e.getMessage());
        o = true;
    }
    if (o) {
      this._am.setEventCallback(null);
      this._updating = false;
      if (this._updateListener) {
        this._updateListener(-1, a);
        this._updateListener = null;
      }
    } else if (t) {
      this._am.setEventCallback(null);
      var r = jsb.fileUtils.getSearchPaths(),
        c = this._am.getLocalManifest().getSearchPaths();
      console.log("newPaths", JSON.stringify(c));
      Array.prototype.unshift.apply(r, c);
      cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(r));
      jsb.fileUtils.setSearchPaths(r);
      this._updateListener = null;
      cc.audioEngine.stopAll();
      cc.game.restart();
    } else this._updateListener && this._updateListener(0, a);
  }
  retry() {
    if (!this._updating && this._canRetry) {
      this._canRetry = false;
      console.log("Retry failed Assets...");
      this._am.downloadFailedAssets();
    }
  }
  _initManifest() {
    if (cc.sys.isNative) {
      this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest("project.manifest");
      var e = this._am.getLocalManifest(),
        t = e ? e.getVersion() : "1.0.0.0";
      console.log("local manifest version", e ? e.getVersion() : "load failed");
      console.log("local version url", e ? e.getVersionFileUrl() : "load failed");
      this._curVersion = t;
      return t;
    }
  }
  getVersion() {
    return null != this._curVersion ? this._curVersion : cc.sys.isNative ? this._initManifest() : "1.1.5.2";
  }
  getBaseVersion() {
    if (null != this._baseVersion) return this._baseVersion;
    if (cc.sys.isBrowser || !cc.sys.isNative) return "1.1.5.2";
    if (!jsb.fileUtils.isFileExist("projectCfg.json")) return "";
    var e = jsb.fileUtils.getStringFromFile("projectCfg.json");
    console.log("getProjectCfg", e);
    if (null != e && "" != e) {
      var t = JSON.parse(e),
        o = "release" == t.version || "prod" == t.version;
      console.log("isRelease", o);
      this._isOnlineRelease = o;
      var n = t.base_version;
      console.log("BaseVersion", n);
      this._baseVersion = n;
      return n;
    }
    return "";
  }
  isOnlineRelease() {
    if (null != this._isOnlineRelease) return this._isOnlineRelease;
    if (cc.sys.isBrowser || !cc.sys.isNative) return false;
    if (!jsb.fileUtils.isFileExist("projectCfg.json")) return false;
    var e = jsb.fileUtils.getStringFromFile("projectCfg.json");
    console.log("getProjectCfg", e);
    if (null != e && "" != e) {
      var t = JSON.parse(e),
        o = "release" == t.version || "prod" == t.version;
      console.log("isRelease", o);
      this._isOnlineRelease = o;
      var n = t.base_version;
      console.log("BaseVersion", n);
      this._baseVersion = n;
      return o;
    }
    return false;
  }
  checkUpdate(e) {
    if (cc.sys.isNative) {
      if (this._updating) console.log("Checking or updating ...");else {
        this._am.setEventCallback(this.checkCb.bind(this));
        e && (this._checkListener = e);
        this._initManifest();
        if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
          this._am.checkUpdate();
          this._updating = true;
        } else console.log("Failed to load local manifest ...");
      }
    } else e && e(false);
  }
  hotUpdate(e) {
    if (!cc.sys.isBrowser && cc.sys.isNative) {
      e && (this._updateListener = e);
      if (this._am && !this._updating) {
        this._am.setEventCallback(this.updateCb.bind(this));
        this._initManifest();
        this._failCount = 0;
        this._am.update();
        this._updating = true;
      }
    } else e && e(-1, {});
  }
  getGrayVersion(e, t) {
    var o = new XMLHttpRequest();
    o.withCredentials = true;
    o.onreadystatechange = function () {
      if (4 == o.readyState) {
        console.log("xhr.responseText", o.responseText);
        if (o.status >= 200 && o.status < 400) {
          var e = o.responseText;
          if (e) {
            if (t) {
              console.log("返回版本信息");
              console.log(e);
              var n = JSON.parse(e);
              t(n);
            }
          } else {
            console.log("返回数据不存在");
            t && t({
              code: 0
            });
          }
        } else {
          console.log("xhr===", o.getAllResponseHeaders());
          console.log("xhr===>", o.getResponseHeader);
          console.log("热更请求失败");
          t({
            code: -1
          });
        }
      }
    };
    o.open("POST", e, true);
    o.setRequestHeader("Content-type", "multipart/form-data;boundary=AaB03x");
    o.send();
    o.addEventListener("abort", function () {
      cc.log("testlogin abort");
      console.log("热更请求中断");
      t({
        code: -1
      });
    });
    o.addEventListener("error", function () {
      cc.log("testlogin error");
      console.log("热更请求失败");
      t && t({
        code: -1
      });
    });
    o.addEventListener("timeout", function () {
      cc.log("testlogin timeout");
      console.log("热更请求超时");
      t && t({
        code: -1
      });
    });
  }
  checkGrayUpdate(e, t) {
    console.log("checkGrayUpdate", e);
    if (!cc.sys.isBrowser && cc.sys.isNative) {
      if (this._updating) console.log("Checking or updating ...");else {
        this._am.setEventCallback(this.checkCb.bind(this));
        t && (this._checkListener = t);
        this._initManifest();
        if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
          var o = this,
            n = this._storagePath + "_temp/version.manifest.temp",
            a = this._storagePath + "_temp/project.manifest.temp";
          this.getGrayVersion(e, function (e) {
            if (1 == e.code) {
              var i = new jsb.Downloader();
              i.createDownloadFileTask(e.url, n, "@temp_version");
              i.setOnTaskError(function (e, n, a, i) {
                console.log("errorCode = ", n);
                console.log("errorCodeInternal = ", a);
                console.log("errorStr = ", i);
                console.log("error task = ", e.identifier);
                o._updating = false;
                t && t(false);
              });
              i.setOnTaskProgress(function (e, t, o, n) {
                if ("@temp_manifest" == e.identifier) {
                  console.log("manifest downloaded ", t);
                  console.log("manifest total received", o);
                  console.log("manifest total expected ", n);
                } else {
                  console.log("version downloaded ", t);
                  console.log("version total received", o);
                  console.log("version total expected ", n);
                }
              });
              i.setOnFileTaskSuccess(function (e) {
                if ("@temp_manifest" == e.identifier) {
                  console.log("manifest download success");
                  var r = new jsb.Manifest(a);
                  o._am.loadRemoteManifest(r);
                } else {
                  console.log("version download success");
                  var c = (r = new jsb.Manifest(n)).getVersion();
                  jsb.fileUtils.removeFile(n);
                  console.log("local version", o._curVersion);
                  console.log("remote version", c);
                  if (o.versionCompareHandle(o._curVersion, c) < 0) {
                    console.log("tempManifest", a, r.getManifestFileUrl());
                    i.createDownloadFileTask(r.getManifestFileUrl(), a, "@temp_manifest");
                  } else {
                    o._updating = false;
                    t && t(false);
                  }
                }
              });
            } else {
              o._updating = false;
              t && t(false);
            }
          });
          this._updating = true;
        } else console.log("Failed to load local manifest ...");
      }
    } else t && t(false);
  }
  checkReviewVMVersion() {
    return !(!PlayerDataSys.is_reviewer || "vivo" != ClientData.channel_name.toLowerCase() && "xiaomi" != ClientData.channel_name.toLowerCase() && "huawei" != ClientData.channel_name.toLowerCase() && "honor" != ClientData.channel_name.toLowerCase());
  }
}