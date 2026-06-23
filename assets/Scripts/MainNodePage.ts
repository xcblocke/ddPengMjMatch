import { gameData } from './data/GameData';
import PageMgr from './view/PageMgr';
import BasePage, { AnimType } from './view/BasePage';
import AudioManager from './framework/controller/AudioManager';
import GameEventType from './framework/Event/GameEventType';
import EventMgr from './framework/Event/EventMgr';
import { playHengFNodeBanner, preloadHengFNodePrefab, shouldPlayHengFOnLevelButton } from './HengFNodeUtil';
const {
  ccclass,
  property
} = cc._decorator;

const GUIDE_HAND_OFFSET = cc.v2(102.607, -70.44);

/** 当前 App 启动周期内是否已完成 MainNodePage 首次教程（杀进程重启后重置） */
let sessionMainNodePageEntered = false;

export function isFirstMainNodePageEnterThisSession(): boolean {
  return !sessionMainNodePageEntered;
}

export function markMainNodePageGuideCompleted(): void {
  sessionMainNodePageEntered = true;
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
    this._waitLevelClick = !!(e && e.waitLevelClick);
    this._clickingLevel = false;
    this.initCoin();
    this.refreshLevelText();
    if (shouldPlayHengFOnLevelButton(this._waitLevelClick)) {
      preloadHengFNodePrefab();
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
    this.initGuide();
  }

  shouldGuideTujianBtn(): boolean {
    return !this._waitLevelClick && isFirstMainNodePageEnterThisSession();
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
  }

  async onClickLevelBtn() {
    if (this._clickingLevel || this._guideTarget !== "level") {
      return;
    }
    this._clickingLevel = true;
    if (this.btnLevel) {
      this.btnLevel.interactable = false;
    }
    AudioManager.getInstance().playMusic("click");
    this.hideGuide();

    const shouldPlayBanner = shouldPlayHengFOnLevelButton(this._waitLevelClick);
    this._hide();
    if (shouldPlayBanner) {
      await playHengFNodeBanner();
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
    if (this._guideTarget !== "tujian") {
      return;
    }
    AudioManager.getInstance().playMusic("click");
    this.hideGuide();
    PageMgr.showPage({
      name: "TujianNodePage",
      data: {
        fromFirstMainNodeGuide: true
      }
    });
  }
}
