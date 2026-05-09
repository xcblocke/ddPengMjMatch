const {ccclass, property} = cc._decorator;

@ccclass
export default class PaymentItem extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spriteFrames: cc.SpriteFrame[] = [];

    set paymentID(value: number) {
        const spriteFrame = this.spriteFrames[value - 101];
        if (spriteFrame) {
            this.node.active = true;
            this.sprite.spriteFrame = spriteFrame;
        } else {
            this.node.active = false;
            this.sprite.spriteFrame = null;
        }
    }

}