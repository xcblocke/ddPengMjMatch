import { logAd } from "../../Scripts/common/AdLog";
import Panel_Clock from "../clockView/Panel_Clock";
import Frame from "./Frame";
import { FrameData } from "./FrameData";
import Panel_Activity from "./Panel_Activity";
import Panel_Task from "./Panel_Task";
import Panel_DailyClearanceReward from "./Panel_DailyClearanceReward";
import RDM_Level from "./RDM_Level";
import RDM_Toast from "./RDM_Toast";
import i18 from "./i18";
import GM from "./GM/GM";
import PanelPool from "./PanelPool";

type GoodsList = {
    id: number,
    type: null,
    title: string,
    amount: number,         //数量
    amount_cost: number,
    conditions: any,
    method: string,
    pay_methods: [],
    sdk_params: { field: string, name: string, comment?: string }[]
}

interface IEventLike {
    object_action: string,
    object_name?: string,
    object_notes?: string,
};

export interface inivite {
    invite_url: string   //我的邀请链接
    invite_code: string  //我的邀请码
    invite_parent: number    //我绑定的上级  -- 绑定后才有
    invite_referrer: string  // 我的安装referrer的邀请码
    total_count: number      // 总邀请数
    effective_count: number  //有效邀请数
    records: {               //邀请记录，数组
        uid: number              //用户ID
        invite_code: string      //邀请码
        status: number           //0无效，1有效
        create_time: number     //时间戳，毫秒
    }[]
}

export class FrameSDK {
    static Panel: cc.Node = null;
    private static ONLINE_TIME: number = null;
    private static DATE_DAY: number = null;
    private static soundList: cc.AudioClip[] = [];
    private static _lastVideoEndTime: number = 0;
    private static bundleName = "WordFrame";
    private static _maskSpriteFrame: cc.SpriteFrame = null;

    static init(frameData, configs) {
        console.log("init=========== 11111", JSON.stringify(frameData));
        console.log("init=========== 22222",  JSON.stringify(configs));
        this.frameData = frameData;
        FrameSDK.initCocosAmend();
        FrameSDK.initSettings(configs);
        // FrameSDK.correctConfigs();
        cc.assetManager.getBundle(FrameSDK.bundleName).preloadDir("Prefab");
        FrameSDK.preloadOpenEffectMask();
        PanelPool.startWarm(cc.sys.isNative ? 0.15 : 0.08);

        this.setLan(cc.sys.languageCode);
        if (FrameData.saveData.date_day == null) {
            FrameData.saveData.date_day = FrameSDK.getDateDay(FrameSDK.now);
            FrameSDK.todayFirst = false;
        }
        FrameSDK.DATE_DAY = FrameData.saveData.date_day;
        FrameSDK.onlineTimeUpdate();
        FrameSDK.resetNextData();
        FrameSDK.updataTimeQueueUp();
        cc.director.on("addCoin_A", FrameSDK.addCoin_A, FrameSDK)

    }

    static getSafeAreaData() {
        const safeAreaRect = cc.sys.getSafeAreaRect();
        let viewSze = cc.view.getFrameSize()
        let visibleSze = cc.view.getVisibleSize()       
        console.log("getSafeAreaData============safeAreaRect", safeAreaRect.width, safeAreaRect.height);
        console.log("getSafeAreaData============viewSze", viewSze.width, viewSze.height);
        console.log("getSafeAreaData============visibleSze", visibleSze.width, visibleSze.height);
        return {
          width:  safeAreaRect.width,
          height: visibleSze.height - safeAreaRect.height,
        }
      }

    static frameData: {
        isDeBug: boolean,
        sdkFuc: {
            openVideo: (callback?: () => void, failcallback?: () => void) => void,
            openInters: (callback?: () => void) => void,
            openBanner: (gravity?: number, margin?: number) => void,
            hiddenBanner: () => void,
            // logCommonEvent: (eventName: string, properties?: { [key: string]: any }) => void,
            // earlierStageEvent: Function,
            // logGameEvent: (eventName: string, properties: IEventLike, once: boolean) => void,
            // lifeEvent: (stepName: string) => void,

            reportEventCall: (event: string) => void,
            ppEvent: (event: "gameLaunch" | "gameShow" | "slotShow" | "popupShow" | "claim" | "collected" | "freeShow" | "freeClaim" | "freeCollected") => void,
            openUrl: Function,
            isReadyVideo: boolean,
            isReadyInters: boolean,
            placement: string
        },
        ListenKeys: {
            FRESH_FLAG: string,
            FRESH_STRING: string,
            VIDEO_SUC: string,
            IAD_SUC: string,
        },
        gameData: {
            isFlag: boolean,
            passLevel: number,
            // currentScene: 'loading' | 'home' | 'game',
            // A/B面一致的需要根据情况返回不同值（A面为true，B面为false），如果是B面分包直接返回false
            noProfitAd: boolean,
            isSound: boolean,
            myLanguge: string,
        },
        gameFuc: {
            openLoad: (waitTime?: number, loadStr?: string, isWait?: boolean, cb?: Function) => void,
            closeLoad: () => void,
            vibrate: (durationInMilliseconds?: number) => void,
            getCurTurnInfo: Function,
            showToast: Function
        },
        gameNodeObj: {
            // top: cc.Node,
            // lVRoot: cc.Node,
            // goldRoot: cc.Node,
            // shopBtn: cc.Node,
            // exchangeBtn: cc.Node,
            // piaoBtn: cc.Node,
            // popUpNodes: cc.Node[],
        }
    } = null;

    static initSettings(data) {
        FrameData.configs = data;
        console.log("data。。。。。。。。...........", data);
        console.log("data。。。。。。。。...........112", !FrameSDK.frameData.gameData.noProfitAd);
        let confName = !FrameSDK.frameData.gameData.noProfitAd ? "basicConfig" : "shadow"
        let LINK_CONF = data?.[confName] || {};

        for (let key in LINK_CONF.SDK_CONF) {
            FrameData.SDK_CONF[key] = LINK_CONF.SDK_CONF[key];
        }
        for (let key in LINK_CONF.FRAME_CONF) {
            FrameData.FRAME_CONF[key] = LINK_CONF.FRAME_CONF[key];
        }

        if (!FrameData.saveData.corrected) {
            FrameData.saveData.corrected = true;
            FrameData.saveData.credit.yellowCoin = FrameData.FRAME_CONF.InitialCoins[0];
            FrameData.saveData.credit.greenCoin = FrameData.FRAME_CONF.InitialCoins[1];
        }
    }

    static openGMWindow(cb = null) {
        GM.open(  cb  );
    }


    //开始在线时间更新
    static onlineTimeUpdate() {
        if (!FrameSDK.ONLINE_TIME) {
            FrameSDK.ONLINE_TIME = setInterval(() => {
                FrameSDK.resetNextData();
                FrameSDK.updataTimeQueueUp();
            }, 1000);
        }
    }

