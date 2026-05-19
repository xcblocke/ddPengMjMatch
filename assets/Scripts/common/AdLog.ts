import { IAdListenerLike } from "../center/p/NextlyAnyoneize";

export type AdLogAction = "click" | "fail" | "succeed";

/** 看激励视频统一日志：........................... ad click|fail|succeed */
export function logAd(action: AdLogAction) {
  console.log("........................... ad " + action);
}

export function wrapVideoAdListener(listener?: IAdListenerLike): IAdListenerLike | undefined {
  if (!listener) {
    return undefined;
  }
  return {
    onStart: listener.onStart,
    onEnd: listener.onEnd,
    onCancel: listener.onCancel,
    onClick: listener.onClick,
    onRevenue: listener.onRevenue,
    onResult: (result) => {
      if (result === 1) {
        logAd("succeed");
      } else if (result === -1) {
        logAd("fail");
      }
      listener.onResult && listener.onResult(result);
    }
  };
}
