export var Constants = {
  isSpecialCard: function (e) {
    return e >= 101 && e <= 104;
  },
  Clamp01: function (e) {
    return Math.max(0, Math.min(1, e));
  },
  BottleZIndex: {
    Normal: 1,
    Complete: 400,
    CompleteEffect: 999,
    Obstacle: 100,
    UnLockObstacle: 101,
    Click: 9999
  },
  ComboInterval: 3,
  FreezeTime: 30
};