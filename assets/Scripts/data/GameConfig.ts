const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class GameConfig {
  _card_conf = null;
  _parameter_conf = null;
  _atlas_conf = null;
  _level_conf = null;
  _combo_conf = null;
  _glory_conf = null;
  _coin_limit = [];
  _withdraw_percent_3 = [];
  _gold_extract_title = [];
  _lucky_level_count_limit = [];
  _coin_extract_level = [];
  _gold_extract_level = [];
  _red_bag_level = [];
  _card_group_conf = null;
  static _instance = null;
  get cardGroupConfig() {
    return this._card_group_conf;
  }
  set cardGroupConfig(e) {
    this._card_group_conf = e;
  }
  get levelConfig() {
    return this._level_conf;
  }
  set levelConfig(e) {
    this._level_conf = e;
  }
  get cardConfig() {
    return this._card_conf;
  }
  set cardConfig(e) {
    this._card_conf = e;
  }
  get comboConfig() {
    return this._combo_conf;
  }
  set comboConfig(e) {
    this._combo_conf = e;
  }
  get atlasConfig() {
    return this._atlas_conf;
  }
  set atlasConfig(e) {
    this._atlas_conf = e;
  }
  get paramConfig() {
    return this._parameter_conf;
  }
  set paramConfig(e) {
    this._parameter_conf = e;
  }
  get gloryConfig() {
    return this._glory_conf;
  }
  set gloryConfig(e) {
    this._glory_conf = e;
  }
  get coinLimit() {
    return this._coin_limit;
  }
  set coinLimit(e) {
    this._coin_limit = e;
  }
  get withdrawPercent3() {
    return this._withdraw_percent_3;
  }
  set withdrawPercent3(e) {
    this._withdraw_percent_3 = e;
  }
  get gold_extract_title() {
    return this._gold_extract_title;
  }
  set gold_extract_title(e) {
    this._gold_extract_title = e;
  }
  get lucky_level_count_limit() {
    return this._lucky_level_count_limit;
  }
  set lucky_level_count_limit(e) {
    this._lucky_level_count_limit = e;
  }
  get coinExtractLevel() {
    return this._coin_extract_level;
  }
  set coinExtractLevel(e) {
    this._coin_extract_level = e;
  }
  get goldExtractLevel() {
    return this._gold_extract_level;
  }
  set goldExtractLevel(e) {
    this._gold_extract_level = e;
  }
  get redBagLevel() {
    return this._red_bag_level;
  }
  set redBagLevel(e) {
    this._red_bag_level = e;
  }
  static getInstance() {
    this._instance || (this._instance = new GameConfig());
    return this._instance;
  }
  getStepRewardConfig() {
    return {
      goldReward: 0,
      coinOnlyReward: 0
    };
  }
  getSettleMentConfig() {
    return {
      goldReward: 0,
      coinOnlyReward: 0
    };
  }
  getComboBubbleStep() {
    return this._parameter_conf.bubble_step.para_value;
  }
  getReshuffleClusterConfig() {
    var e,
      t,
      o,
      a = {
        neighborWeight: 0.5,
        rowWeight: 0.5,
        colWeight: 0.5,
        iterations: 10,
        temperature: 0.35
      },
      i = null !== (o = null === (t = null === (e = this._parameter_conf) || void 0 === e ? void 0 : e.reshuffle_cluster) || void 0 === t ? void 0 : t.para_value) && void 0 !== o ? o : null;
    if (!i) return a;
    if ("number" == typeof i) return Object.assign(Object.assign({}, a), {
      neighborWeight: i
    });
    if ("object" == typeof i) {
      var r = function r(e, t) {
        return "number" == typeof e && isFinite(e) ? e : t;
      };
      return {
        neighborWeight: r(i.neighborWeight, a.neighborWeight),
        rowWeight: r(i.rowWeight, a.rowWeight),
        colWeight: r(i.colWeight, a.colWeight),
        iterations: Math.max(0, Math.floor(r(i.iterations, a.iterations))),
        temperature: Math.max(0, r(i.temperature, a.temperature))
      };
    }
    return a;
  }
  getTujianConfig() {
    return this._atlas_conf;
  }
  getLevelConfig(e) {
    return this._level_conf[e];
  }
  getAssetIconPathById(e) {
    return this.cardConfig[e].resPath;
  }
  getCardGroupConf() {
    return Object.values(this._card_group_conf).map(function (e) {
      return e.cardId.slice(0, -4);
    });
  }
  getAssetInfoById(e) {
    return this.cardConfig[e];
  }
  getTotalGloryCoin() {
    var e = 0;
    for (var t in this._glory_conf) e += this._glory_conf[t].coin;
    return e;
  }
  getLuckPopCount() {
    return this._parameter_conf.force_cd_1.para_value;
  }
  getForceCount() {
    return this._parameter_conf.force_step.para_value;
  }
  getStepShowGoldCount() {
    return this._parameter_conf.bigmoney_gold_only.para_value;
  }
  getSettleMentShowCoinCount(e) {
    return 1 == e ? this._parameter_conf.coin_1.para_value : 2 == e ? this._parameter_conf.coin_2.para_value : void 0;
  }
}
export var WdReqType = {
  can_wd: 1,
  wait_wd: 2,
  restrict_wd: 3,
  sign_wd: 4
};
export var gameConfig = GameConfig.getInstance();