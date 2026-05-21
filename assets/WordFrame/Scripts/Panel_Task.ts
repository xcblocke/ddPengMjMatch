import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_Task extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property(cc.Label)
    totalBonusLabel: cc.Label = null;

    @property(cc.Label)
    tips: cc.Label = null;

    @property(cc.Node)
    node_content: cc.Node = null;

    private _close_target = null;
    private _scrollViewDesignHeight: number = 0;

    viewData: { closeCB: () => void } = null;

    static coinTarget: cc.Node = null;

    static openTask(closeCB) {
        // if (FrameData.saveData.lvAwardinfo == null && FrameSDK.frameData.gameData.passLevel-1 >= FrameData.FRAME_CONF.taskLevel) {
        //     Panel_Task.startTask(closeCB);
        // }
        closeCB?.();
    }

    static startTask(closeCB?: () => void, autoChain = false) {
        // if (FrameData.saveData.lvAwardinfo) {
        //     FrameSDK.openWindow("Panel_Task", {closeCB: closeCB});
        // } else if (FrameSDK.frameData.gameData.passLevel-1 >= FrameData.FRAME_CONF.taskLevel) {
        //     FrameSDK.openWindow("Panel_ActivityGuide", {
        //         type: 1,
        //         logoType: 'levelReward',
        //         dtime: 2.5,
        //         text: `skey_072`,
        //         closeCB: () => {
        //             FrameSDK.openWindow("Panel_Task", {closeCB: closeCB});
        //         }
        //     });
        // } else if(!FrameSDK.frameData.gameData.isFlag){
        //     FrameSDK.openWindow("Panel_ActivityGuide", {
        //         type: 1,
        //         logoType: 'levelReward',
        //         dtime: 2.5,
        //         text: `skey_072`,
        //         closeCB: () => {
        //             FrameSDK.openWindow("Panel_Task", {closeCB: closeCB});
        //         }
        //     });
        // }else {
            if (autoChain && closeCB) {
                closeCB();
            }
        // }
    }

    static isTaskFinish() {
        if (FrameData.saveData.lvAwardinfo) {
            let config = FrameData.FRAME_CONF.TaskConfig.filter(value => {
                return FrameData.saveData.lvAwardinfo.indexOf(value.task_id) == -1;
            });
            for (let i = 0; i < config.length; i++) {
                if (FrameSDK.frameData.gameData.passLevel-1 >= config[i].task_lv) {
                    return true;
                }
            }
        }
        return false;
    }

    protected onLoad(): void {
        this._close_target = Panel_Task.coinTarget;
        this._scrollViewDesignHeight = this.scrollview.node.height;
        if (FrameData.saveData.lvAwardinfo == null) {
            FrameData.saveData.lvAwardinfo = [];

            FrameSDK.logGameEvent('sdymjmatch_report_act', {
                object_action: 'show',
                object_name: `lvrew_start`,
            }, true);
        }
    }

    onEnable() {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        this.updateUi();
    }

    updateUi() {
        let config = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.TaskConfig)).reverse();
        let now = { now: FrameSDK.frameData.gameData.passLevel-1 };
        let toi = null;
        let subCoin = 0;

        for (let i = 0; i < config.length; i++) {
            let data = config[i];
            subCoin += data.task_num;

            let node = this.node_content.children[i] ?? cc.instantiate(this.node_content.children[0]);
            node.parent = this.node_content;

            let box = cc.find("box", node);
            cc.find("label_lv", node).getComponent(cc.Label).string = data.task_lv.toString();
            cc.find("label_coin", box).getComponent(cc.Label).string = `x${FrameSDK.convertCoinToStr(data.task_num)}`;

            let button = node.getComponent(cc.Button);
            button.interactable = now.now >= data.task_lv && FrameData.saveData.lvAwardinfo.indexOf(data.task_id) == -1;
            button.clickEvents[0].customEventData = data.task_id.toString();

            if (toi === null) {
                if (button.interactable) {
                    toi = i;
                } else if (now.now >= data.task_lv) {
                    toi = i;
                }
            }

            const highlightBgNode = cc.find("toplight_taiq", box);
            const lightNode = cc.find("light", box);
            const maskNode = cc.find("mengban", box);
            const progressNode = cc.find("load1", node);
            const completedNode = cc.find("lvhuang", node);

            if (now.now >= data.task_lv) {
                progressNode.active = true;
                completedNode.active = true;

                if (button.interactable) {
                    highlightBgNode.active = true;
                    lightNode.active = true;
                    maskNode.active = false;
                } else {
                    highlightBgNode.active = false;
                    lightNode.active = false;
                    maskNode.active = true;
                }
            } else {
                highlightBgNode.active = false;
                lightNode.active = true;
                maskNode.active = false;
                progressNode.active = false;
                completedNode.active = false;
            }

            box.stopAllActions();
            box.x = 0;
            if (highlightBgNode.active || data.task_lv - now.now == 1) {
                cc.tween(box).to(0.5, {x: 10}, { easing: 'sineInOut' }).to(0.5, {x: -10}, { easing: 'sineInOut' }).union().repeatForever().start();
            }
        }

        this.totalBonusLabel.string = `x${FrameSDK.convertCoinToStr(subCoin)}`;
        this.tips.string = `skey_071??&value1==${FrameSDK.convertCoinToStr(subCoin)}`;
        this.scheduleOnce(() => {
            const heightOffset = (cc.winSize.height - cc.director.getScene().getComponentInChildren(cc.Canvas).designResolution.height) / 2;
            this.scrollview.node.setContentSize(this.scrollview.node.width, this.scrollview.node.height + heightOffset);
            this.scrollview.node.getComponentInChildren(cc.Widget).updateAlignment();

            if (toi != null) {
                let offset = this.scrollview.getMaxScrollOffset();
                offset.y = offset.y * (toi / (config.length - 1));
                this.scrollview.scrollToOffset(offset, 2);
            } else {
                this.scrollview.scrollToBottom(2);
            }
        });
    }

    protected onDisable(): void {
        this.node_content.children.forEach(element => {
            element.active = false;
        });
        FrameSDK.invokeAutoChainClose(this.viewData);
    }


    @CLICKLOCK()
    onBtnEvent(target, data: string) {
        FrameSDK.logGameEvent('sdymjmatch_report_act', {
            object_action: 'show',
            object_name: `lvrew_get`,
        });

        FrameData.saveData.lvAwardinfo.push(Number(data));
        let coin = FrameData.getCoinOutNum('free');
        let config = FrameData.FRAME_CONF.TaskConfig;
        for (let con of config) {
            if (con.task_id.toString() == data) {
                coin = con.task_num;
                break;
            }
        }
        FrameSDK.addCoin(coin, 0, 0,this.viewData?.closeCB);
        this.viewData.closeCB = null;
        this.onTouchClose();
    }


    onTouchClose() {
        cc.director.emit("UPDATA_TASK");
        FrameSDK.closeEffect(this, null);
    }

}