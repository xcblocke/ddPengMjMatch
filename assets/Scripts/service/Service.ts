import ClientData from "../framework/Event/ClientData";
import SdkHelper from "../framework/SdkHelper";
import TimeUtils from "../framework/Utils/TimeUtils";
import HttpUtil from "../framework/HttpUtil";
import {RequestType} from "./RequestType";
import UrlMgr from "./UrlMgr";
import EngineUtil from "../framework/EngineUtil";
import GlobaldataMgr from "../framework/data/GlobaldataMgr";
import GlobalDataSys from "../framework/controller/GlobalDataSys";
import PlayerDataSys from "../framework/controller/PlayerDataSys";
import {gameData} from "../data/GameData";

export default class Service {
    static genCommonRequestData() {
        return ClientData.genFormData();
    }

    static getRequestData(e) {
        GlobalDataSys.dev_token || GlobalDataSys.initToken(SdkHelper.getDev_token() || "");
        e = Object.assign(Object.assign({}, e), {
            forbid_red_envelope: GlobaldataMgr.reviewing,
            antian_flag: GlobaldataMgr.reviewing_antian
        });
        GlobalDataSys.dev_token && (e.dev_token = GlobalDataSys.dev_token);
        var t = this.genCommonRequestData();
        if (e) {
            e = GlobaldataMgr.is_encrypt ? SdkHelper.getAesEncrypData(e) : JSON.stringify(e);
            t.append("business_data", e);
        }
        return t;
    }

    static getConfmeData(e) {
        var t = this.genCommonRequestData();
        if (e) {
            e = JSON.stringify(e);
            t.append("business_data", e);
        }
        return t;
    }

    static commonApiPost(t, o) {
        var n = Service.getRequestData(o);
        return HttpUtil.Post(Service.genRequestUrl(t), n);
    }

