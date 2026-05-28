// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

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
    addNode: cc.Node = null;
    @property(cc.Node)
    but: cc.Node = null;
    @property(cc.Sprite)
    bar_sp:cc.Sprite = null;
    @property(cc.Label)
    pro_label:cc.Label = null;
    @property(cc.Label)
    total_label:cc.Label = null;
    private _buttonOriginalPositionY: number = 0;

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this._buttonOriginalPositionY = this.but.position.y;
        this.addNode.active = false;
        Panel_Activity.coinTarget = this.but;
        cc.director.on("UPDATA_ACTIVITY", this.updateUI, this);
        cc.director.on("UPDATA_ACTIVITY_COIN", this.updateCoin, this);
        this.updateUI();
        this.total_label.string = "skey_069"//FrameSDK.formatNumber(FrameData.FRAME_CONF.PiggyConfig.num, 2, FrameData.FRAME_CONF.RedeemRateConfig[0]);
    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    updateUI() {
        // this.but.setPosition(0, this._buttonOriginalPositionY + 102 );
        this.but.scale = 1;
        // this.but.active = FrameSDK.frameData.gameData.isFlag ? Boolean(FrameData.saveData.activity) : (FrameSDK.frameData.gameData.passLevel>1?true:false);
        this.but.active = Boolean(FrameData.saveData.activity);
        this.point.opacity = FrameData.saveData.activity && FrameData.saveData.activity.state == 1 ? 255 : 0;
        this.updatepro();
    }

    updateCoin(num: number) {
        this.addNode.active = true;
        this.addNode.getComponentInChildren(cc.Label).string = "+" + FrameSDK.convertCoinToStr(num);
        this.addNode.stopAllActions();
        this.addNode.opacity = 255;
        this.addNode.y = 0;
        cc.tween(this.addNode).to(1, {y: 25}).to(0.5, {opacity: 0}).call(() => {
            this.addNode.active = false;
        }).start();
        this.updatepro();
        
    }

    updatepro(){
        // this.pro_label.string = FrameSDK.convertCoinToStr(FrameData.saveData.activity?.coin || 0) + "/" + FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num);
        let coin = FrameData.saveData.activity?.coin || 0;
        // this.pro_label.string = FrameSDK.convertCoinToStr(coin)
        // if(coin <= 0){
        //     this.pro_label.node.parent.active = false;
        // }else{
        //     this.pro_label.node.parent.active = true;
        // }
        this.bar_sp.fillRange = coin / FrameData.FRAME_CONF.PiggyConfig.num;
    }

    @CLICKLOCK()
    onBtnEvent(target, data: string) {
        Panel_Activity.startActivity();
    }

    // update (dt) {}
}
