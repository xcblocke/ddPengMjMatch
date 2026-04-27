import EngineUtil from './framework/EngineUtil';
import { appTheme } from './config';
const {
  ccclass,
  property
} = cc._decorator;
enum r {
  SP = 0,
  Color = 1,
}
@ccclass
export default class appThemeComp extends cc.Component {
  @property({
    type: cc.Enum(r)
  })
  compType: number = r.SP;
  @property({
    visible: function () {
      return this.compType === r.SP;
    },
    type: cc.SpriteFrame
  })
  spFrames: cc.SpriteFrame = [];
  @property({
    visible: function () {
      return this.compType === r.Color;
    },
    type: cc.String
  })
  lbColors: string = [];
  onLoad() {
    if (this.compType === r.SP) {
      this.node.getComponent(cc.Sprite).spriteFrame = this.spFrames[appTheme];
    } else {
      this.node.color = EngineUtil.getColor(this.lbColors[appTheme]);
    }
  }
}