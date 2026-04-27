const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class UIItemDay extends cc.Component {
  @property(cc.Label)
  lbDay: cc.Label = null;
  @property(cc.Label)
  lbDay2: cc.Label = null;
  @property(cc.Sprite)
  spSel: cc.Sprite = null;
  index = 0;
  day = 0;
  cb = null;
  setDay(e, t, o, n) {
    this.index = e;
    this.day = t;
    this.cb = n;
    this.lbDay.string = t;
    this.lbDay2.string = t;
    this.spSel.node.active = o;
  }
  onClickItem() {
    this.cb && this.cb(this.index, this.day);
  }
}