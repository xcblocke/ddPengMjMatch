import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import GlobaldataMgr from './framework/data/GlobaldataMgr';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import AdManager from './framework/Platform/AdManager';
import SdkHelper from './framework/SdkHelper';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class main extends cc.Component {
  onLoad() {
    EventMgr.listen(GameEventType.UPDATE_BALANCE, this.update_balance, this);
    EventMgr.listen(GameEventType.UPDATE_BUBBLE, this.update_bubble, this);
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.UPDATE_BALANCE, this.update_balance, this);
    EventMgr.ignore(GameEventType.UPDATE_BUBBLE, this.update_bubble, this);
  }
  start() {
    SdkHelper.requestBasicPermission();
    AudioManager.getInstance().init();
    AudioManager.getInstance().initNativeUrl();
    AudioManager.getInstance().playMusic("bg", true, true);
    this.update_balance();
    this.update_bubble();
    GlobaldataMgr.auth_type && SdkHelper.ysdkLogin();
    GlobaldataMgr.reportData();
    PlayerDataSys.is_reviewer && SdkHelper.reportData("main_is_reviewer");
  }
  update_balance() {}
  update_bubble() {}
  setTest() {
    AdManager.getInstance().noAdTest = true;
  }
}