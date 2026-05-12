import { FrameSDK } from "./FrameSDK";
import LevelItem from "./LevelItem";

// 适配 Cocos Creator 2.4.x 语法
const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelProgressBar extends cc.Component {

    // --- 绑定UI组件 (使用 cc.Node, cc.Label, cc.Sprite) ---

    @property(cc.Sprite)
    progressBar: cc.Sprite = null;
    @property({ type: [cc.Node] })//"请按顺序拖入5个节点位置"
    levelNodes: cc.Node[] = [];

    @property({ type: [cc.Label] })//"对应5个节点的数字Label"
    levelLabels: cc.Label[] = [];

    @property({ type: [cc.Sprite] })//"对应5个节点的背景Sprite" 
    levelSprites: cc.Sprite[] = [];

    @property({ type: [cc.Node] })//"对应5个节点的‘打钩’图标节点(默认隐藏)"
    checkMarks: cc.Node[] = [];

    // --- 资源配置 (使用 cc.SpriteFrame) ---

    @property({ type: cc.SpriteFrame })//"当前关卡背景（紫色选中）"
    sfCurrent: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })//"未通关/普通关卡背景（灰色）"
    sfLocked: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })//"已通关关卡背景（通常也是灰色或者淡色）"
    sfPassed: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })//"目标大关卡背景（特殊样式）"
    sfTarget: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })//"目标大关卡背景（特殊样式）"
    greeYezi: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })//"目标大关卡背景（特殊样式）"
    redYezi: cc.SpriteFrame = null;


    @property(cc.Node)
    turn_node: cc.Node = null;
    @property(cc.Label)
    lv_label: cc.Label = null;
    @property(cc.Label)
    turn_label: cc.Label = null;
    @property(cc.Node)
    baricon_node: cc.Node = null;


    @property({ tooltip: "开启后按 LevelProgressBar 的分组规则排列；关闭则使用原来的滑动窗口规则" })
    useGroupedLayout = true;

    maxLevelReached = 0 // 玩家当前已完成的最高关卡，从0开始表示未完成第1关

    start() {
        // 测试代码：可以在这里手动修改数字测试效果
        // this.updateProgress(1);   // 1(紫), 2, 3, 4, 15
        // this.updateProgress(3);   // 1(勾), 2(勾), 3(紫), 4, 15
        // this.updateProgress(5);   // 2(勾), 3(勾), 4(勾), 5(紫), 15
        // this.updateProgress(14);  // 11(勾), 12(勾), 13(勾), 14(紫), 15
        // this.updateProgress(15);  // 12(勾), 13(勾), 14(勾), 15(紫), 100
        // this.updateProgress(101); // 98(勾), 99(勾), 100(勾), 101(紫), 100

        // 默认初始化
        this.updateProgress(1);

        this.chcecUpdatePro();
        cc.director.on("resfLv", () => {
            this.chcecUpdatePro();
        }, this)
    }
    chcecUpdatePro() {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        const currentLevel = passLevel + 1;
        this.maxLevelReached = passLevel;
        console.log("Current passLevel/currentLevel:", passLevel, currentLevel); // 调试信息
        this.updateProgress(currentLevel);

        if(this.turn_label){
            let CurTurnInfo = FrameSDK.frameData.gameFuc.getCurTurnInfo();
            this.turn_label.node.active = false;
            if(CurTurnInfo.totalTurn > 1 && CurTurnInfo.curTurn > 0){
                this.turn_label.string = `Round ${CurTurnInfo.curTurn+1}/${CurTurnInfo.totalTurn}`;
                this.turn_label.node.active = true;
            }else{
                this.turn_label.node.active = false;
            }
            this.lv_label.string = `Lv.${currentLevel}`;
        }
    }

    /**
     * 更新进度条主逻辑
     * @param currentLevel 当前玩家所在的关卡数
     */
    updateProgress(currentLevel: number) {
        if (this.levelNodes.length < 5) {
            CC_DEBUG && cc.error("LevelProgressBar: 需要在编辑器中绑定5个节点！");
            return;
        }

        const displayLevels = this.generateDisplayLevels(this.maxLevelReached);

        // 3. 渲染UI
        this.renderUI(displayLevels, currentLevel);
        this.updateProgressBarFill(displayLevels, currentLevel);
    }

    private generateDisplayLevels(passLevel: number): number[] {
        return this.useGroupedLayout
            ? this.generateGroupedDisplayLevels(passLevel)
            : this.generateSlidingDisplayLevels(passLevel + 1);
    }

    private generateGroupedDisplayLevels(passLevel: number): number[] {
        const levelsToShow: number[] = [];
        const fixedWithdrawLevel = 15;
        const fixedFinalLevel = 100;

        if (passLevel < fixedWithdrawLevel) {
            let groupStartLevel: number;
            // 参考 LevelProgressBar 的分组规则，只是这里扩成 4 个普通节点 + 1 个固定目标节点
            if (passLevel < 4) {
                groupStartLevel = 1; // [1,2,3,4,15]
            } else if (passLevel < 8) {
                groupStartLevel = 5; // [5,6,7,8,15]
            } else if (passLevel < 12) {
                groupStartLevel = 9; // [9,10,11,12,15]
            } else {
                groupStartLevel = fixedWithdrawLevel - 4; // [11,12,13,14,15]
            }

            levelsToShow.push(groupStartLevel);
            levelsToShow.push(groupStartLevel + 1);
            levelsToShow.push(groupStartLevel + 2);
            levelsToShow.push(groupStartLevel + 3);
            levelsToShow.push(fixedWithdrawLevel);
        } else {
            let groupStartLevel = Math.floor((passLevel - fixedWithdrawLevel) / 4) * 4 + fixedWithdrawLevel + 1;
            levelsToShow.push(groupStartLevel);
            levelsToShow.push(groupStartLevel + 1);
            levelsToShow.push(groupStartLevel + 2);
            levelsToShow.push(groupStartLevel + 3);
            levelsToShow.push(fixedFinalLevel);
        }

        return levelsToShow;
    }

    private generateSlidingDisplayLevels(currentLevel: number): number[] {
        const displayLevels: number[] = [];
        let targetLevel = 15;
        if (currentLevel >= 15) {
            targetLevel = 100;
        }

        if (currentLevel <= 4) {
            displayLevels.push(1, 2, 3, 4);
        } else {
            displayLevels.push(
                currentLevel - 3,
                currentLevel - 2,
                currentLevel - 1,
                currentLevel
            );
        }

        displayLevels.push(targetLevel);
        return displayLevels;
    }

    private updateProgressBarFill(levels: number[], currentLevel: number) {
        if (!this.progressBar) return;
        if (!this.progressBar.node || this.levelNodes.length <= 0) return;

        const currentIndex = levels.findIndex(level => level === currentLevel);
        const currentNode = currentIndex >= 0 ? this.levelNodes[currentIndex] : null;
        if (!currentNode || !cc.isValid(currentNode)) return;

        const worldPos = currentNode.parent.convertToWorldSpaceAR(currentNode.position);
        const localPos = this.progressBar.node.convertToNodeSpaceAR(worldPos);
        const left = -this.progressBar.node.width * this.progressBar.node.anchorX;
        const width = this.progressBar.node.width || 1;
        const fill = (localPos.x - left) / width;

        this.progressBar.fillRange = Math.max(0, Math.min(1, fill));

        if (this.baricon_node && this.baricon_node.parent) {
            const iconLocalPos = this.baricon_node.parent.convertToNodeSpaceAR(worldPos);
            this.baricon_node.setPosition(cc.v3(iconLocalPos.x + 6, iconLocalPos.y -2 , 0));
        }
    }

    renderUI(levels: number[], currentLevel: number) {
        for (let i = 0; i < 5; i++) {
            const levelNum = levels[i];
            // const label = this.levelLabels[i];
            const sprite = this.levelSprites[i];
            const checkMark = this.checkMarks[i];

            // 安全检查
            // if (!label || !sprite || !checkMark) continue;

            const levelItemNode = this.levelNodes[i];
            const comp = levelItemNode.getComponent(LevelItem)
            let gou = comp.gou;
            let currNode = comp.currNode;
            let withdrawNode = comp.WithdrawNode;
            let gn_unlock = comp.gn_unlock;
            let level_loop = comp.level_loop;
            let statueNode = comp.statueNode;
            const label = comp.LevelNumber;
           
            currNode.active = false;
            withdrawNode.active = false;
            gn_unlock.active = false;
            level_loop.active = false;
            // comp.jiantou.active = false;

            // 仅改显示：未通过第 1 关前，把目标关卡文案 15 显示为 20。
            const passLevel = FrameSDK.frameData.gameData.passLevel;
            const displayLevelNum = passLevel <= 0 && levelNum === 15 ? 20 : levelNum;
            label.string = displayLevelNum.toString();

           
            
            // console.log("gou.active", gou.active);
            // console.log("passLevel............", passLevel);
            // console.log("displayLevelNum.......", displayLevelNum);

            // --- 状态与样式判断 ---

            // 情况A：这是第5个位置（常驻目标位置）
            if (i === 4) {
                // 设置目标样式
                if (this.sfTarget) sprite.spriteFrame = this.sfTarget;

                // 目标位置通常显示数字，不显示打钩
                label.node.active = true;
                // checkMark.active = false;
                withdrawNode.active = true;

                if (levelNum === currentLevel) {
                    if (this.sfCurrent) sprite.spriteFrame = this.sfCurrent;
                    // currNode.active = true;
                    // gou.active = false;
                }

                // 特殊情况：如果当前关卡正好等于目标关卡（例如到了100关）
                // 此时虽然它是目标，但也应该是“当前关卡”的状态（紫色选中）
                // 如果你的设计图里目标关卡永远保持特殊样式，则忽略下面这行
                // if (levelNum === currentLevel && this.sfCurrent) sprite.spriteFrame = this.sfCurrent; 
            }
            // 情况B：这是前4个位置
            else {
                if (levelNum < currentLevel) {
                    // [已通过] -> 呈现打钩通关状态
                    if (this.sfPassed) sprite.spriteFrame = this.sfPassed;
                    else if (this.sfLocked) sprite.spriteFrame = this.sfLocked; // 如果没有专门的通关底图，就用普通的

                    // 隐藏数字，显示打钩
                    label.node.active = false;
                    // checkMark.active = true;
                    currNode.active = false;
                    gou.active = true;
                    if(statueNode)
                        {
                            statueNode.active = true;
                            statueNode.getComponent(cc.Sprite).spriteFrame = this.greeYezi;
                        }
                    if(this.turn_label){
                        // label.node.active = true;
                        // gou.active = false;
                    }
                }
                else if (levelNum === currentLevel) {
                    // [当前关卡] -> 紫色选中状态
                    if (this.sfCurrent) sprite.spriteFrame = this.sfCurrent;
                    if(statueNode)
                        {
                            statueNode.active = false;
                        }
                    
                    // 显示数字，隐藏打钩
                    label.node.active = true;
                    // checkMark.active = false;
                    currNode.active = true;
                    // gou.active = false;
                }
                else {
                    // [未通关/后续关卡] -> 灰色状态
                    // if (this.sfLocked) sprite.spriteFrame = this.sfLocked;
                    if(statueNode)
                        {
                            statueNode.active = true;
                            statueNode.getComponent(cc.Sprite).spriteFrame = this.redYezi;
                        }
                    // 显示数字，隐藏打钩
                    label.node.active = true;
                    // checkMark.active = false;
                    // gou.active = false;
                }
            }
        }
    }
}