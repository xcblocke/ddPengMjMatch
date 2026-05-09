// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Task from "./Panel_Task";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Button_Task extends cc.Component {

    @property(cc.Node)
    point: cc.Node = null;
    @property(cc.Node)
    but: cc.Node = null;
    @property(cc.Label)
    pro_label: cc.Label = null;
    @property(cc.Label)
    totalLab: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.on("UPDATA_LEVEL", this.updateUI, this);
        cc.director.on("UPDATA_TASK", this.updateUI, this);
        Panel_Task.coinTarget = this.but;
        this.updateUI();
    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    updateUI() {
        this.but.active =FrameSDK.frameData.gameData.isFlag ?  Boolean(FrameData.saveData.lvAwardinfo) :false;
        this.point.opacity = Panel_Task.isTaskFinish() ? 255 : 0;

        let config = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.TaskConfig)).reverse();
        let subCoin = 0;//最大金币
        let confObj = null;

        let lv = FrameSDK.frameData.gameData.passLevel-1;
        for (let i = 0; i < config.length; i++) {
            let data = config[i];
            if(lv <= data.task_lv){
                confObj = data;
            }
        }
        if(confObj){
        this.pro_label.string = `${lv}/${confObj.task_lv}`;
            
        }

        // for (let i = 0; i < config.length; i++) {
        //     let data = config[i];
        //     // subCoin += data.task_num;
        //     // confObj[data.task_id] = data;
        // }
        // let list = FrameData.saveData.lvAwardinfo;
        // let rev = 0;//已领金币
        // if (list?.length > 0) {
        //     for (let i = 0; i < list.length; i++) {
        //         const element = list[i];
        //         rev += confObj[element].task_num;
        //         // for (let i = 0; i < config.length; i++) {
        //         //     let data = config[i];
        //         //     if(data.task_id == element){
        //         //         rev += data.task_num;
        //         //         break;
        //         //     }
        //         // }
        //     }
        // }

        // this.totalLab.string = `$${FrameSDK.convertCoinToStr(subCoin)}` + "";
        // this.pro_label.string = `${FrameSDK.convertCoinToStr(rev)}/${FrameSDK.convertCoinToStr(subCoin)}`;
        


    }

    @CLICKLOCK()
    onBtnEvent(target, data: string) {
        Panel_Task.startTask();
    }

    // update (dt) {}
}
