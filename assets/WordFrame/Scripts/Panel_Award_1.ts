import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_1 extends cc.Component {

    @property(sp.Skeleton)
    contentSkeleton: sp.Skeleton = null;

    @property(cc.Label)
    label_coin: cc.Label = null;

    @property(cc.Node)
    multiplierDisplay: cc.Node = null;

    @property(cc.Node)
    adBannerButton: cc.Node = null;

    @property(cc.Label)
    adFrequencyCounter: cc.Label = null;

    @property(cc.Node)
    adBadgeIcon: cc.Node = null;

    @property(cc.Node)
    commonActionButton: cc.Node = null;

    @property(sp.Skeleton)
    ribbonSkeleton: sp.Skeleton = null;

    @property(cc.Node)
    lv_proNode: cc.Node = null;

    @property(cc.ParticleSystem)
    gameOverDollarParticle: cc.ParticleSystem = null;

    getYCoin = 0;

    viewData: { closeCB: () => void, noInters: boolean } = null;

    adData: { isFree: boolean, ml: number, range: number[] } = null;

    isInters: boolean = true;

    onLoad() {
        var e = this;
        this.adBannerButton.on(cc.Node.EventType.TOUCH_END, () => {
            e.click_AD();
        }, this);
        this.commonActionButton.on(cc.Node.EventType.TOUCH_END, () => {
            e.click_Common();
        });

        if (!this.gameOverDollarParticle) {
            const dollarNode = cc.find("game_over_dollar", this.node);
            if (dollarNode) {
                this.gameOverDollarParticle = dollarNode.getComponent(cc.ParticleSystem);
            }
        }
    }

    
    private restartGameOverDollarParticle() {
        if (this.gameOverDollarParticle) {
            this.gameOverDollarParticle.resetSystem();
        }
    }


    onEnable() {
        this.adData = FrameData.getOutputConfig(true);
        this.getYCoin = FrameData.getCoinOutNum("ad");
        const free = FrameData.getCoinOutNum("free");

        
        FrameSDK.logGameEvent("sdymjmatch_game_rew", {
            object_action: "show",
            object_name: `rew_show`,
            object_notes: `reward_1`
        });

        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeShow" : "popupShow");

        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");

        this.node.opacity = 255;

        // if (this.titleSkeleton) {
        //     this.titleSkeleton.setAnimation(0, "start", false);
        //     this.titleSkeleton.addAnimation(0, "loop", true);
        // }
        
        this.scheduleOnce(()=>{
            this.restartGameOverDollarParticle();
        },0)

        if (this.contentSkeleton) {
            this.contentSkeleton.setAnimation(0, "qiehuan", false);
            this.contentSkeleton.setCompleteListener((event)=>{
                if(event.animation.name == "qiehuan"){
                    this.contentSkeleton.setAnimation(0, "beishu", true);
                }
            });
            // this.contentSkeleton.addAnimation(0, "1loop", true);
        }

        this.multiplierDisplay.active = false;
        this.multiplierDisplay.children.forEach(node => {
            cc.Tween.stopAllByTarget(node);
            node.scale = 0;
        });

        this.label_coin.string = "+" + FrameSDK.convertCoinToStr(this.getYCoin);
        this.adFrequencyCounter.string = `x${this.adData.range[0]}~${this.adData.range[1]}`;

        this.adBadgeIcon.active = !this.adData.isFree;

        this.commonActionButton.active = false;
        this.scheduleOnce(() => {
            this.commonActionButton.active = this.adBadgeIcon.active;
        })
        this.commonActionButton.getComponentInChildren(cc.Label).string = `skey_122 ${FrameSDK.convertCoinToStr(free)}`;

        if(this.ribbonSkeleton){
            this.ribbonSkeleton.enabled = false;
        }

        //视频按钮的无广告图标
        this.adBannerButton.getChildByName("no_ad_xiao").active = this.adData.isFree;
        this.isInters = FrameSDK.isShowInters() && !this.viewData.noInters;
        this.commonActionButton.getChildByName("no_ad_xiao").active = !this.isInters;
        this.commonActionButton.x = this.isInters ? 0 : 30;

        this.lv_proNode.active = FrameSDK.frameData.gameData.isFlag;

        if (!this.adData.isFree) {
            FrameSDK.videoCompensation('exposure', 'reward_1');
        }
        if (this.isInters) {
            FrameSDK.videoCompensation('exposure', 'reward_1',true);
        }

        FrameSDK.playShakeAnim();
    }

    @CLICKLOCK(1)
    click_AD() {
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeClaim" : "claim");

        FrameSDK.logGameEvent("sdymjmatch_game_rew", {
            object_action: "show",
            object_name: `rew_ad`,
            object_notes: `reward_1`
        });

        let callBack = () => {

            this.multiplierDisplay.active = true;
            cc.Tween.stopAllByTarget(this.multiplierDisplay);

            const targetMultiplierNodes: { [multiple: number]: cc.Node } = {};
            this.multiplierDisplay.children.forEach(node => {
                const multiple = Number(node.name);
                node.scale = 0;

                if (!isNaN(multiple) && multiple <= this.adData.ml) {
                    targetMultiplierNodes[multiple] = node;
                    cc.Tween.stopAllByTarget(node);
                }
            });

            const sortedKeys = Object.keys(targetMultiplierNodes).map(value => Number(value)).sort((a, b) => a - b);
            let delayBetween = 0.2;
            let scaleTime = 0.1;
            let totalTweenTime = delayBetween * (sortedKeys.length - 1) + scaleTime;

            if (sortedKeys.length <= 0) {
                totalTweenTime = 0;
            } else if (totalTweenTime > 2) {
                scaleTime = Math.max(0.1, totalTweenTime - delayBetween * (sortedKeys.length - 1));
                totalTweenTime = delayBetween * (sortedKeys.length - 1) + scaleTime;
            }

            this.label_coin.string = "+" + FrameSDK.convertCoinToStr(this.getYCoin * this.adData.ml);
            let change = (this.getYCoin * this.adData.ml) - this.getYCoin;
            let data: { num: number } = { num: this.getYCoin };
            cc.tween(data).to(totalTweenTime + 0.2, { num: data.num }, {
                progress: (start, end, current, ratio) => {
                    let num = start + (end - start) * ratio;
                    cc.isValid(this.node) && (this.label_coin.string = "+" + FrameSDK.convertCoinToStr(num));
                    return num;
                }
            }).call(() => {
                if (cc.isValid(this.node)) {
                    this.label_coin.string = "+" + FrameSDK.convertCoinToStr(this.getYCoin * this.adData.ml);
                }
            }).start();

            sortedKeys.forEach((multiple, index) => {
                const node = targetMultiplierNodes[multiple];
                node.scale = 0;

                cc.tween(node)
                    .delay(delayBetween * index)
                    .set({ scale: 1 })
                    .to(0.2, { scale: 3 })
                    .to(0.1, { scale: 1 })
                    .call(() => FrameSDK.playEffect("rate_show"))
                    .start();
            });

            cc.tween(this.multiplierDisplay)
                .delay(totalTweenTime + 0.2)
                .call(() => {
                    if(this.ribbonSkeleton){
                        this.ribbonSkeleton.enabled = true;
                        this.ribbonSkeleton.setAnimation(0, "caidai", false);   

                    }

                    
                    FrameSDK.playEffect("pool_cashdone");
                })
                .delay(1)
                .call(() => {
                    FrameSDK.addCoin(this.getYCoin * this.adData.ml, this.adData.isFree ? 0 : FrameData.getCoinOutNum("charity"), this.adData.isFree ? 0 : 1, this.viewData?.closeCB);
                    FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeCollected" : "collected");
                    this.close();
                })
                .start();
        };

        this["noTouch"].node.active = true;
        console.log("adData.isFree===========11111",this.adData.isFree, this.adData);
        if(cc.sys.isBrowser){
            callBack();
            return;
        }
        if (this.adData.isFree) {
            callBack();
        } else {
            FrameSDK.openVideo(callBack, () => {
                this["noTouch"].node.active = false;
                console.log("video fail===========1");
            }, () => {
                FrameSDK.logGameEvent("sdymjmatch_game_ad", {
                    object_action: "show",
                    object_name: `reward_1`,
                    object_notes: `video`
                });
            }, "reward_1");
        }
    }

    @CLICKLOCK()
    click_Common() {

        // FrameSDK.frameData.gameData.passLevel >= 5 && (FrameData.saveData.skipADCount += 1);
        // let isInters = FrameData.saveData.skipADCount >= FrameData.FRAME_CONF.forceVideo;
        this["noTouch"].node.active = true;
        // let isInters = FrameSDK.isShowInters() && !this.viewData.noInters;

        FrameSDK.logGameEvent("sdymjmatch_game_rew", {
            object_action: "show",
            object_name: `rew_free`,
            object_notes: `reward_1`
        });

        let callBack = () => {
            FrameSDK.addCoin(FrameData.getCoinOutNum("free"), this.isInters ? FrameData.getCoinOutNum("charity") : 0, 0, this.viewData?.closeCB);
            this.close();
        };
        if (this.isInters) {
            FrameSDK.logGameEvent("sdymjmatch_game_ad", {
                object_action: "show",
                object_name: `reward_1`,
                object_notes: `inter`
            });
            FrameSDK.openInters(callBack, () => { }, "reward_1", () => {
                this["noTouch"].node.active = false;
            });
        } else {
            callBack();
        }
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