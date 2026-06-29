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
import { trackCreatorEvent } from './common/GameTrackUtil';
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

  _unlockMahjongIds: number[] = [];

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
      this._unlockMahjongIds = [];
      return;
     }

    this._unlockMahjongIds = curUnlockData.slice();
    if (this.contentNode) {
      this.contentNode.removeAllChildren();
    }

    console.log("curUnlockData。。。。。。。。。。。。。。",curUnlockData);

    curUnlockData.forEach((id, index) => {
      const cardNode = cc.instantiate(this.cardTujianPrefab);
      cardNode.parent = this.contentNode;
      cardNode.getComponent(cardTujian).init({
        type: id,
      });
    });
  }
  


  onClick() {
    AudioManager.getInstance().playMusic("click");
    if (this._unlockMahjongIds.length > 0) {
      trackCreatorEvent(477, this._unlockMahjongIds.join(","));
    }
    this._hide();
  }

  onClickCloseBtn() {
    AudioManager.getInstance().playMusic("click");
    this._hide();
  }


  
}