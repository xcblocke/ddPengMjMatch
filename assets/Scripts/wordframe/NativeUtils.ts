// import DataManager, { HttpHeaderMessage } from "../managers/DataManager";
// import { NativeConsts } from "./NativeConsts";
// import GameUtils from "../utils/GameUtils";
// import GameLocalData from "../../GameLocalData/GameLocalData";
// import { SoundManager } from "../managers/SoundManager";

import { A } from "../centerio/api";
// import { ABJCUHDNRYIUEHTY } from "../center/s/res/ABJCUHDNRYIUEHTY";
// import { KQXVTR } from "../center/s/res/WLHOXV/CFADZEMOSF";
// import { TFAKQV } from "../center/s/res/WLHOXV/DHXVGZ";
// import { LZOBXGFV } from "../center/s/res/WLHOXV/HIQKRWUDWPTWRCTP";
// import { DZAVKRLJX } from "../center/s/res/WLHOXV/IGMAQGKUE";
// import { LWSUGNQUXE } from "../center/s/res/WLHOXV/LWSUGNQUXE";
// import { TGGOQXX } from "../center/s/res/WLHOXV/MXTJMJNIZS";
// import { JSHKSGNZCJVKYP } from "../center/s/res/WLHOXV/NFBLZE";
// import { PKQEEMPEWUHK } from "../center/s/res/WLHOXV/UKEDQR";
// import { CXADIVYSYQD } from "../center/s/res/WLHOXV/XSRXPN";
// import { GameAd } from "../center/s/res/ZAFDBPSZSUQVJ";
import AudioManager from "../framework/controller/AudioManager";
import { HttpHeaderMessage } from "./DataManager";
import GameUtils from "./GameUtils";
import { NativeConsts } from "./NativeConsts";


// import GamePlayData from "../../Record/GamePlayData";

// import { Matriarchalism } from "../../frame/Matriarchalism";
// import { GameAd } from "../../frame/resource/IWEFFXGF";
// import { RYXEVKXNMYWRMFZ } from "../../frame/resource/RYXEVKXNMYWRMFZ";
// import { OOOAHMWI } from "../../frame/resource/ZVFSKANVEANP/CGAKGTMLPJDEG";
// import { DPLJTUSFWNOV } from "../../frame/resource/ZVFSKANVEANP/OLBUZCC";
// import { WYPXSHGX } from "../../frame/resource/ZVFSKANVEANP/PKAORZ";
// import { NVLMXWSWIJTJYBCU } from "../../frame/resource/ZVFSKANVEANP/XJERTBCSBE";
// import { XQWSBIXZWQ } from "../../frame/resource/ZVFSKANVEANP/XNYRNXLEREHDUSEE";
// import { PBOMPFLXVKNBAQER } from "../../frame/resource/ZVFSKANVEANP/PBOMPFLXVKNBAQER";
// import { SMLLRZVYMCRD } from "../../frame/resource/ZVFSKANVEANP/YBOIRKXZCTFGZIPH";
// import { FLQEVZZR } from "../../frame/resource/ZVFSKANVEANP/OZCBVDMAIH";




export class NativeUtils {
  static gameName = "Mahjong Pair Drift";
  static _mapNativeCallback = { vCall: function () { }, iCall: function () { } };
  static _lastKeyBackTime = null;
  static _cocosInitTimeoutId = null;
  static readonly PRIVACY_URL = "https://linwept.com/privacy.html";
  static no_video: boolean = false; //是否不要看视频
  static gameCode = "sdymjmatch";
  static gamepg = "com.bluemahjong.pair.spark";
  /**登录用的 */
  static isFlag_login = false;

  /**自己用的标记 */
  static get isFlag() {
    console.log("isFlag 11。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。", A.l2);
    // return true;
    // return false;
    return A.l2;
  }
  /** 关卡配置 resources 路径（不含扩展名）：isFlag 用 level_b.json，否则 Level.json */
  static get levelConfigResPath() {
    return NativeUtils.isFlag ? "config/level_data_b" : "config/level_data_a";
  }
  /**是否无视兑换开关*/
  static isFlag_wushi = true




  static onInitCal: Function = null;

