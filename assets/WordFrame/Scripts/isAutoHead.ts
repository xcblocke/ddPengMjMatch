// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


enum EnumType_1 {
    isTop,
    isBottom
}

@ccclass("AutoHeadType2")
class AutoHeadType {
    @property({
        type: cc.Enum(EnumType_1)
    })
    type = EnumType_1.isTop;
    @property()
    num: number = 65;
}

@ccclass
export default class isAutoHead extends cc.Component {
    @property([AutoHeadType])
    autoDatas: AutoHeadType[] = [{type: EnumType_1.isTop, num: 65}];

    onLoad() {
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            for (let data of this.autoDatas) {
                if (data.type == 0) {
                    this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + data.num;
                }
                if (data.type == 1) {
                    this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + data.num;
                }
            }
        }
    }
}
