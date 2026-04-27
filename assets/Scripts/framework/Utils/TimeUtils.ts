export default class TimeUtils {
  static getTimeInMilliseconds() {
    return +new Date();
  }
  static getTimeinSeconds() {
    return Math.floor(+new Date() / 1000);
  }
  static getTimestamp() {
    return new Date().getTime();
  }
  static getDate() {
    var e = new Date();
    return e.getFullYear() + "/" + (e.getMonth() + 1).toString().padStart(2, "0") + "/" + e.getDate().toString().padStart(2, "0");
  }
  static getDate2() {
    var e = new Date();
    return e.getFullYear() + "年" + (e.getMonth() + 1).toString().padStart(2, "0") + "月" + e.getDate().toString().padStart(2, "0") + "日";
  }
  static getTargetTimestamp(e = 0, t = 0, o = 0) {
    var n = new Date(new Date().toLocaleDateString()).getTime();
    return new Date(n + 1000 * (3600 * e + 60 * t + o)).getTime();
  }
  static msToHMS(e, t = ":", o = true) {
    var n = Math.floor(e / 3600000),
      a = Math.floor((e - 3600000 * n) / 60000),
      i = Math.floor((e - 3600000 * n - 60000 * a) / 1000);
    return (0 !== n || o ? n.toString().padStart(2, "0") + ":" : "") + a.toString().padStart(2, "0") + t + i.toString().padStart(2, "0");
  }
  static secondsToHMS(e, t = true) {
    if (e < 60 && t) return "00:" + ((n = e) < 10 ? "0" + n : n);
    if (e < 60 && !t) return "00:" + ((n = e) < 10 ? "0" + n : n);
    if (!t && e < 3600) return ((o = Math.floor(e / 60)) < 10 ? "0" + o : o) + ":" + ((n = e % 60) < 10 ? "0" + n : n);
    if (e < 3600) return ((o = Math.floor(e / 60)) < 10 ? "0" + o : o) + ":" + ((n = e % 60) < 10 ? "0" + n : n);
    var o,
      n,
      a = Math.floor(e / 3600);
    return (a < 10 ? "0" + a : a) + ":" + ((o = Math.floor(e % 3600 / 60)) < 10 ? "0" + o : o) + ":" + ((n = e % 60) < 10 ? "0" + n : n);
  }
  static getUTCTime() {
    var e = new Date(),
      t = new Date(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds()).getTime();
    return Math.floor(t / 1000);
  }
  static formatSeconds(e) {
    var t = Math.floor(e),
      o = 0,
      n = 0,
      a = 0;
    if (t > 60) {
      o = Math.floor(t / 60);
      t = Math.floor(t % 60);
      if (o > 60) {
        n = Math.floor(o / 60);
        o = Math.floor(o % 60);
        if (n > 24) {
          a = Math.floor(n / 24);
          n = Math.floor(n % 24);
        }
      }
    }
    var i = "";
    t > 0 && (i = Math.floor(t) + "秒");
    o > 0 && (i = Math.floor(o) + "分" + i);
    n > 0 && (i = Math.floor(n) + "小时" + i);
    a > 0 && (i = Math.floor(a) + "天" + i);
    return i;
  }
  static getDateString() {
    var e = new Date(),
      t = e.getHours(),
      o = e.getMinutes(),
      n = e.getSeconds();
    return (t < 10 ? "0" + t : t) + ":" + (o < 10 ? "0" + o : o) + ":" + (n < 10 ? "0" + n : n);
  }
}