/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌桥接文件，提供多语言、登录、SDK、埋点、原生相关等模块的桥接接口
 *
 *
 * ✈️接口（桥接对象 A 的方法，使用时引入 A 并直接调用方法 A.xxx(...) 或属性 A.xxx 即可，参照下方 IAPILike 的定义和详细注释）
 * ========
 *
 * | 接口名 | 必接要求（可多接不可少接） | 描述 |
 * | :---: | :---: | :---: |
 * | a1 | *️⃣按需 | 获取是否 Debug（测试服）版本（原生平台：App 是否 Debug 版本，其中 iOS 白包 SDK 未提供接口默认 false / 小游戏平台：是否开启调试模式构建 ） |
 * | a2 | ✅必接 | 获取版本号（注意，小游戏平台需通过插件同步或手动修改来更新版本号，参见接口注释说明） |
 * | a3 | ✅必接 | 获取包名 |
 * | a4 | ✅必接 | 获取当前平台（g: Google Play / a: Apple App Store / t: TikTok Mini Games） |
 * | a5 | ✅必接 | 获取是否完整可投包（true: 完整可投包 / false: 白包） |
 * | n1 | ✅可投包必接 | 加载多语言（在首个场景的 onLoad 中调用） |
 * | n2 | *️⃣按需 | 获取当前语言代号（应用在多语言中） |
 * | n3 | *️⃣按需 | 添加多语言数据 |
 * | n4 | *️⃣按需 | 设置当前语言（应用在多语言中） |
 * | n5 | *️⃣按需 | 刷新所有多语言 UI （cc.Label/cc.RichText） |
 * | n6 | *️⃣按需 | 加密字符串（可用于简单加密或混淆源字符串） |
 * | n7 | *️⃣按需 | 解密字符串 |
 * | l1 | ✅必接 | 登录（成功才回调，可在此后调用 l2、l3 和 l4） |
 * | l2 | ✅必接 | 获取当前是否 B 面（白包始终为 false，小游戏平台始终为 true） |
 * | l3 | *️⃣按需 | 获取后台配置 launchInfoConfig（A/B 面都有效，登录成功后才可能有值，白包不接入登录文件为空） |
 * | l4 | *️⃣按需 | 获取后台所有配置（仅 B 面有效，登录成功后才可能有值，白包不接入登录文件为空） |
 * | c0 | *️⃣按需 | 获取邀请码 |
 * | t1 | *️⃣按需 | 添加兑换开关监听 |
 * | t2 | *️⃣按需 | 移除兑换开关监听 |
 * | d1 | *️⃣按需 | 获取是否跳过广告（可用于 GM 工具） |
 * | d2 | *️⃣按需 | 设置是否跳过广告（可用于 GM 工具） |
 * | b1 | *️⃣按需 | 显示横幅广告（预留接口，部分平台未实现） |
 * | b2 | *️⃣按需 | 隐藏横幅广告（预留接口，部分平台未实现） |
 * | s1 | *️⃣按需 | 开屏广告是否已填充（预留接口，部分平台未实现） |
 * | s2 | *️⃣按需 | 播放开屏广告（预留接口，部分平台未实现） |
 * | v0 | ✅有激励视频广告时必接 | 通知已显示激励视频广告按钮 |
 * | v1 | ✅有激励视频广告时必接 | 激励视频广告是否已填充 |
 * | v2 | ✅有激励视频广告时必接 | 播放激励视频广告（监听器参见 IAdListenerLike 的定义和注释，播放失败的默认行为参见接口注释） |
 * | i0 | ✅有插屏广告时必接 | 通知已显示插屏广告按钮 |
 * | i1 | ✅有插屏广告时必接 | 插屏广告是否已填充 |
 * | i2 | ✅有插屏广告时必接 | 播放插屏广告（监听器参见 IAdListenerLike 的定义和注释，播放失败的默认行为参见接口注释） |
 * | m0 | ✅小游戏平台有快捷入口任务时必接 | 获取快捷入口任务状态（异步） |
 * | m1 | ✅小游戏平台有快捷入口任务时必接 | 添加快捷入口 |
 * | m2 | ✅小游戏平台有快捷入口任务时必接 | 通知已发放快捷入口任务奖励 |
 * | e0 | ✅小游戏平台有再次访问任务时必接 | 获取再次访问任务状态（异步） |
 * | e1 | ✅小游戏平台有再次访问任务时必接 | 跳转到主页侧边栏引导回访 |
 * | e2 | ✅小游戏平台有再次访问任务时必接 | 通知已发放再次访问任务奖励 |
 * | w1 | ✅必接 | 播放背景音乐 |
 * | w2 | ✅必接 | 停止背景音乐 |
 * | w3 | ✅必接 | 播放点击音效 |
 * | v  | ✅必接（代替 jsb.device.vibrate） | 振动 |
 * | u  | ✅必接（代替 cc.sys.openURL） | 打开指定的 URL |
 * | r  | ✅原生必接 | 打开评星 |
 * | n  | *️⃣按需 | 获取 vpn 或代理类型（0: 未开启 VPN 或代理 / 1: 已开启 VPN / 2: 已开启代理） |
 * | p  | ✅必接 | 隐私协议 URL |
 * | g0 | ✅必接 | 是否有更多游戏 |
 * | g1 | ✅必接 | 获取一个更多游戏 URL |
 * | t  | ✅必接 | 上报事件（埋点） |
 *
 *
 * 🌏多语言
 * ========
 *
 * 1. 多语言数据结构参见 lanData
 * 2. key 字段：
 *     * 格式：<标识符字符串>_<三位数字 000...999>，例如：tkey_001
 *     * 可根据模块使用不同标识符区分 key 范围，例如游戏 gkey_xxx，框架 skey_xxx 等
 * 3. 多语言字段：
 *     * 如无特殊需求，一般包括：zh / zh_CN / en / es / fr / ja / de / ru / pt / in / vi / ar / th / ko / fil / ms / hi / tr
 *     * 必有字段 en，必须有英文文案
 *
 *
 * 📄登录文件
 * ========
 *
 * * 登录时会根据当前是否 Debug 版本动态修改后台地址，不再需要手动处理
 *     1. 原生平台：打包时选择 Debug 或 Release （iOS 无需处理）
 *     2. 小游戏平台：构建时勾选或者不勾“调试模式”
 *
 *
 * 🚩埋点
 * ========
 *
 * 1. 首次使用埋点请前往 AutopaintFlashize.ts （A/B 面埋点）以及中间文件的 addedCustomEventConfig 结构（仅 B 面埋点）配置自定义事件（游戏强相关埋点）
 * 2. 使用下表提供的预设事件名和第 1 点中配置的自定义事件名作为参数调用埋点接口 A.t(...)
 * 3. 调用示例：A.t('g1')，有额外参数请参照接口注释说明
 *
 * | 需手动上报的预设事件 | 上报场景 |
 * | :---: | :---: |
 * | g1 | 启动后显示游戏界面（进入加载页） |
 * | g2 | 加载完成进入游戏（进入游戏主页） |
 * | g3 | 开始游戏（新手引导未完成：完成后看到游戏页时上报 / 新手引导已完成：进入游戏页直接上报） |
 * | n1 | 开始新手引导 |
 * | n2 | 显示新手引导按钮 |
 * | n3 | 成功领取新手引导奖励 |
 * | n4 | 完成新手引导 |
 * | f1 | 显示框架内容 |
 * | f2 | 显示非免费奖励弹窗 |
 * | f3 | 点击非免费奖励领取按钮 |
 * | f4 | 成功领取非免费奖励 |
 * | f5 | 显示免费奖励弹窗 |
 * | f6 | 点击免费奖励领取按钮 |
 * | f7 | 成功领取免费奖励 |
 * | f8 | 达成兑换/收集门槛 |
 * | f9 | 成功提交兑换 |
 * | f10 | 完成兑换任务（自动计数，每完成一个任务传一次 f10 事件即可） |
 *
 *
 * ⚙️后台配置
 * ========
 *
 * * 仅支持 B 面配置 Basic-Config，结构如下：
 * {
 *     "GLOBAL_CONF": {
 *         "videoAdRetryDelay": 3,
 *         "enableInterstitalAd": true,
 *         "allowInterstitialAdFallback": true,
 *         "allowVideoAdFallback": true
 *     }
 * }
 *
 * | 字段名 | 描述 | 不配置时的默认值 |
 * | :---: | :---: | :---: |
 * | videoAdRetryDelay | 激励视频广告重试时长（秒） | 3 |
 * | enableInterstitalAd | 允许播放插屏广告 | true |
 * | allowInterstitialAdFallback | 允许激励视频广告失败转插屏广告（总控开关，此处打开后接口才能控制） | true |
 * | allowVideoAdFallback | 允许插屏广告失败转激励视频广告（总控开关，此处打开后接口才能控制） | true |
 */

