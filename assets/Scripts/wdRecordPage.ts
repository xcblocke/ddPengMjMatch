import AudioManager from './framework/controller/AudioManager';
import recordItem from './prefab/recordItem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class wdRecordPage extends BasePage {
  @property(cc.Node)
  ui_wdRecordScroll: cc.Node = null;
  @property(cc.Node)
  record_content: cc.Node = null;
  @property(cc.Node)
  ui_wdRecord: cc.Node = null;
  @property(cc.Prefab)
  record_item: cc.Prefab = null;
  record_mgr = [];
  _init(e) {
    if (e.info.length > 0) {
      this.ui_wdRecordScroll.active = true;
      this.ui_wdRecord.active = false;
      this.createWdItem(e);
    } else {
      this.ui_wdRecord.active = true;
      this.ui_wdRecordScroll.active = false;
    }
  }
  createWdItem(e) {
    for (var t = 0; t < e.info.length; t++) {
      var o = this.record_mgr[t];
      if (!o) {
        var n = cc.instantiate(this.record_item);
        n.parent = this.record_content;
        o = n.getComponent(recordItem);
        this.record_mgr.push(o);
      }
      o.init(e.info[t]);
      cc.instantiate(this.ui_wdRecord);
    }
  }
  start() {}
  click_close() {
    AudioManager.getInstance().playMusic("btntouch");
    this._hide();
  }
}