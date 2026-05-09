// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_Rating extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;
    @property(cc.Node)
    btn_close: cc.Node = null;
    @property(cc.Node)
    label_tips1: cc.Node = null;
    @property(cc.Node)
    starLayout: cc.Node = null;
    @property(cc.Node)
    EdBox: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    viewData: { closeCB?: () => void } = null;
    leve = 5;

    onLoad() {
        FrameSDK.openEffect(this);
        this.panel_window.getChildByName("root").active = true;
        this.panel_window.getChildByName("root2").active = false;
        // this.btn_close.active = false;
        this.initInput();
        FrameData.saveData.openRatingInedx++;
    }


    onStarClickEvent(target, data) {
        this.leve = Number(data) + 1;
        for (let i = 0; i < this.starLayout.childrenCount; i++) {
            this.starLayout.children[i].getChildByName("yes").active = i < this.leve;
        }
    }

    onOkClickEvent(target, data) {
        if (data == "0") {
            if (this.leve >= 5) {
                if (FrameSDK.frameData.sdkFuc.openUrl) {
                    FrameSDK.frameData.sdkFuc.openUrl(cc.sys.os === cc.sys.OS_IOS ? FrameData.FRAME_CONF.iosRateUrl : FrameData.FRAME_CONF.androidRateUrl);
                }
                FrameData.saveData.isRating = true;
                FrameSDK.closeEffect(this, this.viewData.closeCB);
            } else {

                let root = this.panel_window.getChildByName("root");
                let imput = root.getChildByName("input");
                imput.active = true;
                let root2 = this.panel_window.getChildByName("root2");
                root.getChildByName("label").active = false;

                if (this.EdBox.getComponent(cc.EditBox).string.length > 0) {
                    imput.active = false;
                    root.active = false;
                    root2.active = true;
                    FrameData.saveData.isRating = true;
                } else {
                    FrameSDK.showToast("ukey_067");
                }
            }
        } else {
            FrameSDK.closeEffect(this, this.viewData.closeCB);
        }
    }

    initInput() {

        let ed = this.EdBox.getComponent(cc.EditBox);
        ed.node.off(cc.Node.EventType.TOUCH_END);
        ed.node.off(cc.Node.EventType.MOUSE_UP);

        ed.node.on(cc.Node.EventType.TOUCH_MOVE, (msg: cc.Event.EventTouch) => {
            let mask = this.EdBox;
            // @ts-ignore
            if (ed.isFocused() == false && ed.textLabel.node.height > mask.height) {
                ed.textLabel.node.y += msg.getDeltaY();
                if (ed.textLabel.node.height > mask.height) {
                    let deltaMax = ed.textLabel.node.height - mask.height;

                    if (ed.textLabel.node.y > mask.height / 2 + deltaMax) {
                        ed.textLabel.node.y = mask.height / 2 + deltaMax;
                    } else if (ed.textLabel.node.y < mask.height / 2) {
                        ed.textLabel.node.y = mask.height / 2;
                    }
                }
            }
        }, this);
    }
}
