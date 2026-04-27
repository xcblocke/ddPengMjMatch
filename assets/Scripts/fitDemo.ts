import { gameData } from './data/GameData';
const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass("FitDemo")
@menu("自定义组件/common/FitDemo")
export class FitDemo extends cc.Component {
  @property(cc.Boolean)
  isHide: boolean = true;
  onLoad() {
    if (this.isHide) {
      this.node.active = !gameData.isOpenDemo;
    } else {
      this.node.active = gameData.isOpenDemo;
    }
  }
}