declare const cc: any;
import { NativeUtils } from "../wordframe/NativeUtils";
const STORAGE_KEY = "offline_runtime_state_v1";
const STATE_VERSION = 1;
const LOOP_START_LEVEL = 22;
const DEFAULT_COIN_LIMIT = 5000;
const DEFAULT_SIGN_REWARDS = [20, 30, 40, 50, 60, 80, 100, 120, 150, 180, 200, 220, 250, 300, 888, 1888];
const DEFAULT_LUCKY_DRAW = [{
  id: 1,
  levelLimit: 0,
  levelId: 3,
  money: 10,
  showMoney: 10,
  type: 1,
  priceName: "Auto coin 0.1",
  waitDayLimit: 0,
  userLevelLimit: 0
}, {
  id: 2,
  levelLimit: 0,
  levelId: 13,
  money: 3,
  showMoney: 0,
  type: 2,
  priceName: "Hint x3",
  waitDayLimit: 0,
  userLevelLimit: 0
}, {
  id: 3,
  levelLimit: 0,
  levelId: 30,
  money: 1200,
  showMoney: 1200,
  type: 1,
  priceName: "Coin 12.0",
  waitDayLimit: 0,
  userLevelLimit: 0
}, {
  id: 4,
  levelLimit: 0,
  levelId: 55,
  money: 1,
  showMoney: 0,
  type: 2,
  priceName: "Freeze x1",
  waitDayLimit: 0,
  userLevelLimit: 0
}, {
  id: 5,
  levelLimit: 10,
  levelId: 88,
  money: 0,
  showMoney: 8888,
  type: 1,
  priceName: "Coin 88.88",
  waitDayLimit: 2,
  userLevelLimit: 30
}, {
  id: 6,
  levelLimit: 0,
  levelId: 121,
  money: 1,
  showMoney: 0,
  type: 2,
  priceName: "Shuffle x1",
  waitDayLimit: 0,
  userLevelLimit: 0
}, {
  id: 7,
  levelLimit: 10,
  levelId: 154,
  money: 0,
  showMoney: 18888,
  type: 1,
  priceName: "Coin 188.88",
  waitDayLimit: 2,
  userLevelLimit: 30
}, {
  id: 8,
  levelLimit: 10,
  levelId: 187,
  money: 0,
  showMoney: 88888,
  type: 1,
  priceName: "Coin 888.88",
  waitDayLimit: 2,
  userLevelLimit: 30
}];
const DEFAULT_ATLAS_CONF = {
  "1": { if_unlock: 1, level_count_limit: 0, money: 0, name: "Classic", type: 1 },
  "2": { if_unlock: 0, level_count_limit: 40, money: 0, name: "Wood", type: 1 },
  "3": { if_unlock: 0, level_count_limit: 80, money: 0, name: "Jade", type: 1 },
  "4": { if_unlock: 1, level_count_limit: 0, money: 0, name: "Classic BG", type: 2 },
  "5": { if_unlock: 0, level_count_limit: 23, money: 0, name: "Snow", type: 2 },
  "6": { if_unlock: 0, level_count_limit: 60, money: 0, name: "Moon", type: 2 },
  "7": { if_unlock: 0, level_count_limit: 97, money: 10, name: "Stars", type: 2 },
  "8": { if_unlock: 1, level_count_limit: 0, money: 0, name: "Spring", type: 3 },
  "9": { if_unlock: 0, level_count_limit: 5, money: 0, name: "Kitchen", type: 3 },
  "10": { if_unlock: 0, level_count_limit: 11, money: 0, name: "Weapon", type: 3 },
  "11": { if_unlock: 0, level_count_limit: 18, money: 0, name: "Music", type: 3 },
  "12": { if_unlock: 0, level_count_limit: 26, money: 0, name: "Plum", type: 3 },
  "13": { if_unlock: 0, level_count_limit: 35, money: 0, name: "Myth", type: 3 },
  "14": { if_unlock: 0, level_count_limit: 45, money: 0, name: "Festival", type: 3 },
  "15": { if_unlock: 0, level_count_limit: 56, money: 0, name: "Birthday", type: 3 },
  "16": { if_unlock: 0, level_count_limit: 68, money: 0, name: "SpringFest", type: 3 },
  "17": { if_unlock: 0, level_count_limit: 81, money: 0, name: "Building", type: 3 },
  "18": { if_unlock: 0, level_count_limit: 95, money: 0, name: "Snack", type: 3 },
  "19": { if_unlock: 0, level_count_limit: 110, money: 0, name: "Mooncake I", type: 3 },
  "20": { if_unlock: 0, level_count_limit: 126, money: 0, name: "Animal I", type: 3 },
  "21": { if_unlock: 0, level_count_limit: 143, money: 0, name: "Veggie", type: 3 },
  "22": { if_unlock: 0, level_count_limit: 161, money: 0, name: "Tool", type: 3 },
  "23": { if_unlock: 0, level_count_limit: 180, money: 0, name: "Animal II", type: 3 },
  "24": { if_unlock: 0, level_count_limit: 200, money: 0, name: "Fruit", type: 3 },
  "25": { if_unlock: 0, level_count_limit: 221, money: 0, name: "Animal III", type: 3 },
  "26": { if_unlock: 0, level_count_limit: 243, money: 0, name: "Mooncake II", type: 3 },
  "27": { if_unlock: 0, level_count_limit: 265, money: 10, name: "Building II", type: 3 },
  "28": { if_unlock: 0, level_count_limit: 120, money: 10, name: "Limited", type: 1 }
};
const DEFAULT_PARAMETER_CONF = {
  bubble_step: { para_value: 15 },
  coin_1: { para_value: 5 },
  coin_2: { para_value: 10 },
  force_cd_1: { para_value: 3 },
  force_step: { para_value: 10 },
  bigmoney_gold_only: { para_value: 888 },
  show_red_bag: { para_value: 88 },
  lucky_reward_rate_video_rate: { para_value: 3 },
  red_bag_value: { para_value: 88 },
  reshuffle_cluster: {
    para_value: {
      neighborWeight: 3,
      rowWeight: 1,
      colWeight: 1,
      iterations: 200,
      temperature: 0.35
    }
  }
};
const DEFAULT_COMBO_CONF = {
  "1": { count_max: 5, count_min: 0, time_limit: 8 },
  "2": { count_max: 7, count_min: 5, time_limit: 7 },
  "3": { count_max: 999, count_min: 7, time_limit: 5 }
};
const DEFAULT_LEVEL_DESC_INFO = {
  coin_extract_level: [0, 1, 3, 5, 8, 12, 16, 20, 25, 30, 35, 40, 45, 50, 55, 60],
  gold_extract_level: [0, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 60],
  red_bag_level: [4, 8],
  coin_limit: [1000, 3000, 5000, 8000, 10000, 15000],
  exchange_percent_3: [0, 0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  gold_extract_title: ["1", "1.2", "1.5", "2", "2.5", "3", "4", "5", "6", "8", "10", "12", "15", "20", "30"],
  lucky_level_count_limit: [4, 10, 16, 22, 28, 34, 40],
  new_year_level: [4, 8]
};
const DEFAULT_SCROLL_MSG = [{
  head: "",
  money: "0.88",
  name: "Offline-A"
}, {
  head: "",
  money: "1.28",
  name: "Offline-B"
}, {
  head: "",
  money: "2.88",
  name: "Offline-C"
}];
const DEFAULT_BIG_MSG = [{
  amount: "8.88",
  image: "",
  msg: "Offline mode is active",
  name: "Offline-A"
}, {
  amount: "12.88",
  image: "",
  msg: "Local progress saved",
  name: "Offline-B"
}];

let cachedLoopStartIndex = -1;
let cachedLevelConf = null;
let cachedCardGroupConf = null;
let cachedLevelProfiles = null;
let cachedLevelConfigResPath = null;
let levelProfilesLoadingPromise = null;

function getLevelConfigResPath() {
  return NativeUtils.levelConfigResPath;
}

function getLevelConfigFileLabel() {
  return NativeUtils.isFlag ? "level_b.json" : "Level.json";
}

function resetLevelProfileCache() {
  cachedLevelProfiles = null;
  cachedLevelConf = null;
  cachedCardGroupConf = null;
  cachedLoopStartIndex = -1;
  cachedLevelConfigResPath = null;
  levelProfilesLoadingPromise = null;
}

function clone(e) {
  return JSON.parse(JSON.stringify(e));
}

function deepMerge(base, extra) {
  var result = clone(base);
  for (var key in extra) {
    if (!extra.hasOwnProperty(key)) {
      continue;
    }
    if ("object" == typeof extra[key] && null !== extra[key] && !Array.isArray(extra[key])) {
      result[key] = deepMerge(result[key] || {}, extra[key]);
    } else {
      result[key] = extra[key];
    }
  }
  return result;
}

function getLevelProfilesSync() {
  if (!cachedLevelProfiles) {
    throw new Error(getLevelConfigFileLabel() + " not loaded");
  }
  return cachedLevelProfiles;
}

function ensureLevelProfiles() {
  var resPath = getLevelConfigResPath();
  if (cachedLevelProfiles && cachedLevelConfigResPath === resPath) {
    return Promise.resolve(cachedLevelProfiles);
  }
  if (cachedLevelConfigResPath !== resPath) {
    resetLevelProfileCache();
  }
  if (levelProfilesLoadingPromise) {
    return levelProfilesLoadingPromise;
  }
  levelProfilesLoadingPromise = new Promise(function (resolve, reject) {
    cc.resources.load(resPath, cc.JsonAsset, function (error, asset) {
      if (error) {
        levelProfilesLoadingPromise = null;
        reject(error);
        return;
      }
      var json = asset && asset.json ? asset.json : asset;
      if (!Array.isArray(json)) {
        levelProfilesLoadingPromise = null;
        reject(new Error(getLevelConfigFileLabel() + " format invalid"));
        return;
      }
      cachedLevelProfiles = json;
      cachedLevelConfigResPath = resPath;
      resolve(cachedLevelProfiles);
    });
  });
  return levelProfilesLoadingPromise;
}

function getLoopStartIndex() {
  var levelProfiles = getLevelProfilesSync();
  if (cachedLoopStartIndex >= 0) {
    return cachedLoopStartIndex;
  }
  cachedLoopStartIndex = 0;
  for (var i = 0; i < levelProfiles.length; i++) {
    if (levelProfiles[i] && levelProfiles[i].level_info && levelProfiles[i].level_info.level_id === LOOP_START_LEVEL) {
      cachedLoopStartIndex = i;
      break;
    }
  }
  return cachedLoopStartIndex;
}

function findProfileIndexByLevelId(levelId) {
  var levelProfiles = getLevelProfilesSync();
  var targetLevel = Math.floor(Number(levelId) || 0);
  if (targetLevel < 1) {
    return -1;
  }
  var bestIndex = -1;
  var bestTurn = Number.MAX_SAFE_INTEGER;
  for (var i = 0; i < levelProfiles.length; i++) {
    var profile = levelProfiles[i];
    if (!profile || !profile.level_info || profile.level_info.level_id !== targetLevel) {
      continue;
    }
    var turnId = profile.level_info.turn_id || 1;
    if (bestIndex < 0 || turnId < bestTurn) {
      bestIndex = i;
      bestTurn = turnId;
    }
  }
  return bestIndex;
}

function applyJumpToLevel(state, levelId) {
  var profileIndex = findProfileIndexByLevelId(levelId);
  if (profileIndex < 0) {
    return null;
  }
  state.currentProfileIndex = profileIndex;
  state.successCount = Math.max(state.successCount, profileIndex);
  state.pendingSettlementCoin = 0;
  saveState(state);
  var profile = getCurrentProfile(state);
  return {
    game_level: profile.level_info.level_id,
    lun_level: profile.lun_level,
    profile_index: profileIndex
  };
}

function buildLevelConf() {
  var levelProfiles = getLevelProfilesSync();
  if (cachedLevelConf) {
    return cachedLevelConf;
  }
  var result = {};
  for (var i = 0; i < levelProfiles.length; i++) {
    var profile = levelProfiles[i];
    if (!profile || result[profile.lun_level]) {
      continue;
    }
    var mapData = profile.level_data.mapData || [];
    var rows = mapData.length;
    var cols = rows > 0 ? mapData[0].length : 0;
    var pairCount = 0;
    var typeMap = {};
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var cell = mapData[row][col];
        if (cell && 0 !== cell.type) {
          pairCount++;
          typeMap[cell.type] = 1;
        }
      }
    }
    result[profile.lun_level] = {
      "0_pair_count": 0,
      "1_pair_count": 0,
      "2_pair_count": Math.floor(pairCount / 2),
      card_group_id: 1,
      card_pair_count: Math.floor(pairCount / 2),
      card_type_count: Object.keys(typeMap).length,
      size: rows + "*" + cols,
      special_pair_count: 0,
      time: profile.countdown
    };
  }
  cachedLevelConf = result;
  return cachedLevelConf;
}

