import { FrameSDK } from "./FrameSDK";

class Data {
    corrected: boolean = false;
    credit: { yellowCoin: number, greenCoin: number } = { yellowCoin: 0, greenCoin: 0 };
    historyCredit: { pp: number, am: number } = { pp: 0, am: 0 };
    loginDays: number = 1;
    date_day: number = null;
    online_total: number = 0;

    onceEventRecord: { [key: string]: boolean } = {};
    wwyLifeEventRecord: { [key: string]: boolean } = {};
    wwyFinishTaskCount: number = 0;
    wwylifeCycleData = {};

    isRating: boolean = false;
    /**评星打开次数 */
    openRatingInedx: number = 0;

    guideInedx: number = 0;
    freeInedx: number = 0;
    charityGuideIndex: number = 0;
    /**视频+插屏总数 */
    CashVideoCount: number = 0;
    QueueUp = {};
    CharityQueueUp = {};
    lvAwardinfo = null;

    nextData = {
        WallTabLinkNum: {},
        //最新一套
        listShow_Final: {},
        listClick_Final: {},
        listOnline_Final: {},
        freezeList_Final: [],
        /**标签展示次数 (初始配置)*/
        listShow_Final_New: {},
        /**标签点击次数 (初始配置)*/
        listClick_Final_New: {}
    };
    account = "";
    paymentID = -1;
    CoinStep: {
        status: number,
        targetCoin: number
    }[] = [];
    CharityStep: {
        status: number,
    }[] = [];

    activity: {
        state: number,
        time: number,
        coin: number,
        lun:number
    } = null;
    skipADCount = 0;

    preAwardType: number = -1;
    firstRandomAward: boolean = true;
    award5: {
        numList: number[],
        open: object,
        reward: number
    } = null;
    freeSuperAward: boolean = true;

    charityDonated: number = 0;
    charityDonateTime: number = 0;

    flyingBonusIndex: number = -1;
    fly_free: number = 1;

    ClockUserInfo: any = null;
    rdmLevelStats = {
        ka1Value: 10350,
        ka2Value: 1910.77,
        ka3Value: 3896
    };

    luck: boolean = false;

    /** 每日通关奖励：领取位掩码（按 FrameSDK.getDateDay(FrameSDK.now) 跨天重置） */
    dailyClearanceReward: { day: number, mask: number } = null;
    /** 每日通关奖励：当日完成的牌组数进度（由游戏侧发事件 +1，框架侧存储并按天重置） */
    dailyClearanceProgress: { day: number, count: number } = null;
    /** 每日通关领奖「双倍」免看视频：生涯已用次数（上限见 DailyClearanceRewardGetFreeVideoTimes，不随日期重置） */
    dailyClearanceGetFreeVideoUsed: number = 0;

    constructor() {
        let data = Data.getStorageItem("FrameData", null, {});
        for (let key in data) {
            this[key] = data[key];
        }
        cc.game.on(cc.game.EVENT_HIDE, () => {
            Data.setlocalStorageItem(null, FrameData.saveData, "FrameData");
        });

    }

    /**
     * 获取本地缓存数据
     * @param pkey 对象中的key
     * @param key  对象名
     * @param value 如果这个对象中没有这个 pkey 的值 那么就设置成这个值 且 返回这个值
     */
    static getStorageItem<T>(pkey: string, key?: string, value?: T): T {
        let data = this.getlocalStorageItem(key, pkey);
        if (data) {
            return data;
        } else {
            this.setlocalStorageItem(key, value, pkey);
            return value;
        }
    }

    /**
     * 获取本地缓存数据
     * @param key  对象名
     * @param pkey  key 在哪个对象的名 如果不传就为 就为 当前游戏代号
     */
    static getlocalStorageItem(key?: string, pkey?: string): any {
        let data = cc.sys.localStorage.getItem(pkey || "FrameData");
        if (data && key && data != "") {
            return JSON.parse(data)[key];
        }
        if (data != null && data != "") {
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        }
        return null;
    }

