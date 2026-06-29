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
import MainNodePage, {
  isTujianNodePageGuideDone,
  markMainNodePageTujianStepDone,
  markTujianNodePageGuideDone,
} from './MainNodePage';
import AdaptUIMgr from './framework/AdaptUIMgr';
import { trackCreatorEvent } from './common/GameTrackUtil';
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

  @property(cc.Node)
  handContainerNode: cc.Node = null;


  @property(cc.Label)
  tipsLabel: cc.Label = null;
  _fromFirstMainNodeGuide = false;
  _activeUnlockLevel: number | null = null;
  _activeUnlockPassed = false;
  _activeUnlockIDs: number[] = [];
  _highlightItemNode: cc.Node = null;
  _highlightAlignNode: cc.Node = null;

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
    if (!this.handContainerNode) {
      this.handContainerNode = cc.find("New Node", this.node);
    }
    this.ensureGuideLayerOrder();
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
    this.scheduleOnce(() => {
      this.adaptPageLayout();
      if (isTujianNodePageGuideDone() || this._activeUnlockLevel == null) {
        this.hideGuideVisuals();
        return;
      }
      this.refreshDi1Overlay();
      this.initGuide();
    }, 0);
  }

  hideGuideVisuals() {
    this.hideTipsOverlay();
    const handNode = this.getHandNode();
    const handContainer = this.getHandContainerNode();
    if (handNode) {
      handNode.active = false;
    }
    if (handContainer) {
      handContainer.active = false;
    }
    if (this.guideNode) {
      this.guideNode.active = false;
    }
  }

  getViewportSize(): cc.Size {
    return cc.size(cc.winSize.width, cc.winSize.height);
  }

  updatePageWidgets(root: cc.Node = this.node) {
    const widgets = root.getComponentsInChildren(cc.Widget);
    widgets.forEach((widget) => widget.updateAlignment());
  }

  adaptPageLayout() {
    const viewport = this.getViewportSize();
    const content = (this as any)._content as cc.Node;
    if (content) {
      content.setContentSize(viewport);
    }
    this.updatePageWidgets();
  }

  clampTipsToViewport(localPos: cc.Vec2): cc.Vec2 {
    if (!this.tipsNode) {
      return localPos;
    }
    const halfW = this.tipsNode.width * 0.5;
    const maxX = cc.winSize.width / 2 - halfW;
    const minX = -cc.winSize.width / 2 + halfW;
    localPos.x = cc.misc.clampf(localPos.x, minX, maxX);
    return localPos;
  }

  getHighlightAlignNode(itemNode: cc.Node): cc.Node {
    if (!itemNode) {
      return null;
    }
    const diNow = itemNode.getChildByName("diNow");
    if (diNow && diNow.active) {
      return diNow;
    }
    const diPass = itemNode.getChildByName("diPass");
    if (diPass && diPass.active) {
      return diPass;
    }
    const diLock = itemNode.getChildByName("diLock");
    if (diLock && diLock.active) {
      return diLock;
    }
    return itemNode;
  }

  updateDi1Position() {
    if (!this._highlightItemNode || !cc.isValid(this._highlightItemNode) || !this.tipsNode) {
      return;
    }
    const alignNode = (this._highlightAlignNode && cc.isValid(this._highlightAlignNode))
      ? this._highlightAlignNode
      : this.getHighlightAlignNode(this._highlightItemNode);
    if (!alignNode) {
      return;
    }
    const worldPos = alignNode.convertToWorldSpaceAR(cc.v2(0, 0));
    const tipsParent = this.tipsNode.parent || this.node;
    const localPos = tipsParent.convertToNodeSpaceAR(worldPos);
    this.tipsNode.setPosition(this.clampTipsToViewport(localPos));
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
    trackCreatorEvent(472);
    this.adaptPageLayout();
    this._fromFirstMainNodeGuide = !!(e && e.fromFirstMainNodeGuide);
    const activeEntry = isTujianNodePageGuideDone() ? null : this.resolveActiveUnlockEntry(e);
    this._activeUnlockLevel = activeEntry ? activeEntry.unlockLevel : null;
    this._activeUnlockPassed = !!(activeEntry && activeEntry.hasPassed);
    this._activeUnlockIDs = activeEntry ? activeEntry.unLockIDs.slice() : [];
    this._highlightItemNode = null;
    this._highlightAlignNode = null;
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
        this._highlightAlignNode = this.getHighlightAlignNode(itemNode);
        if (this._highlightAlignNode) {
          this._highlightAlignNode.active = false;
        }
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
      this.guideNode.active = !isTujianNodePageGuideDone() && this._activeUnlockLevel != null;
    }
    this.scheduleOnce(() => {
      this.adaptPageLayout();
      if (isTujianNodePageGuideDone() || this._activeUnlockLevel == null) {
        this.hideGuideVisuals();
        return;
      }
      this.refreshDi1Overlay();
      this.initGuide();
    }, AdaptUIMgr.isTablet() ? 0.35 : 0.2);
  }

  getHandNode(): cc.Node {
    if (this.handNode) {
      return this.handNode;
    }
    const handContainer = this.getHandContainerNode();
    if (handContainer) {
      const handInContainer = handContainer.getChildByName("hand");
      if (handInContainer) {
        return handInContainer;
      }
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

  getHandContainerNode(): cc.Node {
    if (this.handContainerNode) {
      return this.handContainerNode;
    }
    const handNode = this.handNode || cc.find("hand", this.node);
    if (handNode && handNode.parent) {
      const parent = handNode.parent;
      const content = (this as any)._content as cc.Node;
      if (parent !== this.node && parent !== content) {
        return parent;
      }
    }
    return cc.find("New Node", this.node);
  }

  getOverlayParent(): cc.Node {
    const content = (this as any)._content as cc.Node;
    if (this.guideNode && this.guideNode.parent) {
      return this.guideNode.parent;
    }
    if (this.tipsNode && this.tipsNode.parent) {
      return this.tipsNode.parent;
    }
    return content || this.node;
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
      const viewport = this.getViewportSize();
      const widget = overlay.getComponent(cc.Widget);
      if (widget) {
        widget.enabled = false;
      }
      overlay.setPosition(-localPos.x, -localPos.y);
      overlay.setContentSize(viewport.width, viewport.height);
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
    const overlayParent = this.getOverlayParent();
    if (!overlayParent) {
      return;
    }
    const handNode = this.getHandNode();
    const handContainer = this.getHandContainerNode();
    const overlayLayers: cc.Node[] = [];

    if (this.guideNode && this.guideNode.parent === overlayParent) {
      overlayLayers.push(this.guideNode);
    }
    if (this.tipsNode && this.tipsNode.parent === overlayParent) {
      overlayLayers.push(this.tipsNode);
    }
    if (handContainer && handContainer.parent === overlayParent) {
      overlayLayers.push(handContainer);
    }
    if (handNode && handNode.parent === overlayParent) {
      overlayLayers.push(handNode);
    }

    const baseIndex = overlayParent.childrenCount - overlayLayers.length;
    overlayLayers.forEach((node, index) => {
      node.setSiblingIndex(Math.max(0, baseIndex + index));
    });
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
    // if (unLockNode) {
    //   unLockNode.removeAllChildren();
    //   unLockNode.active = false;
    // }
    this.tipsNode.active = false;
  }

  refreshDi1Content() {
    if (!this.tipsNode) {
      return;
    }
    const tipsWord = this.tipsNode.getChildByName("tipsWord");
    const unLockNode = this.tipsNode.getChildByName("unLockNode");

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

    if (this._activeUnlockPassed) {
      if (tipsWord) {
        tipsWord.active = false;
      }
      return;
    }
    // if (unLockNode) {
    //   unLockNode.removeAllChildren();
    //   unLockNode.active = false;
    // }
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

  scrollToHighlightItem(instant = true) {
    if (!this._highlightItemNode || !this.scrollView) {
      return;
    }
    const content = this.scrollView.content;
    const layout = content.getComponent(cc.Layout);
    layout && layout.updateLayout();

    const index = content.children.indexOf(this._highlightItemNode);
    const total = content.children.length;
    if (index < 0) {
      return;
    }
    if (total <= 1) {
      return;
    }
    const percent = 1 - index / (total - 1);
    this.scrollView.scrollToPercentVertical(percent, instant ? 0 : 0.2);
  }

  scheduleDi1PositionUpdate() {
    this.unschedule(this.updateDi1Position);
    this.scheduleOnce(() => {
      this.updateDi1Position();
    }, 0);
    this.scheduleOnce(() => {
      this.updateDi1Position();
      this.ensureGuideLayerOrder();
    }, 0.15);
  }

  refreshDi1Overlay() {
    if (this._activeUnlockLevel == null || !this._highlightItemNode || !cc.isValid(this._highlightItemNode) || !this.tipsNode) {
      this.hideTipsOverlay();
      return;
    }
    this.scrollToHighlightItem(true);
    this.refreshDi1Content();
    this.tipsNode.active = true;
    this.scheduleDi1PositionUpdate();
    this.ensureGuideLayerOrder();
  }

  initGuide() {
    if (isTujianNodePageGuideDone() || this._activeUnlockLevel == null) {
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
    const handContainer = this.getHandContainerNode();
    if (handContainer) {
      handContainer.active = true;
    }
    if (handNode) {
      handNode.active = true;
      this.playGuideAnim(handNode);
    }
    this.ensureGuideLayerOrder();
  }

  onClickCloseBtn() {
    const hadTutorial = !isTujianNodePageGuideDone() && this._activeUnlockLevel != null;
    const handNode = this.getHandNode();
    const handContainer = this.getHandContainerNode();
    if (handNode) {
      cc.Tween.stopAllByTarget(handNode);
      handNode.active = false;
    }
    if (handContainer) {
      handContainer.active = false;
    }
    if (this.guideNode) {
      this.guideNode.active = false;
    }
    // this.hideTipsOverlay();
    AudioManager.getInstance().playMusic("click");
    if (hadTutorial) {
      markTujianNodePageGuideDone();
    }
    if (this._fromFirstMainNodeGuide) {
      markMainNodePageTujianStepDone();
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
