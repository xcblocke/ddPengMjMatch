import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class removeUserPage extends BasePage {
  @property(cc.Node)
  sureArr: cc.Node = [];
  @property(cc.Label)
  title: cc.Label = null;
  @property(cc.Label)
  arr_desc: cc.Label = [];
  sures = 0;
  okSures = 3;
  reviewing_desc = ["您APP里的权益积分将会永久删除", "您的设备信息将会永久删除", "我已阅读并同意上面两个选项"];
  _init() {
    this.sures = 0;
    this.sureArr.forEach(function (e) {
      e.active = false;
    });
  }
  click(e, t) {
    if (e) {
      t = Number(t);
      this.sureArr[t].active = !this.sureArr[t].active;
      if (this.sureArr[t].active) {
        this.sures++;
      } else {
        this.sures--;
      }
    }
  }
  remove() {
    if (PlayerDataSys.bindwx) {
      if (this.sures === this.okSures) {
        GameSystem.removeUser({
          yid: PlayerDataSys.yid
        }).then(function (e) {
          if (e && 1 == e.code) {
            PageMgr.clear();
            EngineUtil.setLocalData("yid", "");
            cc.sys.localStorage.removeItem("useSkinIdx");
            AudioManager.getInstance().stopMusic("bg", true);
            SdkHelper.showToast("用户已注销~");
            cc.game.restart();
          } else SdkHelper.showToast(e.message || "网络异常，检查网络后重试");
        });
      } else {
        SdkHelper.showToast("您需同意所有条款，才能进行账户注销");
      }
    } else {
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "wxLoginPage",
        data: {
          type: "bind"
        }
      });
    }
  }
  close() {
    this._hide();
  }
  continue() {
    EventMgr.trigger(GameEventType.CLOSE_PERSONPAGE);
  }
}