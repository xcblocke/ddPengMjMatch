// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AinEff extends cc.Component {

    @property
    dtime = 0.2;
    @property
    stime = 0.2;
    @property
    isHuXI = false;
    @property
    showScale = 0.2;

    // LIFE-CYCLE CALLBACKS:
    tween: cc.Tween = null;

    onEnable() {
        if (this.tween) {
            this.tween.stop();
        }
        this.tween = cc.tween(this.node)
            .hide()
            .set({scaleX: this.showScale, scaleY: this.showScale})
            .delay(this.dtime)
            .show()
            .to(this.stime, {scaleX: 1, scaleY: 1}, {easing: "backOut"})
            .call(() => {
                if (this.isHuXI) {
                    cc.tween(this.node)
                        .to(0.5, {scale: 1.1}, { easing: 'sineInOut' })
                        .to(0.5, {scale: 1}, { easing: 'sineInOut' }).union().repeatForever().start();
                } else {
                    this.tween = null;
                }
            }).start();
    }


    // update (dt) {}
}
