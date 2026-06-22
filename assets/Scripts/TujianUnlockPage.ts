import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import GlobalApp from './common/GlobalApp';
import BasePage from './view/BasePage';
import { GameLevelPropConfig, markWhitePropClaimed, TujianUnlockConfig } from './config';
import { gameData } from './data/GameData';
import SdkHelper from './framework/SdkHelper';
import cardTujian from './prefab/cardTujian';
const {
  ccclass,
  property
} = cc._decorator;

@ccclass
export default class TujianUnlockPage extends BasePage {

  @property(cc.Node)
  contentNode: cc.Node = null;

  @property(cc.Prefab)
  cardTujianPrefab: cc.Prefab = null;

 
  
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }


  _init(e) {
     const currentLevel = gameData.gameLevel;
     let curUnlockData = null;
     for (let index = 0; index < TujianUnlockConfig.length; index++) {
        if(currentLevel == TujianUnlockConfig[index].unlockLevel) {
          curUnlockData = TujianUnlockConfig[index].unLockIDs;
          break;
        }
     }

     if(!curUnlockData) {
      return;
     }

    curUnlockData.forEach((id, index) => {
      const cardNode = cc.instantiate(this.cardTujianPrefab);
      cardNode.parent = this.contentNode;
      cardNode.getComponent(cardTujian).init({
        type: id,
      });
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