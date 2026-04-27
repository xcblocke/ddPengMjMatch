class _gameNodePool {
  star_box = null;
  star_box_pool = new cc.NodePool();
  score_bomb = null;
  score_bomb_pool = new cc.NodePool();
  red_bomb = null;
  red_bomb_pool = new cc.NodePool();
  bomb_box = null;
  bomb_box_pool = new cc.NodePool();
  numLabel = null;
  numLabel_pool = new cc.NodePool();
  static _instance = null;
  static getInstance() {
    this._instance || (this._instance = new _gameNodePool());
    return this._instance;
  }
  init_star_box(e) {
    this.star_box = e;
  }
  get_star_box() {
    var e = this.star_box_pool.get();
    e || (e = cc.instantiate(this.star_box));
    e.scale = 1;
    return e;
  }
  put_star_box(e) {
    e && this.star_box_pool.put(e);
  }
  init_score_bomb(e) {
    this.score_bomb = e;
  }
  get_score_bomb() {
    var e = this.score_bomb_pool.get();
    e || (e = cc.instantiate(this.score_bomb));
    return e;
  }
  put_score_bomb(e) {
    e && this.score_bomb_pool.put(e);
  }
  init_red_bomb(e) {
    this.red_bomb = e;
  }
  get_red_bomb() {
    var e = this.red_bomb_pool.get();
    e || (e = cc.instantiate(this.red_bomb));
    return e;
  }
  put_red_bomb(e) {
    e && this.red_bomb_pool.put(e);
  }
  clear() {
    this.star_box_pool.clear();
  }
  init_bomb_box(e) {
    this.bomb_box = e;
  }
  get_bomb_box() {
    var e = this.bomb_box_pool.get();
    e || (e = cc.instantiate(this.bomb_box));
    return e;
  }
  put_bomb_box(e) {
    e && this.bomb_box_pool.put(e);
  }
  init_numLabel_pool(e) {
    this.numLabel = e;
  }
  get_number() {
    var e = this.numLabel_pool.get();
    e || (e = cc.instantiate(this.numLabel));
    return e;
  }
  put_number(e) {
    e && this.numLabel_pool.put(e);
  }
}
export default _gameNodePool.getInstance();