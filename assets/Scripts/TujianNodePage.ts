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
export default class TujianNodePage extends BasePage {

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  cardTujianPrefab: cc.Prefab = null;
  @property(cc.Node)
  node3: cc.Node = null;
 
  
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }


  _init(e) {
    this.scrollView.content.removeAllChildren();
    TujianUnlockConfig.forEach((item, index) => {
      const itemNode = cc.instantiate(this.itemPrefab);
      itemNode.parent = this.scrollView.content;

      const currentLevel = gameData.gameLevel;

      
      // console.log("currentLevel.....................", currentLevel, item.unlockLevel);

      itemNode.getChildByName("diPass").active = currentLevel > item.unlockLevel;
      itemNode.getChildByName("diNow").active = currentLevel == item.unlockLevel;
      itemNode.getChildByName("diLock").active = currentLevel < item.unlockLevel;

      itemNode.getChildByName("nowNode").active = currentLevel == item.unlockLevel;
      itemNode.getChildByName("lockNode").active = currentLevel < item.unlockLevel;

      let stirnTips = "The mark illustration has disappeared; weneed to complete mahjong matching tasks toretrieve it.Let's try to complete the matchingtasks now!"

      itemNode.getChildByName("lockNode").getChildByName("Layout").getChildByName("level").getComponent(cc.Label).string = "level " + item.unlockLevel;
      itemNode.getChildByName("nowNode").getChildByName("tipsWord").getComponent(cc.Label).string = stirnTips;

      let cardPare = itemNode.getChildByName("cardParent");
      item.unLockIDs.forEach((id, index) => {
        const cardNode = cc.instantiate(this.cardTujianPrefab);
        cardNode.parent = cardPare;
        cardNode.getComponent(cardTujian).init({
          type: id,
        });
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