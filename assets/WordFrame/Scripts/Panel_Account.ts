// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_Account extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Label)
    cashLabel: cc.Label = null;

    @property(cc.ToggleContainer)
    paymentToggleContainer: cc.ToggleContainer = null;
    @property(cc.Sprite)
    payName_coin: cc.Sprite = null;
    @property([cc.SpriteFrame])
    payName_coinFrames: cc.SpriteFrame[] = [];

    @property(cc.EditBox)
    editbox: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { numStr: string, closeCB: () => void } = null;

    private _paymentIDs: number[] = [];

    onLoad() {
        FrameSDK.openEffect(this);
    }

    protected onEnable(): void {
        FrameSDK.playEffect("fillin_show");
        this.cashLabel.string = this.viewData.numStr ?? '';

        this._paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentToggleContainer.node.children.forEach((node, index) => node.getComponent(PaymentItem).paymentID = this._paymentIDs[index] ?? -1);
        this.paySelect(null);
    }

    onBtnEvent(target, data: string) {
        if (data == "1") {
            if (this.editbox.string.trim().length > 0) {
                const index = this.paymentToggleContainer.toggleItems.findIndex(toggle => toggle.isChecked);

                FrameData.saveData.account = this.editbox.string.trim();
                FrameData.saveData.paymentID = this._paymentIDs[index] ?? -1;
                

                cc.director.emit("REFRESH_INFO");
                this.viewData.closeCB?.();
            } else {
                FrameSDK.showToast("skey_024");
                return;
            }
        }
        FrameSDK.playEffect("click");
        this.close();
    }

    paySelect(e: cc.Toggle) {
        const index = this.paymentToggleContainer.toggleItems.findIndex(toggle => toggle.isChecked);
        this.payName_coin.spriteFrame = this.payName_coinFrames[(this._paymentIDs[index] ?? -1) - 101];
    }

    hideTime = 0;

    close() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }
}
