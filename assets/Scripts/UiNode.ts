const {
  ccclass,
  property
} = cc._decorator;
export var UiNodeType = {
  LABEL: "label",
  BUTTON: "button",
  SPRITE: "sprite",
  RICH_TEXT: "richText",
  NODE: "node"
};
(UiNodeTypeMap = {})[UiNodeType.LABEL] = cc.Label;
UiNodeTypeMap[UiNodeType.BUTTON] = cc.Button;
UiNodeTypeMap[UiNodeType.SPRITE] = cc.Sprite;
UiNodeTypeMap[UiNodeType.RICH_TEXT] = cc.RichText;
UiNodeTypeMap[UiNodeType.NODE] = cc.Node;
export var UiNodeTypeMap = UiNodeTypeMap;
@ccclass
export default class UiNode extends cc.Component {
  _uiNodes = new Map();
  _uiLabels = new Map();
  _uiButtons = new Map();
  _uiSprites = new Map();
  _uiRichTexts = new Map();
  get uiNodes() {
    0 === this._uiNodes.size && this.init();
    return this._uiNodes;
  }
  get uiLabels() {
    0 === this._uiNodes.size && this.init();
    return this._uiLabels;
  }
  get uiButtons() {
    0 === this._uiNodes.size && this.init();
    return this._uiButtons;
  }
  get uiSprites() {
    0 === this._uiNodes.size && this.init();
    return this._uiSprites;
  }
  get uiRichTexts() {
    0 === this._uiNodes.size && this.init();
    return this._uiRichTexts;
  }
  init() {
    this._uiNodes.size > 0 || this.traverseChildren(this.node);
  }
  traverseChildren(e) {
    if (e) for (var t = 0; t < e.children.length; t++) {
      var o = e.children[t],
        n = o.name;
      this._uiNodes.set(n, o);
      var a = o.getComponent(cc.Label);
      a && this._uiLabels.set(n, a);
      var i = o.getComponent(cc.Button);
      i && this._uiButtons.set(n, i);
      var r = o.getComponent(cc.Sprite);
      r && this._uiSprites.set(n, r);
      var c = o.getComponent(cc.RichText);
      c && this._uiRichTexts.set(n, c);
      this.traverseChildren(o);
    }
  }
  onLoad() {
    this.init();
  }
  start() {}
}