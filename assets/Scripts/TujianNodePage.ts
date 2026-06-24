import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { PropType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import GlobalApp from './common/GlobalApp';
import BasePage from './view/BasePage';
import { GameLevelPropConfig, getTujianUnlockForLevel, markWhitePropClaimed, TujianUnlockConfig } from './config';
import { gameData } from './data/GameData';
import SdkHelper from './framework/SdkHelper';
import cardTujian from './prefab/cardTujian';
import PageMgr from './view/PageMgr';
import MainNodePage, { markMainNodePageGuideCompleted } from './MainNodePage';
const {
  ccclass,
  property
} = cc._decorator;

const GUIDE_HAND_OFFSET = cc.v2(102.607, -70.44);

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

  @property(cc.Node)
  tipsNode: cc.Node = null;

  @property(cc.Node)
  handNode: cc.Node = null;


  @property(cc.Label)
  tipsLabel: cc.Label = null;
  _fromFirstMainNodeGuide = false;
  _activeUnlockLevel: number | null = null;
  _activeUnlockPassed = false;
  _activeUnlockIDs: number[] = [];
  _highlightItemNode: cc.Node = null;

  private tipsString = "The mark illustration has disappeared; we need to complete mahjong matching tasks toretrieve it. Let's try to complete the matching tasks now!";

  onLoad() {
    super.onLoad();
    if (!this.tipsNode) {
      this.tipsNode = cc.find("di1", this.node);
    }
    if (!this.tipsLabel && this.tipsNode) {
      const tipsWord = this.tipsNode.getChildByName("tipsWord");
      this.tipsLabel = tipsWord ? tipsWord.getComponent(cc.Label) : null;
    }
    this.hideTipsOverlay();
  }

  _onHide() {
    this.hideTipsOverlay();
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
    if (this.tipsLabel) {
      this.tipsLabel.string = this.tipsString;
    }
  }

  hasPassedTujianUnlockLevel(unlockLevel: number, currentLevel: number): boolean {
    if (currentLevel > unlockLevel) {
      return true;
    }
    if (currentLevel < unlockLevel) {
      return false;
    }
    const appliedLevel = Math.floor(Number(gameData.dollarRewardAppliedLevel) || 0);
    return appliedLevel >= unlockLevel;
  }

  resolveActiveUnlockEntry(e): { unlockLevel: number; hasPassed: boolean; unLockIDs: number[] } | null {
    const currentLevel = Math.floor(Number(gameData.gameLevel) || 1);
    const currentCfg = getTujianUnlockForLevel(currentLevel);
    if (currentCfg && !this.hasPassedTujianUnlockLevel(currentCfg.unlockLevel, currentLevel)) {
      return {
        unlockLevel: currentCfg.unlockLevel,
        hasPassed: false,
        unLockIDs: currentCfg.unLockIDs,
      };
    }
    if (e && e.highlightUnlockLevel != null) {
      const highlightLevel = Math.floor(Number(e.highlightUnlockLevel));
      const highlightCfg = getTujianUnlockForLevel(highlightLevel);
      if (highlightCfg && this.hasPassedTujianUnlockLevel(highlightLevel, currentLevel)) {
        return {
          unlockLevel: highlightCfg.unlockLevel,
          hasPassed: true,
          unLockIDs: highlightCfg.unLockIDs,
        };
      }
    }
    return null;
  }

  _init(e) {
    this._fromFirstMainNodeGuide = !!(e && e.fromFirstMainNodeGuide);
    const activeEntry = this.resolveActiveUnlockEntry(e);
    this._activeUnlockLevel = activeEntry ? activeEntry.unlockLevel : null;
    this._activeUnlockPassed = !!(activeEntry && activeEntry.hasPassed);
    this._activeUnlockIDs = activeEntry ? activeEntry.unLockIDs.slice() : [];
    this._highlightItemNode = null;
    this.hideTipsOverlay();

    this.scrollView.content.removeAllChildren();
    const currentLevel = Math.floor(Number(gameData.gameLevel) || 1);
    TujianUnlockConfig.forEach((item) => {
      const itemNode = cc.instantiate(this.itemPrefab);
      itemNode.parent = this.scrollView.content;

      const unlockLevel = item.unlockLevel;
      const hasPassedUnlockLevel = this.hasPassedTujianUnlockLevel(unlockLevel, currentLevel);
      const isCurrentUnlockLevel = currentLevel === unlockLevel && !hasPassedUnlockLevel;
      const isLockedUnlockLevel = currentLevel < unlockLevel;
      const isActiveUnlockItem = this._activeUnlockLevel === unlockLevel;

      itemNode.getChildByName("diPass").active = hasPassedUnlockLevel;
      itemNode.getChildByName("diNow").active = isCurrentUnlockLevel;
      itemNode.getChildByName("diLock").active = isLockedUnlockLevel;

      itemNode.getChildByName("nowNode").active = isCurrentUnlockLevel;
      itemNode.getChildByName("lockNode").active = isLockedUnlockLevel;

      const lockNode = itemNode.getChildByName("lockNode");
      if (lockNode && isLockedUnlockLevel) {
        lockNode.getChildByName("Layout").getChildByName("level").getComponent(cc.Label).string = "level " + unlockLevel;
      }
      const nowNode = itemNode.getChildByName("nowNode");
      if (nowNode && isCurrentUnlockLevel) {
        const itemTipsWord = nowNode.getChildByName("tipsWord");
        if (itemTipsWord) {
          itemTipsWord.active = !isActiveUnlockItem;
          if (!isActiveUnlockItem) {
            itemTipsWord.getComponent(cc.Label).string = this.tipsString;
          }
        }
      }

      if (isActiveUnlockItem) {
        this._highlightItemNode = itemNode;
      }

      const cardPare = itemNode.getChildByName("cardParent");
      item.unLockIDs.forEach((id) => {
        const cardNode = cc.instantiate(this.cardTujianPrefab);
        cardNode.parent = cardPare;
        cardNode.getComponent(cardTujian).init({
          type: id,
        });
      });
    });

    const layout = this.scrollView.content.getComponent(cc.Layout);
    layout && layout.updateLayout();

    if (this.guideNode) {
      this.guideNode.active = this._activeUnlockLevel != null;
    }
    this.scheduleOnce(() => {
      if (this._activeUnlockLevel != null) {
        this.refreshDi1Overlay();
        this.initGuide();
      } else {
        this.hideTipsOverlay();
        const handNode = this.getHandNode();
        if (handNode) {
          handNode.active = false;
        }
      }
    }, 0.2);
  }

  getHandNode(): cc.Node {
    if (this.handNode) {
      return this.handNode;
    }
    const guideRoot = this.guideNode || cc.find("GuideNode", this.node);
    if (guideRoot) {
      const handInGuide = guideRoot.getChildByName("hand");
      if (handInGuide) {
        return handInGuide;
      }
    }
    return cc.find("hand", this.node);
  }

  getBackBtnNode(): cc.Node {
    return cc.find("backNode", this.node);
  }

  getMaskTargetNode(backNode: cc.Node): cc.Node {
    if (!backNode) {
      return null;
    }
    if (backNode.getComponent(cc.Sprite)) {
      return backNode;
    }
    const background = backNode.getChildByName("Background");
    return background || backNode;
  }

  alignGuideMask(targetNode: cc.Node) {
    const guideRoot = this.guideNode || cc.find("GuideNode", this.node);
    if (!guideRoot || !targetNode) {
      return;
    }
    const maskNode = guideRoot.getChildByName("mask");
    if (!maskNode) {
      return;
    }
    const maskTarget = this.getMaskTargetNode(targetNode);
    maskNode.active = true;
    const worldPos = maskTarget.convertToWorldSpaceAR(cc.v2(0, 0));
    const localPos = guideRoot.convertToNodeSpaceAR(worldPos);
    maskNode.setContentSize(maskTarget.width, maskTarget.height + 8);
    const targetSprite = maskTarget.getComponent(cc.Sprite);
    const mask = maskNode.getComponent(cc.Mask);
    if (mask && targetSprite) {
      mask.spriteFrame = targetSprite.spriteFrame;
    }
    maskNode.setPosition(localPos.x, localPos.y + 15);

    const overlay = maskNode.children[0];
    if (overlay) {
      const widget = overlay.getComponent(cc.Widget);
      if (widget) {
        widget.enabled = false;
      }
      overlay.setPosition(-localPos.x, -localPos.y);
      overlay.setContentSize(guideRoot.width || cc.winSize.width, guideRoot.height || cc.winSize.height);
    }
  }

  alignGuideHand(targetNode: cc.Node) {
    const handNode = this.getHandNode();
    if (!handNode || !targetNode) {
      return;
    }
    const guideRoot = this.guideNode || cc.find("GuideNode", this.node);
    const worldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
    if (guideRoot && handNode.parent === guideRoot) {
      const localPos = guideRoot.convertToNodeSpaceAR(worldPos);
      handNode.setPosition(localPos.x + GUIDE_HAND_OFFSET.x, localPos.y + GUIDE_HAND_OFFSET.y);
      return;
    }
    if (!handNode.parent) {
      return;
    }
    const localPos = handNode.parent.convertToNodeSpaceAR(worldPos);
    handNode.setPosition(localPos.x + GUIDE_HAND_OFFSET.x, localPos.y + GUIDE_HAND_OFFSET.y);
  }

  ensureGuideLayerOrder() {
    const handNode = this.getHandNode();
    const overlayParent = (handNode && handNode.parent) || (this.tipsNode && this.tipsNode.parent) || (this.guideNode && this.guideNode.parent);
    if (!overlayParent) {
      return;
    }
    if (this.guideNode && this.guideNode.parent === overlayParent) {
      this.guideNode.setSiblingIndex(Math.max(0, overlayParent.childrenCount - 3));
    }
    if (this.tipsNode && this.tipsNode.active && this.tipsNode.parent === overlayParent) {
      this.tipsNode.setSiblingIndex(Math.max(0, overlayParent.childrenCount - 2));
    }
    if (handNode && handNode.parent === overlayParent) {
      handNode.setSiblingIndex(overlayParent.childrenCount - 1);
    }
  }

  playGuideAnim(handNode: cc.Node) {
    cc.Tween.stopAllByTarget(handNode);
    cc.tween(handNode).by(0.5, { x: 30, y: -30 }).by(0.5, {
      x: -30,
      y: 30
    }).union().repeatForever().start();
  }

  hideTipsOverlay() {
    if (!this.tipsNode) {
      return;
    }
    const tipsWord = this.tipsNode.getChildByName("tipsWord");
    const unLockNode = this.tipsNode.getChildByName("unLockNode");
    if (tipsWord) {
      tipsWord.active = false;
    }
    if (unLockNode) {
      unLockNode.removeAllChildren();
      unLockNode.active = false;
    }
    this.tipsNode.active = false;
  }

  refreshDi1Content() {
    if (!this.tipsNode) {
      return;
    }
    const tipsWord = this.tipsNode.getChildByName("tipsWord");
    const unLockNode = this.tipsNode.getChildByName("unLockNode");
    if (this._activeUnlockPassed) {
      if (tipsWord) {
        tipsWord.active = false;
      }
      if (unLockNode) {
        unLockNode.active = true;
        unLockNode.removeAllChildren();
        this._activeUnlockIDs.forEach((id) => {
          const cardNode = cc.instantiate(this.cardTujianPrefab);
          cardNode.parent = unLockNode;
          cardNode.getComponent(cardTujian).init({
            type: id,
          });
        });
        const layout = unLockNode.getComponent(cc.Layout);
        layout && layout.updateLayout();
      }
      return;
    }
    if (unLockNode) {
      unLockNode.removeAllChildren();
      unLockNode.active = false;
    }
    if (tipsWord) {
      tipsWord.active = true;
      const label = tipsWord.getComponent(cc.Label);
      if (label) {
        label.string = this.tipsString;
      }
    }
    if (this.tipsLabel) {
      this.tipsLabel.string = this.tipsString;
    }
  }

  scrollToHighlightItem() {
    if (!this._highlightItemNode || !this.scrollView) {
      return;
    }
    const content = this.scrollView.content;
    const layout = content.getComponent(cc.Layout);
    layout && layout.updateLayout();

    const index = content.children.indexOf(this._highlightItemNode);
    const total = content.children.length;
    if (index < 0 || total <= 1) {
      return;
    }
    const percent = 1 - index / (total - 1);
    this.scrollView.scrollToPercentVertical(percent, 0.2);
  }

  refreshDi1Overlay() {
    if (this._activeUnlockLevel == null || !this._highlightItemNode || !cc.isValid(this._highlightItemNode) || !this.tipsNode) {
      this.hideTipsOverlay();
      return;
    }
    this.scrollToHighlightItem();
    this.refreshDi1Content();
    const worldPos = this._highlightItemNode.convertToWorldSpaceAR(cc.v2(0, 0));
    const tipsParent = this.tipsNode.parent || this.node;
    this.tipsNode.setPosition(tipsParent.convertToNodeSpaceAR(worldPos));
    this.tipsNode.active = true;
    const overlayParent = this.tipsNode.parent;
    if (overlayParent) {
      this.tipsNode.setSiblingIndex(overlayParent.childrenCount - 1);
    }
    this.ensureGuideLayerOrder();
  }

  initGuide() {
    if (this._activeUnlockLevel == null) {
      return;
    }
    const backNode = this.getBackBtnNode();
    if (this.guideNode) {
      this.guideNode.active = true;
    }
    if (backNode) {
      this.alignGuideMask(backNode);
      this.alignGuideHand(backNode);
    }
    const handNode = this.getHandNode();
    if (handNode) {
      handNode.active = true;
      this.playGuideAnim(handNode);
    }
    this.ensureGuideLayerOrder();
  }

  onClickCloseBtn() {
    const handNode = this.getHandNode();
    if (handNode) {
      cc.Tween.stopAllByTarget(handNode);
      handNode.active = false;
    }
    if (this.guideNode) {
      this.guideNode.active = false;
    }
    this.hideTipsOverlay();
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