  static cocosInit(callback) {
    // this._mapNativeCallback[NativeConsts.appInfo] = callback;
    // this._cocosInitTimeoutId && clearTimeout(this._cocosInitTimeoutId);
    // this._cocosInitTimeoutId = null;
    // var t = this;

    // NativeUtils.onInitCal = callback;
    // this.cocosInitCallback(JSON.stringify(new HttpHeaderMessage()));
    // // let doc = RYXEVKXNMYWRMFZ.EDAUYF().WRSSEDLTLLLEUZ(NativeUtils.gamepg)
    // let doc = ABJCUHDNRYIUEHTY.OTKPRUM().DPCIANOFTVGS(NativeUtils.gamepg) 
    // console.log(doc);
    // if (!cc.sys.isNative) {
    //   callback && callback();
    //   return;
    // }
    // // SDK初始化，必须   ps: "包名" 需要替换成自己真实的包名
    // // RYXEVKXNMYWRMFZ.EDAUYF().MCCMPJDDBRTLKTV(NativeUtils.gamepg);
    // ABJCUHDNRYIUEHTY.OTKPRUM().APLGVLNQXUOGIXLE(NativeUtils.gamepg);  

    // //兑换开关
    // // RYXEVKXNMYWRMFZ.EDAUYF().LWPWVIULFOE().AZFQVVJKFHBTA(new MyThemeListener());
    // ABJCUHDNRYIUEHTY.OTKPRUM().LOXKZMS().QFTBNJ(new MyThemeListener());
    // // 用户邀请码
    // // RYXEVKXNMYWRMFZ.EDAUYF().YNYRIYEYFOMOGDZN().AXITDJHEGRCJQ(new MyInviteCodeListener())
    // ABJCUHDNRYIUEHTY.OTKPRUM().QIZRKRUOQY().HTJGJHP(new MyInviteCodeListener())

    // // 设置视频广告监听
    // // RYXEVKXNMYWRMFZ.EDAUYF().YJWUTRJCABQ().KPASQGZZYXZPEC(new MyVideoAdListener());
    // // RYXEVKXNMYWRMFZ.EDAUYF().COPCNCNCIJTPKFX().HVWOJJLJCWR(new MyInterstitialAdListener());
    // // RYXEVKXNMYWRMFZ.EDAUYF().ZEWJNCMOOPLJLZGL().YFDDSU(new MyBannerListener());
    // // RYXEVKXNMYWRMFZ.EDAUYF().TIXTNHYDEVEC().XDCQOK(new MyLauncherListener());

    // ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().OIWXAWIZI(new MyBannerListener());
    // ABJCUHDNRYIUEHTY.OTKPRUM().LWYONFHPJYNECVHN().JXVKMEPVGCBVK(new MyLauncherListener());
    // ABJCUHDNRYIUEHTY.OTKPRUM().UTPKRWEZLFHMYSR().YZYXAKSDWXOLJ(new MySplashListener());
    // ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().CZOFLOMIINJO(new MyVideoAdListener());
    // ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().PFHARDSYU(new MyInterstitialAdListener());

    // //自定义配置监听
    // // RYXEVKXNMYWRMFZ.EDAUYF().WXOFWAZPXBYMHB().KYLSEVJYPTD(new MyCpClientListener());
    // ABJCUHDNRYIUEHTY.OTKPRUM().YAOLFR().ANRVFUXTLL(new MyCpClientListener());
    // NativeUtils.onInitCal && NativeUtils.onInitCal();

  }




  static cocosInitCallback(e) {
    this._cocosInitTimeoutId && clearTimeout(this._cocosInitTimeoutId);
    this._cocosInitTimeoutId = null;
    var t = null;
    try {
      t = JSON.parse(e);
    } catch (a) {
      console.error("NativeUtils.cocosInitCallback JSON parse error", a, e);
      t = new HttpHeaderMessage();
    }
    if (this._mapNativeCallback[NativeConsts.appInfo]) {
      this._mapNativeCallback[NativeConsts.appInfo](t);
      this._mapNativeCallback[NativeConsts.appInfo] = null;
      delete this._mapNativeCallback[NativeConsts.appInfo];
    }
  }




