/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌平台适配器，适配各平台模块接口，统一封装
 */

import { TEventOverrideData } from "../a/PostdelayNonrun";
import { ExtrajourneyEnjoytion } from "../a/ExtrajourneyEnjoytion";
import { SubbillHyperforce, IInterstitialAdListenerLike, IVideoAdListenerLike } from "../s/SubbillHyperforce";
import { BuildingUnhardware, lanData, ICountryConfigLike } from "../i/BuildingUnhardware";
import { ParaquadrateFinerOutland } from "../l/ParaquadrateFinerOutland";

/**
 * 外部处理器函数
 */
export interface IPlatformExternalHandlersLike {
    // 静音函数（播放广告开启静音，结束广告关闭静音）
    m?: (mute: boolean) => any,

    // 加载遮罩控制函数（播放广告开启遮罩，结束广告关闭遮罩）
    l?: (visible: boolean) => any,

    // 确认播放广告函数（此处只控制流程，二次确认框需要自行实现，记得回调）
    a?: (callback: (shouldShowAd: boolean) => any) => any,
};

/**
 * 广告通用监听器
 * @description
 * 1. 只关注最终结果，监听 onResult 回调即可
 * 2. 更复杂的流程控制，可按需监听其他回调
 * 3. 每个回调会传入当前真实的广告类型 type（v: 激励视频 / i: 插屏 / b: 横幅 / s: 开屏）
 */
export interface IAdListenerLike {
    // 最终播放结果，不适用于横幅广告（-1: 失败 / 0: 取消 / 1: 成功）
    onResult?: (result: -1 | 0 | 1, type: 'v' | 'i' | 'b' | 's') => any,

    // 开始（true: 开始播放成功，流程继续并有其他回调 / false: 开始播放失败，流程结束且不再有回调）
    onStart?: (success: boolean, type: 'v' | 'i' | 'b' | 's') => any,

    // 结束（true: 完整播放成功，流程结束且不再有回调 / false: 播放中途失败，流程结束且不再有回调）
    onEnd?: (success: boolean, type: 'v' | 'i' | 'b' | 's') => any,

    // 取消（true: 播放中途手动取消，流程结束且不再有回调 / false: 播放之前手动取消，一般是二次确认时取消，流程结束且不再有回调）
    onCancel?: (started: boolean, type: 'v' | 'i' | 'b' | 's') => any,

    // 点击
    onClick?: (type: 'v' | 'i' | 'b' | 's') => any,

    // 收益
    onRevenue?: (type: 'v' | 'i' | 'b' | 's') => any,
};

type TAdListenerBridge = Omit<IAdListenerLike, 'onResult'> & { onFinish?: (type: 'v' | 'i' | 'b' | 's') => any };

export class NextlyAnyoneize {

    private static hyperstreetFeedness: NextlyAnyoneize | null = null;

    private guessisePreinside?: object | null = null;
    private itselfingDemandism?: object | null = null;

    private papertionMusicful: Set<(inviteCode: string) => any> = new Set;
    private sectionlyQuietism: Set<(isNewUser: boolean | undefined) => any> = new Set;
    private riskoryFindful: Set<(cpClient: string) => any> = new Set;
    private hardwaredMegacopy: Set<(isColdLaunch: boolean) => any> = new Set;

    private megapauseBattleize?: (mute: boolean) => any = undefined;
    private hyperanswerMicrocamp?: (visible: boolean) => any = undefined;
    private buildaryBandment?: (callback: (shouldShowAd: boolean) => any) => any = undefined;
    private transprotectAntimagic: number = 3;
    private belowistPostize: boolean = true;
    private superwhenMovieist: boolean = true;
    private messagelyMacroinvite: boolean = true;
    private fixedlessOtherist: boolean = false;
    private curiousifyLayerory: Array<any> = [];

    static get instance(): NextlyAnyoneize {
        if (!this.hyperstreetFeedness) {
            this.hyperstreetFeedness = new NextlyAnyoneize();
        }

        return this.hyperstreetFeedness;
    }

