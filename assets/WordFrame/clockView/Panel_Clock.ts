import { FrameData } from "../Scripts/FrameData";
import { FrameSDK } from "../Scripts/FrameSDK";

export interface ClockUserInfo {
    /**签到时间戳 （默认-1）*/
    signTimeStamp: number,
    /**签到次数（默认 0） */
    signCount: number,

    /**是否可以当日签到(false) */
    canSign: boolean
    /**兑换信息 (默认"")name*/
    accout: string,

    /**每日视频数 */
    dayVideoTime: number,
    /**每日关卡数 */
    dayLevelTime: number,
    startLevel: number,

    /** */
    phone: string,
    postCode: string,
    address: string,

    order: string,
    /**h5活跃时间 (0)*/
    HuoYueTime: number,
    /**发放结束时间（秒） -1*/
    SendTargetTime: number;
    /**发放目标视频数 -1*/
    SendVideoCount: number;

}

export interface ClockConfig {
    "id": number;
    "name": string;
    "game_time": number,
    "task": number[],
    /**robuxCoin */
    "coin_robux": number;
    /**发放时间 */
    "act_time": number;
    /**发放视频次数 */
    "act_ad": Array<number>;
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class Panel_Clock extends cc.Component {
    userInfo: ClockUserInfo = null;
    config: ClockConfig = null;
    type: string = null;
    // 第一档签到任务目前改为“过关数”模式；如后续需要恢复“活跃时长”任务，只需改回 false。
    private readonly firstSignTaskUseLevel: boolean = true;

    /**是否上锁（用于不让页面刷新） */
    isBlockKey: boolean = false;
    @property(cc.Node)
    bottomNode: cc.Node = null;

    @property(cc.Node)
    testFrame: cc.Node = null;

    @property(cc.Node)
    topRoot: cc.Node = null;

    @property(cc.Node)
    s1: cc.Node = null;
    @property(cc.Node)
    dayRoot: cc.Node = null;
    @property(cc.Node)
    s1Rich: cc.Node = null;
    @property(cc.Node)
    s1Process: cc.Node = null;
    @property(cc.Node)
    s1ProcessNum: cc.Node = null;
    @property(cc.Node)
    btnClockIn: cc.Node = null;
    @property(cc.Node)
    btnClockIn2: cc.Node = null;
    @property(cc.Node)
    s1PR: cc.Node = null;
    @property(cc.Node)
    btnS1clickLight: cc.Node = null;
    @property(cc.Sprite)
    s1taskIcon: cc.Sprite = null;
    @property([cc.SpriteFrame])
    taskIcon:cc.SpriteFrame[] = []

    @property(cc.Node)
    s2: cc.Node = null;
    @property(cc.Node)
    btnS2: cc.Node = null;
    @property(cc.Node)
    nameEdBox: cc.Node = null;
    @property(cc.Node)
    phoneEdBox: cc.Node = null;
    @property(cc.Node)
    eMailEdBox: cc.Node = null;
    @property(cc.Node)
    addressEdBox: cc.Node = null;

    @property(cc.Node)
    s3: cc.Node = null;
    @property(cc.Node)
    s3Rich: cc.Node = null;
    @property(cc.Node)
    s3Time: cc.Node = null;
    @property(cc.Node)
    s3Process: cc.Node = null;
    @property(cc.Node)
    s3ProcessNum: cc.Node = null;

    @property(cc.Node)
    s4: cc.Node = null;

    @property(cc.Node)
    s5: cc.Node = null;
    @property(cc.Node)
    s5Rich1: cc.Node = null;
    @property(cc.Node)
    s5Label: cc.Node = null;

    @property(cc.Node)
    blockView: cc.Node = null;
    @property(cc.Node)
    pnlClockView: cc.Node = null;
    panel_window: cc.Node = null;
    @property(sp.Skeleton)
    contentSkeleton: sp.Skeleton = null;

    static ins: Panel_Clock = null;
    static coinTarget: cc.Node = null;
    viewData: { closeCB: () => void } = null;
    private _close_target: cc.Node = null;


    static openClock(closeCB?: () => void) {
        if (FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.ClockLevel)) {
            Panel_Clock.startPhone(closeCB);
        } else {
            closeCB?.();
        }
    }

