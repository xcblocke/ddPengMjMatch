import GlobalApp from '../../common/GlobalApp';
import { gameData } from '../../data/GameData';
import PageMgr from '../../view/PageMgr';
import { RequestType } from '../../service/RequestType';
import Service from '../../service/Service';
import AudioManager from '../controller/AudioManager';
import AdManager from '../Platform/AdManager';
import EngineUtil from '../EngineUtil';
import EventMgr from '../Event/EventMgr';
import GameEventType from '../Event/GameEventType';
import SdkHelper from '../SdkHelper';
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

function readJumpLevelId(triggerItem) {
  var levelId = Math.floor(Number(DebugProperty.levelNum) || 0);
  if (levelId > 0) {
    return levelId;
  }
  if (!triggerItem || !triggerItem.node || !triggerItem.node.parent) {
    return 0;
  }
  var editBoxes = triggerItem.node.parent.getComponentsInChildren(cc.EditBox);
  for (var i = editBoxes.length - 1; i >= 0; i--) {
    levelId = Math.floor(Number(editBoxes[i].string) || 0);
    if (levelId > 0) {
      DebugProperty.levelNum = levelId;
      return levelId;
    }
  }
  return 0;
}
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
    func: async function (debugItem) {
      var levelId = readJumpLevelId(debugItem);
      if (!levelId) {
        SdkHelper.showToast("请输入关卡号");
        return;
      }
      console.log("[debug] jump to level:", levelId);
      var res = await Service.commonApiPost(RequestType.setLevel, {
        level_id: levelId
      });
      var jumpedLevel = res && res.data && res.data.game_level;
      if (!jumpedLevel) {
        SdkHelper.showToast(`未找到第 ${levelId} 关配置`);
        return;
      }
      if (jumpedLevel !== levelId) {
        SdkHelper.showToast(`已跳到第 ${jumpedLevel} 关`);
      }
      if (GlobalApp.GameMain) {
        GlobalApp.GameMain.closeGameEvent();
        GlobalApp.GameMain.clearGameUI();
        EventMgr.trigger(GameEventType.RESTART_GAME);
      }
      return;
    }
  }]
}, {
  title: `gkey_287`,
  isOpen: false,
  children: []
}];