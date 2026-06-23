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

  _waitLevelClick = false;
  _clickingLevel = false;

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
    if (this.btnLevel) {
      this.btnLevel.interactable = true;
    }
    this.initCoin();
    this.refreshLevelText();
    if (shouldPlayHengFOnLevelButton(this._waitLevelClick)) {
      preloadHengFNodePrefab();
    }
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
    if (this._clickingLevel) {
      return;
    }
    this._clickingLevel = true;
    if (this.btnLevel) {
      this.btnLevel.interactable = false;
    }
    AudioManager.getInstance().playMusic("click");

    const shouldPlayBanner = shouldPlayHengFOnLevelButton(this._waitLevelClick);
    this._hide();
    if (shouldPlayBanner) {
      await playHengFNodeBanner();
    }
  }

  onClickSet() {
    AudioManager.getInstance().playMusic("click");
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "SetUpPage"
    });
  }

  onClickTujian() {
    AudioManager.getInstance().playMusic("click");
    PageMgr.showPage({
      name: "TujianNodePage"
    });
  }
}