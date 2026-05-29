import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Activity extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    // @property(sp.Skeleton)
    // piggySkeleton: sp.Skeleton = null;
    // @property(sp.Skeleton)
    // piggySkeleton2: sp.Skeleton = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Label)
    countdownLabel: cc.Label = null;
    @property(cc.Label)
    yueLabel: cc.Label = null;

    @property(cc.Sprite)
    buttonSprite: cc.Sprite = null;

    @property(cc.Node)
    state2: cc.Node = null;
    @property(cc.Node)
    state3: cc.Node = null;
    @property(cc.Node)
    state4: cc.Node = null;

    @property(cc.RichText)
    tips: cc.RichText = null;
    @property(cc.RichText)
    tips2: cc.RichText = null;

    @property(cc.Label)
    buttonLabel: cc.Label = null;

    @property(cc.Node)
    button: cc.Node = null;
    @property(cc.Node)
    button3: cc.Node = null;
    @property(cc.Node)
    button4: cc.Node = null;

    @property(cc.Label)
    rew_Label: cc.Label = null;

    @property(cc.Node)
    flyTargetNode: cc.Node = null;

    @property(cc.ParticleSystem)
    gameDollarParticle: cc.ParticleSystem = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { closeCB: () => void } = null;

    static coinTarget: cc.Node = null;
    private _close_target: cc.Node = null;
    private _chainCloseDone = false;

    private _invokeChainCloseCB() {
        if (this._chainCloseDone) {
            return;
        }
        const cb = this.viewData?.closeCB;
        if (!cb) {
            return;
        }
        this._chainCloseDone = true;
        if (this.viewData) {
            this.viewData.closeCB = null;
        }
        cb();
    }

    static startActivity(closeCB?: () => void) {
        if (FrameData.saveData.activity) {
            FrameSDK.openWindow("Panel_Activity", { closeCB: closeCB });
        } else if (FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.bankLevel)) {
            // FrameSDK.openWindow("Panel_ActivityGuide", {
            //     type: 1,
            //     logoType: 'bank',
            //     dtime: 2.5,
            //     text: `<outline color=#215B67 width=2><b>skey_065</b></outline>??&value1==<color = #FFF95C><size=36>1</size></c>>&value2==<img src="dollar4"/><color = #86FF04><size=36>${FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num)}</size></c>`,
            //     closeCB: () => {
            //         FrameSDK.openWindow("Panel_Activity", { closeCB: closeCB });
            //     }
            // });
            FrameSDK.openWindow("Panel_Activity", { closeCB: closeCB });
        } else {
            closeCB?.();
        }
    }

    private restartGameDollarParticle() {
        if (this.gameDollarParticle) {
            this.gameDollarParticle.resetSystem();
        }
    }

    static isActivity() {
        return FrameData.saveData.activity && 0 == FrameData.saveData.activity.state && FrameSDK.now < FrameData.saveData.activity.time;
    }

    static addCoin(num: number) {
        if (Panel_Activity.isActivity()) {
            FrameData.saveData.activity.coin += num;
            if (FrameData.saveData.activity.coin >= FrameData.FRAME_CONF.PiggyConfig.num) {
                FrameData.saveData.activity.coin = FrameData.FRAME_CONF.PiggyConfig.num;
                // FrameData.saveData.activity.state = 1;
            } else if (FrameData.saveData.activity.coin < 0) {
                FrameData.saveData.activity.coin = 0;
            }
            cc.director.emit("UPDATA_ACTIVITY_COIN", num);
        }
    }

    protected onLoad(): void {
        
    }

    showAnim() {

        if(this.panel_window && cc.isValid(this.panel_window)) {
            this.node.opacity = 255;
            this.panel_window.scale = 0.1;
            this.panel_window.opacity = 0;
            cc.tween(this.panel_window)
                .to(0.25, {
                scale: 1,
                opacity: 255,
                position:cc.v3(0,0)
            }, {
                easing: "backOut"
            })
            .call(() => {
                this.restartGameDollarParticle();
            })
            .start();
        }
    }

    getCoin() {
        const act = FrameData.saveData.activity;
        if (!act) return 0;
        const coin = Math.max(0, Math.floor(Number(act.coin) || 0));
        if (coin <= 0) {
            return 0;
        }
        return coin;
    }

    private syncActivityWhenTimeUp(): void {
        const act = FrameData.saveData.activity;
        if (!act || act.state !== 0) return;
        if (FrameSDK.now < act.time) return;
        const coin = Math.max(0, Math.floor(Number(act.coin) || 0));
        if (coin <= 0) {
            this.resetActive();
            return;
        }
        act.state = 1;
        // this.playPiggyAnimByState(1);
        this.unschedule(this.updateTime);
    }

    protected onEnable(): void {
        this._chainCloseDone = false;
        this.syncActivityWhenTimeUp();
        FrameSDK.playEffect("piggybank_show");
        this._close_target = Panel_Activity.coinTarget;


        if(this.flyTargetNode && cc.isValid(this.flyTargetNode)) {
            this.flyTargetNode.active = false;
        }

        if (FrameData.saveData.activity == null) {
            // 次日可领取：倒计时对齐到“下一天 00:00”
            const nowMs = FrameSDK.now * 1000;
            const nextMidnight = new Date(nowMs);
            nextMidnight.setHours(24, 0, 0, 0);
            const nextMidnightSec = Math.floor(nextMidnight.getTime() / 1000);
            FrameData.saveData.activity = {
                state: 0,
                coin: 0,
                time: nextMidnightSec,
                lun: 1
            };

            FrameSDK.logGameEvent('sdymjmatch_game_act', {
                object_action: 'show',
                object_name: `pig_start`,
                object_notes: FrameData.saveData.activity.lun + "",
            }, true);
        }

        cc.director.emit("UPDATA_ACTIVITY");
        this.updateUi();
        this.node.opacity = 0;
        this.scheduleOnce(() => {
            this.showAnim();
        }, 0);

        console.log("FrameData.saveData.activity.time===========11111", FrameData.saveData.activity.time);
        console.log("FrameSDK.now===========22222", FrameSDK.now);
        console.log("FrameSDK.now < FrameData.saveData.activity.time===========33333", FrameSDK.now < FrameData.saveData.activity.time);

        if (FrameSDK.now < FrameData.saveData.activity.time) {
            this.schedule(this.updateTime);
        }
    }

    onDisable() {
        cc.director.emit("UPDATA_ACTIVITY");
        this._invokeChainCloseCB();
    }

    updateUi() {
        let data = FrameData.saveData.activity;
        if (!data) {
            return;
        }
        let conf = FrameData.FRAME_CONF.PiggyConfig;
        this.state1.active = data.state == 0;
        this.state2.active = data.state == 1;
        // 旧逻辑的 state3/state4（领取后/失败）不再使用
        this.state3.active = false;
        this.state4.active = false;
        this.button.active = data.state == 0 || data.state == 1;
        this.button3.active = false;
        this.button4.active = false;
        // 显示当前已收集金额（收集到多少就领多少）
        this.rew_Label.string = FrameSDK.convertCoinToStr(Math.max(0, Math.floor(Number(data.coin) || 0)));
        this.yueLabel.string = `≈${FrameSDK.convertCoinToStr(Math.max(0, Math.floor(Number(data.coin) || 0)),true)}`;
        // state=0（收集中）按钮置灰；state=1（次日可领）按钮高亮
        this.buttonSprite.setMaterial(0, cc.Material.getBuiltinMaterial(data.state == 0 ? "2d-gray-sprite" : "2d-sprite"));
        if (data.state == 0) {
            cc.find("load2", this.state1).active = true;
            cc.find("load2/label", this.state1).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(data.coin) + "/" + FrameSDK.convertCoinToStr(conf.num);
            cc.find("load2/load1", this.state1).getComponent(cc.Sprite).fillRange = data.coin / conf.num;
            this.tips.string = `skey_113??&value1==<img src="dollar4" offset=-5/> <size=38><color = #a52a1c>${FrameSDK.convertCoinToStr(conf.num)}</c></size>`;
            this.buttonLabel.string = `skey_061`;
        } else if (data.state == 1) {
            // cc.find("Layout/label", this.state2).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(data.coin);
            this.tips2.string = `skey_115??&value1==<img src="dollar4" offset=-5/> <size=38><color = #a52a1c>${FrameSDK.convertCoinToStr(data.coin)}</c></size>`;
            this.buttonLabel.string = `skey_035`;
        }
    }

    updateTime() {
        if (FrameData.saveData.activity) {
            let time = FrameData.saveData.activity.time - FrameSDK.now;
            if (time > 0) {
                // let countdown = FrameSDK.formatSeconds3(time);
                // this.countdownLabel.string = `${countdown.hour}:${countdown.minute}:${countdown.second}`
                let countDown = FrameSDK.formatSeconds(time);
                let list = countDown.split("")
                this.countdownLabel.node.parent.active = this.getCoin() > 0;
                this.countdownLabel.node.children.forEach((child,index) => {
                    child.getComponent(cc.Label).string = list[index];
                });
            } else {
                FrameSDK.logGameEvent('sdymjmatch_game_act', {
                    object_action: 'show',
                    object_name: `pig_time_end`,
                    object_notes: FrameData.saveData.activity.lun + "",
                }, true);

                const coin = Math.max(0, Math.floor(Number(FrameData.saveData.activity.coin) || 0));
                // 到点如果没攒到钱：直接重置开始新一轮（无需用户手动点击）
                if (coin <= 0) {
                    this.unschedule(this.updateTime);
                    this.resetActive();
                    return;
                }

                // 次日可领取：到点直接进入可领取态（收集到多少就领多少）
                FrameData.saveData.activity.state = 1;
                this.updateUi();
                this.unschedule(this.updateTime);
            }
        } else {
            this.unschedule(this.updateTime);
        }
    }

    onBtnEvent(target, data: string) {
        if (data == "0") {
            this.close();
        } else if (data == "1") {
            if (FrameData.saveData.activity.state == 0) {
                this.close();
            } else if (FrameData.saveData.activity.state == 1) {
                const coin = Math.max(0, Math.floor(Number(FrameData.saveData.activity.coin) || 0));
                if (coin <= 0) {
                    // 没攒到钱：直接进入下一轮
                    this.resetActive();
                    return;
                }
                FrameSDK.logGameEvent('sdymjmatch_game_act', {
                    object_action: 'show',
                    object_name: `pig_get`,
                    object_notes: FrameData.saveData.activity.lun + "",
                }, true);

                // 领取：收集到多少就领多少，领完后直接重置开始新一轮
                if(this.flyTargetNode && cc.isValid(this.flyTargetNode)) {
                    this.flyTargetNode.active = true;
                }
                FrameSDK.addCoin(coin, 0, 0, () => {
                    this.resetActive()
                    if(this.flyTargetNode && cc.isValid(this.flyTargetNode)) {
                        this.flyTargetNode.active = false;
                    }
                } );
                // FrameData.saveData.activity = <any>0;
                // this.close();
            }
        } else if (data == "2") {
            this.resetActive();
            //  this.close();
        }
    }

    onTestEvent(target, data: string) {
        if (data == "0") {
            FrameData.saveData.activity.time = FrameSDK.now + 1;
        } else if (data == "1") {
            Panel_Activity.addCoin(FrameData.FRAME_CONF.PiggyConfig.num);
            this.updateUi();
        } else if (data == "2") {
            // 测试切天：直接模拟“到次日可领取”
            if (FrameData.saveData.activity) {
                FrameData.saveData.activity.time = FrameSDK.now - 1;
                FrameData.saveData.activity.state = 1;
            }
            this.unschedule(this.updateTime);
            this.updateUi();
        }
    }

    hideTime = 0;

    close() {
        FrameSDK.playEffect("click");
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, () => this._invokeChainCloseCB());
        }
    }

    resetActive() {
        //重新开始
        let lun = FrameData.saveData.activity.lun;
        FrameData.saveData.activity = null;
        if (FrameData.saveData.activity == null) {
            const nowMs = FrameSDK.now * 1000;
            const nextMidnight = new Date(nowMs);
            nextMidnight.setHours(24, 0, 0, 0);
            const nextMidnightSec = Math.floor(nextMidnight.getTime() / 1000);
            FrameData.saveData.activity = {
                state: 0,
                coin: 0,
                time: nextMidnightSec,
                lun: lun + 1
            };
        }
        FrameSDK.logGameEvent('sdymjmatch_game_act', {
            object_action: 'show',
            object_name: `pig_start`,
            object_notes: FrameData.saveData.activity.lun + "",
        }, true);
        this.unschedule(this.updateTime);
        this.schedule(this.updateTime);
        this.updateUi();
        cc.director.emit("UPDATA_ACTIVITY");
    }
}
