import AudioManager from './framework/controller/AudioManager';
export class UiManager {
  static addButtonListen(e, t, o, a = 0, i = "click") {
    if (e) {
      var r = e.getComponent(cc.Button);
      r || ((r = e.addComponent(cc.Button)).transition = cc.Button.Transition.SCALE);
      e.on("click", function () {
        AudioManager.getInstance().playMusic(i);
        if (t) {
          t.bind(o)();
          if (a) {
            r.interactable = false;
            setTimeout(function () {
              cc.isValid(r) && (r.interactable = true);
            }, a);
          }
        }
      }, o);
    }
  }
  static loaderView(e, t, o, n = 0) {
    cc.resources.load("prefabs/" + t, cc.Prefab, function (a, i) {
      if (a) cc.error(a);else {
        var r = cc.instantiate(i);
        e.addChild(r, n);
        r.addComponent(t + "Ctrl");
        o && r.getComponent(t + "Ctrl").initData(o);
      }
    });
  }
  static loadSpriteFrame(e, t, o) {
    cc.resources.load("imgs/" + t + "/" + o, cc.SpriteFrame, function (t, o) {
      if (t) {
        cc.error(t);
      } else {
        e && e.getComponent(cc.Sprite) && (e.getComponent(cc.Sprite).spriteFrame = o);
      }
    });
  }
  static loadSpine(e, t, o, n) {
    cc.resources.load(t + "/" + o, sp.SkeletonData, function (t, o) {
      if (t) cc.error(t);else if (e && e.getComponent(sp.Skeleton)) {
        e.getComponent(sp.Skeleton).skeletonData = o;
        n && n();
      }
    });
  }
  static loaderHead(e, t, o = 100) {
    cc.assetManager.loadRemote(e, function (e, n) {
      if (!e) {
        t.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n);
        t.scale = o / t.getContentSize().width;
      }
    });
  }
}