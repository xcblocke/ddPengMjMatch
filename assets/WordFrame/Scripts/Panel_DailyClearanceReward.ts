import { CLICKLOCK } from "./CLICKLOCK";
import { FrameSDK } from "./FrameSDK";
import { FrameData } from "./FrameData";

const { ccclass, property } = cc._decorator;

/**
 * WordFrame 弹窗：Prefab 路径为 `assets/WordFrame/Prefab/Panel_DailyClearanceReward.prefab`
 * 通过 `FrameSDK.openWindow("Panel_DailyClearanceReward")` 打开。
 *
 * === 预制体结构（参照 Panel_Task）===
 *
 * Panel_DailyClearanceReward (根节点，挂本脚本 + Widget + BlockInputEvents)
 * ├── panel_window (cc.Node)  [绑定到 panel_window]
 * │   ├── btn_close (cc.Node, 可挂 Button/TouchButton)
 * │   ├── title (cc.Label，可选)
 * │   └── node_content (cc.Node) [绑定到 node_content]
 * │       ├── item_tpl (cc.Node, 作为模板，需包含以下子节点)
 * │       │   ├── label_reward (cc.Label)      显示 +50/+100/+200
 * │       │   ├── label_desc (cc.Label)        显示“Collect N card sets…”
 * │       │   ├── progress (cc.Node)           进度条底槽（用于取宽度）
 * │       │   │   ├── bar_fill (cc.Node)       填充条（建议 anchorX=0）
 * │       │   │   └── label_progress (cc.Label)显示 12/15 或 “Claimed”
 * │       │   └── btn_claim (cc.Button/cc.Node)领取按钮（Button.clickEvents[0] 绑定 onBtnClaim，customEventData = 档位下标 0/1/2）
 * │       └── ...（脚本会按模板复制生成 3 行）
 * └── noTouch (cc.Button/cc.Node，可选；若需要跟其它面板一致的点击锁，可照 Panel_Award_6 做)
 */

type Tier = { target: number, reward: number };

function getTiers(): Tier[] {
    const cfg = FrameData.FRAME_CONF.DailyClearanceRewardConfig;
    if (Array.isArray(cfg) && cfg.length > 0) {
        const list: Tier[] = [];
        for (let i = 0; i < cfg.length; i++) {
            const it = cfg[i];
            const target = Math.max(0, Math.floor(Number(it && (it as any).target) || 0));
            const reward = Math.max(0, Math.floor(Number(it && (it as any).reward) || 0));
            if (target > 0) list.push({ target, reward });
        }
        if (list.length > 0) return list;
    }
    // fallback（无配置时）
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
        return FrameData.saveData.dailyClearanceReward as any;
    }
    const day = Math.max(0, Math.floor(Number(s.day) || 0));
    if (day !== today) {
        s.day = today;
        s.mask = 0;
    }
    if (!isFinite(Number(s.mask))) s.mask = 0;
    s.mask = Math.max(0, Math.floor(Number(s.mask) || 0));
    return s;
}

function getMask(): number {
    return ensureDailyRewardState().mask;
}

function setMask(v: number): void {
    const s = ensureDailyRewardState();
    s.mask = Math.max(0, Math.floor(Number(v) || 0));
    FrameData.saveData.dailyClearanceReward = s as any;
}

function getDone(): number {
    const today = FrameSDK.getDateDay(FrameSDK.now);
    const p: any = FrameData.saveData.dailyClearanceProgress;
    if (!p || typeof p !== "object") return 0;
    if (Math.max(0, Math.floor(Number(p.day) || 0)) !== today) return 0;
    return Math.max(0, Math.floor(Number(p.count) || 0));
}