import { TEventOverrideData } from "./a/PostdelayNonrun";
import { IAdListenerLike, IPlatformExternalHandlersLike, NextlyAnyoneize } from "./p/NextlyAnyoneize";
import { lanData, ICountryConfigLike } from "./i/BuildingUnhardware";

interface IAPILike {
    /**
     * 获取是否 Debug（测试服）版本（App 是否 Debug 版本）
     */
    readonly a1: boolean,

    /**
     * 获取版本号
     * 注意，小游戏平台更新版本号，需要通过插件同步，或手动修改 NextlyAnyoneize.ts 中 messageoryMacrocost getter 的返回值）
     */
    readonly a2: string,

    /**
     * 获取包名
     */
    readonly a3: string,

    /**
     * 获取当前平台（g: Google Play / a: Apple App Store / t: TikTok Mini Games）
     */
    readonly a4: 'g'|'a'|'t',

    /**
     * 获取是否完整可投包（true: 完整可投包 / false: 白包）
     */
    readonly a5: boolean,

    /**
     * 加载多语言（在首个场景的 onLoad 中调用）
     * @param i18nData 多语言数据
     * @param languageCode 当前语言代号（默认为本机语言 cc.sys.languageCode）
     * @param COUNTRY_LIST 国家配置表（默认为内置配置）
     */
    n1: (i18nData: lanData[], languageCode?: string, COUNTRY_LIST?: Array<ICountryConfigLike>) => void,

