export default class LogUtil {
  _baseVersion = "";
  _isOnlineRelease = null;
  static _instance = null;
  static getInstance() {
    this._instance || (this._instance = new LogUtil());
    return this._instance;
  }
  getBaseVersion() {
    if (null != this._baseVersion) return this._baseVersion;
    if (cc.sys.isBrowser || !cc.sys.isNative) return "";
    if (!jsb.fileUtils.isFileExist("projectCfg.json")) return "";
    var e = jsb.fileUtils.getStringFromFile("projectCfg.json");
    if (null != e && "" != e) {
      var t = JSON.parse(e),
        o = "release" == t.version || "prod" == t.version;
      this._isOnlineRelease = o;
      var n = t.base_version;
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
    if (null != e && "" != e) {
      var t = JSON.parse(e),
        o = "release" == t.version || "prod" == t.version;
      this._isOnlineRelease = o;
      var n = t.base_version;
      this._baseVersion = n;
      return o;
    }
    return false;
  }
}