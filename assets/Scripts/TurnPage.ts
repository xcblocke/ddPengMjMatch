import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
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
  type: 'thanks' | 'coin' | 'prop';
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
export default class TurnPage extends BasePage {
  @property(cc.Node)
  wheelNode: cc.Node | null = null;

  @property(cc.Node)
  pointerNode: cc.Node | null = null;

  @property(cc.Node)
  startBtn: cc.Node | null = null;

  @property(cc.Label)
  freeCountLabel: cc.Label | null = null;

  @property(cc.Label)
  resultLabel: cc.Label | null = null;

  @property(cc.Label)
  titleLabel: cc.Label | null = null;

  private rewardConfig: IWheelRewardConfig[] = [];
  private spinEnabled = true;
  private currentRotation = 0;
  private rotateTween: any = null;
  private freeChance = 3;
  private lastReward: IWheelRewardConfig | null = null;

  static defaultRewards: IWheelRewardConfig[] = [
    { id: 'thanks_1', label: 'Thanks for participating', value: 0, type: 'thanks', color: new cc.Color(255, 196, 120, 255), weight: 1 },
    { id: 'thanks_2', label: 'Thanks for participating', value: 0, type: 'thanks', color: new cc.Color(255, 196, 120, 255), weight: 1 },
    { id: 'coin_1', label: 'x50', value: 50, type: 'coin', color: new cc.Color(120, 235, 120, 255), weight: 1 },
    { id: 'coin_2', label: 'x80', value: 80, type: 'coin', color: new cc.Color(120, 198, 255, 255), weight: 1 },
    { id: 'coin_3', label: 'x120', value: 120, type: 'coin', color: new cc.Color(255, 196, 102, 255), weight: 1 },
    { id: 'prop_refresh', label: '+1', value: 1, type: 'prop', propType: 'reshuffleCard', color: new cc.Color(155, 140, 255, 255), weight: 1 },
    { id: 'prop_tip', label: '+1', value: 1, type: 'prop', propType: 'tipCard', color: new cc.Color(120, 235, 120, 255), weight: 1 },
    { id: 'prop_freeze', label: '+1', value: 1, type: 'prop', propType: 'freezeCard', color: new cc.Color(255, 166, 90, 255), weight: 1 }
  ];

  start() {
    this.refreshUI();
  }

  _init(data?: ITurnPageData) {
    this.rewardConfig = this.buildRewardConfig(data);
    this.freeChance = Number(data && data.freeCount !== undefined ? data.freeCount : 3);
    this.ensureWheel();
    this.refreshUI();
  }

  onEnable() {
    super.onEnable.call(this);
    this.ensureWheel();
    this.refreshUI();
  }

  onDisable() {
    if (this.rotateTween) {
      this.rotateTween.stop();
      this.rotateTween = null;
    }
  }

  private buildRewardConfig(data?: ITurnPageData): IWheelRewardConfig[] {
    const safeData = data || {} as ITurnPageData;
    const rewards = Array.isArray(safeData.rewards) && safeData.rewards.length === 8 ? safeData.rewards : this.generateDefaultRewards(safeData);
    return rewards.map((reward: any, index: number) => {
      const item: any = Object.assign({}, reward, {
        id: reward.id || `reward_${index}`,
        label: reward.label || `${reward.value || 0}`,
        type: reward.type || 'coin',
        weight: reward.weight || 1,
        color: reward.color || new cc.Color(255, 190, 90, 255),
        propType: reward.propType || 'reshuffleCard'
      });
      item.color = item.color instanceof cc.Color ? item.color : new cc.Color(item.color.r || 255, item.color.g || 190, item.color.b || 90, item.color.a || 255);
      return item;
    });
  }

