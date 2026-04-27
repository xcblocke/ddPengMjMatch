import PageMgr from '../view/PageMgr';
class _SetNode2Top {
  static _interface = null;
  static nodeMap = new Map();
  constructor() {
    _SetNode2Top.nodeMap = new Map();
  }
  static _getInterface() {
    _SetNode2Top._interface || (_SetNode2Top._interface = new _SetNode2Top());
    return _SetNode2Top._interface;
  }
  setTopZIndex(t) {
    var o = t.uuid;
    if (_SetNode2Top.nodeMap.has(o)) {
      var a = _SetNode2Top.nodeMap.get(o);
      t.parent = a.originParent;
      t.position = a.originPos;
    } else _SetNode2Top.nodeMap.set(o, {
      originPos: t.position,
      originParent: t.parent
    });
    var i = t.parent.convertToWorldSpaceAR(t.position);
    PageMgr.setToastNode(t);
    t.position = t.parent.convertToNodeSpaceAR(i);
  }
  restoreNode(t) {
    var o = t.uuid;
    console.log("restoreNode", o, _SetNode2Top.nodeMap);
    if (_SetNode2Top.nodeMap.has(o)) {
      var n = _SetNode2Top.nodeMap.get(o);
      t.parent = n.originParent;
      t.position = n.originPos;
    }
  }
}
export default _SetNode2Top._getInterface();