// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {
  ccclass,
  property
} = cc._decorator;
@ccclass("aniObj")
class aniObj {
  @property()
  name: string = "";
  @property()
  isLoop: boolean = false;
}
@ccclass
export default class SkeletonEx2 extends cc.Component {
  @property([aniObj])
  animationArray: aniObj[] = [];

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    let skeleton = this.node.getComponent(sp.Skeleton);
    if (skeleton && this.animationArray.length > 0) {
      for (let i = 0; i < this.animationArray.length; i++) {
        let data = this.animationArray[i];
        if (i == 0) {
          skeleton.setAnimation(0, data.name, data.isLoop);
        } else {
          skeleton.addAnimation(0, data.name, data.isLoop);
        }
      }
    }
  }

  // start() {
  //
  // }

  // update (dt) {}
}