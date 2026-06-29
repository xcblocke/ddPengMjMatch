import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_RedeemTips extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    lv_sp: cc.Node = null;
    @property(cc.Node)
    rounds_sp: cc.Node = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.RichText)
    tips1: cc.RichText = null;

    @property(cc.RichText)
    rtx_tips1: cc.RichText = null;
    @property(cc.Node)
    paymentRootNode: cc.Node = null;

    viewData: { level: number | string, currentBonus: number, closeCB?: () => void } = null;
    private _closed = false;
    /** onLoad 已成功挂上 viewData 并开始展示 */
    private _started = false;

    private finishClose() {
        if (this._closed) return;
        this._closed = true;
        const cb = this.viewData?.closeCB;
        if (this.viewData) this.viewData.closeCB = null;
        cb?.();
    }

    protected onLoad(): void {
        if (!this.viewData || !this.bg) {
            console.warn("[Panel_RedeemTips] missing viewData or bg, skip");
            this.scheduleOnce(() => this.finishClose(), 0);
            return;
        }
        this._closed = false;
        this._started = true;

        let x = cc.winSize.width * 0.5 + this.bg.width * 0.5;
        this.bg.x = x;

        this.rounds_sp.active = false;

        this.levelLabel.string = `${this.viewData.level}`;

        const levelRequiremnt = FrameSDK.getFirstRedeemRequirement().rdm_1;
        this.tips1.string = `skey_078??&value1==<color= #FCFF0F>${Math.max(0, levelRequiremnt - (FrameSDK.frameData.gameData.passLevel))}</c>`;
        this.rtx_tips1.string = `<img src="dollar4" offset=-3/>${FrameSDK.convertCoinToStr(this.viewData.currentBonus)}≈<color= #7AF465>${FrameSDK.convertCoinToStr(this.viewData.currentBonus, true)}</c>`;

        FrameSDK.playEffect("rewardshow");

        cc.tween(this.bg).to(0.7, {x: 0}, {
            easing: "backOut"
        }).delay(1).to(0.7, {x: -x}, {
            easing: "backIn"
        }).call(() => {
            FrameSDK.closeEffect(this, () => this.finishClose());
        }).start();
    }

    protected onEnable(): void {
        if (!this._started) {
            return;
        }
        FrameSDK.openEffect(this);
        const paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((node, index) => {
            node.getComponent(PaymentItem).paymentID = paymentIDs[index] ?? 0;
        });
    }

    onDestroy() {
        this.finishClose();
    }
}
