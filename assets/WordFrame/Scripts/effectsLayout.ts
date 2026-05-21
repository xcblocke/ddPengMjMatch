// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import CashFishCredit from "./CashFishCredit";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Activity from "./Panel_Activity";

const {ccclass, property} = cc._decorator;

@ccclass
export default class effectsLayout extends cc.Component {

    @property(cc.BlockInputEvents)
    inputBlocker: cc.BlockInputEvents = null;

    @property(cc.Node)
    animationRootNode: cc.Node = null;

    @property(cc.ParticleSystem)
    particle: cc.ParticleSystem = null;

    @property(cc.SpriteFrame)
    icon_SpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    charity_SpriteFrame: cc.SpriteFrame = null;

    private static _nodePool: cc.NodePool = new cc.NodePool();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.on("yellowCoin", this.piaoCoin, this);

        this.inputBlocker.enabled = false;
    }

    protected onDestroy(): void {
        cc.director.removeAll(this);
    }

    piaoCoin(num: number, charityNum: number, donateTime: number, callback?: () => any, opts?: { excludePiggy?: boolean; fromSettlement?: boolean; skipCoinTipsPanel?: boolean }) {
        if (!CashFishCredit.isUnlocked('yellowCoin')) {
            num = 0;
        }
        if (!CashFishCredit.isUnlocked('greenCoin')) {
            charityNum = 0;
        }

        const playCoinAnimation = num !== 0;
        const playCharityAnimation = charityNum !== 0 && !FrameSDK.frameData.gameData.noProfitAd;
        const finishCallback = () => {
            if (opts?.fromSettlement) {
                FrameSDK.notifySettlementCoinFlyEnd();
            }
            callback?.();
        };

        if (!playCoinAnimation && !playCharityAnimation) {
            finishCallback();
            return;
        }

        if (opts?.fromSettlement) {
            FrameSDK.notifySettlementCoinFlyStart();
        }

        new Promise<boolean>(resolve => {
            if (opts?.skipCoinTipsPanel || num <= 100) {
                resolve(false);
                return;
            }

            FrameSDK.openWindow("Panel_CoinTips", {
                num: num,
                charityNum: charityNum,
                closeCB: () => resolve(true),
            });
        })
            .then((blockInputEvents: boolean) => {
                this.inputBlocker.enabled = blockInputEvents;
                this.particle.node.active = blockInputEvents;
                if (blockInputEvents) {
                    FrameSDK.frameData.gameFuc.vibrate(500);
                    this.particle.resetSystem();
                }

                let coinAnimationEnded = false;
                let charityAnimationEnded = false;
                let callbackDone = false;

                if (playCoinAnimation && num > 0) {
                    const startPosition = cc.v3(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
                    let startYVar = undefined;
                    let nodeCount = num < 10 ? 2 : num <= 50 ? 10 : 20;
                    let delay = 0;

                    if (playCharityAnimation && charityNum > 0) {
                        startPosition.x -= 100;
                    }
                    if (blockInputEvents) {
                        startYVar = 200;
                        delay = 1.5;

                        FrameSDK.playEffect("done_coin_arrange");
                    }

                    cc.Tween.stopAllByTarget(this.animationRootNode);
                    cc.tween(this.animationRootNode)
                        .delay(delay)
                        .call(() => FrameSDK.playEffect(nodeCount > 5 ? "coin_arrange_collect" : "coin_less_collect"))
                        .start();

                    let target = CashFishCredit.getTarget("yellowCoin");
                    target = target.getChildByName("coin") || target;
                    const targetPosition = target.convertToWorldSpaceAR(cc.v3());

                    // 存钱罐：本次产出的 50%（正常移牌/消除产出不算）
                    const piggyDelta =
                        !opts?.excludePiggy && Panel_Activity.isActivity() && num > 0
                            ? Math.max(0, Math.floor(num * 0.5))
                            : 0;

                    // 飞币表现要同步开始：不要等主币入账后才飞到存钱罐
                    if (piggyDelta > 0) {
                        const targetNode = Panel_Activity.coinTarget;
                        if (targetNode && cc.isValid(targetNode)) {
                            const piggyWorldPos = targetNode.convertToWorldSpaceAR(cc.v3());
                            const piggyCount = piggyDelta < 10 ? 2 : piggyDelta <= 50 ? 6 : 10;
                            this.playGlodTween(
                                startPosition,
                                piggyWorldPos,
                                false,
                                piggyCount,
                                undefined,
                                startYVar,
                                delay,
                                undefined,
                                false
                            );
                        }
                    }

                    // 先飘币，再加钱：在“最后一枚金币到达目标点”时入账，观感更自然
                    const lastIndex = Math.max(0, nodeCount - 1);
                    const arriveTime =
                        delay +
                        (0.08 + lastIndex * 0.015) +
                        (0.2 + lastIndex * 0.01) +
                        0.47;

                    cc.tween(this.animationRootNode)
                        .delay(arriveTime)
                        .call(() => {
                            // 入账黄币
                            cc.director.emit("FRESH_CREDIT", {
                                type: "yellowCoin",
                                num: FrameData.saveData.credit.yellowCoin + num,
                                change: num,
                            });
                            FrameData.saveData.credit.yellowCoin += num;

                            // 存钱罐入账：与主币入账同一时刻发生
                            if (piggyDelta > 0) {
                                Panel_Activity.addCoin(piggyDelta);
                            }
                        })
                        .start();

                    this.playGlodTween(startPosition, targetPosition, false, nodeCount, undefined, startYVar, delay, () => {
                        coinAnimationEnded = true;
                        if (charityAnimationEnded && !callbackDone) {
                            callbackDone = true;
                            this.inputBlocker.enabled = false;
                            finishCallback();
                        }
                    }, false);
                } else {
                    if (num < 0) {
                        const finalNumber = Math.max(0, FrameData.saveData.credit.yellowCoin + num);

                        cc.director.emit("FRESH_CREDIT", {
                            type: "yellowCoin",
                            num: finalNumber,
                            change: num,
                        });

                        FrameData.saveData.credit.yellowCoin = finalNumber;
                    }

                    coinAnimationEnded = true;
                }

                if (playCharityAnimation && charityNum > 0) {
                    const startPosition = cc.v3(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
                    let startYVar = undefined;
                    let nodeCount = charityNum < 10 ? 5 : charityNum <= 50 ? 8 : 15;;
                    let delay = 0;

                    if (playCharityAnimation && num > 0) {
                        startPosition.x += 100;
                    }
                    if (blockInputEvents) {
                        startYVar = 200;
                        delay = 1.5;
                    }

                    let target =
                        CashFishCredit.getTarget("greenCoin") ||
                        cc.find("coinText", cc.director.getScene());

                    const finishGreenCredit = () => {
                        cc.director.emit("FRESH_CREDIT", {
                            type: "greenCoin",
                            num: FrameData.saveData.credit.greenCoin + charityNum,
                            change: charityNum,
                        });

                        FrameData.saveData.credit.greenCoin += charityNum;

                        const range = FrameData.getCoinOutNum('charityRate');
                        for (let index = 0; index < donateTime; index++) {
                            FrameData.saveData.charityDonated += FrameSDK.randomInt(range[0], range[1]);
                        }
                        FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(donateTime));

                        charityAnimationEnded = true;
                        if (coinAnimationEnded && !callbackDone) {
                            this.inputBlocker.enabled = false;
                            callbackDone = true;
                            finishCallback();
                        }
                    };

                    if (target) {
                        target = target.getChildByName("coin") || target;
                        const targetPosition = target.convertToWorldSpaceAR(cc.v3());
                        this.playGlodTween(startPosition, targetPosition, true, nodeCount, undefined, startYVar, delay, finishGreenCredit, false);
                    } else {
                        console.warn("effectsLayout.piaoCoin: no greenCoin / coinText fly target");
                        finishGreenCredit();
                    }
                } else {
                    if (charityNum < 0 && !FrameSDK.frameData.gameData.noProfitAd) {
                        const finalNumber = Math.max(0, FrameData.saveData.credit.greenCoin + charityNum);

                        cc.director.emit("FRESH_CREDIT", {
                            type: "greenCoin",
                            num: finalNumber,
                            change: charityNum,
                        });

                        FrameData.saveData.credit.greenCoin = finalNumber;
                    }

                    charityAnimationEnded = true;
                }

                if (coinAnimationEnded && charityAnimationEnded && !callbackDone) {
                    this.inputBlocker.enabled = false;
                    callbackDone = true;
                    finishCallback();
                }
            });
    }

    piaoBitCoin(num: number, charityNum: number) {
        // if (num > 0) {
        //     let target = CashFishCredit.getTarget("yellowCoin");
        //     target = target.getChildByName("coin") || target;
        //     let targetPosition = target.convertToWorldSpaceAR(cc.v3());
        //     this.playGlodTween(targetPosition, false, num <= 10 ? num : 20, () => {
        //         FrameSDK.playEffect("gameplay_coin_collect");
        //         cc.director.emit("FRESH_CREDIT", {
        //             type: "yellowCoin",
        //             num: FrameData.saveData.credit.yellowCoin + num,
        //             change: num
        //         });
        //         FrameData.saveData.credit.yellowCoin += num;
        //         FrameData.saveData.credit.yellowCoin < 0 && (FrameData.saveData.credit.yellowCoin = 0);
        //     });
        // }

        // if (charityNum > 0) {
        //     let target = CashFishCredit.getTarget("greenCoin");
        //     target = target.getChildByName("coin") || target;
        //     let targetPosition = target.convertToWorldSpaceAR(cc.v3());
        //     this.playGlodTween(targetPosition, true, num <= 10 ? num : 20, () => {
        //         FrameSDK.playEffect("gameplay_coin_collect");
        //         cc.director.emit("FRESH_CREDIT", {
        //             type: "greenCoin",
        //             num: FrameData.saveData.credit.greenCoin + charityNum,
        //             change: charityNum
        //         });
        //         FrameData.saveData.credit.greenCoin += charityNum;
        //         FrameData.saveData.credit.greenCoin < 0 && (FrameData.saveData.credit.greenCoin = 0);
        //     });
        // }
    }

    playGlodTween(startPosition: cc.Vec3, endPosition: cc.Vec3, isCharity: boolean, nodeCount: number = 15, startXVar: number = 150, startYVar: number = 150, delay: number = 0, cb: Function = null, playSound: boolean = true) {
        startPosition = this.node.convertToNodeSpaceAR(startPosition);
        endPosition = this.node.convertToNodeSpaceAR(endPosition);

        const spriteFrame = isCharity ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        const playSoundFunc = playSound ? () => FrameSDK.playEffect("cash_collect") : () => {};
        let completedAnimations = 0;

        for (let i = 0; i < nodeCount; i++) {
            const coinNode = effectsLayout._nodePool.get() ?? new cc.Node();
            const coinSprite = coinNode.getComponent(cc.Sprite) ?? coinNode.addComponent(cc.Sprite);
            coinSprite.spriteFrame = spriteFrame;
            coinNode.scale = 0.6;
            coinNode.opacity = 0;
            coinNode.setPosition(startPosition);
            this.animationRootNode.addChild(coinNode);

            const scaleUpTime = 0.2;  // 缩放时间
            const moveDelayTime = 0.2;  // 移动延迟时间
            const coinFlyTime = 0.47;  // 金币飞行时间
            // 定义随机的初始位置
            const randomStartPos = cc.v3(startPosition.x + FrameSDK.randomIntNum(-startXVar, startXVar), startPosition.y + FrameSDK.randomIntNum(-startYVar, startYVar));

            // tween 动画
            cc.tween(coinNode)
                .delay(delay)
                .set({ opacity: 255 })
                .to(0.08 + i * 0.015, {position: randomStartPos})  // 移动到随机位置
                .delay(moveDelayTime + i * 0.01)  // 延时
                .to(coinFlyTime, {position: endPosition})  // 移动到终点
                .call(() => playSoundFunc())
                .parallel(
                    cc.tween().to(scaleUpTime, {scale: 1.5}),  // 放大效果
                    cc.tween().to(scaleUpTime, {opacity: 0})   // 透明化
                )
                .call(() => {
                    effectsLayout._nodePool.put(coinNode);
                    if (++completedAnimations === nodeCount) {
                        cb?.();  // 所有动画完成后调用回调函数
                    }
                })
                .start();
        }
    }

    // 单个金币的动画逻辑
    oneGlodTween(index: number, endPosition: cc.Vec3, isCharity: boolean, onComplete: Function) {
        const coinNode = new cc.Node().addComponent(cc.Sprite);
        coinNode.spriteFrame = isCharity ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        coinNode.node.scale = 0;
        this.node.addChild(coinNode.node);

        const scaleUpTime = 0.2;  // 缩放时间
        const moveDelayTime = 0.2;  // 移动延迟时间
        const coinFlyTime = 0.47;  // 金币飞行时间
        // 定义随机的初始位置
        const randomStartPos = cc.v3(FrameSDK.randomIntNum(-105, 106), FrameSDK.randomIntNum(-100, 100));

        // tween 动画
        cc.tween(coinNode.node)
            .delay(index * 0.015)
            .set({scale: 1})
            .to(0.08, {position: randomStartPos}, {easing: 'sineOut'})  // 移动到随机位置
            .delay(moveDelayTime + index * 0.01)  // 延时
            .to(coinFlyTime, {position: endPosition}, {easing: 'sineIn'})  // 移动到终点
            .parallel(
                cc.tween().to(scaleUpTime, {scale: 1.5}),  // 放大效果
                cc.tween().to(scaleUpTime, {opacity: 0})   // 透明化
            )
            .call(() => {
                coinNode.node.destroy();  // 销毁金币节点
                // 播放金币音效
                FrameSDK.playEffect("gameplay_coin_collect");
                onComplete();  // 动画完成回调
            })
            .start();
    }

    // 单个金币的动画逻辑
    glodTween(coinNode: cc.Node, index: number, endPosition: cc.Vec3, onComplete: Function) {
        let scaleUpTime = 0.2;  // 缩放时间
        let moveDelayTime = 0.2;  // 移动延迟时间
        let coinFlyTime = 0.47;  // 金币飞行时间
        // 定义随机的初始位置
        const randomStartPos = cc.v3(FrameSDK.randomIntNum(-105, 106), FrameSDK.randomIntNum(-100, 100));
        // tween 动画
        cc.tween(coinNode)
            .to(0.08 + index * 0.015, {position: randomStartPos})  // 移动到随机位置
            .delay(moveDelayTime + index * 0.01)  // 延时
            .to(coinFlyTime, {position: endPosition})  // 移动到终点
            .parallel(
                cc.tween().to(scaleUpTime, {scale: 1.5}),  // 放大效果
                cc.tween().to(scaleUpTime, {opacity: 0})   // 透明化
            )
            .call(() => {
                coinNode.destroy();  // 销毁金币节点
                onComplete();  // 动画完成回调
            })
            .start();
    }

//zhe
    startFlyProcess(r, c, s, u = 1, o = 5) {
        var p = this;
        var d = function (d) {
            setTimeout(() => {
                var i = new cc.Node().addComponent(cc.Sprite);
                i.spriteFrame = p.icon_SpriteFrame;
                p.node.addChild(i.node);
                i.node.scale = 1;
                p.createIconAndFlyBezier(d, i,
                    cc.v2(cc.winSize.width / 2, cc.winSize.height / 2),
                    r,
                    () => {
                        d == o - 1 ? s && s() : c && c(d);
                    }, u);
            }, 150 * d);
        };
        for (var h = 0; h < o; h++) d(h);
    }

    createIconAndFlyBezier(e, t, o, n, r, i) {
        var c = this;
        void 0 === i && (i = 1);
        o = new cc.Vec2(o.x - t.node.getParent().width / 2, o.y - t.node.getParent().height / 2);
        n = new cc.Vec2(n.x - t.node.getParent().width / 2, n.y - t.node.getParent().height / 2);
        var s = i;
        t.node.setPosition(o);
        t.node.zIndex = 1000;
        var l = e % 2 == 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60),
            u = FrameSDK.randomIntNum(-80, -20);
        cc.tween(t.node).to(0.3 * s, {
            position: cc.v3(o.x + l, o.y + u)
        }, {
            easing: "quadOut"
        }).call(() => {
            c.createBezier(e, t, o, n, r, s);
        }).start();
    }

    createBezier(e, t, o, n, r, i) {
        var c = t.node.scale,
            s = FrameSDK.randomIntNum(80, 150);
        e % 3 == 1 ? s = -s : e % 3 == 2 && (s = FrameSDK.randomIntNum(-80, 80));
        var l = [],
            u = cc.v2(o.x + s, o.y - Math.abs(s)),
            p = cc.v2(n.x - s, n.y - Math.abs(s));
        l.push(u);
        l.push(p);
        l.push(n);
        cc.tween(t.node).repeatForever(cc.tween().to(0.3, {
            scaleX: -1 * c
        }).to(0.3, {
            scaleX: 1 * c
        }));
        var d = cc.tween;
        d(t.node).delay(0.1 * e * i).call(() => {
        }).parallel(d().to(0.1 * i, {
            opacity: 255
        }), d().then(cc.bezierTo(1.5 * i, l))).call(() => {
            r && r();
            t.node.destroy();
        }).start();
    }

    //zhe
}
