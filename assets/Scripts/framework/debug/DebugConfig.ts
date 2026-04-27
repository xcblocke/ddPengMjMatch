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
  title: "删除用户",
  isOpen: false,
  children: [{
    title: "确认删除",
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
  title: "基础测试",
  isOpen: false,
  children: [{
    title: "跳关",
    type: DebugType.Button,
    func: function () {
      GlobalApp.GameMain.passClick();
    }
  }, {
    title: "广告开关",
    type: DebugType.Button,
    func: function (e) {
      AdManager.getInstance().noAdTest = !AdManager.getInstance().noAdTest;
      var t = AdManager.getInstance().noAdTest;
      e.btnLabel.string = t ? "广告已关" : "广告已开";
    },
    params: {
      btnLabel: "广告已开"
    }
  }, {
    title: "对局时间",
    type: DebugType.Watch,
    params: {
      watchValue: function () {
        return EngineUtil.formatTime(gameData.gameTime);
      }
    }
  }, {
    title: "重开游戏",
    type: DebugType.Button,
    func: function () {}
  }, {
    title: "跳指定关文本",
    type: DebugType.EditBox,
    func: function (e, t) {
      DebugProperty.levelNum = +t;
    }
  }, {
    title: "跳指定关",
    type: DebugType.Button,
    func: async function () {
      await Service.commonApiPost(RequestType.setLevel, {
        level_id: DebugProperty.levelNum
      });
      return;
    }
  }]
}, {
  title: "页面展示",
  isOpen: false,
  children: []
}];