    static startPhone(closeCB?: () => void) {
        if (FrameData.saveData.ClockUserInfo) {
            FrameSDK.openWindow("Panel_Clock", { closeCB: closeCB });
        } else {
            Panel_Clock.bulidUserData();
            // FrameSDK.openWindow("Panel_ActivityGuide", {
            //     type: 1,
            //     logoType: 'clock',
            //     dtime: 2.5,
            //     text: `<outline width=0 color=#EA1F1F>skey_125</outline>`,
            //     closeCB: () => {
            //         FrameSDK.openWindow("Panel_Clock", { closeCB: closeCB });
            //     }
            // });
            FrameSDK.openWindow("Panel_Clock", { closeCB: closeCB });
        }
        cc.director.emit("UPDATA_CLOCK");
    }

    onLoad() {
        // this.bottomNode.active = false;
        Panel_Clock.ins = this;
        this._close_target = Panel_Clock.coinTarget;
        this.panel_window = this.pnlClockView;
        this.userInfo = FrameData.saveData.ClockUserInfo;
        this.config = FrameData.FRAME_CONF.ClockConfig;
        this.addEvent();
        this.oneTime();
        // this.contentSkeleton.setCompleteListener(()=>{
        //     this.bottomNode.active = true;
        // })
        // this.scheduleOnce(()=>{
        //     this.bottomNode.active = true;
        // }, 0.8);

    }

    oneTime() {
        // let edBox = this._s2EdBox.getComponent(cc.EditBox);
        // let a = new cc.Component.EventHandler();
        // a.component = "ClockView";
        // a.handler = 'endEditor';
        // a.target = this.node;
        // edBox.editingDidEnded = [a];
    }

    onDisable() {
        if (Panel_Clock.ins === this) {
            Panel_Clock.ins = null;
        }
    }

    onEnable() {
        Panel_Clock.ins = this;
        this.isBlockKey = false;

        FrameSDK.playEffect("iPhone_open");
        this.type = "";

        this.testFrame.active = CC_DEBUG || FrameData.isTest;

        this.flash();

        this.blockView.active = true;
        this.scheduleOnce(() => {
            FrameSDK.openEffect(this, null, () => {
                this.blockView.active = false;
            })
        })

        if (this.contentSkeleton) {
            this.contentSkeleton.setAnimation(0, "5start", false);
            this.contentSkeleton.addAnimation(0, "5loop", true);

        }

    }

    addEvent() {
        this.schedule(this.flash, 1);
    }

    static bulidUserData() {
        if (FrameData.saveData.ClockUserInfo == null) {
            FrameData.saveData.ClockUserInfo = {
                /**签到时间戳 （默认-1）*/
                signTimeStamp: -1,
                /**签到次数（默认 0） */
                signCount: 0,
                /**每日视频数 */
                dayVideoTime: 0,
                /**每日关卡数 */
                dayLevelTime: 0,
                startLevel: 0,

                /**是否可以当日签到(false) */
                canSign: false,
                /**h5活跃时间 (0)*/
                HuoYueTime: 0,
                /**兑换信息 (默认"")*/
                accout: "",
                phone: "",
                postCode: "",
                address: "",
                order: "",

                /**发放结束时间（秒） -1*/
                SendTargetTime: -1,
                /**发放目标视频数 -1*/
                SendVideoCount: -1,
            }
        }

        // cc.systemEvent.on("SecondEvent", Panel_Clock.checkDay, this)
        Panel_Clock.checkDay();


    }

    static checkDay() {
        if (!FrameData.saveData.ClockUserInfo) { return }
        let nowDate = new Date(FrameSDK.now * 1000);
        nowDate.setHours(0, 0, 0, 0);
        let nowTime = nowDate.getTime();
        if (FrameData.saveData.ClockUserInfo.signTimeStamp != nowTime) {
            FrameData.saveData.ClockUserInfo.canSign = true;
            FrameData.saveData.ClockUserInfo.signTimeStamp = nowTime;
            FrameData.saveData.ClockUserInfo.HuoYueTime = 0;
            FrameData.saveData.ClockUserInfo.dayVideoTime = 0;
            FrameData.saveData.ClockUserInfo.dayLevelTime = 0;
            FrameData.saveData.ClockUserInfo.startLevel = FrameSDK.frameData.gameData.passLevel;
        }

        FrameData.saveData.ClockUserInfo.HuoYueTime++;
    }

