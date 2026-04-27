import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import EngineUtil from './framework/EngineUtil';
import GlobalApp from './common/GlobalApp';
import { gameData, GameState } from './data/GameData';
import PageMgr from './view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
enum s {
  LevelProgress = 1,
  LevelProgress2 = 2,
  ActiveProgress = 3,
  Card = 3,
  None = 0,
}
cc.color().fromHEX("#FF4012");
cc.color().fromHEX("#FFD800");
@ccclass
export class LevelBorardGrp extends cc.Component {
  @property([cc.Node])
  stateNodes: Array<cc.Node> = [];
  @property(cc.Node)
  itemNode: cc.Node = null;
  @property(cc.Label)
  levelLabel: cc.Label = null;
  @property(cc.SpriteFrame)
  bubbleSps: cc.SpriteFrame = [];
  oldScore = 0;
  nowTween = null;
  step2Timer = 0;
  onLoad() {
    EventMgr.listen(GameEventType.UPDATE_GRADING_NUM, this.updateGreetingCardNum, this);
    EventMgr.listen(GameEventType.UPDATE_ACTIVITY_NUM, this.updateActivityNum, this);
  }
  updateState() {
    this.showLevel();
    this.stateNodes.forEach(function (e) {
      e.active = false;
    });
    this.levelLabel.string = "" + gameData.gameLevel;
    if (!gameData.isOpenDemo) {
      var e = gameData.process_info.step;
      this.stateNodes[e - 1].active = true;
      console.log("step", e);
      switch (e) {
        case 1:
          this.initState1();
          break;
        case 2:
          this.initState2();
          break;
        case 3:
          this.initState3();
          break;
        case 4:
          this.initState4();
      }
    }
  }
  initState1() {
    var e = gameData.process_info.level_reward_list;
    this.stateNodes[0].getChildByName("content").removeAllChildren();
    for (var t = 0; t < e.length; t++) {
      var o = cc.instantiate(this.itemNode);
      o.active = true;
      o.y = 0;
      this.stateNodes[0].getChildByName("content").addChild(o);
      this.initItem(e[t], o, t == e.length - 1, e[t + 1]);
    }
  }
  initState2() {
    var e = gameData.process_info.level_reward_list;
    this.stateNodes[1].getChildByName("content").removeAllChildren();
    for (var t = 0; t < e.length; t++) {
      var o = cc.instantiate(this.itemNode);
      o.active = true;
      o.y = 0;
      this.stateNodes[1].getChildByName("content").addChild(o);
      this.initItem(e[t], o, t == e.length - 1, e[t + 1]);
    }
  }
  initState3() {
    var e = this.stateNodes[2].getChildByPath("progressBg/progressBar"),
      t = this.stateNodes[2].getChildByPath("progressBg/num"),
      o = this.stateNodes[2].getChildByPath("energy_wheel2/num");
    0 == this.oldScore && (this.oldScore = gameData.process_info.num);
    var n = this.oldScore + "/" + gameData.process_info.target_num;
    e.getComponent(cc.Sprite).fillRange = this.oldScore / gameData.process_info.target_num;
    t.getComponent(cc.Label).string = "" + n;
    o.getComponent(cc.Label).string = "" + gameData.process_info.target_num;
  }
  initState4() {
    var e = this.stateNodes[3].getChildByPath("progressBg/progressBar"),
      t = this.stateNodes[3].getChildByPath("progressBg/proNum"),
      o = Number((gameData.process_info.num / gameData.process_info.target_num * 100).toFixed(2));
    e.getComponent(cc.Sprite).fillRange = gameData.process_info.num / gameData.process_info.target_num;
    console.log("pro", o);
    t.getComponent(cc.Label).string = o + "%";
  }
  initItem(e, t, o, n) {
    var a = t.getChildByPath("progressBar"),
      i = t.getChildByPath("grayIcon"),
      r = t.getChildByPath("greenIcon"),
      c = i.getChildByPath("ly/level"),
      s = r.getChildByPath("ly/level"),
      l = t.getChildByPath("grayBubble"),
      u = t.getChildByPath("hasMoreContent"),
      p = u.getChildByPath("redBubblePlaceholder/redBubble"),
      d = u.getChildByPath("yellowBubble"),
      h = p.getChildByPath("lb"),
      g = d.getChildByPath("lb"),
      _ = t.getChildByPath("light"),
      y = t.getChildByPath("progressBar/mask"),
      m = t.getChildByPath("progressBar/mask/arrow");
    h.getComponent(cc.Label).string = "" + e.desc;
    c.getComponent(cc.Label).string = "" + e.level;
    s.getComponent(cc.Label).string = "" + e.level;
    var v = this.hasSmallTurn(),
      b = gameData.gameLevel > e.level,
      w = gameData.gameLevel >= e.level;
    r.active = w;
    i.active = !w;
    l.active = b;
    u.active = !b;
    _.active = o && gameData.gameLevel == e.level;
    a.active = !o;
    if (!o) {
      var S = (gameData.gameLevel - e.level) / (n.level - e.level);
      a.getComponent(cc.Sprite).fillRange = S;
      y.width = 60 * S;
      m.active = gameData.gameLevel >= e.level && gameData.gameLevel < n.level;
    }
    if (v && e.level == gameData.gameLevel) {
      d.active = gameData.turnId > 1;
      g.getComponent(cc.Label).string = "" + this.getRoundDes();
    } else d.active = false;
  }
  hasSmallTurn() {
    return gameData.turnMax > 1;
  }
  getRoundDes() {
    var e = (1 == gameData.turnId ? "" : gameData.turnId + "/" + gameData.turnMax + "局") + " " + (1 == gameData.roundId ? "" : gameData.roundId + "/" + gameData.roundMax + "轮");
    return e.replace(/\s+$/, "");
  }
  setBubbleDes() {}
  hideLevel() {
    this.levelLabel.node.parent.children.forEach(function (e) {
      e.active = false;
    });
  }
  showLevel() {
    this.levelLabel.node.parent.children.forEach(function (e) {
      e.active = true;
    });
    this.node.active = true;
  }
  setProgressAnime(e, t, o = 0.2) {
    var n;
    null === (n = this.nowTween) || void 0 === n || n.stop();
    this.nowTween = cc.tween(e).to(0.2, {
      fillRange: t
    }).start();
  }
  async flyActivityNum() {
    var e,
      t,
      o,
      n,
      a,
      i,
      r,
      s,
      l = this;
    e = this.stateNodes[2].getChildByPath("progressBg/num").getComponent(cc.Label);
    t = this.stateNodes[2].getChildByPath("energy_wheel");
    o = this.stateNodes[2].getChildByPath("progressBg/progressBar").getComponent(cc.Sprite);
    n = this.oldScore;
    if (0 == (a = gameData.activityNum - n)) {
      return;
    }
    console.log("diff", a, n);
    if (4 == gameData.process_info.step) {
      o.fillRange = 1;
      e.string = "5000";
      gameData.process_info.step = 4;
      gameData.process_info.num = 0;
      gameData.process_info.target_num = 12;
      this.updateState();
      return;
    }
    this.oldScore = gameData.activityNum;
    i = function i(i) {
      var c = cc.instantiate(t);
      c.scale = 2;
      c.angle = 0;
      c.parent = r.stateNodes[2];
      c.worldPosition = GlobalApp.GameMain.mainBtnGroupCtrl.activeBtn.worldPosition;
      var s = c.worldPosition.add(cc.v3(150 * Math.random() - 75, 150 * Math.random() - 75, 0));
      cc.tween(c).to(0.2, {
        worldPosition: s
      }).delay(0.05 * i).to(0.35, {
        worldPosition: t.worldPosition,
        angle: -15,
        scale: 1.7
      }).call(function () {
        if (1 == i) {
          l.setProgressAnime(o, gameData.process_info.num / gameData.process_info.target_num, 0.5);
          cc.tween(e.node).to(0.05, {
            scale: 1.2
          }).to(0.05, {
            scale: 1.3
          }).union().repeat(5).to(0.1, {
            scale: 1
          }).call(function () {
            console.log("gameData.activityNum >= gameData.process_info.target_num", gameData.activityNum, gameData.process_info.target_num);
            gameData.activityNum >= gameData.process_info.target_num && GlobalApp.PackagingProcessGuide.activityTipProcess();
          }).start();
          EngineUtil.showNumTween(0.5, function (t) {
            var o = Math.floor(n + a * t);
            e.string = o + "/" + gameData.process_info.target_num;
          });
        }
      }).to(0.1, {
        scale: 0
      }).call(function () {
        c.destroy();
      }).start();
    };
    r = this;
    for (s = 0; s < 8; s++) i(s);
    return;
  }
  updateActivityNum() {
    var e = this.stateNodes[2].getChildByPath("progressBg/progressBar"),
      t = this.stateNodes[2].getChildByPath("progressBg/num"),
      o = Number((gameData.activityNum / gameData.process_info.target_num * 100).toFixed(2));
    e.getComponent(cc.Sprite).fillRange = o;
    t.getComponent(cc.Label).string = 100 * o + "%";
  }
  updateGreetingCardNum() {
    this.initState4();
  }
  update(e) {
    if (gameData.process_info && 3 == gameData.process_info.step && gameData.gameState == GameState.gameing && !PageMgr.isHasShowPage()) {
      this.step2Timer -= e;
      if (this.step2Timer <= 0) {
        this.flyActivityNum();
        this.step2Timer = 0.6;
      }
    } else this.step2Timer = 0.6;
  }
}