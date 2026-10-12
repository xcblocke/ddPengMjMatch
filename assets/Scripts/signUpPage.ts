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
import signUpItem from './signUpItem';

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
  { day: 1, type: 'coin', value: 3, label: 'X3' },
  { day: 2, type: 'coin', value: 5, label: 'X5' },
  { day: 3, type: 'coin', value: 8, label: 'X8' },
  { day: 4, type: 'coin', value: 10, label: 'X10' },
  { day: 5, type: 'coin', value: 15, label: 'X15'},
  { day: 6, type: 'coin', value: 20, label: 'X20' },
  { day: 7, type: 'coin', value: 50, label: 'X50' }
];

const SIGN_STATE_KEY = 'seven_day_sign_state_v1';

@ccclass
export default class signUpPage extends BasePage {
  @property(cc.Node)
  contentNode: cc.Node = null;  

  @property(cc.Prefab)
  itemnode: cc.Prefab = null;


  private rewardCards: signUpItem[] = [];
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
  

   

    for (let i = 0; i < SIGN_REWARD_CONFIG.length - 1; i++) {
      let itemNode = cc.instantiate(this.itemnode);
      
      this.contentNode.addChild(itemNode);

      
      this.rewardCards.push(itemNode.getComponent(signUpItem));
    }
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