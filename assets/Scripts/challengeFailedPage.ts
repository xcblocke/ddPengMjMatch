import PlayerDataSys from './framework/controller/PlayerDataSys';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import AdManager from './framework/Platform/AdManager';
import GameSystem from './system/GameSystem';
import BasePage, { AnimType } from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class challengeFailedPage extends BasePage {
  @property(cc.Label)
  tip: cc.Label = null;
  @property(cc.Node)
  boomIcon: cc.Node = null;
  @property(cc.Node)
  normalIcon: cc.Node = null;
  @property(cc.Node)
  obstacleIcon: cc.Node = null;
  @property(cc.Node)
  backBtn: cc.Node = null;
  @property(cc.Node)
  gainBtn: cc.Node = null;
  @property(cc.Node)
  timeOutIcon: cc.Node = null;
  @property(cc.Node)
  hongbao: cc.Node = null;
  @property(cc.Node)
  hongbao2: cc.Node = null;
  canClick = false;
  onLoad() {
    this._animInit({
      animType: AnimType.FADE,
      blackTime: 0.2,
      pageTime: 0.2
    });
    super.onLoad.call(this);
  }
  _init() {
    this._fadeIn();
    this.normalIcon.active = false;
    this.timeOutIcon.active = false;
    this.boomIcon.active = false;
    this.obstacleIcon.active = false;
    this.backBtn.active = false;
    this.gainBtn.active = false;
    this.obstacleIcon.children.forEach(function (e) {
      e.active = false;
    });
    this.hongbao.stopAllActions();
    this.hongbao.scale = 0;
    this.playAnim(this.hongbao);
    this.playAnim(this.hongbao2);
  }
  playAnim(e) {
    cc.tween(e).sequence(cc.tween().to(0.1, {
      scale: 1
    }), cc.tween().by(0.1, {
      angle: 3
    }), cc.tween().by(0.1, {
      angle: -3
    }), cc.tween().by(0.1, {
      angle: -3
    }), cc.tween().by(0.1, {
      angle: 3
    }), cc.tween().by(0.1, {
      angle: 1.5
    }), cc.tween().by(0.1, {
      angle: -1.5
    }), cc.tween().by(0.1, {
      angle: -1.5
    }), cc.tween().by(0.1, {
      angle: 1.5
    }), cc.tween().by(0.1, {
      angle: 1
    }), cc.tween().by(0.1, {
      angle: -1
    }), cc.tween().by(0.1, {
      angle: -1
    }), cc.tween().by(0.1, {
      angle: 1
    }), cc.tween().delay(3), cc.tween().to(0.1, {
      scale: 0
    }), cc.tween().delay(10)).repeatForever().start();
  }
  close() {
    super._hide.call(this);
  }
  gotoAd() {
    var e = this;
    if (this.canClick) {
      var t = function t() {
        e._fadeOut();
        AdManager.getInstance().playVideoAd(e.succFunc.bind(e), e.failFunc.bind(e));
      };
      if (PlayerDataSys.isOppoReviewer()) {
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
          name: "lookAdPage",
          data: {
            okCb: function () {
              t();
            },
            cancelCb: function () {
              e.canClick = true;
            }
          }
        });
      } else {
        t();
      }
    }
  }
  failFunc() {
    this.succFunc(false);
  }
  succFunc(e = true) {
    var t = this;
    GameSystem.videoReward({
      video_type: 7,
      force_type: 0,
      is_over: e
    }).then(function () {
      t.close();
      EventMgr.trigger(GameEventType.REBORN, {
        type: null
      });
    });
  }
  againGame() {
    EventMgr.trigger(GameEventType.RESTART_GAME, true);
    this.close();
  }
  _fadeIn() {
    super._fadeIn.call(this);
    this.canClick = true;
  }
  _fadeOut() {
    super._fadeOut.call(this);
    this.canClick = false;
  }
}