  static appVer: string = "1.0.8"
  static id: string = "";
  /**
   * 版本号
   */
  static getAppVersion() {
    // if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
    //   ver = jsb.reflection.callStaticMethod(IWordsortSample.WorditaireMatrixSort, IWordsortSample.ComponentWorditaireMatrixSortResearch);
    //   NativeUtils.appVer = ver;
    //   return ver;
    // }
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
      NativeUtils.appVer = jsb.reflection.callStaticMethod('org.cocos2dx.javascript.AppActivity', 'getVersion', '()Ljava/lang/String;');
      return NativeUtils.appVer;
    }
    return NativeUtils.appVer;
  }
  /**
   * 邀请码
   */
  static getUid() {
    // if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
    //   NativeUtils.id = jsb.reflection.callStaticMethod(IWordsortSample.WorditaireMatrixSort, IWordsortSample.ComponentWorditaireMatrixSortFish);
    // }
    return NativeUtils.id;
  }




  static vibrate(time:number = 50) {
    let on = AudioManager.getInstance().getVibratorState()
    if (!on) return;

    if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
      time = 1000
      // jsb.reflection.callStaticMethod(IWordsortSample.WorditaireMatrixSort, IWordsortSample.ComponentWorditaireMatrixSortMuffle, String(e), "");
    }
    if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
      if (time == 1000) time = 30;
      if (time > 1000) time = 50;
      // jsb.reflection.callStaticMethod('org.cocos2dx.javascript.AppActivity', 'vibrate', '(I)V', time);
      A.v(time);
    }
  }

  /**WW通用事件上报 */
  public static wwylogComm(eventName: string, properties: { [key: string]: any } = null) {
    // let value = JSON.stringify(properties)
    // if (cc.sys.os == cc.sys.OS_IOS) {
    //   jsb.reflection.callStaticMethod(IWordsortSample.WorditaireMatrixSort, IWordsortSample.ComponentWorditaireMatrixSortFocalize, eventName, value);
    // }
    console.log(eventName + " ===" + JSON.stringify(properties));
        // RYXEVKXNMYWRMFZ.EDAUYF().TALAHPFEFGPDSYJ().VBEJFDOYOEJDQAR(eventName, properties);
        A.t(eventName, properties);
  }

  /*、PP卡事件上报 */
  public static wwylogPP(eventName: number) {
    // if (cc.sys.os == cc.sys.OS_IOS) {
    //   jsb.reflection.callStaticMethod(IWordsortSample.WorditaireMatrixSort, IWordsortSample.ComponentWorditaireMatrixSortDredge, String(eventName), "");
    // }
    // if (cc.sys.isNative) {
    //   switch (eventName) {
    //       case 5:
    //           // pp卡卡槽展示
    //           LWSUGNQUXE.SJQDXS();
    //       case 6:
    //           // pp卡弹窗展示
    //           LWSUGNQUXE.ILDZNU();
    //       case 7:
    //           // pp卡点击领取
    //           LWSUGNQUXE.AIIIBCZPPOPDB();
    //       case 8:
    //           // pp卡领取成功
    //           LWSUGNQUXE.QFYSSNZC();
    //       case 9:
    //           // pp卡免费奖励展示
    //           LWSUGNQUXE.AIKSAGONK();
    //       case 10:
    //           // pp卡免费奖励点击
    //           LWSUGNQUXE.FOLGBKBJ();
    //       case 11:
    //           // pp卡免费奖励领取成功
    //           LWSUGNQUXE.CNLBWNB();
    //       case 12:
    //           // 显示游戏界面（冷启动后引擎载入后的第一屏）
    //           LWSUGNQUXE.YUNGCU();
    //       case 13:
    //           // 显示游戏界面（冷启动后引擎载入后的第一屏）,并展示开屏
    //           LWSUGNQUXE.QWXMVQR();

    //   }
    //}
  }
  static customConfig = null;
  /**WWY 自定义配置 */
  static counstFunc() {
    return this.customConfig;
  }
  //-----------广告-----------------

  static placement = null;


  static succBack: (str?: string) => void = null;
  static failBack: (str?: string) => void = null;
  /**广告成功执行回调 */
  static executeAdSucc(str?: string) {
    // AudioUtil.getInstance().resumeBGM();
    cc.director.emit("videosuc");
    NativeUtils.succBack && NativeUtils.succBack(str);
    NativeUtils.succBack = null;
    NativeUtils.placement = null;
  }
  /**广告失败执行回调 */
  static executeAdFail(str?: string) {
    // AudioUtil.getInstance().resumeBGM();
    NativeUtils.failBack && NativeUtils.failBack(str);
    NativeUtils.failBack = null;
    NativeUtils.placement = null;
  }

  ///////////////广告///////////////////////////////////
  static isVideoCop = false;
  static adName = null;
  /**获取广告的‘预加载’状态 */


  static hasVideo() {
    // let hasVideo = RYXEVKXNMYWRMFZ.EDAUYF().YJWUTRJCABQ().BBXGIZAER("game");
    // let hasVideo = ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().SBHXPPIA("game");
    // return hasVideo;
}


  static showVideoAd() {
    // let failstr = "No ads yet"
    // NativeUtils.isVideoCop = false;
    // // 播放视频广告,如果广告无填充，返回false。有填充返回true并且播放广告
    // // let showVideo = RYXEVKXNMYWRMFZ.EDAUYF().YJWUTRJCABQ().BDYHWSA("game");
    // let showVideo = ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().VDNFQPXDYDU("game");
    // if (!showVideo) {
    //     GameUtils.getInstance().showToast({text:failstr});
    //     NativeUtils.executeAdFail("fail");
    //     return;
    // }
  }
  static hasInterstitial() {
    // let isReady = RYXEVKXNMYWRMFZ.EDAUYF().COPCNCNCIJTPKFX().KLCWCUOMW("game");
    // let isReady = ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().UNVQTFRLZRFEUC("game");
    // return isReady;
}

  static showInterstitialAd() {
    // let isReady = NativeUtils.hasInterstitial();
    // if (!isReady) {
    //     NativeUtils.executeAdFail("fail");
    //     return;
    // }
    // // RYXEVKXNMYWRMFZ.EDAUYF().COPCNCNCIJTPKFX().OZHGGQNGGD("game");
    // ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().DTSYWGMBSCYN("game");
  }

  static getDevi() {
    return null;
}