  private generateDefaultRewards(data?: ITurnPageData): IWheelRewardConfig[] {
    const safeData = data || {} as ITurnPageData;
    const coinList = Array.isArray(safeData.coinRewards) && safeData.coinRewards.length >= 3 ? safeData.coinRewards : [50, 80, 120];
    const propRewards = safeData.propRewards ? safeData.propRewards : {
      reshuffleCard: 1,
      tipCard: 1,
      freezeCard: 1
    };

    const thanksRewards: IWheelRewardConfig[] = [
      { id: 'thanks_1', label: 'Thanks for participating', value: 0, type: 'thanks', color: new cc.Color(255, 196, 120, 255), weight: 1 },
      { id: 'thanks_2', label: 'Thanks for participating', value: 0, type: 'thanks', color: new cc.Color(255, 196, 120, 255), weight: 1 }
    ];

    const coinRewards: IWheelRewardConfig[] = coinList.slice(0, 3).map((value: number, index: number) => ({
      id: `coin_${index + 1}`,
      label: `x${value}`,
      value,
      type: 'coin',
      color: [new cc.Color(120, 235, 120, 255), new cc.Color(120, 198, 255, 255), new cc.Color(255, 196, 102, 255)][index],
      weight: 1
    }));

    const propList: IWheelRewardConfig[] = [
      { id: 'prop_refresh', label: '+1', value: Number(propRewards.reshuffleCard || 1), type: 'prop', propType: 'reshuffleCard', color: new cc.Color(155, 140, 255, 255), weight: 1 },
      { id: 'prop_tip', label: '+1', value: Number(propRewards.tipCard || 1), type: 'prop', propType: 'tipCard', color: new cc.Color(120, 235, 120, 255), weight: 1 },
      { id: 'prop_freeze', label: '+1', value: Number(propRewards.freezeCard || 1), type: 'prop', propType: 'freezeCard', color: new cc.Color(255, 166, 90, 255), weight: 1 }
    ];

    return thanksRewards.concat(coinRewards, propList);
  }

  private ensureWheel() {
    if (!this.node) return;

    if (!this.wheelNode) {
      this.wheelNode = new cc.Node('wheel');
      this.wheelNode.setContentSize(540, 540);
      this.node.addChild(this.wheelNode);
      this.wheelNode.setPosition(0, 0);
    }

    if (!this.pointerNode) {
      this.pointerNode = new cc.Node('pointer');
      const g = this.pointerNode.addComponent(cc.Graphics);
      g.fillColor = new cc.Color(255, 215, 96, 255);
      g.moveTo(0, 36);
      g.lineTo(-25, -30);
      g.lineTo(25, -30);
      g.close();
      g.fill();
      this.pointerNode.setPosition(0, 240);
      this.node.addChild(this.pointerNode);
    }

    if (!this.startBtn) {
      this.startBtn = new cc.Node('startBtn');
      this.startBtn.setContentSize(170, 170);
      this.startBtn.setPosition(0, 0);
      const sprite = this.startBtn.addComponent(cc.Sprite);
      sprite.spriteFrame = null as any;
      const btn = this.startBtn.addComponent(cc.Button);
      btn.transition = cc.Button.Transition.SCALE;
      btn.zoomScale = 1.05;
      this.startBtn.on(cc.Node.EventType.TOUCH_END, this.onStartSpin, this);
      this.node.addChild(this.startBtn);
    }

    if (!this.freeCountLabel) {
      const labelNode = new cc.Node('freeCountLabel');
      const label = labelNode.addComponent(cc.Label);
      label.string = 'Remaining 3 times';
      label.fontSize = 30;
      label.lineHeight = 30;
      labelNode.setPosition(0, -250);
      this.node.addChild(labelNode);
      this.freeCountLabel = label;
    }

    if (!this.titleLabel) {
      const titleNode = new cc.Node('titleLabel');
      const label = titleNode.addComponent(cc.Label);
      label.string = 'Lucky Wheel';
      label.fontSize = 54;
      label.lineHeight = 54;
      titleNode.setPosition(0, 330);
      this.node.addChild(titleNode);
      this.titleLabel = label;
    }

    if (!this.resultLabel) {
      const resultNode = new cc.Node('resultLabel');
      const label = resultNode.addComponent(cc.Label);
      label.string = 'Tap to spin';
      label.fontSize = 34;
      label.lineHeight = 34;
      resultNode.setPosition(0, -110);
      this.node.addChild(resultNode);
      this.resultLabel = label;
    }

    this.buildWheel();
  }

