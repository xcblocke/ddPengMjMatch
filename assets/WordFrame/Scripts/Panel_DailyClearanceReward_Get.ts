import { CLICKLOCK } from "./CLICKLOCK";
import { FrameSDK } from "./FrameSDK";
import { FrameData } from "./FrameData";

const { ccclass, property } = cc._decorator;

type Tier = { target: number, reward: number };

function getTiers(): Tier[] {
    const cfg = FrameData.FRAME_CONF.DailyClearanceRewardConfig;
    if (Array.isArray(cfg) && cfg.length > 0) {
        const list: Tier[] = [];
        for (let i = 0; i < cfg.length; i++) {
            const it = cfg[i];
            const target = Math.max(0, Math.floor(Number(it && it.target) || 0));
            const reward = Math.max(0, Math.floor(Number(it && it.reward) || 0));
            if (target > 0) list.push({ target, reward });
        }
        if (list.length > 0) return list;
    }
    return [
        { target: 15, reward: 50 },
        { target: 25, reward: 100 },
        { target: 50, reward: 200 },
    ];
}

function ensureDailyRewardState(): { day: number, mask: number } {
    const today = FrameSDK.getDateDay(FrameSDK.now);
    const s: any = FrameData.saveData.dailyClearanceReward;
    if (!s || typeof s !== "object") {
        FrameData.saveData.dailyClearanceReward = { day: today, mask: 0 };
        return FrameData.saveData.dailyClearanceReward;
    }
    const day = Math.max(0, Math.floor(Number(s.day) || 0));
    if (day !== today) {
        s.day = today;
        s.mask = 0;
    }
    s.mask = Math.max(0, Math.floor(Number(s.mask) || 0));
    return s;
}

function getMask(): number {
    return ensureDailyRewardState().mask;
}

function setMask(v: number): void {
    const s = ensureDailyRewardState();
    s.mask = Math.max(0, Math.floor(Number(v) || 0));
    FrameData.saveData.dailyClearanceReward = s;
}

function getDone(): number {
    const today = FrameSDK.getDateDay(FrameSDK.now);
    const p: any = FrameData.saveData.dailyClearanceProgress;
    if (!p || typeof p !== "object") return 0;
    if (Math.max(0, Math.floor(Number(p.day) || 0)) !== today) return 0;
    return Math.max(0, Math.floor(Number(p.count) || 0));
}

function getFreeVideoTimesConfig(): number {
    const n = Number(FrameData.FRAME_CONF.DailyClearanceRewardGetFreeVideoTimes);
    return Math.max(0, Math.floor(isNaN(n) ? 0 : n));
}

/** 免看视频双倍已用次数（生涯累计）；兼容旧存档 dailyClearanceGetFreeVideo: { day, used } */
function getFreeVideoUsedCount(): number {
    const v = FrameData.saveData.dailyClearanceGetFreeVideoUsed;
    if (typeof v === "number" && !isNaN(v)) {
        return Math.max(0, Math.floor(v));
    }
    const leg: any = (FrameData.saveData as any).dailyClearanceGetFreeVideo;
    if (leg && typeof leg === "object") {
        const u = Math.max(0, Math.floor(Number(leg.used) || 0));
        FrameData.saveData.dailyClearanceGetFreeVideoUsed = u;
        (FrameData.saveData as any).dailyClearanceGetFreeVideo = null;
        return u;
    }
    FrameData.saveData.dailyClearanceGetFreeVideoUsed = 0;
    return 0;
}

/**
 * 领取弹窗（参照 Panel_Award_1 的双按钮结构，但简化为：视频双倍 / 直接领取）
 *
 * Prefab: assets/WordFrame/Prefab/Panel_DailyClearanceReward_Get.prefab
 *
 * === 节点结构建议 ===
 * Panel_DailyClearanceReward_Get (根节点，挂本脚本 + Widget + BlockInputEvents)
 * └── panel_window (cc.Node) [绑定]
 *     ├── btn_close (cc.Node) [可选：关闭]
 *     ├── label_coin (cc.Label) [绑定：显示 +X 或 +2X]
 *     ├── btn_video (cc.Node, 带 cc.Button) [点击：看视频领取双倍]
 *     └── btn_free  (cc.Node, 带 cc.Button) [点击：直接领取；有免看视频次数时隐藏]
 * （可选）video_ad_icon：视频按钮上的广告角标；有免看次数时隐藏（也可命名为子节点 no_ad_xiao 由代码查找）
 * （可选）noTouch (cc.Node) ：点击后置 active=true 阻挡
 */
