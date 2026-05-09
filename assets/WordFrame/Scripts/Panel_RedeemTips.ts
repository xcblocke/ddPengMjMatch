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

    // LIFE-CYCLE CALLBACKS:
    viewData: { level: number, currentBonus: number, closeCB?: () => void } = null;

    protected onLoad(): void {
        let x = cc.winSize.width * 0.5 + this.bg.width * 0.5;
        this.bg.x = x;

        this.rounds_sp.active = false;
        // if(this.viewData.level.toString().includes("/")){
        //     this.rounds_sp.active = true;
        // }
        // this.lv_sp.active = !this.rounds_sp.active;


        this.levelLabel.string = `${this.viewData.level}`;

        const levelRequiremnt = FrameSDK.getFirstRedeemRequirement().rdm_1;
        this.tips1.string = `<outline color=#215B67 width=2>skey_078</outline>??&value1==<color= #FFF95C>${Math.max(0, levelRequiremnt - (FrameSDK.frameData.gameData.passLevel))}</c>`;
        this.rtx_tips1.string = `<outline color=#215B67 width=2><img src="dollar4" offset=-3/>${FrameSDK.convertCoinToStr(this.viewData.currentBonus)}≈<color= #8AFF77>${FrameSDK.convertCoinToStr(this.viewData.currentBonus, true)}</c></outline>`;//`skey_079??&value1==<color= #8AFF77>${FrameSDK.convertCoinToStr(this.viewData.currentBonus, true)}</c>`;

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
        const paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((node, index) => {
            node.getComponent(PaymentItem).paymentID = paymentIDs[index] ?? 0;
        });

    }

    onDisable() {
        var e, t;
        null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
    }

    // update (dt) {}
}
