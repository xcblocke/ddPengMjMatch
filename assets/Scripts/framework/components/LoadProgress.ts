import UrlMgr from "../../service/UrlMgr";

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
  /** 显示用百分比（0~100），避免 Label 每帧四舍五入抖动 */
  _displayPercentInt = 0;
  /** 平滑跟随：每秒最小前进比例（目标仍高于当前时） */
  _smoothMinSpeed = 0.12;
  /** 指数跟随系数，越小越丝滑、追上目标越慢 */
  _smoothDamping = 9;
  get curPercent() {
    return this._curPercent;
  }
  set curPercent(e) {
    e = Math.max(0, Math.min(1, e));
    if (this._smoothFollow) {
      if (e > this._smoothTarget) {
        this._smoothTarget = e;
      }
      return;
    }
    this.applyPercentImmediate(e);
  }
  /** 进入场景加载阶段时调用：进度改为平滑跟随目标 */
  beginSmoothFollow(minSpeed?: number, damping?: number) {
    this._smoothFollow = true;
    this._smoothTarget = this._curPercent;
    if (minSpeed != null) {
      this._smoothMinSpeed = minSpeed;
    }
    if (damping != null) {
      this._smoothDamping = damping;
    }
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
    if (this.progress) {
      this.progress.fillRange = e;
    }
    var nextInt = Math.min(100, Math.floor(100 * e + 1e-5));
    if (this.progressLabel && nextInt !== this._displayPercentInt) {
      this._displayPercentInt = nextInt;
      this.progressLabel.string = nextInt + "%";
    }
    this.updateHandlePos();
  }
  update(dt) {
    if (!this._smoothFollow || !this.progress) return;
    var target = this._smoothTarget;
    var cur = this._curPercent;
    var diff = target - cur;
    if (diff <= 1e-5) {
      if (cur !== target) {
        this.applyPercentImmediate(target);
      }
      return;
    }
    var alpha = 1 - Math.exp(-this._smoothDamping * dt);
    if (alpha > 1) {
      alpha = 1;
    }
    var step = diff * alpha;
    var minStep = this._smoothMinSpeed * dt;
    if (step < minStep) {
      step = minStep > diff ? diff : minStep;
    }
    this.applyPercentImmediate(cur + step);
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
    this._displayPercentInt = -1;
    this.curPercent = 0;
  }

  onClickPrivacy() {
    if (cc.sys.isNative) { // 判断是否为原生平台 (Android/iOS)
        cc.sys.openURL(UrlMgr.getInstance().privacyUrl);
        console.log(`尝试在系统浏览器中打开：${UrlMgr.getInstance().privacyUrl}`);
    } else {
        // Web端预览时的备用方案
        window.open(UrlMgr.getInstance().privacyUrl, '_blank');
    }
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