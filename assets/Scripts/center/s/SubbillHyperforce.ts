/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌SDK 包装类，用于接入 SDK
 */

import { ABJCUHDNRYIUEHTY } from "./res/ABJCUHDNRYIUEHTY";
import { KQXVTR } from "./res/WLHOXV/CFADZEMOSF";
import { TFAKQV } from "./res/WLHOXV/DHXVGZ";
import { LZOBXGFV } from "./res/WLHOXV/HIQKRWUDWPTWRCTP";
import { DZAVKRLJX } from "./res/WLHOXV/IGMAQGKUE";
import { TGGOQXX } from "./res/WLHOXV/MXTJMJNIZS";
import { JSHKSGNZCJVKYP } from "./res/WLHOXV/NFBLZE";
import { PKQEEMPEWUHK } from "./res/WLHOXV/UKEDQR";
import { CXADIVYSYQD } from "./res/WLHOXV/XSRXPN";

/**
 * 横幅广告监听器
 */
export interface IBannerListenerLike {
    // 展示
    multiextendProveify?: () => any,

    // 隐藏
    hyperbrightHandleise?: () => any,

    // 点击
    overfailMentionary?: () => any,
};

/**
 * 开屏广告监听器
 */
export interface ISplashAdListenerLike {
    // 开始
    rereviewAdvanceless?: (success: boolean) => any,

    // 结束
    underreachNaturely?: () => any,

    // 点击
    submentionQuickly?: () => any,
};

/**
 * 激励视频广告监听器
 * @description
 * 1. 注意区分 overtellHeadness 和 nearPaintify 的失败回调，可满足某些埋点需要清晰区分失败在哪个阶段
 * 2. 业务层一般使用 overtellHeadness、nearPaintify、oceannessSuperking 即可
 */
export interface IVideoAdListenerLike {
    // 开始（true: 开始播放成功，流程继续并有其他回调 / false: 开始播放失败，流程结束且不再有回调）
    overtellHeadness?: (success: boolean) => any,

    // 结束（true: 完整播放成功，流程结束且不再有回调 / false: 播放中途失败，流程结束且不再有回调）
    nearPaintify?: (success: boolean) => any,

    // 取消（true: 播放中途手动取消，流程结束且不再有回调 / false: 播放之前手动取消，一般是二次确认时取消，流程结束且不再有回调）
    oceannessSuperking?: (started: boolean) => any,

    // 完成（仅用于通知广告完成可发放奖励）
    miniintendUltradetail?: () => any,

    // 点击
    subadaptMultithen?: () => any,

    // 收益
    hyperjustMoviely?: () => any,
};

/**
 * 插屏广告监听器
 * @description
 * 注意区分 minicomparePositioner 和 pushoryAntiprofile 的失败回调，可满足某些埋点需要清晰区分失败在哪个阶段
 */
export interface IInterstitialAdListenerLike {
    // 开始（true: 开始播放成功，流程继续并有其他回调 / false: 开始播放失败，流程结束且不再有回调）
    minicomparePositioner?: (success: boolean) => any,

    // 结束（true: 完整播放成功，流程结束且不再有回调 / false: 播放中途失败，流程结束且不再有回调）
    pushoryAntiprofile?: (success: boolean) => any,

    // 点击
    multifeelProperism?: () => any,

    // 收益
    postfeedBattling?: () => any,
};

export class SubbillHyperforce {

    private static playiveReplyable: SubbillHyperforce | null = null;

    private multilistAutothird: ExplainizeOptionist = new ExplainizeOptionist();
    private anticornerCandyward: PullnessNonmove = new PullnessNonmove();
    private majorfulAnticrowd: InvitefulInterfail = new InvitefulInterfail();
    private coloristMicrosite: SubfeedInterradio = new SubfeedInterradio();
    private supernameMacrotest: PolicysHypersecure = new PolicysHypersecure();
    private superfeelSubassume: PreventlyMicroletter = new PreventlyMicroletter();
    private macrograntRealment: MultimarkDetailship = new MultimarkDetailship();
    private lessonifyDragory: HypergatePreknow = new HypergatePreknow();

