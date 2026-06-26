import EventMgr from '../framework/Event/EventMgr';
import GameEventType from '../framework/Event/GameEventType';
import EngineUtil from '../framework/EngineUtil';

const VIDEO_TIPS_CONFIRMED_KEY = "video_tips_confirmed";

let pendingConfirm: (() => void) | null = null;
let pendingCancel: (() => void) | null = null;

export default class VideoTipsHelper {
  static hasConfirmed() {
    return !!EngineUtil.getLocalData(VIDEO_TIPS_CONFIRMED_KEY);
  }
  static markConfirmed() {
    EngineUtil.setLocalData(VIDEO_TIPS_CONFIRMED_KEY, "1");
  }
  static requestWithTips(onConfirm: () => void, onCancel?: () => void, skipTips = false) {
    if (skipTips || VideoTipsHelper.hasConfirmed()) {
      onConfirm();
      return;
    }
    pendingConfirm = onConfirm;
    pendingCancel = onCancel || null;
    EventMgr.trigger(GameEventType.PAGE_SHOW, {
      name: "viduoTipsPage",
      data: {}
    });
  }
  static onConfirm() {
    VideoTipsHelper.markConfirmed();
    var e = pendingConfirm;
    pendingConfirm = null;
    pendingCancel = null;
    e && e();
  }
  static onCancel() {
    var e = pendingCancel;
    pendingConfirm = null;
    pendingCancel = null;
    e && e();
  }
}