//-----------广告-----------------

static showBanner(x: number = 0, y: number = 0, w: number = 0) {
    // if (cc.sys.os == cc.sys.OS_ANDROID) {
    //   // RYXEVKXNMYWRMFZ.EDAUYF().ZEWJNCMOOPLJLZGL().FPQXTDYX(x, y);
    //   ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().LWKWCWTTHPNLFLLU(x, y);
    // }
}


static closeBanner() {
    // if (cc.sys.os == cc.sys.OS_ANDROID) {
    //   // RYXEVKXNMYWRMFZ.EDAUYF().ZEWJNCMOOPLJLZGL().WIORIQMVDHGXIODI();
    //   ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().YJFRMBUZHYRTKW();
    // }
}



///////////////广告///////////////////////////////////





  static sdyLog(logType: number | string, logValue: any = ""): void {


    if (CC_PREVIEW) {
      console.log("[SDYLog]", logType, logValue);
      // return;
    }

    if (NativeConsts.isIOS) {
      // try {p
      //   jsb.reflection.callStaticMethod(
      //     IWordsortSample.WorditaireMatrixSort,
      //     IWordsortSample.ComponentWorditaireMatrixSortMapout,
      //     String(logType),
      //     logValue || ""
      //   );
      //   return;
      // } catch (e) {
      //   console.warn("NativeUtils.sdyLog iOS reflection failed, fallback to sensorHit", e);
      // }
    }else{
      // Matriarchalism.instance.trachelectomyRanchlikePrudity(logType, logValue);
      A.t(logType.toString(), logValue);
    }

  }

  static openUrlByOfficer(url: string): void {
    const u = (url || "").trim();
    if (!u) return;

    if (cc.sys.isBrowser) {
      cc.sys.openURL(u); 
      return;
    }

    if (NativeConsts.isIOS) {
      // try {
      //   jsb.reflection.callStaticMethod(
      //     IWordsortSample.WorditaireMatrixSort,
      //     IWordsortSample.ComponentWorditaireMatrixSortVisualize,
      //     u,
      //     ""
      //   );
      //   return;
      // } catch (e) {
      //   console.warn("NativeUtils.openUrlByOfficer iOS reflection failed", e);
      // }
    }

    cc.sys.openURL(u); 
  }

  static openPrivacyUrl(): void {
    this.openUrlByOfficer(NativeUtils.PRIVACY_URL);
  }


  static Rsa(e, t) {
    var a = JSON.stringify(e);
    console.log("RSA payload =", a);
    t(e.data); 
  }


  static deviceVibrate(time = 30) {
    if(AudioManager.getInstance().getVibratorState()){
      if(cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        if (time == 1000) time = 30;
        if (time > 1000) time = 50;
        jsb.reflection.callStaticMethod('org.cocos2dx.javascript.AppActivity', 'vibrate', '(I)V', time);
      }
    } 
  } 
}






// // 用户邀请码
// class MyInviteCodeListener implements TGGOQXX {

