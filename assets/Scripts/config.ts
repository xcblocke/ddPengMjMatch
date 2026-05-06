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