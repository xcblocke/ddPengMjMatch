import PlayerDataSys from './PlayerDataSys';
import SdkHelper from '../SdkHelper';
import EngineUtil from '../EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class AudioManager extends cc.Component {
  vibratorOpen = 0;
  bgOpen = 0;
  effectOpen = 0;
  _bgAudios = {};
  _effectAudio = {};
  _effectAudioisPlayArray = {};
  clipMap = new Map();
  nowGuideAudio = "";
  _nativeAudio = new Map();
  static get instance() {
    this._instance || (this._instance = new AudioManager());
    return this._instance;
  }
  static getInstance() {
    this._instance || (this._instance = new AudioManager());
    return this._instance;
  }
  init() {
    this._effectAudioisPlayArray = {};
    this.bgOpen = Number(EngineUtil.localStorageGetItem("bg_audio", "1"));
    this.effectOpen = Number(EngineUtil.localStorageGetItem("effect_audio", "1"));
    this.vibratorOpen = Number(EngineUtil.localStorageGetItem("vibratorOpen", "1"));
  }
  playCash(e) {
    console.log("播放赚钱相关语音:" + e);
    this.playMusic("makeMnSound/" + e);
  }
  stopCash(e) {
    this.stopMusic("makeMnSound/" + e);
  }
  playBtn() {
    this.playMusic("btntouch", false);
  }
  getMusicState() {
    return 1 == this.bgOpen;
  }
  getAudioState() {
    return 1 == this.effectOpen;
  }
  getVibratorState() {
    return 1 == this.vibratorOpen;
  }
  openVibrator() {
    EngineUtil.localStorageSetItem("vibratorOpen", "1");
    this.vibratorOpen = 1;
  }
  closeVibrator() {
    EngineUtil.localStorageSetItem("vibratorOpen", "0");
    this.vibratorOpen = 0;
  }
  openAudio() {
    EngineUtil.localStorageSetItem("effect_audio", "1");
    this.effectOpen = 1;
  }
  closeAudio() {
    EngineUtil.localStorageSetItem("effect_audio", "0");
    this.effectOpen = 0;
  }
  openBg() {
    EngineUtil.localStorageSetItem("bg_audio", "1");
    this.bgOpen = 1;
    PlayerDataSys.isOppoReviewer() || this.resumeMusic("bgm", true);
  }
  closeBg() {
    EngineUtil.localStorageSetItem("bg_audio", "0");
    this.bgOpen = 0;
    PlayerDataSys.isOppoReviewer() || this.pauseMusic("bgm", true);
  }
  playMusic(e, t = false, o = false, n?, a = 1) {
    this.playGuideVoice(e);
    console.log("播放背景音乐", e);
    o = !!o;
    t = !!t;
    var i = "sound/" + e,
      r = this,
      c = this.effectOpen,
      s = this.bgOpen;
    return new Promise(function (l) {
      cc.loader.loadRes(i, cc.AudioClip, function (i, u) {
        l({
          duration: (null == u ? void 0 : u.duration) || 0,
          clip: u
        });
        if ((0 != c || o) && (0 != s || !o)) if (i) console.log(i);else if (o) {
          r._bgAudios[e] = cc.audioEngine.playMusic(u, t);
          cc.audioEngine.setMusicVolume(0.3);
          n && n(r._bgAudios[e]);
        } else {
          r._effectAudio[e] = cc.audioEngine.playEffect(u, t);
          cc.audioEngine.setVolume(r._effectAudio[e], a);
          n && n(r._effectAudio[e]);
        }
      });
    });
  }
  playGuideVoice(e) {
    if (e.includes("guide_")) {
      this.stopMusic(this.nowGuideAudio, false);
      this.nowGuideAudio = e;
    }
    e.includes("unrepeat") && this.stopMusic(e, false);
  }
  playEffect(e, t) {
    if (0 != this.effectOpen) {
      var o = "sound/" + e;
      cc.loader.loadRes(o, cc.AudioClip, function (e, o) {
        if (e) {
          console.log(e);
          t && t();
        } else {
          var n = cc.audioEngine.playEffect(o, false);
          t && cc.audioEngine.setFinishCallback(n, function () {
            t && t();
          });
        }
      });
    } else t && t();
  }
  stopEffect(e) {
    this._effectAudio[e] && cc.audioEngine.stopEffect(this._effectAudio[e]);
  }
  stopMusic(e, t = false) {
    if (t = !!t) {
      cc.audioEngine.stopMusic();
    } else {
      cc.audioEngine.stop(this._effectAudio[e]);
    }
  }
  pauseMusic(e, t) {
    if (t = !!t) {
      cc.audioEngine.pauseMusic();
    } else {
      cc.audioEngine.pause(this._effectAudio[e]);
    }
  }
  resumeMusic(e, t) {
    if (t = !!t) {
      if (0 == this.bgOpen) return;
      if (!this._bgAudios[e]) {
        this.playMusic(e, true, true, null, 0.5);
        return;
      }
      cc.audioEngine.resumeMusic();
    } else {
      if (0 == this.effectOpen) return;
      cc.audioEngine.resume(this._effectAudio[e]);
    }
  }
  initNativeUrl() {
    var e = this;
    cc.resources.loadDir("sound/native", cc.AudioClip, function (t, o) {
      if (t) {
        console.log(t.name, t.message, t.stack);
      } else {
        o.forEach(function (t) {
          cc.log("name:" + t.name + "    ");
          var o = cc.assetManager.utils.getUuidFromURL(t.nativeUrl),
            n = cc.assetManager.utils.getUrlWithUuid(o, {
              isNative: true,
              nativeExt: ".mp3"
            });
          e._nativeAudio.set(t.name, n);
        });
      }
    });
  }
  playNativeMusic(e) {
    console.log("playNativeAudio:>>" + e);
    if (!cc.sys.isBrowser && cc.sys.isNative) {
      var t = this._nativeAudio.get(e);
      t && SdkHelper.playNativeAudio(t);
    } else this.playMusic("native/" + e);
  }
  playBtnEffect() {
    this.playMusic("btntouch", false);
  }
  playAudioQueue(e, t) {
    var o = this;
    if (e && 0 !== e.length) {
      var n = [...e],
        a = function a() {
          if (0 !== n.length) {
            var e = n.shift();
            o.playMusic(e, false, false, function (e) {
              cc.audioEngine.setFinishCallback(e, function () {
                a();
              });
            });
          } else t && t();
        };
      a();
    } else t && t();
  }
}