    /**
     * 设置本地缓存
     * @param key 名
     * @param value 要设置的值
     * @param pkey  key 在哪个对象的名 如果不传就为 就为 当前游戏代号
     */
    static setlocalStorageItem(key: string, value: any, pkey?: string): void {
        if (value == undefined) {
            value = {};
        }
        let data = this.getlocalStorageItem(undefined, pkey);
        if (key) {
            if (data == null || data == "") {
                data = {};
            }
            data[key] = value;
        } else {
            data = value;
        }
        cc.sys.localStorage.setItem(pkey || "FrameData", JSON.stringify(data));
    }
}

export class FrameData {
    static saveData = new Proxy(new Data(), {  //要存储的对象
        get(target, key) {
            return target[key];
        },
        set(target, key, value) {
            let bool = Reflect.set(target, key, value);
            bool && Data.setlocalStorageItem(null, FrameData.saveData, "FrameData");
            return bool;
        }
    });
    static isTest = false;
    static countryIndex = 2;
    static myCountry = "US";

    static get toolKey(): string {
        return (FrameSDK.frameData ? FrameSDK.frameData.isDeBug : CC_DEBUG) ? FrameData.SDK_CONF.DEBUG_KEY : FrameData.SDK_CONF.RELEASE_KEY;
    };

    static CountryConf = { "id": 101, "name": "美国", "country": "US", "language": "en", "rate": 1, "symbol": "$", "ad_t": 1, "cash_id": [101, 103, 102, 104] };
    static configs = null;