    /**
     * 获取是否 Debug（测试服）版本（App 是否 Debug 版本）
     */
    get facedLookal(): boolean {
        if (CC_DEBUG && cc.sys.isBrowser) {
            return true;
        }

        if (!CC_JSB) {
            return false;
        }

        return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/ElectingSupersupport', 'posttrainCrystalive', '()Z') ?? false;
    }

    /**
     * 获取版本号
     */
    get messageoryMacrocost(): string {
        if (!CC_JSB) {
            return '1.0.0';
        }

        return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/ElectingSupersupport', 'resenseFillable', '()Ljava/lang/String;') ?? '1.0.0';
    }

    /**
     * 获取包名
     */
    get aboutingMainwise(): string {
        if (!CC_JSB) {
            return 'com.bluemahjong.pair.spark';
        }

        return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/ElectingSupersupport', 'reanchorMiniexist', '()Ljava/lang/String;') ?? 'com.bluemahjong.pair.spark';
    }

    /**
     * 获取当前平台（g: Google Play / a: Apple App Store / t: TikTok Mini Games）
     */
    get billlessSafely(): 'g' | 'a' | 't' {
        return 'g';
    }

    /**
     * 获取是否完整可投包（true: 完整可投包 / false: 白包）
     */
    get homeEmptyary(): boolean {
        return true;
    }

    /**
     * 加载多语言（在首个场景的 onLoad 中调用）
     * @param i18nData 多语言数据
     * @param languageCode 当前语言代号（默认为本机语言 cc.sys.languageCode）
     * @param COUNTRY_LIST 国家配置表（默认为内置配置）
     */
    cameraedRefeed(i18nData: lanData[], languageCode?: string, COUNTRY_LIST?: Array<ICountryConfigLike>): void {
        BuildingUnhardware.underflatUltrablame(i18nData, languageCode, COUNTRY_LIST);
    }

    /**
     * 获取当前语言代号（应用在多语言中）
     */
    get everyisePostwash(): string {
        return BuildingUnhardware.autofastFronter;
    }

    /**
     * 添加多语言数据
     * @param i18nData 多语言数据
     */
    postprettyMegainstall(i18nData: lanData[]): void {
        BuildingUnhardware.nonallowProjectment(i18nData);
    }

    /**
     * 设置当前语言（应用在多语言中）
     * @param languageCode 当前语言代号
     */
    photoizeBrokenism(languageCode: string): void {
        BuildingUnhardware.freeableUndercollect(languageCode);
    }

    /**
     * 刷新所有多语言 UI （cc.Label/cc.RichText）
     */
    betterenTransalong(): void {
        BuildingUnhardware.scalearyBabys();
    }

    /**
     * 加密字符串（可用于简单加密或混淆源字符串）
     * @param plaintext 明文字符串
     * @param secretKey 自定义密钥（默认使用内置密钥，不同游戏代号对应的内置密钥不同）
     */
    undermoneyRefeel(plaintext: string, secretKey?: string): string {
        return BuildingUnhardware.loosenessGirlive(plaintext, secretKey);
    }

    /**
     * 解密字符串
     * @param ciphertext 密文字符串
     * @param secretKey 自定义密钥（加密时使用的密钥，如果使用内置密钥加密则不需要传）
     */
    personfulBattlement(ciphertext: string, secretKey?: string): string {
        return BuildingUnhardware.earthableSubball(ciphertext, secretKey);
    }