    /** 过关后累加当日关卡数并刷新面板 */
    static levelCallBack() {
        if (!FrameData.saveData.ClockUserInfo) { return }
        const info: ClockUserInfo = FrameData.saveData.ClockUserInfo;
        info.dayLevelTime = Math.max(0, Math.floor(Number(info.dayLevelTime) || 0)) + 1;
        Panel_Clock.refreshPanelIfOpen(info);
    }

    static videoCallBack() {
        if (!FrameData.saveData.ClockUserInfo) { return }
        let info: ClockUserInfo = FrameData.saveData.ClockUserInfo;
        let config: ClockConfig = FrameData.FRAME_CONF.ClockConfig;
        info.dayVideoTime = Math.max(0, Math.floor(Number(info.dayVideoTime) || 0)) + 1;
        let state = Panel_Clock.calcState();
        if (state == "s1" && Panel_Clock.getSignIndexByInfo(info, config) == 0) {
            // 预留：如后续第一档改为广告任务，可直接用 dayVideoTime 判定。
        }
        if (state == "s3") {
            info.SendVideoCount++;
        }

        Panel_Clock.refreshPanelIfOpen(info);
    }

    private static refreshPanelIfOpen(info: ClockUserInfo) {
        if (Panel_Clock.ins && cc.isValid(Panel_Clock.ins.node)) {
            Panel_Clock.ins.userInfo = info;
            Panel_Clock.ins.flash();
        }
    }

    

    //获取一个随机的激请码
    static getRandomInviteCode(len = 7): string {
        let InviteCode = "";
        for (let i = 0; i < len; i++) {
            let type = FrameSDK.randomInt(0, 1);
            if (type == 0) {
                InviteCode += String.fromCharCode(FrameSDK.randomInt(48, 57));
            } else if (type == 1) {
                InviteCode += String.fromCharCode(FrameSDK.randomInt(65, 90));
            }
        }
        return InviteCode;
    }

    getSignIndex() {
        return Panel_Clock.getSignIndexByInfo(this.userInfo, this.config);
    }

    static getSignIndexByInfo(info: ClockUserInfo, config: ClockConfig) {
        if (!info || !config) { return 0; }
        let index = info.signCount;
        if (info.signCount == 1 && !info.canSign) {
            index = 0;
        }
        if (info.signCount == 2 && !info.canSign) {
            index = 1;
        }
        if (config.task && index >= config.task.length) {
            index = config.task.length - 1;
        }
        return index;
    }



