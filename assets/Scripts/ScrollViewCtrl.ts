import NodePool from './gameCtrl/NodePool';
import EngineUtil from './framework/EngineUtil';
const {
  ccclass,
  property,
  menu
} = cc._decorator;
@ccclass
@menu("自定义组件/ScrollViewCtrl")
export default class ScrollViewCtrl extends cc.Component {
  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;
  scrollView = null;
  content = null;
  view = null;
  layout = null;
  itemName = null;
  mat4 = null;
  isInit = null;
  data = null;
  callbackList = null;
  extData = null;
  firstX = null;
  firstY = null;
  itemCache = null;
  itemBuffer = null;
  _tmpV2 = null;
  viewRect = null;
  _resetItemFlag = 0;
  start() {
    this.initOnce();
  }
  initOnce() {
    this.bindIndexList = {};
    this.scrollView = this.node.getComponent(cc.ScrollView);
    this.content = this.scrollView.content;
    this.view = this.content.parent;
    this.layout = this.content.getComponent(cc.Layout);
    this.itemName = this.itemPrefab.name;
    this.mat4 = cc.mat4();
    this.initOnce = function () {};
  }
  update() {
    this._resetItemFlag > 0 && this.afterItemSizeChange();
  }
  onDestroy() {
    var e;
    null === (e = this.content) || void 0 === e || e.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
    this.recycle();
  }
  registerScrollEvent(e, t) {
    if (e.name) {
      var o = this.node.getComponent(cc.ScrollView),
        n = new cc.Component.EventHandler();
      n.target = t.node;
      n.component = cc.js.getClassName(t);
      n.handler = e.name;
      var a = o.scrollEvents.length;
      o.scrollEvents[a] = n;
    }
  }
  init(e, t) {
    var o = this;
    this.initOnce();
    if (Array.isArray(e)) {
      if (e.length) {
        t = t || {};
        this.isInit = true;
        this.data = e;
        this.callbackList = [];
        this.extData = t.extData;
        t.onChanged && this.onItemChanged(t.onChanged);
        this.layout.enabled = false;
        this.scrollView.stopAutoScroll();
        NodePool.hasPool(this.itemName) || NodePool.initPool(this.itemPrefab);
        var n = this.itemPrefab.data,
          a = this.layout.paddingLeft,
          i = this.layout.paddingRight,
          c = this.layout.paddingTop,
          s = this.layout.paddingBottom,
          l = this.layout.spacingX,
          u = this.layout.spacingY,
          p = n.x,
          d = n.y;
        if (this.scrollView.horizontal) {
          p = -n.width / 2;
          p -= a;
        }
        if (this.scrollView.vertical) {
          d = -n.height / 2;
          d -= c;
        }
        this.firstX = p;
        this.firstY = d;
        this.itemCache = [];
        this.itemBuffer = this.itemBuffer || [];
        var f = 0;
        this.itemBuffer.forEach(function (t) {
          t.index = -1;
          if (f >= e.length) {
            t.item.x = -9999999;
            t.item.y = -9999999;
            t.item.opacity = 0;
          }
          f++;
        });
        var h = function h(e) {
          o.itemCache[e] = o.itemCache[e] || {};
          o.itemCache[e].x = p;
          o.itemCache[e].y = d;
          o.itemCache[e].width = n.width;
          o.itemCache[e].height = n.height;
          o.itemCache[e].scaleX = n.scaleX;
          o.itemCache[e].scaleY = n.scaleY;
          o.itemCache[e].visible = false;
        };
        h(0);
        for (var g = 1; g < this.data.length; g++) {
          h(g);
          this.scrollView.horizontal && (this.itemCache[g].x = this.itemCache[g - 1].x - (this.itemCache[g - 1].width / 2 + this.itemCache[g].width / 2 + l));
          this.scrollView.vertical && (this.itemCache[g].y = this.itemCache[g - 1].y - (this.itemCache[g - 1].height / 2 + this.itemCache[g].height / 2 + u));
        }
        var _ = this.itemCache[this.itemCache.length - 1];
        this.scrollView.horizontal && (this.content.width = Math.abs(_.x + _.width / 2 + i));
        this.scrollView.vertical && (this.content.height = Math.abs(_.y - _.height / 2 - s));
        this.content.on(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
        this.scheduleOnce(function () {
          o.updateListView();
        });
      } else {
        this.recycle();
        this.content.off(cc.Node.EventType.POSITION_CHANGED, this.scrollEvent, this);
      }
    } else console.error("传进来的数据不为数组！");
  }
  updateItemView(e, t) {
    var o = EngineUtil.getScript(e);
    if (o && o.initData) {
      o.initData(this.data[t], t, this.extData);
      o.updateView && o.updateView();
    }
  }
  getItem() {
    var e = NodePool.getNode(this.itemName);
    e.x = this.firstX;
    e.y = this.firstY;
    var t = {
      item: e,
      index: -1
    };
    this.itemBuffer.push(t);
    e.on(cc.Node.EventType.SIZE_CHANGED, this.onItemSizeChanged.bind(this, e), this);
    e.on(cc.Node.EventType.SCALE_CHANGED, this.onItemSizeChanged.bind(this, e), this);
    return t;
  }
  scrollEvent() {
    this.content && this.isInit && this.updateListView();
  }
  updateListView() {
    var e = this;
    if (this.itemCache) {
      for (var t = function t(t, o) {
          t.index = o;
          t.item.x = e.itemCache[o].x;
          t.item.y = e.itemCache[o].y;
          t.item.scaleX = e.itemCache[o].scaleX;
          t.item.scaleY = e.itemCache[o].scaleY;
          t.item.opacity = 255;
          e.scrollView.horizontal && (t.item.width = e.itemCache[o].width);
          e.scrollView.vertical && (t.item.height = e.itemCache[o].height);
          t.item.parent = e.content;
          e.updateItemView(t.item, o);
        }, o = 0; o < this.itemCache.length; o++) {
        var n = this.itemCache[o],
          a = this.isItemInView(o),
          i = this.itemBuffer.find(function (e) {
            return e.index == o;
          });
        if (a) {
          this.bindIndexList[o] && (i = this.itemBuffer.find(function (e) {
            return e.bindIndex == o;
          }));
          i || (i = (i = this.itemBuffer.find(function (e) {
            return -1 == e.index && null == e.bindIndex;
          })) || this.getItem());
          i.index != o && t(i, o);
        } else if (i) {
          i.index = -1;
          i.item.x = -9999999;
          i.item.y = -9999999;
          i.item.opacity = 0;
        }
        n.visible != a && this.runItemChangedCallback(o, a);
        n.visible = a;
      }
      this.itemBuffer.sort(function (e, t) {
        return e.index < 0 || t.index < 0 ? 1 : e.index - t.index;
      });
      for (o = 0; o < this.itemBuffer.length; o++) this.itemBuffer[o].item.setSiblingIndex(o);
    }
  }
  isItemInView(e) {
    this._tmpV2 = this._tmpV2 || cc.v2(0, 0);
    this.view.getWorldMatrix(this.mat4);
    var t = this.mat4.m[0],
      o = this.mat4.m[12],
      n = this.mat4.m[13],
      a = this.view.width * t,
      i = this.view.height * t,
      r = this.view.convertToWorldSpaceAR(cc.Vec2.ZERO, this._tmpV2);
    this.viewRect && 1 == t && this.viewRect.x + a / 2 == o && this.viewRect.y + i / 2 == n || (this.viewRect = new cc.Rect(r.x - a / 2, r.y - i / 2, a, i));
    var c = this.itemCache[e],
      s = this.content.convertToWorldSpaceAR(cc.v2(c.x, c.y)),
      l = c.width * c.scaleX,
      u = c.height * c.scaleY,
      p = new cc.Rect(s.x - l / 2, s.y - u / 2, l, u);
    return this.viewRect.intersects(p);
  }
  onItemSizeChanged(e) {
    if (this.itemCache) {
      var t = this.itemBuffer.find(function (t) {
        return t.item == e;
      });
      if (t && t.index >= 0) {
        var o = this.itemCache[t.index];
        if (this.scrollView.horizontal && o.width == e.width && o.scaleX == e.scaleX) return;
        if (this.scrollView.vertical && o.height == e.height && o.scaleY == e.scaleY) return;
        o.width = e.width;
        o.scaleX = e.scaleX;
        o.height = e.height;
        o.scaleY = e.scaleY;
        this._resetItemFlag = 1;
      }
    }
  }
  afterItemSizeChange() {
    var e = this;
    this._resetItemFlag = 0;
    this.updateBuffer();
    this.scheduleOnce(function () {
      e.updateListView();
    });
  }
  setItemProperty(e, t, o) {
    var n = this;
    if (this.itemCache && this.itemBuffer) {
      var a = this.itemBuffer.find(function (t) {
        return t.index == e;
      });
      if (a) {
        a.item[t] = o;
      } else {
        this.itemCache[e][t] = o;
      }
      this.updateBuffer();
      this.scheduleOnce(function () {
        n.updateListView();
      });
    }
  }
  updateBuffer() {
    var e,
      t = this,
      o = this.itemCache[this.itemCache.length - 1];
    if (this.scrollView.vertical) {
      this.itemCache[0].y = -this.itemCache[0].height / 2 - this.layout.paddingTop || 0;
      1 != this.itemCache[0].scaleY && (this.itemCache[0].y = -Math.abs(this.itemCache[0].scaleY * (null === (e = this.itemCache[0]) || void 0 === e ? void 0 : e.height)) / 2 - this.layout.paddingTop || 0);
      this.itemBuffer.find(function (e) {
        0 == e.index && (e.item.y = t.itemCache[0].y);
      });
      for (var n = 1; n < this.data.length; n++) {
        var a = this.itemCache[n - 1],
          i = this.itemCache[n];
        if (a && i) {
          var r = a.height || 0,
            c = i.height || 0;
          1 != a.scaleY && (r = Math.abs(a.scaleY * a.height || 0));
          1 != i.scaleY && (c = Math.abs(i.scaleY * i.height || 0));
          i.y = a.y - (r / 2 + c / 2 + this.layout.spacingY);
          this.itemBuffer.find(function (e) {
            e.index == n && (e.item.y = i.y || 0);
          });
        }
      }
      var s = (null == o ? void 0 : o.height) / 2 || 0;
      1 != o.scaleY && (s = Math.abs(o.scaleY * (null == o ? void 0 : o.height)) / 2 || 0);
      this.content && (this.content.height = Math.abs(o.y - s - this.layout.paddingBottom));
    }
  }
  scrollToItem(e, t, o) {
    if (this.itemCache && this.itemCache.length) {
      e < 0 && (e = 0);
      e >= this.itemCache.length && (e = this.itemCache.length - 1);
      var n = this.itemCache[e];
      if (n) {
        o = o || {};
        t = t || 0;
        if (this.scrollView) {
          var a;
          if (o.customTween) ;else {
            a = -(n.y + Math.abs(n.height * n.scaleY) / 2);
            this.scrollView.scrollToOffset(cc.v2(0, a), t);
          }
        }
      }
    }
  }
  getItemByIndex(e) {
    if (this.itemBuffer) return (this.itemBuffer.find(function (t) {
      return t.index == e;
    }) || {}).item;
  }
  removeItemByIndex(e) {
    if (this.itemBuffer) {
      var t = this.itemBuffer.findIndex(function (t) {
        return t.index == e;
      });
      if (t >= 0) {
        var o = this.itemBuffer.splice(t, 1);
        EngineUtil.destroyNode(o.item);
      }
    }
  }
  bindItemWithIndex(e, t, o) {
    if (this.itemBuffer) {
      o = o || true;
      var n = this.itemBuffer.find(function (t) {
        return t.item == e;
      });
      if (n) {
        n.bindIndex = t;
        if (o) this.bindIndexList[t] = o;else {
          delete this.bindIndexList[t];
          delete n.bindIndex;
        }
      }
    }
  }
  onItemChanged(e) {
    "function" == typeof e && this.callbackList.push(e);
  }
  runItemChangedCallback(e, t) {
    try {
      for (var o = 0; o < this.callbackList.length; o++) this.callbackList[o](e, t);
    } catch (e) {
      console.error(e);
    }
  }
  recycle() {
    var e = this;
    this.itemBuffer && this.itemBuffer.forEach(function (t) {
      if (t && cc.isValid(t.item)) {
        t.item.off(cc.Node.EventType.SIZE_CHANGED, e.onItemSizeChanged.bind(e, t.item), e);
        t.item.off(cc.Node.EventType.SCALE_CHANGED, e.onItemSizeChanged.bind(e, t.item), e);
        NodePool.putNode(e.itemName, t.item);
      }
    });
    this.itemCache = null;
    this.itemBuffer = null;
  }
  scrollToTop() {
    this.scrollToItem(0, 0);
    this.scrollView.scrollToOffset(cc.v2(0, 0), 0);
  }
  scrollToBottom() {
    this.scrollView.scrollToBottom();
  }
}