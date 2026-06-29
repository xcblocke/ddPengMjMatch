// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RDM_Toast extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    text: string = "";

    onLoad() {
        this.label.string = this.text;
    }

    start() {
        var e = this;
        cc.tween(this.node).delay(0.01).by(0.8, {
            y: 150
        }).delay(0.7).call(() => {
            e.node.destroy();
        }).start();
    }

}