//   OHJYRTEFQ(LNLEZKFUQVZWI: string) {
//         // 这里可以获取到需要的邀请码
//         NativeUtils.id = LNLEZKFUQVZWI;
//   }
// }

// //兑换开关
// // class MyThemeListener implements WYPXSHGX {

// //   SONNUDVLRJQHDZPA(newTheme: boolean) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[Listener] newTheme: " + newTheme);
// //       cc.director.emit("isFlag_login", newTheme);
// //   }

// // }

// class MyThemeListener implements TFAKQV {
//   BEYPQAXUZUQC(newTheme: boolean) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[Listener] newTheme: " + newTheme);
//       cc.director.emit("isFlag_login", newTheme);
//   }

// }



// // 设置视频广告监听


// // class MyVideoAdListener implements SMLLRZVYMCRD {
// //   EPNHQZ(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoAdStart: " + par_ad_par.entry);
// //       // Layer_load.hideload();
// //       // AudioUtil.getInstance().stopBGM();
// //       NativeUtils.isVideoCop = false;
// //       NativeUtils._mapNativeCallback.vCall();
// //       Matriarchalism.instance.indispositions("ad_success")
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "impression" ,type:"video",placement:NativeUtils.placement});
// //   }
// //   CGNZUZUMGUFEMFTY(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoClick: " + par_ad_par.entry);
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "click" ,type:"video",placement:NativeUtils.placement});
// //   }
// //   NAYNNPWDW(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoClose: " + par_ad_par.entry);
// //       // Layer_load.hideload();
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "close" ,type:"video",placement:NativeUtils.placement});
// //       if (!NativeUtils.isVideoCop) {
// //           //没有播完
// //           NativeUtils.executeAdFail();
// //       } else {
// //           NativeUtils.executeAdSucc();
// //       }
// //   }
// //   ZPVMFKLWRVDHG(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoReward: " + par_ad_par.entry);
// //       NativeUtils.isVideoCop = true;
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "rewarded" ,type:"video",placement:NativeUtils.placement});
// //   }
// //   XOUXLQYTIZZQT(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onAdRevenue: " + par_ad_par.revenue);

// //   }
// // }

// class MyVideoAdListener implements PKQEEMPEWUHK {

//   SWFLEASBVFKC(par_ad_par: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoAdStart: " + par_ad_par.entry);
//       NativeUtils.isVideoCop = false;
//       NativeUtils._mapNativeCallback.vCall();
//       // Matriarchalism.instance.indispositions("ad_success")
//       A.t('ad_success')
//       NativeUtils.wwylogComm("c_ad_event", { "action": "impression" ,type:"video",placement:NativeUtils.placement});
//   }

//   UWHIILBVLAZSZ(par_ad_par: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoClick: " + par_ad_par.entry);
//       NativeUtils.wwylogComm("c_ad_event", { "action": "click" ,type:"video",placement:NativeUtils.placement});
//   }

//   ABJJNWQ(par_ad_par: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoClose: " + par_ad_par.entry);
//       NativeUtils.wwylogComm("c_ad_event", { "action": "close" ,type:"video",placement:NativeUtils.placement});
//       if (!NativeUtils.isVideoCop) {
//           //没有播完
//           NativeUtils.executeAdFail();
//       } else {
//           NativeUtils.executeAdSucc();
//       }
//   }

//   LTSHSVTWAQAIZX(par_ad_par: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoReward: " + par_ad_par.entry);
//       NativeUtils.isVideoCop = true;
//       NativeUtils.wwylogComm("c_ad_event", { "action": "rewarded" ,type:"video",placement:NativeUtils.placement});
//   }

//   REEVFESOCTAHCCVG(par_ad_par: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onAdRevenue: " + par_ad_par.revenue);
//   }
// }



// // class MyInterstitialAdListener implements FLQEVZZR {

// //   HGPDJATPBLPHBQ(par_ad_par: GameAd) {
// //     // AudioUtil.getInstance().stopBGM()
// //       // AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialStart: " + par_ad_par.entry);
// //       NativeUtils._mapNativeCallback.iCall();
// //       Matriarchalism.instance.indispositions("ad_success")
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "impression" ,type:"interstitial",placement:NativeUtils.placement});
// //   }
// //   XZIJQVGEWO(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialClick: " + par_ad_par.entry);
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "click" ,type:"interstitial",placement:NativeUtils.placement});
// //   }
// //   VBSRHUBOK(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialClose: " + par_ad_par.entry);
// //       NativeUtils.wwylogComm("c_ad_event", { "action": "close" ,type:"interstitial",placement:NativeUtils.placement});
// //       NativeUtils.executeAdSucc();
// //   }
// //   XOUXLQYTIZZQT(par_ad_par: GameAd) {
// //       // AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onAdRevenue: " + par_ad_par.revenue);
// //   }
// // }


