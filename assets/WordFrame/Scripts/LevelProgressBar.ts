import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import LevelItem from "./LevelItem";

const { ccclass, property } = cc._decorator;

enum LevelState {
    Completed,   // 已完成的关卡
    Current,     // 当前要挑战的关卡 (maxLevelReached + 1)
    Locked       // 未解锁的关卡 (maxLevelReached + 2 及以后)
}

@ccclass
export default class LevelProgressBar extends cc.Component {

    @property(cc.Sprite)
    progressBar: cc.Sprite = null;

    @property(cc.Node)
    levelItemsParent: cc.Node = null;

    @property(cc.Node)
    levelItemPrefab: cc.Node = null;

    @property([cc.SpriteFrame])
    gn_icon: cc.SpriteFrame[] = [];

    @property
    type = 1

    private levelConfig = {
        maxLevelReached: 0, // 玩家当前已完成的最高关卡，从0开始表示未完成第1关
        unlockedFeatures: {
            2: "UP",
            3: "round:1/3",
            15: "Withdraw" // 15关解锁提现功能，其提示文字显示在15关的关卡节点下方
        }
    };

    private currentLevels: number[] = []; // 当前显示的关卡列表
    private levelItemNodes: cc.Node[] = []; // 存储创建的关卡节点
    static ins: LevelProgressBar = null

    onLoad() {
        LevelProgressBar.ins = this;

        this.chcecUpdatePro();
        cc.director.on("resfLv", () => {
            this.chcecUpdatePro();
        }, this)
    }

    chcecUpdatePro() {
        this.levelConfig.maxLevelReached = FrameSDK.frameData.gameData.passLevel //== 1 ? 1 : FrameSDK.frameData.gameData.passLevel + 1;
        console.log("Current maxLevelReached:", this.levelConfig.maxLevelReached,FrameSDK.frameData.gameData.passLevel); // 调试信息
        this.updateProgressBar();
    }

    // 更新进度条显示
    private updateProgressBar() {
        this.currentLevels = this.generateCurrentLevels(this.levelConfig.maxLevelReached);
        this.renderLevelItems();
    }

    // 根据当前最高关卡生成要显示的关卡列表
    private generateCurrentLevels(maxLevelReached: number): number[] {
        let levelsToShow: number[] = [];
        const fixedWithdrawLevel = 15; // 第15关是一个特殊的固定位

        if (maxLevelReached < fixedWithdrawLevel) {
            // maxLevelReached < 15 阶段：第四个节点固定为15
            let groupStartLevel: number; // 当前显示组的第一个关卡

            // 确定当前活跃的3关小组的起始
            if (maxLevelReached < 3) { // maxReached = 0, 1, 2
                groupStartLevel = 1; // 组 [1, 2, 3, 15]
            } else if (maxLevelReached < 6) { // maxReached = 3, 4, 5
                groupStartLevel = 4; // 组 [4, 5, 6, 15]
            } else if (maxLevelReached < 9) { // maxReached = 6, 7, 8
                groupStartLevel = 7; // 组 [7, 8, 9, 15]
            } else if (maxLevelReached < 12) { // maxReached = 9, 10, 11
                groupStartLevel = 10; // 组 [10, 11, 12, 15]
            } else { // maxLevelReached = 12, 13, 14 (特殊处理，因为15是固定位，需要包含它)
                // 此时 maxLevelReached 达到 12 或更高，但仍小于 15
                // 如果 maxLevelReached = 12，显示 [12, 13, 14, 15]
                // 如果 maxLevelReached = 13，显示 [12, 13, 14, 15]
                // 如果 maxLevelReached = 14，显示 [12, 13, 14, 15]
                groupStartLevel = fixedWithdrawLevel - 3; // 确保从12开始 [12, 13, 14, 15]
            }

            levelsToShow.push(groupStartLevel);
            levelsToShow.push(groupStartLevel + 1);
            levelsToShow.push(groupStartLevel + 2);
            levelsToShow.push(fixedWithdrawLevel); // 第四个节点固定为15

        } else {
            // maxLevelReached >= 15 阶段：没有固定15关，按4个一组递进
            let groupStartLevel: number;

            // 计算当前所在的4关组的起始关卡
            // maxLevelReached = 15,16,17,18 时，组起始是16
            // maxLevelReached = 19,20,21,22 时，组起始是20
            // 规律： (maxLevelReached - 15) 除以 4，然后乘以 4，再加上 16
            groupStartLevel = Math.floor((maxLevelReached - fixedWithdrawLevel) / 4) * 4 + fixedWithdrawLevel + 1;

            levelsToShow.push(groupStartLevel);
            levelsToShow.push(groupStartLevel + 1);
            levelsToShow.push(groupStartLevel + 2);
            levelsToShow.push(groupStartLevel + 3);
        }

        return levelsToShow;
    }


