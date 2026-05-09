import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import RDM_Level from "./RDM_Level";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BottomTips extends cc.Component {

    @property(cc.Sprite)
    bar: cc.Sprite = null;

    @property(cc.Label)
    barText: cc.Label = null;

    @property(cc.RichText)
    text: cc.RichText = null;

    coinstr = "";

    onLoad() {
        this.node.opacity = 0;
        this.coinstr = FrameSDK.convertCoinToStr(FrameData.credit);
    };

    onEnable() {
        this.updateCardUI();
    };

    getData() {
        for (let i = 0; i < FrameData.FRAME_CONF.CoinConf.length; i++) {
            let data = RDM_Level.getData(FrameData.FRAME_CONF.CoinConf[i].rdm_id);
            if (data.status <= 2) {
                return data;
            }
        }
        return null;
    }

    updateCardUI() {
        this.node.opacity = 0;
        let data = this.getData();

        if (data) {
            this.node.opacity = 255;
            let str = "skey_033";
            let barStr = `${FrameSDK.convertCoinToStr(Math.min(data.now, data.total))} / ${FrameSDK.convertCoinToStr(data.total)}`;

            if (data.now < data.total) {
                if (data.status == 1) {
                    str = `skey_031??&value1==<color= #F04F24>${(data.total - data.now)}</c>`;
                    barStr = `LV.${data.now}/LV.${data.total}`;
                } else if (data.status == 2) {
                    str = `skey_032??&value1==<color= #F04F24>${FrameSDK.convertCoinToStr(data.total - data.now)}</c>`;
                }
            }

            this.text.string = str;
            this.bar.fillRange = data.now / data.total;
            this.barText.string = barStr;
        }
    };

}