@ccclass
export default class Panel_DailyClearanceReward extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Node)
    node_content: cc.Node = null;

    

    viewData: { closeCB?: () => void } = null;

    private _close_target: cc.Node = null;
    static coinTarget: cc.Node = null; // 可选：用于 closeEffect 的飞向目标

    protected onLoad(): void {
        this._close_target = Panel_DailyClearanceReward.coinTarget;
        this._bindCloseBtn();
        this._ensureRows();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("task_show");
        
        this.updateUi();
    }

    private _bindCloseBtn(): void {
        const btn = this.panel_window ? this.panel_window.getChildByName("btn_close") : null;
        if (btn && cc.isValid(btn)) btn.on(cc.Node.EventType.TOUCH_END, () => this.onTouchClose(), this);
    }

    private _ensureRows(): void {
        if (!this.node_content || !cc.isValid(this.node_content)) return;
        const tiers = getTiers();
        const tpl = this.node_content.getChildByName("item") || this.node_content.children[0];
        if (!tpl) return;
        // 确保 item 数量与配置一致
        for (let i = 0; i < tiers.length; i++) {
            const node = (i === 0) ? tpl : (this.node_content.children[i] ?? cc.instantiate(tpl));
            node.parent = this.node_content;
            node.active = true;
        }
        // 多余的隐藏（不销毁，避免编辑器误操作）
        for (let i = tiers.length; i < this.node_content.childrenCount; i++) {
            const extra = this.node_content.children[i];
            if (extra && cc.isValid(extra) && extra !== tpl) extra.active = false;
        }
    }

    updateUi(): void {
        if (!this.node_content || !cc.isValid(this.node_content)) return;
        const tiers = getTiers();
        const tpl = this.node_content.getChildByName("item") || this.node_content.children[0];
        if (!tpl) return;
        this._ensureRows();
        const done = getDone();
        let mask = getMask();

        // 显示顺序：已领取的移到最后（仅改显示，不改档位索引）
        const order = tiers.map((_, idx) => idx).sort((a, b) => {
            const ca = ((mask & (1 << a)) !== 0) ? 1 : 0;
            const cb = ((mask & (1 << b)) !== 0) ? 1 : 0;
            return ca - cb;
        });

        for (let viewIdx = 0; viewIdx < order.length; viewIdx++) {
            const tierIdx = order[viewIdx];
            const cfg = tiers[tierIdx];
            const row = (viewIdx === 0) ? tpl : (this.node_content.children[viewIdx] ?? cc.instantiate(tpl));
            row.parent = this.node_content;
            row.active = true;

            const claimed = (mask & (1 << tierIdx)) !== 0;
            const canClaim = !claimed && done >= cfg.target;

            const labRewNode = cc.find("label_reward", row);
            const labRew = labRewNode ? labRewNode.getComponent(cc.Label) : null;
            if (labRew) labRew.string = `+${cfg.reward}`;

            const labDescNode = cc.find("label_desc", row);
            const labDesc = labDescNode ? labDescNode.getComponent(cc.RichText) : null;
            if (labDesc) labDesc.string = `skey_142??&value1==<color=#2FA427>${cfg.target}</color>`;

            const progressNode = cc.find("progress", row) as cc.Node;
            const fillNode = progressNode ? (cc.find("bar_fill", progressNode) as cc.Node) : null;
            const progLab = progressNode ? cc.find("label_progress", progressNode)?.getComponent(cc.Label) : null;

            const progShow = Math.min(done, cfg.target);
            if (progLab) progLab.string = claimed ? "Claimed" : `${progShow}/${cfg.target}`;
            if (progressNode && fillNode && cc.isValid(fillNode)) {
                fillNode.getComponent(cc.Sprite).fillRange = progShow / cfg.target;
            }

            // 已领取态：显示 hui 灰遮罩（若预制体存在该节点）
            const hui = cc.find("hui", row) as cc.Node;
            if (hui && cc.isValid(hui)) hui.active = claimed;

            // 领取按钮：要求 row 上有 cc.Button，并且 clickEvents[0] 指向 onBtnClaim
            const btnNode = cc.find("btn_claim", row) as cc.Node;
            const button = btnNode ? btnNode.getComponent(cc.Button) : null;
            if (button) {
                button.interactable = !!canClaim;
                if (button.clickEvents && button.clickEvents[0]) {
                    // 注意：这里必须传真实档位索引，而不是当前显示行号
                    button.clickEvents[0].customEventData = String(tierIdx);
                }
            }
            // btn_claim 下装饰节点：point(可领取才显示)、light(只显示第一行)
            if (btnNode && cc.isValid(btnNode)) {
                const point = btnNode.getChildByName("point");
                if (point && cc.isValid(point)) point.active = !!canClaim;
                const light = btnNode.getChildByName("light");
                if (light && cc.isValid(light)) light.active = (viewIdx === 0) && !!canClaim;
            }
            // 不可领态：显示 btn_claim/btn_bg_hui
            const gray = btnNode ? btnNode.getChildByName("btn_bg_hui") : null;
            if (gray && cc.isValid(gray)) gray.active = !canClaim;
        }
    }

    @CLICKLOCK()
    onBtnClaim(target: cc.Node, data: string): void {
        const idx = Math.max(0, Math.floor(Number(data) || 0));
        const tiers = getTiers();
        const cfg = tiers[idx];
        if (!cfg) return;

        // 点击领取：弹出二选一领取页（看视频双倍 / 直接领取）
        FrameSDK.openWindow("Panel_DailyClearanceReward_Get", {
            tierIndex: idx,
            reward: Math.max(0, Math.floor(Number(cfg.reward) || 0)),
            closeCB: () => {
                this.updateUi();
                cc.director.emit("UPDATA_DAILY_CLEARANCE");
            }
        });
    }

    onTouchClose(): void {
        FrameSDK.closeEffect(this, () => this.viewData?.closeCB?.());
    }

    static start(closeCB?: () => void, autoChain = false): void {
        // FrameSDK.openWindow("Panel_DailyClearanceReward", { closeCB });
        if (autoChain && closeCB) {
            closeCB();
        }
    }
}

