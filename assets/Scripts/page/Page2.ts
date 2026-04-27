import { page3MockData } from '../mockData/page3MockData';
import PageBase from './PageBase';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class Page2 extends PageBase {
  @property(cc.Node)
  popLayer: cc.Node = null;
  @property(cc.Node)
  content: cc.Node = null;
  @property(cc.Node)
  item: cc.Node = null;
  @property(cc.Node)
  detailItem: cc.Node = null;
  @property(cc.Label)
  detailDesLb: cc.Label = null;
  @property(cc.Label)
  title: cc.Label = null;
  @property(cc.Label)
  tip: cc.Label = null;
  bookData = [];
  curBookData = null;
  onLoad() {
    this.initData();
    this.initUI();
  }
  initData() {
    this.bookData = this.getRandomBooks(page3MockData, 10);
  }
  getRandomBooks(e, t) {
    return [...e].sort(function () {
      return 0.5 - Math.random();
    }).slice(0, t);
  }
  initUI() {
    this.popLayer.active = false;
    this.content.removeAllChildren();
    for (var e = 0; e < 10; e++) {
      var t = cc.instantiate(this.item);
      t.parent = this.content;
      t.active = true;
      var o = this.bookData[e];
      t.getChildByName("ly").getChildByName("labName").getComponent(cc.Label).string = o.name;
      t.getChildByName("ly").getChildByName("auth").getComponent(cc.Label).string = "【作者】：" + o.author;
      var n = Math.floor(30 * Math.random() + 70);
      t.getChildByName("labDesc").getComponent(cc.Label).string = "推荐值: " + n + "%";
      o.randomNum = n;
      cc.find("image_side/name", t).getComponent(cc.Label).string = o.name;
      cc.find("a_quanshu/lb", t).getComponent(cc.Label).string = "" + (e + 1);
      t.name = "" + o.id;
      t.on("click", this.btnClick, this);
    }
  }
  setTip(e) {
    this.tip.string = e;
  }
  setTitle(e) {
    console.log("title", e);
    this.title.string = e;
  }
  btnClick(e) {
    var t = e.node.name;
    this.popLayer.active = true;
    this.initBookDetailUI(t);
  }
  closePop() {
    this.popLayer.active = false;
  }
  initBookDetailUI(e) {
    this.curSelectIndex = e;
    var t = this.bookData.find(function (t) {
      return t.id === e;
    });
    this.detailItem.getChildByName("ly").getChildByName("labName").getComponent(cc.Label).string = t.name;
    this.detailItem.getChildByName("ly").getChildByName("auth").getComponent(cc.Label).string = "【作者】：" + t.author;
    this.popLayer.getChildByName("sc").getComponent(cc.Toggle).isChecked = this.isCollected(e);
    this.detailItem.getChildByName("labDesc").getComponent(cc.Label).string = "推荐值: " + t.randomNum + "%";
    cc.find("image_side/name", this.detailItem).getComponent(cc.Label).string = t.name;
    this.detailDesLb.string = t.desc;
  }
}