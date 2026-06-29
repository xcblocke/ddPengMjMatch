import { PropType } from "./framework/enum/AllEnum";

export enum EAppThemeType {
  Theme1 = 0,
  Theme2 = 1,
  Theme3 = 2,
  Theme4 = 3,
}
export var appTheme = EAppThemeType.Theme2;

export let levelRewardCoin = 100;
export let propCostDollar = {
  [PropType.tipCard]: 100,
  [PropType.reshuffleCard]: 100,
};

export enum ServerType {
  develop = 1,  // 开发服
  release = 2, // 正式服
}

export enum GameEnterModel {
  shenheModel = 0,//审核模式
  aModel = 1,//a面模式
  bModel = 2, //b面模式
}

export let gameEnterModel = GameEnterModel.shenheModel;

export const MainConfig = {
  curServerType: 1,
  isWhite: false,
  serveUrl: "",
};


export const TujianUnlockConfig = [
  {
    unlockLevel: 1,
    unLockIDs: [102,103,104,105],
    unlockDesc: "",
  },
  {
    unlockLevel: 10,
    unLockIDs: [106,107,108,109],
    unlockDesc: "",
  },
  {
    unlockLevel: 20,
    unLockIDs: [110,111,112,113],
    unlockDesc: "",
  },
  {
    unlockLevel: 30,
    unLockIDs: [114,115,116,117],
    unlockDesc: "",
  },
  {
    unlockLevel: 50,
    unLockIDs: [118,119,120,121],
    unlockDesc: "",
  },
];

export function getTujianUnlockForLevel(level: number) {
  const normalizedLevel = Math.floor(Number(level));
  return TujianUnlockConfig.find((item) => item.unlockLevel === normalizedLevel) || null;
}

export function hasTujianUnlockForLevel(level: number): boolean {
  return getTujianUnlockForLevel(level) !== null;
}


export const propLevelShowConfig = {
  [PropType.tipCard]: {
    level: 3,
  },
  [PropType.reshuffleCard]: {
    level: 2,
  },
};

export interface IGameLevelPropConfig {
  /** 到达该关卡开始展示并解锁道具栏，如 4 表示第 4 关 */
  UnlevelPropConfig: number;
  /** 解锁时赠送的刷新道具数量 */
  unlockReshuffleCount: number;
  /** 解锁时赠送的提示道具数量 */
  unlockTipCount: number;
  /** 无道具栏时，启用 idle 自动提示的关卡 */
  earlyAutoHintLevels: number[];
  /** 无操作超过该秒数后自动提示（交互同提示道具，不消耗道具） */
  earlyAutoHintIdleSeconds: number;
}

const DEFAULT_GAME_LEVEL_PROP_CONFIG: IGameLevelPropConfig = {
  UnlevelPropConfig: 4,
  unlockReshuffleCount: 1,
  unlockTipCount: 3,
  earlyAutoHintLevels: [],
  earlyAutoHintIdleSeconds: 4,
};

/** 关卡道具与前期引导配置（本地默认值；B 面登录后由后台 VERSION_CONF.FSDK_CONF 覆盖） */
export const GameLevelPropConfig: IGameLevelPropConfig = {
  ...DEFAULT_GAME_LEVEL_PROP_CONFIG,
};

function parseEarlyAutoHintLevels(value: unknown): number[] | null {
  if (Array.isArray(value)) {
    const levels = value.map((item) => Math.floor(Number(item))).filter((level) => level > 0);
    return levels.length > 0 ? levels : null;
  }
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parseEarlyAutoHintLevels(parsed);
      }
    } catch (_e) {}
    const levels = raw.split(/[,，\s]+/).map((item) => Math.floor(Number(item))).filter((level) => level > 0);
    return levels.length > 0 ? levels : null;
  }
  return null;
}

/** 将后台字段合并进 GameLevelPropConfig（保留本地默认值作兜底） */
export function applyGameLevelPropConfig(remote?: Record<string, unknown> | null): void {
  if (!remote || typeof remote !== "object") {
    return;
  }
  const unlockLevel = Math.floor(Number(remote.UnlevelPropConfig));
  if (unlockLevel > 0) {
    GameLevelPropConfig.UnlevelPropConfig = unlockLevel;
  }
  const reshuffleCount = Math.floor(Number(remote.unlockReshuffleCount));
  if (!Number.isNaN(reshuffleCount) && reshuffleCount >= 0) {
    GameLevelPropConfig.unlockReshuffleCount = reshuffleCount;
  }
  const tipCount = Math.floor(Number(remote.unlockTipCount));
  if (!Number.isNaN(tipCount) && tipCount >= 0) {
    GameLevelPropConfig.unlockTipCount = tipCount;
  }
  const idleSeconds = Number(remote.earlyAutoHintIdleSeconds);
  if (!Number.isNaN(idleSeconds) && idleSeconds > 0) {
    GameLevelPropConfig.earlyAutoHintIdleSeconds = idleSeconds;
  }
  const hintLevels = parseEarlyAutoHintLevels(remote.earlyAutoHintLevels);
  if (hintLevels) {
    GameLevelPropConfig.earlyAutoHintLevels = hintLevels;
  }
}

