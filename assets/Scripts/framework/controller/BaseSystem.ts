import ClientData from '../Event/ClientData';
import SdkHelper from '../SdkHelper';
import Service from '../../service/Service';
import EngineUtil from '../EngineUtil';
import PlayerDataSys from './PlayerDataSys';
export default class BaseSystem {
  static init() {
    var e = EngineUtil.getLocalData("yid");
    PlayerDataSys.initUserId({
      yid: e
    });
    var t = SdkHelper.getClientInfo();
    ClientData.init(t);
  }
  static getSystemConfig() {
    return Service.getSystemConfig();
  }
  static AutoLogin(e) {
    return Service.autoLogin(e);
  }
  static touristsLogin(e) {
    return Service.touristsLogin(e);
  }
  static wechatLogin(e) {
    return Service.wechatLogin(e);
  }
  static getUserInfo() {
    return Service.getUserInfo();
  }
  static getAbTestInfo() {
    return Service.getAbTestInfo();
  }
  static wechatBind(e) {
    return Service.wechatBind(e);
  }
  static setReco(e) {
    return Service.setReco(e);
  }
  static agreementForce(e) {
    return Service.agreementForce(e);
  }
}