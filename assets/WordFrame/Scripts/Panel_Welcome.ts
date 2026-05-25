import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_Welcome extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.RichText)
    rtx_tips1: cc.RichText = null;

    @property(cc.Node)
    lv_proNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { type: number,  closeCB: () => void } = null;
    black_sprite: cc.Sprite = null;

    protected onLoad(): void {
        let x = cc.winSize.width * 0.5 + this.bg.width * 0.5;
        this.bg.x = x;


        this.rtx_tips1.string = `skey_123??&value1==<color = #FCFF0A><size=36>30</size></c>`;

        FrameSDK.playEffect("rewardshow");

        cc.tween(this.bg).to(0.7, {x: 0}, {
            easing: "backOut"
        }).call(() => {
            this.black_sprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
        }).start();
    }

    protected onEnable(): void {
        FrameSDK.openEffect(this);
        this.lv_proNode.active = FrameSDK.frameData.gameData.isFlag;
    }

    onDisable() {
        this.viewData?.closeCB?.();
    }

    hideTime = 0;
    onTouchCloseTips() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            let x = cc.winSize.width * 0.5 + this.bg.width * 0.5;
            cc.Tween.stopAllByTarget(this.bg);
            cc.tween(this.bg).to(0.7, {x: -x}, {
                easing: "backIn"
            }).call(() => {
                FrameSDK.closeEffect(this, null);
            }).start();
        }
    }

    // update (dt) {}
}
