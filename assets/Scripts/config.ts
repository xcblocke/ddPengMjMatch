import { PropType } from "./framework/enum/AllEnum";

export enum EAppThemeType {
  Theme1 = 0,
  Theme2 = 1,
  Theme3 = 2,
  Theme4 = 3,
}
export var appTheme = EAppThemeType.Theme2;

export let levelRewardCoin = 200;
export let propCostDollar = {
  [PropType.tipCard]: 100,
  [PropType.reshuffleCard]: 100,
};

export enum ServerType {
  develop = 1,  // 开发服
  release = 2, // 正式服
}

export const MainConfig = {
  curServerType: 1,
  serveUrl: "",
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
  earlyAutoHintLevels: [2, 3],
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
