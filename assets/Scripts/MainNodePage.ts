import { gameData, GameState } from './data/GameData';
import PageMgr from './view/PageMgr';
import BasePage, { AnimType } from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import GameEventType from './framework/Event/GameEventType';
import EventMgr from './framework/Event/EventMgr';
import GlobalApp from './common/GlobalApp';
import { preloadHengFNodePrefab, shouldPlayHengFOnLevelButton } from './HengFNodeUtil';
import { trackCreatorEvent } from './common/GameTrackUtil';
const {
  ccclass,
  property
} = cc._decorator;

const GUIDE_HAND_OFFSET = cc.v2(102.607, -70.44);

const MAIN_NODE_GUIDE_DONE_KEY = "main_node_page_guide_done";
const TUJIAN_NODE_GUIDE_DONE_KEY = "tujian_node_page_guide_done";

/** 本次启动内是否已完成 Main 图鉴引导步（返回后引导点关卡） */
let sessionMainNodeTujianStepDone = false;

export function isMainNodePageGuideDone(): boolean {
  try {
    return cc.sys.localStorage.getItem(MAIN_NODE_GUIDE_DONE_KEY) === "1";
  } catch (_e) {
    return false;
  }
}

export function markMainNodePageGuideDone(): void {
  sessionMainNodeTujianStepDone = true;
  try {
    cc.sys.localStorage.setItem(MAIN_NODE_GUIDE_DONE_KEY, "1");
  } catch (_e) {}
}

export function isMainNodePageTujianStepDone(): boolean {
  return sessionMainNodeTujianStepDone || isMainNodePageGuideDone();
}

export function markMainNodePageTujianStepDone(): void {
  sessionMainNodeTujianStepDone = true;
}

export function isTujianNodePageGuideDone(): boolean {
  try {
    return cc.sys.localStorage.getItem(TUJIAN_NODE_GUIDE_DONE_KEY) === "1";
  } catch (_e) {
    return false;
  }
}

export function markTujianNodePageGuideDone(): void {
  try {
    cc.sys.localStorage.setItem(TUJIAN_NODE_GUIDE_DONE_KEY, "1");
  } catch (_e) {}
}

export function isFirstMainNodePageEnterThisSession(): boolean {
  return !isMainNodePageTujianStepDone();
}

export function markMainNodePageGuideCompleted(): void {
  markMainNodePageTujianStepDone();
}

@ccclass
export default class MainNodePage extends BasePage {

  @property(cc.Label)
  coinTextLabel: cc.Label = null;

  @property(cc.Label)
  levelTextLabel: cc.Label = null;

  @property(cc.Button)
  btnLevel: cc.Button = null;

  @property(cc.Button)
  tujianBtn: cc.Button = null;

  @property(cc.Node)
  guideNode: cc.Node = null;

  @property(cc.Node)
  wordTipsNode1: cc.Node = null; 
  @property(cc.Node)
  wordTipsNode2: cc.Node = null; 
  @property(cc.Label)
  wordTextLabel: cc.Label = null;

  _waitLevelClick = false;
  _clickingLevel = false;
  _guideTarget: "tujian" | "level" = "level";

  onLoad() {
    this._animInit({
      animType: AnimType.NONE
    });
    this._lockInit({
      hasBlack: false
    });
    super.onLoad();
  }

  _init(e?: { waitLevelClick?: boolean }) {
    trackCreatorEvent(471);
    this._waitLevelClick = !!(e && e.waitLevelClick);
    this._clickingLevel = false;
    this.initCoin();
    this.refreshLevelText();
    if (shouldPlayHengFOnLevelButton(this._waitLevelClick)) {
      preloadHengFNodePrefab();
    }
    if (isMainNodePageGuideDone()) {
      this.applyGuideButtonsAllEnabled();
      return;
    }
    this.scheduleOnce(() => {
      if (!cc.isValid(this.node)) {
        return;
      }
      this.initGuide();
    }, 0.1);
  }

  refreshGuideToLevelBtn() {
    if (!cc.isValid(this.node) || !this.node.active) {
      return;
    }
    this._clickingLevel = false;
    if (isMainNodePageGuideDone()) {
      this.applyGuideButtonsAllEnabled();
      return;
    }
    this.initGuide();
  }

  shouldGuideTujianBtn(): boolean {
    return !this._waitLevelClick && !isMainNodePageTujianStepDone();
  }

  getGuideTargetNode(): cc.Node {
    if (this.shouldGuideTujianBtn()) {
      return this.tujianBtn ? this.tujianBtn.node : null;
    }
    return this.btnLevel ? this.btnLevel.node : null;
  }

  applyGuideButtons() {
    this._guideTarget = this.shouldGuideTujianBtn() ? "tujian" : "level";
    if (this.tujianBtn) {
      this.tujianBtn.interactable = this._guideTarget === "tujian";
    }
    if (this.btnLevel) {
      this.btnLevel.interactable = this._guideTarget === "level";
    }
    this.wordTipsNode1.active = this._guideTarget === "tujian";
    this.wordTipsNode2.active = this._guideTarget === "level";
  }

  applyGuideButtonsAllEnabled() {
    this._guideTarget = "level";
    if (this.tujianBtn) {
      this.tujianBtn.interactable = true;
    }
    if (this.btnLevel) {
      this.btnLevel.interactable = true;
    }
    if (this.wordTipsNode1) {
      this.wordTipsNode1.active = false;
    }
    if (this.wordTipsNode2) {
      this.wordTipsNode2.active = false;
    }
    this.hideGuide();
  }

