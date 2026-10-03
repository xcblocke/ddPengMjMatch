import PlayerDataSys from '../framework/controller/PlayerDataSys';
import { CardSkinType, BgSkinType, SpecialCardSkinType } from '../framework/enum/AllEnum';
import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import { gameTeachingMock } from './gameTeachingMock';
import { generateLevelContent, DEFAULT_FLOWER_LIST } from '../main/generate_level';
import { gameConfig } from './GameConfig';
export enum GameState {
  await = 0,
  gameing = 1,
  gameover = 2,
  gameResult = 3,
}
export var MaxSpareSlotCount = 8;
export default class GameData {
  gameUIRoot = null;
  _grid_data = [];
  _gameLevel = 0;
  _rewardInfos = null;
  _curClearNum = 0;
  _levelCoinNum = 0;
  _hasUnExtract = false;
  _coinBubbleTip = "";
  _goldBubbleTips = "";
  _gradeDis = null;
  _onlyReward = 0;
  _levelupOnlyCoin = 0;
  _levelupCoin = 0;
  _levelupGold = 0;
  lastCountLuckPop = 0;
  lastCountLotteryPop = 0;
  successCount = 0;
  load_guide = false;
  _luckyCoin = 0;
  _luckyGold = 0;
  _luckyOnlyCoin = 0;
  showTask = false;
  linkTimes = 0;
  guideStep = 0;
  _grade_pop_data = null;
  tg_reward = 0;
  // Local-only "gold coin" system (separate from coin/gold balance extracted from server).
  dollarBalance = 0;
  // Coin reward added for the last level pass; used for flying animation on settlement claim.
  dollarLastAdd = 0;
  // Guard to avoid adding coin reward multiple times for the same level.
  dollarRewardAppliedLevel = 0;
  comboCount = 0;
  lun_level = 0;
  red_bag_value = [];
  xc_count_wait_time = 0;
  levelStartData = null;
  gameSkinData = {
    cardSkin: CardSkinType.CardSkin1,
    bgSkin: BgSkinType.BgSkin1,
    specialCardSkin: SpecialCardSkinType.SpecialCardSkin1
  };
  openGameModule = {
    propModule: true,
    comboModule: true,
    countdownModule: true,
    guideModule: false,
    gameGuideModule: false,
    fullScreenClickEffectModule: true
  };
  gameState = GameState.await;
  pauseGameAnim = false;
  isPassLevel = false;
  isOpenDemo = false;
  debugData = {
    goldLowLimit: 100,
    goldHighLimit: 1000,
    nextMustMoney: 0,
    isOpenMingma: false,
    mingmaMoney: 0,
    isOpenAutoGet: false,
    fixedMoney: null,
    priceList: [],
    passLevelReward: 0
  };
  syncData = {
    curClearNum: 0,
    mapData: [],
    gameTime: 0,
    operStep: 0
  };
  totalClearNum = 0;
  gameTime = 0;
  extract_desc = "";
  extract_coin_desc = "";
  luckyTotal = 0;
  luckyCurCount = 0;
  lotteryTotal = 0;
  lotteryCurCount = 0;
  globalCanClick = true;
  third_extract_level = 0;
  canCoinExtract = false;
  extractStatus = 0;
  needLevel = 0;
  isUseFreeze = false;
  skinCfg = [];
  coinOutTipsArr = [];
  gold_extract_desc = "";
  coin_extract_desc = "";
  id = 0;
  levelId = 0;
  turnId = 0;
  turnMax = 0;
  roundId = 0;
  roundMax = 0;
  setId = 0;
  setMax = 0;
  countdownTime = 0;
  levelGuideStep = 0;
  new_year_gold_reward = 0;
  show_subsidy_reward = 0;
  completeAtlas = {};
  lucky_count = 0;
  lucky_bubble = "";
  tg_gold_reward = 0;
  free_prop = null;
  mainBtnGroupVisible = {
    SignVisible: false,
    LotteryVisible: false,
    TujianVisible: false
  };
  isOldCoinGuide = false;
  operStep = 0;
  verifyCommssionExtractOld = false;
  static _instance = null;
  get bigVerifyInfo() {
    return this.startGameData.big_coin_verify_info;
  }
  get leastVerifyCommission() {
    return this.bigVerifyInfo.verify_commission - this.bigVerifyInfo.current_verify_commission;
  }
  get SumVierfyCoin() {
    var e = gameData.clearSubmitData.big_coin_verify_info.extract_list.reduce(function (e, t) {
      return {
        amount: e.amount + t.amount,
        id: "1"
      };
    });
    console.log("SumVierfyCoin", e.amount);
    return e.amount;
  }
  get levelupOnlyCoin() {
    return this._levelupOnlyCoin;
  }
  set levelupOnlyCoin(e) {
    this._levelupOnlyCoin = e;
  }
  get levelupCoin() {
    return this._levelupCoin;
  }
  set levelupCoin(e) {
    this._levelupCoin = e;
  }
  get levelupGold() {
    return this._levelupGold;
  }
  set levelupGold(e) {
    this._levelupGold = e;
  }
  get luckyCoin() {
    return this._luckyCoin;
  }
  set luckyCoin(e) {
    this._luckyCoin = e;
  }
  get luckyGold() {
    return this._luckyGold;
  }
  set luckyGold(e) {
    this._luckyGold = e;
  }
  get luckyOnlyCoin() {
    return this._luckyOnlyCoin;
  }
  set luckyOnlyCoin(e) {
    this._luckyOnlyCoin = e;
  }
  get onlyReward() {
    return this._onlyReward;
  }
  set onlyReward(e) {
    this._onlyReward = e;
  }
  get gradeDis() {
    return this._gradeDis;
  }
  set gradeDis(e) {
    this._gradeDis = e;
  }
  get coinBubbleTip() {
    return this._coinBubbleTip;
  }
  set coinBubbleTip(e) {
    this._coinBubbleTip = e;
  }
  get goldBubbleTip() {
    return this._goldBubbleTips;
  }
  set goldBubbleTip(e) {
    this._goldBubbleTips = e;
  }
  get hasUnExtract() {
    return this._hasUnExtract;
  }
  set hasUnExtract(e) {
    this._hasUnExtract = e;
  }
  get levelCoinNum() {
    return this._levelCoinNum;
  }
  set levelCoinNum(e) {
    this._levelCoinNum = e;
  }
  get curClearNum() {
    return this._curClearNum;
  }
  set curClearNum(e) {
    this._curClearNum = e;
  }
  get rewardInfo() {
    return this._rewardInfos[0];
  }
  get rewardInfos() {
    return this._rewardInfos;
  }
  get process_info() {
    return this._process_info;
  }
  set process_info(e) {
    this._process_info = e;
  }
  get gameLevel() {
    return this._gameLevel;
  }
  set gameLevel(e) {
    this._gameLevel = e;
  }
  static getInstance() {
    this._instance || (this._instance = new GameData());
    return this._instance;
  }
  hasGradeChange() {
    return !(!this._gradeDis || !this._gradeDis.hasOwnProperty("old_tx_ratio"));
  }
  updataRewardInfo(e) {
    this.levelupCoin = e.show_only_reward;
    this.luckyCoin = e.show_xc_video_reward;
  }
  deepCopyNestedArrays(e) {
    var t = this;
    return e.map(function (e) {
      return Array.isArray(e) ? t.deepCopyNestedArrays(e) : "object" == typeof e && null !== e ? t.deepCopyObject(e) : e;
    });
  }
  deepCopyObject(e) {
    var t = Array.isArray(e) ? [] : {};
    for (var o in e) if (e.hasOwnProperty(o)) {
      var n = e[o];
      t[o] = "object" == typeof n && null !== n ? this.deepCopyObject(n) : n;
    }
    return t;
  }
  initGameData(e, t = false) {
    try {
      console.log("initGameData", gameData.info);
      var n = e.profile,
        i = (e.sync_data, e.lun_level),
        r = (n.level_conf, n.level_info),
        c = n.level_data,
        p = n.countdown;
      this.third_extract_level = e.third_extract_level;
      this.canCoinExtract = e.is_extract;
      this.process_info = e.process_info || null;
      this.comboCount = 0;
      this.lun_level = i;
      this.free_prop = e.free_prop;
      this.coinBubbleTip = e.bubble_coin_balance;
      this.goldBubbleTip = e.bubble_gold_balance;
      this.completeAtlas = e.complete_atlas;
      this.lucky_count = e.lucky_count;
      this.lucky_bubble = e.lucky_bubble;
      this.xc_count_wait_time = 0;
      this.gameLevel = (null == e ? void 0 : e.game_level) || 1;
      this._levelCoinNum = (null == e ? void 0 : e.profile.coin_num) || 0;
      this.levelupGold = null == e ? void 0 : e.levelup_gold;
      this.levelupOnlyCoin = null == e ? void 0 : e.levelup_only_coin;
      this.id = e.lun_level;
      this.roundId = r.round_id;
      this.roundMax = r.round_max;
      this.turnId = r.turn_id;
      this.turnMax = r.turn_max;
      this.setId = r.set_id;
      this.setMax = r.set_max;
      this._hasUnExtract = e.is_extract && this._curClearNum <= 0;
      var d = c;
      cc.sys.isBrowser || gameData.isOpenDemo;
      if (1 == gameData.lun_level && !e.use_profile_data) d = gameTeachingMock;else if (t && !e.use_profile_on_restart) {
        var f = gameConfig.getLevelConfig("" + n.lun_level),
          h = gameConfig.getCardGroupConf(),
          g = f.card_group_id - 1;
        d = generateLevelContent(f.size.split("*")[0], f.size.split("*")[1], f.card_pair_count, f.card_type_count, f["0_pair_count"], f["1_pair_count"], g, f.special_pair_count, 1, h, DEFAULT_FLOWER_LIST);
      }
      this.countdownTime = p || 0;
      this.successCount = e.success_count;
      for (var _ = 0; _ < d.mapData.length; _++) for (var y = 0; y < d.mapData[_].length; y++) d.mapData[_][y] && 0 == d.mapData[_][y].type && (d.mapData[_][y] = null);
      this._grid_data = this.deepCopyNestedArrays(d.mapData);
      console.log("this._grid_data", this._grid_data);
      this.guideStep = PlayerDataSys.guideStep;
      this._curClearNum = 0;
      this.operStep = 0;
      this.curClearNum = 0;
      this.gameTime = 0;
    } catch (e) {
      console.error(e);
    }
  }
  getGridData() {
    return this._grid_data;
  }
  deleteGridData() {}
  getMjListLength() {
    for (var e = 0, t = 0; t < this._grid_data.length; t++) for (var o = 0; o < this._grid_data[t].length; o++) this._grid_data[t][o] && e++;
    return e;
  }
  getSyncData() {
    return {
      curClearNum: gameData.curClearNum,
      mapData: null,
      gameTime: this.gameTime,
      operStep: this.operStep
    };
  }
  addComboCount() {
    this.comboCount++;
  }
  isLastRound() {
    return this.turnId == this.turnMax && this.roundId == this.roundMax;
  }
  updateBubble(e, t = false) {
    var o = e.bubble_coin_balance,
      n = e.bubble_gold_balance;
    if (void 0 !== o) {
      this.coinBubbleTip = o;
      t || EventMgr.trigger(GameEventType.UPDATE_BUBBLE);
    }
    if (void 0 !== n) {
      this.goldBubbleTip = n;
      EventMgr.trigger(GameEventType.FRESH_RED_BUBBLE);
    }
  }
}
export var gameData = GameData.getInstance();