    flash() {
        if (this.isBlockKey == true) {
            return;
        }

        let type = Panel_Clock.calcState();


        let isChangeState: boolean = false;

        //状态改变了
        if (type != this.type) {
            isChangeState = true;
            this.type = type;
        }

        // console.log(this.type);
        if (isChangeState == true) {
            this.s1.active = false;
            this.s2.active = false;
            this.s3.active = false;
            this.s4.active = false;
            this.s5.active = false;

            this.topRoot.active = true;
        }
        let curNum = null;
        let totalNum = null;
        /**剩余的时间 */
        let haveTime = null;
        switch (type) {
            case "s1":
                if (isChangeState) {
                    this.s1.active = true;
                    // this.s1Rich.getComponent(cc.RichText).string = `clok_036??&value1==<b>${this.config.task[this.userInfo.signCount]}</b>`;

                }
                let index = this.getSignIndex();
                totalNum = this.config.task[index];
                if (index == 0) {
                    if (this.firstSignTaskUseLevel) {
                        // 原逻辑是活跃时长任务，这里临时切成过关数任务。
                        // this.s1Rich.getComponent(cc.RichText).string = `clok_036??&value1==<color=#86FF04><b>${Math.round(this.config.task[this.userInfo.signCount]/60)}</b></c>`;
                        // this.s1taskIcon.spriteFrame = this.taskIcon[0];
                        // curNum = this.userInfo.HuoYueTime;
                        let needNum = this.config.task[this.userInfo.signCount] - this.userInfo.dayLevelTime >= 0 ? this.config.task[this.userInfo.signCount] - this.userInfo.dayLevelTime : 0;
                        this.s1Rich.getComponent(cc.RichText).string = `clok_037??&value1==<color=#86FF04><b>${needNum}</b></c>`;
                        this.s1taskIcon.spriteFrame = this.taskIcon[1];
                        curNum = this.userInfo.dayLevelTime;
                        totalNum = this.config.task[0];
                    } else {
                        this.s1Rich.getComponent(cc.RichText).string = `clok_036??&value1==<color=#86FF04><b>${Math.round(this.config.task[this.userInfo.signCount]/60)}</b></c>`;
                        this.s1taskIcon.spriteFrame = this.taskIcon[0];
                        curNum = this.userInfo.HuoYueTime;
                        totalNum = this.config.task[0]
                    }
                } else if (index == 1) {
                    let needNum = this.config.task[this.userInfo.signCount] - this.userInfo.dayLevelTime >= 0 ? this.config.task[this.userInfo.signCount] - this.userInfo.dayLevelTime : 0;
                    this.s1Rich.getComponent(cc.RichText).string = `clok_037??&value1==<color=#86FF04><b>${ needNum}</b></c>`;
                    this.s1taskIcon.spriteFrame = this.taskIcon[1];
                    curNum = this.userInfo.dayLevelTime //= FrameSDK.frameData.gameData.passLevel - this.userInfo.startLevel;
                } else if (index == 2) {
                    let needNum = this.config.task[this.userInfo.signCount] - this.userInfo.dayLevelTime >= 0 ? this.config.task[this.userInfo.signCount] - this.userInfo.dayLevelTime : 0;
                    this.s1Rich.getComponent(cc.RichText).string = `clok_037??&value1==<color=#86FF04><b>${ needNum}</b></c>`;
                    this.s1taskIcon.spriteFrame = this.taskIcon[1];
                    curNum = this.userInfo.dayLevelTime //= FrameSDK.frameData.gameData.passLevel - this.userInfo.startLevel;
                }
                if (curNum > totalNum) { curNum = totalNum }



                this.s1Process.getComponent(cc.Sprite).fillRange = curNum / totalNum;
                if (index == 0 && !this.firstSignTaskUseLevel) {
                    this.s1ProcessNum.getComponent(cc.Label).string = Panel_Clock.clacTime(curNum);
                } else {

                    this.s1ProcessNum.getComponent(cc.Label).string = curNum + " / " + totalNum;
                }


                if (this.userInfo.canSign && curNum >= this.config.task[this.userInfo.signCount]) {
                    this.btnClockIn.active = true;
                    this.btnClockIn2.active = false;

                    this.btnS1clickLight.active = false;
                }
                else {
                    this.btnClockIn.active = false;
                    this.btnClockIn2.active = true;
                }

                this.setSignDay();
                break;
            case "s2":
                if (isChangeState) {
                    this.topRoot.active = false;
                    this.s2.active = true;
                }
                break;
            case "s3":
                if (isChangeState) {
                    this.s3.active = true;
                    this.s3Rich.getComponent(cc.RichText).string = `clok_010??&value1==<color=#86FF04>${Math.floor(this.config.act_time / 3600)}</color>&value2==<color=#86FF04>${this.config.act_ad[FrameSDK.getCountryIndex()]}</color>`;
                }
                haveTime = this.userInfo.SendTargetTime - FrameSDK.now;
                if (haveTime < 0) { haveTime = 0 }
                this.setTimeLabel(this.s3Time, Panel_Clock.clacTime2(haveTime));

                curNum = this.userInfo.SendVideoCount;
                totalNum = this.config.act_ad[FrameSDK.getCountryIndex()];
                if (curNum > totalNum) {
                    curNum = totalNum;
                }
                this.s3Process.getComponent(cc.Sprite).fillRange = curNum / totalNum;
                this.s3ProcessNum.getComponent(cc.Label).string = `${curNum + " / " + totalNum}`;
                break;
            case "s4":
                if (isChangeState) {
                    this.s4.active = true;
                }
                break;
            case "s5":
                if (isChangeState) {
                    this.s5.active = true;

                    this.s5Label.getComponent(cc.Label).string = `${this.userInfo.order}`;
                    this.s5Rich1.getComponent(cc.RichText).string = `<outline color=#0C2B3C width=2>clok_032</outline>??&value1==<color=#86FF04>${"FedEX"}</color>`;
                }

                break;
        }
    }

    /**设置3天签到 */
    setSignDay() {
        for (let i = 0; i < this.dayRoot.childrenCount; i++) {
            let day = this.dayRoot.children[i];
            let willSign = day.getChildByName("willSign");
            let curSign = day.getChildByName("curSign");
            let Signed = day.getChildByName("Signed");

            willSign.active = false;
            curSign.active = false;
            Signed.active = false;

            //表示当此要签到的
            if (i == this.userInfo.signCount) {
                curSign.active = true;
            }
            //表示签到过的
            if (i < this.userInfo.signCount) {
                Signed.active = true;
            }
            //表示未来要签到的
            if (i > this.userInfo.signCount) {
                willSign.active = true;
            }
        }
    }