function buildCardGroupConf() {
  var levelProfiles = getLevelProfilesSync();
  if (cachedCardGroupConf) {
    return cachedCardGroupConf;
  }
  var typeMap = {};
  for (var i = 0; i < levelProfiles.length; i++) {
    var mapData = levelProfiles[i].level_data.mapData || [];
    for (var row = 0; row < mapData.length; row++) {
      for (var col = 0; col < mapData[row].length; col++) {
        var cell = mapData[row][col];
        if (cell && 0 !== cell.type && cell.type < 100) {
          typeMap[cell.type] = 1;
        }
      }
    }
  }
  cachedCardGroupConf = {
    "1": {
      cardId: Object.keys(typeMap).map(function (e) {
        return Number(e);
      }).sort(function (a, b) {
        return a - b;
      }).concat([101, 102, 103, 104])
    }
  };
  return cachedCardGroupConf;
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function success(data, message = "success") {
  return {
    code: 1,
    data: data,
    ecp: 0,
    message: message
  };
}

function createSignInInfo() {
  var info = [];
  for (var i = 0; i < DEFAULT_SIGN_REWARDS.length; i++) {
    info.push({
      _is_top: i === 0 || i === 6 || i === 13 || i === 14 ? 1 : 0,
      id: String(i + 1),
      login_days: 30,
      show_money: DEFAULT_SIGN_REWARDS[i],
      sign_up_day_limit: i + 1,
      status: 0,
      true_money: DEFAULT_SIGN_REWARDS[i],
      user_level: 1,
      user_level_limit: i >= 14 ? 30 : 0
    });
  }
  return info;
}

function createLuckyDrawState() {
  return DEFAULT_LUCKY_DRAW.map(function (item) {
    return {
      id: item.id,
      status: 0
    };
  });
}

function createDefaultState() {
  var userSeed = Math.floor(Date.now() % 100000000).toString();
  return {
    version: STATE_VERSION,
    userId: userSeed,
    yid: userSeed + "_" + Math.floor(Math.random() * 10000000000).toString(),
    userName: "Tourist" + userSeed,
    nickname: "Tourist" + userSeed,
    createTime: nowSeconds(),
    currentProfileIndex: 0,
    successCount: 0,
    coinBalance: 0,
    goldBalance: 0,
    propInfo: {
      prop1_num: 1,
      prop2_num: 1,
      prop3_num: 1
    },
    noviceStatus: 0,
    guideStepNew: "0",
    favoriteInfo: {
      "1": "1",
      "2": "4",
      "3": "8"
    },
    signInInfo: createSignInInfo(),
    luckyDrawState: createLuckyDrawState(),
    luckyCount: 0,
    pendingSettlementCoin: 0,
    recoSwitch: 1,
    bigScrollXcCount: 5,
    freeLotteryFlag: 0,
    coinExtractAmount: 35,
    lastExchangeTime: 0
  };
}

function loadState() {
  var levelProfiles = getLevelProfilesSync();
  var raw = cc.sys.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultState();
  }
  try {
    var parsed = JSON.parse(raw);
    var state = deepMerge(createDefaultState(), parsed || {});
    if (state.currentProfileIndex < 0 || state.currentProfileIndex >= levelProfiles.length) {
      state.currentProfileIndex = getLoopStartIndex();
    }
    return state;
  } catch (e) {
    return createDefaultState();
  }
}

