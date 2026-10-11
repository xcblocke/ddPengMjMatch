import { gameData } from './data/GameData';
import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EngineUtil from './framework/EngineUtil';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import AdManager from './framework/Platform/AdManager';
import BasePage from './view/BasePage';
import SetNode2Top from './common/SetNode2Top';
import GlobalApp from './common/GlobalApp';
import { PropType } from './framework/enum/AllEnum';

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
  spinCost?: number;
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

  @property([cc.Node])
  targetNodes: cc.Node[] | null = [];

  @property(cc.SpriteFrame)
  icons: cc.SpriteFrame[] = [];


  private rewardConfig: IWheelRewardConfig[] = [];
 
  private rotateTween: any = null;
  private freeChance = 10;
  private spinCost = 20;
  private lastReward: IWheelRewardConfig | null = null;
  private isSpinning = false;

  _type = 0;


  defaultRewards: IWheelRewardConfig[] = [
    { id: 'coin_1', label: 'x5', value: 5, type: 'coin', color: new cc.Color(120, 235, 120, 255), weight: 5 },
    { id: 'prop_refresh', label: '+1', value: 1, type: 'prop', propType: 'reshuffleCard', color: new cc.Color(155, 140, 255, 255), weight: 3 },
    { id: 'coin_2', label: 'x8', value: 8, type: 'coin', color: new cc.Color(120, 198, 255, 255), weight: 5 },
    { id: 'prop_tip', label: '+1', value: 1, type: 'prop', propType: 'tipCard', color: new cc.Color(120, 235, 120, 255), weight: 3 },
    { id: 'coin_3', label: 'x12', value: 12, type: 'coin', color: new cc.Color(255, 196, 102, 255), weight: 6 },
    { id: 'prop_freeze', label: '+1', value: 1, type: 'prop', propType: 'freezeCard', color: new cc.Color(255, 166, 90, 255), weight: 2 }
  ];

  start() {
    // this.refreshUI();
    this.isSpinning = false;
  }

  _init(data?: ITurnPageData) {
    const pageData = data || {} as ITurnPageData;
    this.rewardConfig = this.defaultRewards;
    this.refreshUI();
  }

  onEnable() {
    super.onEnable.call(this);
    this.wheelNode.angle = 0;
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

    const labelList = this.itemLabel || [];
    for (let i = 0; i < labelList.length; i++) {
      const label = labelList[i];
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
    if(this.isSpinning)    
    {
      return;
    }
    const gameDataRef = gameData as any;
    const hasFreeSpin = this.freeChance > 0;
    const currentCoin = Number(gameDataRef?.dollarBalance || 0);
    console.log("Current coin balance:。。。。。。。。。。。。", currentCoin, "Spin cost:", this.spinCost);

    if (!hasFreeSpin) {
      if (currentCoin < this.spinCost) {
        if (this.resultLabel) {
          this.resultLabel.string = `Not enough coins, need ${this.spinCost}`;
        }
       
        return;
      }
      let newdollarBalance = currentCoin - this.spinCost;
      if (newdollarBalance < 0) {
        newdollarBalance = 0;
      }
      if (gameDataRef) {
        gameDataRef.dollarBalance = newdollarBalance;
      }
      EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, newdollarBalance);
    } else {
      this.freeChance = Math.max(0, this.freeChance - 1);
    }

    // 先按权重随机命中一个奖励，再根据这个奖励去转盘
    const reward = this.chooseReward();
    this.lastReward = reward;

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
    this.isSpinning = true;

    const rewards = this.rewardConfig.length > 0 ? this.rewardConfig : this.defaultRewards;
    const rewardIndex = rewards.findIndex((item: IWheelRewardConfig) => item.id === reward.id);
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

    // this.turnSkeleton.setAnimation(0, "zhuandong", true);
    cc.tween(this.wheelNode)
        .by(rotateTime, { angle: -totalAngle }, { easing: "sineInOut" })
        .call(() => {

            // 转完之后，才把中奖结果发放给玩家
            this.onRewardGet(reward);
        })
        .start();
  }

  private onRewardGet(reward: IWheelRewardConfig) {
    const playerData = PlayerDataSys as any;
    const gameDataRef = gameData as any;

    if (reward.type === 'coin') {
      // let newdollarBalance = Number(gameDataRef?.dollarBalance || 0) + reward.value;
      // if (gameDataRef) {
      //   gameDataRef.dollarBalance = newdollarBalance;
      // }
      // EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, newdollarBalance);
      this.flyCoins();
    } else if (reward.type === 'prop' && reward.propType) {
      const current = {
        prop1_num: Number(playerData.reshuffleCardCount || 0),
        prop2_num: Number(playerData.tipCardCount || 0),
        prop3_num: Number(playerData.freezeCardCount || 0)
      };

      if (reward.propType === 'reshuffleCard') {
        current.prop1_num += Number(reward.value || 0);
        this._type = PropType.reshuffleCard;
      } else if (reward.propType === 'tipCard') {
        current.prop2_num += Number(reward.value || 0);
        this._type = PropType.tipCard;
      } else if (reward.propType === 'freezeCard') {
        current.prop3_num += Number(reward.value || 0);
        this._type = PropType.freezeCard;
      }

      playerData.reshuffleCardCount = current.prop1_num;
      playerData.tipCardCount = current.prop2_num;
      playerData.freezeCardCount = current.prop3_num;
      playerData.setUserPropCount && playerData.setUserPropCount(current, false);
      this.flyProps();
    }

    if (this.resultLabel) {
      this.resultLabel.string = reward.type === 'coin'
        ? `Received ${reward.value} coins`
        : reward.type === 'prop' && reward.propType === 'reshuffleCard'
          ? `Received refresh item x${reward.value}`
          : reward.type === 'prop' && reward.propType === 'tipCard'
            ? `Received hint item x${reward.value}`
            : reward.type === 'prop' && reward.propType === 'freezeCard'
              ? `Received freeze item x${reward.value}`
              : 'Received reward';
    }

    if (this.freeCountLabel) {
      this.freeCountLabel.string = `Remaining ${this.freeChance} times`;
    }

    AudioManager.getInstance().playMusic('btntouch');
    EventMgr.trigger(GameEventType.UPDATE_WHEEL_BUBBLE, null);
    EventMgr.trigger(GameEventType.UPDATE_BALANCE, null);
    // EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, gameData.dollarBalance);
    SdkHelper.reportData('click_lucky_wheel', {
      rewardId: reward.id,
      rewardType: reward.type,
      rewardValue: reward.value,
      propType: reward.propType || ''
    });
  }

  onClose() {
    if(this.isSpinning) {
      console.log("Spin in progress, cannot close the page.");
      return;
    }
    this._hide();
  }

  onClickGetFree() {
    if (cc.sys.isBrowser) {
      this.freeChance = (this.freeChance || 0) + 1;
      this.refreshUI();
      if (this.resultLabel) {
        this.resultLabel.string = 'Get 1 free spin';
      }
      return;
    }

    if (cc.sys.isNative) {
      const adMgr = AdManager.getInstance() as unknown as AdManager | null;
      if (!adMgr) {
        if (this.resultLabel) {
          this.resultLabel.string = 'Reward ad is not available';
        }
        return;
      }

      adMgr.playVideoAd(() => {
        this.freeChance = (this.freeChance || 0) + 1;
        this.refreshUI();
        if (this.resultLabel) {
          this.resultLabel.string = 'Reward video complete, got 1 free spin';
        }
      }, () => {
        if (this.resultLabel) {
          this.resultLabel.string = 'Reward video failed, please try again';
        }
      });
      return;
    }

    if (this.resultLabel) {
      this.resultLabel.string = 'This platform does not support free spin reward';
    }
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


  flyCoins() {
 
    var e = this;
    
    SetNode2Top.setTopZIndex(GlobalApp.GameMain.dollarNode);
    AudioManager.getInstance().playMusic("addbalance");
    EventMgr.trigger(GameEventType.SHOWEFFECT, {
      start: this.targetNodes[this.targetIdx].parent.convertToWorldSpaceAR(this.targetNodes[this.targetIdx].position),
      num: 4,
      type: 3,
      cb: function () {
        // Balance is already written on level-pass; claim only refreshes UI after fly.
        EventMgr.trigger(GameEventType.UPDATE_DOLLARBALANCE, gameData.dollarBalance);
        EventMgr.trigger(GameEventType.SHOWDOLLARBALANCEEFFECT, {
          type: 3,
          num: this.lastReward?.value || 0
        });

        e.isSpinning = false;
  
        // Do not call allBtnClick -> openVideo: on browser AdManager plays success immediately; on APK it waits for reward video (3~5s). Local coin claim does not need an ad.
        SdkHelper.reportData("big_reward_all");
        SetNode2Top.restoreNode(GlobalApp.GameMain.dollarNode);
        
        // e._coinFlyOnClaim = false;
        // e.close();
      }
    });
  }

  flyProps() {
    var e = this,
      t = cc.instantiate(this.targetNodes[this.targetIdx]);
    t.parent = this.targetNodes[this.targetIdx].parent;
    // this.cliamBtn.interactable = false;
    this.targetNodes[this.targetIdx].parent.convertToWorldSpaceAR(this.targetNodes[this.targetIdx].position);
    var o = null;
    if (this._type == PropType.tipCard) {
      o = GlobalApp.GameMain.propContainer.getChildByName("tipBtn");
    } else {
      if (this._type == PropType.reshuffleCard) {
        o = GlobalApp.GameMain.propContainer.getChildByName("reshuffleCard");
      } else {
        this._type == PropType.freezeCard {
          o = GlobalApp.GameMain.propContainer.getChildByName("freeze");
        }
      }
    }
    var n = o.parent.convertToWorldSpaceAR(o.position),
      a = t.parent.convertToNodeSpaceAR(n);
    t.scale = 0.6;
    AudioManager.instance.playMusic("xiu");
    AudioManager.instance.playMusic("dztx");
  
    cc.tween(t).to(0.7, {
      position: a,
      scale: 0
    }, {
      easing: "backIn"
    }).call(function () {
      cc.tween(o).to(0.1, {
        scale: 1.1
      }).to(0.1, {
        scale: 1
      }).to(0.1, {
        scale: 0.9
      }).to(0.1, {
        scale: 1
      }).start();
      EventMgr.trigger(GameEventType.REFRESH_PROP_COUNT);
      e.isSpinning = false;
      t.destroy();
      // e.close();
      // e._hide();
    }).start();
  }

  flyFreeReward() {
    if (!this.wheelNode) return;
    const freeCount = 1;
  } 
}
