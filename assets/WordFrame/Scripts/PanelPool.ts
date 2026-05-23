/**
 * 高频弹窗对象池：预热阶段完成 load + instantiate，打开时从池中取用。
 * 需要池化的面板名追加到 POOLED_PANELS 末尾即可。
 */
export const POOLED_PANELS: string[] = [
    "Panel_Activity",
    "Panel_Award_1",
    "Panel_Award_3",
    "Panel_Award_6",
    "Panel_Clock",
    "RDM_Charity",
    "RDM_Level",
];

const POOLED_SET = new Set(POOLED_PANELS);
const PREFAB_PATH = "Prefab/";

export default class PanelPool {
    private static prefabCache = new Map<string, cc.Prefab>();
    private static pools = new Map<string, cc.Node[]>();
    private static warming = false;

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
            const node = cc.instantiate(prefab);
            node["_poolPanelName"] = name;
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
            const node = cc.instantiate(prefab);
            node["_poolPanelName"] = name;
            cb(node);
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
        }

        node.removeFromParent(false);
        node.active = false;
        node.opacity = 255;
    }
}
