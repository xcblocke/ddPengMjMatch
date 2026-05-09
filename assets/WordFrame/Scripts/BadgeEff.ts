// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BadgeEff extends cc.Component {

    @property
    cycleTime: number = 1;

    @property
    angle: number = 20;

    @property
    offsetY: number = 5;

    // LIFE-CYCLE CALLBACKS:
    tween: cc.Tween = null;

    onLoad() {
        if (this.tween) {
            this.tween.stop();
        }

        const originalY = this.node.y;
        const subTime = this.cycleTime / 4;

        this.node.angle = -this.angle;

        this.tween = cc.tween(this.node)
            .to(subTime, { y: { value: originalY + 5, easing: 'sineInOut' }, angle: 0 })
            .to(subTime, { y: { value: originalY, easing: 'sineInOut' }, angle: this.angle })
            .to(subTime, { y: { value: originalY + 5, easing: 'sineInOut' }, angle: 0 })
            .to(subTime, { y: { value: originalY, easing: 'sineInOut' }, angle: -this.angle })
            .union()
            .repeatForever()
            .start();
    }

}
