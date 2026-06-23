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
import PageMgr from './view/PageMgr';
import MainNodePage, { markMainNodePageGuideCompleted } from './MainNodePage';
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
  guideNode: cc.Node = null;

  _fromFirstMainNodeGuide = false;
 
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }


  _init(e) {
    this._fromFirstMainNodeGuide = !!(e && e.fromFirstMainNodeGuide);
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

      let stirnTips = "The mark illustration has disappeared; we need to complete mahjong matching tasks toretrieve it. Let's try to complete the matching tasks now!"

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

    if(this.guideNode) {
      this.guideNode.active = true;
      this.scheduleOnce(() => {
        this.initGuide();
      }, 0.2);
    }
  }

  initGuide() {
    if(this.guideNode) {
      let handNode = this.guideNode.getChildByName("hand");
      handNode.active = true;
      if(handNode) { 
        cc.Tween.stopAllByTarget(handNode);
        cc.tween(handNode).by(0.5, {x: 30, y: -30}).by(0.5, {
          x: -30,
          y: 30
      }).union().repeatForever().start();
      }
    }
  }
  


  onClickCloseBtn() {
    if (this.guideNode) {
      const handNode = this.guideNode.getChildByName("hand");
      if (handNode) {
        cc.Tween.stopAllByTarget(handNode);
        handNode.active = false;
      }
    }
    AudioManager.getInstance().playMusic("click");
    if (this._fromFirstMainNodeGuide) {
      markMainNodePageGuideCompleted();
      const mainPageCache = PageMgr.getPage("MainNodePage");
      const mainPageNode = mainPageCache && mainPageCache.node;
      if (mainPageNode && mainPageNode.active) {
        const mainPage = mainPageNode.getComponent(MainNodePage);
        mainPage && mainPage.refreshGuideToLevelBtn();
      }
    }
    this._hide();
  }


  
}