    // 渲染关卡项 (此方法保持不变，因为它已经能够正确判断状态，并特殊处理15关的锁定状态)
    private renderLevelItems() {
        // this.levelItemsParent.removeAllChildren();
        this.levelItemNodes = [];

        const fixedWithdrawLevel = 15; // 定义固定提现关卡

        for (let i = 0; i < this.currentLevels.length; i++) {
            const level = this.currentLevels[i];
            const levelItemNode = this.levelItemsParent.children[i]//cc.instantiate(this.levelItemPrefab);
            // this.levelItemsParent.addChild(levelItemNode);
            this.levelItemNodes.push(levelItemNode);

            const comp = levelItemNode.getComponent(LevelItem)
            let gou = comp.gou;
            let currNode = comp.currNode;
            let withdrawNode = comp.WithdrawNode;
            let gn_unlock = comp.gn_unlock;
            let level_loop = comp.level_loop;
            gou.active = false;
            currNode.active = false;
            withdrawNode.active = false;
            gn_unlock.active = false;
            level_loop.active = false;

            const levelNumberLabel = comp.LevelNumber;//levelItemNode.getChildByName("LevelNumber").getComponent(cc.Label);
            //关卡轮次
            const featureTip = comp.FeatureTip;//levelItemNode.getChildByName("FeatureTip").getComponent(cc.Label);

            levelNumberLabel.string = level.toString();

            let state: LevelState;

            // 特殊处理：如果 maxLevelReached < 15 并且当前关卡是15，则它始终是锁定状态
            if (this.levelConfig.maxLevelReached < fixedWithdrawLevel && level === fixedWithdrawLevel) {
                state = LevelState.Locked; // 强制15关为锁定
                levelNumberLabel.node.active = true; // 显示数字15
                withdrawNode.active = true;
                levelNumberLabel.node.color = cc.Color.WHITE;
            } else if (level <= this.levelConfig.maxLevelReached) { // 此关卡已完成
                state = LevelState.Completed;
                levelNumberLabel.node.active = false;
                gou.active = true;
            } else if (level === this.levelConfig.maxLevelReached + 1) { // 此关卡是当前要挑战的
                state = LevelState.Current;
                levelNumberLabel.node.active = true;
                currNode.active = true;
                let CurTurnInfo = FrameSDK.frameData.gameFuc.getCurTurnInfo();
                if (CurTurnInfo.totalTurn > 1) {
                    level_loop.active = true;
                    featureTip.string = `Round:${CurTurnInfo.curTurn+1}/${CurTurnInfo.totalTurn}`;
                }
                level_loop.active = false;//不要了
            } else { // 此关卡未解锁
                state = LevelState.Locked;
                levelNumberLabel.node.active = true;
                // levelNumberLabel.node.color = cc.color().fromHEX("#656B7E");

            }
            if(this.type == 2){
                continue;
            }
            if(this.levelConfig.maxLevelReached+1 == 15 && level === fixedWithdrawLevel){
                withdrawNode.active = true;
                withdrawNode.getChildByName("Withdraw").active = false;
                levelNumberLabel.node.active = true;
                let CurTurnInfo = FrameSDK.frameData.gameFuc.getCurTurnInfo();
                if (CurTurnInfo.totalTurn > 1) {
                    level_loop.active = true;
                    featureTip.string = `Round:${CurTurnInfo.curTurn+1}/${CurTurnInfo.totalTurn}`;
                }
                level_loop.active = false;//不要了
            }


            // "charityLevel": 3,//公益解锁关卡
            // "ratingLevel": 4,//评星
            // "taskLevel": 5,//任务解锁
            // "bankLevel": 2,//猪解锁
            // if (this.levelConfig.unlockedFeatures[level]) {
            //     featureTip.string = this.levelConfig.unlockedFeatures[level];
            //     featureTip.node.active = true;
            // } else {
            //     featureTip.node.active = false;
            // }
            let frameData = FrameData.FRAME_CONF;
            if (!gou.active) {
                if (level == frameData.charityLevel) {
                    gn_unlock.active = true;
                    comp.gn_icon.spriteFrame = this.gn_icon[2];
                }
                if (level == frameData.taskLevel) {
                    gn_unlock.active = true;
                    comp.gn_icon.spriteFrame = this.gn_icon[1];
                }
                if (level == frameData.ClockLevel) {
                    gn_unlock.active = true;
                    comp.gn_icon.spriteFrame = this.gn_icon[3];
                }
                if (level == frameData.bankLevel) {
                    gn_unlock.active = true;
                    comp.gn_icon.spriteFrame = this.gn_icon[0];
                }
                gn_unlock.active = false;//不要了
            }

        }
    }

    public completeLevel() {
        this.levelConfig.maxLevelReached++;
        cc.log("Current maxLevelReached (completed):", this.levelConfig.maxLevelReached); // 调试信息
        this.updateProgressBar();
    }

    public resetLevels() {
        this.levelConfig.maxLevelReached = 0; // 从0开始
        cc.log("Reset maxLevelReached:", this.levelConfig.maxLevelReached); // 调试信息
        this.updateProgressBar();
    }
}