    static get instance(): SubbillHyperforce {
        if (!this.playiveReplyable) {
            this.playiveReplyable = new SubbillHyperforce();
        }

        return this.playiveReplyable;
    }

    /**
     * 初始化
     * @param packageName 包名
     */
    multidoctorCareering(packageName: string): void {
        const sdkInstance = ABJCUHDNRYIUEHTY.OTKPRUM();

        // 设置监听
        sdkInstance.QIZRKRUOQY().HTJGJHP(this.multilistAutothird);
        sdkInstance.LOXKZMS().QFTBNJ(this.anticornerCandyward);
        sdkInstance.YAOLFR().ANRVFUXTLL(this.majorfulAnticrowd);
        sdkInstance.LWYONFHPJYNECVHN().JXVKMEPVGCBVK(this.coloristMicrosite);
        sdkInstance.PBWOHAPKNTUKWG().OIWXAWIZI(this.supernameMacrotest);
        sdkInstance.UTPKRWEZLFHMYSR().YZYXAKSDWXOLJ(this.superfeelSubassume);
        sdkInstance.RLLYQCGBRCK().CZOFLOMIINJO(this.macrograntRealment);
        sdkInstance.JFMLAZGGJGIWRP().PFHARDSYU(this.lessonifyDragory);

        // SDK初始化
        sdkInstance.APLGVLNQXUOGIXLE(packageName);
    }

    /**
     * 获取邀请码
     */
    get autoyoungMiniinvite(): string {
        return this.multilistAutothird.autoyoungMiniinvite;
    }

    /**
     * 获取兑换开关
     * 注意：此值仅提供给登录文件使用，切勿用于判断 A/B 面
     */
    get postniceBlankward(): boolean | undefined {
        return this.anticornerCandyward.postniceBlankward;
    }

    set postniceBlankward(value: boolean | undefined) {
        this.anticornerCandyward.postniceBlankward = value;
    }

    /**
     * 获取自定义配置
     */
    get unplanShiftive(): string {
        return this.majorfulAnticrowd.unplanShiftive;
    }

    /**
     * 显示横幅广告
     * @param anchor 锚点位置
     * @param margin 距离锚点的位置: 单位像素
     * @param listener 横幅广告监听器
     */
    emptyerRebottom(anchor: 'top' | 'bottom' = 'bottom', margin: number = 0, listener?: IBannerListenerLike): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            return;
        }

        this.supernameMacrotest.emptyerRebottom(anchor, margin, listener);
    }

    /**
     * 隐藏横幅广告
     */
    antivoiceMultiassist(): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            return;
        }

        this.supernameMacrotest.antivoiceMultiassist();
    }

    /**
     * 播放开屏广告
     * @param listener 监听器
     */
    jumpizeSchoolly(listener?: ISplashAdListenerLike): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            listener?.rereviewAdvanceless?.(true);
            listener?.underreachNaturely?.();
            return;
        }

        this.superfeelSubassume.jumpizeSchoolly(listener);
    }

    /**
     * 开屏广告是否已填充
     */
    get combineerCoupleward(): boolean {
        if (CC_DEBUG && cc.sys.isBrowser) {
            return true;
        }

        return this.superfeelSubassume.combineerCoupleward;
    }

    /**
     * 播放激励视频广告
     * @param listener 监听器
     */
    overforwardFullary(listener?: IVideoAdListenerLike): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            listener?.overtellHeadness?.(true);
            listener?.nearPaintify?.(true);
            return;
        }

        this.macrograntRealment.overforwardFullary(listener);
    }

    /**
     * 激励视频广告是否已填充
     */
    get megaclearMultiearth(): boolean {
        if (CC_DEBUG && cc.sys.isBrowser) {
            return true;
        }

        return this.macrograntRealment.megaclearMultiearth;
    }

    /**
     * 播放插屏广告
     * @param listener 监听器
     */
    overmuchMinicurious(listener?: IInterstitialAdListenerLike): void {
        if (CC_DEBUG && cc.sys.isBrowser) {
            listener?.minicomparePositioner?.(true);
            listener?.pushoryAntiprofile?.(true);
            return;
        }

        this.lessonifyDragory.overmuchMinicurious(listener);
    }

    /**
     * 插屏广告是否已填充
     */
    get underformatSuperquery(): boolean {
        if (CC_DEBUG && cc.sys.isBrowser) {
            return true;
        }

        return this.lessonifyDragory.underformatSuperquery;
    }

    /**
     * 通用埋点
     * @param name 事件名
     * @param propertyRecord 埋点数据
     */
    superwayTranscrew(name: string, propertyRecord?: { [key: string]: any }): void {
        console.log(`log event: ${name}${propertyRecord ? (' - ' + JSON.stringify(propertyRecord)) : ''}`);
        ABJCUHDNRYIUEHTY.OTKPRUM().VIBXPK().FFHOPNVPCKQKDY(name, propertyRecord);
    }

    private constructor() {
    }

}