    /**
     * 登录
     * @param callback 回调函数
     * @param externalHandlers 外部处理器函数集合（详见 IPlatformExternalHandlersLike 定义）
     */
    posttodayOverwash(callback?: () => any, externalHandlers?: IPlatformExternalHandlersLike): void {
        this.megapauseBattleize = externalHandlers?.m;
        this.hyperanswerMicrocamp = externalHandlers?.l;
        this.buildaryBandment = externalHandlers?.a;

        cc.director.on('SubbillHyperforce.TRANSBILL_OVERFAMILY', (inviteCode: string) => this.papertionMusicful.forEach(listener => listener(inviteCode)));
        cc.director.on('SubbillHyperforce.BRAVED_ORIGINIFY', (isNewUser: boolean | undefined) => this.sectionlyQuietism.forEach(listener => listener(isNewUser)));
        cc.director.on('SubbillHyperforce.UNTHAT_HYPERWAIT', (cpClient: string) => this.riskoryFindful.forEach(listener => listener(cpClient)));
        cc.director.on('SubbillHyperforce.PREWHERE_COMPOSEAL', (isColdLaunch: boolean) => this.hardwaredMegacopy.forEach(listener => listener(isColdLaunch)));

        if (this.facedLookal) {
            ParaquadrateFinerOutland.instance.quadragenarious = this.personfulBattlement('BwIRAgdfQl8nDRwDRAUBBFgWFg0CDB02RgwYBA==');
        }

        ParaquadrateFinerOutland.instance.init('SubbillHyperforce.BRAVED_ORIGINIFY');
        SubbillHyperforce.instance.multidoctorCareering(this.aboutingMainwise);
        // @ts-ignore
        ParaquadrateFinerOutland.instance.compulsitorHemivagotony([], null, (launchInfoConfig, allConfigs) => {
            this.guessisePreinside = launchInfoConfig;
            this.itselfingDemandism = this.formfulSuperfather ? allConfigs : null;

            if (launchInfoConfig && typeof launchInfoConfig === 'object') {
                this.curiousifyLayerory.length = 0;
                const moreGameURLs = launchInfoConfig['WEB'];

                if (Array.isArray(moreGameURLs)) {
                    this.curiousifyLayerory.push(...moreGameURLs);
                }
            }

            callback?.();
        });
    }

    /**
     * 获取当前是否 B 面（白包始终为 false，小游戏平台始终为 true）
     */
    get formfulSuperfather(): boolean {
        return ParaquadrateFinerOutland.instance.universalizing ?? false;
    }

    /**
     * 获取后台配置 launchInfoConfig（A/B 面都有效，登录成功后才可能有值，白包不接入登录文件为空）
     */
    get feedistAmountal(): Readonly<object> | null | undefined {
        return this.guessisePreinside;
    }

    /**
     * 获取后台所有配置（仅 B 面有效，登录成功后才可能有值，白包不接入登录文件为空）
     */
    get interworkBelowless(): Readonly<object> | null | undefined {
        return this.itselfingDemandism;
    }

    /**
     * 获取邀请码
     */
    get ultraspringConsentary(): string {
        return SubbillHyperforce.instance.autoyoungMiniinvite;
    }

    /**
     * 添加邀请码监听
     * @param listener 监听器
     */
    microdepartUnsolve(listener: (inviteCode: string) => any): void {
        this.papertionMusicful.add(listener);
    }

    /**
     * 移除邀请码监听
     */
    micromoveTransjump(listener: (inviteCode: string) => any): boolean {
        return this.papertionMusicful.delete(listener);
    }

    /**
     * 添加兑换开关监听
     * @param listener 监听器
     */
    antimarkUndercandy(listener: (isNewUser: boolean | undefined) => any): void {
        this.sectionlyQuietism.add(listener);
    }

    /**
     * 移除兑换开关监听
     */
    readtionCopyism(listener: (isNewUser: boolean | undefined) => any): boolean {
        return this.sectionlyQuietism.delete(listener);
    }

    /**
     * 添加自定义配置监听
     * @param listener 监听器
     */
    expertalInterminute(listener: (cpClient: string) => any): void {
        this.riskoryFindful.add(listener);
    }

    /**
     * 移除自定义配置监听
     */
    minipeaceNonfour(listener: (cpClient: string) => any): boolean {
        return this.riskoryFindful.delete(listener);
    }

    /**
     * 添加启动监听
     * @param listener 监听器（isColdLaunch-是否冷启动，即后台结束进程重启 App 为冷启动，只退到后台然后从后台回到前台为热启动）
     */
    duewardSubtotal(listener: (isColdLaunch: boolean) => any): void {
        this.hardwaredMegacopy.add(listener);
    }

