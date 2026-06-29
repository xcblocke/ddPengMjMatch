import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import VideoTipsHelper from "../../Scripts/common/VideoTipsHelper";
import { gameData } from "../../Scripts/data/GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyingBonus extends cc.Component {

    private _available: boolean = false;
    private _cachedPosition1: cc.Vec3 = cc.v3();
    private _cachedPosition2: cc.Vec3 = cc.v3();

    @property(cc.Label)
    coinLab:cc.Label = null;
    @property(sp.Skeleton)
    FlySp: sp.Skeleton = null;

    protected onLoad() {
        cc.director.on('SHOW_FLYING_BONUS', this._startFly, this);
        cc.director.on('HIDE_FLYING_BONUS', this._stopFly, this);
        this.node.opacity = 0;
    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    protected onEnable(): void {
        this.coinLab.string = "+"+FrameData.FRAME_CONF.flyingBonusCoin;
        this._startFly();
    }

    private _runFlyTween(playEnterSound = false, resetPosition = false): void {
        const interval: number = 20;

        this._cachedPosition1.x = 0;
        this._cachedPosition1.y = 0;
        this._cachedPosition1.z = 0;
        this.node.parent.convertToNodeSpaceAR(this._cachedPosition1, this._cachedPosition1);

        this._cachedPosition2.x = cc.winSize.width;
        this._cachedPosition2.y = cc.winSize.height;
        this._cachedPosition2.z = 0;
        this.node.parent.convertToNodeSpaceAR(this._cachedPosition2, this._cachedPosition2);

        const startX = this._cachedPosition1.x + this.node.width * this.node.anchorX;
        const startY = this._cachedPosition2.y + this.node.height * this.node.anchorY;
        const endX = this._cachedPosition2.x - this.node.width * (1 - this.node.anchorX);
        const endY = this._cachedPosition1.y - this.node.height * (1 - this.node.anchorY);
        const verticalDistance = (endY - startY) / 3;
        const subInterval = interval / 3;

        cc.Tween.stopAllByTarget(this.node);
        const tween = cc.tween(this.node);
        if (playEnterSound) {
            tween.call(() => {
                FrameSDK.playEffect("dingdong");
                FrameSDK.videoCompensation('exposure', 'fly_sup');
            });
        }
        if (resetPosition) {
            tween.set({ x: startX, y: startY, opacity: 255 });
        } else {
            tween.set({ opacity: 255 });
        }
        tween
            .to(subInterval, { x: { value: endX, easing: 'sineInOut' }, y: startY + verticalDistance })
            .to(subInterval, { x: { value: startX, easing: 'sineInOut' }, y: startY + verticalDistance * 2 })
            .to(subInterval, { x: { value: endX, easing: 'sineInOut' }, y: endY })
            .delay(40)
            .union()
            .repeatForever()
            .start();
    }

    private _startFly(): void {
        if (!FrameSDK.frameData.gameData.isFlag) {
            return;
        }

        this.FlySp.setAnimation(0, FrameData.saveData.fly_free <= 0 ? "ad" : "free", true);
        if (!FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.flyingBonusLevel)) {
            return;
        }

        if (this._available) {
            return;
        }

        this._available = true;

        this.scheduleOnce(() => {
            FrameSDK.logGameEvent('sdymjmatch_game_rew', {
                object_action: 'show',
                object_name: 'fly_sup',
            });

            this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this);
            this._runFlyTween(true, true);
        });
    }

    private _stopFly(): void {
        this._available = false;
        this.node.opacity = 0;
        cc.Tween.stopAllByTarget(this.node);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
    }

    private _pauseFlyingForTips(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
    }

    private _resumeFlyingAfterTips(): void {
        if (!this._available) {
            return;
        }
        this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this);
    }

    private _hideForAdClaim(): void {
        this._available = false;
        cc.Tween.stopAllByTarget(this.node);
        this.node.opacity = 0;
        this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
        FrameData.saveData.flyingBonusIndex = FrameSDK.frameData.gameData.passLevel;
    }

    private _willShowVideoTips(): boolean {
        return FrameData.saveData.fly_free <= 0
            && !gameData.skipVideoTipsForRevive
            && !VideoTipsHelper.hasConfirmed();
    }

    private _onClick(): void {
        if (!this._available) {
            return;
        }

        FrameSDK.logGameEvent('sdymjmatch_game_rew', {
            object_action: 'click',
            object_name: 'fly_sup',
        });

        if (this._willShowVideoTips()) {
            this._pauseFlyingForTips();
        } else {
            this._hideForAdClaim();
        }
        this.click_AD();
    }

    private _restoreFlyingBonus() {
        if (!FrameSDK.frameData?.gameData?.isFlag) {
            return;
        }
        if (!FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.flyingBonusLevel)) {
            return;
        }
        this._available = true;
        this.node.opacity = 255;
        this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this);
        this._runFlyTween(false, true);
    }

    @CLICKLOCK(1)
    click_AD() {
        const fail = () => {
            console.log("video fail===========3");
            this._restoreFlyingBonus();
        };

        const back = () => {
            FrameSDK.addCoin(FrameData.FRAME_CONF.flyingBonusCoin, FrameData.saveData.fly_free > 0 ? 0 : FrameData.getCoinOutNum('charity'), FrameData.saveData.fly_free > 0 ? 0 : 1);
        };

        if (FrameData.saveData.fly_free > 0) {
            back();
            FrameData.saveData.fly_free--;
        } else {
            const runAd = () => {
                this._hideForAdClaim();
                FrameSDK.openVideo(back, fail, () => {
                    FrameSDK.logGameEvent('sdymjmatch_game_ad', {
                        object_action: 'show',
                        object_name: `fly_sup`,
                        object_notes: `video`,
                    });
                }, "fly_sup");
            };
            VideoTipsHelper.requestWithTips(runAd, () => {
                this._resumeFlyingAfterTips();
            }, gameData.skipVideoTipsForRevive);
        }
    }

}
