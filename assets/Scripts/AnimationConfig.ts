const {
  ccclass,
  property
} = cc._decorator;
export enum AnimMode {
  SEQUENCE = 0,
  PARALLEL = 1,
}
export enum AnimType {
  MOVE = 0,
  ROTATE = 1,
  SCALE = 2,
  FADE = 3,
}
export enum EasingType {
  quadIn = 0,
  quadOut = 1,
  quadInOut = 2,
  cubicIn = 3,
  cubicOut = 4,
  cubicInOut = 5,
  quartIn = 6,
  quartOut = 7,
  quartInOut = 8,
  quintIn = 9,
  quintOut = 10,
  quintInOut = 11,
  sineIn = 12,
  sineOut = 13,
  sineInOut = 14,
  expoIn = 15,
  expoOut = 16,
  expoInOut = 17,
  circIn = 18,
  circOut = 19,
  circInOut = 20,
  linear = 21,
}
@ccclass("AnimationConfig")
export default class AnimationConfig {
  @property({
    type: cc.Enum(AnimType),
    tooltip: "动画类型"
  })
  type: number = AnimType.MOVE;
  @property({
    tooltip: "延迟开始时间（秒）"
  })
  delay = 0;
  @property({
    tooltip: "动画持续时间（秒）"
  })
  duration = 0.5;
  @property({
    type: cc.Enum(AnimMode),
    tooltip: "执行模式"
  })
  mode: number = AnimMode.SEQUENCE;
  @property({
    type: cc.Enum(EasingType),
    tooltip: "缓动曲线类型"
  })
  easing: number = EasingType.quadOut;
  @property({
    type: cc.Vec2,
    visible: function () {
      return this.type === AnimType.MOVE;
    },
    tooltip: "目标位置"
  })
  targetPosition: cc.Vec2 = cc.v2(0, 0);
  @property({
    type: cc.Vec2,
    visible: function () {
      return this.type === AnimType.MOVE;
    },
    tooltip: "起始位置（留空使用当前位置）"
  })
  startPosition: cc.Vec2 = null;
  @property({
    visible: function () {
      return this.type === AnimType.ROTATE;
    },
    tooltip: "目标角度（度数）"
  })
  targetRotation = 0;
  @property({
    visible: function () {
      return this.type === AnimType.ROTATE;
    },
    tooltip: "起始角度（留空使用当前角度）"
  })
  startRotation = 0;
  @property({
    type: cc.Vec2,
    visible: function () {
      return this.type === AnimType.SCALE;
    },
    tooltip: "目标缩放"
  })
  targetScale: cc.Vec2 = cc.v2(1, 1);
  @property({
    type: cc.Vec2,
    visible: function () {
      return this.type === AnimType.SCALE;
    },
    tooltip: "起始缩放（留空使用当前缩放）"
  })
  startScale: cc.Vec2 = null;
  @property({
    visible: function () {
      return this.type === AnimType.FADE;
    },
    tooltip: "目标透明度（0-255）"
  })
  targetOpacity = 255;
  @property({
    visible: function () {
      return this.type === AnimType.FADE;
    },
    tooltip: "起始透明度（留空使用当前透明度）"
  })
  startOpacity = -1;
}