const {
  ccclass,
  property
} = cc._decorator;
@ccclass("ToggleComp")
export class ToggleComp extends cc.Component {
  @property({
    type: [cc.Node],
    tooltip: "选中显示"
  })
  onNodes: [cc.Node] = [];
  @property({
    type: [cc.Node],
    tooltip: "未选中显示"
  })
  offNodes: [cc.Node] = [];
  SetIsOn(e) {
    for (var t = 0; t < this.onNodes.length; t++) this.onNodes[t].active = e;
    for (t = 0; t < this.offNodes.length; t++) this.offNodes[t].active = !e;
  }
}