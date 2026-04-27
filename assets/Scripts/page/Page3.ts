import { page3MockData } from '../mockData/page3MockData';
import { page2MockData } from '../mockData/page2MockData';
import PageBase from './PageBase';
import { GAME_NAME } from '../framework/SystemConfig';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class Page3 extends PageBase {
  @property(cc.Node)
  popLayer: cc.Node = null;
  @property(cc.Node)
  empty: cc.Node = null;
  @property(cc.Node)
  content: cc.Node = null;
  @property(cc.Node)
  item: cc.Node = null;
  @property(cc.Label)
  title: cc.Label = null;
  @property(cc.Label)
  detailDesLb: cc.Label = null;
  @property(cc.Node)
  detailItem: cc.Node = null;
  bookData = [];
  onLoad() {
    super.onLoad.call(this);
  }
  initEvent() {}
  onDestroy() {}
  initData() {}
  initUI() {
    var e = localStorage.getItem(GAME_NAME + "ids");
    if (e) {
      var t = JSON.parse(e),
        o = page2MockData.filter(function (e) {
          return t.includes(e.id);
        }),
        n = page3MockData.filter(function (e) {
          return t.includes(e.id);
        });
      this.bookData = [...o, ...n];
    }
    this.popLayer.active = false;
    this.content.removeAllChildren();
    this.empty.active = 0 === this.bookData.length;
    for (var a = 0; a < this.bookData.length; a++) {
      var i = cc.instantiate(this.item);
      i.parent = this.content;
      i.active = true;
      var l = this.bookData[a];
      i.name = "" + l.id;
      i.getChildByName("ly").getChildByName("labName").getComponent(cc.Label).string = l.name;
      i.getChildByName("ly").getChildByName("auth").getComponent(cc.Label).string = "【作者】：" + l.author;
      var p = Math.floor(30 * Math.random() + 70);
      i.getChildByName("labDesc").getComponent(cc.Label).string = "推荐值: " + p + "%";
      l.randomNum = p;
      cc.find("image_side/name", i).getComponent(cc.Label).string = l.name;
      cc.find("a_quanshu/lb", i).getComponent(cc.Label).string = "" + (a + 1);
      i.on("click", this.btnClick, this);
    }
  }
  setTitle(e) {
    this.title.string = e;
  }
  setTip() {}
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
    this.detailItem.getChildByName("labDesc").getComponent(cc.Label).string = "推荐值: " + t.randomNum + "%";
    cc.find("image_side/name", this.detailItem).getComponent(cc.Label).string = t.name;
    this.detailDesLb.string = t.desc;
  }
  deleteBook(e) {
    var t = e.target.parent.name,
      o = localStorage.getItem(GAME_NAME + "ids");
    o && (o = JSON.parse(o));
    o.splice(o.indexOf(t), 1);
    localStorage.setItem(GAME_NAME + "ids", JSON.stringify(o));
    this.initUI();
  }
}