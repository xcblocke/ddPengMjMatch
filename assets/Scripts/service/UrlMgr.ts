import HotUpdate from '../framework/Event/HotUpdate';
export default class UrlMgr {
  _urlMap = new Map();
  baseAndroidUrl = ""//http://ddfc-t.starrevs.com/";
  baseUrl = ""//http://ddfc-t.starrevs.com/";
  baseTestUrl = ""//http://backend-debug1.huixuanjiasu.com/ddfc/";
  versionUrl = ""//https://update.starrevs.com/hot_update";
  versionTestUrl = ""//http://version-debug.huixuanjiasu.com/update/hot_update";
  confmeTestUrl = ""//http://config-middle-end.huixuanjiasu.com/conf/";
  confmeUrl = ""//https://confme.starrevs.com/";
  static getInstance() {
    return UrlMgr._instance ? UrlMgr._instance : UrlMgr._instance = new UrlMgr();
  }
  getConfmeUrl(e) {
    return this.getConfmeBaseUrl() + this.getUri(e);
  }
  getConfmeBaseUrl() {
    return this.confmeUrl;
  }
  getBaseUrl() {
    return HotUpdate.getInstance().isOnlineRelease() ? cc.sys.os === cc.sys.OS_ANDROID ? this.baseAndroidUrl : this.baseUrl : this.baseTestUrl;
  }
  getVersionUrl() {
    return HotUpdate.getInstance().isOnlineRelease() ? this.versionUrl : this.versionTestUrl;
  }
  genUrl(e) {
    return this.getBaseUrl() + e;
  }
  getUrl(e) {
    var t = this._urlMap.get(e);
    if (null == t) {
      t = this.genUrl(this.getUri(e));
      this._urlMap.set(e, t);
    }
    return t;
  }
  getUri(e) {
    return e;
  }
}