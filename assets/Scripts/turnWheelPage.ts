import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EngineUtil from './framework/EngineUtil';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import BasePage from './view/BasePage';

const {
  ccclass,
  property
} = cc._decorator;

export type WheelPropType = 'reshuffleCard' | 'tipCard' | 'freezeCard';

export interface IWheelRewardConfig {
  id: string;
  label: string;
  value: number;
  type: 'coin' | 'prop';
  propType?: WheelPropType;
  color?: cc.Color;
  weight?: number;
}

export interface ITurnPageData {
  freeCount?: number;
  rewards?: IWheelRewardConfig[];
  coinRewards?: number[];
  propRewards?: {
    reshuffleCard?: number;
    tipCard?: number;
    freezeCard?: number;
  };
}

@ccclass
export default class turnWheelPage extends BasePage {
  @property(cc.Node)
  wheelNode: cc.Node | null = null;

  @property(cc.Node)
  pointerNode: cc.Node | null = null;

  @property(cc.Node)
  startBtn: cc.Node | null = null;
  @property(cc.Node)
  closeNode: cc.Node | null = null;

  @property(cc.Label)
  freeCountLabel: cc.Label | null = null;

  @property(cc.Label)
  resultLabel: cc.Label | null = null;

  @property(cc.Label)
  titleLabel: cc.Label | null = null;

  @property([cc.Label])
  itemLabel: cc.Label[] | null = [];


  private rewardConfig: IWheelRewardConfig[] = [];
  private spinEnabled = true;
  private currentRotation = 0;
  private rotateTween: any = null;
  private freeChance = 300;
  private lastReward: IWheelRewardConfig | null = null;

  defaultRewards: IWheelRewardConfig[] = [
    { id: 'coin_1', label: 'x5', value: 5, type: 'coin', color: new cc.Color(120, 235, 120, 255), weight: 5 },
    { id: 'prop_refresh', label: '+1', value: 1, type: 'prop', propType: 'reshuffleCard', color: new cc.Color(155, 140, 255, 255), weight: 3 },
    { id: 'coin_2', label: 'x8', value: 8, type: 'coin', color: new cc.Color(120, 198, 255, 255), weight: 5 },
    { id: 'prop_tip', label: '+1', value: 1, type: 'prop', propType: 'tipCard', color: new cc.Color(120, 235, 120, 255), weight: 3 },
    { id: 'coin_3', label: 'x12', value: 12, type: 'coin', color: new cc.Color(255, 196, 102, 255), weight: 6 },
    { id: 'prop_freeze', label: '+1', value: 1, type: 'prop', propType: 'freezeCard', color: new cc.Color(255, 166, 90, 255), weight: 2 }
  ];

  start() {
    this.refreshUI();
  }

  _init(data?: ITurnPageData) {
    this.rewardConfig = this.defaultRewards;
    // this.freeChance = Number(data && data.freeCount !== undefined ? data.freeCount : );
    this.refreshUI();
  }

  onEnable() {
    super.onEnable.call(this);
    this.refreshUI();
  }

  onDisable() {
    if (this.rotateTween) {
      this.rotateTween.stop();
      this.rotateTween = null;
    }
  }

 
  
  private refreshUI() {
    if (this.freeCountLabel) {
      this.freeCountLabel.string = `Remaining ${this.freeChance} times`;
    }
    if (this.titleLabel) {
      this.titleLabel.string = 'Lucky Wheel';
    }
    if (this.resultLabel && !this.lastReward) {
      this.resultLabel.string = 'Tap to spin';
    }
    console.log(".........  refreshUI  rewardConfig", this.rewardConfig);

    for (let i = 0; i < (this.itemLabel ? this.itemLabel.length : 0); i++) {
      const label = this.itemLabel[i];
      if (label) {
        const reward = this.rewardConfig[i];
        if (reward) {
          label.string = reward.label;
          label.node.color = reward.color || new cc.Color(255, 190, 90, 255);
        } else {
          label.string = '';
        }
      }
    }
  }

