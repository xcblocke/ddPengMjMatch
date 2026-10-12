import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import SdkHelper from './framework/SdkHelper';
import { CUSTOMER_SERVICE } from './framework/SystemConfig';
import EngineUtil from './framework/EngineUtil';
import BasePage from './view/BasePage';
import PageMgr from './view/PageMgr';
import ClientData from './framework/Event/ClientData';
import UrlMgr from './service/UrlMgr';
import { PropType } from './framework/enum/AllEnum';

const {
  ccclass,
  property
} = cc._decorator;




@ccclass
export default class signUpItem extends cc.Component {
  
}