    static SDK_CONF = {
        "DEBUG_KEY": "",
        "RELEASE_KEY": "",
        "EMAIL": "light@out.net",
        "GradleUrl": "",
        "NO_VIDEO": false,
        "isLOG": false,
        "isShowBanner": true,
        "//": " GradeState 评星状态  0 关闭  1开启",
        "GradeState": 1,
        "videoRetryTime": 3,  //视频失败重试时间
        "COUNTRY_LIST": [
            {"id":101,"name":"美国","country":"US","language":"en","rate":1,"symbol":"$","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":102,"name":"英国","country":"GB","language":"en","rate":1,"symbol":"￡","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":103,"name":"法国","country":"FR","language":"fr","rate":1,"symbol":"€","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":104,"name":"德国","country":"DE","language":"de","rate":1,"symbol":"€","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":105,"name":"日本","country":"JP","language":"ja","rate":100,"symbol":"円","ad_t":1,"cash_id":[122,126,101,103]},
        {"id":106,"name":"加拿大","country":"CA","language":"en","rate":1,"symbol":"$","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":107,"name":"澳大利亚","country":"AU","language":"en","rate":1,"symbol":"$","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":108,"name":"新西兰","country":"NZ","language":"en","rate":1,"symbol":"$","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":109,"name":"挪威","country":"NO","language":"no","rate":10,"symbol":"NOK","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":110,"name":"新加坡","country":"SG","language":"en","rate":1,"symbol":"$","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":111,"name":"瑞典","country":"SE","language":"se","rate":10,"symbol":"SEK","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":112,"name":"瑞士","country":"CH","language":"de","rate":1,"symbol":"CHF","ad_t":1,"cash_id":[101,103,102,104]},
        {"id":201,"name":"西班牙","country":"ES","language":"es","rate":1,"symbol":"€","ad_t":2,"cash_id":[113,111,101,103]},
        {"id":202,"name":"阿拉伯","country":"SA","language":"ar","rate":5,"symbol":"SR","ad_t":2,"cash_id":[101,103,102,104]},
        {"id":203,"name":"波兰","country":"PL","language":"pl","rate":5,"symbol":"złote","ad_t":2,"cash_id":[101,103,102,104]},
        {"id":204,"name":"韩国","country":"KR","language":"ko","rate":1000,"symbol":"₩","ad_t":2,"cash_id":[130,101,103,102]},
        {"id":205,"name":"意大利","country":"IT","language":"it","rate":1,"symbol":"€","ad_t":2,"cash_id":[101,103,102,104]},
        {"id":206,"name":"比利时","country":"BE","language":"nl","rate":1,"symbol":"€","ad_t":2,"cash_id":[101,103,102,104]},
        {"id":207,"name":"荷兰","country":"NL","language":"nl","rate":1,"symbol":"€","ad_t":2,"cash_id":[101,103,102,104]},
        {"id":301,"name":"印度","country":"IN","language":"hi","rate":80,"symbol":"₹","ad_t":3,"cash_id":[127,104,101,124]},
        {"id":302,"name":"印尼","country":"ID","language":"in","rate":15000,"symbol":"Rp","ad_t":3,"cash_id":[105,129,106,128]},
        {"id":303,"name":"葡萄牙","country":"PT","language":"pt","rate":1,"symbol":"€","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":304,"name":"泰国","country":"TH","language":"th","rate":30,"symbol":"฿","ad_t":3,"cash_id":[112,118,101,103]},
        {"id":305,"name":"菲律宾","country":"PH","language":"fil","rate":50,"symbol":"₱","ad_t":3,"cash_id":[121,116,101,103]},
        {"id":306,"name":"马来西亚","country":"MY","language":"ms","rate":5,"symbol":"RM","ad_t":3,"cash_id":[119,121,101,103]},
        {"id":307,"name":"哥伦比亚","country":"CO","language":"es","rate":3000,"symbol":"COP","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":308,"name":"阿根廷","country":"AR","language":"es","rate":350,"symbol":"ARS","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":309,"name":"墨西哥","country":"MX","language":"es","rate":20,"symbol":"Mex.$","ad_t":3,"cash_id":[113,111,109,110]},
        {"id":310,"name":"巴西","country":"BR","language":"pt","rate":5,"symbol":"R$","ad_t":3,"cash_id":[108,107,113,123]},
        {"id":311,"name":"越南","country":"VN","language":"vi","rate":20000,"symbol":"₫","ad_t":3,"cash_id":[120,115,101,103]},
        {"id":312,"name":"土耳其","country":"TR","language":"tr","rate":8,"symbol":"₺","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":313,"name":"罗马尼亚","country":"RO","language":"ro","rate":5,"symbol":"Lei","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":314,"name":"约旦","country":"JO","language":"ar","rate":1,"symbol":"$","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":315,"name":"伊拉克","country":"IQ","language":"ar","rate":1,"symbol":"$","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":316,"name":"埃及","country":"EG","language":"ar","rate":1,"symbol":"$","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":317,"name":"以色列","country":"IL","language":"ar","rate":1,"symbol":"$","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":318,"name":"俄罗斯","country":"RU","language":"ru","rate":70,"symbol":"₽","ad_t":3,"cash_id":[114,117,101,103]},
        {"id":319,"name":"乌克兰","country":"UA","language":"uk","rate":20,"symbol":"₴","ad_t":3,"cash_id":[101,103,102,104]},
        {"id":400,"name":"SBALL","country":"SBALL","language":"en","rate":1,"symbol":"$","ad_t":3,"cash_id":[101,103,102,104]}
        ],
    };

