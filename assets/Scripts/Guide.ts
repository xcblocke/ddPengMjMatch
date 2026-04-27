const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class Guide extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Node)
  mask: cc.Node = null;
  @property(cc.Graphics)
  line: cc.Graphics = null;
  @property(cc.Label)
  desLabel: cc.Label = null;
  @property(cc.Node)
  node0: cc.Node = null;
  @property(cc.Node)
  node1: cc.Node = null;
  @property(cc.Node)
  border: cc.Node = null;
  @property(cc.Node)
  handNode: cc.Node = null;
  _index = 0;
  _infos = null;
  _path = null;
  _type = 0;
  _startIndex = 0;
  _scale_rate = 0;
}