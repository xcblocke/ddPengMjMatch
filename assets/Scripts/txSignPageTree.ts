const {
  ccclass,
  menu
} = cc._decorator;
@ccclass
@menu("节点树/txSignPageTree")
export default class txSignPageTree extends cc.Component {
  isLoaded = false;
  static URL = "db://assets/resources/pages/txSignPage.prefab";
  getNodeByPath(e, t) {
    return cc.find(e, t || this.node);
  }
  onLoad() {
    if (!this.isLoaded) {
      this.isLoaded = true;
      this.txSignPage = this.node;
      this.signDay = this.node.getChildByName("compsignDay_RichText").getComponent(cc.RichText);
      this.TitleTips = this.getNodeByPath("titleBg/compTitleTips_RichText", this.txSignPage).getComponent(cc.RichText);
      this.cashLb = this.getNodeByPath("txSign_content_bg1/dakuanBg/New Layout/compcashLb_Label", this.txSignPage).getComponent(cc.Label);
      this.userIcon = this.getNodeByPath("txSign_content_bg1/headMask/compuserIcon", this.txSignPage);
      this.userName = this.getNodeByPath("txSign_content_bg1/rect2/compuserName_Label", this.txSignPage).getComponent(cc.Label);
      this.num = this.getNodeByPath("txBg/New Node/compnum_Label", this.txSignPage).getComponent(cc.Label);
      this.signTips = this.node.getChildByName("compsignTips_RichText").getComponent(cc.RichText);
    }
  }
}