    /**
     * 获取当前语言代号（应用在多语言中）
     */
    readonly n2: string,

    /**
     * 添加多语言数据
     * @param i18nData 多语言数据
     */
    n3: (i18nData: lanData[]) => void,

    /**
     * 设置当前语言（应用在多语言中）
     * @param languageCode 当前语言代号
     */
    n4: (languageCode: string) => void,

    /**
     * 刷新所有多语言 UI （cc.Label/cc.RichText）
     */
    n5: () => void,

    /**
     * 加密字符串（可用于简单加密或混淆源字符串）
     * @param plaintext 明文字符串
     * @param secretKey 自定义密钥（默认使用内置密钥，不同游戏代号对应的内置密钥不同）
     */
    n6: (plaintext: string, secretKey?: string) => string,

    /**
     * 解密字符串
     * @param ciphertext 密文字符串
     * @param secretKey 自定义密钥（加密时使用的密钥，如果使用内置密钥加密则不需要传）
     */
    n7: (ciphertext: string, secretKey?: string) => string,

    /**
     * 登录（成功才回调）
     * @param callback 回调函数
     * @param externalHandlers 外部处理器函数集合（详见 IPlatformExternalHandlersLike 定义）
     */
    l1: (callback?: () => any, externalHandlers?: IPlatformExternalHandlersLike) => void,

    /**
     * 获取当前是否 B 面（白包始终为 false，小游戏平台始终为 true）
     */
    readonly l2: boolean,

    /**
     * 获取后台配置 launchInfoConfig（A/B 面都有效，登录成功后才可能有值，白包不接入登录文件为空）
     */
    readonly l3: Readonly<object> | undefined,

    /**
     * 获取后台所有配置（仅 B 面有效，登录成功后才可能有值，白包不接入登录文件为空）
     */
    readonly l4: Readonly<object> | undefined,

    /**
     * 获取邀请码
     */
    readonly c0: string,

