// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {

    @property(cc.Node)
    gou: cc.Node = null;
    @property(cc.Node)
    currNode: cc.Node = null;
    @property(cc.Node)
    WithdrawNode:cc.Node = null;
    @property(cc.Node)
    gn_unlock:cc.Node = null;
    @property(cc.Node)
    statueNode:cc.Node = null;
    @property(cc.Sprite)
    gn_icon:cc.Sprite = null;
    @property(cc.Node)
    level_loop:cc.Node = null;

    @property(cc.Label)
    LevelNumber:cc.Label = null;
    @property(cc.Label)
    FeatureTip:cc.Label = null;

    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