    static FRAME_CONF = {
        "SDK_VER": "1.0",
        EMAIL: null,

        "rDTime": [10, 15],

        /**排名配置表 */
        "TaskLineFrameConfig": {
            /**初始化人数 */
            "startPeople": [300, 400],
            /**在线刷新间隔 （后面的600用于显示 拿是拿区间随机）*/
            "flashDeltaTime": [600, 600],
            /**视频减少队列 */
            "videoMinus": [
                { "count": 300, "minusCount": [30, 50], "MinusPrecend": 100, "addCount": [1, 1] },
                { "count": 200, "minusCount": [15, 30], "MinusPrecend": 100, "addCount": [1, 1] },
                { "count": 100, "minusCount": [10, 15], "MinusPrecend": 100, "addCount": [1, 1] },
                { "count": 50, "minusCount": [5, 10], "MinusPrecend": 100, "addCount": [1, 1] },
                { "count": 20, "minusCount": [1, 2], "MinusPrecend": 100, "addCount": [1, 5] },
                { "count": 10, "minusCount": [1, 2], "MinusPrecend": 50, "addCount": [1, 1] },
                { "count": 5, "minusCount": [1, 1], "MinusPrecend": 50, "addCount": [1, 1] },
                { "count": 3, "minusCount": [1, 1], "MinusPrecend": 30, "addCount": [1, 1] },
                { "count": 2, "minusCount": [1, 1], "MinusPrecend": 0, "addCount": [1, 1] },
                { "count": 0, "minusCount": [1, 1], "MinusPrecend": 0, "addCount": [1, 1] }
            ],
            /**分钟刷新排名 */
            "ChangePlusList": [
                { "count": 300, "addCount": [30, 50], "precend": 10 },
                { "count": 200, "addCount": [15, 30], "precend": 30 },
                { "count": 100, "addCount": [10, 15], "precend": 50 },
                { "count": 50, "addCount": [5, 10], "precend": 70 },
                { "count": 0, "addCount": [1, 2], "precend": 100 }
            ],
            /**超过人数则重置排名 */
            "outLinePeopleCount": 400,
            /**列表最打长度 */
            "MaxLength": 20
        },

        "newHand": {
            "max": 20000,
            "random": [5000, 20000],
        },

        "ClockConfig": { "id": 101, "name": "Robux","task":[10,5,5] ,"game_time": 600, "coin_robux": 50000, "act_time": 86400, "act_ad": [30, 30, 35] },

        "TaskConfig": [
            { "task_id": 101, "task_lv": 5, "task_num": 200 },
            { "task_id": 102, "task_lv": 8, "task_num": 300 },
            { "task_id": 103, "task_lv": 12, "task_num": 500 },
            { "task_id": 104, "task_lv": 15, "task_num": 1000 },
            { "task_id": 105, "task_lv": 20, "task_num": 1500 },
            { "task_id": 106, "task_lv": 30, "task_num": 1500 },
            { "task_id": 107, "task_lv": 40, "task_num": 2000 },
            { "task_id": 108, "task_lv": 50, "task_num": 3000 }
        ],

        /**
         * 每日通关奖励（牌组任务）配置：
         * - target：当日累计完成的牌组数达到该值可领取
         * - reward：领取的金币数
         * Panel_DailyClearanceReward 会按数组长度动态生成 item
         */
        "DailyClearanceRewardConfig": [
            { "target": 5, "reward": 50 },
            { "target": 15, "reward": 100 },
            { "target": 25, "reward": 200 },
            { "target": 50, "reward": 400 },   
            { "target": 70, "reward": 600 },
            { "target": 100, "reward": 800 },
            { "target": 120, "reward": 1000 },
            { "target": 150, "reward": 1500 },
            { "target": 200, "reward": 2000 },

        ],

        "InitialCoins": [0, 0],
        //对换配置
        "CoinConf": [
            { "rdm_id": 1, "rdm_1": 50, "rdm_2": [5000, 20000], "rdm_3": 200 },
            { "rdm_id": 2, "rdm_1": 100, "rdm_2": [5000, 20000], "rdm_3": 200 }
        ],

        "CharityConf": [
            { "rdm_id": 1, "rdm_1": 300, "rdm_2": 100, "reward": 2000 },
            { "rdm_id": 2, "rdm_1": 500, "rdm_2": 100, "reward": 5000 }
        ],
        "charityOutPutConfig": [
            { "id": 101, "have": [0, 100], "value": [50, 50] },
            { "id": 102, "have": [100, 150], "value": [20, 25] },
            { "id": 103, "have": [150, 200], "value": [10, 20] },
            { "id": 104, "have": [200, 250], "value": [5, 10] },
            { "id": 105, "have": [250, 275], "value": [3, 5] },
            { "id": 106, "have": [275, 290], "value": [1, 2] },
            { "id": 107, "have": [290, 300], "value": [1, 1] }
        ],
        //兑换比例
        "RedeemRateConfig": [
            10000,
            1,
        ],

        "RedeemTipsStartLevel": 2,

        "OutputConfig": {
            "new": 300,//新手奖励
            "newRandom": [100, 200],//新手奖励随机 三个翻牌那个
            "ad": 100,//多倍基础产出
            "adRate": [7, 10],//广告产出倍数
            "draw": 100,//抽奖产出基础值
            "drawRate": [2, 3, 5],//抽奖产出倍数配置
            "free": 100,//免费产出
            "box": {
                "num": [50, 80],
                "reward": 200,
            },
            "charity": 1,//公益币
            "charityRate": [5, 10],
            "charityPerPeople": 10
        },
        "PiggyConfig": { "time": 86400, "num": 30000 },
        "forceVideo": 3,
        "freeInedx": 3,
        "abAdStartLevel": 5,//xxx关前奖励免费领取包括xxx关

        "charityLevel": 5,//公益解锁关卡 过关
        "ratingLevel": 5,//评星
        "ratingLevel2": 9,//评星
        "taskLevel": 400000,//任务解锁
        "bankLevel": 2,//猪解锁
        "flyingBonusLevel": 5,//飞行宝箱
        "flyingBonusCoin": 500,//飞行宝箱金额
        "ClockLevel":4,//签到解锁关卡
        "dailyClearanceUnlockLevel": 2,//每日通关奖励解锁关卡（通关后）
        /** 每日通关领奖弹窗：生涯共可「免看视频」直接领双倍的次数（不重置）；用完后走真视频并显示直接领取与广告角标 */
        "DailyClearanceRewardGetFreeVideoTimes": 1,
        "preRdmUnlockLevel": 10,//预绑定账号/提现页解锁关卡（通关后）

        "AbPop": 3,//弹产出的关卡包括3
        "rewaedAbTotalTime": [5, 8],//产出间隔区间
        "rewaedAbTotalMiniTime": [10, 20],//简单关卡产出间隔区间
        "miniTime_Lv": 5,//XXX关前使用短时间的间隔
        "RedeemAddCoin": 10000,//兑换二阶段额外增加的钱

        //弹评星间隔
        "intervalGrade": 5,
        //评星连接
        "androidRateUrl": "https://play.google.com/store/apps/details?id=com.cueclub.ballspin.trace",
        "iosRateUrl": "",

        //产出直接领取按钮延迟时间秒
        "yanchiTime": 0,

        //插屏
        "InterConfig": {
            "cooldown": 30000,
            "maxFreeLevel": 8,//xxx关后
        },
        "before_NoInter":true,//进入关卡的时候是否要判断冷却时间条件拉插屏 false就是不要
    };