    /**
     * 添加兑换开关监听
     * @param listener 监听器
     */
    t1: (listener: (isNewUser: boolean | undefined) => any) => void,

    /**
     * 移除兑换开关监听
     */
    t2: (listener: (isNewUser: boolean | undefined) => any) => boolean,

    /**
     * 获取是否跳过广告（可用于 GM 工具）
     */
    d1: () => boolean,

    /**
     * 设置是否跳过广告（可用于 GM 工具）
     */
    d2: (value: boolean) => void,

    /**
     * 显示横幅广告
     * @param anchor 锚点位置
     * @param margin 距离锚点的位置: 单位像素
     * @param listener 横幅广告监听器
     */
    b1: (anchor?: 'top' | 'bottom', margin?: number, listener?: IAdListenerLike) => void,

    /**
     * 隐藏横幅广告
     */
    b2: () => void,

    /**
     * 开屏广告是否已填充
     */
    readonly s1: boolean,

    /**
     * 播放开屏广告
     * @param listener 监听器
     */
    s2: (listener?: IAdListenerLike) => void,

    /**
     * 通知已显示激励视频广告按钮
     * @param tag 广告埋点标签（比如：reward_1/reward_2/revive/use_prop）
     */
    v0: (tag: string) => void,

    /**
     * 激励视频广告是否已填充
     */
    readonly v1: boolean,

    /**
     * 播放激励视频广告
     * @param tag 广告埋点标签（比如：reward_1/reward_2/revive/use_prop）
     * @param listener 监听器（参见 IAdListenerLike 的定义和注释）
     * @param allowInterstitialAdFallback 允许失败转插屏广告（默认为 true）
     */
    v2: (tag: string, listener?: IAdListenerLike, allowInterstitialAdFallback?: boolean) => void,

    /**
     * 通知已显示插屏广告按钮
     * @param tag 广告埋点标签（比如：reward_1/reward_2/start_level）
     */
    i0: (tag: string) => void,

    /**
     * 插屏广告是否已填充
     */
    readonly i1: boolean,

    

    /**
     * 播放插屏广告
     * @param tag 广告埋点标签（比如：reward_1/reward_2/start_level）
     * @param listener 监听器（参见 IAdListenerLike 的定义和注释）
     * @param allowVideoAdFallback 允许失败转激励视频广告（默认为 true）
     */
    i2: (tag: string, listener?: IAdListenerLike, allowVideoAdFallback?: boolean) => void,

    /**
     * 获取快捷入口任务状态（异步）（当前平台不支持）
     * @param callback 回调函数（-1: 未完成 / 0: 已完成可领奖 / 1: 已完成已领奖）
     */
    m0: (callback: (state: -1 | 0 | 1) => any) => void,

    /**
     * 添加快捷入口（当前平台不支持）
     * @param callback 回调函数
     */
    m1: (callback?: (success: boolean) => any) => void,

    /**
     * 通知已发放快捷入口任务奖励（当前平台不支持）
     */
    m2: () => void,

    /**
     * 获取再次访问任务状态（异步）（当前平台不支持）
     * @param callback 回调函数（-1: 未完成 / 0: 已完成可领奖 / 1: 已完成已领奖）
     */
    e0: (callback: (state: -1 | 0 | 1) => any) => void,

    /**
     * 跳转到主页侧边栏引导回访（当前平台不支持）
     * @param callback 回调函数
     */
    e1: (callback?: (success: boolean) => any) => void,

    /**
     * 通知已发放再次访问任务奖励（当前平台不支持）
     */
    e2: () => void,

    /**
     * 播放背景音乐
     * @param loop 是否循环播放
     * @param rawProcess 原始处理逻辑（游戏侧播放背景音乐的原始逻辑，白包会忽略并使用 SDK 播放音乐，可投包会调用以回归原始逻辑控制）
     */
    w1: (loop: boolean, rawProcess?: () => any) => void,

    /**
     * 停止背景音乐
     * @param rawProcess 原始处理逻辑（游戏侧停止背景音乐的原始逻辑，白包会忽略并使用 SDK 停止音乐，可投包会调用以回归原始逻辑控制）
     */
    w2: (rawProcess?: () => any) => void,

