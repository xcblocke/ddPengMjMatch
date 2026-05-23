import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";
import RDM_LevelItem from "./RDM_LevelItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RDM_Level extends cc.Component {
    private static readonly DEFAULT_KA1_VALUE = 10350;
    private static readonly DEFAULT_KA2_VALUE = 1910.77;
    private static readonly DEFAULT_KA3_VALUE = 3896;

    @property(cc.Node)
    top: cc.Node = null;
    @property(cc.RichText)
    rtx_turnInfo: cc.RichText = null;
    @property(cc.Label)
    lbl_gCoin: cc.Label = null;
    @property(cc.Label)
    accountLabel: cc.Label = null;

    @property(cc.Node)
    paymentRootNode: cc.Node = null;
    @property(cc.Node)
    dibuRootNode: cc.Node = null;

    @property(cc.RichText)
    rtx_tips: cc.RichText = null;
    @property(cc.Node)
    guide: cc.Node = null;
    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property([cc.Node])
    stepNodes: cc.Node[] = [];

    coin: string = "0";
    guideInedx: number = 0;
    private _newHandRdmDoneEmitted = false;
    private ka1Value = RDM_Level.DEFAULT_KA1_VALUE;
    private ka2Value = RDM_Level.DEFAULT_KA2_VALUE;
    private ka3Value = RDM_Level.DEFAULT_KA3_VALUE;
    private dibuRollTargets: any[] = [];

    viewData:{closeCB?: Function} = null;

    protected onLoad(): void {
        
        this.loadDibuStats();
        this.showTurnList();
        cc.director.on("REFRESH_INFO", this.updateUI, this);
        this.updateUI();
        this.guide.active = false;
        if (FrameSDK.frameData.gameData.isFlag && FrameData.saveData.guideInedx <= 1) {
            FrameData.saveData.guideInedx = 2;
            this.scheduleOnce(() => {
                this.openGuide();
            }, 0);
            
        }
        this.scheduleOnce(() => {
            this.scrollview.node.height = this.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
        });

        FrameSDK.playEffect("show_rd")
        const paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((node, index) => {
            node.getComponent(PaymentItem).paymentID = paymentIDs[index] ?? 0;
        });
        this.updateDibu();
        let hand = cc.find("hand", this.node);
        hand && (hand.active = false);
        cc.director.on("showBackHand", this.showBackHand, this);
    }

    showBackHand(){
        let hand = cc.find("hand", this.node);
        hand.active = true;
        if(hand){
            cc.tween(hand).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        }
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
        this.clearDibuRollTweens();
        if (
            FrameSDK.frameData?.gameData?.isFlag &&
            FrameData.saveData.guideInedx >= 2 &&
            !this._newHandRdmDoneEmitted
        ) {
            this.emitNewHandRdmTutorialDone();
        }
        cc.director.removeAll(this);
    }

    private emitNewHandRdmTutorialDone() {
        if (this._newHandRdmDoneEmitted) {
            return;
        }
        this._newHandRdmDoneEmitted = true;
        cc.director.emit("NEW_HAND_FINISH");
        cc.director.emit("NEW_HAND_RDM_TUTORIAL_DONE");
    }

    updateUI() {
        this.coin = FrameSDK.convertCoinToStr(FrameData.credit, true);
        this.lbl_gCoin.string = this.coin;
        const rate = FrameData.FRAME_CONF.RedeemRateConfig[0];
        console.log("rate。。。。。。。。..........", rate);
        this.rtx_tips.string = `<outline color=#914129 width=2><b>skey_094</b></outline>??&value1==<img src="dollar4" offset=-3/> <color= #86FF04><outline color=#427F04 width=2>${FrameSDK.convertCoinToStr(rate)}</outline></c>&value2==<color= #86FF04><outline color=#427F04 width=2>${FrameSDK.convertCoinToStr(rate, true)}</outline></c>`;
        FrameData.FRAME_CONF.CoinConf.forEach((value, i) => {
            let itme = this.scrollview.content.children[i] || cc.instantiate(this.scrollview.content.children[0]);
            itme.getComponentInChildren(RDM_LevelItem).init(value);
            itme.parent = this.scrollview.content;
        });
        let account = FrameData.saveData.account;
        if (account && account != "") {
            this.accountLabel.node.parent.active = true;
            this.accountLabel.string = `clok_015${account}`;
        }else{
            this.accountLabel.node.parent.active = false;
        }
    }

    openAccount(){
        FrameSDK.openWindow("Panel_Account",{
            numStr: FrameSDK.convertCoinToStr(FrameData.credit, true),
            closeCB: ()=>{
                // cc.director.emit("REFRESH_INFO");
            },
        });
    }

    static getTurnInfo() {
        let data = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.CoinConf)).sort(() => Math.random() - 0.5)[0];
        return {level: data.rdm_1, coinCout: FrameData.getTargetCoint(data.rdm_id, FrameSDK.randomInt(2000, 6000))};
    }

    static getData(id: number): { status: number, now: number, total: number, tips: string } {
        let conf = FrameData.getCoinConf(id);
        let status = FrameData.getExchangeStatus(id);
        let rdata: any = {};
        if (status == 1) {
            const passLevel = FrameSDK.frameData.gameData.passLevel;
            rdata = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, conf.rdm_1),
                total: conf.rdm_1,
                tips: `skey_049??&value1==<color= #FFF95C><outline color=#982025 width=3>${passLevel <= 0 ? 20 : conf.rdm_1}</outline></c>`
            };
            
            
        } else if (status == 2) {
            let data = FrameData.saveData.CoinStep[id];
            rdata = {
                now: Math.min(FrameData.saveData.credit.yellowCoin, data.targetCoin),
                total: data.targetCoin,
                tips: `skey_050??&value1==<color= #009D12>${FrameSDK.convertCoinToStr(data.targetCoin, true)}</c>`
            };
        } else if (status == 3) {
            let data = FrameData.saveData.CoinStep[id];
            rdata = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, conf.rdm_3),
                total: conf.rdm_3,
                tips: `skey_053??&value1==<outline color=#914129 width=2><color= #FFF95C>${conf.rdm_3}</c></outline>&value2==<color= #22C111>${FrameSDK.convertCoinToStr(data.targetCoin, true)}</c>`
            };
        }
        rdata["status"] = status;
        return rdata;
    }

    showTurnList() {
        this.rtx_turnInfo.node.stopAllActions();
        let data = RDM_Level.getTurnInfo();
        const upOne = FrameSDK.getRandomInviteCode();
        this.rtx_turnInfo.string = `skey_001??&value1==${upOne}</c>&value2==${data.level}&value3==<color = #22C111>${FrameSDK.convertCoinToStr(data.coinCout, true)}</c>`;
        cc.tween(this.rtx_turnInfo.node).delay(0.1).set({y: -(this.rtx_turnInfo.node.parent.height * 0.5 + this.rtx_turnInfo.node.height * 0.5)}
        ).call(() => {
            const paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
            this.rtx_turnInfo.node.parent.parent.getComponentInChildren(PaymentItem).paymentID = paymentIDs[Math.floor(Math.random() * paymentIDs.length)] ?? 0;
        }).to(1, {y: 0}).delay(1).to(1, {
            y: this.rtx_turnInfo.node.parent.height * 0.5 + this.rtx_turnInfo.node.height * 0.5
        }).call(() => {
            this.showTurnList();
        }).start();
    }

    onBtnEvent(target, data: string) {
        if (data == "0") {
            this.viewData?.closeCB?.();
            this.emitNewHandRdmTutorialDone();
            this.node.destroy();
        } else if (data == "3") {
            this.guideInedx++;
            this.openGuide();
        }
    }

    updateDibu() {
        let ka1Label = cc.find("kapian1/ka_coin1", this.dibuRootNode).getComponent(cc.Label);
        let ka2Label = cc.find("kapian2/ka_coin2", this.dibuRootNode).getComponent(cc.Label);
        let ka3Label = cc.find("kapian3/ka_coin3", this.dibuRootNode).getComponent(cc.Label);

        if (!ka1Label || !ka2Label || !ka3Label) return;

        ka1Label.string = this.formatIntValue(this.ka1Value);
        ka2Label.string = this.formatAmountValue(this.ka2Value);
        ka3Label.string = this.formatIntValue(this.ka3Value);

        this.scheduleOnce(() => {
            const nextValue = this.ka2Value + FrameSDK.randomInt(18, 68) / 100;
            this.rollLabelValue(ka2Label, this.ka2Value, nextValue, 0.6, true, value => {
                this.ka2Value = value;
                this.saveDibuStats();
            });
        }, 0.8);

        this.scheduleOnce(() => {
            const nextValue = this.ka3Value + FrameSDK.randomInt(8, 26);
            this.rollLabelValue(ka3Label, this.ka3Value, nextValue, 0.5, false, value => {
                this.ka3Value = value;
                this.saveDibuStats();
            });
        }, 1);

        this.schedule(() => {
            const nextValue = this.ka1Value + FrameSDK.randomInt(6, 22);
            this.rollLabelValue(ka1Label, this.ka1Value, nextValue, 0.5, false, value => {
                this.ka1Value = value;
                this.saveDibuStats();
            });
        }, 3);
    }

    private loadDibuStats() {
        const stats = FrameData.saveData.rdmLevelStats || {} as any;
        this.ka1Value = Number(stats.ka1Value);
        this.ka2Value = Number(stats.ka2Value);
        this.ka3Value = Number(stats.ka3Value);

        if (!isFinite(this.ka1Value)) this.ka1Value = RDM_Level.DEFAULT_KA1_VALUE;
        if (!isFinite(this.ka2Value)) this.ka2Value = RDM_Level.DEFAULT_KA2_VALUE;
        if (!isFinite(this.ka3Value)) this.ka3Value = RDM_Level.DEFAULT_KA3_VALUE;

        this.saveDibuStats();
    }

    private saveDibuStats() {
        FrameData.saveData.rdmLevelStats = {
            ka1Value: this.ka1Value,
            ka2Value: this.ka2Value,
            ka3Value: this.ka3Value
        };
    }

    private rollLabelValue(
        label: cc.Label,
        startValue: number,
        endValue: number,
        duration: number,
        isAmount: boolean,
        onComplete?: (value: number) => void
    ) {
        if (!label || !cc.isValid(this.node) || !cc.isValid(label) || !cc.isValid(label.node)) return;

        const counter = { value: startValue };
        this.dibuRollTargets.push(counter);
        cc.tween(counter)
            .to(duration, { value: endValue }, {
                progress: (start: number, end: number, current: number, ratio: number) => {
                    if (!cc.isValid(this.node) || !cc.isValid(label) || !cc.isValid(label.node)) {
                        return current;
                    }
                    const value = start + (end - start) * ratio;
                    label.string = isAmount ? this.formatAmountValue(value) : this.formatIntValue(value);
                    return value;
                }
            })
            .call(() => {
                if (!cc.isValid(this.node) || !cc.isValid(label) || !cc.isValid(label.node)) {
                    return;
                }
                label.string = isAmount ? this.formatAmountValue(endValue) : this.formatIntValue(endValue);
                onComplete && onComplete(endValue);
            })
            .start();
    }

    private clearDibuRollTweens() {
        this.dibuRollTargets.forEach(target => {
            cc.Tween.stopAllByTarget(target);
        });
        this.dibuRollTargets.length = 0;
    }

    private formatIntValue(value: number) {
        return Math.floor(value).toString();
    }

    private formatAmountValue(value: number) {
        return `${FrameData.CountryConf.symbol}${value.toFixed(2)}`;
    }

    openGuide() {
        this.guide.active = true;
        this.guide.children.forEach(value => {
                value.active = false;
            }
        );
        let mask = cc.find("mask", this.guide).getComponent(cc.Mask);
        mask.node.active = true;
        if (this.guideInedx == 0) {
            FrameSDK.logGameEvent('sdymjmatch_report_new', {
                object_action: 'show',
                object_name: 'new_7',
            }, true);

            cc.find("tips1", this.guide).active = true;
            mask.spriteFrame = this.stepNodes[0].getComponent(cc.Sprite).spriteFrame;//FrameSDK.getNodeTexture(cc.find("node_list2", this.node));
            mask.node.setContentSize(this.stepNodes[0].getContentSize())
            mask.node.position = cc.v3(0, cc.find("node_list2", this.node).position.y);
            cc.tween(cc.find("tips1/hand", this.guide)).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (this.guideInedx == 1) {
            FrameSDK.logGameEvent('sdymjmatch_report_new', {
                object_action: 'show',
                object_name: 'new_8',
            }, true);

            cc.find("tips2", this.guide).active = true;
            mask.spriteFrame = this.stepNodes[1].getComponent(cc.Sprite).spriteFrame;//FrameSDK.getNodeTexture(cc.find("node_list2", this.node));
            mask.node.setContentSize(this.stepNodes[1].getContentSize())
            

            let itemNode = this.scrollview.content.getChildByName("item");
            let posInA = this.node.convertToNodeSpaceAR(itemNode.convertToWorldSpaceAR(cc.v2(0, 0)));
            mask.node.position = cc.v3(0, posInA.y);

            cc.tween(cc.find("tips2/hand", this.guide)).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (this.guideInedx == 2) {
            cc.find("tips3", this.guide).active = true;
            let data = RDM_Level.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            const passLevel = FrameSDK.frameData.gameData.passLevel;
            if(passLevel <= 0){
                data.total = 20
            }
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = `skey_040??&value1==${data.total - data.now}`;
            cc.tween(cc.find("tips3/hand", this.guide)).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
            
            mask.spriteFrame = this.stepNodes[2].getComponent(cc.Sprite).spriteFrame;//FrameSDK.getNodeTexture(cc.find("node_list2", this.node));
            mask.node.setContentSize(this.stepNodes[2].getContentSize())

            mask.node.position = cc.find("btn_close", this.node).position;

        } else if (this.guideInedx == 3) {
            FrameSDK.logGameEvent('sdymjmatch_report_new', {
                object_action: 'show',
                object_name: 'new_9',
            }, true);
            this.guide.active = false;
            cc.director.emit("showBackHand");
        }
    }
}
