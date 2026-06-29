// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Panel_Clock from "../clockView/Panel_Clock";
import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Activity from "./Panel_Activity";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Button_Activity extends cc.Component {
    @property(cc.Node)
    point: cc.Node = null;
    @property(cc.Node)
    but: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        Panel_Clock.coinTarget = this.but;
        cc.director.on("UPDATA_CLOCK", this.updateUI, this);
         cc.director.on("addLv", () => {
            this.addLv();
            this.updateUI();
        }, this)
        this.updateUI();
        setInterval(() => {
            // cc.systemEvent.emit("SecondEvent");
            Panel_Clock.checkDay()
        }, 1000);

    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    updateUI() {
        this.but.scale = 1;
        this.but.active =  FrameSDK.frameData.gameData.isFlag ? Boolean(FrameData.saveData.ClockUserInfo) :false;
    }


    @CLICKLOCK()
    onBtnEvent(target, data: string) {
        Panel_Clock.openClock();
    }

    addLv(){
        Panel_Clock.addDayLevelProgressGM();
    }

    // update (dt) {}
}