  alignGuideNodes(targetNode: cc.Node) {
    const guideRoot = this.guideNode || cc.find("GuideNode", this.node);
    if (!guideRoot || !targetNode) {
      return;
    }
    const handNode = guideRoot.getChildByName("hand");
    const maskNode = guideRoot.getChildByName("mask");
    if (!maskNode) {
      return;
    }

    const worldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
    const localPos = guideRoot.convertToNodeSpaceAR(worldPos);
    // const holeWidth = Math.max(targetNode.width || 77, 77);
    // const holeHeight = Math.max(targetNode.height || 77, 77);
    maskNode.setContentSize(targetNode.width, targetNode.height + 8) ;
    maskNode.getComponent(cc.Mask).spriteFrame = targetNode.getComponent(cc.Sprite).spriteFrame;
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

    if (handNode) {
      handNode.setPosition(localPos.x + GUIDE_HAND_OFFSET.x, localPos.y + GUIDE_HAND_OFFSET.y);
    }
  }

  playGuideAnim(handNode: cc.Node) {
    
      cc.Tween.stopAllByTarget(handNode);
      cc.tween(handNode)
        .by(0.5, { x: 30, y: -30 })
        .by(0.5, { x: -30, y: 30 })
        .union()
        .repeatForever()
        .start();
  
  }

  initGuide() {
    if (isMainNodePageGuideDone()) {
      this.applyGuideButtonsAllEnabled();
      return;
    }
    const guideRoot = this.guideNode || cc.find("GuideNode", this.node);
    if (!guideRoot) {
      this.applyGuideButtons();
      return;
    }
    this.guideNode = guideRoot;
    this.applyGuideButtons();
    const targetNode = this.getGuideTargetNode();
    if (!targetNode) {
      guideRoot.active = false;
      return;
    }

    guideRoot.active = true;
    this.scheduleOnce(() => {
      if (!cc.isValid(this.node) || !guideRoot.active) {
        return;
      }
      this.alignGuideNodes(targetNode);
      const handNode = guideRoot.getChildByName("hand");
  
      if (handNode) {
        handNode.active = true;
      }
      this.playGuideAnim(handNode);
    }, 0);
  }

  hideGuide() {
    const guideRoot = this.guideNode || cc.find("GuideNode", this.node);
    if (!guideRoot) {
      return;
    }
    const handNode = guideRoot.getChildByName("hand");
    const maskNode = guideRoot.getChildByName("mask");
    if (handNode) {
      cc.Tween.stopAllByTarget(handNode);
    }
    if (maskNode) {
      cc.Tween.stopAllByTarget(maskNode);
    }
    guideRoot.active = false;
  }

  initCoin() {
    if (this.coinTextLabel) {
      this.coinTextLabel.string = String(gameData.dollarBalance || 0);
    }
  }

  refreshLevelText() {
    const levelLabel = this.levelTextLabel || cc.find("textLevel", this.node)?.getComponent(cc.Label);
    if (!levelLabel) {
      return;
    }
    const currentLevel = Math.floor(Number(gameData.gameLevel) || 1);
    levelLabel.string = this._waitLevelClick ? `Level ${currentLevel + 1}` : `Level ${currentLevel}`;

    if(currentLevel > 1) {
      this.wordTextLabel.string = "gkey_809";
    }else{
      if(this._waitLevelClick) {
        this.wordTextLabel.string = "gkey_809";
      }
    }
  }

  onClickLevelBtn() {
    if (this._clickingLevel || (!isMainNodePageGuideDone() && this._guideTarget !== "level")) {
      return;
    }
    this._clickingLevel = true;
    const softEnterFirstLevel = !this._waitLevelClick
      && Math.floor(Number(gameData.gameLevel) || 1) === 1
      && !isMainNodePageGuideDone();
    markMainNodePageGuideDone();
    if (this.btnLevel) {
      this.btnLevel.interactable = false;
    }
    AudioManager.getInstance().playMusic("click");
    this.hideGuide();
    this._hide();

    const gameMain = GlobalApp.GameMain;
    // 审核模式首进第 1 关：开场动画已 startGame，只需关主页并恢复教程，不能 RESTART
    if (this._waitLevelClick || softEnterFirstLevel) {
      if (softEnterFirstLevel && gameMain) {
        gameMain.resumeLevel1TeachingHand();
      }
      this.ensureGameplayClickable(gameMain);
      return;
    }

    EventMgr.trigger(GameEventType.RESTART_GAME);
  }

  ensureGameplayClickable(gameMain) {
    if (gameMain && !gameMain.isMahjongSpawning && gameData.gameState === GameState.gameing) {
      gameData.globalCanClick = true;
    }
  }

  _onHide() {
    this.hideGuide();
    super._onHide.call(this);
  }

  onClickSet() {
    AudioManager.getInstance().playMusic("click");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "SetUpPage"
    });
  }

  onClickTujian() {
    if (!isMainNodePageGuideDone() && this._guideTarget !== "tujian") {
      return;
    }
    AudioManager.getInstance().playMusic("click");
    this.hideGuide();
    PageMgr.showPage({
      name: "TujianNodePage",
      data: {
        fromFirstMainNodeGuide: this._guideTarget === "tujian"
      }
    });
  }
}