    onTouchClockIn() {
        if (this.userInfo.canSign == true) {
            let index = this.getSignIndex();
            let cueenum = 0;
            if (index == 0) {
                // 原逻辑第一档用活跃时长判断，这里临时切成过关数判断。
                // cueenum = this.userInfo.HuoYueTime;
                cueenum = this.firstSignTaskUseLevel ? this.userInfo.dayLevelTime : this.userInfo.HuoYueTime;
            } else {
                cueenum = this.userInfo.dayLevelTime//FrameSDK.frameData.gameData.passLevel - this.userInfo.dayVideoTime
            }
            if (cueenum >= this.config.task[index]) {
                this.isBlockKey = true;
                this.userInfo.signCount++;
                this.userInfo.canSign = false;
                // FrameSDK.frameData.gameFuc.openLoad(null, null, null, () => {
                this.isBlockKey = false;

                this.flash();
                FrameSDK.showToast(`clok_002`);
                // })
            }
            else {
                // FrameSDK.showToast(`clok_018`);
            }
        }
        else {
            FrameSDK.showToast(`clok_003`);
        }
    }

    onTouchClockIn2() {
        if (this.userInfo.canSign == true) {
            //活跃时间不足
            // FrameSDK.showToast(`clok_018`);

            Panel_Clock.jellyAction(this.s1PR);
            this.btnS1clickLight.active = true;

        }
        else {
            //已经签到
            FrameSDK.showToast(`clok_003`);
        }
    }


    onTouchS1() {
        this.btnS1clickLight.active = false;
        this.onTouchClo();
        return
        let index = this.getSignIndex();
        if (index == 1 || index == 2) {
            FrameSDK.openVideo(
                () => {
                },
                () => {

                }
            )
        } else if (index == 0) {
            this.onTouchClo();
        }

    }



    onTouchS2() {
        if (this.nameEdBox.getComponent(cc.EditBox).string.length != 0 && this.addressEdBox.getComponent(cc.EditBox).string.length != 0 && this.eMailEdBox.getComponent(cc.EditBox).string.length != 0 && this.phoneEdBox.getComponent(cc.EditBox).string.length != 0) {
            this.isBlockKey = true;
            this.userInfo.accout = this.nameEdBox.getComponent(cc.EditBox).string;
            this.userInfo.phone = this.phoneEdBox.getComponent(cc.EditBox).string;
            this.userInfo.postCode = this.eMailEdBox.getComponent(cc.EditBox).string;
            this.userInfo.address = this.addressEdBox.getComponent(cc.EditBox).string;

            // FrameSDK.frameData.gameFuc.openLoad(() => {
            this.isBlockKey = false;
            this.flash();
            // })
        }
        else {
            FrameSDK.showToast("clok_030");
        }
    }

    onTouchAdd0() {
        cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
        this.flash();
    }
    onTouchAdd1() {
        this.userInfo.signTimeStamp = -1;
        this.flash();
    }
    onTouchAdd2() {
        if (this.userInfo.SendVideoCount != -1) {
            this.userInfo.SendVideoCount = this.config.act_ad[FrameSDK.getCountryIndex()] - 1;
            this.flash();
        }
    }
    onTouchAdd3() {
        if (this.userInfo.SendTargetTime != -1) {
            this.userInfo.SendTargetTime = FrameSDK.now + 10;
            this.flash();
        }
    }

    onTouchAdd4() {
        this.userInfo.HuoYueTime += 100;
        this.flash();
    }
    onTouchAdd5() {
        this.userInfo.dayLevelTime +=1
        this.flash();
    }

    /**设置时间文本 */
    setTimeLabel(node: cc.Node, time: string) {
        for (let i = 0; i < 6; i++) {
            node.children[i].getComponent(cc.Label).string = `${time[i]}`;
        }
    }

    onTouchS4() {
        this.isBlockKey = true;
        this.userInfo.SendTargetTime = FrameSDK.now + this.config.act_time;
        this.userInfo.SendVideoCount = 0;
        // FrameSDK.frameData.gameFuc.openLoad(null, null, null, () => {
            this.isBlockKey = false;
            this.flash();
        // })
    }