class ExplainizeOptionist implements TGGOQXX {

    private autodialogNontell: string = '';

    get autoyoungMiniinvite(): string {
        return this.autodialogNontell;
    }

    // 邀请码回调
    OHJYRTEFQ(inviteCode: string) {
        this.autodialogNontell = inviteCode;
        cc.director.emit('SubbillHyperforce.TRANSBILL_OVERFAMILY', this.autodialogNontell);
    }

}

class PullnessNonmove implements TFAKQV {

    private afterizeInteredge?: boolean = undefined;

    get postniceBlankward(): boolean | undefined {
        return this.afterizeInteredge;
    }

    set postniceBlankward(value: boolean | undefined) {
        this.afterizeInteredge = value;
    }

    // 兑换开关回调
    BEYPQAXUZUQC(isNewUser: boolean) {
        this.afterizeInteredge = isNewUser;
        cc.director.emit('SubbillHyperforce.BRAVED_ORIGINIFY', this.afterizeInteredge);
    }

}

class InvitefulInterfail implements JSHKSGNZCJVKYP {

    private unlistTransproduce: string = '';

    get unplanShiftive(): string {
        return this.unlistTransproduce;
    }

    BZYZOOIUIKVLDDY(cpClient: string) {
        this.unlistTransproduce = cpClient;
        cc.director.emit('SubbillHyperforce.UNTHAT_HYPERWAIT', this.unlistTransproduce);
    }

}

class SubfeedInterradio implements LZOBXGFV {

    XOKKTVZKZXJC(launchFlag: number) {
        // launchFlag 1: 冷启动 0: 热启动
        cc.director.emit('SubbillHyperforce.PREWHERE_COMPOSEAL', launchFlag === 1);
    }

}

class PolicysHypersecure implements KQXVTR {

    private ultradamageMacrodata?: IBannerListenerLike = undefined;

    emptyerRebottom(anchor: 'top' | 'bottom' = 'bottom', margin: number = 0, listener?: IBannerListenerLike): void {
        // 参数1: gravity  锚点位置:  0: 以顶部为锚点  1: 以底部为锚点
        // 参数2: margin   距离锚点的位置: 单位像素
        this.ultradamageMacrodata = listener;
        ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().LWKWCWTTHPNLFLLU(anchor === 'top' ? 0 : 1, margin);
    }

    antivoiceMultiassist(): void {
        ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().YJFRMBUZHYRTKW();
    }

    // 横幅广告展示回调
    EBEOBLBO() {
        this.ultradamageMacrodata?.multiextendProveify?.();
    }

    // 横幅广告点击回调
    JFOBFAEBPU() {
        this.ultradamageMacrodata?.overfailMentionary?.();
    }

    // 横幅广告关闭回调
    ITTHTLEDWOUNHTP() {
        const listener = this.ultradamageMacrodata;
        this.ultradamageMacrodata = undefined;
        if (!listener) {
            return;
        }

        listener.hyperbrightHandleise?.();
    }

}

class PreventlyMicroletter implements DZAVKRLJX {

    private popularizeMiniunder?: ISplashAdListenerLike = undefined;

