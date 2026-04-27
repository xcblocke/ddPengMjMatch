import AudioManager from './framework/controller/AudioManager';
import HotUpdate from './framework/Event/HotUpdate';
import AdManager from './framework/Platform/AdManager';
import ClientData from './framework/Event/ClientData';
import SdkHelper from './framework/SdkHelper';
import EngineUtil from './framework/EngineUtil';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class aboutPage extends BasePage {
  @property(cc.Label)
  version: cc.Label = null;
  @property(cc.Label)
  hot_version: cc.Label = null;
  @property(cc.Label)
  channel: cc.Label = null;
  @property(cc.Sprite)
  icon: cc.Sprite = null;
  @property(cc.Node)
  icon2: cc.Node = null;
  hasImgAd = false;
  @property(cc.SpriteFrame)
  iconImgs: cc.SpriteFrame = [];
  _init(e) {
    this.hasImgAd = false;
    e && e.hasImgAd && (this.hasImgAd = e.hasImgAd);
    this.icon2.active = "xiaomi" == SdkHelper.getChannelName().toLowerCase();
  }
  onLoad() {
    super.onLoad.call(this);
    this._animInit({
      animType: AnimType.FADE,
      blackTime: 0.2,
      pageTime: 0.2
    });
    this.version.string = "ver:" + ClientData.version_name || "";
    this.hot_version.string = "res:" + HotUpdate.getInstance().getVersion();
    this.channel.string = ClientData.channel_name;
  }
  beianShow() {
    cc.sys.openURL("https://beian.miit.gov.cn/#/recordQuery");
  }
  close() {
    AudioManager.getInstance().playMusic("btntouch");
    EngineUtil.isLargeScreen();
    this.hasImgAd && AdManager.getInstance().showImgAd();
    super._hide.call(this);
  }
}