import { Res } from './common/ResourcesManager';
import { gameData } from './data/GameData';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class competeEffect extends cc.Component {
  @property(cc.Sprite)
  sps: cc.Sprite = [];
  initSp(e) {
    var t;
    t = gameData.isOpenDemo && gameData.debugData.isOpenMingma ? "n_" + e : "tile_" + e;
    var o = Res.getIconSpriteFrame(t);
    this.sps.forEach(function (e) {
      e.spriteFrame = o || null;
    });
  }
}