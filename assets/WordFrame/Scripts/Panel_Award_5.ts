import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_5 extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.RichText)
    tipsRichText: cc.RichText = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Node)
    externalRootNode: cc.Node = null;

    @property(cc.Node)
    boxNode: cc.Node = null;

    @property([cc.Label])
    boxBonusLabels: cc.Label[] = [];

    @property(cc.Node)
    homeButtonNode: cc.Node = null;

    @property(cc.Node)
    continueButtonNode: cc.Node = null;

    @property(cc.Sprite)
    barSprite: cc.Sprite = null;
    @property(cc.Label)
    barLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { externalNode?: cc.Node, unlockCountUpdateFunc?: (unlockCount: number) => any, superExternalNode?: cc.Node, param?: any, closeCB: (type?: 'home' | 'continue') => void } = null;
    isTouch = true;
    numRanking = {};

    protected onLoad(): void {
        if (FrameData.saveData.award5 == null || Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
            let generatePerfectSumArray = function (total, length, min) {
                // 参数校验
                if (min * length > total) throw new Error(`最小值${min}超过可分配范围`);
                if (length <= 0) throw new Error("长度必须为正整数");

                const points = new Array(length).fill(0);
                let allocatable = total - min * length;

                for (let i = 0; i < length - 1; i++) {
                    if (allocatable <= 0) {
                        points[i] = 0;
                    } else {
                        points[i] = Math.floor(Math.random() * allocatable);
                        allocatable -= points[i];
                    }
                }
                points[length - 1] = allocatable;

                points.forEach((_, index) => points[index] += min);
                return points;
            };
            const conf: { num: number[], reward: number } = <any>FrameData.getCoinOutNum('box');
            const numList: number[] = [];

            for (let i = 0; i < 3; i++) {
                numList[i] = FrameSDK.randomInt(conf.num);
            }

            FrameData.saveData.award5 = {
                numList: numList,
                reward: conf.reward,
                open: {}
            };
        }
    }

    protected onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");

        // FrameSDK.logGameEvent('sdymjmatch_report_new', {
        //     object_action: 'show',
        //     object_name: 'new_15',
        // }, true);

        let data = FrameData.saveData.award5;
        let reward = data.reward;

        JSON.parse(JSON.stringify(data.numList)).sort((a, b) => a - b).forEach((value, index) => {
            this.numRanking[value] = index + 1;
        });

        FrameSDK.frameData.sdkFuc.ppEvent('freeShow');

        this.tipsRichText.string = `skey_063??&value1==<img src="dollar4" offset=-6/> <size=46><color = #FDE829>${FrameSDK.convertCoinToStr(reward)}</c></size>`;

        this.externalRootNode.removeAllChildren();
        if (this.viewData.externalNode) {
            this.externalRootNode.addChild(this.viewData.externalNode);
            this.externalRootNode.active = true;
            this.layout.paddingTop = 40;
            this.layout.spacingY = 40;
        } else {
            this.externalRootNode.active = false;
            this.layout.paddingTop = 120;
            this.layout.spacingY = 120;
        }

        const openables: number[] = [];

        this.boxNode.children.forEach((node, index) => {
            // node.on(cc.Node.EventType.TOUCH_END, this.openBox.bind(this, index), this);
            cc.Tween.stopAllByTarget(node);

            const isOpen = data.open[index];
            const num = data.numList[index];

            if (isOpen) {
                node.getComponent(sp.Skeleton).setAnimation(0, `step${this.numRanking[num]}_5`, true);
                this.boxBonusLabels[index].node.parent.active = true;
                node.getChildByName("COINS_BGBG").active = true;
                this.boxBonusLabels[index].string = `${FrameSDK.convertCoinToStr(num)}`;
            } else {
                openables.push(index);
                node.getComponent(sp.Skeleton).setAnimation(0, `step3`, true);
                this.boxBonusLabels[index].node.parent.active = false;
                node.getChildByName("COINS_BGBG").active = false;
                this.boxBonusLabels[index].string = ``;
            }
        });
        this.updatePro();

        this.viewData.unlockCountUpdateFunc?.(Object.keys(FrameData.saveData.award5.open).length);

        this.homeButtonNode.scale = 0;
        this.continueButtonNode.scale = 0;

        cc.Tween.stopAllByTarget(this.homeButtonNode);
        cc.Tween.stopAllByTarget(this.continueButtonNode);

        this.scheduleOnce(() => {
            if (openables.length <= 0) {
                this._showButtons();
                return;
            }

            const targetIndex = openables[Math.floor(Math.random() * openables.length)];
            this.openBox(targetIndex);
        }, 0.5);

        // let closeCB = this.viewData.closeCB;
        // this.viewData.closeCB = () => {
        //     new Promise<void>(resolve => {
        //         if (FrameData.saveData.activity === null && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.bankLevel) {
        //             Panel_Activity.startActivity(resolve);
        //         } else {
        //             resolve();
        //         }
        //     })
        //         .then(() => new Promise<void>(resolve => {
        //             if (FrameData.saveData.lvAwardinfo == null && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
        //                 Panel_Task.startTask(resolve);
        //             } else {
        //                 resolve();
        //             }
        //         }))
        //         .then(() => closeCB?.());
        // };
    }

    updatePro() {
        let data = FrameData.saveData.award5;
        let now = Object.keys(data.open).length;
        this.barSprite.fillRange = now / data.numList.length;
        this.barLabel.string = now + "/" + data.numList.length;
    }

    openBox(i) {
        if (FrameData.saveData.award5.open[i] || !this.isTouch) return;

        this.isTouch = false;

        FrameSDK.frameData.sdkFuc.ppEvent('freeClaim');
        FrameData.saveData.award5.open[i] = 1;

        if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
            cc.director.emit("SUPER_AWARD", "show");
        }

        let coin = FrameData.saveData.award5.numList[i];
        let box = this.boxNode.children[i];
        let sk = box.getComponent(sp.Skeleton);

        sk.setAnimation(0, "step" + this.numRanking[coin] + "_4", false);
        sk.addAnimation(0, "step" + this.numRanking[coin] + "_5", true);

        FrameSDK.playEffect("pool_zhuanpan");

        cc.Tween.stopAllByTarget(box);
        cc.tween(box)
            .delay(0.7)
            .call(() => FrameSDK.playEffect("done_coin_arrange"))
            .delay(1.2)
            .call(() => {
                box.getChildByName("COINS_BGBG").active = true;
                this.boxBonusLabels[i].node.parent.active = true;
                this.boxBonusLabels[i].string = `${FrameSDK.convertCoinToStr(coin)}`;
                this.viewData.unlockCountUpdateFunc?.(Object.keys(FrameData.saveData.award5.open).length);
                this.updatePro();
                // FrameSDK.logGameEvent('sdymjmatch_report_new', {
                //     object_action: 'show',
                //     object_name: 'new_16',
                // }, true);

                FrameSDK.frameData.sdkFuc.ppEvent('freeCollected');

                if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
                    const windowName = this.viewData.superExternalNode ? "Panel_Award_Super1" : "Panel_Award_Super1";
                    let cbdata = { bonus: FrameData.saveData.award5.reward, freeBonus: FrameData.getCoinOutNum('free'), externalNode: this.viewData.superExternalNode, param: this.viewData.param, closeCB: () => this._showButtons() };
                    // FrameData.saveData.award5 = null;
                    FrameSDK.addCoin(coin, 0, 0, () => {
                        FrameSDK.openWindow(windowName, cbdata);
                    });
                } else {
                    FrameSDK.addCoin(coin, 0, 0, () => this._showButtons());
                }
            })
            .start();
        // }, () => {
        //     this.isTouch = true;
        // }, () => {
        //     this.isTouch = true;
        // });
    }

    @CLICKLOCK()
    click_home(): void {
        if (!this.isTouch) return;

        this.isTouch = false;
        this.onTouchCloseTips();
        // this.viewData.closeCB?.('home');
    }

    @CLICKLOCK()
    click_continue(): void {
        if (!this.isTouch) return;

        this.isTouch = false;
        this.onTouchCloseTips();
        FrameSDK.openRating(this.viewData.closeCB)
    }

    @CLICKLOCK()
    click_Common() {
        // if (!this.isTouch) return;

        // this.isTouch = false;

        // let isInters = FrameSDK.isShowInters();
        // FrameSDK.frameData.sdkFuc.ppEvent(isInters ? 'claim' : 'freeClaim');

        // let callBack = () => {
        //     FrameSDK.addCoin(FrameData.getCoinOutNum('free'), 0, 0, this.viewData.closeCB);
        //     FrameSDK.frameData.sdkFuc.ppEvent(isInters ? 'collected' : 'freeCollected');
        //     this.onTouchCloseTips();
        // };

        // if (isInters) {
        //     FrameSDK.openInters(callBack);
        // } else {
        //     callBack();
        // }
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

    private _showButtons(): void {
        let self = this;
        // if (FrameSDK.hasPopUp()) {
        if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
            FrameData.saveData.award5 = null;
            this.onTouchCloseTips();
            FrameSDK.openRating(this.viewData.closeCB)
        } else {
            cc.Tween.stopAllByTarget(this.continueButtonNode);
            cc.tween(this.continueButtonNode)
                .delay(0.1)
                .set({ scale: 0.2 })
                .to(0.4, { scale: 1 }, { easing: 'backOut' })
                .call(() => this.isTouch = true)
                .start();

        }
        return;
        // }

        // cc.Tween.stopAllByTarget(this.homeButtonNode);
        // cc.tween(this.homeButtonNode)
        //     .delay(0)
        //     .set({ scale: 0.2 })
        //     .to(0.4, { scale: 1 }, { easing: 'backOut' })
        //     .start();

        cc.Tween.stopAllByTarget(this.continueButtonNode);
        cc.tween(this.continueButtonNode)
            .delay(0.1)
            .set({ scale: 0.2 })
            .to(0.4, { scale: 1 }, { easing: 'backOut' })
            .call(() => this.isTouch = true)
            .start();
    }

}
