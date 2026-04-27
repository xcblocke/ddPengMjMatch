import gameNodePool from './gameNodePool';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class poolMgr extends cc.Component {
  @property({
    type: cc.Prefab,
    tooltip: "星星预制件"
  })
  star_box: cc.Prefab = null;
  @property({
    tooltip: "星星预制件数量"
  })
  star_boxNum = 100;
  @property({
    type: cc.Prefab,
    tooltip: "红包预制件"
  })
  red_box: cc.Prefab = null;
  @property({
    tooltip: "红包预制件数量"
  })
  red_boxNum = 20;
  @property({
    type: cc.Prefab,
    tooltip: "星星特效"
  })
  score_bomb: cc.Prefab = null;
  @property({
    tooltip: "星星特效数量"
  })
  score_bombNum = 15;
  @property({
    type: cc.Prefab,
    tooltip: "爆炸块"
  })
  bomb_box: cc.Prefab = null;
  @property({
    tooltip: "爆炸预制件数量",
    range: [5, 25]
  })
  bomb_boxNum = 20;
  @property({
    type: cc.Prefab,
    tooltip: "数字"
  })
  number_label: cc.Prefab = null;
  @property({
    tooltip: "数字数量",
    range: [3, 10]
  })
  number_labelNum = 5;
  onLoad() {
    gameNodePool.init_star_box(this.star_box);
    for (var e = 0; e < this.star_boxNum; e++) {
      var t = cc.instantiate(this.star_box);
      gameNodePool.star_box_pool.put(t);
    }
    gameNodePool.init_score_bomb(this.score_bomb);
    for (e = 0; e < this.score_bombNum; e++) {
      var o = cc.instantiate(this.score_bomb);
      gameNodePool.score_bomb_pool.put(o);
    }
    gameNodePool.init_red_bomb(this.red_box);
    for (e = 0; e < this.red_boxNum; e++) {
      o = cc.instantiate(this.red_box);
      gameNodePool.red_bomb_pool.put(o);
    }
    gameNodePool.init_bomb_box(this.bomb_box);
    for (e = 0; e < this.bomb_boxNum; e++) {
      o = cc.instantiate(this.bomb_box);
      gameNodePool.bomb_box_pool.put(o);
    }
    gameNodePool.init_numLabel_pool(this.number_label);
    for (e = 0; e < this.number_labelNum; e++) {
      var n = cc.instantiate(this.number_label);
      gameNodePool.numLabel_pool.put(n);
    }
  }
  onDestroy() {
    gameNodePool.clear();
  }
}