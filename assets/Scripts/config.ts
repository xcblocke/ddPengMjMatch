import { PropType } from "./framework/enum/AllEnum";

export var PageConfig = {
  bottomTab: [{
    name: `gkey_263`
  }, {
    name: `gkey_264`
  }, {
    name: `gkey_265`
  }, {
    name: `gkey_250`
  }],
  pageInfo: [{
    title: `gkey_263`,
    tip: `{"gkey_266":{"v1":"${10}"}}`
  }, {
    title: `gkey_264`,
    tip: `{"gkey_267":{"v1":"${10}"}}`
  }, {
    title: `gkey_265`,
    tip: `gkey_265`
  }, {
    title: `gkey_250`,
    tip: `gkey_250`
  }]
};
export var privacy = `{"gkey_268":{"v1":"${2026}","v2":"${0o3}","v3":"${23}","v4":"${1}","v5":"${2}","v6":"${3}","v7":"${4}","v8":"${5}","v9":"${6}","v10":"${7}","v11":"${8}","v12":"${9}","v13":"${10}","v14":"${11}"}}`;
export var resBasePath = "sceneA/";
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