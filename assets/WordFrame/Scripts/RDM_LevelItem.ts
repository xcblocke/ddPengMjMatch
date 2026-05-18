// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import RDM_Level from "./RDM_Level";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RDM_LevelItem extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    data: { status: number, now: number, total: number, tips: string } = null;
    conf: { rdm_id: number, rdm_1: number, rdm_2: number[], rdm_3: number } = null;

    init(conf) {
        this.conf = conf;
        this.data = RDM_Level.getData(conf.rdm_id);
        this.updateUI();
    }

    updateUI() {
        this.node.children.forEach((value, index) => {
            value.active = false;
        });
        let data = this.data;
        let state = this.node.getChildByName("state" + data.status);
        if (data.status == 1 || data.status == 2) {
            const passLevel = FrameSDK.frameData.gameData.passLevel;
            if(passLevel <= 0){
                data.total = 20
            }
            cc.find("label_1", state).getComponent(cc.Label).string = data.status == 1 ? `LV.${data.now} / LV.${data.total}` : FrameSDK.convertCoinToStr(data.total, true);
            cc.find("rtx_tips2", state).getComponent(cc.RichText).string = data.tips;
            cc.find("node_progress/node_bar", state).getComponent(cc.Sprite).fillRange = data.now / data.total;
            cc.find("node_progress/node_bar/lbl_pro", state).getComponent(cc.Label).string = data.status == 1 ? `LV.${data.now}/LV.${data.total}` : `${FrameSDK.convertCoinToStr(data.now, true)}/${FrameSDK.convertCoinToStr(data.total, true)}`;
        } else if (data.status == 3) {
            cc.find("label_1", state).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(FrameData.saveData.CoinStep[this.conf.rdm_id].targetCoin, true);
            cc.find("rtx_tips2", state).getComponent(cc.RichText).string = data.tips;
        } else if (data.status == 4) {
            cc.find("label_1", state).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(FrameData.saveData.CoinStep[this.conf.rdm_id].targetCoin, true);
        }
        if (data.now >= data.total) {
            if (data.status == 1) {
                FrameSDK.logLiftEvent(`reach_threshold`);
            }
        }
        state.active = true;
    }

    onBtnEvent(target, data: string) {
        if (this.data.now >= this.data.total) {
            new Promise<void>(resolve => {
                if (FrameData.saveData.account.length <= 0) {
                    FrameSDK.openWindow("Panel_Account", {
                        numStr: FrameSDK.convertCoinToStr(FrameData.credit, true),
                        closeCB: resolve,
                    });
                } else {
                    resolve();
                }
            })
                .then(() => {
                    FrameSDK.logLiftEvent(`finish_task`);
                    FrameSDK.logGameEvent('sdymjmatch_report_rdm', {
                        object_action: 'show',
                        object_name: `rdm_${this.data.status}_end`,
                        object_notes: `redeem_${this.conf.rdm_id}`,
                    }, true);

                    if (this.data.status == 1) {
                        FrameData.saveData.CoinStep[this.conf.rdm_id] = {
                            status: 2,
                            targetCoin: FrameData.getTargetCoint(this.conf.rdm_id, FrameData.saveData.credit.yellowCoin)
                        };
                    } else if (this.data.status == 2) {
                        FrameData.saveData.CoinStep[this.conf.rdm_id].status = 3;
                    } else if (this.data.status == 3) {
                        FrameData.saveData.CoinStep[this.conf.rdm_id].status = 4;
                    }
                    cc.director.emit("REFRESH_INFO");

                    FrameSDK.logGameEvent('sdymjmatch_report_rdm', {
                        object_action: 'show',
                        object_name: `rdm_${FrameData.saveData.CoinStep[this.conf.rdm_id].status}_start`,
                        object_notes: `redeem_${this.conf.rdm_id}`,
                    }, true);
                });
        } else {
            FrameSDK.openWindow("Panel_Tips", this.data);
        }
    }

    onBtnTestEvent(target, data: string) {
        if (this.data.status == 1 || this.data.status == 2 || this.data.status == 3) {
            this.data.now = this.data.total;
        }
        this.updateUI();
    }

    // update (dt) {}
}
