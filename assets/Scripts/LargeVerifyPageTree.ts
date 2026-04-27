const {
  ccclass,
  menu
} = cc._decorator;
@ccclass
@menu("节点树/LargeVerifyPageTree")
export default class LargeVerifyPageTree extends cc.Component {
  isLoaded = false;
  static URL = "db://assets/resources/pages/LargeVerifyPage.prefab";
  getNodeByPath(e, t) {
    return cc.find(e, t || this.node);
  }
  onLoad() {
    if (!this.isLoaded) {
      this.isLoaded = true;
      this.LargeVerifyPage = this.node;
      this.Title = this.node.getChildByName("compTitle");
      this.Finish = this.node.getChildByName("compFinish");
    }
  }
}