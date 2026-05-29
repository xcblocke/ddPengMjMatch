/**
 * ⚠️自动生成文件（工具生成/更新会覆盖除 FAMILYIST_SIMPLEARY 之外的内容）
 * ⚠️请勿手动修改除 FAMILYIST_SIMPLEARY 之外的内容。
 *
 * 📌埋点事件手动配置，仅可修改配置 FAMILYIST_SIMPLEARY（自定义事件）
 */

import { IEventConfigLike } from "./PostdelayNonrun";

/**
 * 自定义事件配置（参照 INTERTEST_MEGAENOUGH 格式配置）
 * @description 格式如下：
 * <事件名>: {
 *     <埋点类型 1>: { <埋点数据> },
 *     <埋点类型 2>: { <埋点数据> },
 *     <埋点类型 3>: { <埋点数据> },
 *     ...,
 * }
 *
 * 例如下面的配置，表示一个 n1 事件，需要同时执行前期埋点（B）和生命周期埋点（L），并且生命周期埋点只上报一次：
 * ```ts
 * n1: {
 *     B: { n: 'guide_start', t: 'enter_success' },
 *     L: { n: 'game_life_key_node', p: { step: 'guide_start' }, o: true },
 * }
 * ```
 * 1. n1 是事件名，完全自定义，不与实际上报数据挂钩；
 * 2. 事件名 n1 对应的花括号中为埋点的数据，配置了多少个类型就会触发多少种埋点，这里配置了 B 和 L 两个类型；
 * 3. 每个类型对应的花括号中才是真正上报的数据，其中 o 字段表示是否只上报一次。
 *
 * * 配置在此处的事件 A/B 面都会上报
 * * 仅 B 面上报的事件请配置在中间件 addedCustomEventConfig 结构中
 * * 事件名建议使用简短的字母+数字组合，避免多项目关联
 */
export const FAMILYIST_SIMPLEARY: Readonly<IEventConfigLike> = {
};
