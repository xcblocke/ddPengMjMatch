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
export default class Panel_PreRdm extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;
    // @property(sp.Skeleton)
    // titleSkeleton: sp.Skeleton = null;

    @property(cc.Label)
    cashLabel: cc.Label = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.ToggleContainer)
    paymentToggleContainer: cc.ToggleContainer = null;

    @property(cc.EditBox)
    editbox: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { numStr: string, closeCB: () => void } = null;

    private _paymentIDs: number[] = [];
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

    private static formatTimestampToYMD(tsMs: number): string {
        const t = Math.max(0, Math.floor(Number(tsMs) || 0));
        const d = new Date(t);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}.${m}.${day}`;
    }

    onLoad() {
        FrameSDK.openEffect(this);
    }

   static openPreRdm(numStr: string, closeCB: () => void) {
        FrameSDK.openWindow("Panel_PreRdm", {
            numStr: FrameSDK.convertCoinToStr(FrameData.credit, true),
            closeCB: closeCB,
        });
    }

    protected onEnable(): void {
        FrameSDK.playEffect("fillin_show");
        this.cashLabel.string = this.viewData.numStr ?? '';
        if (this.timeLabel) {
            this.timeLabel.string = Panel_PreRdm.formatTimestampToYMD(Date.now());
        }
        // if (this.titleSkeleton) {
        //     this.titleSkeleton.setAnimation(0, "start", false);
        //     this.titleSkeleton.addAnimation(0, "loop", true);
        // }

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
                this._invokeChainCloseCB();
            } else {
                FrameSDK.showToast("skey_024");
                return;
            }
        }
        this.close();
    }

    paySelect(e: cc.Toggle) {
        const index = this.paymentToggleContainer.toggleItems.findIndex(toggle => toggle.isChecked);
    }

    hideTime = 0;

    close() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, () => {
                this._invokeChainCloseCB();
                cc.director.emit("showBackHand");
            });
        }
    }

    onDisable(): void {
        this._invokeChainCloseCB();
    }
}
