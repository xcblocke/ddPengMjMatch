import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_CoinTips extends cc.Component {

    @property(cc.Node)
    animationNode: cc.Node = null;

    @property(cc.Label)
    labelCoin: cc.Label = null;
    @property(cc.Label)
    label_yue:cc.Label = null;

    @property(cc.Label)
    labelCoin2: cc.Label = null;

    @property(cc.RichText)
    levelRequirement: cc.RichText = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { num: number, charityNum: number, closeCB: () => void } = null;
    black_sprite: cc.Sprite = null;

    protected onLoad(): void {
        let x = cc.winSize.width * 0.5 + this.animationNode.width * 0.5;
        this.animationNode.x = x;

        cc.tween(this.animationNode).to(0.7, {x: 0}, {
            easing: "backOut"
        }).call(() => {
            this.black_sprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
        }).start();
    }

    protected onEnable(): void {
        if (FrameSDK.frameData.gameData.noProfitAd) {
            this.viewData.charityNum = 0;
        }

        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");

        this.labelCoin.node.parent.active = this.viewData.num > 0;
        this.labelCoin.string = `+${FrameSDK.convertCoinToStr(this.viewData.num)}`;
        this.label_yue.string =  `≈${FrameSDK.convertCoinToStr(this.viewData.num,true)}`
        this.labelCoin2.string = `+${FrameSDK.convertCharityToStr(this.viewData.charityNum)}`;
        this.labelCoin2.node.parent.active = this.viewData.charityNum > 0;

        let redeemRequirement = FrameSDK.getFirstRedeemRequirement().rdm_1;
        if (FrameSDK.frameData.gameData.passLevel < redeemRequirement) {
            const passLevel = FrameSDK.frameData.gameData.passLevel;
            if(passLevel <= 0){
                redeemRequirement = 20
            }
            const rate = FrameData.FRAME_CONF.RedeemRateConfig[0];
            this.levelRequirement.string = `skey_097??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>${FrameSDK.convertCoinToStr(rate)}</c>&value2==<color= #8AFF77>${FrameSDK.convertCoinToStr(rate, true)}</c>&value3==<color= #FDFF48>${redeemRequirement}</c>`;
        } else {
            this.levelRequirement.string = ``;
        }
    }

    onDisable() {
        var e, t;
        null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
    }


    hideTime = 0;

    onTouchCloseTips() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            let x = cc.winSize.width * 0.5 + this.animationNode.width * 0.5;
            cc.Tween.stopAllByTarget(this.animationNode);
            cc.tween(this.animationNode).to(0.7, {x: -x}, {
                easing: "backIn"
            }).call(() => {
                FrameSDK.closeEffect(this, null);
            }).start();
        }
    }

    // update (dt) {}
}
