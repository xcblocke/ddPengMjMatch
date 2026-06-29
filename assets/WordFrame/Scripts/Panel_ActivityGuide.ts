import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_ActivityGuide extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    bankLogo: cc.Node = null;

    @property(cc.Node)
    levelLogo: cc.Node = null;

    @property(cc.Node)
    clockLogo: cc.Node = null;

    @property(cc.RichText)
    rtx_tips1: cc.RichText = null;

    @property(cc.Node)
    tips2: cc.Node = null;

    @property(cc.RichText)
    rtx_tips2: cc.RichText = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { type: number, logoType?: 'bank' | 'levelReward' | 'clock', text: string, now: number, total: number, dtime: number, closeCB: () => void } = null;

    protected onLoad(): void {
        let x = cc.winSize.width * 0.5 + this.bg.width * 0.5;
        this.bg.x = x;

        this.bankLogo.active = this.viewData.logoType === 'bank';
        this.levelLogo.active = this.viewData.logoType === 'levelReward';
        this.clockLogo.active = this.viewData.logoType === 'clock';

        this.rtx_tips1.node.active = this.viewData.type == 1;
        this.rtx_tips1.string = this.viewData.text;

        this.tips2.active = this.viewData.type == 2;
        if (this.viewData.type == 2) {
            this.rtx_tips2.string = this.viewData.text;
            this.progressBar.progress = this.viewData.total <= 0 ? 0 : this.viewData.now / this.viewData.total;
            this.progressLabel.string = `${this.viewData.now}/${this.viewData.total}`;
        }

        FrameSDK.playEffect("rewardshow");

        cc.tween(this.bg).to(0.7, {x: 0}, {
            easing: "backOut"
        }).delay(this.viewData.dtime || 1).to(0.7, {x: -x}, {
            easing: "backIn"
        }).call(() => {
            FrameSDK.closeEffect(this, null);
        }).start();
    }

    protected onEnable(): void {
        FrameSDK.openEffect(this);
    }

    onDisable() {
        var e, t;
        null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
    }

    // update (dt) {}
}
