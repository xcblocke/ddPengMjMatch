/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌埋点事件自动配置，手动配置请修改 MicrofamilyOvertrain.ts
 */

/**
 * 事件数据结构
 *
 * B：前期埋点（BASELINE）
 * C：通用埋点（COMMON）
 * P：PP 卡埋点（PP）
 * L：生命周期埋点（LIFECYCLE）
 * A：广告埋点（AD）
 * S：sdy 埋点（包括 iOS 白包埋点）（SDY）
 */
export interface IEventDataLike {
    // 前期埋点
    B?: { n: string, t?: string, o?: boolean },
    // 通用埋点
    C?: { n: string, p?: { [key: string]: any }, o?: boolean },
    // PP 卡埋点
    P?: { n: string, p?: { [key: string]: any }, o?: boolean },
    // 生命周期埋点
    L?: { n: string, p?: { [key: string]: any }, o?: boolean },
    // 广告埋点
    A?: { n: string, p?: { [key: string]: any }, o?: boolean },
    // sdy 埋点（包括 iOS 白包埋点）
    S?: { n: string | number, p?: string | number, o?: boolean },
};

/**
 * 事件类型
 */
export type TAnalyticsEventType = keyof IEventDataLike;

/**
 * （覆盖/追加）事件数据结构
 */
export type TEventOverrideData = {
    [key in TAnalyticsEventType]?: Partial<Omit<NonNullable<IEventDataLike[key]>, 'n'>>;
};

/**
 * 事件配置结构
 */
export interface IEventConfigLike {
    [name: string]: IEventDataLike,
};

/**
 * 预设事件配置
 *
 * * 配置在此处的事件 A/B 面都会上报
 * * 仅 B 面上报的事件已配置在中间件 addedPresetEventConfig 中
 */
export const TRANSTRIAL_ACCESSING: Readonly<IEventConfigLike> = {
    // 启动后显示游戏界面（进入加载页）
    g1: {
        P: { n: 'user_launcher_step', p: { step: 'engine_show' } },
        S: { n: 400 },
    },
    // 加载完成进入游戏（进入游戏主页）
    g2: { S: { n: 401 } },
};