@ccclass
export default class Panel_DailyClearanceReward_Get extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;
    @property(sp.Skeleton)
    titleSkeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    contentSkeleton: sp.Skeleton = null;

    @property(cc.Label)
    label_coin: cc.Label = null;
    @property(cc.Label)
    label_coin2: cc.Label = null;
    @property(cc.Label)
    free_label_coin: cc.Label = null;
    

    @property(cc.Node)
    btn_video: cc.Node = null;

    @property(cc.Node)
    btn_free: cc.Node = null;

    /** 视频按钮上的广告图标；不绑定时会尝试 btn_video 下 no_ad_xiao */
    @property(cc.Node)
    video_ad_icon: cc.Node = null;

    viewData: { tierIndex: number, reward: number, closeCB?: () => void } = null;

    private _tierIndex: number = 0;
    private _reward: number = 0;
    private _claimed: boolean = false;

    onLoad(): void {

    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
        if (this.titleSkeleton) {
            this.titleSkeleton.setAnimation(0, "start", false);
            this.titleSkeleton.addAnimation(0, "loop", true);
        }

        if (this.contentSkeleton) {
            this.contentSkeleton.setAnimation(0, "2start", false);
            this.contentSkeleton.addAnimation(0, "2loop", true);
        }

        this._claimed = false;
        this._tierIndex = Math.max(0, Math.floor(Number(this.viewData?.tierIndex) || 0));
        this._reward = Math.max(0, Math.floor(Number(this.viewData?.reward) || 0));

        if (this.label_coin && cc.isValid(this.label_coin.node)) {
            this.label_coin.string = "+" + String(this._reward);
            this.free_label_coin.string = "skey_034 " + String(this._reward);
        }
        if (this.label_coin2 && cc.isValid(this.label_coin2.node)) {
            this.label_coin2.string = "+" + String(this._reward * 2);
        }

        if (this.btn_video && cc.isValid(this.btn_video)) {
            this.btn_video.on(cc.Node.EventType.TOUCH_END, () => this.onClickVideo(), this);
        }

        if (this.btn_free && cc.isValid(this.btn_free)) {
            this.btn_free.on(cc.Node.EventType.TOUCH_END, () => this.onClickFree(), this);
        }

        this._refreshFreeVideoUi();
    }

    /** 剩余免看视频双倍次数（生涯额度，不每日重置） */
    private _getRemainingFreeVideo(): number {
        const cap = getFreeVideoTimesConfig();
        if (cap <= 0) return 0;
        return Math.max(0, cap - getFreeVideoUsedCount());
    }

    private _getVideoAdIconNode(): cc.Node {
        if (this.video_ad_icon && cc.isValid(this.video_ad_icon)) return this.video_ad_icon;
        if (this.btn_video && cc.isValid(this.btn_video)) {
            const byName = this.btn_video.getChildByName("no_ad_xiao");
            if (byName && cc.isValid(byName)) return byName;
        }
        return null;
    }

    /** 有免看次数：隐藏直接领取与广告角标；用尽后恢复 */
    private _refreshFreeVideoUi(): void {
        const rem = this._getRemainingFreeVideo();
        const needRealAd = rem <= 0;
        if (this.btn_free && cc.isValid(this.btn_free)) {
            this.btn_free.active = needRealAd;
        }
        const adIcon = this._getVideoAdIconNode();
        if (adIcon && cc.isValid(adIcon)) {
            adIcon.active = needRealAd;
        }
    }

    private _setNoTouch(active: boolean): void {
        const n = this["noTouch"] ? this["noTouch"].node : this.node.getChildByName("noTouch");
        if (n && cc.isValid(n)) n.active = !!active;
    }

    private _grant(multiplier: number, consumeFreeVideoSlot: boolean = false): void {
        if (this._claimed) return;
        this._claimed = true;

        const tiers = getTiers();
        const cfg = tiers[this._tierIndex];
        if (!cfg) { this._claimed = false; return; }

        // 校验进度与已领取（进度来自框架存储）
        const done = getDone();
        let mask = getMask();
        if ((mask & (1 << this._tierIndex)) !== 0) { this._claimed = false; return; }
        if (done < cfg.target) { this._claimed = false; return; }

        // 写入领取位
        mask |= 1 << this._tierIndex;
        setMask(mask);

        if (consumeFreeVideoSlot) {
            FrameData.saveData.dailyClearanceGetFreeVideoUsed = getFreeVideoUsedCount() + 1;
        }

        const base = Math.max(0, Math.floor(Number(cfg.reward) || 0));
        const amount = Math.max(0, Math.floor(base * Math.max(1, Math.floor(Number(multiplier) || 1))));

        cc.director.emit("UPDATA_DAILY_CLEARANCE");

        // 统一用 WordFrame 的加钱逻辑
        FrameSDK.addCoin(amount, 0, 0, this.viewData?.closeCB);
        if (this.viewData) this.viewData.closeCB = null;

        this.close();
    }

    @CLICKLOCK(1)
    private onClickVideo(): void {
        if (this._getRemainingFreeVideo() > 0) {
            this._grant(2, true);
            return;
        }
        this._setNoTouch(true);
        FrameSDK.openVideo(
            () => {
                this._setNoTouch(false);
                this._grant(2, false);
            },
            () => {
                this._setNoTouch(false);
            },
            () => { },
            "daily_clearance_reward"
        );
    }

    @CLICKLOCK()
    private onClickFree(): void {
        this._grant(1);
    }

    close(cb?: () => void): void {
        FrameSDK.closeEffect(this, () => cb && cb());
    }
}

