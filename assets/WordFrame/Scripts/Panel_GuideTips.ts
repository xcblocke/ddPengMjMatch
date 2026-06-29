import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_GuideTips extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Node)
    charityLogo: cc.Node = null;

    @property(cc.RichText)
    tipsRichText: cc.RichText = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { type: 'charity' /* 可继续添加类型 */, closeCB: () => void } = null;

    protected onLoad(): void {
        let x = cc.winSize.width * 0.5 + this.bg.width * 0.5;
        this.bg.x = x;

        this.charityLogo.active = this.viewData.type === 'charity';

        switch (this.viewData.type) {
            case 'charity': {
                this.titleLabel.string = `skey_105`;
                this.tipsRichText.string = `skey_106`;
                break;
            }

            default: {
                this.titleLabel.string = ``;
                this.tipsRichText.string = ``;
            }
        }

        FrameSDK.playEffect("rewardshow");

        cc.tween(this.bg).to(0.7, {x: 0}, {
            easing: "backOut"
        }).delay(1).to(0.7, {x: -x}, {
            easing: "backIn"
        }).call(() => {
            FrameSDK.closeEffect(this, null);
        }).start();
    }

    protected onEnable(): void {
        FrameSDK.openEffect(this);
    }

    onDisable() {
        this.viewData?.closeCB?.();
    }

    // update (dt) {}
}
