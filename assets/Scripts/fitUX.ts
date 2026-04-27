const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass("FitUX")
@menu("自定义组件/common/FitUX")
export class FitUX extends cc.Component {
  @property
  _isScaleSize = false;
  @property(cc.Boolean)
  get isScaleSize() {
    return this._isScaleSize;
  }
  set isScaleSize(e) {
    this._isScaleSize = e;
    this.fitScale();
  }
  onEnable() {
    this.fitScale();
  }
  resetInEditor() {}
  onRestore() {}
  start() {
    this.fitScale();
  }
  fitScale() {
    var e = this.node.getComponent(cc.Sprite).spriteFrame.getRect();
    if (this.isScaleSize) {
      this.node.scale = 1;
      this.node.width = 0.67 * e.width;
      this.node.height = 0.67 * e.height;
    } else {
      this.node.scale = 0.67;
      this.node.width = e.width;
      this.node.height = e.height;
    }
  }
  onLoad() {
    this.fitScale();
  }
}