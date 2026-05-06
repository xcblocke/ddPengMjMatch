import LocalData from '../../cyll/LocalData';
import { gameData } from '../../data/GameData';
import PlayerDataMgr from '../../data/PlayerDataMgr';
import { CardSkinType } from '../enum/AllEnum';
import EventMgr from '../Event/EventMgr';
import GameEventType from '../Event/GameEventType';
import HotUpdate from '../Event/HotUpdate';
import ClientData from '../Event/ClientData';
import SdkHelper from '../SdkHelper';
import { CUSTOMER_SERVICE, IOS_USER_AGREEMENT, USER_AGREEMENT, IOS_PRIVACY_AGREEMENT, PRIVACY_AGREEMENT } from '../SystemConfig';
import EngineUtil from '../EngineUtil';
import { MathUtils } from '../../Utils/MathUtil';
class _PlayerDataSys extends PlayerDataMgr {
  _coin_extract_amount = 35;
  free_lottery_flag = -1;
  rewardList = [];
  new_user_reward_flag = false;
  isGetWufuReward = false;
  sign_in_info = [];
  login_extract_info = [];
  login_days = 0;
  coin_limit = 0;
  curLuckPopCount = 0;
  curForceCount = 0;
  signPopupFlag = 0;
  taskPopupFlag = 0;
  task_show = 0;
  static _instance = null;
  static _getInstance() {
    this._instance || (_PlayerDataSys._instance = new _PlayerDataSys());
    return _PlayerDataSys._instance;
  }
  setConfigReviewing(e) {
    var t = e.is_reviewer;
    this.is_reviewer = t || this.is_reviewer || 0;
  }
  setUserInfo(e) {
    e.is_reviewer;
    var t = e.level,
      o = e.big_scroll_xc_count,
      n = e.coin_balance,
      a = e.bind_wx,
      c = e.gender,
      l = e.create_time,
      u = e.nickname,
      p = e.game_level,
      d = e.headimgurl,
      h = e.reco_switch,
      g = e.gold_balance,
      _ = e.novice_status,
      y = e.coin_extract_amount,
      m = e.prop_info,
      v = e.extract_desc,
      b = e.free_lottery_flag,
      w = e.guide_step_new,
      S = (e.real_success_count, e.extract_coin_desc),
      E = e.ab_info,
      P = e.extract_status,
      C = e.task_show,
      D = e.coin_limit,
      O = e.level_3_show_gold_reward,
      T = e.favorite_info,
      A = e.sign_in_info,
      k = e.gold_extract_desc,
      R = e.coin_extract_desc;
    try {
      gameData.showTask = e.show_task;
      this._coin_extract_amount = y;
      this.big_scroll_xc_count = o;
      this.user_level = t || 1;
      this.reco_switch = h;
      this.bindwx = a;
      this.createtime = l;
      this.gender = c;
      this.headimgurl = d;
      this.nickname = u || `{"gkey_276":{"v1":"${1248152}"}}`;
      this.coinBalance = n;
      this.goldBalance = g;
      gameData.extract_desc = v;
      gameData.extract_coin_desc = S;
      this.coin_limit = D;
      this.guide_step_new = BigInt(w);
      this.sign_in_info = A;
      this.task_show = C;
      this.signPopupFlag = e.sign_popup_flag || 0;
      gameData.isOpenDemo && (this.goldBalance = LocalData.getInstance().getUserCoinData() || 0);
      var I = LocalData.getInstance().getDebugData();
      I && (gameData.debugData = I);
      var N = _;
      console.log("step", N);
      this.guideStep = N;
      gameData.skinCfg = e.skin_list;
      gameData.gameLevel = p;
      gameData.extractStatus = P;
      this.free_lottery_flag = b;
      this.level_3_show_gold_reward = O || 0;
      gameData.gold_extract_desc = k;
      gameData.coin_extract_desc = R;
      var M = this.yid,
        x = this.userid;
      SdkHelper.setUserInfo({
        yid: M,
        user_id: x,
        gender: c,
        create_time: l,
        is_travel: a
      });
      this.is_reviewer && SdkHelper.reportData("loading_is_reviewer");
      for (var L in T) switch (L) {
        case "1":
          if (28 == Number(T[L])) {
            gameData.gameSkinData.cardSkin = CardSkinType.CardSkin4;
          } else {
            gameData.gameSkinData.cardSkin = Number(T[L]);
          }
          break;
        case "2":
          gameData.gameSkinData.bgSkin = Number(T[L]) - 3;
          break;
        case "3":
          gameData.gameSkinData.specialCardSkin = Number(T[L]) - 7;
      }
      this.curLuckPopCount = Number(cc.sys.localStorage.getItem("curLuckPopCount")) || 0;
      this.curForceCount = Number(cc.sys.localStorage.getItem("curForceCount")) || 0;
      for (var L in m) switch (L) {
        case "prop2_num":
          this.tipCardCount = m[L];
          break;
        case "prop1_num":
          this.reshuffleCardCount = m[L];
          break;
        case "prop3_num":
          this.freezeCardCount = m[L];
      }
      if (E) {
        var G = E.gold_extract_0303_ab;
        this.gold_extract_0303_ab = G || "s0";
      }
    } catch (e) {
      console.error(e);
    }
  }
  checkSignReward() {
    for (var e = 0; e < this.sign_in_info.length; e++) {
      var t = this.sign_in_info[e],
        o = t.sign_up_day_limit,
        n = t.login_days,
        a = t.user_level_limit,
        i = t.user_level;
      if (!t.status && n >= o && a <= i) return true;
    }
    return false;
  }
  getCoinExtractAmount() {
    return this._coin_extract_amount;
  }
  initUserId(e) {
    var t = e.user_id,
      o = e.yid;
    this.userid = t || "";
    this.yid = o || "yid_read_failed";
    EngineUtil.setLocalData("yid", this.yid);
    ClientData.setCommonData(o);
  }
  getYid() {
    return this.yid;
  }
  initWxData(e) {
    this.initUserId(e);
    var t = e.bind_phone,
      o = e.gender,
      n = e.headimgurl,
      a = e.nickname;
    this.bindphone = t || 0;
    this.gender = o || `gkey_269`;
    this.headimgurl = n || "";
    this.nickname = a || "";
    this.bindwx = 1;
  }
  addUserCoinBalance(e) {
    if (e >= 0) {
      this.coinBalance += e;
      gameData.isOpenDemo || EventMgr.trigger(GameEventType.UPDATE_BALANCE);
    }
  }
  getCoinBalance(e = this.coinBalance) {
    if (!e) {
      e = this.coinBalance;
      var t = cc.sys.localStorage.getItem("make_up_reward");
      if (t) return this.getCNCoinNum(e - Number(t));
    }
    return this.getCNCoinNum(e);
  }
  getCoinBalanceWithUnit(e = this.coinBalance, t = `gkey_002`) {
    if (!e) {
      e = this.coinBalance;
      var o = cc.sys.localStorage.getItem("make_up_reward");
      if (o) return this.getCNCoinNum(e - Number(o)) + t;
    }
    return this.getCNCoinNum(e) + t;
  }
  setUserCoinBalance(e, t = true) {
    e = e < 0 ? 0 : e;
    this.coinBalance = e;
    t && EventMgr.trigger(GameEventType.UPDATE_BALANCE);
  }
  addUserGoldBalance(e, t = true) {
    if (e >= 0) {
      this.goldBalance += e;
      t && EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE);
    }
    gameData.isOpenDemo && LocalData.getInstance().setUserCoinData(this.goldBalance);
  }
  getGoldBalance(e = this.goldBalance) {
    return this.getCNGoldBalanceNum(e);
  }
  getGoldBalanceWithUnit(e = this.goldBalance, t = `gkey_002`) {
    return this.getCNGoldBalanceNum(e) + t;
  }
  setUserGoldBalance(e, t = true) {
    e = e < 0 ? 0 : e;
    this.goldBalance = e;
    t && EventMgr.trigger(GameEventType.UPDATE_GOLDBALANCE);
  }
  setUserPropCount(e, t = true) {
    for (var o in e) switch (o) {
      case "prop2_num":
        this.tipCardCount = e[o];
        break;
      case "prop1_num":
        this.reshuffleCardCount = e[o];
        break;
      case "prop3_num":
        this.freezeCardCount = e[o];
    }
    console.log("this.tipCardCount", this.tipCardCount);
    console.log("this.reshuffleCardCount", this.reshuffleCardCount);
    console.log("this.freezeCardCount", this.freezeCardCount);
    t && EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
  }
  getCNCoinNum(e, t = 1000) {
    if (0 == e) return e.toString();
    var o = Math.floor(100 * e) / 100 / 100,
      n = parseInt(o.toString()),
      a = n.toString(),
      i = parseInt((MathUtils.getInstance().accMul(o, 100) - 100 * n).toString()).toString();
    1 == i.length && (i = "0" + i);
    if ("00" == i) return a;
    2 == i.length && "0" == i[1] && (i = i[0]);
    return a + "." + i;
  }
  getCNGoldBalanceNum(e) {
    return e.toString();
  }
  uploadCpm(e) {
    e && (this.userCpm = JSON.parse(e));
  }
  updateGameTime() {
    this.gameTime = EngineUtil.getTimeStamp();
  }
  isOppoReviewer() {
    return this.is_reviewer && "oppo" == ClientData.channel_name;
  }
  isVivoReviewer() {
    return this.is_reviewer && ("vivo" == ClientData.channel_name || "huawei" == ClientData.channel_name);
  }
  isXiaoMiReviewer() {
    return this.is_reviewer && "xiaomi" == SdkHelper.getChannelName().toLowerCase();
  }
  isTencent() {
    return new RegExp("tencent").test(ClientData.channel_name);
  }
  withDrawal(e) {
    this.goldBalance = 0;
    this.setUserGoldBalance(this.goldBalance);
    console.log("withDrawal", e);
    this.rewardList.push(e);
    LocalData.getInstance().setUserCoinData(this.goldBalance);
  }
  getCustomerServiceUrl() {
    var e = SdkHelper.getChannelName().toLowerCase();
    return CUSTOMER_SERVICE + "&channel_name=" + e;
  }
  getUserAgreementUrl(e = 0) {
    var t = SdkHelper.getChannelName().toLowerCase(),
      o = cc.sys.os === cc.sys.OS_IOS ? IOS_USER_AGREEMENT : USER_AGREEMENT,
      n = e;
    return o + "&version_name=" + ClientData.version_name + "&channel_name=" + t + "&device_id=" + ClientData.device_id + "&fd=" + n + "&debug=" + !HotUpdate.getInstance().isOnlineRelease();
  }
  getPrivacyAgreementUrl() {
    SdkHelper.openAgreementPage();
    var e = SdkHelper.getChannelName().toLowerCase(),
      t = cc.sys.os === cc.sys.OS_IOS ? IOS_PRIVACY_AGREEMENT : PRIVACY_AGREEMENT;
    return t + "&version_name=" + ClientData.version_name + "&channel_name=" + e + "&device_id=" + ClientData.device_id + "&fd=1&debug=" + !HotUpdate.getInstance().isOnlineRelease();
  }
  getCurLuckPopCount() {
    return this.curLuckPopCount;
  }
  getCurForceCount() {
    return this.curForceCount;
  }
  setCurLuckPopCount(e) {
    this.curLuckPopCount = e;
    cc.sys.localStorage.setItem("curLuckPopCount", e.toString());
  }
  setCurForceCount(e) {
    this.curForceCount = e;
    cc.sys.localStorage.setItem("curForceCount", e.toString());
  }
}
export default _PlayerDataSys._getInstance();