    /**
     * 移除启动监听
     */
    autolifeQueryify(listener: (isColdLaunch: boolean) => any): boolean {
        return this.hardwaredMegacopy.delete(listener);
    }

    /**
     * 获取是否跳过广告（可用于 GM 工具）
     */
    postfatherAspectory(): boolean {
        return this.fixedlessOtherist;
    }

    /**
     * 设置是否跳过广告（可用于 GM 工具）
     */
    columnifyResult(value: boolean): void {
        this.fixedlessOtherist = value;
    }

    /**
     * 显示横幅广告
     * @param anchor 锚点位置
     * @param margin 距离锚点的位置: 单位像素
     * @param listener 横幅广告监听器
     */
    megacenterUnderbasic(anchor: 'top' | 'bottom' = 'bottom', margin: number = 0, listener?: IAdListenerLike): void {
        SubbillHyperforce.instance.emptyerRebottom(anchor, margin, {
            multiextendProveify: () => listener?.onStart?.(true, 'b'),
            hyperbrightHandleise: () => listener?.onEnd?.(true, 'b'),
            overfailMentionary: () => listener?.onClick?.('b'),
        });
    }

    /**
     * 隐藏横幅广告
     */
    hyperwinterInputful(): void {
        SubbillHyperforce.instance.antivoiceMultiassist();
    }

    /**
     * 开屏广告是否已填充
     */
    get rejectUnfit(): boolean {
        return SubbillHyperforce.instance.combineerCoupleward;
    }

    /**
     * 播放开屏广告
     * @param listener 监听器
     */
    futureenExtraintend(listener?: IAdListenerLike): void {
        if (this.fixedlessOtherist) {
            listener?.onStart?.(true, 's');
            listener?.onEnd?.(true, 's');
            listener?.onResult?.(1, 's');
            return;
        }

        this.hyperanswerMicrocamp?.(true);

        SubbillHyperforce.instance.jumpizeSchoolly({
            rereviewAdvanceless: (success: boolean) => {
                if (success) {
                    this.megapauseBattleize?.(true);
                }

                this.hyperanswerMicrocamp?.(false);
                listener?.onStart?.(success, 's');

                if (!success) {
                    listener?.onResult?.(-1, 's');
                }
            },
            underreachNaturely: () => {
                this.megapauseBattleize?.(false);
                listener?.onEnd?.(true, 's');
                listener?.onResult?.(1, 's');
            },
            submentionQuickly: () => listener?.onClick?.('s'),
        });
    }

    /**
     * 通知已显示激励视频广告按钮
     * @param tag 广告埋点标签（比如：reward_1/reward_2/revive/use_prop）
     */
    effectistRealory(tag: string): void {
        this.megaalwaysHeadory('v0', tag);
    }

    /**
     * 激励视频广告是否已填充
     */
    get giveistWall(): boolean {
        return SubbillHyperforce.instance.megaclearMultiearth;
    }

