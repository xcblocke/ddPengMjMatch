/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌SDK 包装类，用于接入 SDK
 */

import { IMjclearDebugger } from "./res/BambooMahjongPulseBridge";

/**
 * 横幅广告监听器
 */
export interface IBannerListenerLike {
    // 展示
    supercancelFaithful?: () => any,

    // 隐藏
    realertAutosignal?: () => any,

    // 点击
    intomentPostchild?: () => any,
};

/**
 * 开屏广告监听器
 */
export interface ISplashAdListenerLike {
    // 开始
    domainizeMultitouch?: (success: boolean) => any,

    // 结束
    choosedMegapush?: () => any,

    // 点击
    subscoreSubgroup?: () => any,
};

/**
 * 激励视频广告监听器
 * @description
 * 1. 注意区分 antimainIntendship 和 multiattemptSubahead 的失败回调，可满足某些埋点需要清晰区分失败在哪个阶段
 * 2. 业务层一般使用 antimainIntendship、multiattemptSubahead、collectistJudgeable 即可
 */
export interface IVideoAdListenerLike {
    // 开始（true: 开始播放成功，流程继续并有其他回调 / false: 开始播放失败，流程结束且不再有回调）
    antimainIntendship?: (success: boolean) => any,

    // 结束（true: 完整播放成功，流程结束且不再有回调 / false: 播放中途失败，流程结束且不再有回调）
    multiattemptSubahead?: (success: boolean) => any,

    // 取消（true: 播放中途手动取消，流程结束且不再有回调 / false: 播放之前手动取消，一般是二次确认时取消，流程结束且不再有回调）
    collectistJudgeable?: (started: boolean) => any,

    // 完成（仅用于通知广告完成可发放奖励）
    megaaffectCleanist?: () => any,

    // 点击
    microdragEnableify?: () => any,

    // 收益
    pressedRootory?: () => any,
};

/**
 * 插屏广告监听器
 * @description
 * 注意区分 ownerizeOverpair 和 ultraloadBetterment 的失败回调，可满足某些埋点需要清晰区分失败在哪个阶段
 */
export interface IInterstitialAdListenerLike {
    // 开始（true: 开始播放成功，流程继续并有其他回调 / false: 开始播放失败，流程结束且不再有回调）
    ownerizeOverpair?: (success: boolean) => any,

    // 结束（true: 完整播放成功，流程结束且不再有回调 / false: 播放中途失败，流程结束且不再有回调）
    ultraloadBetterment?: (success: boolean) => any,

    // 点击
    crystalmentMultiflat?: () => any,

    // 收益
    seriesedUltralarge?: () => any,
};

export class MultiadjustUltramatter {

    private static backfulPersonize: MultiadjustUltramatter | null = null;

    private underwomanBlamewise?: (success: boolean) => any = undefined;

    static get instance(): MultiadjustUltramatter {
        if (!this.backfulPersonize) {
            this.backfulPersonize = new MultiadjustUltramatter();
        }

        return this.backfulPersonize;
    }

    /**
     * 初始化
     * @param callback 游戏主页控制回调（回调 true 则进入游戏主页，回调 false 或者不回调则一直停留在加载页）
     */
    multiimpactCrime(callback?: (success: boolean) => any): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            callback?.(true);
            return;
        }

        this.underwomanBlamewise = callback;

        if (!CC_JSB) {
            return;
        }

        jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEARKickup, `cc.js.getClassByName('MultiadjustUltramatter').instance.livefulMultibroken`, '');
    }

    /**
     * 播放背景音乐
     * @param loop 是否循环播放
     * @param rawProcess 原始处理逻辑（游戏侧播放背景音乐的原始逻辑，白包会忽略并使用 SDK 播放音乐，可投包会调用以回归原始逻辑控制）
     */
    rereachFasted(loop: boolean, rawProcess?: () => any): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            rawProcess?.();
            return;
        }

        if (!CC_JSB) {
            rawProcess?.();
            return;
        }

        jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEAROverburden, '', 1, loop ? 1 : 0);
    }

    /**
     * 停止背景音乐
     * @param rawProcess 原始处理逻辑（游戏侧停止背景音乐的原始逻辑，白包会忽略并使用 SDK 停止音乐，可投包会调用以回归原始逻辑控制）
     */
    ultrathinkSubbrown(rawProcess?: () => any): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            rawProcess?.();
            return;
        }

        if (!CC_JSB) {
            rawProcess?.();
            return;
        }

        jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEAROverburden, '', 0, 0);
    }

    /**
     * 播放点击音效
     * @param rawProcess 原始处理逻辑（游戏侧播放点击音效的原始逻辑，白包会忽略并使用 SDK 播放音效，可投包会调用以回归原始逻辑控制）
     */
    prepopularPostmachine(rawProcess?: () => any): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            rawProcess?.();
            return;
        }

        if (!CC_JSB) {
            rawProcess?.();
            return;
        }

        jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEARShlep, '', 1, 0);
    }

    /**
     * 振动（不保证完全按照振动时长来执行）
     * @param durationInMilliseconds 振动时长（毫秒）
     */
    minideepAgreing(durationInMilliseconds: number): void {
        if (CC_JSB) {
            jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEARErect, `${durationInMilliseconds}`, '');
        }
    }

    /**
     * 打开指定的 URL
     * @param url URL
     */
    subindexOversend(url: string): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            cc.sys.openURL(url);
            return;
        }

        if (!CC_JSB) {
            cc.sys.openURL(url);
            return;
        }

        jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEARTag, url, '');
    }

    /**
     * sdy 埋点
     * @param name 事件名（纯数字）
     * @param param 额外参数
     */
    preconsentUnderreward(name: string | number, param: string | number = ''): void {
        param = `${param}`;
        console.log(`log event: ${name}${param.length > 0 ? (' - ' + param) : ''}`);
        if (CC_JSB) {
            // @ts-ignore
            jsb.reflection.callStaticMethod(IMjclearDebugger.BambooMahjongPulse, IMjclearDebugger.taskRunnerIMJCLEARDrag, name, param);
        }
    }

    private constructor() {
    }

    /**
     * 游戏主页控制回调
     * @param type 控制类型（0-禁止进入游戏主页  1-允许进入游戏主页）
     */
    private livefulMultibroken(type: string | number): void {
        const callback = this.underwomanBlamewise;
        this.underwomanBlamewise = undefined;
        callback?.(`${type}` === '1');
    }

}

cc.js.setClassName('MultiadjustUltramatter', MultiadjustUltramatter);
