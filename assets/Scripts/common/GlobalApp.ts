class n {
  _AdSchedule = null;
  _GameMain = null;
  _PackagingProcessGuide = null;
  _TouchCtrl = null;
  static _instance = null;
  get GameMain() {
    return this._GameMain;
  }
  set GameMain(e) {
    this._GameMain = e;
  }
  get TouchCtrl() {
    return this._TouchCtrl;
  }
  set TouchCtrl(e) {
    this._TouchCtrl = e;
  }
  get PackagingProcessGuide() {
    return this._PackagingProcessGuide;
  }
  set PackagingProcessGuide(e) {
    this._PackagingProcessGuide = e;
  }
  get AdSchedule() {
    return this._AdSchedule;
  }
  set AdSchedule(e) {
    this._AdSchedule = e;
  }
  static get instance() {
    this._instance || (this._instance = new n());
    return this._instance;
  }
}
export default n.instance;