    static get credit() {
        return FrameData.saveData.credit.yellowCoin;
    }

    static get charityCredit() {
        return FrameData.saveData.credit.greenCoin;
    }

    static updateNewBallConfig(config?: object): void {
        if (!config || typeof config !== 'object') {
            return;
        }

        const gameConfig = config['GAME_CONF'];
        if (!gameConfig || typeof gameConfig !== 'object') {
            return;
        }

        /**@todo 后台配置 */
    }

    static getExchangeStatus(id: number) {
        if (FrameData.saveData.QueueUp[id]) {
            return 5;
        } else {
            if (FrameData.saveData.CoinStep[id] == undefined) {
                FrameData.saveData.CoinStep[id] = {
                    status: 1,
                    targetCoin: null
                };

                FrameSDK.logGameEvent('sdymjmatch_game_rdm', {
                    object_action: 'show',
                    object_name: `rdm_1_start`,
                    object_notes: `redeem_${id}`,
                }, true);
            }
            return FrameData.saveData.CoinStep[id].status;
        }
        return 0;
    }

    static getCharityExchangeStatus(id: number) {
        if (FrameData.saveData.CharityQueueUp[id]) {
            return 4;
        } else {
            if (FrameData.saveData.CharityStep[id] == undefined) {
                FrameData.saveData.CharityStep[id] = {
                    status: 1,
                };
            }

            FrameSDK.logGameEvent('sdymjmatch_game_rdm', {
                object_action: 'show',
                object_name: `rdm2_1_start`,
                object_notes: `redeem_${id}`,
            }, true);

            return FrameData.saveData.CharityStep[id].status;
        }
        return 0;
    }

