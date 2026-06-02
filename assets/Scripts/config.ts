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

/** 关卡道具与前期引导配置（改 UnlevelPropConfig 即可调整道具解锁关卡） */
export const GameLevelPropConfig = {
  /** 到达该关卡开始展示并解锁道具栏，如 4 表示第 4 关 */
  UnlevelPropConfig: 7,
  /** 解锁时赠送的刷新道具数量 */
  unlockReshuffleCount: 1,
  /** 解锁时赠送的提示道具数量 */
  unlockTipCount: 10,
  /** 无道具栏时，启用 idle 自动提示的关卡 */
  earlyAutoHintLevels: [2, 3,4,5,6],
  /** 无操作超过该秒数后自动提示（交互同提示道具，不消耗道具） */
  earlyAutoHintIdleSeconds: 3,
};

export function getUnlockPropLevel(): number {
  const v = Math.floor(Number(GameLevelPropConfig.UnlevelPropConfig));
  return v > 0 ? v : 4;
}
