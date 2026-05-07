import AudioManager from './framework/controller/AudioManager';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import { FailedType, VideoType } from './framework/enum/AllEnum';
import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import AdManager from './framework/Platform/AdManager';
import SdkHelper from './framework/SdkHelper';
import GlobalApp from './common/GlobalApp';
import { gameData } from './data/GameData';
import GameSystem from './system/GameSystem';
import BasePage from './view/BasePage';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class gameOverPage extends BasePage {
  @property(cc.Node)
  pages: cc.Node[] = [];
  @property(cc.Node)
  normalNodeList: cc.Node[] = [];
  @property(cc.Node)
  timeOutNodeList: cc.Node[] = [];

  failType = FailedType.Normal;
  curIndex = 0;
  nowIndex = 0;
  _onHide() {
    super._onHide.call(this);
  }
  _onShow() {
    super._onShow.call(this);
  }

  onLoad(): void {
    this._saveContent();
    this._createPeneLock();
    // this._createBlack();
    this._createContent();
    this._createTouchLock();
    this.registerBtnEvent(this.node);
  }

  async _init(e) {
    var t, o, n, a, i;
    this.curIndex = 0;
    this.pages[this.curIndex].active = true;
    this.pages[this.curIndex].scale = 1;
    SdkHelper.reportData("game_fail_page", {
      fail_type: e.type
    });
    AudioManager.getInstance().playMusic("gameOver");
    this.failType = e.type;
    // if (e.type == FailedType.TIME_OUT) {
    //   this.normalNodeList.forEach(function (e) {
    //     e.active = false;
    //   });
    //   this.timeOutNodeList.forEach(function (e) {
    //     e.active = true;
    //   });
     
    // } else {
    //   this.normalNodeList.forEach(function (e) {
    //     e.active = true;
    //   });
    //   this.timeOutNodeList.forEach(function (e) {
    //     e.active = false;
    //   });
      
    //   t = gameData.getMjListLength();
    //   o = GlobalApp.GameMain.cardGrid;
    //   n = 0;
    //   for (a = 0; a < o.length; a++) for (i = 0; i < o[a].length; i++) o[a][i] && n++;
    //   console.log("count", n, t);
    // }
    this.scheduleOnce(() => {
      this.openVideo();
    }, 1.5);
    // this.showNextPage();
    return;
  }
  showNextPage() {
    var e = this;
    this.curIndex > this.pages.length && (this.curIndex = 0);
    this.hideAllPages();
    this.pages[this.curIndex].active = true;
    this.pages[this.curIndex].scale = 0;
    0 == this.curIndex && this.scheduleOnce(function () {
      e.showNextPage();
    }, 2);
    this.playShowAnim(this.pages[this.curIndex]);
    this.curIndex++;
  }
  playShowAnim(e) {
    cc.tween(e).to(0.5, {
      scale: 1
    }, {
      easing: "backOut"
    }).start();
  }



  openVideo(e = 0) {
    var t = this;
    SdkHelper.reportData("fail_video_click", {
      fail_type: this.failType
    });
    var o = function o() {
      t._fadeOut();
      AdManager.getInstance().playVideoAd(function () {
        SdkHelper.reportData("fail_video_succ", {
          fail_type: t.failType
        });
        GameSystem.videoReward({
          video_type: VideoType.Revive,
          force_type: 0,
          is_over: true
        }).then(function () {
          t.close();
        });
      }, function () {
        SdkHelper.showForceToast(`gkey_314`);
        t._fadeIn();
        GameSystem.videoReward({
          video_type: VideoType.Revive,
          force_type: 0,
          is_over: false
        }).then(function () {});
      }, false);
    };
    if (PlayerDataSys.isOppoReviewer()) {
      EventMgr.trigger(GameEventType.PAGE_SHOW, {
        name: "lookAdPage",
        data: {
          okCb: function () {
            o();
          },
          cancelCb: function () {}
        }
      });
    } else {
      o();
    }
  }
  restartGame() {
    SdkHelper.reportData("not_place_revive", {
      fail_type: this.failType
    });
    EventMgr.trigger(GameEventType.RESTART_GAME);
    this.close();
  }
  hideAllPages() {
    this.pages.forEach(function (e) {
      e.active = false;
    });
  }
  close() {
    EventMgr.trigger(GameEventType.REBORN, this.failType);
    this._hide();
  }
}