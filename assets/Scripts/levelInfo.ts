import EventMgr from './framework/Event/EventMgr';
import GameEventType from './framework/Event/GameEventType';
import { gameData } from './data/GameData';
import levelItem from './prefab/levelItem';
const {
  ccclass,
  property
} = cc._decorator;
var u = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25], [26, 27, 28, 29, 30], [31, 32, 33, 34, 35], [36, 37, 38, 39, 40], [41, 42, 43, 44, 45], [46, 47, 48, 49, 50], [51, 52, 53, 54, 55], [56, 57, 58, 59, 60], [61, 62, 63, 64, 65], [66, 67, 68, 69, 70], [71, 72, 73, 74, 75], [76, 77, 78, 79, 80], [81, 82, 83, 84, 85], [86, 87, 88, 89, 90], [91, 92, 93, 94, 95], [96, 97, 98, 99, 100], [101, 102, 103, 104, 105], [106, 107, 108, 109, 110], [111, 112, 113, 114, 115], [116, 117, 118, 119, 120], [121, 122, 123, 124, 125], [126, 127, 128, 129, 130], [131, 132, 133, 134, 135], [136, 137, 138, 139, 140], [141, 142, 143, 144, 145], [146, 147, 148, 149, 150], [151, 152, 153, 154, 155], [156, 157, 158, 159, 160], [161, 162, 163, 164, 165], [166, 167, 168, 169, 170], [171, 172, 173, 174, 175], [176, 177, 178, 179, 180], [181, 182, 183, 184, 185], [186, 187, 188, 189, 190]];
@ccclass
export default class levelInfo extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Node)
  content_node: cc.Node = null;
  @property(cc.Prefab)
  level_item: cc.Prefab = null;
  @property(cc.Label)
  levelLb: cc.Label = null;
  onEnable() {
    EventMgr.listen(GameEventType.UPDATE_LEVEL_INFO, this.updateLevel, this);
    this.updateLevel();
  }
  onDestroy() {
    EventMgr.ignore(GameEventType.UPDATE_LEVEL_INFO, this.updateLevel, this);
  }
  onLoad() {
    this.node.active = true;
    this.levelLb.node.active = true;
    this.bg.active = true;
    this.content_node.active = true;
  }
  updateLevel() {
    this.node.active = true;
    this.levelLb.node.active = true;
    this.bg.active = true;
    this.content_node.active = true;
    this.levelLb.string = `{"gkey_064":{"v1":"${gameData.lun_level}"}}`;
    for (var e = this.getShowLevelArr(gameData.gameLevel), t = 0; t < e.length; t++) if (this.content_node.childrenCount >= 5) this.content_node.children[t].getComponent(levelItem).init({
      num: e[t],
      is_last: t == e.length - 1
    });else {
      var o = cc.instantiate(this.level_item);
      o.getComponent(levelItem).init({
        num: e[t],
        is_last: t == e.length - 1
      });
      o.parent = this.content_node;
    }
  }
  getArrayByLevel(e) {
    var t = 0;
    t = Math.ceil(e / 5) - 1;
    t = Math.min(t, u.length - 1);
    t = Math.max(t, 0);
    return u[t];
  }
  getShowLevelArr(e) {
    var t = Math.ceil(e / 5);
    return [5 * t - 4, 5 * t - 3, 5 * t - 2, 5 * t - 1, 5 * t];
  }
}