import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_Super1 extends cc.Component {

    @property(sp.Skeleton)
    titleSkeleton1: sp.Skeleton = null;

    @property(cc.Label)
    bonusLabel1: cc.Label = null;

    @property(cc.Node)
    adActionButton1: cc.Node = null;

    @property(cc.Node)
    adIcon1: cc.Node = null;

    @property(cc.Node)
    commonActionButton1: cc.Node = null;

    @property(cc.RichText)
    tipsRichText: cc.RichText = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { bonus: number, freeBonus: number, closeCB?: () => void } = null;
    isTouch = true;
    isInters:boolean = true;

    protected onLoad(): void {
        this.adActionButton1.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
        this.commonActionButton1.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
    }

    protected onEnable(): void {
        FrameSDK.openEffect(this, { opacity: 240 });
        FrameSDK.playEffect("rewardshow");

        FrameSDK.frameData.sdkFuc.ppEvent('popupShow');

        // FrameSDK.logGameEvent('sdymjmatch_game_rew', {
        //     object_action: 'show',
        //     object_name: `sup_show`,
        // });
        
        this.titleSkeleton1.setAnimation(0, "show", false);
        this.titleSkeleton1.addAnimation(0, "idle", true);
        
        const bonus = FrameSDK.convertCoinToStr(this.viewData.bonus);
        const freeBonus = FrameSDK.convertCoinToStr(this.viewData.freeBonus);
        const adAllowed = !FrameData.getOutputConfig(false).isFree//!FrameSDK.frameData.gameData.noProfitAd;//这个没看懂这么些干嘛
        
        if(adAllowed){
            FrameSDK.videoCompensation('exposure', 'reward_sup');
        }
        this.bonusLabel1.string = `${bonus}`;
        this.adIcon1.active = adAllowed;
        this.commonActionButton1.active = adAllowed;
        this.commonActionButton1.getComponentInChildren(cc.Label).string = `skey_122 ${freeBonus}`;

        this.tipsRichText.string = `skey_064??&value1==<img src="dollar4" offset=-6/> <size=46><color = #FDE829>${bonus}</c></size>`;
        this.adActionButton1.getChildByName("no_ad_xiao").active = !adAllowed; 
        
        this.isInters = FrameSDK.isShowInters();
        this.commonActionButton1.getChildByName("noad").active = !this.isInters;
        this.commonActionButton1.x = this.isInters ? 0 : 30;
    }
    @CLICKLOCK(1)
    onBtnEvent() {
        if (!this.isTouch) return;

        this.isTouch = false;

        const shouldWatchAd = this.adIcon1.active;

        FrameSDK.frameData.sdkFuc.ppEvent(shouldWatchAd ? 'claim' : 'freeClaim');


        // FrameSDK.logGameEvent('sdymjmatch_game_rew', {
        //     object_action: 'show',
        //     object_name: `sup_ad`,
        // });

        new Promise<boolean>(resolve => {
            if (shouldWatchAd) {
                FrameSDK.videoCompensation('touch', 'reward_sup');
                FrameSDK.openVideo(() => {
                    resolve(true);
                }, () => {
                    resolve(false);
                    this.isTouch = true;
                    console.log("video fail===========5");
                }, () => {
                    FrameSDK.logGameEvent('sdymjmatch_game_ad', {
                        object_action: 'show',
                        object_name: `reward_sup`,
                        object_notes: `video`,
                    });
                },"reward_sup");
            } else {
                resolve(true);
            }
        })
            .then(result => {
                if (result) {
                    FrameSDK.frameData.sdkFuc.ppEvent(shouldWatchAd ? 'collected' : 'freeCollected');
                    FrameSDK.addCoin(this.viewData.bonus, FrameData.getCoinOutNum('charity'), 1, this.viewData.closeCB);
                    this.onTouchCloseTips();
                } else {
                    this.isTouch = true;
                }
            });
    }

    click_Common() {
        if (!this.isTouch) return;

        this.isTouch = false;

        // let isInters = FrameSDK.isShowInters();

        // FrameSDK.logGameEvent('sdymjmatch_game_rew', {
        //     object_action: 'show',
        //     object_name: `sup_free`,
        // });

        FrameSDK.frameData.sdkFuc.ppEvent(this.isInters ? 'claim' : 'freeClaim');

        let callBack = () => {
            FrameSDK.addCoin(FrameData.getCoinOutNum('free'), this.isInters ?FrameData.getCoinOutNum("charity") : 0, 0, this.viewData.closeCB);
            FrameSDK.frameData.sdkFuc.ppEvent(this.isInters ? 'collected' : 'freeCollected');
            this.onTouchCloseTips();
        };

        if (this.isInters) {
            FrameSDK.openInters(callBack, () => {
                FrameSDK.logGameEvent('sdymjmatch_game_ad', {
                    object_action: 'show',
                    object_name: `reward_sup`,
                    object_notes: `inter`,
                });
            },"reward_sup");
        } else {
            callBack();
        }
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
