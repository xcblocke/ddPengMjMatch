const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass
@menu("自定义组件/GradientLabel")
export default class gradientLabel extends cc.Component {
  @property
  _colors = [];
  @property({
    type: [cc.Color]
  })
  get colors() {
    return this._colors;
  }
  set colors(e) {
    this._colors = e;
    this._updateColors();
  }
  onEnable() {
    cc.director.once(cc.Director.EVENT_AFTER_DRAW, this._updateColors, this);
  }
  _updateColors() {
    var e = this.getComponent(cc.RenderComponent);
    if (e) {
      var t = e._assembler;
      if (t instanceof cc.Assembler2D) {
        var o = t._renderData.uintVDatas[0];
        if (o) for (var n = this.node.color, a = t.floatsPerVert, i = 0, r = t.colorOffset, c = o.length; r < c; r += a) o[r] = (this.colors[i++] || n)._val;
      }
    }
  }
  onDisable() {
    cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._updateColors, this);
    this.node._renderFlag |= cc.RenderFlow.FLAG_COLOR;
  }
}