    onTouchClo() {
        this.blockView.active = true;
        FrameSDK.closeEffect(this, this.viewData.closeCB)
    }

    /**根据当前的配置信息判定状态 */
    static calcState() {
        if (!FrameData.saveData.ClockUserInfo) { return }
        let info: ClockUserInfo = FrameData.saveData.ClockUserInfo;
        let config: ClockConfig = FrameData.FRAME_CONF.ClockConfig;
        if (info.signCount < 3) {
            return "s1";
        }

        if (info.accout.length == 0) {
            return "s2";
        }

        if (info.SendTargetTime == -1) {
            info.SendTargetTime = FrameSDK.now + config.act_time;
            info.SendVideoCount = 0;
        }

        if (info.SendVideoCount < config.act_ad[FrameSDK.getCountryIndex()]) {
            let targetTime = info.SendTargetTime;
            let curTime = FrameSDK.now;
            if (targetTime > curTime) {
                //时间内
                return "s3";
            }
            else {
                //时间外
                return "s4";
            }
        }
        if (info.order.length == 0) {
            info.order = Panel_Clock.getRandomInviteCode(10);
        }
        return "s5"
    }
    /**根据时间（秒）计算 时间（00d 00h 00m 00s） */
    static clacTime(haveTime: number) {
        let time = "";
        //计算日子
        let d = Math.floor(haveTime / (24 * 60 * 60));
        if (d != 0) {
            time += d + "d";
        }
        haveTime = haveTime - d * 24 * 60 * 60;

        let h = Math.floor(haveTime / (60 * 60));
        if (h != 0) {
            time += h + "h";
        }
        haveTime = haveTime - h * 60 * 60;

        let m = Math.floor(haveTime / 60);
        time += m + "m";
        haveTime = haveTime - m * 60;

        time += haveTime + "s";
        return time;
    }

    /**根据时间拆分成 00:00:00 6位时间 (这个没有:号)*/
    static clacTime2(haveTime: number) {
        let time = "";

        let h = Math.floor(haveTime / (60 * 60));
        haveTime = haveTime - h * 60 * 60;
        if (h >= 100) {
            time += (h % 100).toString();
        }
        else if (h < 10) {
            time += "0" + h.toString();
        }
        else {
            time += h.toString();
        }

        let m = Math.floor(haveTime / 60);
        haveTime = haveTime - m * 60;
        if (m < 10) {
            time += "0" + m.toString();
        }
        else {
            time += m.toString();
        }


        if (haveTime < 10) {
            time += "0" + haveTime.toString();

        }
        else {
            time += haveTime.toString();

        }
        return time;
    }

    /**啫喱效果 */
    static jellyAction(node: cc.Node) {
        let rangeScale = 1;
        let scale = 1;
        let speed = 1
        cc.tween(node)
            .parallel(
                cc.tween().to(0.1 * speed, { scaleY: scale + 0.2 * scale * rangeScale }),
                cc.tween().to(.1 * speed, { scaleY: scale - 0.2 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.1 * speed, { scaleY: scale - 0.2 * scale * rangeScale }),
                cc.tween().to(0.1 * speed, { scaleX: scale + 0.2 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.15 * speed, { scaleY: scale + 0.1 * scale * rangeScale }),
                cc.tween().to(0.15 * speed, { scaleX: scale - 0.1 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.15 * speed, { scaleY: scale - 0.1 * scale * rangeScale }),
                cc.tween().to(0.15 * speed, { scaleX: scale + 0.1 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.18 * speed, { scaleY: scale + 0.05 * scale * rangeScale }),
                cc.tween().to(0.18 * speed, { scaleX: scale - 0.05 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.18 * speed, { scaleY: scale - 0.05 * scale * rangeScale }),
                cc.tween().to(0.18 * speed, { scaleX: scale + 0.05 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.19 * speed, { scaleY: scale + 0.02 * scale * rangeScale }),
                cc.tween().to(0.19 * speed, { scaleX: scale - 0.02 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.19 * speed, { scaleY: scale - 0.02 * scale * rangeScale }),
                cc.tween().to(0.19 * speed, { scaleX: scale + 0.02 * scale * rangeScale }),
            )
            .parallel(
                cc.tween().to(0.2 * speed, { scaleY: scale }),
                cc.tween().to(0.2 * speed, { scaleX: scale }),
            )
            .start()
    }



}