    /**
     * 播放点击音效
     * @param rawProcess 原始处理逻辑（游戏侧播放点击音效的原始逻辑，白包会忽略并使用 SDK 播放音效，可投包会调用以回归原始逻辑控制）
     */
    w3: (rawProcess?: () => any) => void,

    /**
     * 振动
     * @param durationInMilliseconds 振动时长（毫秒）
     */
    v: (durationInMilliseconds: number) => void,

    /**
     * 打开指定的 URL
     * @param url URL
     */
    u: (url: string) => void,

    /**
     * 打开评星
     */
    r: () => void,

    /**
     * 获取 vpn 或代理类型（0: 未开启 VPN 或代理 / 1: 已开启 VPN / 2: 已开启代理）
     */
    readonly n: 0 | 1 | 2,

    /**
     * 获取隐私协议 URL
     */
    readonly p: string,

    /**
     * 是否有更多游戏
     */
    readonly g0: boolean,

    /**
     * 获取一个更多游戏 URL
     */
    readonly g1: string,

    /**
     * 上报事件
     * @param eventName 事件名（使用 INTERTEST_MEGAENOUGH 中预设的值和 FAMILYIST_SIMPLEARY 中自定义配置的值）
     * @param params 需要覆盖或追加的事件数据
     * @example
     * ```ts
     * // 上报预设事件
     * A.t('n1');
     *
     * // 上报自定义事件（在 FAMILYIST_SIMPLEARY 中配置了 login 事件）
     * A.t('login');
     *
     * // 上报自定义事件并覆盖或追加事件数据（在 FAMILYIST_SIMPLEARY 中配置了 game_level 事件，但 object_notes 字段是动态的且未配置）
     * A.t('game_level', { C: { p: { object_notes: '1' } } });
     * ```
     */
    t: (eventName: string, params?: TEventOverrideData) => void,
};

const M: Record<string, string> = {
    a1: 'facedLookal',
    a2: 'messageoryMacrocost',
    a3: 'aboutingMainwise',
    a4: 'billlessSafely',
    a5: 'homeEmptyary',
    n1: 'cameraedRefeed',
    n2: 'everyisePostwash',
    n3: 'postprettyMegainstall',
    n4: 'photoizeBrokenism',
    n5: 'betterenTransalong',
    n6: 'undermoneyRefeel',
    n7: 'personfulBattlement',
    l1: 'posttodayOverwash',
    l2: 'formfulSuperfather',
    l3: 'feedistAmountal',
    l4: 'interworkBelowless',
    c0: 'ultraspringConsentary',
    t1: 'antimarkUndercandy',
    t2: 'readtionCopyism',
    d1: 'postfatherAspectory',
    d2: 'columnifyResult',
    b1: 'megacenterUnderbasic',
    b2: 'hyperwinterInputful',
    s1: 'rejectUnfit',
    s2: 'futureenExtraintend',
    v0: 'effectistRealory',
    v1: 'giveistWall',
    v2: 'cameraifyPerioden',
    i0: 'drivingAntifresh',
    i1: 'pushwardMaleal',
    i2: 'unlandAnimalory',
    m0: 'unconsiderBasewise',
    m1: 'effortfulChestize',
    m2: 'superscreenReplyless',
    e0: 'rangelessExactness',
    e1: 'secretorySingleness',
    e2: 'billalConsiderable',
    w1: 'childedLowerness',
    w2: 'anticrossFileify',
    w3: 'overlandMaskify',
    v: 'darkMicrolife',
    u: 'hypertrustIronive',
    r: 'minigradeMatchment',
    n: 'billfulReworld',
    p: 'sizeiseNonjump',
    g0: 'multiintoEffortship',
    g1: 'fitedInterspeed',
    t: 'runwardSizeify',
};

export const A: IAPILike = new Proxy(NextlyAnyoneize.instance, {
    get(t, k) {
        const key = typeof k === 'string' ? k : '';
        const real = M[key] ?? k;
        const v = t[real as keyof NextlyAnyoneize];
        return typeof v === 'function' ? v.bind(t) : v;
    },
}) as any;

// @ts-ignore
window['_A_'] = A;
