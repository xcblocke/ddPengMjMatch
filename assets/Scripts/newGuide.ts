import { gameData } from './data/GameData';
import SdkHelper from './framework/SdkHelper';
import AudioManager from './framework/controller/AudioManager';
import { GuideConfig } from './framework/enum/GuideConfig';
import CommonUtil from './common/CommonUtil';
import GlobalApp from './common/GlobalApp';
import PlayerDataSys from './framework/controller/PlayerDataSys';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property
} = cc._decorator;
@ccclass
export default class newGuide extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;
  @property(cc.Node)
  mask: cc.Node = null;
  @property(cc.Graphics)
  line: cc.Graphics = null;
  @property(cc.RichText)
  desLabel: cc.RichText = null;
  @property(cc.Node)
  node0: cc.Node = null;
  @property(cc.Node)
  node1: cc.Node = null;
  @property(cc.Node)
  border: cc.Node = null;
  @property(cc.Node)
  handNode: cc.Node = null;
  @property(cc.Node)
  guideBoard: cc.Node = null;
  @property(cc.Node)
  closeNode: cc.Node = null;
  @property(cc.Node)
  fullBtnUnclick: cc.Node = null;
  _index = 0;
  _infos = null;
  _path = null;
  _type = 0;
  _scale_rate = 0;
  isShowNewGuide = false;
  nowGuideType = null;
  nodeParents = [];
  get testHasGuide() {
    return EngineUtil.testHasGuide(this.nowGuideType);
  }
  get AudioName() {
    return PlayerDataSys.isOppoReviewer() && this.guideConfig.audioNameOppo || this.guideConfig.audioName;
  }
  get DescString() {
    return PlayerDataSys.isOppoReviewer() && this.guideConfig.desOppo || this.guideConfig.des;
  }
  get guideConfig() {
    return GuideConfig[this.nowGuideType];
  }
  update() {}
  onLoad() {
    var e = this;
    this.guideBoard.active = false;
    this.fullBtnUnclick.zIndex = 999;
    this.fullBtnUnclick.active = true;
    this.scheduleOnce(function () {
      e.isShowNewGuide = true;
      e.fullBtnUnclick.active = false;
    }, 0.5);
    this.bg.getComponent(cc.Sprite).srcBlendFactor = cc.macro.BlendFactor.ONE;
  }
  start() {
    this.line.clear(true);
    this.mask.active = true;
    this.bg.opacity = this.guideConfig.isTransparentBg ? 0 : 200;
  }
  setParent(e, t = null) {
    if (null == e ? void 0 : e.getComponent(cc.Widget)) {
      e.getComponent(cc.Widget).target = GlobalApp.GameMain.node.parent;
      e.getComponent(cc.Widget).updateAlignment();
    }
  }
  onTouchStart() {
    this.guideConfig.isBlackClose && this.close();
  }
  close(e = false) {
    var t,
      o,
      n,
      a,
      i,
      r,
      c = this;
    if (gameData.globalCanClick) {
      e = true === e;
      if (this.isShowNewGuide) {
        AudioManager.getInstance().stopMusic(this.AudioName);
        e || EngineUtil.setGuideLocal(this.nowGuideType);
        this.guideConfig.reportName && SdkHelper.reportData(this.guideConfig.reportName, {
          level: gameData.id
        });
        if (this.inputGuideData) {
          if (this.inputGuideData.needClone) {
            null === (a = this.inputGuideData.nodes) || void 0 === a || a.forEach(function (e) {
              e.destroy();
            });
          } else {
            null === (n = this.inputGuideData.nodes) || void 0 === n || n.forEach(function (e, t) {
              e.getComponent(cc.Button) && (e.getComponent(cc.Button).enabled = true);
              c.nodeParents[t].parent.insertChild(e, c.nodeParents[t].childrenIndex);
              e.position = c.nodeParents[t].oldPos;
              e.scale = c.nodeParents[t].oldScale;
              c.nodeParents[t].parent.getComponent(cc.Layout) && (c.nodeParents[t].parent.getComponent(cc.Layout).enabled = true);
              e.removeComponent(cc.BlockInputEvents);
            });
          }
          null === (i = this.node) || void 0 === i || i.destroy();
          null === (r = this.cb) || void 0 === r || r.call(this);
        } else {
          null === (t = this.node) || void 0 === t || t.destroy();
          null === (o = this.cb) || void 0 === o || o.call(this);
        }
      }
    }
  }
  cb() {}
  computeLabelPos() {
    this.guideBoard.active = true;
    this.guideBoard.zIndex = 999;
    if ("top" !== this.guideConfig.textPosition) {
      if ("bottom" !== this.guideConfig.textPosition) {
        if ("center" !== this.guideConfig.textPosition) {
          if (this.showNode) {
            var e = this.showNode.position.y - (this.showNode.anchorY - 0.5) * this.showNode.height,
              t = e > 0,
              o = this.showNode.height / 2 + this.guideBoard.height / 2 + 30;
            this.guideBoard.y = e + (t ? -o : o);
          }
        } else this.guideBoard.y = 200;
      } else this.guideBoard.y = -this.node.height / 2 + this.guideBoard.height / 2 + 50;
    } else this.guideBoard.y = this.node.height / 2 - this.guideBoard.height / 2 - 50;
  }
  justShowTxt(e) {
    this.nowGuideType = e;
    if (this.testHasGuide) this.close(true);else {
      this.setDesc(this.DescString);
      this.guideBoard.active = true;
      this.computeLabelPos();
    }
  }
  setDesc(e) {
    this.typingAni(this.desLabel, e, 150);
    this.setLength(e);
  }
  setLength() {
    this.desLabel.horizontalAlign = cc.macro.TextAlignment.CENTER;
  }
  showGuide2() {
    this.setDesc(this.guideConfig.des2);
    AudioManager.getInstance().playMusic(this.guideConfig.audioName2);
  }
  async showGuideByNode(e) {
    var t,
      o,
      n,
      a,
      i,
      r,
      s,
      l,
      p,
      f,
      h = this;
    this.inputGuideData = e;
    t = e.guideType, o = e.nodes, n = e.needClone, a = void 0 !== n && n, i = e.offset, r = void 0 === i ? cc.v3(0, 0, 0) : i, s = e.boderOffSet;
    this.nowGuideType = t;
    l = this.guideConfig.unBindClose;
    this.closeNode.zIndex = 999;
    this.closeNode.active = this.guideConfig.isBlackClose;
    await CommonUtil.sleep(50);
    this.handNode.active = false;
    this.AudioName && AudioManager.getInstance().playMusic(this.AudioName);
    if (!o) {
      this.justShowTxt(t);
      return;
    }
    this.node.zIndex = 999;
    o.forEach(function (e, t) {
      var n;
      (null === (n = e.parent) || void 0 === n ? void 0 : n.getComponent(cc.Layout)) && (e.parent.getComponent(cc.Layout).enabled = false);
      e.active = true;
      var i = e.worldPosition,
        c = e.scale;
      !a && h.nodeParents.push({
        parent: e.parent,
        oldPos: e.position.clone(),
        childrenIndex: e.getSiblingIndex(),
        oldScale: c
      });
      var s = e.worldScale;
      a && (e = cc.instantiate(e));
      if (!l) {
        e.getComponent(cc.Button) && (e.getComponent(cc.Button).enabled = false);
        e.addComponent(cc.BlockInputEvents);
        e.once(cc.Node.EventType.TOUCH_START, function () {
          e.parent == h.node && h.close();
        });
      }
      e.parent = h.node;
      e.scale = h.guideConfig.scale ? h.guideConfig.scale : s;
      r && i.addSelf(r);
      e.worldPosition = i;
      h.mask.height = 0;
      h.mask.width = 0;
      h.mask.y = e.y;
      o[t] = e;
    });
    if (this.guideConfig.needShowHand) {
      this.handNode.parent = null;
      this.handNode.parent = this.node;
      this.handNode.active = true;
      p = o[0].width / 2;
      f = o[0].height / 2;
      o[0].x > 0 && (this.handNode.scaleX = -1);
      this.handNode.position = o[0].position.add(cc.v3(this.handNode.scaleX * p * 0.5, 0.2 * -f, 0)).add(this.guideConfig.handOffset || cc.v3(0, 0, 0));
    }
    this.showNode = o[0];
    this.computeLabelPos();
    if (this.DescString) {
      this.border.parent.active = true;
      this.border.active = true;
      this.setDesc(this.DescString);
    } else {
      this.border.parent.active = false;
      this.border.active = false;
    }
    s && (this.border.parent.position = this.border.parent.position.add(s));
    return;
  }
  onDestroy() {
    this.unscheduleAllCallbacks();
  }
  typingAni(e, t, o, n = null) {
    var a = this;
    e.string = "";
    this.isPlayDone = false;
    for (var i = /<.+?\/?>/g, r = t.match(i), c = t.replace(i, "│").split("│"), s = [], l = 0, u = 0, p = c; u < p.length; u++) {
      if ("" !== (v = p[u])) {
        v = "$[" + l + "]";
        l += 1;
      }
      s.push(v);
    }
    for (var d = s.join("│"), f = 0; f < c.length; f++) if ("" === c[f]) {
      c.splice(f, 1);
      f -= 1;
    }
    for (; -1 !== d.search("│");) if (r[0]) {
      d = d.replace("│", r[0].toString());
      r.splice(0, 1);
    } else {
      d = d.replace("│", "");
      console.warn("matchArr not enough");
    }
    for (var h = [], g = new Array(l).fill(""), _ = 0; _ < c.length; _++) for (var y = 0, m = c[_]; y < m.length; y++) {
      var v = m[y];
      g[_] = g[_] + v;
      var b = d;
      for (f = 0; f < l; f++) b = b.replace("$[" + f + "]", g[f]);
      h.push(b);
    }
    var w = 0,
      S = function S() {
        var t;
        if ((null === (t = a.node) || void 0 === t ? void 0 : t.active) && !a.isPlayDone) if (w >= h.length) {
          a.isPlayDone = true;
          n && n();
        } else {
          e.string = h[w];
          w += 1;
          setTimeout(function () {
            S();
          }, o);
        }
      };
    setTimeout(function () {
      S();
    }, o);
  }
}