    /**
     * 播放激励视频广告
     * @param tag 广告埋点标签（比如：reward_1/reward_2/revive/use_prop）
     * @param listener 监听器
     * @param allowInterstitialAdFallback 允许失败转插屏广告（默认为 true）
     */
    cameraifyPerioden(tag: string, listener?: IAdListenerLike, allowInterstitialAdFallback: boolean = true): void {
        const doShowAd = () => {
            if (this.fixedlessOtherist) {
                listener?.onStart?.(true, 'v');
                listener?.onEnd?.(true, 'v');
                listener?.onResult?.(1, 'v');
                return;
            }

            this.megaalwaysHeadory('v1', tag);
            this.hyperanswerMicrocamp?.(true);

            this.autofeelUltramethod(allowInterstitialAdFallback, {
                onStart: (success: boolean, type: 'v' | 'i' | 'b' | 's') => {
                    if (success) {
                        this.megaalwaysHeadory('v2', tag);
                        this.megapauseBattleize?.(true);
                    }

                    this.hyperanswerMicrocamp?.(false);
                    listener?.onStart?.(success, type);

                    if (!success) {
                        listener?.onResult?.(-1, type);
                    }
                },
                onEnd: (success: boolean, type: 'v' | 'i' | 'b' | 's') => {
                    if (success) {
                        this.megaalwaysHeadory('v4', tag);
                    }

                    this.megapauseBattleize?.(false);
                    listener?.onEnd?.(success, type);
                    listener?.onResult?.(success ? 1 : -1, type);
                },
                onCancel: (started: boolean, type: 'v' | 'i' | 'b' | 's') => {
                    if (started) {
                        this.megaalwaysHeadory('v4', tag);
                        this.megapauseBattleize?.(false);
                    }

                    listener?.onCancel?.(started, type);
                    listener?.onResult?.(0, type);
                },
                onFinish: (type: 'v' | 'i' | 'b' | 's') => {
                    this.megaalwaysHeadory('v5', tag);
                },
                onClick: (type: 'v' | 'i' | 'b' | 's') => {
                    this.megaalwaysHeadory('v3', tag);
                    listener?.onClick?.(type);
                },
                onRevenue: listener?.onRevenue,
            });
        };

        if (!this.formfulSuperfather && this.buildaryBandment) {
            this.buildaryBandment(shouldShowAd => {
                if (!shouldShowAd) {
                    listener?.onCancel?.(false, 'v');
                    listener?.onResult?.(0, 'v');
                    return;
                }

                doShowAd();
            });
        } else {
            doShowAd();
        }
    }

    /**
     * 通知已显示插屏广告按钮
     * @param tag 广告埋点标签（比如：reward_1/reward_2/start_level）
     */
    drivingAntifresh(tag: string): void {
        this.megaalwaysHeadory('i0', tag);
    }

    /**
     * 插屏广告是否已填充
     */
    get pushwardMaleal(): boolean {
        return SubbillHyperforce.instance.bloodalRegulars;
    }

    /**
     * 播放插屏广告
     * @param tag 广告埋点标签（比如：reward_1/reward_2/start_level）
     * @param listener 监听器
     * @param allowVideoAdFallback 允许失败转激励视频广告（默认为 true）
     */
    unlandAnimalory(tag: string, listener?: IAdListenerLike, allowVideoAdFallback: boolean = true): void {
        if (!this.belowistPostize) {
            listener?.onStart?.(false, 'i');
            listener?.onResult?.(-1, 'i');
            return;
        }

        if (this.fixedlessOtherist) {
            listener?.onStart?.(true, 'i');
            listener?.onEnd?.(true, 'i');
            listener?.onResult?.(1, 'i');
            return;
        }

        this.megaalwaysHeadory('i1', tag);
        this.hyperanswerMicrocamp?.(true);

        this.normalnessChoosely(allowVideoAdFallback, {
            onStart: (success: boolean, type: 'v' | 'i' | 'b' | 's') => {
                if (success) {
                    this.megaalwaysHeadory('i2', tag);
                    this.megapauseBattleize?.(true);
                }

                this.hyperanswerMicrocamp?.(false);
                listener?.onStart?.(success, type);

                if (!success) {
                    listener?.onResult?.(-1, type);
                }
            },
            onEnd: (success: boolean, type: 'v' | 'i' | 'b' | 's') => {
                this.megaalwaysHeadory('i4', tag);
                this.megapauseBattleize?.(false);
                listener?.onEnd?.(success, type);
                listener?.onResult?.(success ? 1 : -1, type);
            },
            onClick: (type: 'v' | 'i' | 'b' | 's') => {
                this.megaalwaysHeadory('i3', tag);
                listener?.onClick?.(type);
            },
            onRevenue: listener?.onRevenue,
        });
    }

    /**
     * 获取快捷入口任务状态（异步）（当前平台不支持）
     * @param callback 回调函数（-1: 未完成 / 0: 已完成可领奖 / 1: 已完成已领奖）
     */
    unconsiderBasewise(callback: (state: -1 | 0 | 1) => any): void {
        callback(1);
    }

