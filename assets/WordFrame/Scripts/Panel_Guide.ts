// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_Guide extends cc.Component {

    @property()
    type: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = FrameData.saveData.guideInedx == this.type;
        if (this.node.active) {
            if (this.type == 0) {
            } else {
                this.scheduleOnce(this.updataUi.bind(this));
            }
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
        }
    }

    updataUi() {

    }

    onTouch() {
        FrameData.saveData.guideInedx++;
        if (this.type == 0) {
            this.node.active = false;
            Frame.ins.setGuideShow(false);
            FrameSDK.openPanel_Yellow();
        } else {
            this.updataUi();
        }
    }

    // update (dt) {}
}