    static genSign(e, t, o) {
        for (var n = ["version_name", "channel_name", "device_id", "time"], a = "/" + UrlMgr.getInstance().getUri(e), i = 0; i < n.length; i++) {
            var c = n[i];
            if ("time" == c) a += " " + t; else {
                var s = ClientData.getAttr(c);
                a += "" != s && null != s ? " " + s : " null";
            }
        }
        a += " " + o;
        a += " gohell";
        var l = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(a));
        return l.replace(new RegExp("\\+", "g"), "-").replace(new RegExp("/", "g"), "_").replace(new RegExp("=", "g"), "");
    }

    static uuid() {
        for (var e = [], t = 0; t < 36; t++) e[t] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
        e[14] = "4";
        e[19] = "0123456789abcdef".substr(3 & e[19] | 8, 1);
        e[8] = e[13] = e[18] = e[23] = "-";
        return e.join("");
    }

    static getCommonUrlData(t) {
        var o = SdkHelper.getUrlSplicingString(),
            n = "/" + UrlMgr.getInstance().getUri(t);
        if (null != o) {
            var a;
            a = TimeUtils.getTimeinSeconds() + 120;
            var i = Service.uuid();
            o += "&nonce_str=" + i + "&et=" + a + "&ngister=" + SdkHelper.getNgister(n, a, i);
        }
        return o;
    }

    static genRequestUrl(t) {
        var o = UrlMgr.getInstance().getUrl(t),
            n = Service.getCommonUrlData(t);
        EngineUtil.log("genRequestUrl----", o);
        return n ? o + "?" + n : o;
    }

    static getConfmeUrl(t) {
        var o = UrlMgr.getInstance().getConfmeUrl(t),
            n = Service.getCommonUrlData(t);
        EngineUtil.log("genRequestUrl----", o);
        return n ? o + "?" + n : o;
    }

    static getSystemConfig() {
      
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetSystemConfig), t);
    }

    static autoLogin(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.AutoLogin), o);
    }

    static touristsLogin(t) {
       
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.TouristLogin), o);
    }

    static wechatLogin(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.WeChatLogin), o);
    }

    static wechatBind(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.BindWeChat), o);
    }

    static getUserInfo() {
      
        //     "code": 1, "data": {
        //         "ab_info": {},
        //         "big_scroll_xc_count": 9,
        //         "bind_wx": 0,
        //         "coin_balance": 0,
        //         "coin_extract_desc": "\n        1.由于微信支付需要实名制,非实名用户账号无法支持提现,请务必将提现的微信号进行实名认证;\n        2.由于微信官方要求，单笔提现金额最低为0.1元;\n        3.提现申请一般是秒到账,如果突发意外情况,也会在1-3个工作日内审核到账,请耐心等待;\n        4.用户达成提现要求即可提现到账,为保障全体用户利益,对有作弊嫌疑的用户,需经过审核验证或者满足活跃条件才可全部提现,否则不能提现;\n        5.若发现用户有恶意作弊行为,一律封禁账号并扣除账户所有余额。\n    ",
        //         "coin_limit": 8000,
        //         "conf_info": {
        //             "atlas_conf": {
        //                 "1": {"if_unlock": 1, "level_count_limit": 0, "money": 0, "name": "经典", "type": 1},
        //                 "2": {"if_unlock": 0, "level_count_limit": 40, "money": 0, "name": "木纹", "type": 1},
        //                 "3": {"if_unlock": 0, "level_count_limit": 80, "money": 0, "name": "翡翠", "type": 1},
        //                 "4": {"if_unlock": 1, "level_count_limit": 0, "money": 0, "name": "经典木纹", "type": 2},
        //                 "5": {"if_unlock": 0, "level_count_limit": 23, "money": 0, "name": "瑞雪暖冬", "type": 2},
        //                 "6": {"if_unlock": 0, "level_count_limit": 60, "money": 0, "name": "清风明月", "type": 2},
        //                 "7": {"if_unlock": 0, "level_count_limit": 97, "money": 10, "name": "璀璨星河", "type": 2},
        //                 "8": {"if_unlock": 1, "level_count_limit": 0, "money": 0, "name": "春夏秋冬", "type": 3},
        //                 "9": {"if_unlock": 0, "level_count_limit": 5, "money": 0, "name": "柴米油盐", "type": 3},
        //                 "10": {"if_unlock": 0, "level_count_limit": 11, "money": 0, "name": "刀枪剑戟", "type": 3},
        //                 "11": {"if_unlock": 0, "level_count_limit": 18, "money": 0, "name": "琴棋书画", "type": 3},
        //                 "12": {"if_unlock": 0, "level_count_limit": 26, "money": 0, "name": "梅兰竹菊", "type": 3},
        //                 "13": {"if_unlock": 0, "level_count_limit": 35, "money": 0, "name": "四大神兽", "type": 3},
        //                 "14": {"if_unlock": 0, "level_count_limit": 45, "money": 0, "name": "节日庆典", "type": 3},
        //                 "15": {"if_unlock": 0, "level_count_limit": 56, "money": 0, "name": "生旦净末", "type": 3},
        //                 "16": {"if_unlock": 0, "level_count_limit": 68, "money": 0, "name": "新春限定", "type": 3},
        //                 "17": {"if_unlock": 0, "level_count_limit": 81, "money": 0, "name": "特色建筑", "type": 3},
        //                 "18": {"if_unlock": 0, "level_count_limit": 95, "money": 0, "name": "零嘴小吃", "type": 3},
        //                 "19": {"if_unlock": 0, "level_count_limit": 110, "money": 0, "name": "中秋佳节1", "type": 3},
        //                 "20": {"if_unlock": 0, "level_count_limit": 126, "money": 0, "name": "生肖动物1", "type": 3},
        //                 "21": {"if_unlock": 0, "level_count_limit": 143, "money": 0, "name": "健康蔬菜", "type": 3},
        //                 "22": {"if_unlock": 0, "level_count_limit": 161, "money": 0, "name": "日常农具", "type": 3},
        //                 "23": {"if_unlock": 0, "level_count_limit": 180, "money": 0, "name": "生肖动物2", "type": 3},
        //                 "24": {"if_unlock": 0, "level_count_limit": 200, "money": 0, "name": "缤纷水果", "type": 3},
        //                 "25": {"if_unlock": 0, "level_count_limit": 221, "money": 0, "name": "生肖动物3", "type": 3},
        //                 "26": {"if_unlock": 0, "level_count_limit": 243, "money": 0, "name": "中秋佳节2", "type": 3},
        //                 "27": {"if_unlock": 0, "level_count_limit": 265, "money": 10, "name": "国内建筑", "type": 3},
        //                 "28": {"if_unlock": 0, "level_count_limit": 120, "money": 10, "name": "马年限定", "type": 1}
        //             },
        //             "card_conf": {
        //                 "1": {"cardId": [1, 4, 6, 7, 8, 9, 21, 22, 23, 25, 26, 27, 28, 11, 12, 13, 15, 16, 17, 18, 34, 35, 36, 37, 31, 32, 33, 41, 45, 101, 102, 103, 104]},
        //                 "2": {"cardId": [2, 4, 6, 7, 8, 9, 21, 22, 24, 26, 27, 28, 29, 12, 13, 15, 17, 18, 19, 34, 35, 36, 37, 31, 32, 33, 42, 46, 101, 102, 103, 104]},
        //                 "3": {"cardId": [1, 3, 4, 5, 6, 7, 9, 21, 23, 25, 26, 28, 29, 11, 13, 14, 16, 17, 18, 19, 34, 35, 36, 37, 31, 32, 33, 43, 47, 101, 102, 103, 104]},
        //                 "4": {"cardId": [1, 3, 4, 6, 8, 9, 21, 23, 25, 26, 27, 28, 11, 12, 13, 15, 16, 17, 19, 34, 35, 36, 37, 31, 32, 33, 44, 48, 101, 102, 103, 104]},
        //                 "5": {"cardId": [1, 5, 9, 21, 25, 29, 11, 15, 19, 35, 36, 31, 32, 33, 41, 101, 102, 103, 104]},
        //                 "6": {"cardId": [2, 4, 8, 22, 25, 28, 12, 15, 18, 34, 37, 31, 32, 33, 42, 101, 102, 103, 104]},
        //                 "7": {"cardId": [3, 6, 7, 21, 23, 26, 13, 16, 19, 34, 35, 31, 32, 33, 43, 101, 102, 103, 104]},
        //                 "8": {"cardId": [1, 4, 9, 44, 36, 37, 24, 27, 29, 11, 14, 17, 31, 32, 33, 101, 102, 103, 104]}
        //             },
        //             "combo_conf": {
        //                 "1": {"count_max": 5, "count_min": 0, "time_limit": 8},
        //                 "2": {"count_max": 7, "count_min": 5, "time_limit": 7},
        //                 "3": {"count_max": 999, "count_min": 7, "time_limit": 5}
        //             },
        //             "level_conf": {
        //                 "1": {
        //                     "0_pair_count": 1,
        //                     "1_pair_count": 2,
        //                     "2_pair_count": 3,
        //                     "card_group_id": 8,
        //                     "card_pair_count": 6,
        //                     "card_type_count": 5,
        //                     "size": "6*6",
        //                     "special_pair_count": 1,
        //                     "time": 300
        //                 },
        //                 "2": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 6,
        //                     "2_pair_count": 6,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 18,
        //                     "card_type_count": 7,
        //                     "size": "6*6",
        //                     "special_pair_count": 4,
        //                     "time": 300
        //                 },
        //                 "3": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 6,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 24,
        //                     "card_type_count": 10,
        //                     "size": "6*8",
        //                     "special_pair_count": 4,
        //                     "time": 300
        //                 },
        //                 "4": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 6,
        //                     "card_group_id": 7,
        //                     "card_pair_count": 24,
        //                     "card_type_count": 11,
        //                     "size": "6*8",
        //                     "special_pair_count": 2,
        //                     "time": 300
        //                 },
        //                 "5": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 8,
        //                     "2_pair_count": 8,
        //                     "card_group_id": 8,
        //                     "card_pair_count": 24,
        //                     "card_type_count": 11,
        //                     "size": "6*8",
        //                     "special_pair_count": 2,
        //                     "time": 300
        //                 },
        //                 "6": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 6,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 300
        //                 },
        //                 "7": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 6,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 24,
        //                     "card_type_count": 11,
        //                     "size": "6*8",
        //                     "special_pair_count": 2,
        //                     "time": 300
        //                 },
        //                 "8": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 8,
        //                     "card_group_id": 7,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "9": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 14,
        //                     "2_pair_count": 10,
        //                     "card_group_id": 8,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "10": {
        //                     "0_pair_count": 12,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 10,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "11": {
        //                     "0_pair_count": 12,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 12,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "12": {
        //                     "0_pair_count": 12,
        //                     "1_pair_count": 26,
        //                     "2_pair_count": 12,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "13": {
        //                     "0_pair_count": 12,
        //                     "1_pair_count": 26,
        //                     "2_pair_count": 12,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "14": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 10,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "15": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 10,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "16": {
        //                     "0_pair_count": 12,
        //                     "1_pair_count": 26,
        //                     "2_pair_count": 12,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "17": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 28,
        //                     "2_pair_count": 12,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "18": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 22,
        //                     "2_pair_count": 10,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "19": {
        //                     "0_pair_count": 16,
        //                     "1_pair_count": 28,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "20": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "21": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "22": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "23": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "24": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "25": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "26": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "27": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "28": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "29": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "30": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "31": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "32": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "33": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "34": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "35": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "36": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "37": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "38": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "39": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "40": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "41": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "42": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "43": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "44": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "45": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "46": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "47": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "48": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "49": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "50": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "51": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "52": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "53": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "54": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "55": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "56": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "57": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "58": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "59": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "60": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "61": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "62": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "63": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "64": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "65": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "66": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "67": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "68": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "69": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "70": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "71": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "72": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "73": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "74": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "75": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "76": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "77": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "78": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "79": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "80": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "81": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "82": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "83": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "84": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "85": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "86": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "87": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "88": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "89": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "90": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "91": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "92": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "93": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "94": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "95": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "96": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "97": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "98": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "99": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "100": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "101": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "102": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "103": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "104": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "105": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "106": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "107": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "108": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "109": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "110": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "111": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "112": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "113": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "114": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "115": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "116": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "117": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "118": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "119": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "120": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "121": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "122": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "123": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "124": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "125": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "126": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "127": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "128": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "129": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "130": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "131": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "132": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "133": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "134": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "135": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "136": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "137": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "138": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "139": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "140": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "141": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "142": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "143": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "144": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "145": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "146": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "147": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "148": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "149": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "150": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "151": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "152": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "153": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "154": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "155": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "156": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "157": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "158": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "159": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "160": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "161": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "162": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "163": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "164": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "165": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "166": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "167": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "168": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "169": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "170": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "171": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "172": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "173": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "174": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "175": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "176": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "177": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "178": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "179": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "180": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "181": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "182": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "183": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "184": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "185": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "186": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "187": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "188": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "189": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "190": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "191": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "192": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "193": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "194": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "195": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "196": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "197": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "198": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "199": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "200": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "201": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "202": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "203": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "204": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "205": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "206": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "207": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "208": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "209": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "210": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 13,
        //                     "2_pair_count": 13,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "211": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 6,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "212": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 18,
        //                     "size": "8*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "213": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "214": {
        //                     "0_pair_count": 10,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "215": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "216": {
        //                     "0_pair_count": 4,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 16,
        //                     "card_group_id": 5,
        //                     "card_pair_count": 32,
        //                     "card_type_count": 15,
        //                     "size": "8*8",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "217": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 16,
        //                     "2_pair_count": 18,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "218": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "219": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 23,
        //                     "size": "10*10",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "220": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 18,
        //                     "2_pair_count": 26,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "221": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 24,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "222": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "223": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 12,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "224": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 10,
        //                     "2_pair_count": 34,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 50,
        //                     "card_type_count": 24,
        //                     "size": "10*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "225": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 2,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "226": {
        //                     "0_pair_count": 8,
        //                     "1_pair_count": 20,
        //                     "2_pair_count": 32,
        //                     "card_group_id": 3,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 },
        //                 "227": {
        //                     "0_pair_count": 5,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 20,
        //                     "card_group_id": 4,
        //                     "card_pair_count": 40,
        //                     "card_type_count": 19,
        //                     "size": "8*10",
        //                     "special_pair_count": 2,
        //                     "time": 600
        //                 },
        //                 "228": {
        //                     "0_pair_count": 6,
        //                     "1_pair_count": 15,
        //                     "2_pair_count": 39,
        //                     "card_group_id": 1,
        //                     "card_pair_count": 60,
        //                     "card_type_count": 28,
        //                     "size": "10*12",
        //                     "special_pair_count": 4,
        //                     "time": 600
        //                 }
        //             },
        //             "parameter_conf": {
        //                 "": {"para_key": "", "para_meaning": "困难关卡前发放的提示道具", "para_value": ""},
        //                 "bubble_step": {"para_key": "bubble_step", "para_meaning": "夸奖气泡弹出间隔（麻将对数）", "para_value": 15},
        //                 "coin_1": {"para_key": "coin_1", "para_meaning": "第一关现金奖励（分）", "para_value": 1000},
        //                 "coin_2": {"para_key": "coin_2", "para_meaning": "第二关现金奖励（分）", "para_value": 600},
        //                 "coin_welfare": {
        //                     "para_key": "coin_welfare",
        //                     "para_meaning": "第五大关通关补贴后现金余额（分）",
        //                     "para_value": 770000
        //                 },
        //                 "coin_welfare_rate_max": {
        //                     "para_key": "coin_welfare_rate_max",
        //                     "para_meaning": "现金补贴余额倍率上限",
        //                     "para_value": 1.0006
        //                 },
        //                 "coin_welfare_rate_min": {
        //                     "para_key": "coin_welfare_rate_min",
        //                     "para_meaning": "现金补贴余额倍率下限",
        //                     "para_value": 1
        //                 },
        //                 "force_cd_1": {"para_key": "force_cd_1", "para_meaning": "幸运奖励冷却（秒）", "para_value": 90},
        //                 "force_step": {"para_key": "force_step", "para_meaning": "强弹间隔", "para_value": 4},
        //                 "level_reward_rate_max": {
        //                     "para_key": "level_reward_rate_max",
        //                     "para_meaning": "闯关奖励倍率上限",
        //                     "para_value": 20.8
        //                 },
        //                 "level_reward_rate_min": {
        //                     "para_key": "level_reward_rate_min",
        //                     "para_meaning": "闯关奖励倍率下限",
        //                     "para_value": 19.2
        //                 },
        //                 "level_reward_video_rate_1": {
        //                     "para_key": "level_reward_video_rate_1",
        //                     "para_meaning": "闯关视频倍率1",
        //                     "para_value": 10
        //                 },
        //                 "level_reward_video_rate_2": {
        //                     "para_key": "level_reward_video_rate_2",
        //                     "para_meaning": "闯关视频倍率2",
        //                     "para_value": 13
        //                 },
        //                 "level_reward_video_rate_3": {
        //                     "para_key": "level_reward_video_rate_3",
        //                     "para_meaning": "闯关视频倍率3",
        //                     "para_value": 15
        //                 },
        //                 "lucky_reward_rate_max": {
        //                     "para_key": "lucky_reward_rate_max",
        //                     "para_meaning": "幸运奖励倍率上限",
        //                     "para_value": 10.2
        //                 },
        //                 "lucky_reward_rate_min": {
        //                     "para_key": "lucky_reward_rate_min",
        //                     "para_meaning": "幸运奖励倍率下限",
        //                     "para_value": 9.8
        //                 },
        //                 "lucky_reward_rate_video_rate": {
        //                     "para_key": "lucky_reward_rate_video_rate",
        //                     "para_meaning": "幸运奖励视频倍率",
        //                     "para_value": 10
        //                 },
        //                 "lucky_reward_step": {
        //                     "para_key": "lucky_reward_step",
        //                     "para_meaning": "幸运奖励间隔（麻将对数）",
        //                     "para_value": 16
        //                 },
        //                 "newer_coin_reward": {
        //                     "para_key": "newer_coin_reward",
        //                     "para_meaning": "新手奖励现金（包装流程后发）",
        //                     "para_value": 100000
        //                 },
        //                 "red_bag_1": {"para_key": "red_bag_1", "para_meaning": "第一关红包奖励", "para_value": 21},
        //                 "red_bag_2": {"para_key": "red_bag_2", "para_meaning": "第二关红包奖励", "para_value": 22},
        //                 "red_bag_level": {"para_key": "red_bag_level", "para_meaning": "红包引导关卡", "para_value": 8},
        //                 "red_bag_value": {"para_key": "red_bag_value", "para_meaning": "红包奖励金额", "para_value": 888},
        //                 "reward_base": {"para_key": "reward_base", "para_meaning": "奖励基础值（分）", "para_value": 50},
        //                 "right_coin_reward": {
        //                     "para_key": "right_coin_reward",
        //                     "para_meaning": "消除微信奖励（分）",
        //                     "para_value": 100
        //                 },
        //                 "right_red_reward": {
        //                     "para_key": "right_red_reward",
        //                     "para_meaning": "消除红包奖励",
        //                     "para_value": 0.1
        //                 },
        //                 "show_coin_reward": {
        //                     "para_key": "show_coin_reward",
        //                     "para_meaning": "弹窗展示现金金额（分）",
        //                     "para_value": 20000
        //                 },
        //                 "show_red_bag": {"para_key": "show_red_bag", "para_meaning": "弹窗展示红包金额", "para_value": 9000},
        //                 "vid_reward_rate": {"para_key": "vid_reward_rate", "para_meaning": "视频翻倍倍率", "para_value": 10}
        //             }
        //         },
        //         "create_city": "多伦多",
        //         "create_time": "2026-04-16 18:52:49",
        //         "des_list": ["卸载", "预计5分钟提现", "红包已到账，可提现"],
        //         "extract_status_3": 0,
        //         "favorite_info": {"1": "1", "2": "4", "3": "8"},
        //         "finishNum": 0,
        //         "game_level": 1,
        //         "gender": "保密",
        //         "gold_balance": 0,
        //         "gold_extract_desc": "1.由于微信支付需要实名制,非实名用户账号无法支持提现,请务必将提现的微信号进行实名认证;\n        2.由于微信官方要求，单笔提现金额最低为0.1元;\n        3.提现申请一般是秒到账,如果突发意外情况,也会在1-3个工作日内审核到账,请耐心等待;\n        4.用户达成提现要求即可提现到账,为保障全体用户利益,对有作弊嫌疑的用户,需经过审核验证或者满足活跃条件才可全部提现,否则不能提现;\n        5.若发现用户有恶意作弊行为,一律封禁账号并扣除账户所有余额。",
        //         "guide_step_new": 0,
        //         "headimgurl": "",
        //         "is_reviewer": 0,
        //         "is_tourists": true,
        //         "level_3_show_gold_reward": 1000,
        //         "level_desc_info": {
        //             "coin_extract_level": [1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
        //             "coin_limit": [0, 0, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000, 800000],
        //             "gold_extract_level": [0, 5, 8, 11, 15, 19, 25, 39, 60, 80, 100, 120, 140, 160, 180, 200, 250, 300, 350, 400],
        //             "gold_extract_title": ["1倍", "1.2倍", "1.4倍", "1.6倍", "1.8倍", "2倍", "2.2倍", "20倍", "100倍", "300倍", "500倍", "1000倍", "2000倍", "3000倍", "5000倍", "10000倍", "20000倍", "30000倍", "50000倍", "80000倍"],
        //             "lucky_level_count_limit": [3, 13, 30, 55, 88, 121, 154, 187],
        //             "new_year_level": 2,
        //             "red_bag_level": [8],
        //             "withdraw_percent_3": [0.01, 0.02, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80]
        //         },
        //         "login_days": 1,
        //         "nickname": null,
        //         "novice_extract": 0,
        //         "novice_status": 0,
        //         "prop_info": {"prop1_num": 1, "prop2_num": 1, "prop3_num": 1},
        //         "reco_switch": 1,
        //         "sign_in_info": [
        //             {
        //                 "_is_top": 0,
        //                 "id": "1",
        //                 "login_days": 1,
        //                 "show_money": 1000,
        //                 "sign_up_day_limit": 1,
        //                 "status": 0,
        //                 "true_money": 1000,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "2",
        //                 "login_days": 1,
        //                 "show_money": 888,
        //                 "sign_up_day_limit": 2,
        //                 "status": 0,
        //                 "true_money": 888,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "3",
        //                 "login_days": 1,
        //                 "show_money": 100,
        //                 "sign_up_day_limit": 3,
        //                 "status": 0,
        //                 "true_money": 100,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "4",
        //                 "login_days": 1,
        //                 "show_money": 100,
        //                 "sign_up_day_limit": 4,
        //                 "status": 0,
        //                 "true_money": 100,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "5",
        //                 "login_days": 1,
        //                 "show_money": 100,
        //                 "sign_up_day_limit": 5,
        //                 "status": 0,
        //                 "true_money": 100,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "6",
        //                 "login_days": 1,
        //                 "show_money": 100,
        //                 "sign_up_day_limit": 6,
        //                 "status": 0,
        //                 "true_money": 100,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "7",
        //                 "login_days": 1,
        //                 "show_money": 100,
        //                 "sign_up_day_limit": 7,
        //                 "status": 0,
        //                 "true_money": 100,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 1,
        //                 "id": "8",
        //                 "login_days": 1,
        //                 "show_money": 1888,
        //                 "sign_up_day_limit": 8,
        //                 "status": 0,
        //                 "true_money": 888,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "9",
        //                 "login_days": 1,
        //                 "show_money": 200,
        //                 "sign_up_day_limit": 9,
        //                 "status": 0,
        //                 "true_money": 200,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "10",
        //                 "login_days": 1,
        //                 "show_money": 200,
        //                 "sign_up_day_limit": 10,
        //                 "status": 0,
        //                 "true_money": 200,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "11",
        //                 "login_days": 1,
        //                 "show_money": 200,
        //                 "sign_up_day_limit": 11,
        //                 "status": 0,
        //                 "true_money": 200,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "12",
        //                 "login_days": 1,
        //                 "show_money": 200,
        //                 "sign_up_day_limit": 12,
        //                 "status": 0,
        //                 "true_money": 200,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "13",
        //                 "login_days": 1,
        //                 "show_money": 200,
        //                 "sign_up_day_limit": 13,
        //                 "status": 0,
        //                 "true_money": 200,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "14",
        //                 "login_days": 1,
        //                 "show_money": 200,
        //                 "sign_up_day_limit": 14,
        //                 "status": 0,
        //                 "true_money": 200,
        //                 "user_level": 1,
        //                 "user_level_limit": 0
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "15",
        //                 "login_days": 1,
        //                 "show_money": 88888,
        //                 "sign_up_day_limit": 15,
        //                 "status": 0,
        //                 "true_money": 0,
        //                 "user_level": 1,
        //                 "user_level_limit": 30
        //             }, {
        //                 "_is_top": 0,
        //                 "id": "16",
        //                 "login_days": 1,
        //                 "show_money": 888888,
        //                 "sign_up_day_limit": 16,
        //                 "status": 0,
        //                 "true_money": 0,
        //                 "user_level": 1,
        //                 "user_level_limit": 30
        //             }],
        //         "win_game_count": 0,
        //         "xc_level": 1
        //     }, "ecp": 0, "message": "成功"
        // });
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.UserInfo), t);
    }

    static getAbTestInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.AbTestInfo), t);
    }

    static startGame(t) {
       
        //     "code": 1, "data": {
        //         "bubble_coin_balance": "通过<color=#E52724>本关</color>，自动发起<color=#E52724>1%</color>收款",
        //         "bubble_gold_balance": "再闯关<color=#E52724>5</color>次，可<color=#E52724>1.2倍</color>提现",
        //         "coin_balance": 0,
        //         "complete_atlas": {},
        //         "free_prop": {},
        //         "game_level": 1,
        //         "gold_balance": 0,
        //         "gold_bubble_flag": 0,
        //         "is_extract": 0,
        //         "lucky_bubble": "可抽奖",
        //         "lucky_count": 0,
        //         "lun_level": 1,
        //         "profile": {
        //             "countdown": 300,
        //             "level_data": {
        //                 "mapData": [[{
        //                     "id": "X72TSS38Y4UN7L26-00-00",
        //                     "type": 0,
        //                     "x": 0,
        //                     "y": 0
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-00-01",
        //                     "type": 101,
        //                     "x": 1,
        //                     "y": 0
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-00-02",
        //                     "type": 21,
        //                     "x": 2,
        //                     "y": 0
        //                 }, {"id": "X72TSS38Y4UN7L26-00-03", "type": 0, "x": 3, "y": 0}, {
        //                     "id": "X72TSS38Y4UN7L26-00-04",
        //                     "type": 0,
        //                     "x": 4,
        //                     "y": 0
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-00-05",
        //                     "type": 0,
        //                     "x": 5,
        //                     "y": 0
        //                 }], [{
        //                     "id": "X72TSS38Y4UN7L26-01-00",
        //                     "type": 21,
        //                     "x": 0,
        //                     "y": 1
        //                 }, {"id": "X72TSS38Y4UN7L26-01-01", "type": 0, "x": 1, "y": 1}, {
        //                     "id": "X72TSS38Y4UN7L26-01-02",
        //                     "type": 32,
        //                     "x": 2,
        //                     "y": 1
        //                 }, {"id": "X72TSS38Y4UN7L26-01-03", "type": 0, "x": 3, "y": 1}, {
        //                     "id": "X72TSS38Y4UN7L26-01-04",
        //                     "type": 0,
        //                     "x": 4,
        //                     "y": 1
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-01-05",
        //                     "type": 11,
        //                     "x": 5,
        //                     "y": 1
        //                 }], [{
        //                     "id": "X72TSS38Y4UN7L26-02-00",
        //                     "type": 0,
        //                     "x": 0,
        //                     "y": 2
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-02-01",
        //                     "type": 31,
        //                     "x": 1,
        //                     "y": 2
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-02-02",
        //                     "type": 31,
        //                     "x": 2,
        //                     "y": 2
        //                 }, {"id": "X72TSS38Y4UN7L26-02-03", "type": 0, "x": 3, "y": 2}, {
        //                     "id": "X72TSS38Y4UN7L26-02-04",
        //                     "type": 0,
        //                     "x": 4,
        //                     "y": 2
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-02-05",
        //                     "type": 0,
        //                     "x": 5,
        //                     "y": 2
        //                 }], [{
        //                     "id": "X72TSS38Y4UN7L26-03-00",
        //                     "type": 0,
        //                     "x": 0,
        //                     "y": 3
        //                 }, {"id": "X72TSS38Y4UN7L26-03-01", "type": 1, "x": 1, "y": 3}, {
        //                     "id": "X72TSS38Y4UN7L26-03-02",
        //                     "type": 0,
        //                     "x": 2,
        //                     "y": 3
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-03-03",
        //                     "type": 11,
        //                     "x": 3,
        //                     "y": 3
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-03-04",
        //                     "type": 101,
        //                     "x": 4,
        //                     "y": 3
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-03-05",
        //                     "type": 0,
        //                     "x": 5,
        //                     "y": 3
        //                 }], [{
        //                     "id": "X72TSS38Y4UN7L26-04-00",
        //                     "type": 0,
        //                     "x": 0,
        //                     "y": 4
        //                 }, {"id": "X72TSS38Y4UN7L26-04-01", "type": 0, "x": 1, "y": 4}, {
        //                     "id": "X72TSS38Y4UN7L26-04-02",
        //                     "type": 32,
        //                     "x": 2,
        //                     "y": 4
        //                 }, {"id": "X72TSS38Y4UN7L26-04-03", "type": 1, "x": 3, "y": 4}, {
        //                     "id": "X72TSS38Y4UN7L26-04-04",
        //                     "type": 0,
        //                     "x": 4,
        //                     "y": 4
        //                 }, {
        //                     "id": "X72TSS38Y4UN7L26-04-05",
        //                     "type": 0,
        //                     "x": 5,
        //                     "y": 4
        //                 }], [{
        //                     "id": "X72TSS38Y4UN7L26-05-00",
        //                     "type": 0,
        //                     "x": 0,
        //                     "y": 5
        //                 }, {"id": "X72TSS38Y4UN7L26-05-01", "type": 0, "x": 1, "y": 5}, {
        //                     "id": "X72TSS38Y4UN7L26-05-02",
        //                     "type": 0,
        //                     "x": 2,
        //                     "y": 5
        //                 }, {"id": "X72TSS38Y4UN7L26-05-03", "type": 0, "x": 3, "y": 5}, {
        //                     "id": "X72TSS38Y4UN7L26-05-04",
        //                     "type": 0,
        //                     "x": 4,
        //                     "y": 5
        //                 }, {"id": "X72TSS38Y4UN7L26-05-05", "type": 0, "x": 5, "y": 5}]]
        //             },
        //             "level_info": {
        //                 "level_id": 1,
        //                 "round_id": 1,
        //                 "round_max": 1,
        //                 "set_id": 1,
        //                 "set_max": 1,
        //                 "turn_id": 1,
        //                 "turn_max": 1
        //             },
        //             "lun_level": 1
        //         },
        //         "prop_info": {"prop1_num": 1, "prop2_num": 1, "prop3_num": 1},
        //         "success_count": 0,
        //         "sync_data": "",
        //         "unlock_prop_list": [],
        //         "used_free_revive": 0
        //     }, "ecp": 0, "message": "成功"
        // });
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.StartGame), o);
    }

    static async submitGame(t) {
        var o, n;
        o = Service.getRequestData(t);
        n = await HttpUtil.Post(Service.genRequestUrl(RequestType.SubmitGame), o);
        if (Object.keys(n.data).length > 0) {
            gameData.clearSubmitData = n.data;
            PlayerDataSys.coinBalance = n.data.coin_balance;
            gameData.coinBubbleTip = n.data.bubble_coin_balance;
            gameData.goldBubbleTip = n.data.bubble_gold_balance;
        }
        return n;
    }

    static videoReward(t) {
       
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.VideoReward), o);
    }

    static onlyReward(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.OnlyReward), o);
    }

    static updateGuideInfo(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.UpdateGuideInfo), o);
    }

    static getRankingInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetRankingInfo), t);
    }

    static getScrollMsg(t = null) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.ScrollMsg), o);
    }

    static setReco(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.SetReco), o);
    }

    static getTaskList() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.taskList), t);
    }

    static getTaskExtract(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.taskExtract), o);
    }

    static luckyDraw(t) {
        var o = Service.getRequestData(t);
        console.log("luckyDraw formData-------", o);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.LuckyDraw), o);
    }

    static luckyDrawList() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.luckyDrawList), t);
    }

    static getExtractInfo(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetExtractInfo), o);
    }

    static gotoWithdraw_v2(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GotoWithdraw_v2), o);
    }

    static getGoldExtractInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetGoldExtractInfo), t);
    }

    static getLevelExtractInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetLevelExtractInfo), t);
    }

    static getDayTaskInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.DayTaskInfo), t);
    }

    static getDayTask(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetDayTask), o);
    }

    static getLevelReward(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetLevelReward), o);
    }

    static getBigMsg() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GetBigMsg), t);
    }

    static gotoWithdraw(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GotoWithdraw), o);
    }

    static gotoGoldWithdraw(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.GotoGoldWithdraw), o);
    }

    static getWithdrawDetail(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.WithdrawDetail), o);
    }

    static withdrawHistory() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.WithdrawHistory), t);
    }

    static removeUser(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.RemoveUser), o);
    }

    static agreementForce(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.AgreementReport), o);
    }

    static ShuMengReport(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.ShuMengReport), o);
    }

    static chat_main(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.chat_main), o);
    }

    static chat_msg_pop(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.chat_msg_pop), o);
    }

    static useProp(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.usr_prop), o);
    }

    static updateLevel(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.update_level), o);
    }

    static newGoldReward() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.newGoldReward), t);
    }

    static getHandBookReward(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.getHandBookReward), o);
    }

    static getHandBookPage(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.getHandBookPage), o);
    }

    static async getBigCoinExtractInfo() {
        var t;
        t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.getBigCoinVerifyInfo), t);
    }

    static getTaskScorllMsg() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.taskScorllMsg), t);
    }

    static getSignInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.signIn), t);
    }

    static getSignInReward(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.signInReward), o);
    }

    static openBox() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.openBox), t);
    }

    static getBoxReward(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.boxReward), o);
    }

    static getWufuReward() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.wufuReward), t);
    }

    static wufuFragment() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.wufuFragment), t);
    }

    static setWufuCardNum(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.setWufuCardNum), o);
    }

    static getSubsidyReward() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.subsidyReward), t);
    }

    static signInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.SginInfo), t);
    }

    static useSkin(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.useSkin), o);
    }

    static sign(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.Sgin), o);
    }

    static getTujianInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.tujianInfo), t);
    }

    static syncTujianData(t) {
        var o = Service.getRequestData(t);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.syncTujianData), o);
    }

    static favoriteExtract() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.favoriteExtract), t);
    }

    static luckyDrawInfo() {
        var t = Service.getRequestData(null);
        return HttpUtil.Post(Service.genRequestUrl(RequestType.luckyDrawInfo), t);
    }
}