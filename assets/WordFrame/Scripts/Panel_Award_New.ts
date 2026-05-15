import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel_Award_New extends cc.Component {

    @property(sp.Skeleton)
    titleSkeleton: sp.Skeleton = null;
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Node)
    focus: cc.Node = null;

    @property(cc.Node)
    newcommer: cc.Node = null;

    @property(sp.Skeleton)
    superprize: sp.Skeleton = null;

    @property(cc.Node)
    boxNode: cc.Node = null;

    @property(cc.SpriteFrame)
    front: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    queen: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    openBG: cc.SpriteFrame = null;

    @property(cc.Node)
    dialog: cc.Node = null;

    @property(cc.Label)
    dialogLabel: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:
    viewData: { closeCB: () => void } = null;

    awardList = [];
    isTouch = false;

    protected onEnable(): void {
        FrameSDK.openEffect(this, {opacity: 233});
        FrameSDK.playEffect("newbiepage_show");

        if (this.titleSkeleton) {
            this.titleSkeleton.setAnimation(0, "start", false);
            this.titleSkeleton.addAnimation(0, "loop", true);
        }

        // FrameSDK.logGameEvent('sdywords_game_new', {
        //     object_action: 'show',
        //     object_name: 'new_3',
        // }, true);
        // FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_button", "guide_start");

        this.focus.active = true;
        this.focus.opacity = 0;
        this.superprize.node.active = false;

        this.awardList = [
            FrameData.FRAME_CONF.OutputConfig.new,
            FrameSDK.randomInt(FrameData.FRAME_CONF.OutputConfig.newRandom),
            FrameSDK.randomInt(FrameData.FRAME_CONF.OutputConfig.newRandom),
        ];

        this.boxNode.children.forEach((value, index) => {
            value.on(cc.Node.EventType.TOUCH_END, this.openBox.bind(this, index), this);
            cc.find("light", value).active = false;
            cc.find("layout/label", value).getComponent(cc.Label).string = `${FrameSDK.convertCoinToStr(this.awardList[index])}`;
            cc.find("click", value).active = false;
            cc.find("kamian", value).active = false;
            this.boxAin(1, index, 1.4, index === 0 ? () => {
                this.dialog.active = true;
                this.dialogLabel.string = `skey_095`;
                this.dialogLabel.node.scale = 0.8;
                cc.Tween.stopAllByTarget(this.dialogLabel.node);
                cc.tween(this.dialogLabel.node)
                    .to(0.3, { scale: 1 }, { easing: 'backOut' })
                    .start();
            } : undefined);
        });

        this.dialog.active = false;
        this.dialogLabel.string = ``;
        cc.Tween.stopAllByTarget(this.dialogLabel.node);
    }

    onDisable() {
        var e, t;
        null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
    }

    boxAin(type, index, dt = 1, call?) {
        let box = this.boxNode.children[index];

        if (type == 1) {
            let endpoint = cc.v3(box.position);

            cc.tween(box)
                .delay(dt)
                .to(0.2, {scaleX: 0})
                .call(() => {
                    cc.find("pai", box).getComponent(cc.Sprite).spriteFrame = this.front;

                    cc.find("layout", box).active = false;
                    cc.find("robux3", box).active = false;
                })
                .to(0.2, {scaleX: 1})
                .to(0.5, {position: cc.v3()})
                .delay(0.1)
                .to(0.5, {position: endpoint})
                .call(() => {
                    this.isTouch = true;
                    cc.find("click", box).active = true;
                    call && call();
                })
                .start();
        } else {
            if (index === 0) {
                FrameSDK.playEffect("newbiepage_show");
            }

            cc.tween(box)
                .delay(dt)
                .to(0.2, {scaleX: 0})
                .call(() => {
                    if(type == 0 && index == 0 && dt == 0){
                        cc.find("pai", box).getComponent(cc.Sprite).spriteFrame = this.openBG;
                        cc.find("e_guang", box).active = true;
                    }else{
                        cc.find("pai", box).getComponent(cc.Sprite).spriteFrame = this.queen;
                        cc.find("e_guang", box).active = false;
                    }
                    cc.find("layout", box).active = true;
                    cc.find("robux3", box).active = true;
                })
                .to(0.2, {scaleX: 1})
                .call(() => {
                    cc.find("light", box).active = index == 0;
                    cc.find("kamian", box).active = index !== 0;
                    call && call();
                })
                .start();
        }
    }

    openBox(index_box) {
        if (!this.isTouch) return;
        this.isTouch = false;
        let box1 = this.boxNode.children[0];
        let box2 = this.boxNode.children[index_box];
        let point1 = box1.position;
        box1.position = box2.position;
        box2.position = point1;

        FrameSDK.logGameEvent('sdywords_game_new', {
            object_action: 'show',
            object_name: 'new_4',
        }, true);

        this.boxNode.children.forEach((value, index) => {
            cc.find("click", value).active = false;
        });

        this.boxAin(0, 0, 0, () => {
            let dt = 1;
            for (let i = 1; i < this.boxNode.childrenCount; i++) {
                dt += 0.2;
                this.boxAin(0, i, dt);
                if (i == this.boxNode.childrenCount - 1) {
                    // cc.find("pai", this.boxNode[i]).getComponent(cc.Sprite).spriteFrame = this.openBG;
                    cc.Tween.stopAllByTarget(this.dialogLabel.node);
                    cc.tween(this.dialogLabel.node)
                        .delay(dt + 0.6)
                        .call(() => {
                            FrameSDK.playEffect("newbiepage_show");

                            this.dialogLabel.string = `skey_096`;
                            this.dialogLabel.node.scale = 0.8;
                        })
                        .to(0.3, { scale: 1 }, { easing: 'backOut' })
                        .start();
                    this.scheduleOnce(this.playSuperPrize, dt + 1);
                }
            }
        });
    }

    playSuperPrize() {
        // FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_reward", "guide_button");

        this.superprize.node.active = true;
        this.superprize.setAnimation(0, 'start', false);
        this.superprize.addAnimation(0, 'loop', true);

        cc.tween(this.superprize)
            .delay(3)
            .call(() => {
                FrameSDK.logGameEvent('sdywords_game_new', {
                    object_action: 'show',
                    object_name: 'new_5',
                }, true);

                FrameSDK.addCoin(this.awardList[0], 0, 0, () => {
                    Frame.ins.setGuideShow(true);
                });

                this.onTouchCloseTips();
            })
            .start();

        let box = this.boxNode.children[0];
        box.parent = this.focus.parent;


        cc.tween(this.focus)
            .to(0.5, {opacity: 255})
            .start();

        cc.tween(box)
            .to(1, {position: cc.v3(), scale: 1.3})
            .call(() => {
                box.getChildByName("particle_texture").active = true;
            })
            .start();

        cc.tween(this.newcommer)
            .to(0.3, {scale: 0}, {easing: "sineIn"})
            .start();
    }

    hideTime = 0;

    onTouchCloseTips() {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    // update (dt) {}
}
