import PlayerDataSys from '../controller/PlayerDataSys';
import SdkHelper from '../SdkHelper';
class _GlobaldataMgr {
  reviewing = false;
  reviewing_splash_ad = false;
  new_user = 1;
  new_add_flag = 1;
  pauseTime = 0;
  is_encrypt = 0;
  gameStart_time = 0;
  inGuideFunc_5 = null;
  auth_type = false;
  reviewing_antian = false;
  reviewing_insert_ad = false;
  telResCongig = null;
  bgResCongfig = null;
  static _instance = null;
  static _getInstance() {
    this._instance || (_GlobaldataMgr._instance = new _GlobaldataMgr());
    return _GlobaldataMgr._instance;
  }
  init(e) {
    var t = e.config_data,
      o = e.activate,
      n = e.is_encrypt,
      i = e.element_conf,
      r = e.map_conf,
      c = t.new_user;
    this.new_user = c || 0;
    this.is_encrypt = n || 0;
    this.telResCongig = i;
    this.bgResCongfig = r;
    1 == o && SdkHelper.reportData("activate");
  }
  init_middle_config(e) {
    var t = JSON.parse(e),
      o = t.forbid_screen,
      i = t.forbid_red_envelope,
      r = t.ysdk_flag,
      c = t.antian_flag,
      s = t.new_add_flag;
    this.reviewing_splash_ad = void 0 === o || o;
    PlayerDataSys.is_reviewer = void 0 === i || i;
    this.auth_type = void 0 !== r && r;
    this.reviewing_antian = void 0 !== c && c;
    this.new_add_flag = void 0 !== s && s;
    !cc.sys.isBrowser && cc.sys.isNative || (this.reviewing = false);
    SdkHelper.reportData("loading_middleConfig", {
      new_add_flag: this.new_add_flag,
      reviewing_splash_ad: this.reviewing_splash_ad,
      reviewing: PlayerDataSys.is_reviewer,
      auth_type: this.auth_type,
      reviewing_antian: this.reviewing_antian
    });
  }
  reportData() {
    SdkHelper.reportData("main_middleConfig", {
      new_add_flag: this.new_add_flag,
      reviewing_splash_ad: this.reviewing_splash_ad,
      reviewing: this.reviewing,
      auth_type: this.auth_type,
      reviewing_antian: this.reviewing_antian
    });
  }
}
export default _GlobaldataMgr._getInstance();