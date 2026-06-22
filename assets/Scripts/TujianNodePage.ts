import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import GlobalApp from './common/GlobalApp';
import BasePage from './view/BasePage';
import { GameLevelPropConfig, markWhitePropClaimed } from './config';
import SdkHelper from './framework/SdkHelper';
const {
  ccclass,
  property
} = cc._decorator;

@ccclass
export default class TujianNodePage extends BasePage {

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;
  @property(cc.Node)
  node3: cc.Node = null;
 
  
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }

  private unlockConfig = [
    {
      unlockLevel: 1,
      unLockIDs: [1,2,3],
      status: 0,
      unlockDesc: "",
    },
    {
      unlockLevel: 2,
      unLockIDs: [4,5,6],
      status: 1,
      unlockDesc: "",
    },
    {
      unlockLevel: 3,
      unLockIDs: [7,8,9],
      status: 2,
      unlockDesc: "",
    },
  ];

  _init(e) {
     this.unlockConfig.forEach((item, index) => {
      const itemNode = cc.instantiate(this.itemPrefab);
      itemNode.parent = this.scrollView.content;
    }); 
  }
  


  onClickCloseBtn() {
    AudioManager.getInstance().playMusic("click");
    // SdkHelper.reportData("b_leave_page", {
    //   act_page: "setting_page",
    //   // duration: new Date().getTime() - this.comeinTime
    // });
    this._hide();
  }


  
}