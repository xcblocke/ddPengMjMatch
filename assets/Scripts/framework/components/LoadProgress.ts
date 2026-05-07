const {
  ccclass,
  property,
  menu
} = cc._decorator;
export enum LoadProgressType {
  FakeAnim = 0,
  CheckHotUpdate = 1,
  PreLoadRes = 2,
  LoadScene = 3,
}
export var LoadProgressTip = {
  FakeAnim: `gkey_213`,
  CheckHotUpdate: `gkey_273`,
  PreLoadRes: `gkey_274`,
  LoadScene: `gkey_213`
};
@ccclass
@menu("自定义组件/LoadProgress")
export default class LoadProgress extends cc.Component {
  @property({
    type: cc.Boolean,
    displayName: "是否显示Handle节点"
  })
  isHasHandle: boolean = true;
  @property({
    type: cc.Node,
    displayName: "进度条Handle节点"
  })
  progressHandle: cc.Node = null;
  @property(cc.Sprite)
  progress: cc.Sprite = null;
  @property(cc.Label)
  progressLabel: cc.Label = null;
  @property(cc.Label)
  loadingTipLabel: cc.Label = null;
  _animObj = null;
  _curPercent = 0;
  _loadType = LoadProgressType.FakeAnim;
  /** 为 true 时：外部设置的是目标值，每帧用插值逼近，避免进度猛跳 */
  _smoothFollow = false;
  _smoothTarget = 0;
  get curPercent() {
    return this._curPercent;
  }
  set curPercent(e) {
    e = Math.max(0, Math.min(1, e));
    if (this._smoothFollow) {
      this._smoothTarget = e;
      return;
    }
    this.applyPercentImmediate(e);
  }
  /** 进入场景加载阶段时调用：进度改为平滑跟随目标 */
  beginSmoothFollow() {
    this._smoothFollow = true;
    this._smoothTarget = this._curPercent;
  }
  /** 关闭插值并一次性对齐到当前目标（用于切场景前瞬间拉满，避免还要等插值） */
  snapSmoothToTarget() {
    this.applyPercentImmediate(this._smoothTarget);
  }
  endSmoothFollow() {
    this._smoothFollow = false;
  }
  applyPercentImmediate(e) {
    this._curPercent = e;
    this.progress.fillRange = e;
    this.progressLabel.string = Math.round(100 * e) + "%";
    this.updateHandlePos();
  }
  update(dt) {
    if (!this._smoothFollow || !this.progress) return;
    var target = this._smoothTarget;
    var cur = this._curPercent;
    var diff = target - cur;
    if (Math.abs(diff) < 1e-4) {
      if (cur !== target) this.applyPercentImmediate(target);
      return;
    }
    var k = 18;
    var alpha = 1 - Math.exp(-k * dt);
    if (alpha > 1) alpha = 1;
    this.applyPercentImmediate(cur + diff * alpha);
  }
  get loadType() {
    return this._loadType;
  }
  set loadType(e) {
    this._loadType = e;
    this.loadingTipLabel.string = LoadProgressTip[LoadProgressType[e]];
  }
  init() {
    this.progressHandle && (this.progressHandle.active = this.isHasHandle);
    this._animObj = null;
    this._smoothFollow = false;
    this.curPercent = 0;
  }

  updateHandlePos() {
    if (!this.progressHandle || !this.progress || !this.progress.node) return;
    var barNode = this.progress.node;
    var parent = this.progressHandle.parent || barNode.parent;
    if (!parent) return;

    // Get bar left/right points in bar local space (respect anchor)
    var w = barNode.width;
    var leftLocal = cc.v3(-barNode.anchorX * w, 0, 0);
    var rightLocal = cc.v3((1 - barNode.anchorX) * w, 0, 0);

    var leftWorld = barNode.convertToWorldSpaceAR(leftLocal);
    var rightWorld = barNode.convertToWorldSpaceAR(rightLocal);

    var left = parent.convertToNodeSpaceAR(leftWorld);
    var right = parent.convertToNodeSpaceAR(rightWorld);

    var x = left.x + (right.x - left.x) * this._curPercent;
    this.progressHandle.x = x;
  }
  async startLoadProgress() {
    this.loadType = LoadProgressType.FakeAnim;
    this.playFakeProgress();
    return;
  }
  playFakeProgress() {
    var e = this;
    this._animObj = {
      value: this.curPercent
    };
    var t = 0.2 * Math.random() + 0.7;
    0 != this.curPercent && (t = this.curPercent + 0.5 * (1 - this.curPercent));
    cc.tween(this._animObj).to(1, {
      value: t
    }, {
      progress: function (t, o, n, a) {
        e.curPercent = t + (o - t) * a;
      }
    }).call(function () {
      null != e._animObj && e.playFakeProgress();
    }).start();
  }
  stopFakeProgress() {
    cc.Tween.stopAllByTarget(this._animObj);
    this._animObj = null;
  }
}