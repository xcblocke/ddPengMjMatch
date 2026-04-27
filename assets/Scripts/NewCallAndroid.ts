import CallNative from './CallNative';
export default class NewCallAndroid extends CallNative {
  getClientInfo() {
    return "";
  }
  getCookieInfo() {
    return "";
  }
  wxLogin() {}
  finishActivity() {}
  setUserInfo() {}
  reportData() {}
  decrypt() {}
  openKefu() {}
  showToast(e) {
    e.content;
  }
  getScreenWidth() {
    return 0;
  }
  getScreenHeight() {
    return 0;
  }
  hasNotchInScreen() {
    return false;
  }
  getNotchHeight() {
    return 0;
  }
  setVibrator() {}
  ad_showSplash() {}
  ad_closeSplash() {}
  ad_showRewardVideo() {}
  ad_showImg() {}
}