  private buildWheel() {
    if (!this.wheelNode) return;
    this.wheelNode.removeAllChildren();

    const g = this.wheelNode.getComponent(cc.Graphics) || this.wheelNode.addComponent(cc.Graphics);
    g.clear();
    g.fillColor = new cc.Color(255, 196, 64, 255);
    g.circle(0, 0, 260);
    g.fill();

    const rewards = this.rewardConfig.length > 0 ? this.rewardConfig : TurnPage.defaultRewards;
    const step = 360 / rewards.length;
    const radius = 190;

    for (let i = 0; i < rewards.length; i++) {
      const reward = rewards[i];
      const start = -90 + i * step;
      const end = start + step;
      const color = reward.color || new cc.Color(255, 170, 90, 255);

      g.fillColor = color;
      g.moveTo(0, 0);
      g.arc(0, 0, 260, cc.misc.degreesToRadians(start), cc.misc.degreesToRadians(end), true);
      g.fill();

      const labelNode = new cc.Node(`reward_${i}`);
      const label = labelNode.addComponent(cc.Label);
      label.string = reward.label;
      label.fontSize = 26;
      label.lineHeight = 26;
      labelNode.color = new cc.Color(255, 255, 255, 255);
      labelNode.setPosition(
        Math.cos(cc.misc.degreesToRadians(start + step / 2)) * radius,
        Math.sin(cc.misc.degreesToRadians(start + step / 2)) * radius
      );
      labelNode.rotation = -(start + step / 2);
      this.wheelNode.addChild(labelNode);
    }

    const center = new cc.Node('center');
    const centerG = center.addComponent(cc.Graphics);
    centerG.fillColor = new cc.Color(255, 190, 70, 255);
    centerG.circle(0, 0, 88);
    centerG.fill();
    this.wheelNode.addChild(center);

    const centerLabel = new cc.Node('centerText');
    const centerText = centerLabel.addComponent(cc.Label);
    centerText.string = 'Spin';
    centerText.fontSize = 46;
    centerText.lineHeight = 46;
    centerLabel.setPosition(0, 0);
    this.wheelNode.addChild(centerLabel);
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
  }

  private onStartSpin() {
    if (!this.spinEnabled || this.freeChance <= 0) {
      if (this.resultLabel) {
        this.resultLabel.string = this.freeChance <= 0 ? 'No spins left today' : 'Spinning...';
      }
      return;
    }

    this.spinEnabled = false;
    this.freeChance = Math.max(0, this.freeChance - 1);
    const reward = this.chooseReward();
    this.lastReward = reward;
    this.doSpin(reward);
  }

  private chooseReward(): IWheelRewardConfig {
    const rewards = this.rewardConfig.length > 0 ? this.rewardConfig : TurnPage.defaultRewards;
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

  private doSpin(reward: IWheelRewardConfig) {
    if (!this.wheelNode) return;

    const rewards = this.rewardConfig.length > 0 ? this.rewardConfig : TurnPage.defaultRewards;
    const rewardIndex = rewards.findIndex((item) => item.id === reward.id);
    const targetIndex = rewardIndex >= 0 ? rewardIndex : 0;
    const step = 360 / rewards.length;
    const pointerAngle = 90;
    const rewardAngle = targetIndex * step + step / 2;

    const delta = 360 * 7 + (pointerAngle - rewardAngle);
    const nextRotation = (this.currentRotation + delta) % 360;

    if (this.rotateTween) {
      this.rotateTween.stop();
    }

    this.rotateTween = cc.tween(this.wheelNode)
      .to(4.2, { angle: nextRotation }, { easing: 'outBack' })
      .call(() => {
        this.currentRotation = nextRotation;
        this.spinEnabled = true;
        this.onRewardGet(reward);
      })
      .start();
  }

  private onRewardGet(reward: IWheelRewardConfig) {
    const rewardText = reward.type === 'thanks'
      ? 'Thanks for participating'
      : reward.type === 'coin'
        ? `Received ${reward.value} coins`
        : reward.type === 'prop' && reward.propType === 'reshuffleCard'
          ? `Received refresh item x${reward.value}`
          : reward.type === 'prop' && reward.propType === 'tipCard'
            ? `Received hint item x${reward.value}`
            : reward.type === 'prop' && reward.propType === 'freezeCard'
              ? `Received freeze item x${reward.value}`
              : `Received ${reward.value} reward`;

    if (this.resultLabel) {
      this.resultLabel.string = rewardText;
    }

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
}
