import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import { CUSTOMER_SERVICE } from './framework/SystemConfig';
import EngineUtil from './framework/EngineUtil';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
import ClientData from './framework/Event/ClientData';
import UrlMgr from './service/UrlMgr';
import { PropType } from './framework/enum/AllEnum';

const {
  ccclass,
  property
} = cc._decorator;

export interface ISignRewardConfig {
  day: number;
  type: 'coin' | 'prop';
  value: number;
  label: string;
  propType?: PropType;
}

interface ISignState {
  claimedDays: number[];
  lastClaimDay: number;
  lastClaimDate: string;
}

const SIGN_REWARD_CONFIG: ISignRewardConfig[] = [
  { day: 1, type: 'coin', value: 5, label: '5' },
  { day: 2, type: 'coin', value: 8, label: '8' },
  { day: 3, type: 'prop', value: 1, label: '1', propType: PropType.tipCard },
  { day: 4, type: 'coin', value: 10, label: '10' },
  { day: 5, type: 'prop', value: 1, label: '1', propType: PropType.reshuffleCard },
  { day: 6, type: 'coin', value: 15, label: '15' },
  { day: 7, type: 'prop', value: 1, label: '1', propType: PropType.freezeCard }
];

const SIGN_STATE_KEY = 'seven_day_sign_state_v1';

@ccclass
export default class signUpPage extends BasePage {
  private rewardCards: cc.Node[] = [];
  private rewardMap: Map<number, ISignRewardConfig> = new Map();

  start() {
    this.resetSignStateIfNeeded();
    this.refreshUI();
  }

  _init(data?: any) {
    this.initRewardMap();
    this.resetSignStateIfNeeded();
    this.refreshUI();
    return Promise.resolve();
  }

  onEnable() {
    super.onEnable.call(this);
    this.initRewardMap();
    this.resetSignStateIfNeeded();
    this.refreshUI();
  }

  onDisable() {
    this.rewardCards.forEach((node) => {
      if (node) node.destroy();
    });
    this.rewardCards = [];
  }

  private initRewardMap() {
    this.rewardMap.clear();
    SIGN_REWARD_CONFIG.forEach((reward) => {
      this.rewardMap.set(reward.day, reward);
    });
  }

  private getSignState(): ISignState {
    try {
      const raw = cc.sys.localStorage.getItem(SIGN_STATE_KEY);
      if (!raw) {
        return {
          claimedDays: [],
          lastClaimDay: 0,
          lastClaimDate: ''
        };
      }
      const parsed = JSON.parse(raw);
      return {
        claimedDays: Array.isArray(parsed.claimedDays) ? parsed.claimedDays : [],
        lastClaimDay: Number(parsed.lastClaimDay) || 0,
        lastClaimDate: parsed.lastClaimDate || ''
      };
    } catch (error) {
      console.error('SignPage getSignState error:', error);
      return {
        claimedDays: [],
        lastClaimDay: 0,
        lastClaimDate: ''
      };
    }
  }

  private saveSignState(state: ISignState) {
    cc.sys.localStorage.setItem(SIGN_STATE_KEY, JSON.stringify(state));
  }

