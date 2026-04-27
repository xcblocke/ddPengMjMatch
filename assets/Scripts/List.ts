import ListItem from './ListItem';
const {
  ccclass,
  property,
  disallowMultiple,
  menu,
  executionOrder,
  requireComponent
} = cc._decorator;
enum r {
  NODE = 1,
  PREFAB = 2,
}
enum c {
  NORMAL = 1,
  ADHERING = 2,
  PAGE = 3,
}
enum s {
  NONE = 0,
  SINGLE = 1,
  MULT = 2,
}
@ccclass
@disallowMultiple()
@menu("自定义组件/List")
@requireComponent(cc.ScrollView)
@executionOrder(-5000)
export default class List extends cc.Component {
  @property({
    type: cc.Enum(r),
    tooltip: ""
  })
  templateType: number = r.NODE;
  @property({
    type: cc.Node,
    tooltip: "",
    visible: function () {
      return this.templateType == r.NODE;
    }
  })
  tmpNode: cc.Node = null;
  @property({
    type: cc.Prefab,
    tooltip: "",
    visible: function () {
      return this.templateType == r.PREFAB;
    }
  })
  tmpPrefab: cc.Prefab = null;
  @property()
  _slideMode = c.NORMAL;
  @property({
    type: cc.Float,
    range: [0, 1, 0.1],
    tooltip: "",
    slide: true,
    visible: function () {
      return this._slideMode == c.PAGE;
    }
  })
  pageDistance: number = 0.3;
  @property({
    type: cc.Component.EventHandler,
    tooltip: "",
    visible: function () {
      return this._slideMode == c.PAGE;
    }
  })
  pageChangeEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
  @property()
  _virtual = true;
  @property({
    tooltip: "",
    visible: function () {
      var e = this.slideMode == c.NORMAL;
      e || (this.cyclic = false);
      return e;
    }
  })
  cyclic = false;
  @property({
    tooltip: "",
    visible: function () {
      return this.virtual;
    }
  })
  lackCenter = false;
  @property({
    tooltip: "",
    visible: function () {
      var e = this.virtual && !this.lackCenter;
      e || (this.lackSlide = false);
      return e;
    }
  })
  lackSlide = false;
  @property({
    type: cc.Integer
  })
  _updateRate: number = 0;
  @property({
    type: cc.Integer,
    range: [0, 12, 1],
    tooltip: "",
    slide: true
  })
  frameByFrameRenderNum: number = 0;
  @property({
    type: cc.Component.EventHandler,
    tooltip: ""
  })
  renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
  @property({
    type: cc.Enum(s),
    tooltip: ""
  })
  selectedMode: number = s.NONE;
  @property({
    tooltip: "",
    visible: function () {
      return this.selectedMode == s.SINGLE;
    }
  })
  repeatEventSingle = false;
  @property({
    type: cc.Component.EventHandler,
    tooltip: "",
    visible: function () {
      return this.selectedMode > s.NONE;
    }
  })
  selectedEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
  _selectedId = -1;
  _forceUpdate = false;
  _updateDone = true;
  @property({
    serializable: false
  })
  _numItems = 0;
  _inited = false;
  _needUpdateWidget = false;
  _aniDelRuning = false;
  _doneAfterUpdate = false;
  adhering = false;
  _adheringBarrier = false;
  curPageNum = 0;
  @property({
    type: cc.Enum(c),
    tooltip: ""
  })
  get slideMode() {
    return this._slideMode;
  }
  set slideMode(e) {
    this._slideMode = e;
  }
  @property({
    type: cc.Boolean,
    tooltip: ""
  })
  get virtual() {
    return this._virtual;
  }
  set virtual(e) {
    null != e && (this._virtual = e);
    0 != this._numItems && this._onScrolling();
  }
  @property({
    type: cc.Integer,
    range: [0, 6, 1],
    tooltip: "",
    slide: true
  })
  get updateRate() {
    return this._updateRate;
  }
  set updateRate(e) {
    e >= 0 && e <= 6 && (this._updateRate = e);
  }
  get selectedId() {
    return this._selectedId;
  }
  set selectedId(e) {
    var t,
      o = this;
    switch (o.selectedMode) {
      case s.SINGLE:
        if (!o.repeatEventSingle && e == o._selectedId) return;
        t = o.getItemByListId(e);
        var n = void 0;
        if (o._selectedId >= 0) {
          o._lastSelectedId = o._selectedId;
        } else {
          o._lastSelectedId = null;
        }
        o._selectedId = e;
        t && ((n = t.getComponent(ListItem)).selected = true);
        if (o._lastSelectedId >= 0 && o._lastSelectedId != o._selectedId) {
          var a = o.getItemByListId(o._lastSelectedId);
          a && (a.getComponent(ListItem).selected = false);
        }
        o.selectedEvent && cc.Component.EventHandler.emitEvents([o.selectedEvent], t, e % this._actualNumItems, null == o._lastSelectedId ? null : o._lastSelectedId % this._actualNumItems);
        break;
      case s.MULT:
        if (!(t = o.getItemByListId(e))) return;
        n = t.getComponent(ListItem);
        o._selectedId >= 0 && (o._lastSelectedId = o._selectedId);
        o._selectedId = e;
        var i = !n.selected;
        n.selected = i;
        var r = o.multSelected.indexOf(e);
        if (i && r < 0) {
          o.multSelected.push(e);
        } else {
          !i && r >= 0 && o.multSelected.splice(r, 1);
        }
        o.selectedEvent && cc.Component.EventHandler.emitEvents([o.selectedEvent], t, e % this._actualNumItems, null == o._lastSelectedId ? null : o._lastSelectedId % this._actualNumItems, i);
    }
  }
  get numItems() {
    return this._actualNumItems;
  }
  set numItems(e) {
    var t = this;
    if (t.checkInited(false)) if (null == e || e < 0) cc.error("numItems set the wrong::", e);else {
      t._actualNumItems = t._numItems = e;
      t._forceUpdate = true;
      if (t._virtual) {
        t._resizeContent();
        t.cyclic && (t._numItems = t._cyclicNum * t._numItems);
        t._onScrolling();
        t.frameByFrameRenderNum || t.slideMode != c.PAGE || (t.curPageNum = t.nearestListId);
      } else {
        if (t.cyclic) {
          t._resizeContent();
          t._numItems = t._cyclicNum * t._numItems;
        }
        var o = t.content.getComponent(cc.Layout);
        o && (o.enabled = true);
        t._delRedundantItem();
        t.firstListId = 0;
        if (t.frameByFrameRenderNum > 0) {
          for (var n = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum, a = 0; a < n; a++) t._createOrUpdateItem2(a);
          if (t.frameByFrameRenderNum < t._numItems) {
            t._updateCounter = t.frameByFrameRenderNum;
            t._updateDone = false;
          }
        } else {
          for (a = 0; a < t._numItems; a++) t._createOrUpdateItem2(a);
          t.displayItemNum = t._numItems;
        }
      }
    }
  }
  get scrollView() {
    return this._scrollView;
  }
  onLoad() {
    this._init();
  }
  onDestroy() {
    var e = this;
    cc.isValid(e._itemTmp) && e._itemTmp.destroy();
    cc.isValid(e.tmpNode) && e.tmpNode.destroy();
    e._pool && e._pool.clear();
  }
  onEnable() {
    this._registerEvent();
    this._init();
    if (this._aniDelRuning) {
      this._aniDelRuning = false;
      if (this._aniDelItem) {
        if (this._aniDelBeforePos) {
          this._aniDelItem.position = this._aniDelBeforePos;
          delete this._aniDelBeforePos;
        }
        if (this._aniDelBeforeScale) {
          this._aniDelItem.scale = this._aniDelBeforeScale;
          delete this._aniDelBeforeScale;
        }
        delete this._aniDelItem;
      }
      if (this._aniDelCB) {
        this._aniDelCB();
        delete this._aniDelCB;
      }
    }
  }
  onDisable() {
    this._unregisterEvent();
  }
  _registerEvent() {
    var e = this;
    e.node.on(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, true);
    e.node.on("touch-up", e._onTouchUp, e);
    e.node.on(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, true);
    e.node.on("scroll-began", e._onScrollBegan, e, true);
    e.node.on("scroll-ended", e._onScrollEnded, e, true);
    e.node.on("scrolling", e._onScrolling, e, true);
    e.node.on(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
  }
  _unregisterEvent() {
    var e = this;
    e.node.off(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, true);
    e.node.off("touch-up", e._onTouchUp, e);
    e.node.off(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, true);
    e.node.off("scroll-began", e._onScrollBegan, e, true);
    e.node.off("scroll-ended", e._onScrollEnded, e, true);
    e.node.off("scrolling", e._onScrolling, e, true);
    e.node.off(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
  }
  _init() {
    var e = this;
    if (!e._inited) {
      e._scrollView = e.node.getComponent(cc.ScrollView);
      e.content = e._scrollView.content;
      if (e.content) {
        e._layout = e.content.getComponent(cc.Layout);
        e._align = e._layout.type;
        e._resizeMode = e._layout.resizeMode;
        e._startAxis = e._layout.startAxis;
        e._topGap = e._layout.paddingTop;
        e._rightGap = e._layout.paddingRight;
        e._bottomGap = e._layout.paddingBottom;
        e._leftGap = e._layout.paddingLeft;
        e._columnGap = e._layout.spacingX;
        e._lineGap = e._layout.spacingY;
        e._colLineNum;
        e._verticalDir = e._layout.verticalDirection;
        e._horizontalDir = e._layout.horizontalDirection;
        e.setTemplateItem(cc.instantiate(e.templateType == r.PREFAB ? e.tmpPrefab : e.tmpNode));
        if (e._slideMode == c.ADHERING || e._slideMode == c.PAGE) {
          e._scrollView.inertia = false;
          e._scrollView._onMouseWheel = function () {};
        }
        e.virtual || (e.lackCenter = false);
        e._lastDisplayData = [];
        e.displayData = [];
        e._pool = new cc.NodePool();
        e._forceUpdate = false;
        e._updateCounter = 0;
        e._updateDone = true;
        e.curPageNum = 0;
        if (e.cyclic) {
          e._scrollView._processAutoScrolling = this._processAutoScrolling.bind(e);
          e._scrollView._startBounceBackIfNeeded = function () {
            return false;
          };
        }
        switch (e._align) {
          case cc.Layout.Type.HORIZONTAL:
            switch (e._horizontalDir) {
              case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                e._alignCalcType = 1;
                break;
              case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                e._alignCalcType = 2;
            }
            break;
          case cc.Layout.Type.VERTICAL:
            switch (e._verticalDir) {
              case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                e._alignCalcType = 3;
                break;
              case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                e._alignCalcType = 4;
            }
            break;
          case cc.Layout.Type.GRID:
            switch (e._startAxis) {
              case cc.Layout.AxisDirection.HORIZONTAL:
                switch (e._verticalDir) {
                  case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                    e._alignCalcType = 3;
                    break;
                  case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                    e._alignCalcType = 4;
                }
                break;
              case cc.Layout.AxisDirection.VERTICAL:
                switch (e._horizontalDir) {
                  case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                    e._alignCalcType = 1;
                    break;
                  case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                    e._alignCalcType = 2;
                }
            }
        }
        e.content.removeAllChildren();
        e._inited = true;
      } else cc.error(e.node.name + "'s cc.ScrollView unset content!");
    }
  }
  _processAutoScrolling(e) {
    this._scrollView._autoScrollAccumulatedTime += 1 * e;
    var t = Math.min(1, this._scrollView._autoScrollAccumulatedTime / this._scrollView._autoScrollTotalTime);
    if (this._scrollView._autoScrollAttenuate) {
      var o = t - 1;
      t = o * o * o * o * o + 1;
    }
    var n = this._scrollView._autoScrollStartPosition.add(this._scrollView._autoScrollTargetDelta.mul(t)),
      a = this._scrollView.getScrollEndedEventTiming(),
      i = Math.abs(t - 1) <= a;
    if (Math.abs(t - 1) <= this._scrollView.getScrollEndedEventTiming() && !this._scrollView._isScrollEndedWithThresholdEventFired) {
      this._scrollView._dispatchEvent("scroll-ended-with-threshold");
      this._scrollView._isScrollEndedWithThresholdEventFired = true;
    }
    i && (this._scrollView._autoScrolling = false);
    var r = n.sub(this._scrollView.getContentPosition());
    this._scrollView._moveContent(this._scrollView._clampDelta(r), i);
    this._scrollView._dispatchEvent("scrolling");
    if (!this._scrollView._autoScrolling) {
      this._scrollView._isBouncing = false;
      this._scrollView._scrolling = false;
      this._scrollView._dispatchEvent("scroll-ended");
    }
  }
  setTemplateItem(e) {
    if (e) {
      var t = this;
      t._itemTmp = e;
      if (t._resizeMode == cc.Layout.ResizeMode.CHILDREN) {
        t._itemSize = t._layout.cellSize;
      } else {
        t._itemSize = cc.size(e.width, e.height);
      }
      var o = e.getComponent(ListItem),
        n = false;
      o || (n = true);
      n && (t.selectedMode = s.NONE);
      (o = e.getComponent(cc.Widget)) && o.enabled && (t._needUpdateWidget = true);
      t.selectedMode == s.MULT && (t.multSelected = []);
      switch (t._align) {
        case cc.Layout.Type.HORIZONTAL:
          t._colLineNum = 1;
          t._sizeType = false;
          break;
        case cc.Layout.Type.VERTICAL:
          t._colLineNum = 1;
          t._sizeType = true;
          break;
        case cc.Layout.Type.GRID:
          switch (t._startAxis) {
            case cc.Layout.AxisDirection.HORIZONTAL:
              var a = t.content.width - t._leftGap - t._rightGap;
              t._colLineNum = Math.floor((a + t._columnGap) / (t._itemSize.width + t._columnGap));
              t._sizeType = true;
              break;
            case cc.Layout.AxisDirection.VERTICAL:
              var i = t.content.height - t._topGap - t._bottomGap;
              t._colLineNum = Math.floor((i + t._lineGap) / (t._itemSize.height + t._lineGap));
              t._sizeType = false;
          }
      }
    }
  }
  checkInited(e = true) {
    if (!this._inited) {
      e && cc.error("List initialization not completed!");
      return false;
    }
    return true;
  }
  _resizeContent() {
    var e,
      t = this;
    switch (t._align) {
      case cc.Layout.Type.HORIZONTAL:
        if (t._customSize) {
          var o = t._getFixedSize(null);
          e = t._leftGap + o.val + t._itemSize.width * (t._numItems - o.count) + t._columnGap * (t._numItems - 1) + t._rightGap;
        } else e = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
        break;
      case cc.Layout.Type.VERTICAL:
        if (t._customSize) {
          o = t._getFixedSize(null);
          e = t._topGap + o.val + t._itemSize.height * (t._numItems - o.count) + t._lineGap * (t._numItems - 1) + t._bottomGap;
        } else e = t._topGap + t._itemSize.height * t._numItems + t._lineGap * (t._numItems - 1) + t._bottomGap;
        break;
      case cc.Layout.Type.GRID:
        t.lackCenter && (t.lackCenter = false);
        switch (t._startAxis) {
          case cc.Layout.AxisDirection.HORIZONTAL:
            var n = Math.ceil(t._numItems / t._colLineNum);
            e = t._topGap + t._itemSize.height * n + t._lineGap * (n - 1) + t._bottomGap;
            break;
          case cc.Layout.AxisDirection.VERTICAL:
            var a = Math.ceil(t._numItems / t._colLineNum);
            e = t._leftGap + t._itemSize.width * a + t._columnGap * (a - 1) + t._rightGap;
        }
    }
    var i = t.content.getComponent(cc.Layout);
    i && (i.enabled = false);
    t._allItemSize = e;
    t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);
    if (t.cyclic) {
      var r = t._sizeType ? t.node.height : t.node.width;
      t._cyclicPos1 = 0;
      r -= t._cyclicPos1;
      t._cyclicNum = Math.ceil(r / t._allItemSizeNoEdge) + 1;
      var c = t._sizeType ? t._lineGap : t._columnGap;
      t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + c;
      t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + c * (t._cyclicNum - 1);
      t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
      t._cycilcAllItemSizeNoEdge += c * (t._cyclicNum - 1);
    }
    t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
    var s = t._lack && t.lackCenter || !t.lackSlide ? 0.1 : 0,
      l = t._lack ? (t._sizeType ? t.node.height : t.node.width) - s : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
    l < 0 && (l = 0);
    if (t._sizeType) {
      t.content.height = l;
    } else {
      t.content.width = l;
    }
  }
  _onScrolling(e = null) {
    null == this.frameCount && (this.frameCount = this._updateRate);
    if (!this._forceUpdate && e && "scroll-ended" != e.type && this.frameCount > 0) this.frameCount--;else {
      this.frameCount = this._updateRate;
      if (!this._aniDelRuning) {
        if (this.cyclic) {
          var t = this.content.getPosition();
          t = this._sizeType ? t.y : t.x;
          var o = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap),
            n = this._sizeType ? cc.v2(0, o) : cc.v2(o, 0);
          switch (this._alignCalcType) {
            case 1:
              if (t > -this._cyclicPos1) {
                this.content.x = -this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
              } else if (t < -this._cyclicPos2) {
                this.content.x = -this._cyclicPos1;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
              }
              break;
            case 2:
              if (t < this._cyclicPos1) {
                this.content.x = this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
              } else if (t > this._cyclicPos2) {
                this.content.x = this._cyclicPos1;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
              }
              break;
            case 3:
              if (t < this._cyclicPos1) {
                this.content.y = this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
              } else if (t > this._cyclicPos2) {
                this.content.y = this._cyclicPos1;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
              }
              break;
            case 4:
              if (t > -this._cyclicPos1) {
                this.content.y = -this._cyclicPos2;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(n));
              } else if (t < -this._cyclicPos2) {
                this.content.y = -this._cyclicPos1;
                this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(n));
              }
          }
        }
        this._calcViewPos();
        var a, i, r, c;
        if (this._sizeType) {
          a = this.viewTop;
          r = this.viewBottom;
        } else {
          i = this.viewRight;
          c = this.viewLeft;
        }
        if (this._virtual) {
          this.displayData = [];
          var s = void 0,
            l = 0,
            u = this._numItems - 1;
          if (this._customSize) for (var p = false; l <= u && !p; l++) {
            s = this._calcItemPos(l);
            switch (this._align) {
              case cc.Layout.Type.HORIZONTAL:
                if (s.right >= c && s.left <= i) {
                  this.displayData.push(s);
                } else {
                  0 != l && this.displayData.length > 0 && (p = true);
                }
                break;
              case cc.Layout.Type.VERTICAL:
                if (s.bottom <= a && s.top >= r) {
                  this.displayData.push(s);
                } else {
                  0 != l && this.displayData.length > 0 && (p = true);
                }
                break;
              case cc.Layout.Type.GRID:
                switch (this._startAxis) {
                  case cc.Layout.AxisDirection.HORIZONTAL:
                    if (s.bottom <= a && s.top >= r) {
                      this.displayData.push(s);
                    } else {
                      0 != l && this.displayData.length > 0 && (p = true);
                    }
                    break;
                  case cc.Layout.AxisDirection.VERTICAL:
                    if (s.right >= c && s.left <= i) {
                      this.displayData.push(s);
                    } else {
                      0 != l && this.displayData.length > 0 && (p = true);
                    }
                }
            }
          } else {
            var d = this._itemSize.width + this._columnGap,
              f = this._itemSize.height + this._lineGap;
            switch (this._alignCalcType) {
              case 1:
                l = (c - this._leftGap) / d;
                u = (i - this._leftGap) / d;
                break;
              case 2:
                l = (-i - this._rightGap) / d;
                u = (-c - this._rightGap) / d;
                break;
              case 3:
                l = (-a - this._topGap) / f;
                u = (-r - this._topGap) / f;
                break;
              case 4:
                l = (r - this._bottomGap) / f;
                u = (a - this._bottomGap) / f;
            }
            l = Math.floor(l) * this._colLineNum;
            u = Math.ceil(u) * this._colLineNum;
            l < 0 && (l = 0);
            --u >= this._numItems && (u = this._numItems - 1);
            for (; l <= u; l++) this.displayData.push(this._calcItemPos(l));
          }
          this._delRedundantItem();
          if (this.displayData.length <= 0 || !this._numItems) {
            this._lastDisplayData = [];
            return;
          }
          this.firstListId = this.displayData[0].id;
          this.displayItemNum = this.displayData.length;
          var h = this._lastDisplayData.length,
            g = this.displayItemNum != h;
          if (g) {
            this.frameByFrameRenderNum > 0 && this._lastDisplayData.sort(function (e, t) {
              return e - t;
            });
            g = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[h - 1];
          }
          if (this._forceUpdate || g) if (this.frameByFrameRenderNum > 0) {
            if (this._numItems > 0) {
              if (this._updateDone) {
                this._updateCounter = 0;
              } else {
                this._doneAfterUpdate = true;
              }
              this._updateDone = false;
            } else {
              this._updateCounter = 0;
              this._updateDone = true;
            }
          } else {
            this._lastDisplayData = [];
            for (var _ = 0; _ < this.displayItemNum; _++) this._createOrUpdateItem(this.displayData[_]);
            this._forceUpdate = false;
          }
          this._calcNearestItem();
        }
      }
    }
  }
  _calcViewPos() {
    var e = this.content.getPosition();
    switch (this._alignCalcType) {
      case 1:
        this.elasticLeft = e.x > 0 ? e.x : 0;
        this.viewLeft = (e.x < 0 ? -e.x : 0) - this.elasticLeft;
        this.viewRight = this.viewLeft + this.node.width;
        this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
        this.viewRight += this.elasticRight;
        break;
      case 2:
        this.elasticRight = e.x < 0 ? -e.x : 0;
        this.viewRight = (e.x > 0 ? -e.x : 0) + this.elasticRight;
        this.viewLeft = this.viewRight - this.node.width;
        this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
        this.viewLeft -= this.elasticLeft;
        break;
      case 3:
        this.elasticTop = e.y < 0 ? Math.abs(e.y) : 0;
        this.viewTop = (e.y > 0 ? -e.y : 0) + this.elasticTop;
        this.viewBottom = this.viewTop - this.node.height;
        this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
        this.viewBottom += this.elasticBottom;
        break;
      case 4:
        this.elasticBottom = e.y > 0 ? Math.abs(e.y) : 0;
        this.viewBottom = (e.y < 0 ? -e.y : 0) - this.elasticBottom;
        this.viewTop = this.viewBottom + this.node.height;
        this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
        this.viewTop -= this.elasticTop;
    }
  }
  _calcItemPos(e) {
    var t, o, n, a, i, r, c, s;
    switch (this._align) {
      case cc.Layout.Type.HORIZONTAL:
        switch (this._horizontalDir) {
          case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
            if (this._customSize) {
              var l = this._getFixedSize(e);
              i = this._leftGap + (this._itemSize.width + this._columnGap) * (e - l.count) + (l.val + this._columnGap * l.count);
              t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
            } else {
              i = this._leftGap + (this._itemSize.width + this._columnGap) * e;
              t = this._itemSize.width;
            }
            if (this.lackCenter) {
              i -= this._leftGap;
              i += this.content.width / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: e,
              left: i,
              right: r = i + t,
              x: i + this._itemTmp.anchorX * t,
              y: this._itemTmp.y
            };
          case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
            if (this._customSize) {
              l = this._getFixedSize(e);
              r = -this._rightGap - (this._itemSize.width + this._columnGap) * (e - l.count) - (l.val + this._columnGap * l.count);
              t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
            } else {
              r = -this._rightGap - (this._itemSize.width + this._columnGap) * e;
              t = this._itemSize.width;
            }
            if (this.lackCenter) {
              r += this._rightGap;
              r -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: e,
              right: r,
              left: i = r - t,
              x: i + this._itemTmp.anchorX * t,
              y: this._itemTmp.y
            };
        }
        break;
      case cc.Layout.Type.VERTICAL:
        switch (this._verticalDir) {
          case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
            if (this._customSize) {
              l = this._getFixedSize(e);
              n = -this._topGap - (this._itemSize.height + this._lineGap) * (e - l.count) - (l.val + this._lineGap * l.count);
              o = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
            } else {
              n = -this._topGap - (this._itemSize.height + this._lineGap) * e;
              o = this._itemSize.height;
            }
            if (this.lackCenter) {
              n += this._topGap;
              n -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: e,
              top: n,
              bottom: a = n - o,
              x: this._itemTmp.x,
              y: a + this._itemTmp.anchorY * o
            };
          case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
            if (this._customSize) {
              var u;
              l = this._getFixedSize(e);
              a = this._bottomGap + (this._itemSize.height + this._lineGap) * (e - l.count) + (l.val + this._lineGap * l.count);
              o = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
            } else {
              a = this._bottomGap + (this._itemSize.height + this._lineGap) * e;
              o = this._itemSize.height;
            }
            if (this.lackCenter) {
              a -= this._bottomGap;
              a += this.content.height / 2 - this._allItemSizeNoEdge / 2;
            }
            return {
              id: e,
              top: n = a + o,
              bottom: a,
              x: this._itemTmp.x,
              y: a + this._itemTmp.anchorY * o
            };
        }
      case cc.Layout.Type.GRID:
        var p = Math.floor(e / this._colLineNum);
        switch (this._startAxis) {
          case cc.Layout.AxisDirection.HORIZONTAL:
            switch (this._verticalDir) {
              case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                s = (a = (n = -this._topGap - (this._itemSize.height + this._lineGap) * p) - this._itemSize.height) + this._itemTmp.anchorY * this._itemSize.height;
                break;
              case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                n = (a = this._bottomGap + (this._itemSize.height + this._lineGap) * p) + this._itemSize.height;
                s = a + this._itemTmp.anchorY * this._itemSize.height;
            }
            c = this._leftGap + e % this._colLineNum * (this._itemSize.width + this._columnGap);
            switch (this._horizontalDir) {
              case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                c += this._itemTmp.anchorX * this._itemSize.width;
                c -= this.content.anchorX * this.content.width;
                break;
              case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                c += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                c -= (1 - this.content.anchorX) * this.content.width;
                c *= -1;
            }
            return {
              id: e,
              top: n,
              bottom: a,
              x: c,
              y: s
            };
          case cc.Layout.AxisDirection.VERTICAL:
            switch (this._horizontalDir) {
              case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                r = (i = this._leftGap + (this._itemSize.width + this._columnGap) * p) + this._itemSize.width;
                c = i + this._itemTmp.anchorX * this._itemSize.width;
                c -= this.content.anchorX * this.content.width;
                break;
              case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                c = (i = (r = -this._rightGap - (this._itemSize.width + this._columnGap) * p) - this._itemSize.width) + this._itemTmp.anchorX * this._itemSize.width;
                c += (1 - this.content.anchorX) * this.content.width;
            }
            s = -this._topGap - e % this._colLineNum * (this._itemSize.height + this._lineGap);
            switch (this._verticalDir) {
              case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                s -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                s += (1 - this.content.anchorY) * this.content.height;
                break;
              case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                s -= this._itemTmp.anchorY * this._itemSize.height;
                s += this.content.anchorY * this.content.height;
                s *= -1;
            }
            return {
              id: e,
              left: i,
              right: r,
              x: c,
              y: s
            };
        }
    }
  }
  _calcExistItemPos(e) {
    var t = this.getItemByListId(e);
    if (!t) return null;
    var o = {
      id: e,
      x: t.x,
      y: t.y
    };
    if (this._sizeType) {
      o.top = t.y + t.height * (1 - t.anchorY);
      o.bottom = t.y - t.height * t.anchorY;
    } else {
      o.left = t.x - t.width * t.anchorX;
      o.right = t.x + t.width * (1 - t.anchorX);
    }
    return o;
  }
  getItemPos(e) {
    return this._virtual ? this._calcItemPos(e) : this.frameByFrameRenderNum ? this._calcItemPos(e) : this._calcExistItemPos(e);
  }
  _getFixedSize(e) {
    if (!this._customSize) return null;
    null == e && (e = this._numItems);
    var t = 0,
      o = 0;
    for (var n in this._customSize) if (parseInt(n) < e) {
      t += this._customSize[n];
      o++;
    }
    return {
      val: t,
      count: o
    };
  }
  _onScrollBegan() {
    this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
  }
  _onScrollEnded() {
    var e = this;
    e.curScrollIsTouch = false;
    if (null != e.scrollToListId) {
      var t = e.getItemByListId(e.scrollToListId);
      e.scrollToListId = null;
      t && cc.tween(t).to(0.1, {
        scale: 1.06
      }).to(0.1, {
        scale: 1
      }).start();
    }
    e._onScrolling();
    if (e._slideMode != c.ADHERING || e.adhering) {
      e._slideMode == c.PAGE && (null != e._beganPos && e.curScrollIsTouch ? this._pageAdhere() : e.adhere());
    } else {
      e.adhere();
    }
  }
  _onTouchStart(e, t) {
    if (!this._scrollView._hasNestedViewGroup(e, t)) {
      this.curScrollIsTouch = true;
      if (e.eventPhase !== cc.Event.AT_TARGET || e.target !== this.node) {
        for (var o = e.target; null == o._listId && o.parent;) o = o.parent;
        this._scrollItem = null != o._listId ? o : e.target;
      }
    }
  }
  _onTouchUp() {
    var e = this;
    e._scrollPos = null;
    if (e._slideMode == c.ADHERING) {
      this.adhering && (this._adheringBarrier = true);
      e.adhere();
    } else e._slideMode == c.PAGE && (null != e._beganPos ? this._pageAdhere() : e.adhere());
    this._scrollItem = null;
  }
  _onTouchCancelled(e, t) {
    var o = this;
    if (!o._scrollView._hasNestedViewGroup(e, t) && !e.simulate) {
      o._scrollPos = null;
      if (o._slideMode == c.ADHERING) {
        o.adhering && (o._adheringBarrier = true);
        o.adhere();
      } else o._slideMode == c.PAGE && (null != o._beganPos ? o._pageAdhere() : o.adhere());
      this._scrollItem = null;
    }
  }
  _onSizeChanged() {
    this.checkInited(false) && this._onScrolling();
  }
  _onItemAdaptive(e) {
    if (!this._sizeType && e.width != this._itemSize.width || this._sizeType && e.height != this._itemSize.height) {
      this._customSize || (this._customSize = {});
      var t = this._sizeType ? e.height : e.width;
      if (this._customSize[e._listId] != t) {
        this._customSize[e._listId] = t;
        this._resizeContent();
        this.updateAll();
        if (null != this._scrollToListId) {
          this._scrollPos = null;
          this.unschedule(this._scrollToSo);
          this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1000));
        }
      }
    }
  }
  _pageAdhere() {
    var e = this;
    if (e.cyclic || !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
      var t = e._sizeType ? e.viewTop : e.viewLeft,
        o = (e._sizeType ? e.node.height : e.node.width) * e.pageDistance;
      if (Math.abs(e._beganPos - t) > o) switch (e._alignCalcType) {
        case 1:
        case 4:
          if (e._beganPos > t) {
            e.prePage(0.5);
          } else {
            e.nextPage(0.5);
          }
          break;
        case 2:
        case 3:
          if (e._beganPos < t) {
            e.prePage(0.5);
          } else {
            e.nextPage(0.5);
          }
      } else e.elasticTop <= 0 && e.elasticRight <= 0 && e.elasticBottom <= 0 && e.elasticLeft <= 0 && e.adhere();
      e._beganPos = null;
    }
  }
  adhere() {
    var e = this;
    if (e.checkInited() && !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
      e.adhering = true;
      e._calcNearestItem();
      var t = (e._sizeType ? e._topGap : e._leftGap) / (e._sizeType ? e.node.height : e.node.width);
      e.scrollTo(e.nearestListId, 0.7, t);
    }
  }
  update() {
    if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) if (this._virtual) {
      for (var e = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum, t = this._updateCounter; t < e; t++) {
        var o = this.displayData[t];
        o && this._createOrUpdateItem(o);
      }
      if (this._updateCounter >= this.displayItemNum - 1) {
        if (this._doneAfterUpdate) {
          this._updateCounter = 0;
          this._updateDone = false;
          this._doneAfterUpdate = false;
        } else {
          this._updateDone = true;
          this._delRedundantItem();
          this._forceUpdate = false;
          this._calcNearestItem();
          this.slideMode == c.PAGE && (this.curPageNum = this.nearestListId);
        }
      } else this._updateCounter += this.frameByFrameRenderNum;
    } else if (this._updateCounter < this._numItems) {
      for (e = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum, t = this._updateCounter; t < e; t++) this._createOrUpdateItem2(t);
      this._updateCounter += this.frameByFrameRenderNum;
    } else {
      this._updateDone = true;
      this._calcNearestItem();
      this.slideMode == c.PAGE && (this.curPageNum = this.nearestListId);
    }
  }
  _createOrUpdateItem(e) {
    var t = this.getItemByListId(e.id);
    if (t) {
      if (this._forceUpdate && this.renderEvent) {
        t.setPosition(cc.v2(e.x, e.y));
        this._resetItemSize(t);
        this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], t, e.id % this._actualNumItems);
      }
    } else {
      var o = this._pool.size() > 0;
      t = o ? this._pool.get() : cc.instantiate(this._itemTmp);
      if (!o || !cc.isValid(t)) {
        t = cc.instantiate(this._itemTmp);
        o = false;
      }
      if (t._listId != e.id) {
        t._listId = e.id;
        t.setContentSize(this._itemSize);
      }
      t.setPosition(cc.v2(e.x, e.y));
      this._resetItemSize(t);
      this.content.addChild(t);
      if (o && this._needUpdateWidget) {
        var n = t.getComponent(cc.Widget);
        n && n.updateAlignment();
      }
      t.setSiblingIndex(this.content.childrenCount - 1);
      var a = t.getComponent(ListItem);
      t.listItem = a;
      if (a) {
        a.listId = e.id;
        a.list = this;
        a._registerEvent();
      }
      this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], t, e.id % this._actualNumItems);
    }
    this._resetItemSize(t);
    this._updateListItem(t.listItem);
    this._lastDisplayData.indexOf(e.id) < 0 && this._lastDisplayData.push(e.id);
  }
  _createOrUpdateItem2(e) {
    var t,
      o = this.content.children[e];
    if (o) {
      if (this._forceUpdate && this.renderEvent) {
        o._listId = e;
        t && (t.listId = e);
        this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], o, e % this._actualNumItems);
      }
    } else {
      (o = cc.instantiate(this._itemTmp))._listId = e;
      this.content.addChild(o);
      t = o.getComponent(ListItem);
      o.listItem = t;
      if (t) {
        t.listId = e;
        t.list = this;
        t._registerEvent();
      }
      this.renderEvent && cc.Component.EventHandler.emitEvents([this.renderEvent], o, e % this._actualNumItems);
    }
    this._updateListItem(t);
    this._lastDisplayData.indexOf(e) < 0 && this._lastDisplayData.push(e);
  }
  _updateListItem(e) {
    if (e && this.selectedMode > s.NONE) {
      var t = e.node;
      switch (this.selectedMode) {
        case s.SINGLE:
          e.selected = this.selectedId == t._listId;
          break;
        case s.MULT:
          e.selected = this.multSelected.indexOf(t._listId) >= 0;
      }
    }
  }
  _resetItemSize() {}
  _updateItemPos(e) {
    var t = isNaN(e) ? e : this.getItemByListId(e),
      o = this.getItemPos(t._listId);
    t.setPosition(o.x, o.y);
  }
  setMultSelected(e, t) {
    var o = this;
    if (o.checkInited()) {
      Array.isArray(e) || (e = [e]);
      if (null == t) o.multSelected = e;else {
        var n = void 0,
          a = void 0;
        if (t) for (var i = e.length - 1; i >= 0; i--) {
          n = e[i];
          (a = o.multSelected.indexOf(n)) < 0 && o.multSelected.push(n);
        } else for (i = e.length - 1; i >= 0; i--) {
          n = e[i];
          (a = o.multSelected.indexOf(n)) >= 0 && o.multSelected.splice(a, 1);
        }
      }
      o._forceUpdate = true;
      o._onScrolling();
    }
  }
  getMultSelected() {
    return this.multSelected;
  }
  hasMultSelected(e) {
    return this.multSelected && this.multSelected.indexOf(e) >= 0;
  }
  updateItem(e) {
    if (this.checkInited()) {
      Array.isArray(e) || (e = [e]);
      for (var t = 0, o = e.length; t < o; t++) {
        var n = e[t],
          a = this.getItemByListId(n);
        a && cc.Component.EventHandler.emitEvents([this.renderEvent], a, n % this._actualNumItems);
      }
    }
  }
  updateAll() {
    this.checkInited() && (this.numItems = this.numItems);
  }
  getItemByListId(e) {
    if (this.content) for (var t = this.content.childrenCount - 1; t >= 0; t--) {
      var o = this.content.children[t];
      if (o._listId == e) return o;
    }
  }
  _getOutsideItem() {
    for (var e, t = [], o = this.content.childrenCount - 1; o >= 0; o--) {
      e = this.content.children[o];
      this.displayData.find(function (t) {
        return t.id == e._listId;
      }) || t.push(e);
    }
    return t;
  }
  _delRedundantItem() {
    if (this._virtual) for (var e = this._getOutsideItem(), t = e.length - 1; t >= 0; t--) {
      var o = e[t];
      if (!this._scrollItem || o._listId != this._scrollItem._listId) {
        o.isCached = true;
        this._pool.put(o);
        for (var n = this._lastDisplayData.length - 1; n >= 0; n--) if (this._lastDisplayData[n] == o._listId) {
          this._lastDisplayData.splice(n, 1);
          break;
        }
      }
    } else for (; this.content.childrenCount > this._numItems;) this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
  }
  _delSingleItem(e) {
    e.removeFromParent();
    e.destroy && e.destroy();
    e = null;
  }
  aniDelItem(e, t, o) {
    var n = this;
    if (!n.checkInited() || n.cyclic || !n._virtual) return cc.error("This function is not allowed to be called!");
    if (!t) return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
    if (n._aniDelRuning) return cc.warn("Please wait for the current deletion to finish!");
    var a,
      i = n.getItemByListId(e);
    if (i) {
      a = i.getComponent(ListItem);
      n._aniDelRuning = true;
      n._aniDelCB = t;
      n._aniDelItem = i;
      n._aniDelBeforePos = i.position;
      n._aniDelBeforeScale = i.scale;
      var r = n.displayData[n.displayData.length - 1].id,
        c = a.selected;
      a.showAni(o, function () {
        var o, a, l;
        r < n._numItems - 2 && (o = r + 1);
        if (null != o) {
          var u = n._calcItemPos(o);
          n.displayData.push(u);
          if (n._virtual) {
            n._createOrUpdateItem(u);
          } else {
            n._createOrUpdateItem2(o);
          }
        } else n._numItems--;
        if (n.selectedMode == s.SINGLE) {
          if (c) {
            n._selectedId = -1;
          } else {
            n._selectedId - 1 >= 0 && n._selectedId--;
          }
        } else if (n.selectedMode == s.MULT && n.multSelected.length) {
          var p = n.multSelected.indexOf(e);
          p >= 0 && n.multSelected.splice(p, 1);
          for (var d = n.multSelected.length - 1; d >= 0; d--) (g = n.multSelected[d]) >= e && n.multSelected[d]--;
        }
        if (n._customSize) {
          n._customSize[e] && delete n._customSize[e];
          var f = {},
            h = void 0;
          for (var g in n._customSize) {
            h = n._customSize[g];
            var _ = parseInt(g);
            f[_ - (_ >= e ? 1 : 0)] = h;
          }
          n._customSize = f;
        }
        for (d = null != o ? o : r; d >= e + 1; d--) if (i = n.getItemByListId(d)) {
          var y = n._calcItemPos(d - 1);
          a = cc.tween(i).to(0.2333, {
            position: cc.v2(y.x, y.y)
          });
          if (d <= e + 1) {
            l = true;
            a.call(function () {
              n._aniDelRuning = false;
              t(e);
              delete n._aniDelCB;
            });
          }
          a.start();
        }
        if (!l) {
          n._aniDelRuning = false;
          t(e);
          n._aniDelCB = null;
        }
      }, true);
    } else t(e);
  }
  scrollTo(e, t = 0.5, o = null, n = false) {
    var a = this;
    if (a.checkInited(false)) {
      if (null == t) {
        t = 0.5;
      } else {
        t < 0 && (t = 0);
      }
      if (e < 0) {
        e = 0;
      } else {
        e >= a._numItems && (e = a._numItems - 1);
      }
      !a._virtual && a._layout && a._layout.enabled && a._layout.updateLayout();
      var i,
        r,
        c = a.getItemPos(e);
      if (!c) return false;
      switch (a._alignCalcType) {
        case 1:
          i = c.left;
          i -= null != o ? a.node.width * o : a._leftGap;
          c = cc.v2(i, 0);
          break;
        case 2:
          i = c.right - a.node.width;
          i += null != o ? a.node.width * o : a._rightGap;
          c = cc.v2(i + a.content.width, 0);
          break;
        case 3:
          r = c.top;
          r += null != o ? a.node.height * o : a._topGap;
          c = cc.v2(0, -r);
          break;
        case 4:
          r = c.bottom + a.node.height;
          r -= null != o ? a.node.height * o : a._bottomGap;
          c = cc.v2(0, -r + a.content.height);
      }
      var s = a.content.getPosition();
      s = Math.abs(a._sizeType ? s.y : s.x);
      var l = a._sizeType ? c.y : c.x;
      if (Math.abs((null != a._scrollPos ? a._scrollPos : s) - l) > 0.5) {
        a._scrollView.scrollToOffset(c, t);
        a._scrollToListId = e;
        a._scrollToEndTime = new Date().getTime() / 1000 + t;
        a._scrollToSo = a.scheduleOnce(function () {
          a._adheringBarrier || (a.adhering = a._adheringBarrier = false);
          a._scrollPos = a._scrollToListId = a._scrollToEndTime = a._scrollToSo = null;
          if (n) {
            var t = a.getItemByListId(e);
            t && cc.tween(t).to(0.1, {
              scale: 1.05
            }).to(0.1, {
              scale: 1
            }).start();
          }
        }, t + 0.1);
        t <= 0 && a._onScrolling();
      }
    }
  }
  _calcNearestItem() {
    var e,
      t,
      o,
      n,
      a,
      i,
      r = this;
    r.nearestListId = null;
    r._virtual && r._calcViewPos();
    o = r.viewTop;
    n = r.viewRight;
    a = r.viewBottom;
    i = r.viewLeft;
    for (var c = false, s = 0; s < r.content.childrenCount && !c; s += r._colLineNum) if (e = r._virtual ? r.displayData[s] : r._calcExistItemPos(s)) {
      t = r._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
      switch (r._alignCalcType) {
        case 1:
          if (e.right >= i) {
            r.nearestListId = e.id;
            i > t && (r.nearestListId += r._colLineNum);
            c = true;
          }
          break;
        case 2:
          if (e.left <= n) {
            r.nearestListId = e.id;
            n < t && (r.nearestListId += r._colLineNum);
            c = true;
          }
          break;
        case 3:
          if (e.bottom <= o) {
            r.nearestListId = e.id;
            o < t && (r.nearestListId += r._colLineNum);
            c = true;
          }
          break;
        case 4:
          if (e.top >= a) {
            r.nearestListId = e.id;
            a > t && (r.nearestListId += r._colLineNum);
            c = true;
          }
      }
    }
    if ((e = r._virtual ? r.displayData[r.displayItemNum - 1] : r._calcExistItemPos(r._numItems - 1)) && e.id == r._numItems - 1) {
      t = r._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
      switch (r._alignCalcType) {
        case 1:
          n > t && (r.nearestListId = e.id);
          break;
        case 2:
          i < t && (r.nearestListId = e.id);
          break;
        case 3:
          a < t && (r.nearestListId = e.id);
          break;
        case 4:
          o > t && (r.nearestListId = e.id);
      }
    }
  }
  prePage(e = 0.5) {
    this.checkInited() && this.skipPage(this.curPageNum - 1, e);
  }
  nextPage(e = 0.5) {
    this.checkInited() && this.skipPage(this.curPageNum + 1, e);
  }
  skipPage(e, t) {
    var o = this;
    if (o.checkInited()) {
      if (o._slideMode != c.PAGE) return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
      if (!(e < 0 || e >= o._numItems) && o.curPageNum != e) {
        o.curPageNum = e;
        o.pageChangeEvent && cc.Component.EventHandler.emitEvents([o.pageChangeEvent], e);
        o.scrollTo(e, t);
      }
    }
  }
  calcCustomSize(e) {
    var t = this;
    if (t.checkInited()) {
      if (!t._itemTmp) return cc.error("Unset template item!");
      if (!t.renderEvent) return cc.error("Unset Render-Event!");
      t._customSize = {};
      var o = cc.instantiate(t._itemTmp);
      t.content.addChild(o);
      for (var n = 0; n < e; n++) {
        cc.Component.EventHandler.emitEvents([t.renderEvent], o, n);
        o.height == t._itemSize.height && o.width == t._itemSize.width || (t._customSize[n] = t._sizeType ? o.height : o.width);
      }
      Object.keys(t._customSize).length || (t._customSize = null);
      o.removeFromParent();
      o.destroy && o.destroy();
      return t._customSize;
    }
  }
}