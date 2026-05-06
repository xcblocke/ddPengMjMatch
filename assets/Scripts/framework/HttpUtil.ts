import UrlMgr from "../service/UrlMgr";
import OfflineService from "../service/OfflineService";
import HotUpdate from "./Event/HotUpdate";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";

const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class HttpUtil {
    static Post(e, t, o = false) {
        // 本地调试开关：关闭所有真实 HTTP 请求，统一走本地模拟
        const DISABLE_HTTP_REQUEST = true;
        if (DISABLE_HTTP_REQUEST) {
            return OfflineService.handlePost(e, t).catch(function () {
                return {
                    code: 1,
                    data: {},
                    ecp: 0,
                    message: "local mock fallback"
                };
            });
        }
        if (!o && OfflineService.shouldHandlePost(e)) {
            return OfflineService.handlePost(e, t);
        }
        console.log("http ............  post .....................",e, t, o)
        var n = 9999,
            s = Date.now();
        return new Promise(function (i, c) {
            var s = new XMLHttpRequest();
            s.onreadystatechange = function () {
                if (4 == s.readyState) {
                    n = s.status;
                    if (s.status >= 200 && s.status < 400) {
                        var t = s.responseText;
                        if (t) {
                            var o = JSON.parse(t),
                                l = o;
                            if (o && o.ecp) {
                                l = SdkHelper.getAesDncrypData(o.data);
                                l = JSON.parse(l);
                            }
                            o && !o.ecp && console.log("不解密");
                            console.log("网络 ", e, JSON.stringify(l));
                            if (e.includes(UrlMgr.getInstance().baseTestUrl) || e.includes(UrlMgr.getInstance().baseUrl)) {
                                var u = l.code;
                                if (u < 0 && -1010 != u) {
                                    if (-2015 == u || -3000 == u) {
                                        SdkHelper.showToast(l.message);
                                        return;
                                    }
                                    SdkHelper.showToast(l.message);
                                    c(l);
                                    return;
                                }
                                i(l);
                                return;
                            }
                            i(l);
                        } else {
                            console.log(`data not exist`);
                            c({
                                code: -1,
                                message: "data not exist",
                                http_status: s.status
                            });
                        }
                    } else {
                        console.log("request error");
                        c({
                            code: -1,
                            message: "xhr.status" + s.status,
                            http_status: s.status
                        });
                    }
                }
            };
            s.open("POST", e, true);
            s.setRequestHeader("Content-type", "multipart/form-data;boundary=AaB03x");
            SdkHelper.setXhrCookie(s);
            if (o) {
                s.send(t.arrayBuffer_confme());
            } else {
                s.send(t.arrayBuffer());
            }
            s.addEventListener("abort", function () {
                c({
                    code: -1,
                    message: "onXhr.abort",
                    http_status: s.status
                });
            });
            s.addEventListener("error", function () {
                c({
                    code: -1,
                    message: "onXhr.error",
                    http_status: s.status
                });
            });
            s.addEventListener("timeout", function () {
                c({
                    code: -1,
                    message: "onXhr.timeout",
                    http_status: s.status
                });
            });
        }).finally(function () {
            if (HotUpdate.getInstance().isOnlineRelease() && EngineUtil.getRandomNum(1, 100) <= 5) {
                var t = Date.now() - s;
                SdkHelper.reportData("http_monitor", {
                    request_path: e,
                    response_code: n,
                    response_time: t
                });
            }
        });
    }

    static Get(e, t, o) {
        // 本地调试开关：关闭所有真实 HTTP GET 请求
        const DISABLE_HTTP_REQUEST = true;
        if (DISABLE_HTTP_REQUEST) {
            o && o({
                code: 1,
                data: {}
            });
            return;
        }
        var n = new XMLHttpRequest();
        n.timeout = 30000;
        n.ontimeout = function () {
            cc.log("[tydf.https] get: request time out.");
            o && o(false);
        };
        n.onreadystatechange = function () {
            if (4 === n.readyState && o) if (200 == n.status) {
                var e = JSON.parse(n.responseText);
                o && o(e);
            } else o && o(false);
        };
        n.onerror = function () {
            console.log("There was an error!");
            o && o(false);
        };
        n.open("GET", encodeURI(e), true);
        n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        n.send();
    }
}