  private getClaimedSet(): Set<number> {
    return new Set(this.getSignState().claimedDays || []);
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private resetSignStateIfNeeded() {
    const state = this.getSignState();
    if (!state || !Array.isArray(state.claimedDays)) {
      return;
    }

    const lastClaimDay = Number(state.lastClaimDay) || 0;
    const lastClaimDate = state.lastClaimDate ? new Date(state.lastClaimDate) : null;
    const cycleCompleted = lastClaimDay >= SIGN_REWARD_CONFIG.length || state.claimedDays.length >= SIGN_REWARD_CONFIG.length;

    if (!cycleCompleted) {
      return;
    }

    if (!lastClaimDate || Number.isNaN(lastClaimDate.getTime())) {
      this.saveSignState({
        claimedDays: [],
        lastClaimDay: 0,
        lastClaimDate: ''
      });
      return;
    }

    const today = new Date();
    const diffDays = Math.floor((this.startOfDay(today).getTime() - this.startOfDay(lastClaimDate).getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays >= 1) {
      this.saveSignState({
        claimedDays: [],
        lastClaimDay: 0,
        lastClaimDate: ''
      });
    }
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private getNextClaimDay(): number {
    const state = this.getSignState();
    const claimed = state.claimedDays || [];
    const maxClaimed = claimed.reduce((max, day) => Math.max(max, Number(day) || 0), 0);
    return maxClaimed < SIGN_REWARD_CONFIG.length ? maxClaimed + 1 : SIGN_REWARD_CONFIG.length;
  }

  private getDayStatus(day: number): 'done' | 'current' | 'lock' {
    const claimed = this.getClaimedSet();
    if (claimed.has(day)) return 'done';
    const nextDay = this.getNextClaimDay();
    if (day === nextDay) return 'current';
    return 'lock';
  }

  private refreshUI() {
    this.clearCards();

    const container = this.node.getChildByName('content') || this.node;
    const cardWidth = 180;
    const cardHeight = 220;
    const startX = -280;
    const startY = 80;
    const gapX = 180;
    const gapY = 220;

    for (let i = 0; i < SIGN_REWARD_CONFIG.length; i++) {
      const reward = SIGN_REWARD_CONFIG[i];
      const row = Math.floor(i / 3);
      const col = i % 3;
      const card = new cc.Node(`day_${reward.day}`);
      const bg = card.addComponent(cc.Sprite);
      bg.spriteFrame = null as any;
      card.width = cardWidth;
      card.height = cardHeight;
      card.setPosition(startX + col * gapX, startY - row * gapY);

      const title = new cc.Node('title');
      const titleLabel = title.addComponent(cc.Label);
      titleLabel.string = `Day ${reward.day}`;
      titleLabel.fontSize = 24;
      titleLabel.lineHeight = 28;
      titleLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
      titleLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
      title.setPosition(0, 70);
      card.addChild(title);

      const rewardNode = new cc.Node('reward');
      const rewardLabel = rewardNode.addComponent(cc.Label);
      rewardLabel.fontSize = 30;
      rewardLabel.lineHeight = 34;
      rewardLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
      rewardLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
      const rewardText = reward.type === 'coin' ? `x${reward.value}` : `x${reward.value}`;
      rewardLabel.string = rewardText;
      rewardNode.setPosition(0, 10);
      card.addChild(rewardNode);

      const nameNode = new cc.Node('name');
      const nameLabel = nameNode.addComponent(cc.Label);
      nameLabel.fontSize = 22;
      nameLabel.lineHeight = 26;
      nameLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
      nameLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
      nameLabel.string = reward.type === 'coin' ? 'Gold' : this.getPropName(reward.propType);
      nameNode.setPosition(0, -38);
      card.addChild(nameNode);

      const btnNode = new cc.Node('claimBtn');
      const btn = btnNode.addComponent(cc.Button);
      btn.transition = cc.Button.Transition.SCALE;
      btn.zoomScale = 1.05;
      btnNode.setContentSize(140, 54);
      btnNode.setPosition(0, -85);
      const btnBg = btnNode.addComponent(cc.Sprite);
      btnBg.spriteFrame = null as any;
      const btnLabel = new cc.Node('label');
      const btnText = btnLabel.addComponent(cc.Label);
      btnText.fontSize = 22;
      btnText.lineHeight = 28;
      btnText.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
      btnText.verticalAlign = cc.Label.VerticalAlign.CENTER;
      btnNode.addChild(btnLabel);
      btnLabel.setPosition(0, 0);

      const status = this.getDayStatus(reward.day);
      const isClaimed = status === 'done';
      const isCurrent = status === 'current';
      const canClaim = isCurrent;

      if (isClaimed) {
        btnText.string = 'Claimed';
        btn.interactable = false;
        btnNode.color = new cc.Color(170, 170, 170);
      } else if (canClaim) {
        btnText.string = 'Claim';
        btn.interactable = true;
        btnNode.color = new cc.Color(255, 205, 92);
        btnNode.on(cc.Node.EventType.TOUCH_END, () => {
          this.claimReward(reward.day);
        }, this);
      } else {
        btnText.string = 'Not yet';
        btn.interactable = false;
        btnNode.color = new cc.Color(200, 200, 200);
      }

      card.addChild(btnNode);
      container.addChild(card);
      this.rewardCards.push(card);
    }

    const extraNode = new cc.Node('extraReward');
    const extraLabel = extraNode.addComponent(cc.Label);
    extraLabel.string = 'Completed 7-day login: +50 Gold';
    extraLabel.fontSize = 26;
    extraLabel.lineHeight = 32;
    extraLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    extraLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
    extraNode.setPosition(0, -320);
    container.addChild(extraNode);
    this.rewardCards.push(extraNode);
  }

  private clearCards() {
    this.rewardCards.forEach((node) => {
      if (node && node.parent) {
        node.destroy();
      }
    });
    this.rewardCards = [];
  }

  private getPropName(propType?: PropType) {
    if (propType === PropType.tipCard) return 'Tip Prop';
    if (propType === PropType.reshuffleCard) return 'Refresh Prop';
    if (propType === PropType.freezeCard) return 'Freeze Prop';
    return 'Reward';
  }

  private claimReward(day: number) {
    const reward = this.rewardMap.get(day);
    if (!reward) return;

    const state = this.getSignState();
    const claimed = new Set(state.claimedDays || []);
    if (claimed.has(day)) return;

    const nextDay = this.getNextClaimDay();
    if (day !== nextDay) {
      console.log('SignPage claim invalid day:', day, 'nextDay:', nextDay);
      return;
    }

    const nextState = {
      ...state,
      claimedDays: Array.from(new Set([...(state.claimedDays || []), day])).sort((a, b) => a - b)
    };
    nextState.lastClaimDay = day;
    nextState.lastClaimDate = new Date().toISOString();

    this.giveReward(reward, nextState);

    this.saveSignState(nextState);
    this.refreshUI();
  }

  private giveReward(reward: ISignRewardConfig, stateAfterClaim?: ISignState) {
    const playerData = PlayerDataSys as any;

    if (reward.type === 'coin') {
      playerData.addUserGoldBalance(reward.value, true);
      return;
    }

    const type = reward.propType;
    if (type === PropType.tipCard) {
      playerData.tipCardCount = Number(playerData.tipCardCount || 0) + reward.value;
    } else if (type === PropType.reshuffleCard) {
      playerData.reshuffleCardCount = Number(playerData.reshuffleCardCount || 0) + reward.value;
    } else if (type === PropType.freezeCard) {
      playerData.freezeCardCount = Number(playerData.freezeCardCount || 0) + reward.value;
    }

    EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT, null);

    const currentState = stateAfterClaim || this.getSignState();
    if (this.isAllRewardClaimed(currentState)) {
      playerData.addUserGoldBalance(50, true);
    }
  }

  private isAllRewardClaimed(state?: ISignState): boolean {
    const currentState = state || this.getSignState();
    const claimed = currentState.claimedDays || [];
    return claimed.length >= SIGN_REWARD_CONFIG.length;
  }

  onClose() {
    this._hide();
  }
}