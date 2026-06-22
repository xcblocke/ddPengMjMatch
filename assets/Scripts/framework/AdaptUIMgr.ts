/**
 * 竖屏 UI 适配：手机 720x1560（Fit Width），宽屏平板 Fit Height。
 * 在 initScene / loadingScene / mainScene 挂载脚本的 onLoad 开头调用 AdaptUIMgr.adapt()。
 */
export default class AdaptUIMgr {
    /** 手机设计分辨率（竖屏） */
    static readonly PHONE_WIDTH = 720;
    static readonly PHONE_HEIGHT = 1560;

    /** 平板设计分辨率：宽屏下用较小设计高度，减少左右黑边 */
    static readonly TABLET_WIDTH = 720;
    static readonly TABLET_HEIGHT = 1280;

    /** 当前生效的设计分辨率 */
    static designWidth = 0;
    static designHeight = 0;

    /** 是否按平板策略适配（宽屏或 iPad 设备） */
    static isTabletMode = false;

    /** 顶部安全区预留（可按需在其他 UI 逻辑里读取） */
    static topbar = 30;

    private static _resizeRegistered = false;

    /** 场景 onLoad 时调用 */
    static adapt(): void {
        AdaptUIMgr.applyDesignResolution();
        AdaptUIMgr.registerResizeIfNeeded();
    }

    /** 是否平板或宽屏设备，可供弹窗等 UI 做偏移判断 */
    static isTablet(): boolean {
        return AdaptUIMgr.isTabletMode;
    }

    private static applyDesignResolution(): void {
        const frame = cc.view.getFrameSize();
        const screenRatio = frame.width / frame.height;
        const tabletRatio = AdaptUIMgr.TABLET_WIDTH / AdaptUIMgr.TABLET_HEIGHT;
        const useTabletPolicy = cc.sys.platform === cc.sys.IPAD || screenRatio >= tabletRatio;

        AdaptUIMgr.isTabletMode = useTabletPolicy;

        let designW: number;
        let designH: number;
        let policy: number;

        if (useTabletPolicy) {
            designW = AdaptUIMgr.TABLET_WIDTH;
            designH = AdaptUIMgr.TABLET_HEIGHT;
            policy = cc.ResolutionPolicy.FIXED_HEIGHT;
        } else {
            designW = AdaptUIMgr.PHONE_WIDTH;
            designH = AdaptUIMgr.PHONE_HEIGHT;
            policy = cc.ResolutionPolicy.FIXED_WIDTH;
        }

        AdaptUIMgr.designWidth = designW;
        AdaptUIMgr.designHeight = designH;

        cc.view.setDesignResolutionSize(designW, designH, policy);

        const canvas = cc.Canvas.instance;
        if (canvas) {
            canvas.designResolution = cc.size(designW, designH);
            canvas.fitWidth = policy === cc.ResolutionPolicy.FIXED_WIDTH;
            canvas.fitHeight = policy === cc.ResolutionPolicy.FIXED_HEIGHT;
        }
    }

    private static registerResizeIfNeeded(): void {
        if (AdaptUIMgr._resizeRegistered) {
            return;
        }
        AdaptUIMgr._resizeRegistered = true;
        cc.view.setResizeCallback(() => {
            AdaptUIMgr.applyDesignResolution();
        });
    }
}
