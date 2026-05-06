export default class PlayerDataMgr {
  gold_menkan = "s1";
  days_task = "s0";
  coin_menkan = "s1";
  attenuation = "s1";
  slot_ab = "s2";
  gold_extract_0303_ab = "s0";
  isYSDKLoginSuccess = true;
  big_scroll_xc_count = 2;
  level_3_show_gold_reward = 0;
  game_time = 0;
  _new_user = 0;
  reco = 0;
  _is_reviewer = 0;
  _novice_extract = 0;
  _user_level = 0;
  _guide_step = 0;
  _attenuation_flag = 0;
  _reshuffleCardCount = 0;
  _freezeCardCount = 0;
  _tipCardCount = 0;
  guide_step_new = BigInt(0);
  yid = "yid_read_failed";
  createtime = "";
  nickname = "";
  headimgurl = "";
  gender = `gkey_269`;
  bindphone = 0;
  bindwx = 0;
  coinBalance = 0;
  gameTime = 0;
  userCpm = {};
  get user_level() {
    return this._user_level;
  }
  set user_level(e) {
    this._user_level = e || 0;
  }
  get new_user() {
    return this._new_user;
  }
  set new_user(e) {
    this._new_user = e || 0;
  }
  get novice_extract() {
    return this._novice_extract;
  }
  set novice_extract(e) {
    this._novice_extract = e || 0;
  }
  get is_reviewer() {
    return this._is_reviewer;
  }
  set is_reviewer(e) {
    this._is_reviewer = e || 0;
  }
  get reco_switch() {
    return this.reco;
  }
  set reco_switch(e) {
    this.reco = e;
  }
  get gameTime() {
    return this.game_time;
  }
  set gameTime(e) {
    this.game_time = e;
  }
  get goldBalance() {
    return this.gold_balance;
  }
  set goldBalance(e) {
    this.gold_balance = e;
  }
  get coinBalance() {
    var e = cc.sys.localStorage.getItem("make_up_reward");
    return e ? this.coin_balance - Number(e) : this.coin_balance;
  }
  set coinBalance(e) {
    this.coin_balance = e;
  }
  get userid() {
    return this.user_id;
  }
  set userid(e) {
    this.user_id = e;
  }
  get yid() {
    return this._yid;
  }
  set yid(e) {
    this._yid = e;
  }
  get createtime() {
    return this.create_time;
  }
  set createtime(e) {
    this.create_time = e;
  }
  get bindwx() {
    return this.bind_wx;
  }
  set bindwx(e) {
    this.bind_wx = e;
  }
  get gender() {
    return this._gender;
  }
  set gender(e) {
    this._gender = e;
  }
  get nickname() {
    return this.nick_name;
  }
  set nickname(e) {
    this.nick_name = e;
  }
  get headimgurl() {
    return this.head_imgurl;
  }
  set headimgurl(e) {
    this.head_imgurl = e;
  }
  get bindphone() {
    return this.bind_phone;
  }
  set bindphone(e) {
    this.bind_phone = e;
  }
  get userCpm() {
    return this.cpm;
  }
  set userCpm(e) {
    this.cpm = e;
  }
  get offTime() {
    return this.off_time;
  }
  set offTime(e) {
    this.off_time = Math.floor(e);
  }
  get guideStep() {
    return this._guide_step;
  }
  set guideStep(e) {
    this._guide_step = e;
  }
  get freezeCardCount() {
    return this._freezeCardCount;
  }
  set freezeCardCount(e) {
    this._freezeCardCount = e;
  }
  get reshuffleCardCount() {
    return this._reshuffleCardCount;
  }
  set reshuffleCardCount(e) {
    this._reshuffleCardCount = e;
  }
  get tipCardCount() {
    return this._tipCardCount;
  }
  set tipCardCount(e) {
    this._tipCardCount = e;
  }
}