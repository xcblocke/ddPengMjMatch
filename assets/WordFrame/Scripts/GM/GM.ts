import {FrameData} from "../FrameData";
import {FrameSDK} from "../FrameSDK";
import i18 from "../i18";


const {ccclass, property} = cc._decorator;
@ccclass
export default class GM extends cc.Component {
    data = null;
    @property(cc.Node)
    mGmNode: cc.Node = null;
    @property(cc.Node)
    btnDetails: cc.Node = null;
    @property(cc.Node)
    LangNode: cc.Node = null;
    @property(cc.Node)
    Toast: cc.Node = null;
    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Toggle)
    toggleList: cc.Toggle[] = [];


    lPass = "";
    @property(cc.Node)
    mPassNode: cc.Node = null;


    baseVersion = "1.0.0";
    coinType = [];
    static toutnum = 0;
    static isopen = false;

    static open(cb = null) {
        console.log("FrameData.toolKey。。。。。。。。。。。。。。。。。", FrameData.toolKey);
        console.log("toutnum...................", this.toutnum);
        if (FrameData.toolKey == "") return;
        this.toutnum++;
        if (this.toutnum >= 5 && this.isopen == false) {
            this.isopen = true;
            FrameSDK.loadPrefab("Panel_GM", (prefab) => {
                let node: cc.Node = cc.instantiate(prefab);
                node.parent = FrameSDK.Panel;
                this.isopen = false;
                cb && cb();
            });
        }
    }

    onLoad() {
        this.LangNode.active = false;
        this.Toast.active = false;
        this.mPassNode.active = FrameData.toolKey != "";
        this.coinType = Object.keys(FrameData.saveData.credit);
        if (FrameData.toolKey == "") {
            this.node.destroy();
        }
    }

    onEnable() {
        this.lPass = "";
        // this.toggleList[0].isChecked = Frame.frameData.gameData.isNewUser;
        this.toggleList[1].isChecked = FrameData.SDK_CONF.NO_VIDEO;
        // this.toggleList[2].isChecked = FrameData.isLOG;
        this.toggleList[3].isChecked = FrameData.isTest;
    }

    protected onDisable(): void {

    }

    closePage(evt?) {
        this.node.destroy();
    }

    clickPass(target, pos) {
        if (pos == "OK") {
            this.lPass = "";
            this.showToast("Password error");
        } else {
            this.lPass += pos;
            if (this.lPass == FrameData.toolKey) {
                this.mPassNode.active = false;
                this.initBottomData();
                this.btnDetails.active = false;
            }
        }
    }

    clickGm(target) {
        switch (target.target.name) {
            case "0":
                // Frame.frameData.gameData.isNewUser = target.target.getComponent(cc.Toggle).isChecked;
                // cc.director.emit(Frame.frameData.ListenKeys.UPDATE_NEWUSER, Frame.frameData.gameData.isNewUser);
                break;
            case "1":
                FrameData.SDK_CONF.NO_VIDEO = target.target.getComponent(cc.Toggle).isChecked;
                break;
            case "2":
                // if (target.target.getComponent(cc.Toggle).isChecked) {
                //     LogView.init(this.JLogView);
                //     FrameData.isLOG = true;
                // } else {
                //     LogView.destoryNode();
                //     FrameData.isLOG = false;
                // }
                break;
            case "3":
                FrameData.isTest = target.target.getComponent(cc.Toggle).isChecked;
                cc.director.emit("showTest");
                break;
            case "4":
                this.initLang();
                break;
            case "5":
                cc.sys.localStorage.clear();
                CC_JSB && cc.assetManager.cacheManager.clearCache();
                cc.game.removeAll(cc.game.EVENT_SHOW);
                cc.game.removeAll(cc.game.EVENT_HIDE);
                cc.EventTarget.prototype.emit = function () {
                };
                if (cc.sys.isBrowser) {
                    location.reload();
                } else {
                    this.showToast("请手动重启游戏！");
                }
                break;
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
                this.initBtnDetail(parseInt(target.target.name));
                break;
        }
    }


    baseType = -1;

    baseData = {
        "6": [100, 1000, 10000, 100000],//coin
        "4": [1, 2, 3, 4],              //day
        "8": [1, 10, 50, 100],          //video
        "9": [100, 1000, 10000, 100000],//gameSec
        "10": [100, 1000, 10000, 100000]//webSec
    };


    initBtnDetail(type: number) {
        if (this.baseType == type) {
            this.btnDetails.active = !this.btnDetails.active;
            return;
        }
        this.btnDetails.active = true;
        if (this.btnDetails.active) {
            this.baseType = type;
            this.btnDetails.getChildByName("0").getComponentInChildren(cc.Label).string = `+${this.baseData[type][0]}`;
            this.btnDetails.getChildByName("1").getComponentInChildren(cc.Label).string = `+${this.baseData[type][1]}`;
            this.btnDetails.getChildByName("2").getComponentInChildren(cc.Label).string = `+${this.baseData[type][2]}`;
            this.btnDetails.getChildByName("3").getComponentInChildren(cc.Label).string = `+${this.baseData[type][3]}`;
        }
    }


    addBaseData(evt) {
        let num = parseInt(evt.target.name);
        if (num == 5) {
            this.baseData[this.baseType][num] = parseInt(this.editBox.string) ? parseInt(this.editBox.string) : 0;
        }
        switch (this.baseType) {
            case 6:
                //所有货币加钱
                for (let i = 0; i < this.coinType.length; i++) {
                    FrameData.saveData.credit[this.coinType[i]] += this.baseData[this.baseType][num];
                }
                this.showToast(`ICON +${this.baseData[this.baseType][num]}`);
                break;
            case 7:
                //加在线天数
                FrameData.saveData.loginDays += this.baseData[this.baseType][num];
                this.showToast(`Line Day +${this.baseData[this.baseType][num]}`);
                break;
            case 8:
                //加视频次数
                FrameData.saveData.CashVideoCount += this.baseData[this.baseType][num];
                cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
                this.showToast(`AD NUM+${this.baseData[this.baseType][num]}`);
                break;

            // case 9:
            //     //游戏在线时间
            //     JSDK.USER_INFO.online_total += this.baseData[this.baseType][num];
            //     this.showToast(`游戏在线时间+${this.baseData[this.baseType][num]}s`);
            //     break;
            // case 10:
            //     //H5活跃时间
            //     JSDK.userSaveData.webOnLineSec += this.baseData[this.baseType][num];
            //     this.showToast(`web活跃时间+${this.baseData[this.baseType][num]}s`);
            //     break;
            default:
                break;

        }
        this.initBottomData();
    }


    initBottomData() {
        this.bottomNode.getChildByName("1").getComponent(cc.Label).string = `GM_VERSION:NULL`;
        this.bottomNode.getChildByName("2").getComponent(cc.Label).string = `VERSION:NULL`;
        this.bottomNode.getChildByName("3").getComponent(cc.Label).string = `USER_ID:NULL`;

        this.bottomNode.getChildByName("4").getComponent(cc.Label).string = `Country:${FrameData.myCountry}`;
        this.bottomNode.getChildByName("5").getComponent(cc.Label).string = `Languge:${i18.myLanguge}`;

        this.bottomNode.getChildByName("6").getComponent(cc.Label).string = `PG:NULL`;
        this.bottomNode.getChildByName("7").getComponent(cc.Label).string = `Code:NULL`;

        this.bottomNode.getChildByName("8").getComponent(cc.Label).string = `SDK_VERSION:NULL`;

        this.bottomNode.getChildByName("9").getComponent(cc.Label).string = `Accumulated online time:NULL`;
        this.bottomNode.getChildByName("10").getComponent(cc.Label).string = `Cumulative H5 duration:NULL`;

        this.bottomNode.getChildByName("11").getComponent(cc.Label).string = `Cumulative login days:${FrameData.saveData.loginDays}`;
        this.bottomNode.getChildByName("12").getComponent(cc.Label).string = `Cumulative video count:NULL`;
        this.bottomNode.getChildByName("13").getComponent(cc.Label).string = `Total number of screen inserts:NULL`;

    }

    initLang() {
        this.LangNode.active = true;
        let mainNode = this.LangNode.getChildByName("mainNode");
        let mode = cc.instantiate(mainNode.children[0]);
        mainNode.removeAllChildren();
        for (let data of  FrameData.SDK_CONF.COUNTRY_LIST) {
            let itme = cc.instantiate(mode);
            itme.getChildByName("Label").getComponent(cc.Label).string = data.country + " - " + data.language;
            itme.getComponent(cc.Button).clickEvents[0].customEventData = `${data.language}_${data.country}`;
            mainNode.addChild(itme);
        }
    }

    setLang(target, data: string) {
        FrameSDK.setLan(data);
        this.LangNode.active = false;
        this.initBottomData();
    }

    showToast(msg: string) {
        this.Toast.active = true;
        this.Toast.stopAllActions();
        this.Toast.position = cc.v3(0, 0);
        this.Toast.opacity = 255;
        this.Toast.getComponentInChildren(cc.Label).string = msg;
        this.Toast.runAction(cc.sequence(cc.delayTime(0.5), cc.spawn(cc.moveBy(0.1, cc.v2(0, 200)), cc.fadeOut(0.1)), cc.callFunc(() => {
            this.Toast.active = false;
        })));

    }
}