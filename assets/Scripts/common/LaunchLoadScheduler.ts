/**
 * Loading 阶段调度：原生端分帧、限流，避免 decode/IO 挤占主线程导致掉帧、粒子停住。
 */
export default class LaunchLoadScheduler {
  private static _savedConcurrency = 0;
  private static _savedRequestsPerFrame = 0;
  private static _throttleApplied = false;

  /** 原生 APK 走分帧管线；Web / 模拟器保持并行 */
  static useStagedNativeLoad(): boolean {
    return cc.sys.isNative && !cc.sys.isBrowser;
  }

  static applyDownloadThrottle(): void {
    if (!LaunchLoadScheduler.useStagedNativeLoad()) return;
    var downloader = cc.assetManager.downloader;
    if (!downloader || LaunchLoadScheduler._throttleApplied) return;
    LaunchLoadScheduler._savedConcurrency = downloader.maxConcurrency;
    LaunchLoadScheduler._savedRequestsPerFrame = downloader.maxRequestsPerFrame;
    downloader.maxConcurrency = 4;
    downloader.maxRequestsPerFrame = 2;
    LaunchLoadScheduler._throttleApplied = true;
  }

  static restoreDownloadThrottle(): void {
    if (!LaunchLoadScheduler._throttleApplied) return;
    var downloader = cc.assetManager.downloader;
    if (downloader) {
      downloader.maxConcurrency = LaunchLoadScheduler._savedConcurrency;
      downloader.maxRequestsPerFrame = LaunchLoadScheduler._savedRequestsPerFrame;
    }
    LaunchLoadScheduler._throttleApplied = false;
  }

  /**
   * 让出主线程若干帧（粒子 / 进度条动画可继续跑）
   * @param frameCount 原生默认 2 帧，Web 为 0
   */
  static yieldFrames(frameCount?: number): Promise<void> {
    var n = frameCount;
    if (n == null) {
      n = LaunchLoadScheduler.useStagedNativeLoad() ? 2 : 0;
    }
    if (n <= 0) {
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      var left = n;
      var tick = function () {
        left--;
        if (left <= 0) {
          resolve();
        } else {
          setTimeout(tick, 16);
        }
      };
      setTimeout(tick, 16);
    });
  }
}
