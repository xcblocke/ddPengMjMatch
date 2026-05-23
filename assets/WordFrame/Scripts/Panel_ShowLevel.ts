import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_ShowLevel extends cc.Component {

   

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Node)
    bgNode: cc.Node = null;


    viewData: { level?: number, closeCB?: () => void } = null;
    black_sprite: cc.Sprite = null;
    private _closed = false;

    private finishClose() {
        if (this._closed) return;
        this._closed = true;
        const cb = this.viewData?.closeCB;
        if (this.viewData) this.viewData.closeCB = null;
        cb?.();
    }

    protected onLoad(): void {
        let x = cc.winSize.width * 0.5 + this.bgNode.width * 0.5;
        this.bgNode.x = x + 300;

        const level = this.viewData?.level != null
            ? Math.floor(Number(this.viewData.level))
            : FrameSDK.frameData.gameData.passLevel + 1;
        this.titleLabel.string = "fkey_141" + level;

        // switch (this.viewData.type) {
        //     case 'charity': {
        //         this.titleLabel.string = `skey_105`;
        //         this.tipsRichText.string = `skey_106`;
        //         break;
        //     }

        //     default: {
        //         this.titleLabel.string = ``;
        //         this.tipsRichText.string = ``;
        //     }
        // }

        FrameSDK.playEffect("rewardshow");

        cc.tween(this.bgNode).to(0.8, {x: 0}, {
            easing: "backOut"
        }).delay(1).to(0.8, {x: -x-300}, {
            easing: "backIn"
        }).call(() => {
            this.dismissPanel();
        }).start();
    }

    /** 横幅完全滑出后再销毁并回调，避免麻将提前出现 */
    private dismissPanel() {
        if (this.black_sprite && this.black_sprite.node) {
            cc.Tween.stopAllByTarget(this.black_sprite.node);
            this.black_sprite.node.opacity = 0;
        }
        this.node.destroy();
    }

    protected onEnable(): void {
        // FrameSDK.openEffect(this);
        // 关卡横幅：不铺黑色遮罩，仅保留 bgNode 滑入滑出
        if (this.black_sprite && this.black_sprite.node) {
            this.black_sprite.node.active = false;
        }
    }

    onDisable() {
        this.finishClose();
    }

    // update (dt) {}
}
