/**
 * 高频弹窗对象池：预热阶段完成 load + instantiate，打开时从池中取用。
 * 需要池化的面板名追加到 POOLED_PANELS 末尾即可。
 * 注：RDM_Level 含新手教程与 onDestroy 事件，不参与池化。
 */
export const POOLED_PANELS: string[] = [
    "Panel_Activity",
    "Panel_Award_1",
    "Panel_Award_3",
    "Panel_Award_6",
    "Panel_Clock",
    "RDM_Charity",
];

const POOLED_SET = new Set(POOLED_PANELS);
const PREFAB_PATH = "Prefab/";

export default class PanelPool {
    private static prefabCache = new Map<string, cc.Prefab>();
    private static pools = new Map<string, cc.Node[]>();
    private static warming = false;
    private static fpsWaitPending = false;
    private static fpsWaitListener: (() => void) | null = null;
    /** 预热/静默实例化时屏蔽面板 onEnable，避免误触发新手教程 */
    private static suppressPanelLifecycle = false;

    static isSuppressPanelLifecycle(): boolean {
        return PanelPool.suppressPanelLifecycle;
    }

    private static instantiatePooled(name: string, prefab: cc.Prefab): cc.Node {
        PanelPool.suppressPanelLifecycle = true;
        const node = cc.instantiate(prefab);
        PanelPool.suppressPanelLifecycle = false;
        node["_poolPanelName"] = name;
        return node;
    }

    static isPooled(name: string): boolean {
        return POOLED_SET.has(name);
    }

    static getPoolName(node: cc.Node): string | null {
        if (!node || !cc.isValid(node)) {
            return null;
        }
        const n = node["_poolPanelName"];
        return typeof n === "string" ? n : null;
    }

    private static bundle() {
        return cc.assetManager.getBundle("WordFrame");
    }

    private static loadPrefabAsset(name: string, cb: (prefab: cc.Prefab | null) => void) {
        const cached = PanelPool.prefabCache.get(name);
        if (cached) {
            cb(cached);
            return;
        }
        const bundle = PanelPool.bundle();
        if (!bundle) {
            console.error("[PanelPool] WordFrame bundle not ready:", name);
            cb(null);
            return;
        }
        bundle.load(PREFAB_PATH + name, cc.Prefab, (err, prefab: cc.Prefab) => {
            if (err || !prefab) {
                console.error("[PanelPool] load prefab failed:", name, err);
                cb(null);
                return;
            }
            PanelPool.prefabCache.set(name, prefab);
            cb(prefab);
        });
    }

