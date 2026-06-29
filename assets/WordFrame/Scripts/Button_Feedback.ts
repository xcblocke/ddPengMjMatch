// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CLICKLOCK } from "../Scripts/CLICKLOCK";
import { FrameSDK } from "../Scripts/FrameSDK";
import Panel_Feedback from "./Panel_Feedback";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Button_Feedback extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    but: cc.Node = null;

    onLoad() {
        this.but.active = FrameSDK.frameData.gameData.isFlag;
        FrameSDK.addFlagListen(()=>{
            this.but.active = FrameSDK.frameData.gameData.isFlag;
        },this)
        // if (cc.winSize.width / cc.winSize.height < 0.56) {
        //     this.node.y +=20
        // }
    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    @CLICKLOCK()
    onBtnEvent(target, data: string) {
        Panel_Feedback.openPage()
    }

    // update (dt) {}
}
