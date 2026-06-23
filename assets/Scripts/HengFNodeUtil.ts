import { gameEnterModel, GameEnterModel, hasTujianUnlockForLevel } from './config';
import { gameData } from './data/GameData';

const HENG_F_PREFAB_PATH = "pages/hengFNode";

let _cachedPrefab: cc.Prefab = null;
let _loadingPrefab: Promise<cc.Prefab | null> = null;
let _playingBanner = false;

function loadHengFPrefab(): Promise<cc.Prefab | null> {
  if (_cachedPrefab) {
    return Promise.resolve(_cachedPrefab);
  }
  if (_loadingPrefab) {
    return _loadingPrefab;
  }
  _loadingPrefab = new Promise((resolve) => {
    cc.resources.load(HENG_F_PREFAB_PATH, cc.Prefab, (err, prefab: cc.Prefab) => {
      _loadingPrefab = null;
      if (err || !prefab) {
        console.error("HengFNodeUtil: load hengFNode failed", err);
        resolve(null);
        return;
      }
      _cachedPrefab = prefab;
      resolve(_cachedPrefab);
    });
  });
  return _loadingPrefab;
}

export function preloadHengFNodePrefab(): void {
  if (gameEnterModel !== GameEnterModel.shenheModel) {
    return;
  }
  loadHengFPrefab();
}

export function shouldPlayHengFOnMahjongSpawnEnd(): boolean {
  if (gameEnterModel !== GameEnterModel.shenheModel) {
    return false;
  }
  const currentLevel = Math.floor(Number(gameData.gameLevel) || 1);
  return currentLevel !== 1 && hasTujianUnlockForLevel(currentLevel);
}

export function shouldPlayHengFOnLevelButton(waitLevelClick = false): boolean {
  if (waitLevelClick || gameEnterModel !== GameEnterModel.shenheModel) {
    return false;
  }
  const currentLevel = Math.floor(Number(gameData.gameLevel) || 1);
  return currentLevel === 1 && hasTujianUnlockForLevel(currentLevel);
}

export function playHengFNodeBanner(): Promise<void> {
  if (_playingBanner) {
    return Promise.resolve();
  }
  _playingBanner = true;

  return loadHengFPrefab().then((prefab) => {
    if (!prefab) {
      _playingBanner = false;
      return;
    }

    const parent = cc.find("Canvas/rootNode");
    if (!parent) {
      console.warn("HengFNodeUtil: Canvas/rootNode not found");
      _playingBanner = false;
      return;
    }

    return new Promise<void>((resolve) => {
      const node = cc.instantiate(prefab);
      node.parent = parent;
      node.zIndex = 9999;

      const nodeWidth = node.width || cc.winSize.width;
      const centerPos = cc.v2(0, 0);
      const rightOffPos = cc.v2(cc.winSize.width / 2 + nodeWidth / 2, 0);
      const leftOffPos = cc.v2(-(cc.winSize.width / 2 + nodeWidth / 2), 0);

      node.setPosition(rightOffPos);

      cc.tween(node)
        .to(0.24, { position: cc.v3(centerPos.x, centerPos.y, 0) })
        .delay(1.3)
        .to(0.24, { position: cc.v3(leftOffPos.x, leftOffPos.y, 0) })
        .call(() => {
          if (cc.isValid(node)) {
            node.destroy();
          }
          _playingBanner = false;
          resolve();
        })
        .start();
    });
  });
}

export function playHengFNodeBannerOnMahjongSpawnEnd(): Promise<void> {
  if (!shouldPlayHengFOnMahjongSpawnEnd()) {
    return Promise.resolve();
  }
  return playHengFNodeBanner();
}

export function playHengFNodeBannerOnLevelButton(waitLevelClick = false): Promise<void> {
  if (!shouldPlayHengFOnLevelButton(waitLevelClick)) {
    return Promise.resolve();
  }
  return playHengFNodeBanner();
}
