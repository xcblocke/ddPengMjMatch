import AudioManager from './framework/controller/AudioManager';
import { gameData } from './data/GameData';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class gradePopPage extends BasePage {
  @property(cc.Label)
  label_grade_name: cc.Label = null;
  @property(cc.Label)
  label_grade_num: cc.Label = null;
  @property(cc.Label)
  label_grade_next: cc.Label = null;
  @property(cc.Label)
  label_progress: cc.Label = null;
  @property(cc.Sprite)
  progress_bar: cc.Sprite = null;
  _init() {
    var e = gameData._grade_pop_data;
    this.label_grade_name.string = e.current_level.level_name;
    this.label_grade_num.string = e.finish_count;
    var t = e.success_count / e.next_level_need_count;
    this.progress_bar.fillRange = t;
    this.label_progress.string = e.success_count + "/" + e.next_level_need_count;
    var o = e.next_level_need_count - e.success_count;
    this.label_grade_next.string = "距离下一称号，还差" + o + "关";
    e.show_progress || (this.progress_bar.node.parent.parent.active = false);
    AudioManager.getInstance().playMusic("grade_pop");
  }
  onLoad() {
    super.onLoad.call(this);
  }
  close() {
    AudioManager.getInstance().stopMusic("grade_pop", false);
    AudioManager.getInstance().playMusic("btntouch");
    super._hide.call(this);
  }
  onBtnSure() {
    this.close();
  }
}