function saveState(state) {
  cc.sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentProfile(state) {
  var levelProfiles = getLevelProfilesSync();
  return clone(levelProfiles[state.currentProfileIndex] || levelProfiles[0]);
}

function getNextProfileIndex(state) {
  var levelProfiles = getLevelProfilesSync();
  var nextIndex = state.currentProfileIndex + 1;
  if (nextIndex >= levelProfiles.length) {
    return getLoopStartIndex();
  }
  return nextIndex;
}

function getUserLevel(state) {
  return Math.max(1, Math.floor(state.successCount / 10) + 1);
}

function getPassCoinReward(profile) {
  var level = profile.level_info.level_id;
  return Math.min(30, 5 + Math.floor(level / 2));
}

function getPassGoldReward(profile) {
  var level = profile.level_info.level_id;
  if (4 === level) {
    return 1000;
  }
  if (8 === level) {
    return 888;
  }
  return 0;
}

function getBubbleCoinText(state) {
  return "Coin: " + (state.coinBalance / 100).toFixed(2);
}

function getBubbleGoldText(state, profile) {
  return "Level " + profile.level_info.level_id + " / Round " + profile.level_info.round_id;
}

function getPendingReward(state, fallbackReward) {
  return state.pendingSettlementCoin > 0 ? state.pendingSettlementCoin : fallbackReward;
}

function consumePendingReward(state) {
  state.pendingSettlementCoin = 0;
}

function updateLuckyCount(state) {
  if (3 === state.successCount || state.successCount > 3 && 0 === (state.successCount - 3) % 10) {
    state.luckyCount += 1;
  }
}

function buildLuckyDrawInfo(state) {
  return DEFAULT_LUCKY_DRAW.map(function (item, index) {
    var rewardState = state.luckyDrawState[index] || {
      id: item.id,
      status: 0
    };
    return {
      begin_time: [0],
      bingo: item.id,
      end_time: item.waitDayLimit > 0 ? nowSeconds() + 86400 : 0,
      level_count: 0,
      level_count_limit: item.levelLimit,
      level_id: item.levelId,
      lucky_draw_id: String(item.id),
      money: item.money,
      priceName: item.priceName,
      show_money: item.showMoney,
      status: rewardState.status,
      success_count: state.successCount,
      type: item.type,
      user_level_limit: item.userLevelLimit,
      video_count: 0,
      video_count_limit: 0,
      wait_day_limit: item.waitDayLimit,
      xc_level: getUserLevel(state)
    };
  });
}

function getNextLuckyLevel(state) {
  if (state.successCount < 3) {
    return 3 - state.successCount;
  }
  var offset = (state.successCount - 3) % 10;
  return 0 === offset ? 10 : 10 - offset;
}

function getAtlasStateList(state, atlasType) {
  var currentCount = Math.max(0, state.successCount);
  var list = [];
  for (var key in DEFAULT_ATLAS_CONF) {
    if (!DEFAULT_ATLAS_CONF.hasOwnProperty(key)) {
      continue;
    }
    var atlasItem = DEFAULT_ATLAS_CONF[key];
    if (atlasItem.type !== atlasType) {
      continue;
    }
    var isUnlocked = atlasItem.if_unlock === 1 || currentCount >= atlasItem.level_count_limit;
    list.push({
      current_level_count: currentCount,
      favorite: state.favoriteInfo[String(atlasType)] == key ? 1 : 0,
      id: key,
      level_count_limit: atlasItem.level_count_limit,
      lock: isUnlocked ? 0 : 1,
      money: atlasItem.money,
      name: atlasItem.name
    });
  }
  list.sort(function (a, b) {
    return Number(a.id) - Number(b.id);
  });
  return list;
}

function getCollectionCount(state) {
  var total = 0;
  var lists = [getAtlasStateList(state, 1), getAtlasStateList(state, 2), getAtlasStateList(state, 3)];
  for (var i = 0; i < lists.length; i++) {
    for (var j = 0; j < lists[i].length; j++) {
      total += lists[i][j].lock === 0 ? 1 : 0;
    }
  }
  return total;
}

function getTujianInfo(state) {
  return {
    extract_info: {
      collection_count: getCollectionCount(state),
      collection_count_limit: 28,
      show_money: 0,
      user_grade: getUserLevel(state),
      user_grade_limit: 30
    },
    info: [{
      extract_status: 0,
      list: getAtlasStateList(state, 1)
    }, {
      extract_status: 0,
      list: getAtlasStateList(state, 2)
    }, {
      extract_status: 0,
      list: getAtlasStateList(state, 3)
    }]
  };
}

function getCoinExchangeInfo(state) {
  var percents = [0.01, 0.02, 0.05, 0.1, 0.2];
  var levels = [1, 3, 5, 10, 15];
  var info = [];
  for (var i = 0; i < levels.length; i++) {
    var amount = Math.max(0, Math.floor(state.coinBalance * percents[i]));
    info.push({
      amount: amount,
      coin_limit: DEFAULT_LEVEL_DESC_INFO.coin_limit[Math.min(i, DEFAULT_LEVEL_DESC_INFO.coin_limit.length - 1)],
      extract_amount: amount,
      extract_status: 0,
      id: i + 1,
      level_target: levels[i],
      level_target_limit: levels[i],
      limit_days_begin_time: nowSeconds(),
      limit_days_end_time: nowSeconds() + 60,
      status: 0,
      exchange_percent: percents[Math.min(i, 1)],
      exchange_percent_3: percents[i]
    });
  }
  return info;
}

function getGoldExchangeInfo(state) {
  var maxId = 1;
  if (state.successCount >= 20) {
    maxId = 2;
  }
  if (state.successCount >= 40) {
    maxId = 3;
  }
  if (state.successCount >= 60) {
    maxId = 4;
  }
  var titles = ["1", "1.2", "1.5", "2"];
  var amounts = [
    Math.max(0, Math.floor(state.goldBalance * 0.1)),
    Math.max(0, Math.floor(state.goldBalance * 0.2)),
    Math.max(0, Math.floor(state.goldBalance * 0.5)),
    state.goldBalance
  ];
  var thresholds = [0, 20, 40, 60];
  var info = [];
  for (var i = 0; i < titles.length; i++) {
    info.push({
      amount: amounts[i],
      id: String(i + 1),
      level: getUserLevel(state),
      level_limit: 0,
      right_count: state.successCount,
      right_count_limit: thresholds[i],
      sign: 0,
      sign_limit: 0,
      sign_pass: state.successCount,
      sign_pass_limit: 0,
      title: titles[i],
      exchange_percent: i === 0 ? 0.01 : i === 1 ? 0.02 : 1
    });
  }
  return {
    gold_balance: state.goldBalance,
    info: info,
    level: maxId,
    step_xc_count: 0,
    xc_level_need_xc_count: 30
  };
}

function buildUserInfo(state) {
  var profile = getCurrentProfile(state);
  return {
    ab_info: {
      gold_extract_0303_ab: "s0"
    },
    big_scroll_xc_count: state.bigScrollXcCount,
    bind_wx: 0,
    bubble_coin_balance: getBubbleCoinText(state),
    bubble_gold_balance: getBubbleGoldText(state, profile),
    coin_balance: state.coinBalance,
    coin_extract_amount: state.coinExtractAmount,
    coin_extract_desc: "Offline exchange description",
    coin_limit: DEFAULT_COIN_LIMIT,
    complete_atlas: {},
    conf_info: {
      atlas_conf: clone(DEFAULT_ATLAS_CONF),
      card_conf: buildCardGroupConf(),
      combo_conf: clone(DEFAULT_COMBO_CONF),
      level_conf: buildLevelConf(),
      parameter_conf: clone(DEFAULT_PARAMETER_CONF)
    },
    create_time: state.createTime,
    extract_coin_desc: "Offline coin extract rule",
    extract_desc: "Offline extract description",
    extract_status: 0,
    favorite_info: clone(state.favoriteInfo),
    free_lottery_flag: state.freeLotteryFlag,
    game_level: profile.level_info.level_id,
    gender: "unknown",
    gold_balance: state.goldBalance,
    gold_extract_desc: "Offline gold extract rule",
    guide_step_new: void 0 !== state.guideStepNew ? state.guideStepNew : "0",
    headimgurl: "",
    level: getUserLevel(state),
    level_3_show_gold_reward: 1000,
    level_desc_info: clone(DEFAULT_LEVEL_DESC_INFO),
    nickname: state.nickname,
    novice_status: state.noviceStatus,
    off_time: 0,
    prop_info: clone(state.propInfo),
    reco_switch: state.recoSwitch,
    show_task: 0,
    sign_in_info: clone(state.signInInfo),
    sign_popup_flag: 0,
    skin_list: [],
    task_list: [],
    task_show: 0
  };
}

function parseField(result, fieldName) {
  if (!result || !fieldName) {
    return "";
  }
  var marker = 'name="' + fieldName + '"\r\n\r\n';
  var start = result.indexOf(marker);
  if (start < 0) {
    return "";
  }
  start += marker.length;
  var end = result.indexOf("\r\n--", start);
  if (end < 0) {
    return result.substring(start).trim();
  }
  return result.substring(start, end).trim();
}

function parsePayload(formData) {
  if (!formData || "string" != typeof formData._result) {
    return {};
  }
  var businessData = parseField(formData._result, "business_data");
  if (!businessData) {
    return {};
  }
  try {
    return JSON.parse(businessData);
  } catch (e) {}
  try {
    return JSON.parse(unescape(businessData));
  } catch (e) {}
  return {};
}

function normalizePath(url) {
  var normalized = url || "";
  var queryIndex = normalized.indexOf("?");
  if (queryIndex >= 0) {
    normalized = normalized.substring(0, queryIndex);
  }
  normalized = normalized.replace(/^https?:\/\/[^/]+\//, "");
  normalized = normalized.replace(/^ddfc\//, "");
  normalized = normalized.replace(/^\/+/, "");
  return normalized;
}

export default class OfflineService {
  /** 按 isFlag 加载关卡 JSON，并返回 level_conf（供 GameConfig 使用） */
  static loadLevelConf() {
    return ensureLevelProfiles().then(function () {
      return buildLevelConf();
    });
  }

  static isEnabled() {
    return true;
  }

  static shouldHandlePost(url) {
    if (!this.isEnabled()) {
      return false;
    }
    var path = normalizePath(url);
    return path.length > 0;
  }

  static handlePost(url, formData) {
    try {
      var path = normalizePath(url);
      var payload = parsePayload(formData);
      return this.route(path, payload || {}).then(function (response) {
        return clone(response);
      });
    } catch (e) {
      return Promise.reject({
        code: -1,
        message: e && e.message ? e.message : "offline route error",
        http_status: 0
      });
    }
  }

  static async route(path, payload) {
    await ensureLevelProfiles();
    var state = loadState();
    var response = null;
    switch (path) {
      case "config":
        response = success({
          activate: 1,
          config_data: {
            new_user: 1
          },
          element_conf: {},
          is_encrypt: false,
          is_reviewer: 0,
          map_conf: {},
          tongdun_info: '{"action":"activate"}'
        });
        break;
      case "login/auto_submit":
        response = success(state.yid ? {
          user_id: state.userId,
          user_name: state.userName,
          yid: state.yid
        } : {});
        break;
      case "login/tourists_submit":
      case "login/wechat_submit":
      case "login/tourists_bind_wechat":
        saveState(state);
        response = success({
          user_id: state.userId,
          user_name: state.userName,
          yid: state.yid
        });
        break;
      case "behaviors/info":
        saveState(state);
        response = success(buildUserInfo(state));
        break;
      case "behaviors/config":
        response = success({});
        break;
      case "behaviors/reco_switch":
        state.recoSwitch = void 0 === payload.reco_switch ? state.recoSwitch : payload.reco_switch;
        saveState(state);
        response = success({});
        break;
      case "behaviors/scroll_msg":
      case "behaviors/wf_scroll_msg":
        response = success({
          msg_list: clone(DEFAULT_SCROLL_MSG),
          size: DEFAULT_SCROLL_MSG.length
        });
        break;
      case "behaviors/big_scroll_msg":
        response = success({
          dm_info: []
        });
        break;
      case "game/start_game":
        {
          var profile = getCurrentProfile(state);
          var gameLevel = profile.level_info.level_id;
          var unlockList = [];
          if (2 === gameLevel) {
            unlockList.push(1);
          }
          if (3 === gameLevel) {
            unlockList.push(2);
          }
          if (4 === gameLevel) {
            unlockList.push(3);
          }
          response = success({
            big_coin_verify_info: {
              current_verify_commission: 0,
              extract_list: [],
              verify_commission: 0
            },
            bubble_coin_balance: getBubbleCoinText(state),
            bubble_gold_balance: getBubbleGoldText(state, profile),
            coin_balance: state.coinBalance,
            complete_atlas: {},
            free_prop: {},
            game_level: gameLevel,
            gold_balance: state.goldBalance,
            gold_bubble_flag: state.luckyCount > 0 ? 1 : 0,
            is_extract: 0,
            levelup_gold: 0,
            levelup_only_coin: getPassCoinReward(profile),
            lucky_bubble: state.luckyCount > 0 ? "Lucky draw ready" : "Clear more levels",
            lucky_count: state.luckyCount,
            lun_level: profile.lun_level,
            process_info: null,
            profile: profile,
            prop_info: clone(state.propInfo),
            success_count: state.successCount,
            sync_data: "",
            third_extract_level: 0,
            unlock_prop_list: unlockList,
            use_profile_data: 1,
            use_profile_on_restart: 1,
            used_free_revive: 0
          });
        }
        break;
      case "game/clear_submit":
        {
          var currentProfile = getCurrentProfile(state);
          var passCoinReward = getPassCoinReward(currentProfile);
          var passGoldReward = getPassGoldReward(currentProfile);
          if (payload.is_tg == 1) {
            state.successCount += 1;
            state.pendingSettlementCoin = passCoinReward;
            if (passGoldReward > 0) {
              state.goldBalance += passGoldReward;
            }
            updateLuckyCount(state);
            state.currentProfileIndex = getNextProfileIndex(state);
          }
          saveState(state);
          response = success({
            big_coin_verify_info: {
              current_verify_commission: 0,
              extract_list: [],
              verify_commission: 0
            },
            bubble_coin_balance: getBubbleCoinText(state),
            bubble_gold_balance: getBubbleGoldText(state, currentProfile),
            coin_balance: state.coinBalance,
            coin_limit: DEFAULT_LEVEL_DESC_INFO.coin_limit,
            coin_reward: 0,
            extract_status: 0,
            force_flag: 0,
            gold_balance: state.goldBalance,
            gold_bubble_flag: state.luckyCount > 0 ? 1 : 0,
            gold_reward: 0,
            is_extract: 0,
            level: getUserLevel(state),
            lucky_count: state.luckyCount,
            lun_count: currentProfile.lun_level,
            make_up_reward: "",
            process_info: null,
            prop_info: clone(state.propInfo),
            show_only_reward: passCoinReward,
            show_xc_video_reward: passCoinReward * DEFAULT_PARAMETER_CONF.lucky_reward_rate_video_rate.para_value,
            speed_reward: 0,
            sucess_count: state.successCount,
            task_popup_flag: 0,
            tg_gold_reward: passGoldReward,
            tg_progress_info: {},
            tg_reward: passCoinReward,
            tx_ratio: {},
            xc_seven_count_popup_flag: 0
          });
        }
        break;
      case "game/only_reward":
        {
          var rewardProfile = getCurrentProfile(state);
          var onlyReward = getPendingReward(state, getPassCoinReward(rewardProfile));
          state.coinBalance += onlyReward;
          consumePendingReward(state);
          saveState(state);
          response = success({
            bubble_coin_balance: getBubbleCoinText(state),
            bubble_gold_balance: getBubbleGoldText(state, rewardProfile),
            coin_balance: state.coinBalance,
            gold_balance: state.goldBalance,
            gold_reward: 0,
            make_up_reward: "",
            reward: onlyReward
          });
        }
        break;
      case "game/clear_video":
        {
          var rewardData = {
            coin_reward: 0,
            gold_reward: 0
          };
          if (payload.prop_type > 0) {
            if (payload.is_over) {
              if (payload.prop_type == 1) {
                state.propInfo.prop1_num += 1;
              }
              if (payload.prop_type == 2) {
                state.propInfo.prop2_num += 3;
              }
              if (payload.prop_type == 3) {
                state.propInfo.prop3_num += 1;
              }
            }
          } else {
            var videoProfile = getCurrentProfile(state);
            var baseReward = getPendingReward(state, getPassCoinReward(videoProfile));
            var videoReward = baseReward;
            if (payload.isSettle && payload.is_over && payload.double_num) {
              videoReward = baseReward * Number(payload.double_num);
            } else if (payload.is_over) {
              videoReward = baseReward * DEFAULT_PARAMETER_CONF.lucky_reward_rate_video_rate.para_value;
            }
            rewardData.coin_reward = videoReward;
            state.coinBalance += videoReward;
            consumePendingReward(state);
          }
          saveState(state);
          response = {
            code: 1,
            data: {
              bubble_coin_balance: getBubbleCoinText(state),
              bubble_gold_balance: getBubbleGoldText(state, getCurrentProfile(state)),
              coin_balance: state.coinBalance,
              coin_reward: rewardData.coin_reward,
              gold_balance: state.goldBalance,
              gold_bubble_flag: state.luckyCount > 0 ? 1 : 0,
              gold_reward: rewardData.gold_reward,
              make_up_reward: "",
              prop_info: clone(state.propInfo)
            },
            ecp: 0,
            message: "success",
            prop_info: clone(state.propInfo)
          };
        }
        break;
      case "game/novice_sync":
        state.noviceStatus = void 0 === payload.novice_status ? state.noviceStatus : payload.novice_status;
        if (void 0 !== payload.guide_step_new && null !== payload.guide_step_new && "" !== payload.guide_step_new) {
          state.guideStepNew = String(payload.guide_step_new);
        } else if (void 0 === state.guideStepNew || null === state.guideStepNew || "" === state.guideStepNew) {
          state.guideStepNew = "0";
        }
        saveState(state);
        response = success({
          guide_step_new: state.guideStepNew,
          novice_status: state.noviceStatus
        });
        break;
      case "game/use_prop":
        if (payload.prop_id == 1 && state.propInfo.prop1_num > 0) {
          state.propInfo.prop1_num -= 1;
        }
        if (payload.prop_id == 2 && state.propInfo.prop2_num > 0) {
          state.propInfo.prop2_num -= 1;
        }
        if (payload.prop_id == 3 && state.propInfo.prop3_num > 0) {
          state.propInfo.prop3_num -= 1;
        }
        saveState(state);
        response = success({
          prop_info: clone(state.propInfo)
        });
        break;
      case "game/ranking_order":
        response = success({
          rank_list: [],
          self_info: null
        });
        break;
      case "game/task_info":
        response = success({
          info: [],
          task_popup_flag: 0
        });
        break;
      case "game/sign_in_info":
      case "game/sign_info":
        saveState(state);
        response = success({
          info: clone(state.signInInfo)
        });
        break;
      case "game/sign_in":
        {
          var signId = String(payload.sign_id || "");
          var reward = 0;
          for (var i = 0; i < state.signInInfo.length; i++) {
            if (state.signInInfo[i].id === signId && state.signInInfo[i].status === 0) {
              state.signInInfo[i].status = 1;
              reward = Number(state.signInInfo[i].show_money || 0);
              break;
            }
          }
          state.goldBalance += reward;
          saveState(state);
          response = success({
            gold_balance: state.goldBalance,
            info: clone(state.signInInfo),
            reward: reward
          });
        }
        break;
      case "game/gallery_info":
      case "game/get_user_map":
        response = success(getTujianInfo(state));
        break;
      case "game/favorite":
      case "game/use_skin":
        if (payload.select_data) {
          state.favoriteInfo = deepMerge(state.favoriteInfo, payload.select_data);
        }
        saveState(state);
        response = success({});
        break;
      case "extract/gallery_extract":
      case "game/map_coin_extract":
        response = success({
          amount: 0,
          coin_balance: state.coinBalance,
          exchange_percent: 1
        });
        break;
      case "game/lucky_draw_info":
        response = success({
          info: buildLuckyDrawInfo(state),
          need_level: getNextLuckyLevel(state)
        });
        break;
      case "extract/lucky_extract":
        {
          var luckyId = Number(payload.tx_id || 0);
          var luckyInfo = buildLuckyDrawInfo(state);
          var amount = 0;
          var drawItem = luckyInfo[luckyId - 1];
          if (drawItem && drawItem.status === 0 && state.luckyCount > 0) {
            state.luckyCount -= 1;
            state.luckyDrawState[luckyId - 1].status = 1;
            if (drawItem.type === 1) {
              amount = Number(drawItem.money || 0);
              state.coinBalance += amount;
            } else if (luckyId === 2) {
              state.propInfo.prop2_num += 3;
            } else if (luckyId === 4) {
              state.propInfo.prop3_num += 1;
            } else if (luckyId === 6) {
              state.propInfo.prop1_num += 1;
            }
          }
          saveState(state);
          response = success({
            amount: amount,
            info: buildLuckyDrawInfo(state),
            lucky_bubble: state.luckyCount > 0 ? "Lucky draw ready" : "",
            prop_info: clone(state.propInfo)
          });
        }
        break;
      case "lottery/config":
        response = success({
          info: buildLuckyDrawInfo(state)
        });
        break;
      case "extract/coin_extract_info":
        response = success({
          extract_status: 0,
          info: getCoinExchangeInfo(state)
        });
        break;
      case "extract/coin_extract":
      case "extract/coin_extract_v2":
        {
          var exchangeAmount = state.coinBalance;
          state.coinBalance = 0;
          state.lastExchangeTime = nowSeconds();
          saveState(state);
          response = success({
            amount: exchangeAmount,
            coin_balance: state.coinBalance,
            extract_amount: exchangeAmount,
            extract_status: 2,
            limit_days_begin_time: state.lastExchangeTime,
            limit_days_end_time: state.lastExchangeTime + 60,
            exchange_percent: 1,
            exchange_percent_3: 1
          });
        }
        break;
      case "extract/gold_extract_info":
        response = success(getGoldExchangeInfo(state));
        break;
      case "extract/gold_extract":
        {
          var goldAmount = state.goldBalance;
          state.goldBalance = 0;
          saveState(state);
          response = success({
            account_time: nowSeconds(),
            amount: goldAmount,
            gold_balance: state.goldBalance
          });
        }
        break;
      case "extract/level_extract_info":
        response = success({
          info: []
        });
        break;
      case "extract/balance_details":
      case "extract/extract_coin_record":
        response = success({
          list: []
        });
        break;
      case "extract/task_extract":
      case "extract/receive_level_reward":
      case "task/days_task_info":
      case "task/received_days_task":
      case "task/task_scorll_msg":
      case "game/open_box":
      case "game/box_reward":
      case "game/new_reward":
      case "game/wufu_reward":
      case "game/fragmentation":
      case "game/set_card_num":
      case "game/subsidy_reward":
      case "game/big_coin_verify_info":
        response = success({
          big_coin_verify_info: {
            current_verify_commission: 0,
            extract_list: [],
            verify_commission: 0
          },
          info: []
        });
        break;
      case "agreement_report":
      case "shumeng_report":
      case "chat/main":
      case "chat/msg_pop":
      case "game/update_level":
      case "activity_info":
      case "game/set_level":
        {
          var jumpInfo = applyJumpToLevel(state, payload.level_id);
          response = success(jumpInfo || {});
        }
        break;
      case "game/update_stage":
      case "game/set_number":
      case "game/create_new_user":
        response = success({});
        break;
      case "login/user_cancel":
        cc.sys.localStorage.removeItem(STORAGE_KEY);
        response = success({});
        break;
      default:
        response = success({});
    }
    return response;
  }
}
