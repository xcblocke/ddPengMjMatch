import { DebugConfig } from './DebugConfig';
import DebugList from './DebugList';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class DebugNode extends cc.Component {
  @property(cc.Node)
  debugListItem: cc.Node = null;
  isOpen = true;
  @property(cc.Node)
  openCloseNode: cc.Node = null;
  isDragging = false;
  touchStartPos = cc.v2(0, 0);
  nodeStartPos = cc.v3(0, 0, 0);
  dragThreshold = 10;
  isMoving = false;
  childrenNodes = [];
  onLoad() {
    this.openCloseNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.openCloseNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.openCloseNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.openCloseNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    this.scheduleOnce(() => {
        this.suoxiao();
    }, 0.3);
  }
  suoxiao() {
    this.childrenNodes.forEach(function (e) {
      e.active = !e.active;
    });
  }
  onTouchStart() {
    this.isMoving = false;
  }
  onTouchMove(e) {
    var t = e.getDelta();
    if (0 != t.x || 0 != t.y) {
      this.isMoving = true;
      this.node.position = this.node.position.add(new cc.Vec3(t.x, t.y, 0));
    }
  }
  onTouchEnd() {
    this.isMoving || this.suoxiao();
  }
  resetPosition() {
    var e = cc.winSize,
      t = this.node.getContentSize();
    this.node.position = cc.v3(e.width / 2 - t.width / 2 - 10, e.height / 2 - t.height / 2 - 10, 0);
  }
  init() {
    var e = this;
    this.debugListItem.parent = null;
    DebugConfig.forEach(function (t) {
      var o = cc.instantiate(e.debugListItem);
      o.addComponent(DebugList);
      o.getComponent(DebugList).init(t);
      o.parent = e.node;
      e.childrenNodes.push(o);
    });
  }
  start() {}
}