// class MyInterstitialAdListener implements CXADIVYSYQD {

//   QZIDUNEJ(par_ad_par: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialStart: " + par_ad_par.entry);
//       NativeUtils._mapNativeCallback.iCall();
//       // Matriarchalism.instance.indispositions("ad_success")
//       A.t('ad_success')
//       NativeUtils.wwylogComm("c_ad_event", { "action": "impression" ,type:"interstitial",placement:NativeUtils.placement});
//   }

//   LDAFGWCGVTLDRC(par_ad_par: GameAd) {
//       //AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialClick: " + par_ad_par.entry);
//       NativeUtils.wwylogComm("c_ad_event", { "action": "click" ,type:"interstitial",placement:NativeUtils.placement});
//   }

//   JDBEBZSPCKF(par_ad_par: GameAd) {
//       //AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialClose: " + par_ad_par.entry);
//       NativeUtils.wwylogComm("c_ad_event", { "action": "close" ,type:"interstitial",placement:NativeUtils.placement});
//       NativeUtils.executeAdSucc();
//   }

//   REEVFESOCTAHCCVG(par_ad_par: GameAd) {
//      // AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onAdRevenue: " + par_ad_par.revenue);
//   }


// }

// // class MyBannerListener implements NVLMXWSWIJTJYBCU {

// //   JYSYPFXVKW(ad: GameAd){
// //      // 横幅广告展示回调
// //   }

// //   GSRJEWLRHQH(ad: GameAd){
// //     // 横幅广告点击回调
// //   }

// //   HSIWUUNYGMFC(ad: GameAd){
// //     // 横幅广告关闭回调
// //   }
// // }

// class MyBannerListener implements KQXVTR {

//   EBEOBLBO(ad: GameAd){
//      // 横幅广告展示回调
//   }

//   JFOBFAEBPU(ad: GameAd){
//     // 横幅广告点击回调
//   }

//   ITTHTLEDWOUNHTP(ad: GameAd){
//     // 横幅广告关闭回调
//   }
// }


// class MySplashListener implements DZAVKRLJX {
//   XHBRCH(ad: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[MySplashListener] onSplashAdClick" + " revenue:" + ad.revenue);
//   }

//   INHDTHCA(ad: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[MySplashListener] onSplashAdClose" + " revenue:" + ad.revenue);
//   }

//   ZNEMSJQVXBGJKMW(ad: GameAd) {
//       // AppsFlyerDemo.INSTANCE.logPrint("[MySplashListener] onSplashAdShowed" + " revenue:" + ad.revenue);
//   }

// }


// // class MyLauncherListener implements XQWSBIXZWQ {
// //   DJITBDJ(firstLaunch: number) {
// //       // firstLaunch 1: 冷启动 0: 热启动
// //   }
// // }

// class MyLauncherListener implements LZOBXGFV {
//   XOKKTVZKZXJC(firstLaunch: number) {
//       // firstLaunch 1: 冷启动 0: 热启动
//   }
// }

// // class MyCpClientListener implements OOOAHMWI {
// //   MTNCMVIZAWBG(CXMXIVSRTOYXALOI: string) {

// //     NativeUtils.customConfig = CXMXIVSRTOYXALOI;
// //       // 这里可以获取自定义配置信息
// //       // AppsFlyerDemo.INSTANCE.logPrint("[Listener] cpClient: " + CXMXIVSRTOYXALOI);
// //   }
// // }

// class MyCpClientListener implements JSHKSGNZCJVKYP {
//   BZYZOOIUIKVLDDY(VLKQGK: string) {
//       // 这里可以获取自定义配置信息
//       // AppsFlyerDemo.INSTANCE.logPrint("[Listener] cpClient: " + VLKQGK);
//       NativeUtils.customConfig = VLKQGK;
//   }

// }

// cc.NativeUtils = NativeUtils;
CC_DEBUG && (window["NativeUtils"] = NativeUtils);
cc.js.setClassName("NativeUtils", NativeUtils);