    /**
     * 等帧率稳定在 minFps 以上再分帧预热，避免刚进场景播动画时（约 15fps）与切场景抢性能。
     * 超过 maxWaitSec 仍未达标则强制开始，避免低端机永远不预热。
     */
    static startWarmWhenFpsStable(
        intervalSec = 0.12,
        options?: {
            minFps?: number;
            stableDurationSec?: number;
            maxWaitSec?: number;
            onComplete?: () => void;
        },
    ) {
        if (PanelPool.warming || PanelPool.fpsWaitPending) {
            return;
        }
        const minFps = options?.minFps ?? 50;
        const stableDurationSec = options?.stableDurationSec ?? 0.4;
        const maxWaitSec = options?.maxWaitSec ?? 12;
        const onComplete = options?.onComplete;

        PanelPool.fpsWaitPending = true;
        let stableAccum = 0;
        let totalWait = 0;

        const onUpdate = () => {
            const rawDt = cc.director.getDeltaTime();
            const dt = rawDt > 0 ? Math.min(rawDt, 0.1) : 0;
            if (dt <= 0) {
                return;
            }
            totalWait += dt;
            const fps = 1 / dt;
            if (fps >= minFps) {
                stableAccum += dt;
            } else {
                stableAccum = 0;
            }

            if (stableAccum >= stableDurationSec || totalWait >= maxWaitSec) {
                PanelPool.clearFpsWait();
                CC_DEBUG && console.log(
                    "[PanelPool] warm start",
                    stableAccum >= stableDurationSec ? "fps_stable" : "timeout",
                    { fps: Math.round(fps), stableSec: stableAccum.toFixed(2), waitedSec: totalWait.toFixed(2) },
                );
                PanelPool.startWarm(intervalSec, onComplete);
            }
        };

        PanelPool.fpsWaitListener = onUpdate;
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, onUpdate);
    }

    private static clearFpsWait() {
        PanelPool.fpsWaitPending = false;
        if (PanelPool.fpsWaitListener) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, PanelPool.fpsWaitListener);
            PanelPool.fpsWaitListener = null;
        }
    }

    /** 分帧预热：每个面板间隔 intervalSec 实例化 1 个并入池 */
    static startWarm(intervalSec = 0.12, onComplete?: () => void) {
        if (PanelPool.warming) {
            return;
        }
        PanelPool.warming = true;
        let index = 0;
        const step = () => {
            if (index >= POOLED_PANELS.length) {
                PanelPool.warming = false;
                CC_DEBUG && console.log("[PanelPool] warm complete", POOLED_PANELS.length);
                onComplete && onComplete();
                return;
            }
            const name = POOLED_PANELS[index++];
            PanelPool.warmOne(name, () => {
                setTimeout(step, Math.max(0, intervalSec) * 1000);
            });
        };
        step();
    }

    private static warmOne(name: string, done: () => void) {
        PanelPool.loadPrefabAsset(name, (prefab) => {
            if (!prefab) {
                done();
                return;
            }
            const list = PanelPool.pools.get(name) || [];
            if (list.length > 0) {
                done();
                return;
            }
            const node = PanelPool.instantiatePooled(name, prefab);
            PanelPool.prepareForPool(name, node);
            list.push(node);
            PanelPool.pools.set(name, list);
            CC_DEBUG && console.log("[PanelPool] warmed", name);
            done();
        });
    }

    static acquire(name: string, cb: (node: cc.Node) => void) {
        if (!PanelPool.isPooled(name)) {
            console.warn("[PanelPool] acquire non-pooled:", name);
            cb(null);
            return;
        }
        const list = PanelPool.pools.get(name);
        if (list && list.length > 0) {
            const node = list.pop();
            cb(node);
            return;
        }
        PanelPool.loadPrefabAsset(name, (prefab) => {
            if (!prefab) {
                cb(null);
                return;
            }
            cb(PanelPool.instantiatePooled(name, prefab));
        });
    }

    static release(name: string, node: cc.Node) {
        if (!node || !cc.isValid(node)) {
            return;
        }
        PanelPool.prepareForPool(name, node);
        const list = PanelPool.pools.get(name) || [];
        list.push(node);
        PanelPool.pools.set(name, list);
    }

    private static prepareForPool(name: string, node: cc.Node) {
        node.stopAllActions();
        cc.Tween.stopAllByTarget(node);

        const comp: any = node.getComponent(name);
        if (comp) {
            comp.unscheduleAllCallbacks();
            if (comp.panel_window && cc.isValid(comp.panel_window)) {
                comp.panel_window.stopAllActions();
                cc.Tween.stopAllByTarget(comp.panel_window);
                comp.panel_window.scale = 1;
                comp.panel_window.opacity = 255;
                comp.panel_window.setPosition(0, 0, 0);
            }
            if (comp.black_sprite && cc.isValid(comp.black_sprite.node)) {
                comp.black_sprite.node.stopAllActions();
                comp.black_sprite.node.opacity = 0;
            }
            if (comp.noTouch && cc.isValid(comp.noTouch.node)) {
                comp.noTouch.node.active = true;
            }
            comp.viewData = null;
            if (typeof comp._chainCloseDone === "boolean") {
                comp._chainCloseDone = false;
            }
            if (typeof comp._rewardClaimed === "boolean") {
                comp._rewardClaimed = false;
            }
            PanelPool.resetPanelGuideState(name, comp, node);
        }

        node.removeFromParent(false);
        node.active = false;
        node.opacity = 255;
    }

    /** 回池时复位教程/手势等仅 onLoad 初始化、destroy 时才会清掉的状态 */
    private static resetPanelGuideState(name: string, comp: any, node: cc.Node) {
        if (name === "RDM_Charity") {
            comp.guideInedx = 0;
            if (comp.guide && cc.isValid(comp.guide)) {
                comp.guide.active = false;
                PanelPool.stopGuideHandTweens(comp.guide);
            }
        }
    }

    private static stopGuideHandTweens(guideNode: cc.Node) {
        ["tips1/hand", "tips2/hand", "tips3/hand"].forEach((path) => {
            const hand = cc.find(path, guideNode);
            if (hand && cc.isValid(hand)) {
                hand.stopAllActions();
                cc.Tween.stopAllByTarget(hand);
            }
        });
    }
}