  private onStartSpin() {
    console.log(".........  onStartSpin  onStartSpin", this.spinEnabled,this.freeChance);
    if (!this.spinEnabled || this.freeChance <= 0) {
      if (this.resultLabel) {
        this.resultLabel.string = this.freeChance <= 0 ? 'No spins left today' : 'Spinning...';
      }
      return;
    }

    this.spinEnabled = false;
    this.freeChance = Math.max(0, this.freeChance - 1);

    // 先按权重随机命中一个奖励，再根据这个奖励去转盘
    const reward = this.chooseReward();
    this.lastReward = reward;

    // 立即刷新次数文案，避免动画过程中显示异常
    if (this.freeCountLabel) {
      this.freeCountLabel.string = `Remaining ${this.freeChance} times`;
    }

    this.doSpin(reward);
  }

  private chooseReward(): IWheelRewardConfig {
    const rewards = this.rewardConfig.length > 0 ? this.rewardConfig : this.defaultRewards;
    const totalWeight = rewards.reduce((sum, reward) => sum + (reward.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < rewards.length; i++) {
      const reward = rewards[i];
      random -= reward.weight || 1;
      if (random <= 0) {
        return reward;
      }
    }

    return rewards[0];
  }




  private targetIdx: number = 0;  //中奖区域序号[0-5]
  private targetRadian: number = 60;    //中奖区域的弧度

  private doSpin(reward: IWheelRewardConfig) {
    if (!this.wheelNode) return;

    this.wheelNode.angle = 0;

    const rewards = this.rewardConfig.length > 0 ? this.rewardConfig : turnWheelPage.defaultRewards;
    const rewardIndex = rewards.findIndex((item) => item.id === reward.id);
    this.targetIdx = rewardIndex >= 0 ? rewardIndex : 0;

    console.log("===== targetIdx", this.targetIdx);
    let rotateTime = 3;//Math.round(Math.random() * 2) + 2;    //旋转时间
    let targetRound = Math.round(Math.random() * rotateTime) + rotateTime;    //旋转圈数
    let randomAngle = this.getRandomAngle();    //增加真实性，中奖区域加个随机角度
    let targetAngle = 360 - this.targetIdx * this.targetRadian;
    let totalAngle = 360 * (targetRound * 2) + targetAngle + randomAngle;

    if (this.targetIdx > 0) {
        // this.sendGetAward();
        
    }

    this.spinEnabled = false;
    // this.turnSkeleton.setAnimation(0, "zhuandong", true);
    cc.tween(this.wheelNode)
        .by(rotateTime, { angle: -totalAngle }, { easing: "sineInOut" })
        .call(() => {
            this.spinEnabled = true;
            // 转完之后，才把中奖结果发放给玩家
            this.onRewardGet(reward);
        })
        .start();
  }

  private onRewardGet(reward: IWheelRewardConfig) {

    if (this.freeCountLabel) {
      this.freeCountLabel.string = `Remaining ${this.freeChance} times`;
    }

    const playerData = PlayerDataSys as any;
    if (reward.type === 'coin') {
      playerData.addUserCoinBalance && playerData.addUserCoinBalance(reward.value);
    } else if (reward.type === 'prop' && reward.propType) {
      const current = {
        prop1_num: Number(playerData.reshuffleCardCount || 0),
        prop2_num: Number(playerData.tipCardCount || 0),
        prop3_num: Number(playerData.freezeCardCount || 0)
      };

      if (reward.propType === 'reshuffleCard') {
        current.prop1_num += Number(reward.value || 0);
      } else if (reward.propType === 'tipCard') {
        current.prop2_num += Number(reward.value || 0);
      } else if (reward.propType === 'freezeCard') {
        current.prop3_num += Number(reward.value || 0);
      }

      playerData.reshuffleCardCount = current.prop1_num;
      playerData.tipCardCount = current.prop2_num;
      playerData.freezeCardCount = current.prop3_num;
      playerData.setUserPropCount && playerData.setUserPropCount(current, false);
    }

    AudioManager.getInstance().playMusic('btntouch');
    EventMgr.trigger(GameEventType.UPDATE_WHEEL_BUBBLE, null);
    SdkHelper.reportData('click_lucky_wheel', {
      rewardId: reward.id,
      rewardType: reward.type,
      rewardValue: reward.value,
      propType: reward.propType || ''
    });
  }

  onClose() {
    this._hide();
  }

  reStartGame() {
    this.onStartSpin();
  }

      // 获取中奖区域的随机角度 
  private getRandomAngle(): number {
      return this.getRandomInt(-22, 22);
  }

  public getRandomInt(min: number = 0, max: number = 1): number {
      return Math.floor(this.random() * (max - min) + min);
  }

  random() {
      return Math.random()
  }
}
