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
  LoadScene: `gkey_275`
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
  get curPercent() {
    return this._curPercent;
  }
  set curPercent(e) {
    this._curPercent = e;
    this.progress.fillRange = e;
    this.progressLabel.string = Math.floor(100 * e) + "%";
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
    this.curPercent = 0;
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