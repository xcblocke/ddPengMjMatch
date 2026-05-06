import GlobalApp from '../../common/GlobalApp';
import { gameData } from '../../data/GameData';
import PageMgr from '../../view/PageMgr';
import { RequestType } from '../../service/RequestType';
import Service from '../../service/Service';
import AudioManager from '../controller/AudioManager';
import AdManager from '../Platform/AdManager';
import EngineUtil from '../EngineUtil';
export var DebugType = {
  Button: "button",
  EditBox: "editBox",
  Toggle: "toggle",
  Slider: "slider",
  showText: "showText",
  Watch: "watch"
};
export var DebugProperty = {
  levelNum: 0,
  cardNum: 10,
  diamond: 0,
  activityNum: 0,
  cardId: 0,
  cardValue: 0,
  forceCount: 0,
  luckyCount: 0
};
export var DebugConfig = [{
  title: `gkey_277`,
  isOpen: false,
  children: [{
    title: `gkey_278`,
    type: DebugType.Button,
    func: async function () {
      var e;
      e = EngineUtil.getLocalData("yid");
      await Service.commonApiPost(RequestType.create_new_user, {
        user_id: e.split("_")[0]
      });
      PageMgr.clear();
      EngineUtil.setLocalData("yid", "");
      AudioManager.getInstance().stopMusic("bg", true);
      cc.game.restart();
      return;
    }
  }]
}, {
  title: `gkey_279`,
  isOpen: false,
  children: [{
    title: "jump to",
    type: DebugType.Button,
    func: function () {
      GlobalApp.GameMain.passClick();
    }
  }, {
    title: `gkey_280`,
    type: DebugType.Button,
    func: function (e) {
      AdManager.getInstance().noAdTest = !AdManager.getInstance().noAdTest;
      var t = AdManager.getInstance().noAdTest;
      e.btnLabel.string = t ? `gkey_281` : `gkey_282`;
    },
    params: {
      btnLabel: `gkey_282`
    }
  }, {
    title: `gkey_283`,
    type: DebugType.Watch,
    params: {
      watchValue: function () {
        return EngineUtil.formatTime(gameData.gameTime);
      }
    }
  }, {
    title: `gkey_284`,
    type: DebugType.Button,
    func: function () {}
  }, {
    title: `gkey_285`,
    type: DebugType.EditBox,
    func: function (e, t) {
      DebugProperty.levelNum = +t;
    }
  }, {
    title: `gkey_286`,
    type: DebugType.Button,
    func: async function () {
      await Service.commonApiPost(RequestType.setLevel, {
        level_id: DebugProperty.levelNum
      });
      return;
    }
  }]
}, {
  title: `gkey_287`,
  isOpen: false,
  children: []
}];