    static getCoinOutNum<T extends keyof typeof FrameData.FRAME_CONF.OutputConfig>(type: T): typeof FrameData.FRAME_CONF.OutputConfig[T] {
        //公益产出
        if ("charity" == type) {
            let config = FrameData.FRAME_CONF.charityOutPutConfig;
            let have = FrameData.saveData.credit.greenCoin;
            let index = FrameData.FRAME_CONF.charityOutPutConfig.length - 1;
            for (let i = 0; i < config.length; i++) {
                if (have <= config[i].have[1]) {
                    index = i;
                    break;
                }
            }
            let charityNum = FrameSDK.randomInt(config[index].value[0], config[index].value[1]);
            return charityNum as any;
        }
        return FrameData.FRAME_CONF.OutputConfig[type];
    }

    static getOutputConfig(random: boolean) {
        let ml = FrameSDK.randomInt(FrameData.FRAME_CONF.OutputConfig.adRate);
        if (random && FrameData.saveData.firstRandomAward) {
            FrameData.saveData.firstRandomAward = false;
            ml = FrameData.FRAME_CONF.OutputConfig.adRate[1];
        } else if (ml >= 6) {
            ml = Math.min(ml, FrameSDK.randomInt(FrameData.FRAME_CONF.OutputConfig.adRate));
        }
        return {
            isFree: FrameSDK.frameData.gameData.noProfitAd || (FrameSDK.frameData.gameData.passLevel+1) <= FrameData.FRAME_CONF.abAdStartLevel,
            ml: ml,
            range: FrameData.FRAME_CONF.OutputConfig.adRate,
        };
    }


    static getCoinConf(id: number) {
        let conf = FrameData.FRAME_CONF.CoinConf[0];
        for (let i = 0; i < FrameData.FRAME_CONF.CoinConf.length; i++) {
            if (FrameData.FRAME_CONF.CoinConf[i].rdm_id == id) {
                conf = FrameData.FRAME_CONF.CoinConf[i];
                break;
            }
        }
        return conf;
    }

    static getCharityConf(id: number) {
        let conf = FrameData.FRAME_CONF.CharityConf[0];
        for (let i = 0; i < FrameData.FRAME_CONF.CharityConf.length; i++) {
            if (FrameData.FRAME_CONF.CharityConf[i].rdm_id == id) {
                conf = FrameData.FRAME_CONF.CharityConf[i];
                break;
            }
        }
        return conf;
    }

    static getTargetCoint(id: number, num: number) {
        // let coinInBank = 5000;

        // if (FrameData.saveData.activity !== 0 as any) {
        //     coinInBank = FrameData.saveData.activity?.coin ?? 0;
        // }

        // const rate = this.FRAME_CONF.RedeemRateConfig[0] * 100;

        // return Math.ceil((num + coinInBank) / rate) * 2 * rate;
        let cccc = num * 2 + FrameData.FRAME_CONF.RedeemAddCoin;
        //对cccc向上取整  保留10W位
        cccc = Math.ceil(cccc / 10000) * 10000;
        return cccc;
    }
}

cc.js.setClassName("FrameData", FrameData);
CC_DEBUG && (window["FrameData"] = FrameData);