    get combineerCoupleward(): boolean {
        return ABJCUHDNRYIUEHTY.OTKPRUM().UTPKRWEZLFHMYSR().EHRRPBEKWC();
    }

    jumpizeSchoolly(listener?: ISplashAdListenerLike): void {
        this.popularizeMiniunder = listener;

        if (!ABJCUHDNRYIUEHTY.OTKPRUM().UTPKRWEZLFHMYSR().LVANMKT('entry')) {
            this.popularizeMiniunder = undefined;
            listener?.rereviewAdvanceless?.(false);
        }
    }

    ZNEMSJQVXBGJKMW() {
        this.popularizeMiniunder?.rereviewAdvanceless?.(true);
    }

    XHBRCH() {
        this.popularizeMiniunder?.submentionQuickly?.();
    }

    INHDTHCA() {
        const listener = this.popularizeMiniunder;
        this.popularizeMiniunder = undefined;
        if (!listener) {
            return;
        }

        listener.underreachNaturely?.();
    }

}

class MultimarkDetailship implements PKQEEMPEWUHK {

    private resistoryMacrocurrent: boolean = false;
    private shifterInteralong?: IVideoAdListenerLike = undefined;

    get megaclearMultiearth(): boolean {
        return ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().SBHXPPIA('game');
    }

    overforwardFullary(listener?: IVideoAdListenerLike): void {
        this.shifterInteralong = listener;

        if (!ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().VDNFQPXDYDU('game')) {
            this.shifterInteralong = undefined;
            listener?.overtellHeadness?.(false);
        }
    }

    // 激励视频广告开始回调
    SWFLEASBVFKC() {
        this.resistoryMacrocurrent = false;
        this.shifterInteralong?.overtellHeadness?.(true);
    }

    // 激励视频广告点击回调
    UWHIILBVLAZSZ() {
        this.shifterInteralong?.subadaptMultithen?.();
    }

    // 激励视频广告关闭回调
    ABJJNWQ() {
        const listener = this.shifterInteralong;
        this.shifterInteralong = undefined;
        if (!listener) {
            return;
        }

        if (this.resistoryMacrocurrent) {
            listener.nearPaintify?.(true);
        } else {
            listener.oceannessSuperking?.(true);
        }
    }

    // 激励视频广告完成回调
    LTSHSVTWAQAIZX() {
        this.resistoryMacrocurrent = true;
        this.shifterInteralong?.miniintendUltradetail?.();
    }

    // 激励视频广告收益回调
    REEVFESOCTAHCCVG() {
        this.shifterInteralong?.hyperjustMoviely?.();
    }

}

class HypergatePreknow implements CXADIVYSYQD {

    private giftiveHypercompose?: IInterstitialAdListenerLike = undefined;

    get underformatSuperquery(): boolean {
        return ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().UNVQTFRLZRFEUC('game');
    }

    overmuchMinicurious(listener?: IInterstitialAdListenerLike): void {
        this.giftiveHypercompose = listener;

        if (!ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().DTSYWGMBSCYN('game')) {
            this.giftiveHypercompose = undefined;
            listener?.minicomparePositioner?.(false);
        }
    }

    // 插屏广告开始回调
    QZIDUNEJ() {
        this.giftiveHypercompose?.minicomparePositioner?.(true);
    }

    // 插屏广告点击回调
    LDAFGWCGVTLDRC() {
        this.giftiveHypercompose?.multifeelProperism?.();
    }

    // 插屏广告关闭回调
    JDBEBZSPCKF() {
        const listener = this.giftiveHypercompose;
        this.giftiveHypercompose = undefined;
        if (!listener) {
            return;
        }

        listener.pushoryAntiprofile?.(true);
    }

    // 插屏广告收益回调
    REEVFESOCTAHCCVG() {
        this.giftiveHypercompose?.postfeedBattling?.();
    }

}

cc.js.setClassName('SubbillHyperforce', SubbillHyperforce);
cc.js.setClassName('ABJCUHDNRYIUEHTY', ABJCUHDNRYIUEHTY);