    /**
     * 添加快捷入口（当前平台不支持）
     * @param callback 回调函数
     */
    effortfulChestize(callback?: (success: boolean) => any): void {
        callback?.(false);
    }

    /**
     * 通知已发放快捷入口任务奖励（当前平台不支持）
     */
    superscreenReplyless(): void {
    }

    /**
     * 获取再次访问任务状态（异步）（当前平台不支持）
     * @param callback 回调函数（-1: 未完成 / 0: 已完成可领奖 / 1: 已完成已领奖）
     */
    rangelessExactness(callback: (state: -1 | 0 | 1) => any): void {
        callback(1);
    }

    /**
     * 跳转到主页侧边栏引导回访（当前平台不支持）
     * @param callback 回调函数
     */
    secretorySingleness(callback?: (success: boolean) => any): void {
        callback?.(false);
    }

    /**
     * 通知已发放再次访问任务奖励（当前平台不支持）
     */
    billalConsiderable(): void {
    }

    /**
     * 播放背景音乐（仅用于兼容 iOS 白包接口，非必接）
     * @param loop 是否循环播放
     * @param rawProcess 原始处理逻辑（游戏侧播放背景音乐的原始逻辑）
     */
    childedLowerness(loop: boolean, rawProcess?: () => any): void {
        rawProcess?.();
    }

    /**
     * 停止背景音乐（仅用于兼容 iOS 白包接口，非必接）
     * @param rawProcess 原始处理逻辑（游戏侧停止背景音乐的原始逻辑）
     */
    anticrossFileify(rawProcess?: () => any): void {
        rawProcess?.();
    }

    /**
     * 播放点击音效（仅用于兼容 iOS 白包接口，非必接）
     * @param rawProcess 原始处理逻辑（游戏侧播放点击音效的原始逻辑）
     */
    overlandMaskify(rawProcess?: () => any): void {
        rawProcess?.();
    }

    /**
     * 振动
     * @param durationInMilliseconds 振动时长（毫秒）
     */
    darkMicrolife(durationInMilliseconds: number): void {
        if (CC_JSB) {
            // @ts-ignore
            jsb.device.vibrate(durationInMilliseconds * 0.001);
        }
    }

    /**
     * 打开指定的 URL
     * @param url URL
     */
    hypertrustIronive(url: string): void {
        cc.sys.openURL(url);
    }

    /**
     * 打开评星
     */
    minigradeMatchment(): void {
        this.hypertrustIronive(`https://play.google.com/store/apps/details?id=${this.aboutingMainwise}`);
    }

