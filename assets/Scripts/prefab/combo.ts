import { gameConfig } from '../data/GameConfig';
import { gameData } from '../data/GameData';
import PageMgr from '../view/PageMgr';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class combo extends cc.Component {
  @property(cc.Label)
  tipLabel: cc.Label = null;
  @property(cc.Sprite)
  proBar: cc.Sprite = null;
  @property(sp.Skeleton)
  spine: sp.Skeleton = null;
  pauseTweens() {
    var e,
      t = cc.director && cc.director.getActionManager ? cc.director.getActionManager() : null;
    if (t) {
      (null === (e = this.tipLabel) || void 0 === e ? void 0 : e.node) && t.pauseTarget(this.tipLabel.node);
      this.proBar && t.pauseTarget(this.proBar);
    }
  }
  resumeTweens() {
    var e,
      t = cc.director && cc.director.getActionManager ? cc.director.getActionManager() : null;
    if (t) {
      (null === (e = this.tipLabel) || void 0 === e ? void 0 : e.node) && t.resumeTarget(this.tipLabel.node);
      this.proBar && t.resumeTarget(this.proBar);
    }
  }
  updateCombo() {
    var e = this;
    this.node.active = true;
    cc.Tween.stopAllByTarget(this.tipLabel.node);
    cc.Tween.stopAllByTarget(this.proBar);
    this.spine.node.active = true;
    this.spine.setAnimation(0, "start", false);
    this.tipLabel.string = "连击X" + gameData.comboCount;
    this.tipLabel.node.scale = 0.8;
    this.proBar.fillRange = 1;
    cc.tween(this.tipLabel.node).to(0.1, {
      scale: 1.2
    }, {
      easing: "backIn"
    }).to(0.1, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
    var t = this.getComboInterval();
    cc.tween(this.proBar).to(t, {
      fillRange: 0
    }).call(function () {
      e.node.active = false;
      gameData.comboCount = 0;
    }).start();
  }
  update() {
    if (PageMgr.isHasShowPage()) {
      this.pauseTweens();
    } else {
      this.resumeTweens();
    }
  }
  getComboInterval() {
    var e = gameConfig.comboConfig,
      t = e[1],
      o = e[2],
      n = e[3];
    return gameData.comboCount > t.count_min && gameData.comboCount < t.count_max ? t.time_limit : gameData.comboCount >= o.count_min && gameData.comboCount < o.count_max ? o.time_limit : n.time_limit;
  }
}