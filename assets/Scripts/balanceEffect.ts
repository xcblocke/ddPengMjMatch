const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class balanceEffect extends cc.Component {
  @property(cc.Sprite)
  sprite_1: cc.Sprite = null;
  start() {}
}