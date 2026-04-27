import { EAppThemeType, PageConfig } from '../config';
import PageBase from './PageBase';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class SceneA extends cc.Component {
  @property(cc.Node)
  pages: cc.Node = [];
  @property(cc.Node)
  nodeStory: cc.Node = null;
  @property(cc.Label)
  labStory: cc.Label = null;
  @property(cc.EditBox)
  page4Editbox: cc.EditBox = null;
  @property({
    type: cc.Enum(EAppThemeType)
  })
  currentAppTheme: number = EAppThemeType.Theme1;
  start() {
    this.initTip();
    this.initTitle();
    this.initBottomTab();
    this.setActiveTab(0);
  }
  initTitle() {
    var e = this;
    PageConfig.pageInfo.forEach(function (t, o) {
      e.pages[o].getComponent(PageBase).setTitle(t.title);
    });
  }
  initTip() {
    var e = this;
    PageConfig.pageInfo.forEach(function (t, o) {
      e.pages[o].getComponent(PageBase).setTip(t.tip);
    });
  }
  initBottomTab() {
    var e = cc.find("bottomTab/toggleContainer", this.node);
    e.children.forEach(function (e) {
      e.active = false;
    });
    PageConfig.bottomTab.forEach(function (t, o) {
      var n = e.children[o];
      cc.find("Background/label", n).getComponent(cc.Label).string = t.name;
      cc.find("checkmark/label", n).getComponent(cc.Label).string = t.name;
      n.active = true;
    });
  }
  onToggle(e, t) {
    this.setActiveTab(Number(t));
  }
  setActiveTab(e) {
    this.pages.forEach(function (t, o) {
      t.active = o == e;
    });
    this.pages[e].getComponent(PageBase).initUI();
  }
}