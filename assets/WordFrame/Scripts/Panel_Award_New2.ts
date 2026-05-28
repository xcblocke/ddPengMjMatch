import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_New2 extends cc.Component {

    // @property(sp.Skeleton)
    // titleSkeleton: sp.Skeleton = null;
    @property(cc.Node)
    panel_window: cc.Node = null;
    @property(cc.Node)
    paymentRootNode: cc.Node = null;

    @property(cc.Label)
    new_coin_label: cc.Label = null;
    @property(cc.Label)
    yue_coin_label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:
    viewData: { closeCB: () => void } = null;

    isTouch = true;
    protected onEnable(): void {
        FrameSDK.openEffect(this, { opacity: 233 });
        FrameSDK.playEffect("newbiepage_show");

        // if (this.titleSkeleton) {
        //     this.titleSkeleton.setAnimation(0, "start", false);
        //     this.titleSkeleton.addAnimation(0, "loop", true);
        // }
        this.new_coin_label.string = `${FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.OutputConfig.new)}`;
        this.yue_coin_label.string = `≈${FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.OutputConfig.new,true)}`;

        FrameSDK.logGameEvent('sdymjmatch_game_new', {
            object_action: 'show',
            object_name: 'new_3',
        }, true);
        // FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_button", "guide_start");

        const paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((node, index) => {
            node.getComponent(PaymentItem).paymentID = paymentIDs[index] ?? 0;
        });

    }

    onDisable() {
        var e, t;
        null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
    }


    btnClick(index_box) {
        if (!this.isTouch) return;
        FrameSDK.playEffect("click");
        this.isTouch = false;


        FrameSDK.logGameEvent('sdymjmatch_game_new', {
            object_action: 'show',
            object_name: 'new_4',
        }, true);

        this.playNewCoin();
    }

    playNewCoin() {
        // FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_reward", "guide_button");


        FrameSDK.logGameEvent('sdymjmatch_game_new', {
            object_action: 'show',
            object_name: 'new_5',
        }, true);

        FrameSDK.addCoin(FrameData.FRAME_CONF.OutputConfig.new, 0, 0, () => {
            Frame.ins.setGuideShow(true);
            cc.director.emit("NEW_HAND_FLY_COIN_DONE");
        });

        this.onTouchCloseTips();

    }

    hideTime = 0;

    onTouchCloseTips() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    // update (dt) {}
}
