// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import RDM_Charity from "./RDM_Charity";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RDM_CharityItem extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    data: { status: number, now: number, total: number, tips: string, isCharity: boolean } = null;
    conf: { rdm_id: number, rdm_1: number, rdm_2: number, reward: number } = null;

    init(conf) {
        this.conf = conf;
        this.data = RDM_Charity.getData(conf.rdm_id);
        this.updateUI();
    }

    updateUI() {
        this.node.children.forEach((value, index) => {
            value.active = false;
        });
        let data = this.data;
        let state = this.node.getChildByName("state" + data.status);
        if (data.status == 1) {
            cc.find("label_1", state).getComponent(cc.Label).string = `${FrameSDK.convertCharityToStr(this.conf.reward, true)}`;
            cc.find("CashFishCredit/count", state).getComponent(cc.Label).string = `${FrameSDK.convertCharityToStr(data.now)}/${FrameSDK.convertCharityToStr(data.total)}`;
            cc.find("CashFishCredit/bar", state).getComponent(cc.Sprite).fillRange = data.now / data.total;
            cc.find("rtx_tips2", state).getComponent(cc.RichText).string = data.tips;
        } else if (data.status == 2) {
            cc.find("label_1", state).getComponent(cc.Label).string = FrameSDK.convertCharityToStr(this.conf.reward, true);
            cc.find("rtx_tips2", state).getComponent(cc.RichText).string = data.tips;
        } else if (data.status == 3) {
            cc.find("label_1", state).getComponent(cc.Label).string = FrameSDK.convertCharityToStr(this.conf.reward, true);
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
                        numStr: FrameSDK.convertCharityToStr(this.conf.reward, true),
                        closeCB: resolve,
                    });
                } else {
                    resolve();
                }
            })
                .then(() => {
                    FrameSDK.logLiftEvent(`finish_task`);
                    FrameSDK.logGameEvent('sdymjmatch_game_rdm', {
                        object_action: 'show',
                        object_name: `rdm2_${this.data.status}_end`,
                        object_notes: `redeem_${this.conf.rdm_id}`,
                    }, true);

                    if (this.data.status == 1) {
                        FrameData.saveData.CharityStep[this.conf.rdm_id] = {
                            status: 2,
                        };
                    } else if (this.data.status == 2) {
                        FrameData.saveData.CharityStep[this.conf.rdm_id].status = 3;
                    }
                    cc.director.emit("REFRESH_INFO");

                    FrameSDK.logGameEvent('sdymjmatch_game_rdm', {
                        object_action: 'show',
                        object_name: `rdm2_${this.data.status}_start`,
                        object_notes: `redeem_${this.conf.rdm_id}`,
                    }, true);
                })
        } else {
            FrameSDK.openWindow("Panel_Tips", this.data);
        }
    }

    onBtnTestEvent(target, data: string) {
        if (this.data.status == 1 || this.data.status == 2) {
            this.data.now = this.data.total;
        }
        this.updateUI();
    }

    // update (dt) {}
}
