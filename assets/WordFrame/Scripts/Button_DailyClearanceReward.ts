import { CLICKLOCK } from "./CLICKLOCK";
import Panel_DailyClearanceReward from "./Panel_DailyClearanceReward";
import { FrameSDK } from "./FrameSDK";
import { FrameData } from "./FrameData";

const { ccclass, property } = cc._decorator;

/**
 * 按 WordFrame 风格的入口按钮（参考 Button_Task）：
 * - `but`：按钮节点（同时作为 closeEffect 的 coinTarget）
 * - `point`：红点（有可领取档位时显示）
 * - `pro_label`：进度文本（可选）
 */
@ccclass
export default class Button_DailyClearanceReward extends cc.Component {
    private static _registeredAddListener: boolean = false;

    @property(cc.Node)
    point: cc.Node = null;

    @property(cc.Node)
    but: cc.Node = null;

    @property(cc.RichText)
    task_desc: cc.RichText = null;
    @property(cc.Label)
    pro_label: cc.Label = null;
    @property(cc.Label)
    btn_coin_label: cc.Label = null;

    @property(cc.Sprite)
    pro_bar: cc.Sprite = null;

    onLoad(): void {
        // 任务模块内注册一次：游戏侧只 emit("DAILY_CLEARANCE_ADD", +1)
        if (!Button_DailyClearanceReward._registeredAddListener) {
            Button_DailyClearanceReward._registeredAddListener = true;
            cc.director.on("DAILY_CLEARANCE_ADD", (delta: number = 1) => {

                    const d = Math.max(0, Math.floor(Number(delta) || 0)) || 1;
                    const today = FrameSDK.getDateDay(FrameSDK.now);
                    let p = FrameData.saveData.dailyClearanceProgress;
                    if (!p || typeof p !== "object") p = { day: today, count: 0 };
                    const day = Math.max(0, Math.floor(Number(p.day) || 0));
                    if (day !== today) {
                        p.day = today;
                        p.count = 0;
                    }
                    p.count = Math.max(0, Math.floor(Number(p.count) || 0)) + d;
                    FrameData.saveData.dailyClearanceProgress = p;
                    cc.director.emit("UPDATA_DAILY_CLEARANCE");
            });
        }
        cc.director.on("UPDATA_DAILY_CLEARANCE", this.updateUI, this);
        // 解锁依赖关卡变化：跟随框架现有事件刷新
        cc.director.on("UPDATA_LEVEL", this.updateUI, this);
        Panel_DailyClearanceReward.coinTarget = this.but;
        this.updateUI();
    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    private _getDone(): number {
        const today = FrameSDK.getDateDay(FrameSDK.now);
        const p = FrameData.saveData.dailyClearanceProgress;
        if (!p || typeof p !== "object") return 0;
        if (Math.max(0, Math.floor(Number(p.day) || 0)) !== today) return 0;
        return Math.max(0, Math.floor(Number(p.count) || 0));
    }

    private _getMask(): number {
        const today = FrameSDK.getDateDay(FrameSDK.now);
        const s: any = FrameData.saveData.dailyClearanceReward;
        if (!s || typeof s !== "object") return 0;
        if (Math.max(0, Math.floor(Number(s.day) || 0)) !== today) return 0;
        return Math.max(0, Math.floor(Number(s.mask) || 0));
    }

    private _getTiers(): Array<{ target: number, reward: number }> {
        const cfg = FrameData.FRAME_CONF.DailyClearanceRewardConfig;
        if (Array.isArray(cfg) && cfg.length > 0) {
            const list: Array<{ target: number, reward: number }> = [];
            for (let i = 0; i < cfg.length; i++) {
                const it = cfg[i];
                const target = Math.max(0, Math.floor(Number(it && (it as any).target) || 0));
                const reward = Math.max(0, Math.floor(Number(it && (it as any).reward) || 0));
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

    updateUI(): void {
        // 解锁条件：第二关通关后（与 FrameSDK.checkPopUp 一致）
        const gd = FrameSDK.frameData && FrameSDK.frameData.gameData ? FrameSDK.frameData.gameData : null;
        const unlockLv = Math.max(1, Math.floor(Number(FrameData.FRAME_CONF.dailyClearanceUnlockLevel) || 2));
        const unlocked = !!(gd && gd.isFlag && Math.max(0, Math.floor(Number(gd.passLevel) || 0)) >= unlockLv);

        // 未解锁：只隐藏 but 节点，脚本仍保持运行
        if (!unlocked) {
            const n = this.but && cc.isValid(this.but) ? this.but : this.node;
            if (n && cc.isValid(n)) n.active = false;
            return;
        }

        const done = this._getDone();
        const mask = this._getMask();

        const tiers = this._getTiers();
        const allMask = tiers.length >= 31 ? 0x7fffffff : ((1 << tiers.length) - 1);
        const allClaimed = tiers.length > 0 && (mask & allMask) === allMask;

        // 领取完隐藏入口：只隐藏 but 节点，脚本仍保持运行
        {
            const n = this.but && cc.isValid(this.but) ? this.but : this.node;
            if (n && cc.isValid(n)) n.active = !allClaimed;
        }
        if (allClaimed) return;

        let canClaim = false;
        for (let i = 0; i < tiers.length; i++) {
            const target = Math.max(0, Math.floor(Number(tiers[i]?.target) || 0));
            if (target <= 0) continue;
            const claimed = (mask & (1 << i)) !== 0;
            if (!claimed && done >= target) { canClaim = true; break; }
        }

        if (this.point && cc.isValid(this.point)) {
            this.point.opacity = canClaim ? 255 : 0;
        }
        // 档位展示规则：
        // - 收集达成某一档后（done >= target），无论是否领取，都应切换显示下一档
        // - 达到最后一档后，当天一直显示最后一档
        const lastIdx = Math.max(0, tiers.length - 1);
        let showIdx = lastIdx;
        for (let i = 0; i < tiers.length; i++) {
            const t = Math.max(0, Math.floor(Number(tiers[i]?.target) || 0));
            if (t > 0 && done < t) { showIdx = i; break; }
        }

        const target = Math.max(0, Math.floor(Number(tiers[showIdx]?.target) || 0));
        const reward = Math.max(0, Math.floor(Number(tiers[showIdx]?.reward) || 0));
        const ratio = target > 0 ? Math.min(1, done / target) : 0;

        if (this.pro_label && cc.isValid(this.pro_label.node) && target > 0) {
            this.pro_label.string = `${Math.min(done, target)}/${target}`;
        }
        if (this.pro_bar && cc.isValid(this.pro_bar.node)) {
            this.pro_bar.fillRange = ratio;
        }
        if (this.task_desc && cc.isValid(this.task_desc.node) && target > 0) {
            this.task_desc.string = `skey_142??&value1==<color=#2FA427>${target}</color>`;
        }
        if (this.btn_coin_label && cc.isValid(this.btn_coin_label.node)) {
            this.btn_coin_label.string = `${reward}`;
        }
    }

    @CLICKLOCK()
    onBtnEvent(target, data: string): void {
        Panel_DailyClearanceReward.start();
    }

    onBtnTest(target, data: string): void {
        cc.director.emit("DAILY_CLEARANCE_ADD", 1);
    }

    /**
     * 切天测试：
     * - data="yesterday"：把进度/领取状态的 day 改成昨天（下一次刷新会按“非今日”处理，等同跨天）
     * - data="today"：把 day 改回今天（不强制改 count/mask，方便你回切观察）
     * - 其它：默认 yesterday
     */
    onBtnTestSwitchDay(target, data: string): void {
        const today = FrameSDK.getDateDay(FrameSDK.now);
        const toYesterday = !data || String(data) === "yesterday";
        const day = toYesterday ? Math.max(0, today - 1) : today;

        // 进度
        {
            let p: any = FrameData.saveData.dailyClearanceProgress;
            if (!p || typeof p !== "object") p = { day: today, count: 0 };
            p.day = day;
            FrameData.saveData.dailyClearanceProgress = p;
        }
        // 领取状态
        {
            let s: any = FrameData.saveData.dailyClearanceReward;
            if (!s || typeof s !== "object") s = { day: today, mask: 0 };
            s.day = day;
            FrameData.saveData.dailyClearanceReward = s;
        }

        cc.director.emit("UPDATA_DAILY_CLEARANCE");
    }

    /**
     * 测试：把今天的进度一键加满到最大档位（不改领取 mask）
     * 用法：按钮绑定该方法即可（customEventData 可不填）
     */
    onBtnTestFillAll(target, data: string): void {
        const today = FrameSDK.getDateDay(FrameSDK.now);
        const tiers = this._getTiers();
        let maxTarget = 0;
        for (let i = 0; i < tiers.length; i++) {
            maxTarget = Math.max(maxTarget, Math.floor(Number(tiers[i]?.target) || 0));
        }

        let p: any = FrameData.saveData.dailyClearanceProgress;
        if (!p || typeof p !== "object") p = { day: today, count: 0 };
        p.day = today;
        p.count = Math.max(0, maxTarget);
        FrameData.saveData.dailyClearanceProgress = p;

        cc.director.emit("UPDATA_DAILY_CLEARANCE");
    }
}

