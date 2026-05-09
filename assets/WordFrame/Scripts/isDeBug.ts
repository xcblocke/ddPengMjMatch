// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import {FrameSDK} from "./FrameSDK";
import {FrameData} from "./FrameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class IsDeBug extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = FrameSDK.frameData.isDeBug || FrameData.isTest;
    }


    // update (dt) {}
}
