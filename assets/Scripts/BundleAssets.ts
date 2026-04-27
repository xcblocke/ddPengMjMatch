class _BundleAssets {
  bundle = null;
  static _getInterface() {
    _BundleAssets._interface || (_BundleAssets._interface = new _BundleAssets());
    return _BundleAssets._interface;
  }
  load_asset() {
    var e = this;
    return new Promise(function (t, o) {
      cc.assetManager.loadBundle("http://klxyx-static.fingerscloud.com/asset/red", function (n, a) {
        if (n) {
          console.error("加载bundleError", n);
          o(n);
        } else {
          e.bundle = a;
          t({
            msg: "success"
          });
        }
      });
    });
  }
  get_asset(e) {
    var t = this;
    return new Promise(function (o, n) {
      if (t.bundle) {
        t.bundle.load(e, function (t, a) {
          if (t) {
            console.error("加载图片资源错误url:" + e, t);
            n();
          }
          o(a);
        });
      } else {
        n();
      }
    });
  }
  loadSpriteFrame(e, t) {
    this.get_asset(t).then(function (t) {
      e.spriteFrame = new cc.SpriteFrame(t);
    });
  }
}
export default _BundleAssets._getInterface();