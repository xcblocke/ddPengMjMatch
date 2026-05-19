import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_3 extends cc.Component {

    // @property(sp.Skeleton)
    // titleSkeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    contentSkeleton: sp.Skeleton = null;

    @property(cc.Label)
    label_coin: cc.Label = null;

    @property(cc.Node)
    labelRootNode: cc.Node = null;

    @property(cc.Node)
    multiplierDisplay: cc.Node = null;

    @property(cc.Node)
    pointerIndicator: cc.Node = null;

    @property(cc.Node)
    adBannerButton: cc.Node = null;

    @property(cc.Label)
    adFrequencyCounter: cc.Label = null;

    @property(cc.Node)
    commonActionButton: cc.Node = null;

    @property(cc.Node)
    sian: cc.Node = null;

    @property(cc.Node)
    adBadgeIcon: cc.Node = null;

    @property(sp.Skeleton)
    ribbonSkeleton: sp.Skeleton = null;

    @property(cc.Node)
    lv_proNode: cc.Node = null;

    adData = null;
    viewData: { closeCB: () => void } = null;

    getYCoin = 0;

    beishe: number = 1;
    speed: number = 240; // 角度/秒，180度用2秒来回一次
    timeArray: Array<number> = [];
    isInters:boolean = true;

    targetIndex: number = 0;

    onLoad() {
        var e = this;
        this.adBannerButton.on(cc.Node.EventType.TOUCH_END, () => {
            e.click_AD();
        });
        this.commonActionButton.on(cc.Node.EventType.TOUCH_END, () => {
            e.click_Common();
        });
    }

    onEnable() {
        this.adData = FrameData.getOutputConfig(false);
        this.getYCoin = FrameData.getCoinOutNum('draw');
        this.timeArray.push(...FrameData.getCoinOutNum('drawRate'));
        const free = FrameData.getCoinOutNum('free');

        
        FrameSDK.logGameEvent('sdymjmatch_report_rew', {
            object_action: 'show',
            object_name: `rew_show`,
            object_notes: `reward_3`,
        });

        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? 'freeShow' : 'popupShow');

        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");

        this.node.opacity = 255;

        if (this.contentSkeleton) {
            this.contentSkeleton.setAnimation(0, "start", false);
            this.targetIndex = 0;
            this.beishe = this.timeArray[this.targetIndex] ?? 1;
            this.updataBeiShe();
            this.contentSkeleton.setCompleteListener((event)=>{
                if(event.animation.name == "start"){
                    if(!cc.isValid(this.node) || !cc.isValid(this)){
                        return;
                    }
                    this.contentSkeleton.setAnimation(0, "loop", true);
                
                }
            });

            this.contentSkeleton.setEventListener( (trackEntry, event)=>{
                const eventName = event.data.name;
                // console.log("event===========33333",eventName);
                if(eventName == "x2"){
                    this.targetIndex = 0;
                } else if(eventName == "x3"){
                    this.targetIndex = 1;
                } else if(eventName == "x5"){
                    this.targetIndex = 2;
                }
                this.beishe = this.timeArray[this.targetIndex] ?? 1;
                this.updataBeiShe();    
            });
        }

        this.labelRootNode.children.forEach((node, index) => {
            node.getComponent(cc.Label).string = `x${this.timeArray[index] ?? 1}`;
        });

        this.multiplierDisplay.active = false;

        const cont = FrameSDK.convertCoinToStr(this.getYCoin);
        this.label_coin.string = "+" + cont;
        this.adFrequencyCounter.string = cont;

        this.adBadgeIcon.active = !this.adData.isFree;

        this.commonActionButton.active = false;
        this.scheduleOnce(()=>{
            this.commonActionButton.active = this.adBadgeIcon.active;
        })  
        this.commonActionButton.getComponentInChildren(cc.Label).string = `skey_122 ${FrameSDK.convertCoinToStr(free)}`;
        this.adBannerButton.getChildByName("no_ad_xiao").active = this.adData.isFree; 
        this.isInters = FrameSDK.isShowInters();
        this.commonActionButton.getChildByName("no_ad_xiao").active = !this.isInters;
        this.commonActionButton.x = this.isInters ? 0 : 30;

        if(this.ribbonSkeleton){
            this.ribbonSkeleton.enabled = false;
        }
        if(!this.adData.isFree){
            FrameSDK.videoCompensation('exposure', 'reward_3');
        }
        if (this.isInters) {
            FrameSDK.videoCompensation('exposure', 'reward_3',true);
        }
        this.lv_proNode.active = FrameSDK.frameData.gameData.isFlag;

        this.zhizhenAin();
    }

    zhizhenAin() {
        this.pointerIndicator.stopAllActions();
        const duration = 180 / this.speed; // 单次扫过180度所需秒数
        this.pointerIndicator.angle = -90;
        cc.tween(this.pointerIndicator)
            .to(duration, { angle: 90 })
            .to(duration, { angle: -90 })
            .union()
            .repeatForever()
            .start();
    }


   

    /**设置显示的东西 */
    setUi() {
        // 指针 angle 范围 [-90, 90]，均分为 sectorCount 个扇形区域
        const sectorCount = this.sian.childrenCount || 3;
        const angle = this.pointerIndicator.angle;
        // Cocos angle 正值=逆时针，90°视觉偏左，-90°视觉偏右，需反向映射
        // angle=90(左) → normalized=0(index 0)，angle=-90(右) → normalized=1(index 末)
        const normalized = (90 - angle) / 180;
        let index = Math.floor(normalized * sectorCount);
        index = Math.max(0, Math.min(sectorCount - 1, index));

        this.sian.children.forEach((node, i) => {
            node.active = (i === index);
        });
        this.targetIndex = index;
        this.beishe = this.timeArray[this.targetIndex] ?? 1;
        this.updataBeiShe();
    }

    updataBeiShe() {
        let str = FrameSDK.convertCoinToStr(this.beishe * this.getYCoin);
        this.adFrequencyCounter.string = str;
        this.label_coin.string = "+" + str;
    }

    @CLICKLOCK(1)
    click_AD() {
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? 'freeClaim' : 'claim');

        if(!this.adData.isFree){
            FrameSDK.videoCompensation('touch', 'reward_3');
        }
        FrameSDK.logGameEvent('sdymjmatch_report_rew', {
            object_action: 'show',
            object_name: `rew_ad`,
            object_notes: `reward_3`,
        });

        this.pointerIndicator.pauseAllActions();
        this.setUi();

        const fail = () => {
            this.pointerIndicator.resumeAllActions();
            this["noTouch"].node.active = false;
            console.log("video fail===========3");
        };

        const back = () => {
            FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? 'freeCollected' : 'collected');

            this.multiplierDisplay.active = true;
            this.multiplierDisplay.children.forEach(value => value.active = value.name == this.beishe.toString());
            this.multiplierDisplay.stopAllActions();

            cc.tween(this.multiplierDisplay)
                .to(0.2, { scale: 3 })
                .to(0.1, { scale: 1 })
                .call(() => FrameSDK.playEffect("rate_show"))
                .delay(0.2)
                .call(() => {
                    if(this.ribbonSkeleton){
                        this.ribbonSkeleton.enabled = true;
                        this.ribbonSkeleton.setAnimation(0, 'caidai', false);
                    }
                    FrameSDK.playEffect("pool_cashdone");
                })
                .delay(1)
                .call(() => {
                    FrameSDK.addCoin(this.beishe * this.getYCoin, this.adData.isFree ? 0 : FrameData.getCoinOutNum('charity'), this.adData.isFree ? 0 : 1, this.viewData?.closeCB);
                    this.close();
                })
                .start();
        };

        this["noTouch"].node.active = true;
        console.log("adData.isFree===========33333",this.adData.isFree, this.adData);
        if(cc.sys.isBrowser){
            back();
            return;
        }
        if (this.adData.isFree) {
            back();
        } else {
            FrameSDK.openVideo(back, fail, () => {
                FrameSDK.logGameEvent('sdymjmatch_report_ad', {
                    object_action: 'show',
                    object_name: `reward_3`,
                    object_notes: `video`,
                });
            },"reward_3");
        }
    }

    @CLICKLOCK()
    click_Common() {
        // FrameSDK.frameData.gameData.passLevel >= 5 && (FrameData.saveData.skipADCount += 1);
        // let isInters = FrameData.saveData.skipADCount >= FrameData.FRAME_CONF.forceVideo;
        this["noTouch"].node.active = true;

        FrameSDK.logGameEvent('sdymjmatch_report_rew', {
            object_action: 'show',
            object_name: `rew_free`,
            object_notes: `reward_3`,
        });

        // let isInters = FrameSDK.isShowInters();
        // FrameSDK.frameData.sdkFuc.ppEvent(this.isInters ? 'claim' : 'freeClaim');
        let callBack = () => {
            FrameSDK.addCoin(FrameData.getCoinOutNum('free'),  this.isInters ?FrameData.getCoinOutNum("charity") : 0, 0, this.viewData?.closeCB);
            // FrameSDK.frameData.sdkFuc.ppEvent(this.isInters ? 'collected' : 'freeCollected');
            this.close();
        };
        if (this.isInters) {
            FrameSDK.videoCompensation('touch', 'reward_3',true);
            FrameSDK.openInters(callBack, () => {
                FrameSDK.logGameEvent('sdymjmatch_report_ad', {
                    object_action: 'show',
                    object_name: `reward_3`,
                    object_notes: `inter`,
                });
            },"reward_3");
        } else {
            callBack();
        }
    }


    protected update(dt: number): void {
        // this.setUi();
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