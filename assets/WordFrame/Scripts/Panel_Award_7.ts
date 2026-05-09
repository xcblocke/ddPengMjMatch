import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_7 extends cc.Component {

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Label)
    bonusLabel1: cc.Label = null;

    @property(cc.Node)
    adActionButton1: cc.Node = null;

    @property(cc.Node)
    adIcon1: cc.Node = null;

    @property(cc.Node)
    commonActionButton1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Node)
    externalRootNode: cc.Node = null;

    @property(cc.Label)
    bonusLabel2: cc.Label = null;

    @property(cc.Node)
    adActionButton2: cc.Node = null;

    @property(cc.Node)
    adIcon2: cc.Node = null;

    @property(cc.Node)
    commonActionButton2: cc.Node = null;

    @property(sp.Skeleton)
    titleSkeleton1: sp.Skeleton = null;

    @property(sp.Skeleton)
    titleSkeleton2: sp.Skeleton = null;

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.Node)
    hand: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { bonus: number, freeBonus: number, externalNode?: cc.Node, param?: any, closeCB?: () => void } = null;
    isTouch = true;
    numRanking = {};

    protected onLoad(): void {
        this.adActionButton1.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
        this.adActionButton2.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
        this.commonActionButton1.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
        this.commonActionButton2.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
    }

    protected onEnable(): void {
        FrameSDK.openEffect(this, { opacity: 240 });
        FrameSDK.playEffect("rewardshow");

        FrameSDK.frameData.sdkFuc.ppEvent('popupShow');
        const shouldWatchAd = (this.state1.active && this.adIcon1.active) || (this.state2.active && this.adIcon2.active);
        if(!shouldWatchAd){
            FrameSDK.videoCompensation('exposure', 'reward_sup');
        }
        FrameSDK.logGameEvent('sdywords_game_rew', {
            object_action: 'show',
            object_name: `sup_show`,
        });

        this.externalRootNode.removeAllChildren();

        if (this.viewData.externalNode) {
            this.state1.active = false;
            this.state2.active = true;
            this.externalRootNode.addChild(this.viewData.externalNode);
            this.titleSkeleton2.setAnimation(0, "start", false);
            this.titleSkeleton2.addAnimation(0, "loop", true);
        } else {
            this.state1.active = true;
            this.state2.active = false;
            this.titleSkeleton1.setAnimation(0, "start", false);
            this.titleSkeleton1.addAnimation(0, "loop", true);
        }

        this.bonusLabel1.string = `+${FrameSDK.convertCoinToStr(this.viewData.bonus)}`;
        this.bonusLabel2.string = `${FrameSDK.convertCoinToStr(this.viewData.bonus)}`;

        this.adIcon1.active = !FrameSDK.frameData.gameData.noProfitAd;
        this.adIcon2.active = !FrameSDK.frameData.gameData.noProfitAd;

        this.commonActionButton1.active = !FrameSDK.frameData.gameData.noProfitAd;
        this.commonActionButton2.active = !FrameSDK.frameData.gameData.noProfitAd;
        this.commonActionButton1.getComponentInChildren(cc.Label).string = `skey_122 ${FrameSDK.convertCoinToStr(this.viewData.freeBonus)}`;
        this.commonActionButton2.getComponentInChildren(cc.Label).string = `skey_122 ${FrameSDK.convertCoinToStr(this.viewData.freeBonus)}`;

        if (this.state2.active) {
            if (FrameData.saveData.freeSuperAward) {
                FrameData.saveData.freeSuperAward = false;

                this.adIcon2.active = false;
                this.commonActionButton2.active = false;

                this.guide.active = true;
                this.hand.active = true;
            } else {
                this.guide.active = false;
                this.hand.active = false;
            }
        }
    }

    onBtnEvent() {
        if (!this.isTouch) return;

        this.isTouch = false;

        const shouldWatchAd = (this.state1.active && this.adIcon1.active) || (this.state2.active && this.adIcon2.active);

        FrameSDK.frameData.sdkFuc.ppEvent(shouldWatchAd ? 'claim' : 'freeClaim');
        FrameSDK.logGameEvent('sdywords_game_rew', {
            object_action: 'show',
            object_name: `sup_ad`,
        });

        new Promise<boolean>(resolve => {
            if (shouldWatchAd) {
            FrameSDK.videoCompensation('touch', 'reward_sup');
                FrameSDK.openVideo(() => {
                    resolve(true);
                }, () => {
                    resolve(false);
                    this.isTouch = true;
                }, () => {
                    FrameSDK.logGameEvent('sdywords_game_ad', {
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
                    cc.director.emit("SUPER_AWARD", "claim", this.viewData.param);
                    this.onTouchCloseTips();
                } else {
                    this.isTouch = true;
                }
            });
    }

    click_Common() {
        if (!this.isTouch) return;

        this.isTouch = false;

        let isInters = FrameSDK.isShowInters();

        FrameSDK.logGameEvent('sdywords_game_rew', {
            object_action: 'show',
            object_name: `sup_free`,
        });

        // FrameSDK.frameData.sdkFuc.ppEvent(isInters ? 'claim' : 'freeClaim');

        let callBack = () => {
            FrameSDK.addCoin(FrameData.getCoinOutNum('free'), 0, 0, this.viewData.closeCB);
            FrameSDK.frameData.sdkFuc.ppEvent(isInters ? 'collected' : 'freeCollected');
            this.onTouchCloseTips();
        };

        if (isInters) {
            FrameSDK.videoCompensation('touch', 'reward_sup',true);
            FrameSDK.openInters(callBack, () => {
                FrameSDK.logGameEvent('sdywords_game_ad', {
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