export function getUnlockPropLevel(): number {
  const v = Math.floor(Number(GameLevelPropConfig.UnlevelPropConfig));
  return v > 0 ? v : DEFAULT_GAME_LEVEL_PROP_CONFIG.UnlevelPropConfig;
}

/** isWhite 模式下各道具解锁弹窗本地记录 key（存入 unLockPropGuide） */
export const WHITE_PROP_UNLOCK_KEYS: Partial<Record<PropType, string>> = {
  [PropType.reshuffleCard]: "white_reshuffle",
  [PropType.tipCard]: "white_tip",
};

/** isWhite 模式下道具已领取记录 key（存入 unLockPropGuide） */
export const WHITE_PROP_CLAIMED_KEYS: Partial<Record<PropType, string>> = {
  [PropType.reshuffleCard]: "white_reshuffle_claimed",
  [PropType.tipCard]: "white_tip_claimed",
};

function readUnlockPropGuide(): string[] {
  try {
    const guide = JSON.parse(cc.sys.localStorage.getItem("unLockPropGuide") || "[]");
    return Array.isArray(guide) ? guide : [];
  } catch (_e) {
    return [];
  }
}

export function isWhitePropClaimed(propType: PropType): boolean {
  if (!MainConfig.isWhite) {
    return true;
  }
  const key = WHITE_PROP_CLAIMED_KEYS[propType];
  if (!key) {
    return true;
  }
  return readUnlockPropGuide().indexOf(key) >= 0;
}

export function isWhitePropUnlockPopupShown(propType: PropType): boolean {
  if (!MainConfig.isWhite) {
    return false;
  }
  const key = WHITE_PROP_UNLOCK_KEYS[propType];
  if (!key) {
    return false;
  }
  return readUnlockPropGuide().indexOf(key) >= 0;
}

export function getWhitePropGrantCount(propType: PropType): number {
  if (propType === PropType.reshuffleCard) {
    return Math.max(1, Math.floor(Number(GameLevelPropConfig.unlockReshuffleCount) || 1));
  }
  if (propType === PropType.tipCard) {
    return Math.max(1, Math.floor(Number(GameLevelPropConfig.unlockTipCount) || 3));
  }
  return 1;
}

export function markWhitePropClaimed(propType: PropType): void {
  const key = WHITE_PROP_CLAIMED_KEYS[propType];
  if (!key) {
    return;
  }
  const guide = readUnlockPropGuide();
  if (guide.indexOf(key) >= 0) {
    return;
  }
  guide.push(key);
  cc.sys.localStorage.setItem("unLockPropGuide", JSON.stringify(guide));
}

/** isWhite 模式下道具栏展示数量（解锁弹窗待 Claim 且数量为 0 时显示 0） */
export function getWhiteDisplayPropCount(propType: PropType, actualCount: number, gameLevel: number): number {
  if (!MainConfig.isWhite) {
    return actualCount;
  }
  if (gameLevel < getPropShowLevel(propType)) {
    return actualCount;
  }
  if (isWhitePropClaimed(propType)) {
    return actualCount;
  }
  if (actualCount > 0) {
    return actualCount;
  }
  return 0;
}

/** 单个道具在关卡中的展示/解锁等级；非 isWhite 时与 UnlevelPropConfig 一致 */
export function getPropShowLevel(propType: PropType): number {
  if (MainConfig.isWhite) {
    const level = propLevelShowConfig[propType]?.level;
    if (level > 0) {
      return level;
    }
  }
  return getUnlockPropLevel();
}

/** 道具栏最早展示的关卡 */
export function getPropContainerMinShowLevel(): number {
  if (MainConfig.isWhite) {
    return Math.min(
      getPropShowLevel(PropType.reshuffleCard),
      getPropShowLevel(PropType.tipCard)
    );
  }
  return getUnlockPropLevel();
}
