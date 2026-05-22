import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_6 extends cc.Component {

    // @property(sp.Skeleton)
    // titleSkeleton: sp.Skeleton = null;
    @property(sp.Skeleton)
    yanhua: sp.Skeleton = null;
    // @property(sp.Skeleton)
    // bodySkeleton: sp.Skeleton = null;
    // @property(cc.Node)
    // allNode: cc.Node = null;

    @property(sp.Skeleton)
    bgSkeleton: sp.Skeleton = null;


    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    label_coin: cc.Label = null;

    @property(cc.Node)
    adBannerButton: cc.Node = null;

    @property(cc.Label)
    adFrequencyCounter: cc.Label = null;

    @property(cc.Node)
    adBadgeIcon: cc.Node = null;

    @property(cc.Node)
    commonActionButton: cc.Node = null;

    // @property(sp.Skeleton)
    // ribbonSkeleton: sp.Skeleton = null;

    @property(cc.Node)
    lv_proNode: cc.Node = null;

    viewData: { closeCB: () => void, noInters: boolean } = null;

    adData: {  num: number[]; reward: number;  } = null;

    private _rewardClaimed = false;

    /**
     * 领取奖励：先关闭本面板 → 再恭喜弹窗(若有) → 飞币 → 评星 → 解锁弹窗链。
     * viewData.closeCB 仅在整条奖励链路结束后调用，不在此处随面板关闭触发。
     */
    private settleRewardThenExit(coinAmount: number, playPoolFx = false) {
        if (this._rewardClaimed) {
            return;
        }
        this._rewardClaimed = true;
        this["noTouch"].node.active = true;

        const settlementCloseCB = this.viewData?.closeCB;

        const afterAward6Closed = () => {
            FrameSDK.addCoin(coinAmount, 0, 0, () => {
                FrameSDK.openRating(() => {
                    settlementCloseCB?.();
                });
            });
        };

        const closeAward6ThenContinue = () => {
            this.close(afterAward6Closed);
        };

        if (playPoolFx) {
            cc.tween(this.node)
                .delay(0.2)
                .call(() => {
                    FrameSDK.playEffect("pool_cashdone");
                })
                .delay(1)
                .call(closeAward6ThenContinue)
                .start();
        } else {
            closeAward6ThenContinue();
        }
    }

    onLoad() {
        var e = this;
        this.adBannerButton.on(cc.Node.EventType.TOUCH_END, () => {
            e.click_AD();
        }, this);
        this.commonActionButton.on(cc.Node.EventType.TOUCH_END, () => {
            e.click_Common();
        });

        this.lv.string = ""+ (FrameSDK.frameData.gameData.passLevel+1);
        // this.allNode.active = false;
        // this.yanhua.setCompleteListener(()=>{
        //     this.yanhua.node.active = false;
        //     // cc.tween(this.titleSkeleton.node).to(0.2,{y:422}).call(()=>{
        //     //     this.allNode.active = true;
        //     // }).start();
        // })
        // this.allNode.active = true;

        this.lv_proNode.active = FrameSDK.frameData.gameData.isFlag;
        this.playAnim();
    }

    playAnim() {
        if (this.bgSkeleton) {
            this.bgSkeleton.setAnimation(0, "start", false);
            this.bgSkeleton.setCompleteListener((event)=>{
                if(event.animation.name == "start"){
                    this.bgSkeleton.setAnimation(0, "loop", true);
                }
            });
        }
    }

    onEnable() {
        this.adData = FrameData.getCoinOutNum("box");
        const free = FrameData.getCoinOutNum("free");

        FrameSDK.logGameEvent("sdymjmatch_report_new", {
            object_action: "show",
            object_name: "new_16"
        }, true);
        FrameSDK.logGameEvent("sdymjmatch_report_rew", {
            object_action: "show",
            object_name: `sup_show`,
            object_notes: `reward_6`
        });


        FrameSDK.openEffect(this);
        FrameSDK.playEffect("newbiereward_show");

        FrameSDK.frameData.sdkFuc.ppEvent("freeShow");
        this.node.opacity = 255;

        // if(this.bodySkeleton){
        //     this.bodySkeleton.setAnimation(0, "4start", false);
        //     this.bodySkeleton.addAnimation(0, "4loop", true);
        // }
        // if(this.titleSkeleton){
        //     this.titleSkeleton.setAnimation(0, "start", false);
        //     this.titleSkeleton.addAnimation(0, "loop", true);
        // }

        this.label_coin.string = "+" + FrameSDK.convertCoinToStr(this.adData.reward);

        this.adBadgeIcon.active = false;

        this.commonActionButton.active = false;
        this.scheduleOnce(() => {
            this.commonActionButton.active = this.adBadgeIcon.active;
        })
        this.commonActionButton.getComponentInChildren(cc.Label).string = `skey_034 ${FrameSDK.convertCoinToStr(free)}`;

        // this.ribbonSkeleton.enabled = false;

        this.adBannerButton.getChildByName("no_ad_xiao").active = true; 
    }

    @CLICKLOCK(1)
    click_AD() {
        // if(!this.adData.isFree){
        //     FrameSDK.videoCompensation('exposure', 'reward_6');
        // }
        // FrameSDK.logGameEvent("sdymjmatch_report_rew", {
        //     object_action: "show",
        //     object_name: `rew_ad`,
        //     object_notes: `reward_6`
        // });

        FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
        FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
        this.settleRewardThenExit(this.adData.reward, true);
    }

    @CLICKLOCK()
    click_Common() {

        // FrameSDK.frameData.gameData.passLevel >= 5 && (FrameData.saveData.skipADCount += 1);
        // let isInters = FrameData.saveData.skipADCount >= FrameData.FRAME_CONF.forceVideo;
        this["noTouch"].node.active = true;
        let isInters = false;//FrameSDK.isShowInters() && !this.viewData.noInters;//免费奖励不要插屏了

        FrameSDK.logGameEvent("sdymjmatch_report_rew", {
            object_action: "show",
            object_name: `sup_free`,
            object_notes: `reward_6`
        });
        

        this.settleRewardThenExit(FrameData.getCoinOutNum("free"), false);
    }


    hideTime = 0;

    close(e = null) {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, e);
        }
    }

}