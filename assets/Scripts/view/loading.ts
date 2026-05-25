// CryptoJS 在 assets/Scripts/framework/libs/CryptoJS.js，已设为「插件脚本」，由引擎注入全局，禁止在此 import，否则会报 Cannot find module。
import AudioManager from '../framework/controller/AudioManager';
import BaseSystem from '../framework/controller/BaseSystem';
import PlayerDataSys from '../framework/controller/PlayerDataSys';
import GlobaldataMgr from '../framework/data/GlobaldataMgr';
import BaseEventType from '../framework/controller/BaseEventType';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import AdManager from '../framework/Platform/AdManager';
import ClientData from '../framework/Event/ClientData';
import SdkHelper from '../framework/SdkHelper';
import EngineUtil from '../framework/EngineUtil';
import UrlMgr from '../service/UrlMgr';
import PageMgr from './PageMgr';
import GlobalDataSys from '../framework/controller/GlobalDataSys';
import HotUpdate from '../framework/Event/HotUpdate';
import { Res } from '../common/ResourcesManager';
import LaunchLoadScheduler from '../common/LaunchLoadScheduler';
import { NativeUtils } from '../wordframe/NativeUtils';
import { gameData } from '../data/GameData';
import LocalData from '../cyll/LocalData';
import GameConfig from '../data/GameConfig';
import OfflineService from '../service/OfflineService';
import LoadProgress, { LoadProgressType } from '../framework/components/LoadProgress';
import GameSystem from '../system/GameSystem';
import i18 from '../framework/LanguageMgr';
import LoadWord from '../wordframe/LoadWord';
import { A } from '../center/api';
import { MainConfig, ServerType } from '../config';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class loading extends cc.Component {
  @property(cc.Sprite)
  progress: cc.Sprite = null;

  @property(cc.JsonAsset)
  languageJsonData: cc.JsonAsset = null;

  @property(cc.Node)
  line: cc.Node = null;
  hasAgree = false;
  // @property(cc.Node)
  // gou: cc.Node = null;
  // @property(cc.Node)
  // showLogin: cc.Node = null;
  @property(cc.Node)
  back: cc.Node = null;
  @property(cc.Node)
  loading: cc.Node = null;
  @property(cc.Node)
  logo: cc.Node = null;
  @property(cc.Node)
  loadingNode: cc.Node = null;
  couldTouch = true;
  @property(LoadProgress)
  loadProgress: LoadProgress = null;
  get_middle_cfg_timer = null;
  get_oaid_timer = null;
  code = "";
  net_timer = null;
  fad = "";
  @property([cc.Node])
  fcmNodeList: Array<cc.Node> = [];
  onLoad() {

    if(MainConfig.curServerType == ServerType.develop)
    {
      cc.debug.setDisplayStats(true)
    }

    i18.init(this.languageJsonData.json,cc.sys.languageCode)

    /** 热重载 / 再次进入 loading 时释放上一轮预加载，避免重复占用 */
    Res.releaseLaunchAssets();
    LoadWord.releaseForLoadingRestart();

    if ("oppo" == SdkHelper.getChannelName() || "xiaomi" == SdkHelper.getChannelName() || "vivo" == SdkHelper.getChannelName() || "huawei" == SdkHelper.getChannelName() || "honor" == SdkHelper.getChannelName()) {
      this.logo.active = false;
      this.line.active = false;
    } else {
      this.logo.active = true;
      this.line.active = false;
    }
    AudioManager.getInstance().init();
    LocalData.getInstance().initData();
    this.addEvent();
    PageMgr.init();
    GlobalDataSys.init();
    this.preLoadPrefab();
    this.loadProgress.init();
    // Skip agreement/user notice popup on startup, go straight to loading flow.
    EngineUtil.setLocalData("user_agreement", "1");
    SdkHelper.initOtherSDK(true);
  }
  preLoadPrefab() {}
  getMiddleCfg() {
    var e = this,
      t = SdkHelper.getMiddleConfig();
    console.log("getMiddleConfig():" + t);
    if (t) this.onGetMiddleCfg(t);else {
      EventMgr.listen(BaseEventType.ON_GET_MIDDLE_CFG, this.onGetMiddleCfg, this);
      this.get_middle_cfg_timer && clearTimeout(this.get_middle_cfg_timer);
      this.get_middle_cfg_timer = setTimeout(function () {
        console.log("getMiddleConfig():默认");
        e.onGetMiddleCfg();
      }, 10000);
    }
  }
  onGetMiddleCfg(e = "{}") {
    console.log("onGetMiddleCfg():" + e);
    this.get_middle_cfg_timer && clearTimeout(this.get_middle_cfg_timer);
    EventMgr.ignore(BaseEventType.ON_GET_MIDDLE_CFG, this.onGetMiddleCfg, this);
    GlobaldataMgr.init_middle_config(e);
    this.fad = JSON.parse(e).fad || "mcda";
    this.getSystemConfig();
  }
  onDestroy() {
    this.removeEvent();
    /** 切到 mainScene 时 loading 销毁，游戏资源仍由 mainScene 使用，此处不 release */
  }
  addEvent() {
    EventMgr.listen(BaseEventType.SPLASH_FINISH, this.splashFinish, this);
    EventMgr.listen(GameEventType.WXLOGIN_FINISH, this.getUserInfo, this);
    EventMgr.listen(BaseEventType.GET_WECHAT_CODE, this.getWxCode, this);
    if (cc.sys.os == cc.sys.OS_ANDROID) {
      EventMgr.listen(BaseEventType.SDKINIT_FINISH, this.checkHotUpdate, this);
    } else {
      EventMgr.listen(BaseEventType.SDKINIT_FINISH, this.hotUpdate, this);
    }
  }
  removeEvent() {
    EventMgr.ignore(BaseEventType.GET_WECHAT_CODE, this.getWxCode, this);
    EventMgr.ignore(BaseEventType.SDKINIT_FINISH, this.hotUpdate, this);
    EventMgr.ignore(GameEventType.WXLOGIN_FINISH, this.getUserInfo, this);
    EventMgr.ignore(BaseEventType.SPLASH_FINISH, this.splashFinish, this);
  }
  splashFinish() {
    EventMgr.ignore(BaseEventType.SPLASH_FINISH, this.splashFinish, this);
    AdManager.getInstance().closeSplashAd();
    cc.sys.os == cc.sys.OS_IOS && this.autoLogin();
  }
  checkHotUpdate() {
    var e = this;
    EngineUtil.log("==========sdk初始化成功");
    console.log("==========sdk初始化成功");
    if (SdkHelper.getOAID()) {
      EngineUtil.log("==========直接获取到了oaid");
      console.log("==========直接获取到了oaid");
      this.hotUpdate();
    } else {
      EventMgr.listen(BaseEventType.ON_GET_OAID, this.onGetOAID, this);
      this.get_oaid_timer && clearTimeout(this.get_oaid_timer);
      this.get_oaid_timer = setTimeout(function () {
        EngineUtil.log("==========oaid超时");
        console.log("==========oaid超时");
        e.onGetOAID();
      }, 2000);
    }
  }
  onGetOAID() {
    if (this.get_oaid_timer) {
      clearTimeout(this.get_oaid_timer);
      this.get_oaid_timer = null;
    }
    EngineUtil.log("==========异步获取到了oaid");
    console.log("==========异步获取到了oaid");
    EventMgr.ignore(BaseEventType.ON_GET_OAID, this.onGetOAID, this);
    this.hotUpdate();
  }
  hotUpdate() {
    var e = this;
    this.loadProgress.startLoadProgress();
    BaseSystem.init();
    if (EngineUtil.getLocalData("b_first_show_agreement")) {
      EngineUtil.setLocalData("b_first_show_agreement", "");
      SdkHelper.reportData("b_first_show_agreement");
    }
    if (EngineUtil.getLocalData("show_agreement_report")) {
      EngineUtil.setLocalData("show_agreement_report", "");
      SdkHelper.reportData("b_click_enter");
    }
    if (EngineUtil.getLocalData("cancel_agreement_report")) {
      EngineUtil.setLocalData("cancel_agreement_report", "");
      SdkHelper.reportData("b_click_cancel");
    }
    var t = UrlMgr.getInstance().getVersionUrl(),
      o = ClientData.getVersionData();
    console.log("==========hotUpdate111");
    if (gameData.isOpenDemo) {
      this.init();
    } else {
      HotUpdate.getInstance().checkGrayUpdate(t + "?" + o, function (t) {
        if (t) {
          console.log("grayUpdate canUpdate");
          e.loadProgress.loadType = LoadProgressType.CheckHotUpdate;
          var o = 1 - e.loadProgress.curPercent,
            n = e.loadProgress.curPercent;
          e.loadProgress.stopFakeProgress();
          HotUpdate.getInstance().hotUpdate(function (t, a) {
            t < 0 && e.init();
            a && a.code == jsb.EventAssetsManager.UPDATE_PROGRESSION && (e.loadProgress.curPercent = n + a.file_percent * o);
          });
        } else e.init();
      });
    }
  }
  init() {
    this.getMiddleCfg();
  }
  getSystemConfig(e) {
    var t = this;
    // 本地调试开关：true 时跳过服务端 system config 请求
    var useLocalSystemConfig = true;
    var applyConfig = function (n) {
      if ("mcda" != t.fad) {
        n.is_reviewer = 1;
        SdkHelper.reportData("reviewerPost");
      }
      PlayerDataSys.setConfigReviewing(n);
      if (HotUpdate.getInstance().checkReviewVMVersion()) {
        t.fcmNodeList.forEach(function (e) {
          e.active = false;
        });
      } else {
        t.fcmNodeList.forEach(function (e, t) {
          if (3 == t && PlayerDataSys.isOppoReviewer()) {
            e.active = false;
          } else {
            e.active = false;
          }
        });
      }
      GlobaldataMgr.init(n);
      setTimeout(function () {
        SdkHelper.requestSMId();
      }, 2000);
      var a = GlobaldataMgr.reviewing_splash_ad,
        i = GlobaldataMgr.new_user;
      if (!a && !i) {
        AdManager.getInstance().showSplashAd(0);
        if (cc.sys.os == cc.sys.OS_IOS) return;
      }
      t.autoLogin();
    };
    if (useLocalSystemConfig) {
      var localConfigData = {
        activate: 1,
        config_data: {
          new_user: 1
        },
        element_conf: {},
        is_encrypt: false,
        is_reviewer: 0,
        map_conf: {},
        tongdun_info: '{"action":"activate"}'
      };
      e && EngineUtil.reconnectSuc();
      applyConfig(localConfigData);
      return;
    }
    BaseSystem.getSystemConfig().then(function (o) {
      e && EngineUtil.reconnectSuc();
      applyConfig(o.data);
    }).catch(function (o) {
      e && EngineUtil.reconnectFai();
      EngineUtil.httpErr(o, function (e) {
        t.getSystemConfig(e);
      });
    });
  }
  autoLogin(e) {
    var t = this;
    console.log("000000000000000000");
    var o = SdkHelper.requestTDId(),
      n = null;
    if (o && "not_init" !== o) {
      n || (n = {});
      n = {
        black_box: o
      };
    }
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      n || (n = {});
      n.bd_did = SdkHelper.getBD_did();
    }
    n && (n.yid = PlayerDataSys.getYid());
    BaseSystem.AutoLogin(n).then(function (o) {
      var n = "";
      o.data && (n = o.data.yid);
      console.log("autoLogin", o.data);
      e && EngineUtil.reconnectSuc();
      if (n) {
        PlayerDataSys.initUserId(o.data);
        t.getUserInfo();
      } else if (gameData.isOpenDemo) t.touristsLogin();else if (cc.sys.isBrowser || !cc.sys.isNative || HotUpdate.getInstance().checkReviewVMVersion()) t.touristsLogin();else {
        // t.showLogin.active = true;
        t.loading.active = false;
        SdkHelper.reportData("show_wx_login");
      }
    }).catch(function () {
      e && EngineUtil.reconnectFai();
    });
  }
  touristsLogin(e) {
    var t = this,
      o = null,
      n = SdkHelper.requestTDId();
    if (n && "not_init" !== n) {
      o || (o = {});
      o = {
        black_box: n
      };
    }
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      o || (o = {});
      o.bd_did = SdkHelper.getBD_did();
    }
    BaseSystem.touristsLogin(o).then(function (o) {
      e && EngineUtil.reconnectSuc();
      if (gameData.isOpenDemo) {
        PlayerDataSys.initUserId(o.data);
        t.getUserInfo();
      } else {
        if (-8888 == o.code) {
          // t.showLogin.active = true;
          t.loading.active = false;
          return;
        }
        if (cc.sys.isNative && !HotUpdate.getInstance().checkReviewVMVersion()) {
          // t.showLogin.active = true;
          t.loading.active = false;
        } else {
          PlayerDataSys.initUserId(o.data);
          t.getUserInfo();
        }
      }
    });
  }
  getUserInfo(e) {
    var t = this;
    // this.showLogin.active = false;
    this.loading.active = true;
    BaseSystem.getUserInfo().then(function (o) {
      console.log("user info--------------", o);
      e && EngineUtil.reconnectSuc();
      if (o && 1 == o.code) {
        var n = o.data,
          a = n.off_time;
        n.task_list;
        PlayerDataSys.offTime = a || 0;
        PlayerDataSys.setUserInfo(o.data);
        GameSystem.initGameConfig(o.data.conf_info);
        GameSystem.initCoinGoldInfo(o.data.level_desc_info);
        gameData.info = o.data;
        GameConfig.getInstance().paramConfig = o.data.conf_info.parameter_conf;
        GameConfig.getInstance().comboConfig = o.data.conf_info.combo_conf;
        GameConfig.getInstance().atlasConfig = o.data.conf_info.atlas_conf;
        GameConfig.getInstance().cardGroupConfig = o.data.conf_info.card_conf;
        gameData.coinBubbleTip = o.data.bubble_coin_balance;
        gameData.goldBubbleTip = o.data.bubble_gold_balance;
        OfflineService.loadLevelConf().then(function (levelConf) {
          GameConfig.getInstance().levelConfig = levelConf;
          t.checkReport();
        }).catch(function (err) {
          console.error("load level config failed", err);
          GameConfig.getInstance().levelConfig = o.data.conf_info.level_conf;
          t.checkReport();
        });
        return;
      }
    }).catch(function () {
      e && EngineUtil.reconnectFai();
    });
  }
  getAbTestInfo(e) {
    var t = this;
    BaseSystem.getAbTestInfo().then(function (o) {
      e && EngineUtil.reconnectSuc();
      o && 1 == o.code && o.data;
      t.loadScene();
    }).catch(function (o) {
      e && EngineUtil.reconnectFai();
      EngineUtil.httpErr(o, function (e) {
        t.getAbTestInfo(e);
      });
    });
  }
  checkReport() {
    var e = cc.sys.localStorage.getItem("user_LastAgreement");
    if (e) {
      BaseSystem.agreementForce({
        url: e,
        type: "user"
      });
      cc.sys.localStorage.removeItem("user_LastAgreement");
      SdkHelper.reportData("U_WATCH_RULE", {
        rule_type: "agreement"
      });
    }
    var t = cc.sys.localStorage.getItem("user_LastPrivacy");
    if (t) {
      BaseSystem.agreementForce({
        url: t,
        type: "privacy"
      });
      cc.sys.localStorage.removeItem("user_LastPrivacy");
      SdkHelper.reportData("U_WATCH_RULE", {
        rule_type: "privacy"
      });
    }
    SdkHelper.reportData("b_entry_page", {
      act_page: "loading_page"
    });
    this.loadScene();
  }
  shouldPreloadNewHand() {
    return NativeUtils.isFlag && null == cc.sys.localStorage.getItem("newHand");
  }

  finishLaunchPipeline(sceneName: string) {
    var self = this;
    if (!self.node || !cc.isValid(self.node)) return;
    self.loadProgress.curPercent = 1;
    self.loadProgress.snapSmoothToTarget();
    Res.markLaunchAssetsLoaded();
    A.l1(function () {
      console.log("l3。。。。。。。。。。。。。。。。。。", JSON.stringify(A.l3));
      console.log("l4。。。。。。。。。。。。。。。。。。", JSON.stringify(A.l4));
      A.t('g1');
      cc.director.loadScene(sceneName, function () {
        A.t('g2');
      });
    }, {
      m: function (mute: boolean) {
        AudioManager.getInstance().setMute(mute);
      },
    });
  }

  /** Web：并行加载，IO 压力小 */
  runParallelLaunch(sceneName: string) {
    var self = this;
    var STEP_COUNT = 4;
    var stepProgress = [0, 0, 0, 0];
    var reportProgress = function () {
      if (!self.node || !cc.isValid(self.node)) return;
      var sum = 0;
      for (var i = 0; i < STEP_COUNT; i++) {
        sum += stepProgress[i];
      }
      self.loadProgress.curPercent = sum / STEP_COUNT;
    };

    var preloadScenePromise = new Promise<void>(function (resolve, reject) {
      cc.director.preloadScene(sceneName, function (completed, total) {
        if (!total || total <= 0) return;
        stepProgress[0] = completed / total;
        reportProgress();
      }, function (err) {
        if (err) {
          reject(err);
          return;
        }
        stepProgress[0] = 1;
        reportProgress();
        resolve();
      });
    });

    var prefabsPromise = Res.loadLaunchPrefabs(function (dirIndex, p) {
      stepProgress[1 + dirIndex] = p;
      reportProgress();
    });

    var newHandPromise = self.shouldPreloadNewHand()
      ? LoadWord.preloadNewHand(function (p) {
          stepProgress[3] = p;
          reportProgress();
        })
      : Promise.resolve().then(function () {
          stepProgress[3] = 1;
          reportProgress();
        });

    var spritesPromise = Res.loadEssentialSprites();

    Promise.all([preloadScenePromise, prefabsPromise, newHandPromise, spritesPromise]).then(function () {
      self.finishLaunchPipeline(sceneName);
    }).catch(function (err) {
      console.error("loadScene pipeline (parallel)", err);
    });
  }

  /**
   * 原生 APK：串行 + 贴图分批 + 分帧让出主线程，避免 248 张牌面同帧 decode 卡死粒子/进度条。
   */
  runStagedNativeLaunch(sceneName: string) {
    var self = this;
    var STEP_COUNT = 5;
    var stepProgress = [0, 0, 0, 0, 0];
    var reportProgress = function () {
      if (!self.node || !cc.isValid(self.node)) return;
      var sum = 0;
      for (var i = 0; i < STEP_COUNT; i++) {
        sum += stepProgress[i];
      }
      self.loadProgress.curPercent = sum / STEP_COUNT;
    };

    LaunchLoadScheduler.applyDownloadThrottle();

    (async function () {
      try {
        await new Promise<void>(function (resolve, reject) {
          cc.director.preloadScene(sceneName, function (completed, total) {
            if (!total || total <= 0) return;
            stepProgress[0] = completed / total;
            reportProgress();
          }, function (err) {
            if (err) {
              reject(err);
              return;
            }
            stepProgress[0] = 1;
            reportProgress();
            resolve();
          });
        });
        await LaunchLoadScheduler.yieldFrames(2);

        await Res.loadLaunchPrefabs(function (dirIndex, p) {
          stepProgress[1 + dirIndex] = p;
          reportProgress();
        });
        await LaunchLoadScheduler.yieldFrames(2);

        await Res.loadEssentialSpritesStaged(function (p) {
          stepProgress[3] = p;
          reportProgress();
        });
        stepProgress[3] = 1;
        reportProgress();
        await LaunchLoadScheduler.yieldFrames(2);

        if (self.shouldPreloadNewHand()) {
          await LoadWord.preloadNewHand(function (p) {
            stepProgress[4] = p;
            reportProgress();
          });
        } else {
          stepProgress[4] = 1;
          reportProgress();
        }

        self.finishLaunchPipeline(sceneName);
      } catch (err) {
        console.error("loadScene pipeline (staged native)", err);
      } finally {
        LaunchLoadScheduler.restoreDownloadThrottle();
      }
    })();
  }

  loadScene() {
    var self = this;
    var sceneName = "mainScene";
    HotUpdate.getInstance().checkReviewVMVersion() && (sceneName = "SceneA");

    self.loadProgress.stopFakeProgress();
    self.loadProgress.loadType = LoadProgressType.LoadScene;
    self.loadProgress.curPercent = 0;
    var smoothMinSpeed = LaunchLoadScheduler.useStagedNativeLoad() ? 0.14 : 0.18;
    self.loadProgress.beginSmoothFollow(smoothMinSpeed, 6);
    Res.releaseLaunchAssets();

    if (LaunchLoadScheduler.useStagedNativeLoad()) {
      setTimeout(function () {
        AudioManager.getInstance().initNativeUrl();
      }, 0);
      self.runStagedNativeLaunch(sceneName);
    } else {
      AudioManager.getInstance().initNativeUrl();
      self.runParallelLaunch(sceneName);
    }
  }
  getWxCode(e) {
    console.log("SPK1", e);
    this.code = e;
    this.getWxInfo();
  }
  getWxInfo(e) {
    var t = this;
    console.log("SPK2");
    var o = SdkHelper.requestTDId();
    "not_init" != o && "failed" != o || (o = "");
    var n = {
      wechat_code: this.code,
      black_box: o
    };
    cc.sys.os === cc.sys.OS_ANDROID && (n.bd_did = SdkHelper.getBD_did());
    console.log("SPK3");
    BaseSystem.wechatLogin(n).then(function (o) {
      console.log("SPK4", o);
      if (-2015 == o.code) SdkHelper.showToast(o.message);else {
        e && EngineUtil.reconnectSuc();
        EngineUtil.log("微信登录成功");
        EngineUtil.log(o);
        PlayerDataSys.initWxData(o.data);
        SdkHelper.showToast("登录成功");
        t.getUserInfo();
        SdkHelper.reportData("wx_login_success");
      }
    }).catch(function (o) {
      console.log("SPK5");
      SdkHelper.reportData("wx_login_fail");
      e && EngineUtil.reconnectFai();
      EngineUtil.httpErr(o, function (e) {
        t.getWxInfo(e);
      });
    });
  }
  agree() {
    this.hasAgree = !this.hasAgree;
    // this.gou.active = this.hasAgree;
  }
  doWxLogin() {
    var e = this;
    if (this.couldTouch) {
      SdkHelper.reportData("click_wxlogin");
      SdkHelper.reportData("start_registration", null, true);
      this.couldTouch = false;
      this.unscheduleAllCallbacks();
      this.scheduleOnce(function () {
        e.couldTouch = true;
      }, 3);
      SdkHelper.callWxLogin();
    }
  }
  wxLogin() {
    if (this.hasAgree) this.doWxLogin();else {
      var e = function () {
        this.agree();
        this.doWxLogin();
      }.bind(this);
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wxTipPage",
        data: {
          type: "login",
          cb: e
        }
      });
    }
  }
  touch_user() {
    SdkHelper.reportData("u_click_user_agreement");
    var e = PlayerDataSys.getUserAgreementUrl(1);
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        is_first: true,
        title: "用户协议",
        url: e,
        index: 0
      },
      option: {
        reuse: false
      }
    });
  }
  touch_privacy() {
    SdkHelper.reportData("u_click_user_privacy");
    var e = PlayerDataSys.getPrivacyAgreementUrl();
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "webPage",
      data: {
        is_first: true,
        title: "隐私政策",
        url: e,
        index: 1
      },
      option: {
        reuse: false
      }
    });
  }
}