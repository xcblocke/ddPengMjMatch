import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_Luck extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    // @property(sp.Skeleton)
    // titleSkeleton: sp.Skeleton = null;

    // @property(sp.Skeleton)
    // bodySkeleton: sp.Skeleton = null;
    @property(sp.Skeleton)
    card1Skeleton: sp.Skeleton = null;
    @property(sp.Skeleton)
    card2Skeleton: sp.Skeleton = null;
    @property(cc.Node)
    allNode: cc.Node = null;

    @property(cc.Label)
    lv: cc.Label = null;



    viewData: { closeCB: () => void, noInters: boolean } = null;
    private _close_target: cc.Node = null;


    onLoad() {
        var e = this;
        // this.allNode.active = false;
        if (!this.panel_window || !cc.isValid(this.panel_window)) {
            this.panel_window = cc.find("panel_window", this.node);
        }


    }

    onEnable() {

        FrameSDK.logGameEvent("sdymjmatch_report_new", {
            object_action: "show",
            object_name: "new_17"
        }, true);



        FrameSDK.openEffect(this);
        // FrameSDK.playEffect("rewardshow");
        FrameSDK.playEffect("luckylevel");

        FrameSDK.frameData.sdkFuc.ppEvent("freeShow");
        this.node.opacity = 255;

        // if (this.bodySkeleton) {
        //     this.bodySkeleton.setAnimation(0, "6start", false);
        //     this.bodySkeleton.addAnimation(0, "6loop", true);
        //     this.bodySkeleton.setCompleteListener(() => {
        //         this.allNode.active = true;

        //     })
        //     // if(this.card1Skeleton){
        //     //     this.card1Skeleton.setAnimation(0, "1start", false);
        //     //     this.card1Skeleton.addAnimation(0, "1loop", true);
        //     // }
        //     if (this.card2Skeleton) {
        //         this.card2Skeleton.setAnimation(0, "2_bian", false);
        //         this.card2Skeleton.addAnimation(0, "3_loop", true);
        //     }
        // }
        // if (this.titleSkeleton) {
        //     this.titleSkeleton.setAnimation(0, "start", false);
        //     this.titleSkeleton.addAnimation(0, "loop", true);
        // }


    }



    @CLICKLOCK()
    click_Common() {
        FrameSDK.playEffect("click");
        this.close();
    }


    hideTime = 0;

    private _finishClose(call?: () => void) {
        call && call();
        this.viewData?.closeCB?.();
        this.node.destroy();
    }

    private _closeToRedeemBoard(call?: () => void) {
        if (!this.panel_window || !cc.isValid(this.panel_window) || !this._close_target || !cc.isValid(this._close_target)) {
            FrameSDK.closeEffect(this, () => {
                this.viewData?.closeCB?.();
                call && call();
            });
            return;
        }

        const self: any = this as any;

        try {
            self.black_sprite && self.black_sprite.node.stopAllActions && self.black_sprite.node.stopAllActions();
            this.panel_window.stopAllActions();
        } catch { }

        try {
            if (self.noTouch) self.noTouch.node.active = true;
        } catch { }

        try {
            self.black_sprite && cc.tween(self.black_sprite.node).to(0.35, {
                opacity: 0
            }).start();
        } catch { }

        let point = this._close_target.convertToWorldSpaceAR(cc.v2());
        point = this.panel_window.parent.convertToNodeSpaceAR(point);
        cc.tween(this.panel_window).parallel(
            cc.tween().to(1, {
                position: cc.v3(point.x, point.y, 0)
            }, {
                easing: "sineInOut"
            }),
            cc.tween().to(1, {
                scale: 0.1
            }, {
                easing: "quadIn"
            }),
            cc.tween().to(1, {
                opacity: 100
            }, {
                easing: "sineIn"
            })
        ).call(() => {
            this._finishClose(call);
            cc.director.emit("showBackHand");
        }).start();
    }

    close(e = null) {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            const rdmLevel = cc.find("Canvas/frameNode/Frame/popUpNode/RDM_Level");
            if (rdmLevel && cc.isValid(rdmLevel)) {
                const closeTarget = cc.find("Canvas/frameNode/Frame/popUpNode/RDM_Level/panel_window/word_redeem_board2");
                this._close_target = closeTarget && cc.isValid(closeTarget) ? closeTarget : null;
            } else {
                this._close_target = null;
            }
            if (this._close_target) {
                this._closeToRedeemBoard(e || undefined);
            } else {
                FrameSDK.closeEffect(this, () => {
                    this.viewData?.closeCB?.();
                    e && e();
                });
            }
        }
    }

}