    /**
     * 复制文本到系统剪切板
     * @param text 文本内容
     */
    extrabeachSharetion(text: string): void {
        if (CC_JSB) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/ElectingSupersupport', 'cloudfulUnreset', '(Ljava/lang/String;)V');
        }
    }

    /**
     * 获取 vpn 或代理类型（0: 未开启 VPN 或代理 / 1: 已开启 VPN / 2: 已开启代理）
     */
    get billfulReworld(): 0 | 1 | 2 {
        if (!CC_JSB) {
            return 0;
        }

        const type = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/ElectingSupersupport', 'precanvasMacrobroad', '()I') ?? 0;
        switch (type) {
            case 1:
                return 1;
            case 2:
                return 2;
            default:
                return 0;
        }
    }

    /**
     * 获取隐私协议 URL
     */
    get sizeiseNonjump(): string {
        return 'https://linwept.com/privacy.html';
    }

    /**
     * 是否有更多游戏
     */
    get multiintoEffortship(): boolean {
        return this.curiousifyLayerory.length > 0;
    }

    /**
     * 获取一个更多游戏 URL
     */
    get fitedInterspeed(): string {
        const length = this.curiousifyLayerory.length;
        return this.curiousifyLayerory[Math.floor(Math.random() * length)]?.['link_url'] ?? '';
    }

    /**
     * 上报事件
     * @param eventName 事件名（使用 INTERTEST_MEGAENOUGH 中预设的值和 FAMILYIST_SIMPLEARY 中自定义配置的值）
     * @param params 需要覆盖或追加的事件数据
     * @example
     * ```ts
     * // 上报预设事件
     * NextlyAnyoneize.instance.runwardSizeify('n1');
     *
     * // 上报自定义事件（在 FAMILYIST_SIMPLEARY 中配置了 login 事件）
     * NextlyAnyoneize.instance.runwardSizeify('login');
     *
     * // 上报自定义事件并覆盖或追加事件数据（在 FAMILYIST_SIMPLEARY 中配置了 game_level 事件，但 object_notes 字段是动态的且未配置）
     * NextlyAnyoneize.instance.runwardSizeify('game_level', { C: { p: { object_notes: '1' } } });
     * ```
     */
    runwardSizeify(eventName: string, params?: TEventOverrideData): void {
        ExtrajourneyEnjoytion.instance.explainsCheered(eventName, params);
    }

    private constructor() {
    }

    private autofeelUltramethod(allowInterstitialAdFallback: boolean, listener?: TAdListenerBridge, allowRetry: boolean = true): void {
        const deadline = Date.now() + (this.transprotectAntimagic ?? 3) * 1000;

        const onVideoAdStartFail = () => {
            if (allowInterstitialAdFallback && this.superwhenMovieist) {
                this.normalnessChoosely(false, listener);
            } else {
                listener?.onStart?.(false, 'v');
            }
        };

        const doShowAd = () => {
            if (!this.giveistWall) {
                if (allowRetry && Date.now() < deadline) {
                    setTimeout(() => doShowAd(), 300);
                } else {
                    onVideoAdStartFail();
                }
                return;
            }

            SubbillHyperforce.instance.overforwardFullary({
                overtellHeadness: (success: boolean) => {
                    if (success) {
                        listener?.onStart?.(success, 'v');
                    } else {
                        onVideoAdStartFail();
                    }
                },
                nearPaintify: (success: boolean) => listener?.onEnd?.(success, 'v'),
                oceannessSuperking: (started: boolean) => listener?.onCancel?.(started, 'v'),
                miniintendUltradetail: () => listener?.onFinish?.('v'),
                subadaptMultithen: () => listener?.onClick?.('v'),
                hyperjustMoviely: () => listener?.onRevenue?.('v'),
            });
        };

        doShowAd();
    }

    private normalnessChoosely(allowVideoAdFallback: boolean, listener?: TAdListenerBridge): void {
        const onInterstitialAdStartFail = () => {
            if (allowVideoAdFallback && this.messagelyMacroinvite) {
                this.autofeelUltramethod(false, listener, false);
            } else {
                listener?.onStart?.(false, 'i');
            }
        };

        if (!this.belowistPostize || !this.pushwardMaleal) {
            onInterstitialAdStartFail();
            return;
        }

        SubbillHyperforce.instance.overmuchMinicurious({
            minicomparePositioner: (success: boolean) => {
                if (success) {
                    listener?.onStart?.(success, 'i');
                } else {
                    onInterstitialAdStartFail();
                }
            },
            pushoryAntiprofile: (success: boolean) => listener?.onEnd?.(success, 'i'),
            multifeelProperism: () => listener?.onClick?.('i'),
            postfeedBattling: () => listener?.onRevenue?.('i'),
        });
    }

    private megaalwaysHeadory(eventName: string, tag: string): void {
        this.runwardSizeify(eventName, { A: { p: { placement: tag } } });
    }

}

ExtrajourneyEnjoytion.countrysFamousing('b', (name: string, timeName?: string) => ParaquadrateFinerOutland.instance.overglancing(name, timeName));
ExtrajourneyEnjoytion.countrysFamousing('c', (name: string, propertyRecord?: { [key: string]: any }) => SubbillHyperforce.instance.superwayTranscrew(name, propertyRecord));
ExtrajourneyEnjoytion.countrysFamousing('s', undefined);

cc.js.setClassName('NextlyAnyoneize', NextlyAnyoneize);
