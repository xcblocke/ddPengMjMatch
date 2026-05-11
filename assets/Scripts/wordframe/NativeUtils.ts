import { Matriarchalism } from "./Matriarchalism";
import SdkHelper from "../framework/SdkHelper";
import AdManager from "../framework/Platform/AdManager";

/**
 * 桥接 WordFrame / Matriarchalism 与本项目的 SdkHelper、AdManager。
 * gameName / gamepg 请按发行包与后台配置修改。
 */
export class NativeUtils {
  static gameName = "sdywords";
  static gamepg = "com.vorelia.wordlond.lexstack";
  static _mapNativeCallback = {
    vCall: function () {},
    iCall: function () {}
  };
  static no_video = false;
  static placement: string = null;
  static succBack: (str?: string) => void = null;
  static failBack: (str?: string) => void = null;

  static get isFlag() {
    return Matriarchalism.instance.nonsymphoniousness;
  }
  static isFlag_wushi = true;
  static isFlag_login = false;

  static executeAdSucc(str?: string) {
    cc.director.emit("videosuc");
    NativeUtils.succBack && NativeUtils.succBack(str);
    NativeUtils.succBack = null;
    NativeUtils.placement = null;
  }

  static executeAdFail(str?: string) {
    NativeUtils.failBack && NativeUtils.failBack(str);
    NativeUtils.failBack = null;
    NativeUtils.placement = null;
  }

  static hasVideo() {
    return true;
  }

  static hasInterstitial() {
    return true;
  }

  static showVideoAd() {
    AdManager.getInstance().playVideoAd(
      () => NativeUtils.executeAdSucc(),
      () => NativeUtils.executeAdFail()
    );
  }

  static showInterstitialAd() {
    AdManager.getInstance().showInsertAd(() => {
      NativeUtils.executeAdSucc();
    });
  }

  static wwylogComm(eventName: string, properties: { [key: string]: any } = null) {
    try {
      SdkHelper.reportData(eventName, properties || {});
    } catch {
      console.log("[wwylogComm]", eventName, properties);
    }
  }

  static wwylogPP(eventName: number) {
    if (!cc.sys.isNative) return;
    SdkHelper.reportData("pp_card_event", { code: eventName });
  }

  static customConfig = null;
  static counstFunc() {
    return this.customConfig;
  }

  static sdyLog(logType: number | string, logValue: any = "") {
    if (CC_PREVIEW) console.log("[SDYLog]", logType, logValue);
    try {
      Matriarchalism.instance.trachelectomyRanchlikePrudity(logType, logValue);
    } catch (e) {}
  }

  static openUrlByOfficer(url: string) {
    const u = (url || "").trim();
    if (!u) return;
    cc.sys.openURL(u);
  }

  static PRIVACY_URL = "https://sais4i.com/privacy.html";
  static openPrivacyUrl() {
    this.openUrlByOfficer(NativeUtils.PRIVACY_URL);
  }

  static getAppVersion() {
    return SdkHelper.getVersionName();
  }

  static vibrate(time = 50) {
    SdkHelper.setVibrator(Math.min(500, Math.max(10, time || 50)));
  }

  static cocosInit(callback?: Function) {
    NativeUtils.onInitCal = callback;
    callback && callback();
  }
  static onInitCal: Function = null;

  static showBanner(_x?: number, _y?: number, _w?: number, _h?: number) {}
  static closeBanner() {}
}

CC_DEBUG && ((window as any)["NativeUtils"] = NativeUtils);
cc.js.setClassName("NativeUtils", NativeUtils);