    static resetNextData() {
        if (this.DATE_DAY < FrameSDK.getDateDay(FrameSDK.now)) {
            this.DATE_DAY = FrameData.saveData.date_day = FrameSDK.getDateDay(FrameSDK.now);
            for (let key in FrameData.saveData.nextData) {
                if (Array.isArray(FrameData.saveData.nextData[key])) {
                    FrameData.saveData.nextData[key] = [];
                } else if (typeof FrameData.saveData.nextData[key] == "object") {
                    FrameData.saveData.nextData[key] = {};
                } else if (typeof FrameData.saveData.nextData[key] == "number") {
                    FrameData.saveData.nextData[key] = 0;
                }
            }
            FrameData.saveData.loginDays++;
        }
    }

    static getDateDay(time): number {
        let date = new Date(time * 1000);
        let y = date.getFullYear() + "";
        let m = date.getMonth() + 1 > 9 ? String(date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        let d = date.getDate() > 9 ? String(date.getDate()) : "0" + (date.getDate());
        return parseInt(y + m + d);
    }

    /**随机一个整数范围内 [3,5] -> 3、4、5*/
    static randomInt(min: number | number[], max?: number) {
        if (Array.isArray(min)) {
            max = min[1];
            min = min[0];
        }
        return Math.floor((max - min + 1) * Math.random()) + min;
    }

    static randomIntNum(e, t) {
        return parseInt(Math.random() * (t - e + 1) + e + "", 10);
    }

    static randomFloatNum(e: number, t: number) {
        return Math.random() * (t - e) + e;
    }

    static addQueueUp(id, data = {}) {
        FrameData.saveData.QueueUp[id] = data;
        FrameSDK.updataTimeQueueUp();
    }

    static updataTimeQueueUp() {
        for (let i in FrameData.saveData.QueueUp) {
            let info = FrameData.saveData.QueueUp[i];
            if (info.deadLinePeopleCount == null) {
                info.deadLinePeopleCount = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
                info.deadLineTimeStamp = FrameSDK.now;
                info.historyList = [];
            }
            //根据当前时间以及结算时间 扣除对应人数
            let curPeopleNum = info.deadLinePeopleCount;
            let curTimeStamp = info.deadLineTimeStamp;
            let totalMinusPeople = 0;
            let tip: number = -1;
            while (1) {
                let ranDeltaTime = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[0], FrameData.FRAME_CONF.TaskLineFrameConfig.flashDeltaTime[1]);
                if (FrameSDK.now - ranDeltaTime >= curTimeStamp) {
                    //超过400名则重置排名
                    if (curPeopleNum + totalMinusPeople >= FrameData.FRAME_CONF.TaskLineFrameConfig.outLinePeopleCount) {
                        totalMinusPeople = 0;
                        curPeopleNum = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
                        tip = 1;
                    } else {
                        for (let j = 0; j < FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList.length; j++) {
                            if (curPeopleNum + totalMinusPeople >= FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[j].count) {
                                let ssss = FrameSDK.randomInt(0, 100);
                                //取概率 增加或者减少
                                if (ssss <= FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[j].precend) {
                                    //增加排名
                                    totalMinusPeople += FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[j].addCount[0], FrameData.FRAME_CONF.TaskLineFrameConfig.ChangePlusList[j].addCount[1]);
                                    tip = 2;
                                } else {
                                    //减少排名1
                                    totalMinusPeople -= 1;
                                    tip = 1;
                                }
                                break;
                            }
                        }
                    }
                    curTimeStamp += ranDeltaTime;
                } else {
                    break;
                }
            }

            info.deadLineTimeStamp = curTimeStamp;
            info.deadLinePeopleCount = totalMinusPeople + curPeopleNum;
            if (info.deadLinePeopleCount < 1) {
                info.deadLinePeopleCount = 1;
            }
            if (tip != -1) {
                if (tip == 1) {
                    info.deadLineShowTip = `tkey_209??&value1==<color = #249A50>${info.deadLinePeopleCount}</color>`;
                    if (info.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                        info.historyList.push({
                            key: "tkey_209",
                            account: "",
                            peopleCount: info.deadLinePeopleCount
                        });
                    } else {
                        info.historyList.shift();
                        info.historyList.push({
                            key: "tkey_209",
                            account: "",
                            peopleCount: info.deadLinePeopleCount
                        });
                    }
                }
                if (tip == 2) {
                    let acc = FrameSDK.getRandomInviteCode();
                    info.deadLineShowTip = `tkey_210??&value1==<color = #249A50>${acc}</color>&&value2==<color = #249A50>${info.deadLinePeopleCount}</color>`;
                    if (info.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                        info.historyList.push({
                            key: "tkey_210",
                            account: acc,
                            peopleCount: info.deadLinePeopleCount
                        });
                    } else {
                        info.historyList.shift();
                        info.historyList.push({
                            key: "tkey_210",
                            account: acc,
                            peopleCount: info.deadLinePeopleCount
                        });
                    }
                }
            }
        }
    }

    static updataVideoQueueUp() {
        for (let i in FrameData.saveData.QueueUp) {
            let data = FrameData.saveData.QueueUp[i];
            if (data.deadLinePeopleCount == null) {
                data.deadLinePeopleCount = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[0], FrameData.FRAME_CONF.TaskLineFrameConfig.startPeople[1]);
                data.deadLineTimeStamp = FrameSDK.now;
                data.historyList = [];
            }
            for (let j = 0; j < FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus.length; j++) {
                if (data.deadLinePeopleCount > FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[j].count) {
                    //计算减少概率 是否中了
                    let ran = FrameSDK.randomInt(0, 100);
                    let acc = FrameSDK.getRandomInviteCode();
                    if (ran < FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[j].MinusPrecend) {
                        let minus = FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[j].minusCount[0], FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[j].minusCount[1]);
                        data.deadLinePeopleCount -= minus;
                        if (data.deadLinePeopleCount < 1) {
                            data.deadLinePeopleCount = 1;
                        }
                        data.deadLineShowTip = `tkey_211??&value1==<color = #249A50>${acc}</color>&&value2==<color = #249A50>${data.deadLinePeopleCount}</color>`;
                        if (data.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                            data.historyList.push({
                                key: "tkey_211",
                                account: acc,
                                peopleCount: data.deadLinePeopleCount
                            });
                        } else {
                            data.historyList.shift();
                            data.historyList.push({
                                key: "tkey_211",
                                account: acc,
                                peopleCount: data.deadLinePeopleCount
                            });
                        }
                    } else {
                        data.deadLinePeopleCount += FrameSDK.randomInt(FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[j].addCount[0], FrameData.FRAME_CONF.TaskLineFrameConfig.videoMinus[j].addCount[1]);
                        data.deadLineShowTip = `tkey_210??&value1==<color = #249A50>${acc}</color>&&value2==<color = #249A50>${data.deadLinePeopleCount}</color>`;
                        if (data.historyList.length < FrameData.FRAME_CONF.TaskLineFrameConfig.MaxLength) {
                            data.historyList.push({
                                key: "tkey_210",
                                account: acc,
                                peopleCount: data.deadLinePeopleCount
                            });
                        } else {
                            data.historyList.shift();
                            data.historyList.push({
                                key: "tkey_210",
                                account: acc,
                                peopleCount: data.deadLinePeopleCount
                            });
                        }
                    }
                    break;
                }
            }
        }
    }

    static getRandomInviteCode() {
        let ranName = Math.ceil(Math.random() * 10000) + "**";
        const uppercaseLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        return uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)] + ranName;
    }

    //将秒数转换为时分秒格式
    static formatSeconds(value: number) {
        let data = FrameSDK.formatSeconds3(value);
        return data.hour + data.minute + data.second;
    }

    //将秒数转换为时分秒格式
    static formatSeconds3(value: number) {
        if (value <= 0) {
            value = 0;
        }
        let addZeroForTime = (time: number) => {
            if (Number(time).toString().length < 2) {
                return "0" + time;
            }
            return time.toString();
        };
        let second = parseInt(value + "") <= 0 ? 0 : parseInt(value + "");// 秒
        let hour = 0; //小时
        let minute = 0;// 分
        if (second >= 60) {
            hour = parseInt((second / 3600).toString());
            minute = parseInt((second % 3600 / 60).toString());
            second = parseInt((second % 60).toString());
        }
        return { hour: addZeroForTime(hour), minute: addZeroForTime(minute), second: addZeroForTime(second) };
    }

    static HttpGet(url: string, data: any, completeCallback: (error: Error, responseText: any) => void) {
        function parseObjUrlPara(obj: any) {
            let poststr: string = "";
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    poststr += `${key}=${obj[key]}&`;
                }
            }
            return poststr.substring(0, poststr.length - 1);
        }

        let XMLHttpRequest = cc.loader.getXMLHttpRequest();
        if (data) {
            url += "?" + parseObjUrlPara(data);
        }
        XMLHttpRequest.open("GET", url, true);
        XMLHttpRequest.onload = (e) => {
            if (XMLHttpRequest.readyState == 4 && XMLHttpRequest.status == 200) {
                completeCallback(null, XMLHttpRequest.responseText);
            } else {
                completeCallback({ name: "Can't get", message: url }, {});
            }
        };
        XMLHttpRequest.onerror = () => {
            completeCallback({ name: "Can't get it. The network may be disconnected", message: url }, {});
        };
        XMLHttpRequest.send();
    }

    /**
     * 注册风控监听
     * @param cb 返回true/false  true为激活状态，false为屏蔽状态
     */
    static addFlagListen(cb, target: any) {
        cc.director.on(FrameSDK.frameData.ListenKeys.FRESH_FLAG, cb, target);
    }

    static addCountryListen(cb, target: any) {
        cc.director.on("CHANGE_COUNTRY", cb, target);
    }

    /**
     * 注册货币校正监听
     * @param cb 返回type-货币名称/num-当前货币数量/change-货币的加减的值
     */
    static addCreditListen(cb, target: any) {
        cc.director.on("FRESH_CREDIT", cb, target);
    }

    /**
     * 注册新手引导结束监听
     * @param cb 无返回值
     */
    static addNewHandFinishListen(cb, target: any) {
        cc.director.on("NEW_HAND_FINISH", cb, target);
    }

    /**
     * 注册超级大奖监听
     * @param cb 返回event-大奖事件(show-展示大奖 claim-领取大奖)/param-附加数据
     */
    static addSuperAwardListen(cb, target: any) {
        cc.director.on("SUPER_AWARD", cb, target);
    }


    //获取国家
    static getCountry_Language(lan) {
        function getContryData(langcode: string) {
            let index = langcode.indexOf("#");
            langcode = langcode.substring(0, index == -1 ? langcode.length : index);
            let langarr = langcode.split(langcode.indexOf("_") != -1 ? "_" : "-");
            for (let i = langarr.length - 1; i >= 0; i--) {
                if (langarr[i] == "") {
                    langarr.splice(i, 1);
                }
            }
            let data = { lang: langarr[0], country: "SBALL" };
            if (langarr.length > 1) {
                data = { lang: langarr[0], country: langarr[langarr.length - 1] };
            }
            let CountryList = FrameData.SDK_CONF.COUNTRY_LIST;
            for (let country of CountryList) {
                if (data.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            data = { lang: "en", country: "SBALL" };
            for (let country of CountryList) {
                if (data.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            return CountryList[0];
        }

        let data = getContryData(lan);
        ///////////////////////////////////////////////////////
        FrameData.myCountry = data.country;
        FrameData.countryIndex = data.ad_t - 1;
        FrameData.CountryConf = data;
        FrameSDK.frameData.gameData.myLanguge = data.language;
        console.log("getCountry_Language", lan, FrameData.myCountry, FrameSDK.frameData.gameData.myLanguge);
    }

    //setLan
    static setLan(lan) {
        FrameSDK.getCountry_Language(lan);
        i18.setLanguage(lan);
        // cc.director.emit(FrameSDK.frameData.ListenKeys.FRESH_STRING);
    }


    static initCocosAmend() {
        // let FRESH_STRINGArray = [];
        cc.director.on(FrameSDK.frameData.ListenKeys.FRESH_STRING, () => {
            i18.updataString();
        });

    }
    static getCountryIndex() {
        let level = FrameData.CountryConf.ad_t;
        return level - 1;
    }


    //获取一个或多个节点的贴图
    static getNodeTexture(pnode: cc.Node | cc.Node[], parent?: cc.Node): cc.SpriteFrame {
        if (pnode instanceof cc.Node) {
            pnode = [pnode];
        }
        let node = new cc.Node();
        node.parent = parent || cc.find("Canvas");
        let camera = node.addComponent(cc.Camera);
        camera.cullingMask = 0xffffffff;
        camera.depth = 2;
        camera.alignWithScreen = true;
        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.winSize.width, cc.winSize.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        camera.targetTexture = texture;
        for (let node of pnode) {
            camera.render(node);
        }
        node.removeFromParent(true);
        node.destroy();
        let spriteframe = new cc.SpriteFrame(texture);
        spriteframe.setFlipY(true);
        return spriteframe;
    }

    static getRes<T extends cc.Asset>(path: string, type: typeof cc.Asset, onComplete?: (assets: T) => void) {
        let asset = cc.assetManager.getBundle(FrameSDK.bundleName).get("res/" + path, type);
        if (asset) {
            onComplete && onComplete(<any>asset);
        } else {
            cc.assetManager.getBundle(FrameSDK.bundleName).load("res/" + path, type, (error, assets) => {
                onComplete && onComplete(<any>assets);
            });
        }
    }

    static preloadOpenEffectMask() {
        if (FrameSDK._maskSpriteFrame) {
            return;
        }
        const bundle = cc.assetManager.getBundle(FrameSDK.bundleName);
        if (!bundle) {
            return;
        }
        bundle.load("internal/image/default_editbox_bg", cc.SpriteFrame, (error, assets: cc.SpriteFrame) => {
            if (!error && assets) {
                FrameSDK._maskSpriteFrame = assets;
            }
        });
    }

    static async loadPrefab(name: string, cb: (node: cc.Node) => void, isLoad = false, path = "Prefab/") {
        if (PanelPool.isPooled(name)) {
            isLoad && FrameSDK.frameData?.gameFuc?.openLoad();
            PanelPool.acquire(name, (node) => {
                isLoad && FrameSDK.frameData?.gameFuc?.closeLoad();
                if (node) {
                    cb(node);
                }
            });
            return;
        }
        isLoad && FrameSDK.frameData.gameFuc.openLoad();
        cc.assetManager.getBundle(FrameSDK.bundleName).load(path + name, cc.Prefab, (error, assets: cc.Prefab) => {
            isLoad && FrameSDK.frameData.gameFuc.closeLoad();
            if (assets) {
                cb(cc.instantiate(assets));
            } else {
                console.error(error);
            }
        });
    }

    /** 关闭或返回时回收池化弹窗；非池化节点则 destroy */
    static releasePanelNode(node: cc.Node) {
        if (!node || !cc.isValid(node)) {
            return;
        }
        const poolName = PanelPool.getPoolName(node);
        if (poolName && PanelPool.isPooled(poolName)) {
            FrameSDK.clearPanelStaticRefs(node, poolName);
            PanelPool.release(poolName, node);
            return;
        }
        node.destroy();
    }

    private static clearPanelStaticRefs(node: cc.Node, poolName: string) {
        if (poolName === "Panel_Clock") {
            const comp = node.getComponent(Panel_Clock);
            if (comp && Panel_Clock.ins === comp) {
                Panel_Clock.ins = null;
            }
        }
    }

    private static finishClosePanel(target: any, call: () => void) {
        call && call();
        if (!target?.node || !cc.isValid(target.node)) {
            return;
        }
        const poolName = PanelPool.getPoolName(target.node);
        if (poolName && PanelPool.isPooled(poolName)) {
            FrameSDK.clearPanelStaticRefs(target.node, poolName);
            PanelPool.release(poolName, target.node);
        } else {
            target.node.destroy();
        }
    }

    static playEffect(name: string) {
        if (FrameSDK.soundList[name] == undefined) {
            cc.assetManager.getBundle(FrameSDK.bundleName).load("Sound/" + name, cc.AudioClip, (error, assets) => {
                if (assets) {
                    FrameSDK.soundList[name] = assets;
                    return FrameSDK.playEffect(name);
                } else {
                    cc.warn("没有这个音效", name);
                }
            });
        } else if (FrameSDK.frameData.gameData.isSound) {
            return cc.audioEngine.playEffect(FrameSDK.soundList[name], false);
        }
    }


    static openVideo(successCallback?: () => any, failedCallback?: () => any, startCallback?: () => any, placement: string = "") {
        // if (FrameData.SDK_CONF.NO_VIDEO || !FrameSDK.frameData) {
        //     console.log(`skip video`);
        //     startCallback && startCallback();
        //     successCallback && successCallback();
        // } else {
        //     FrameSDK.frameData.gameFuc.openLoad();
        //     startCallback && startCallback();
        //     FrameSDK.logLiftEvent(`first_ad`);
        //     FrameSDK.frameData.sdkFuc.openVideo(() => {
        //         FrameSDK.frameData.gameFuc.closeLoad();
        //         this._lastVideoEndTime = Date.now();
        //         successCallback();
        //     }, () => {
        //         FrameSDK.frameData.gameFuc.closeLoad();
        //         failedCallback();
        //     });
        // }


        if (FrameData.SDK_CONF.NO_VIDEO || !FrameSDK.frameData) {
            console.log(`skip video`);
            logAd("click");
            logAd("succeed");
            startCallback && startCallback();
            successCallback && successCallback();
        } else {
            FrameSDK.frameData.gameFuc.openLoad(5, "", true);
            startCallback && startCallback();
            FrameSDK.logLiftEvent(`first_ad`);
            let successCall = (isInter: boolean = false) => {
                FrameSDK.frameData.gameFuc.closeLoad();
                successCallback();
            };
            let failedCall = () => {
                if (!FrameSDK.frameData.gameData.noProfitAd) {
                    FrameSDK.openInters(successCall, () => { }, placement + "_videoToInters");
                } else {
                    FrameSDK.frameData.gameFuc.closeLoad();
                    failedCallback();
                }
            };
            let retrytime = FrameSDK.now;
            let openVideo = () => {
                if (FrameSDK.frameData.sdkFuc.isReadyVideo) {
                    FrameSDK.frameData.sdkFuc.placement = placement;
                    FrameSDK.frameData.sdkFuc.openVideo(successCall, failedCall);
                } else if (retrytime + FrameData.SDK_CONF.videoRetryTime > FrameSDK.now) {
                    setTimeout(openVideo, 300);
                } else {
                    failedCall();
                }
            };
            openVideo();
        }
    }


    static openInters(callback?: () => any, startCallback?: () => any, placement: string = "") {
        startCallback && startCallback();
        // 某些渠道/原生桥接可能重复触发回调，这里做一次性保护
        let called = false;
        const once = () => {
            if (called) { return; }
            called = true;
            callback && callback();
        };
        if (FrameData.SDK_CONF.NO_VIDEO) {
            once();
        } else if (FrameSDK.frameData) {
            FrameSDK.frameData.sdkFuc.placement = placement;
            FrameSDK.frameData.sdkFuc.openInters(() => {
                this._lastVideoEndTime = Date.now();
                once();
            });
        } else {
            once();
        }
    }

    static isShowInters() {
        return !FrameSDK.frameData.gameData.noProfitAd
            && FrameSDK.frameData.gameData.passLevel+1 >= FrameData.FRAME_CONF.InterConfig.maxFreeLevel
            && Date.now() - this._lastVideoEndTime >= FrameData.FRAME_CONF.InterConfig.cooldown;
    }
    /**进入关卡的时候用的 */
    static isShowInters2() {
        return !FrameSDK.frameData.gameData.noProfitAd
            && FrameSDK.frameData.gameData.passLevel+1 >= FrameData.FRAME_CONF.InterConfig.maxFreeLevel
            && (!FrameData.FRAME_CONF.before_NoInter || (Date.now() - this._lastVideoEndTime >= FrameData.FRAME_CONF.InterConfig.cooldown));
    }

    static openBanner(gravity: number = 1, margin: number = 0) {
        if (FrameData.SDK_CONF.isShowBanner) {
            FrameSDK.frameData.sdkFuc.openBanner(gravity, margin);
        } else {
            console.log("配置关闭了 Banner 广告");
        }
    }

    static hiddenBanner() {
        FrameSDK.frameData.sdkFuc.hiddenBanner();
    }
    /**
     * 将金币数值转换为 number（不做千分位格式化）
     * @param value 原始数值
     * @param transformToCash 是否按汇率换算为现金
     */
    static convertCoinToNumber(value: number, transformToCash: boolean = true): number {
        if (!transformToCash) {
            return value;
        }
        const rate = FrameData.FRAME_CONF.RedeemRateConfig[0];
        if (rate <= 0) {
            return value;
        }
        const cashValue = value / rate * FrameData.CountryConf.rate;
        return Number(cashValue.toFixed(2));
    }

    static convertCoinToStr(value: number, transformToCash: boolean = false): string {
        return this.formatNumber(value, transformToCash ? 2 : 0, transformToCash ? FrameData.FRAME_CONF.RedeemRateConfig[0] : 0);
    }

    static convertCharityToStr(value: number, transformToCash: boolean = false): string {
        return this.formatNumber(value, transformToCash ? 2 : 0, transformToCash ? FrameData.FRAME_CONF.RedeemRateConfig[1] : 0);
    }

    /**
     * 格式化数字
     * @param value 数字
     * @param decimals 保留小数位数
     * @param cashRate 货币:现金比率（不传或小于等于0则不转换为现金）
     * @returns 格式化字符串
     */
    static formatNumber(value: number, decimals: number = 0, cashRate: number = 0): string {
        decimals = Math.max(0, Math.floor(decimals));

        if (cashRate > 0) {
            value = value / cashRate * FrameData.CountryConf.rate;
        }

        const str = value.toString();
        const integerAndDecimal = str.split(".");

        if (decimals <= 0) {
            integerAndDecimal.length = 1;
        } else if (integerAndDecimal.length > 1) {
            integerAndDecimal[1] = integerAndDecimal[1].substring(0, decimals);
        }

        const sign = str.startsWith("+") || str.startsWith("-") ? integerAndDecimal[0].substring(0, 1) : "";
        integerAndDecimal[0] = integerAndDecimal[0].substring(sign.length);
        integerAndDecimal[0] = integerAndDecimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${sign}${cashRate > 0 ? FrameData.CountryConf.symbol : ""}${integerAndDecimal.join(".")}`;
    }

    static get now() {
        return Math.floor(cc.sys.now() / 1000);
    }

    static showToast(msg: string) {
        FrameSDK.loadPrefab("Panel_Toast", node => {
            let com = node.getComponent(RDM_Toast);
            com.text = msg;
            node.parent = FrameSDK.Panel;
        });
    }


    static openEffect(target: any, options?: any, call?: () => void) {
        if (!target.black_sprite) {
            target.black_sprite = new cc.Node(target.node.name + "_black_sprite").addComponent(cc.Sprite);
            target.black_sprite.node.addComponent(cc.BlockInputEvents);
            target.black_sprite.node.color = cc.Color.BLACK;
            target.black_sprite.node.zIndex = -1;
            target.node.addChild(target.black_sprite.node);
            const applyMaskFrame = (sf: cc.SpriteFrame) => {
                if (!sf || !target.black_sprite || !cc.isValid(target.black_sprite.node)) {
                    return;
                }
                target.black_sprite.spriteFrame = sf;
                target.black_sprite.node.width = cc.winSize.width + 200;
                target.black_sprite.node.height = cc.winSize.height + 200;
            };
            if (FrameSDK._maskSpriteFrame) {
                applyMaskFrame(FrameSDK._maskSpriteFrame);
            } else {
                cc.assetManager.getBundle(FrameSDK.bundleName).load("internal/image/default_editbox_bg", cc.SpriteFrame, (error, assets: cc.SpriteFrame) => {
                    if (!error && assets) {
                        FrameSDK._maskSpriteFrame = assets;
                    }
                    applyMaskFrame(assets);
                });
            }
            target.noTouch = new cc.Node(target.node.name + "_noTouch").addComponent(cc.BlockInputEvents);
            target.noTouch.node.setContentSize(cc.winSize.width + 200, cc.winSize.height + 200);
            target.node.addChild(target.noTouch.node);
        }

        target.black_sprite && (target.black_sprite.node.opacity = 0);
        target.black_sprite && cc.tween(target.black_sprite.node).to(0.2, {
            opacity: (options && options.opacity) || 204
        }).start();
        if (null != target.panel_window) {
            target.panel_window.stopActionByTag(4660);
            target.panel_window.scale = 0.1;
            target.panel_window.opacity = 255;
            cc.tween(target.panel_window).parallel(cc.tween().delay(0.01).call(() => {
                call && call();
                target.noTouch.node.active = false;
            }), cc.tween().to(0.25, {
                scale: 1,
                opacity: 255
            }, {
                easing: "backOut"
            })).tag(4660).start();
        } else {
            target.node.stopActionByTag(4660);
            cc.tween(target.node).tag(4660).call(() => {
                call && call();
                target.noTouch.node.active = false;
            }).start();
        }
    }

    static closeEffect(target: any, call: () => void) {
        target.black_sprite && cc.tween(target.black_sprite.node).delay(0.2 * 0.3).to(0.8 * 0.3, {
            opacity: 0
        }).start();
        if (target.noTouch) target.noTouch.node.active = true;
        if (null != target.panel_window) {
            target.panel_window.stopActionByTag(9029);
            let point = target.panel_window.position;
            let time = 0.3;
            if (target._close_target) {
                time = 0.5;
                point = target._close_target.convertToWorldSpaceAR(cc.v2());
                point = target.panel_window.parent.convertToNodeSpaceAR(point);
            }
            cc.tween(target.panel_window).to(time, {
                scale: 0.1,
                opacity: 100,
                position: point
            }, {
                easing: "backIn"
            }).tag(9029).call(() => {
                FrameSDK.finishClosePanel(target, call);
            }).start();
        } else {
            if (!cc.isValid(target.node)) {
                console.error("cc.isValid(target.node)", target.node);
                return;
            }
            target.node.stopActionByTag(9029);
            cc.tween(target.node).tag(9029).call(() => {
                FrameSDK.finishClosePanel(target, call);
            }).start();
        }
    }

    static openPanel_Yellow(call?: Function) {
        FrameSDK.loadPrefab("RDM_Level", node => {
            node.parent = FrameSDK.Panel;
            node.active = true;
            node.getComponent(RDM_Level).viewData = {
                closeCB: () => {
                    call && call();
                }
            };
        });
    }

    static openPanel_Charity() {
        FrameSDK.loadPrefab("RDM_Charity", node => {
            node.parent = FrameSDK.Panel;
            node.active = true;
        });
    }

    static currLevel: number = 0;

    static openABAward(call?: Function) {
        if (FrameSDK.frameData.gameData.passLevel + 1 < FrameData.FRAME_CONF.AbPop) {
            return;
        }
        FrameData.saveData.preAwardType = (FrameData.saveData.preAwardType + 1) % 2;
        FrameSDK.openWindow("Panel_Award_" + (FrameData.saveData.preAwardType === 1 ? "3" : "1"), {
            closeCB: () => {
                call && call();
            }
        });
    }

    static openLevelAward(externalNode?: cc.Node, unlockCountUpdateFunc?: (unlockCount: number) => any, superExternalNode?: cc.Node, param?: any, callback?: (type: "home" | "continue") => any): void {
        FrameSDK.openWindow("Panel_Award_6", {
            externalNode: externalNode,
            unlockCountUpdateFunc: unlockCountUpdateFunc,
            superExternalNode: superExternalNode,
            param: param,
            closeCB: (type: "home" | "continue") => {
                // FrameSDK.openRating();
                //提示
                if (FrameSDK.currLevel != FrameSDK.frameData.gameData.passLevel) {
                    FrameSDK.currLevel = FrameSDK.frameData.gameData.passLevel;
                    // if (FrameData.saveData.guideInedx == 0) {
                    // } else {
                    //     // Frame.ins.setGuideShow2();
                    // }
                }
                callback?.(type);
            }
        });
    }
    /**A面消除加钱 */
    static addCoin_A() {
        let coin = FrameSDK.randomInt(1, 1);
        // 正常游戏内移牌/消除产出：不计入存钱罐
        FrameSDK.addCoin(coin, 0, 0, () => {}, { excludePiggy: true });
    }

    static openWindow(name: string, data: any = {}, parent?: cc.Node) {
        FrameSDK.loadPrefab(name, (node) => {
            if (!node) {
                return;
            }
            const comp = node.getComponent(name);
            if (comp) {
                comp.viewData = data;
            }
            node.parent = parent || FrameSDK.Panel;
            node.active = true;
        });
    }

    /** 关卡开始横幅（Panel_ShowLevel 预制体） */
    static showLevelStartBanner(callback?: () => void, level?: number): void {
        const lv = level != null && !isNaN(Number(level))
            ? Math.floor(Number(level))
            : FrameSDK.frameData.gameData.passLevel + 1;
        FrameSDK.openWindow("Panel_ShowLevel", {
            level: lv,
            closeCB: callback
        });
    }

    static openGradeNum: number = 0;

    /**
     * 配置为「第 N 关通关后解锁」时使用。
     * passLevel 为已通关数（gameLevel - 1），刚通关第 N 关时 passLevel = N - 1。
     */
    static hasPassedConfigLevel(configLevel: number): boolean {
        const lv = Math.max(1, Math.floor(Number(configLevel) || 0));
        return FrameSDK.frameData.gameData.passLevel + 1 >= lv;
    }

    /** 通关结算面板（Panel_Award_6 + 飞币）进行中，此期间不跑解锁弹窗链 */
    static postLevelSettlementActive = false;
    /** 通关后解锁弹窗链执行中，避免与其它主动弹窗重叠 */
    static postLevelUnlockChainActive = false;

    static setPostLevelSettlementActive(active: boolean): void {
        FrameSDK.postLevelSettlementActive = active;
    }

    static isPopUpLayerBusy(): boolean {
        return !!(FrameSDK.Panel && cc.isValid(FrameSDK.Panel) && FrameSDK.Panel.childrenCount > 0);
    }

    /** 等待 popUpNode 上所有弹窗关闭后再继续解锁链，避免叠窗 */
    static waitForPopUpLayerIdle(timeoutMs = 120000): Promise<void> {
        return new Promise<void>(resolve => {
            const start = Date.now();
            const tick = () => {
                if (!FrameSDK.isPopUpLayerBusy()) {
                    resolve();
                    return;
                }
                if (Date.now() - start > timeoutMs) {
                    console.warn("[FrameSDK] waitForPopUpLayerIdle timeout");
                    resolve();
                    return;
                }
                setTimeout(tick, 50);
            };
            tick();
        });
    }

    /**
     * 解锁链单步：执行 open(done)，done 表示本步 UI 已关闭，并等待 popUpNode 清空。
     */
    static runUnlockPopUpStep(run: (done: () => void) => void): Promise<void> {
        return new Promise<void>(resolve => {
            let doneCalled = false;
            const done = () => {
                if (doneCalled) {
                    return;
                }
                doneCalled = true;
                FrameSDK.waitForPopUpLayerIdle().then(resolve);
            };
            try {
                run(done);
            } catch (err) {
                console.error("[FrameSDK] runUnlockPopUpStep error", err);
                done();
            }
        });
    }

    /** 公益币主界面手指引导：须完成 RDM_Charity 内教程后才进入下一项弹窗 */
    static waitForCharityFingerGuide(): Promise<void> {
        return new Promise<void>(resolve => {
            const needFinger =
                !FrameSDK.frameData.gameData.noProfitAd &&
                FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.charityLevel) &&
                FrameData.saveData.charityGuideIndex <= 0;
            if (!needFinger || !Frame.ins) {
                resolve();
                return;
            }
            Frame.ins.setGuide2Show(true);
            let settled = false;
            const done = () => {
                if (settled) {
                    return;
                }
                settled = true;
                cc.director.off("CHARITY_GUIDE_FINISH", done, FrameSDK);
                if (Frame.ins) {
                    Frame.ins.setGuide2Show(false);
                }
                resolve();
            };
            cc.director.on("CHARITY_GUIDE_FINISH", done, FrameSDK);
        });
    }

    static openRating(callback?: () => any) {
        if (false == FrameData.saveData.isRating && FrameSDK.frameData.gameData.passLevel+1  <= FrameData.FRAME_CONF.ratingLevel2) {
            if (FrameData.SDK_CONF.GradeState == 0 || FrameData.saveData.openRatingInedx > 3) {
                callback?.();
                return;
            }

            if (FrameData.saveData.openRatingInedx == 0 && FrameSDK.frameData.gameData.passLevel+1 == FrameData.FRAME_CONF.ratingLevel) {
                FrameSDK.openWindow("Panel_Rating", { closeCB: callback });
                return;
            }
            if (FrameData.saveData.openRatingInedx == 1 && FrameSDK.frameData.gameData.passLevel+1 == FrameData.FRAME_CONF.ratingLevel2) {
                FrameSDK.openWindow("Panel_Rating", { closeCB: callback });
                return;
            }
            // FrameSDK.openGradeNum++;
            // if (FrameData.saveData.openRatingInedx > 0 && FrameSDK.openGradeNum % FrameData.FRAME_CONF.intervalGrade != 0) {
            //     callback?.();
            //     return;
            // }
            callback?.();

            // FrameSDK.openWindow("Panel_Rating", {closeCB: callback});
        } else {
            callback?.();
        }
    }
    /**
     * 通关结算动画全部结束后调用：串行弹出解锁/教程弹窗，全部关闭后再 callback（如 START_GAME）。
     * 须与 Panel_Award_6 领取+飞币流程解耦，不要在 prepareMahjongPassSettlement 里提前调用。
     */
    static checkPopUp(levelPassed: boolean, callback?: () => any): void {
        if (FrameSDK.postLevelSettlementActive) {
            console.warn("[FrameSDK] checkPopUp skipped: settlement still active");
            return;
        }
        if (FrameSDK.postLevelUnlockChainActive) {
            console.warn("[FrameSDK] checkPopUp skipped: unlock chain already running");
            return;
        }
        FrameSDK.postLevelUnlockChainActive = true;

        const finishChain = () => {
            FrameSDK.postLevelUnlockChainActive = false;
            callback?.();
        };

        FrameSDK.waitForCharityFingerGuide()
            .then(() => FrameSDK.waitForPopUpLayerIdle())
            // 1. 存钱罐 Panel_Activity（bankLevel 解锁）
            .then(() => FrameSDK.runUnlockPopUpStep((done) => {
                if (FrameData.saveData.activity === null && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.bankLevel)) {
                    Panel_Activity.startActivity(done);
                } else {
                    done();
                }
            }))
            // 2. 关卡任务 Panel_Task（taskLevel 解锁）
            .then(() => FrameSDK.runUnlockPopUpStep((done) => {
                if (FrameData.saveData.lvAwardinfo == null && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.taskLevel)) {
                    Panel_Task.startTask(done);
                } else {
                    done();
                }
            }))
            // 3. 每日通关奖励 Panel_DailyClearanceReward（仅一次）
            .then(() => FrameSDK.runUnlockPopUpStep((done) => {
                const unlockLv = Math.max(1, Math.floor(Number(FrameData.FRAME_CONF.dailyClearanceUnlockLevel) || 2));
                const unlocked = FrameSDK.hasPassedConfigLevel(unlockLv);
                if (!FrameData.saveData.onceEventRecord) {
                    FrameData.saveData.onceEventRecord = {};
                }
                const once = FrameData.saveData.onceEventRecord["daily_clearance_unlock"];
                if (FrameSDK.frameData.gameData.isFlag && unlocked && !once) {
                    FrameData.saveData.onceEventRecord["daily_clearance_unlock"] = true;
                    Panel_DailyClearanceReward.start(done);
                    return;
                }
                done();
            }))
            // 4. 预绑定：先 RDM_Level 黄板，关后再 Panel_PreRdm（仅一次）
            .then(() => FrameSDK.runUnlockPopUpStep((done) => {
                const unlockLv = Math.max(1, Math.floor(Number(FrameData.FRAME_CONF.preRdmUnlockLevel) || 10));
                const unlocked = FrameSDK.hasPassedConfigLevel(unlockLv);
                if (!FrameData.saveData.onceEventRecord) {
                    FrameData.saveData.onceEventRecord = {};
                }
                const once = FrameData.saveData.onceEventRecord["pre_rdm_unlock"];
                if (FrameSDK.frameData.gameData.isFlag && unlocked && !once) {
                    FrameData.saveData.onceEventRecord["pre_rdm_unlock"] = true;
                    FrameSDK.openPanel_Yellow(() => {
                        FrameSDK.waitForPopUpLayerIdle().then(() => {
                            FrameSDK.openWindow("Panel_PreRdm", {
                                numStr: FrameSDK.convertCoinToStr(FrameData.credit, true),
                                closeCB: done,
                            });
                        });
                    });
                    return;
                }
                done();
            }))
            // 5. 签到 Panel_Clock（ClockLevel 解锁）
            .then(() => FrameSDK.runUnlockPopUpStep((done) => {
                if (FrameSDK.frameData.gameData.isFlag && FrameData.saveData.ClockUserInfo == null && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.ClockLevel)) {
                    Panel_Clock.openClock(done);
                } else {
                    done();
                }
            }))
            .then(() => finishChain())
            .catch((err) => {
                console.error("[FrameSDK] checkPopUp chain error", err);
                finishChain();
            });
    }

    static hasPopUp(): boolean {
        const dailyUnlockLv = Math.max(1, Math.floor(Number((FrameData.FRAME_CONF as any).dailyClearanceUnlockLevel) || 2));
        const preRdmUnlockLv = Math.max(1, Math.floor(Number((FrameData.FRAME_CONF as any).preRdmUnlockLevel) || 10));
        return (!FrameSDK.frameData.gameData.noProfitAd && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.charityLevel) && FrameData.saveData.charityGuideIndex <= 0)
            || (FrameData.saveData.activity === null && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.bankLevel))
            || (FrameData.saveData.lvAwardinfo == null && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.taskLevel))
            || (FrameSDK.frameData.gameData.isFlag && FrameSDK.hasPassedConfigLevel(dailyUnlockLv) && !(FrameData.saveData.onceEventRecord && FrameData.saveData.onceEventRecord["daily_clearance_unlock"]))
            || (FrameSDK.frameData.gameData.isFlag && FrameSDK.hasPassedConfigLevel(preRdmUnlockLv) && !(FrameData.saveData.onceEventRecord && FrameData.saveData.onceEventRecord["pre_rdm_unlock"]))
            || (FrameSDK.frameData.gameData.isFlag && FrameData.saveData.ClockUserInfo == null && FrameSDK.hasPassedConfigLevel(FrameData.FRAME_CONF.ClockLevel));
    }

    static todayFirst = true
    static todayFirst2 = true
    /**
     * 关卡前置处理
     * @param levelA 关（大关）
     * @param levelB 局（中关，没有请不要传任何值，包括0也不要传）
     * @param levelC 轮（小关，没有请不要传任何值，包括0也不要传）
     * @param callback 回调（关卡在回调后才开始游戏）
     */
    static beforeGameLevelStart(levelA: number, levelB?: number, levelC?: any, callback?: () => any): void {
        const levels: number[] = [levelA <=1?1:levelA-1];
        if (levelB !== null && levelB !== undefined) {
            levels.push(levelB);
        }
        if (levelC !== null && levelC !== undefined) {
            // levels.push(levelC);
            FrameSDK?.logGameEvent("sdymjmatch_report_lv", {
                object_action: "show",
                object_name: `lv_info`,
                object_notes: levelC
            }, true);
        }


        // FrameSDK.logGameEvent("sdymjmatch_report_lv", {
        //     object_action: "show",
        //     object_name: `lv_start`,
        //     object_notes: `${levels.join("_")}`
        // }, true);

        new Promise<void>(resolve => {
            if (levelA > 1 && FrameSDK.todayFirst) {
                FrameSDK.todayFirst = false;
                this.openWindow("Panel_Welcome", {
                    closeCB: resolve
                });
            } else {
                FrameSDK.todayFirst = false;
                if (FrameSDK.frameData.gameData.isFlag && levelA >= 2 && !FrameData.saveData.luck) {
                    FrameData.saveData.luck = true;
                    FrameSDK.openPanel_Yellow(resolve);
                    FrameSDK.openWindow("Panel_Award_Luck", {
                        closeCB: ()=>{}
                    });
                } else {
                    resolve();
                }
            }


            //插屏调到后面
            // if (!FrameSDK.isShowInters()) {
            //     resolve();
            //     return;
            // }
            // FrameSDK.openInters(resolve);

        })
            .then(() => new Promise<void>(resolve => {
                //不知道这个判断有啥用，我这个项目应该不适用，不然第一关的时候拉不起这个提示
                // if (levelA < FrameData.FRAME_CONF.RedeemTipsStartLevel || levelA > this.getFirstRedeemRequirement().rdm_1) {
                // if (levelA > this.getFirstRedeemRequirement().rdm_1) {
                //     resolve();
                //     return;
                // }

                // if (levelA == 1) {
                //     FrameSDK.logGameEvent('sdymjmatch_report_new', {
                //         object_action: 'show',
                //         object_name: 'new_9',
                //     }, true);
                // }
                let CurTurnInfo = FrameSDK.frameData.gameFuc.getCurTurnInfo();
                if (CurTurnInfo.totalTurn > 1) {
                    // featureTip.string = `${CurTurnInfo.curTurn+1}/${CurTurnInfo.totalTurn}`;
                    // levelB = CurTurnInfo.curTurn+1;
                }

                this.openWindow("Panel_RedeemTips", {
                    level: levelB ? `${levelA}  ${levelB}/${CurTurnInfo.totalTurn}` : levelA,//levelB?levelA+"_"+levelB:levelA,
                    currentBonus: FrameData.credit,
                    closeCB: resolve
                });
            })).then(() => new Promise<void>(resolve => {
                if (FrameSDK.todayFirst2) {
                    FrameSDK.todayFirst2 = false;
                    resolve();
                    return;
                }
                if (!FrameSDK.isShowInters2()) {
                    resolve();
                    return;
                }
                let isResolved = false;
                const safeResolve = () => {
                    if (isResolved) { return; }
                    isResolved = true;
                    resolve();
                };
                let cb = () => {
                    FrameSDK.addCoin(0, FrameData.getCoinOutNum("charity"), 0, () => {
                    });
                    safeResolve();
                }
                let isin = FrameSDK.frameData.sdkFuc.isReadyInters;
                if (isin) {
                    FrameSDK.logGameEvent("sdymjmatch_report_ad", {
                        object_action: "show",
                        object_name: `enter_level`,
                        object_notes: `inter`
                    });
                }
                FrameSDK.openInters(cb, () => { }, "level_start_inters");
            })).then(() => new Promise<void>(resolve => {
                FrameSDK.showLevelStartBanner(resolve, levelA);
            }))
            .then(() => {
                callback?.();
                cc.director.emit("SHOW_FLYING_BONUS");
            });
    }

    static openWelcomePanel(cb: () => void) {
        this.openWindow("Panel_Welcome", {
            closeCB: cb
        });
    }

    static logGameEvent(eventName: string, eventData: IEventLike, once: boolean = false): void {
        if (once && this._isOnceEventLogged(eventName, eventData)) {
            return;
        }

        const data: IEventLike = {
            object_action: eventData.object_action
        };

        if (eventData.object_name !== null && eventData.object_name !== undefined) {
            data.object_name = eventData.object_name;
        }

        if (eventData.object_notes !== null && eventData.object_notes !== undefined) {
            data.object_notes = eventData.object_notes;
        }

        // FrameSDK.frameData.sdkFuc.logGameEvent(eventName, data, once);

        if (once) {
            const key = this._getOnceEventCacheKey(eventName, eventData);
            FrameData.saveData.onceEventRecord[key] = true;
        }
    }

    private static _getOnceEventCacheKey(eventName: string, eventData: IEventLike): string {
        return `${eventName}-${eventData.object_action}-${eventData.object_name ? eventData.object_name : ""}-${eventData.object_notes ? eventData.object_notes : ""}`;
    }

    private static _isOnceEventLogged(eventName: string, eventData: IEventLike): boolean {
        const key = this._getOnceEventCacheKey(eventName, eventData);
        return FrameData.saveData.onceEventRecord[key] === true;
    }

    /**
     * 参数说明：finish_task 已自动计数，不需要加数字后缀，并且 submit_order 会在第一个 finish_task 事件中发送
     */
    static logLiftEvent(stepName: "into_game" | "guide_start" | "guide_end" | "start_game" | "first_ad" | "reach_threshold" | "finish_task"): void {
        let step: string = stepName;

        if (step === "finish_task") {
            if (++FrameData.saveData.wwyFinishTaskCount === 1) {
                // FrameSDK.frameData.sdkFuc.lifeEvent("submit_order");
                this.logCommonEvent(`game_life_key_node`, { "step": `submit_order` });
            }

            step = `finish_task_${FrameData.saveData.wwyFinishTaskCount}`;
        }

        if (FrameData.saveData.wwyLifeEventRecord[step]) {
            return;
        }

        // FrameSDK.frameData.sdkFuc.lifeEvent(step);
        this.logCommonEvent(`game_life_key_node`, { "step": `${step}` });


        FrameData.saveData.wwyLifeEventRecord[step] = true;
    }
    /*视频补偿-视频插屏播放漏斗
        action: "exposure"：     广告位的按钮曝光时上报
                "touch"：        视频按钮点击
                "impression"：   展示广告时上报
                "rewarded"：     视频/插屏 适用于激励视频，收到激励视频回调后上报
                "close":         收到广告关闭回调时上报
                "click":         在广告内进行点击行为
    */
    static videoCompensation(action: "exposure" | "touch" | "impression" | "rewarded" | "close" | "click", name: string, isInterstitial?: boolean) {
        // let data = (<any>{
        //     "action": action,
        //     "placement": name,
        //     "type": isInterstitial ? "interstitial" : "video"
        // });
        // FrameSDK.frameData.sdkFuc.logCommonEvent("c_ad_event", data);
    }

    static logCommonEvent(eventName: string, storeData: { [key: string]: any; } = null) {
        // FrameSDK.frameData.sdkFuc.logCommonEvent(eventName, storeData);
    }

    static addCoin(num: number, charityNum: number, donateTime: number, call?: () => void,opts?: { excludePiggy?: boolean }) {
        cc.director.emit("yellowCoin", num, charityNum, donateTime, call, opts);
    }

    static getCurrentRedeemRequirement(): typeof FrameData.FRAME_CONF.CoinConf[number] | null {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let min = FrameData.getCoinConf(1);
        let max = FrameData.getCoinConf(2);

        if (min.rdm_1 > max.rdm_1) {
            const temp = min;
            min = max;
            max = temp;
        }

        if (passLevel >= max.rdm_1) {
            return null;
        } else if (passLevel >= min.rdm_1) {
            return max;
        } else {
            return min;
        }
    }

    static getFirstRedeemRequirement(): typeof FrameData.FRAME_CONF.CoinConf[number] {
        return FrameData.getCoinConf(1);
    }

    static debugAddCoin(type: "yellowCoin" | "greenCoin", num: number): void {
        if (num === 0) {
            return;
        }

        const finalNumber = Math.max(0, FrameData.saveData.credit[type] + num);

        cc.director.emit("FRESH_CREDIT", {
            type: type,
            num: finalNumber,
            change: num
        });

        FrameData.saveData.credit[type] = finalNumber;
    }

    static debugAddBankCoin(num: number): void {
        if (num === 0) {
            return;
        }

        Panel_Activity.addCoin(num);
    }

    static debugChangeBankTime(time: number): void {
        if (!Panel_Activity.isActivity()) {
            return;
        }

        time = Math.max(0, time);

        FrameData.saveData.activity.time = FrameSDK.now + time;
    }

}


cc.js.setClassName("FrameSDK", FrameSDK);
CC_DEBUG && (window["FrameSDK"] = FrameSDK)