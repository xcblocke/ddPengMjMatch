// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { FrameSDK } from "../Scripts/FrameSDK";



const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Feedback extends cc.Component {

    @property(cc.EditBox)
    editbox1: cc.EditBox = null;
    @property(cc.EditBox)
    editbox2: cc.EditBox = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    static openPage(closeCB?: () => void) {
        // FrameSDK.playEffect("sfx_page")
        FrameSDK.openWindow("Panel_Feedback", { closeCB: closeCB });

    }

    onButSubmit() {
        if (this.editbox1.string.length > 0 && this.editbox2.string.length > 0) {
            FrameSDK.frameData.gameFuc.openLoad();
            this.scheduleOnce(() => {
                FrameSDK.frameData.gameFuc.closeLoad();
                FrameSDK.showToast("fkey_140");
                this.node.destroy();
            }, 0.6 + Math.random() * 2);

            const now = new Date();
            const formatted = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ':' +
                String(now.getHours()).padStart(2, '0')+ ':'+
                String(now.getMinutes()).padStart(2, '0');
            FrameSDK.logGameEvent('sdymjmatch_feedback', {
                object_action: 'question:'+this.editbox1.string,
                object_name: `information:`+this.editbox2.string,
                object_notes: `time:`+formatted,
            });
            
        } else if (this.editbox1.string.length <= 0) {
            FrameSDK.showToast("fkey_138");
        } else if (this.editbox2.string.length <= 0) {
            FrameSDK.showToast("fkey_139");
        } else {
            this.node.destroy();
        }
    }

    onButClose() {
        this.node.destroy();
    }



    // update (dt) {}
}
