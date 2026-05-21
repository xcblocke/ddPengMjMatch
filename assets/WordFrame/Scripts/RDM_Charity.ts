import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import PaymentItem from "./PaymentItem";
import RDM_CharityItem from "./RDM_CharityItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RDM_Charity extends cc.Component {

    @property(cc.Node)
    top: cc.Node = null;

    @property(cc.Label)
    lbl_gCoin: cc.Label = null;
    @property(cc.RichText)
    lbl_gCa: cc.RichText = null;
    @property(cc.Label)
    accountLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    numberLabel: cc.Label = null;

    @property(cc.Label)
    peopleLabel: cc.Label = null;

    @property(cc.Node)
    paymentRootNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property([cc.Node])
    stepNodes: cc.Node[] = [];

    @property(cc.Node)
    guide: cc.Node = null;

    coin: string = "0";
    guideInedx: number = 0;

    protected onLoad(): void {
        cc.director.on("REFRESH_INFO", this.updateUI, this);

        this.updateUI();

        this.guide.active = false;
        if (FrameData.saveData.charityGuideIndex <= 1) {
            FrameData.saveData.charityGuideIndex = 2;
            this.scheduleOnce(() => {
                this.openGuide();
            },0);
        }

        this.scheduleOnce(() => {
            this.scrollview.node.height = this.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
        });

        FrameSDK.playEffect("show_rd")
        // this.top.on(cc.Node.EventType.TOUCH_END, () => {
        //     GM.open();
        // }, this);
        let account = FrameData.saveData.account;
        if (account && account != "") {
            this.accountLabel.node.parent.active = true;
            this.accountLabel.string = `clok_015${account}`;
        }else{
            this.accountLabel.node.parent.active = false;
        }
    }

    openAccount(){
        let  conf = FrameData.FRAME_CONF.CharityConf[0];
        FrameData.FRAME_CONF.CharityConf.forEach((value, i) => {
            let data = RDM_Charity.getData(value.rdm_id);
            if(data.status < 3 && data.now >= data.total){
                return conf = value;
            }
        });

        FrameSDK.openWindow("Panel_Account",{
            numStr: FrameSDK.convertCharityToStr(conf.reward, true),
            closeCB: ()=>{
                // cc.director.emit("REFRESH_INFO");
            },
        });
    }
    protected onDestroy(): void {
        cc.director.removeAll(this);
        FrameSDK.notifyTutorialStateChanged();
    }

    updateUI() {
        this.coin = FrameSDK.convertCharityToStr(FrameData.charityCredit);
        this.lbl_gCoin.string = this.coin;

        this.timeLabel.string = `skey_089??&value1==${FrameData.saveData.charityDonateTime}`;
        this.numberLabel.string = `${FrameSDK.formatNumber(FrameData.saveData.charityDonated, 0, 1)}`;
        this.peopleLabel.string = `skey_090??&value1==${Math.floor(FrameData.saveData.charityDonated / FrameData.getCoinOutNum('charityPerPeople'))}`;

        const paymentIDs = FrameData.CountryConf.cash_id.slice(0, 4);
        this.paymentRootNode.children.forEach((node, index) => node.getComponent(PaymentItem).paymentID = paymentIDs[index] ?? 0);

        FrameData.FRAME_CONF.CharityConf.forEach((value, i) => {
            let itme = this.scrollview.content.children[i] ?? cc.instantiate(this.scrollview.content.children[0]);
            itme.getComponentInChildren(RDM_CharityItem).init(value);
            itme.parent = this.scrollview.content;
        });

        const rate = FrameData.FRAME_CONF.RedeemRateConfig[0];
            this.lbl_gCa.string = `<outline color= #C70070 width=2>${FrameSDK.convertCoinToStr(rate)}</outline><color= #8AFF77><outline color= #427F04 width=2>≈${FrameSDK.convertCoinToStr(rate, true)}</outline></c>`;
    }

    static getData(id: number): { status: number, now: number, total: number, tips: string, isCharity: boolean } {
        let conf = FrameData.getCharityConf(id);
        let status = FrameData.getCharityExchangeStatus(id);
        let rdata: any = {};
        if (status == 1) {
            rdata = {
                now: Math.min(FrameData.saveData.credit.greenCoin, conf.rdm_1),
                total: conf.rdm_1,
                tips: `skey_091??&value1==<color= #DF4704>${FrameSDK.convertCharityToStr(conf.rdm_1)}</c>`
            };
        } else if (status == 2) {
            rdata = {
                now: Math.min(FrameSDK.frameData.gameData.passLevel, conf.rdm_2),
                total: conf.rdm_2,
                tips: `skey_053??&value1==<color= #DF4704>${conf.rdm_2}</c>&value2==<color= #009D12>${FrameSDK.convertCharityToStr(conf.reward, true)}</c>`
            };
        }
        rdata["status"] = status;
        rdata["isCharity"] = true;
        return rdata;
    }

    onBtnEvent(target, data: string) {
        if (data == "0") {
            this.node.destroy();
        } else if (data == "3") {
            this.guideInedx++;
            this.openGuide();
        }
    }

    openGuide() {
        this.guide.active = true;
        this.guide.children.forEach(value => {
                value.active = false;
            }
        );
        let mask = cc.find("mask", this.guide).getComponent(cc.Mask);
        mask.node.active = true;
        if (this.guideInedx == 0) {
            cc.find("tips1", this.guide).active = true;
            mask.spriteFrame = this.stepNodes[0].getComponent(cc.Sprite).spriteFrame;//FrameSDK.getNodeTexture(cc.find("node_list2", this.node));
            mask.node.setContentSize(this.stepNodes[0].getContentSize())
            mask.node.position = cc.v3(0, cc.find("node_list2", this.node).position.y);
            cc.tween(cc.find("tips1/hand", this.guide)).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (this.guideInedx == 1) {
            cc.find("tips2", this.guide).active = true;
            let data = RDM_Charity.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            // mask.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
            cc.find("tips2/label", this.guide).getComponent(cc.Label).string = `skey_109??&value1==${data.total}`;
            // mask.node.position.y = this.safeAreaData.height;

            mask.spriteFrame = this.stepNodes[1].getComponent(cc.Sprite).spriteFrame;//FrameSDK.getNodeTexture(cc.find("node_list2", this.node));
            mask.node.setContentSize(this.stepNodes[1].getContentSize())

            let itemNode = this.scrollview.content.getChildByName("item");
            let posInA = this.node.convertToNodeSpaceAR(itemNode.convertToWorldSpaceAR(cc.v2(0, 0)));
            mask.node.position = cc.v3(0, posInA.y);

            cc.tween(cc.find("tips2/hand", this.guide)).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
        } else if (this.guideInedx == 2) {
            cc.find("tips3", this.guide).active = true;
            let data = RDM_Charity.getData(FrameData.FRAME_CONF.CoinConf[0].rdm_id);
            cc.find("tips3/label", this.guide).getComponent(cc.Label).string = `skey_110??&value1==${data.total}`;
            cc.tween(cc.find("tips3/hand", this.guide)).by(0.5, {x: 50, y: -50}).by(0.5, {
                x: -50,
                y: 50
            }).union().repeatForever().start();
            // mask.node.position.y = this.safeAreaData.height;
            // mask.spriteFrame = FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
            mask.spriteFrame = this.stepNodes[2].getComponent(cc.Sprite).spriteFrame;//FrameSDK.getNodeTexture(cc.find("node_list2", this.node));
            mask.node.setContentSize(this.stepNodes[2].getContentSize())

            mask.node.position = cc.find("btn_close", this.node).position;

        } else if (this.guideInedx == 3) {
            this.guide.active = false;
            this.node.destroy();
            cc.director.emit("CHARITY_GUIDE_FINISH");
            FrameSDK.notifyTutorialStateChanged();
        }
    }
}
