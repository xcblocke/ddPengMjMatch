import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";


const {ccclass, property} = cc._decorator;
@ccclass
export default class CashFishCredit extends cc.Component {
    @property(cc.Label)
    creditNum: cc.Label = null;
    @property(cc.Node)
    addNode: cc.Node = null;
    @property(cc.Label)
    addNum: cc.Label = null;
    @property()
    typs: string = "yellowCoin";
    @property()
    prefix: string = "";
    @property()
    isClick:boolean = true;
    // LIFE-CYCLE CALLBACKS:
    data: { num: number } = {num: 0};
    private static _targets: cc.Node[] = [];

    static getTarget(type: string): cc.Node {
        const list = this._targets;
        if (list.length === 0) {
            return null;
        }
        const matchType = (node: cc.Node) => {
            const comp = node.getComponent(CashFishCredit);
            return comp && comp.typs === type;
        };
        // 优先：同类型且在屏幕内的节点（旧逻辑）
        for (let i = list.length - 1; i >= 0; i--) {
            if (!matchType(list[i])) continue;
            const targetRect = list[i].getBoundingBoxToWorld();
            const winRect = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
            if (winRect.containsRect(targetRect)) {
                return list[i];
            }
        }
        // 其次：任意同类型（修复原先只有 1 个注册项时忽略 type、直接返回黄币目标的问题）
        for (let i = list.length - 1; i >= 0; i--) {
            if (matchType(list[i])) {
                return list[i];
            }
        }
        return null;
    }

    static isUnlocked(type: string): boolean {
        if (type === 'yellowCoin') {
            return true;
        } else if (type === 'greenCoin') {
            return !FrameSDK.frameData.gameData.noProfitAd && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel && FrameData.saveData.charityGuideIndex > 0;
        }
    }

    onLoad() {
        cc.director.on('UNLOCK_CHARITY', this._onUnlockCharity, this);
        if (null == this.creditNum) {
            this.creditNum = this.getComponent(cc.Label) || this.getComponentInChildren(cc.Label);
        }
        this.addNode && (this.addNode.active = false);
        this.data.num = FrameData.saveData.credit[this.typs];
        this.updatecreditString();
        FrameSDK.addCreditListen(this.updatecredit, this);
        // cc.director.on("update_credit_" + this.typs, this.updatecredit, this);
        CashFishCredit._targets.push(this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, this.openRedeem, this);
        this.updateUI();
    }

    openRedeem() {
        if(!this.isClick)return;
        if (this.typs == "yellowCoin") {
            FrameSDK.openPanel_Yellow();
            if (FrameData.saveData.guideInedx == 0) {
                FrameData.saveData.guideInedx++;
                Frame.ins.setGuideShow(false);
            }
        } else {
            FrameSDK.openPanel_Charity();
            if (FrameData.saveData.charityGuideIndex == 0) {
                FrameData.saveData.charityGuideIndex++;
                Frame.ins.setGuide2Show(false);
            }
        }
    }

    onDestroy() {
        cc.director.removeAll(this);
        CashFishCredit._targets.splice(CashFishCredit._targets.indexOf(this.node), 1);
    }

    updatecreditString(num?: number) {
        num = num == undefined ? this.data.num : num;
        this.creditNum.string = this.getcreditString(num);
    }

    updatecredit(data: { type: string, num: number, change: number }) {
        if (data.type == this.typs && cc.isValid(this.addNode)) {
            const handler = data.type === 'yellowCoin' ? FrameSDK.convertCoinToStr : FrameSDK.convertCharityToStr;

            cc.Tween.stopAllByTarget(this.data);

            if (data.change > 0) {
                this.addNode.active = true;
                this.addNode.scale = 0;
                this.addNum.string = "+" + handler.call(FrameSDK, data.change);
                cc.tween(this.addNode).to(0.1, {scale: 1}).start();
            }

            cc.tween(this.data).to(0.5, {num: data.num}, {
                progress: (start, end, current, ratio) => {
                    let num = start + (end - start) * ratio;
                    cc.isValid(this.node) && this.updatecreditString(num);
                    return num;
                }
            }).call(() => {
                if (cc.isValid(this.node)) {
                    this.data.num = data.num;
                    this.addNode.active = false;
                    this.updatecreditString(this.data.num);
                }
            }).start();
        }
    }


    getcreditString(num: number): string {
        let str = this.typs === 'yellowCoin' ? FrameSDK.convertCoinToStr(num) : FrameSDK.convertCharityToStr(num);
        str = this.prefix + str;
        return str;
    }

    updateUI(): void {
        this.node.active =  CashFishCredit.isUnlocked(this.typs);
    }

    private _onUnlockCharity(): void {
        if (this.typs === 'greenCoin' && !FrameSDK.frameData.gameData.noProfitAd) {
            this.node.active = true;
        }
    }

}
