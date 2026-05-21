// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel_Clock from "../clockView/Panel_Clock";
import {CLICKLOCK} from "./CLICKLOCK";
import {FrameData} from "./FrameData";
import {FrameSDK} from "./FrameSDK";
import i18 from "./i18";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Frame extends cc.Component {

    @property(cc.JsonAsset)
    i18Json: cc.JsonAsset = null;
    @property(cc.Node)
    guide: cc.Node = null;
    @property(cc.Node)
    guide2: cc.Node = null;
    @property(cc.Node)
    hand: cc.Node = null;
    @property(cc.Node)
    hand2: cc.Node = null;

    @property(cc.Node)
    lv_proNode: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:
    static ins: Frame = null;
    private _lastVideoSucTs: number = 0;
    private _onGuide2Tap = () => {
        if (!(this.guide2?.active || this.hand2?.active)) {
            return;
        }
        this.setGuide2Show(false);
        FrameSDK.openPanel_Charity();
    };



    onLoad() {
        Frame.ins = this;
        cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
        FrameSDK.Panel = this.node.getChildByName("popUpNode");
        i18.init(this.i18Json.json, null, FrameData.SDK_CONF.COUNTRY_LIST);

        cc.director.on("FRESH_CREDIT", (data: { type: string, num: number, change: number }) => {
            if (data.change > 0) {
                FrameData.saveData.historyCredit[data.type] += data.change;
            }
        });


        setInterval(() => {
            FrameData.saveData.online_total++;
            this.sendLevelMD();
        }, 1000);
        cc.director.on(FrameSDK.frameData.ListenKeys.VIDEO_SUC, () => {
            const now = Date.now();
            if (now - this._lastVideoSucTs < 500) {
                return;
            }
            this._lastVideoSucTs = now;
            FrameData.saveData.skipADCount = 0;
            FrameData.saveData.CashVideoCount++;
            FrameSDK.updataVideoQueueUp();
            Panel_Clock.videoCallBack();
        });

        this.setGuideShow(false);
        this.setGuide2Show(false);
        // guide2 覆盖层会拦截底层按钮点击，这里直接监听引导层点击来触发 Charity 弹窗
        this.guide2 && this.guide2.on(cc.Node.EventType.TOUCH_END, this._onGuide2Tap, this);
        this.hand2 && this.hand2.on(cc.Node.EventType.TOUCH_END, this._onGuide2Tap, this);
        FrameSDK.currLevel = FrameSDK.frameData.gameData.passLevel + 1;

        FrameSDK.addFlagListen(()=>{
            this.lv_proNode.active = FrameSDK.frameData.gameData.isFlag;
        },this)
        this.lv_proNode.active = FrameSDK.frameData.gameData.isFlag;

    }

    onDestroy() {
        this.guide2 && this.guide2.off(cc.Node.EventType.TOUCH_END, this._onGuide2Tap, this);
        this.hand2 && this.hand2.off(cc.Node.EventType.TOUCH_END, this._onGuide2Tap, this);
        cc.director.removeAll(this);
        Frame.ins = null;
    }

    start() {
        if (!FrameSDK.frameData.gameData.noProfitAd) {
            FrameSDK.frameData.sdkFuc.ppEvent("slotShow");
        }
        FrameSDK.logLiftEvent(`into_game`);
        FrameSDK.logLiftEvent(`start_game`);
        this.sendLevelMD();
        if (cc.sys.os === cc.sys.OS_ANDROID && FrameData.FRAME_CONF.androidRateUrl == "") {
            console.error("未配置Android评星链接：FrameData.FRAME_CONF.androidRateUrl = \"\"");
        }
        if (cc.sys.os === cc.sys.OS_IOS && FrameData.FRAME_CONF.iosRateUrl == "") {
            console.error("未配置iOS评星链接：FrameData.FRAME_CONF.iosRateUrl = \"\"");
        }
    }

    passLevel: number = -1;

    sendLevelMD() {
        if (this.passLevel != FrameSDK.frameData.gameData.passLevel) {
            if (this.passLevel != -1) {
                // FrameSDK.gameMDEvent(4, "lv_end", this.passLevel.toString());
            }
            this.passLevel = FrameSDK.frameData.gameData.passLevel;
            // FrameSDK.gameMDEvent(4, "lv_start", FrameSDK.frameData.gameData.passLevel.toString());
            cc.director.emit("UPDATA_LEVEL");
        }
    }

    setGuideShow(isShow: boolean) {
        this.guide.active = this.hand.active = isShow;
        if (isShow) {
            FrameSDK.logGameEvent("sdymjmatch_report_new", {
                object_action: "show",
                object_name: "new_6"
            }, true);
        } else {
            FrameSDK.notifyTutorialStateChanged();
        }
    }

    setGuide2Show(isShow: boolean) {
        this.guide2.active = this.hand2.active = isShow;
        if (isShow) {
            cc.director.emit("UNLOCK_CHARITY");
        } else {
            FrameSDK.notifyTutorialStateChanged();
        }
    }

    @CLICKLOCK()
    onBtnEvent(target, data: string) {
        if (data == "1") {
            // guide2 教程态由 guide2/hand2 覆盖层点击统一处理，避免与按钮事件双触发导致重复弹窗。
            if (this.guide2.active || this.hand2.active) {
                return;
            }
            FrameSDK.openPanel_Yellow();
        }
    }

    // update (dt) {}
}
