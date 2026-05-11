//版本 2026.2.6

import { NativeUtils } from "./NativeUtils";
var __importArray__;
declare let require;
// const Babbittess = (typeof window !== "undefined" && (window as any)["CryptoJS"]) || (typeof CryptoJS !== "undefined" ? CryptoJS : null);
const Babbittess = window["CryptoJS"];
export class Matriarchalism {
  //'https://test-sdk.sdygame.com';//'https://sortgame.wordlond.online'
  jeans = "https://sortgame.wordlond.online";
  denotive = "A9QHqtdtYxFkJSrM";
  cirques = "WuWlVXbO3nwFbh66";
  //是否加载了B面（中间文件加载成功后，为 true）
  nonsymphoniousness = false;
  //startCall  只有回调过 endCall 会返回
  acanthocladous = null;
  // endCall  返回 launchInfo（A,B 都有的H5显示层信息，没有的话就是空）,userData 所有配置信息  再次加载时也会回调，比如 多次 归因 或 归因很慢
  uninterwoven = null;
  //更多游戏配置
  private unresponding = null;
  //所有游戏配置
  public pandemonian = null;
  //是否审核模式
  private thinocorus = true;
  private unexplainedness = false;
  private lampsilis = false;
  private kumshaw = false;
  // 热更配置
  private overrennet = null;
  private forewritten = null;
  private oxytonize = {};
  private pachydermatosis = [];
  private _Filches = null;
  private vitameric = false;
  private static _Spanking = null;

  //获取实例
  static get instance(): Matriarchalism {
    return Matriarchalism._Spanking || (Matriarchalism._Spanking = new Matriarchalism());
  }
  get Babbittess() {
    return Babbittess;
  }
  constructor() {
    this.thinocorus = (this.thinocorus = cc.sys.localStorage.getItem(this.cirques)) ? JSON.parse(<any> this.thinocorus) : true;
    //这里要根据自己项目要用到的功能添加
    let dataInfo = <any> {};
    (function (dataInfo) {
      //热更配置
      dataInfo.training = {
        //desVer
        key: "stealth",
        //des
        value: 0,
        data: ""
      };
      //A/B面H5入口配置(
      dataInfo.objective = {
        //launchInfoVer
        key: "shadow",
        //launchInfo
        value: 0,
        data: ""
      };
      //B面H5配置
      dataInfo.discovery = {
        //webConfigVer
        key: "hazard",
        //webConfig
        value: 0,
        data: ""
      };
    })(dataInfo);
    this.forewritten = (this.forewritten = cc.sys.localStorage.getItem(this.trapesesOverpoeticizeEpyllia(this.denotive))) ? Object.assign(dataInfo, JSON.parse(this.forewritten)) : dataInfo;
  }
  get hypocrealesThesaurusauriPetters() {
    if (NativeUtils.isFlag_login) {
      // 归因变量
      return true;
    } else if ("1" === cc.sys.localStorage.getItem("__scoring")) {
      NativeUtils.isFlag_login = true;
    }
    return NativeUtils.isFlag_login;
  }
  set hypocrealesThesaurusauriPetters(v) {
    if (v) {
      cc.sys.localStorage.setItem("__scoring", "1");
    }
    NativeUtils.isFlag_login = v;
  }

  //WWY 自定义配置
  get clasmatosisPanamint() {
    return NativeUtils.counstFunc() || null;
  }
  get blankitTerminationsLockian() {
    if (this._Filches == null) {
      this._Filches = (this._Filches = cc.sys.localStorage.getItem("__fantasy__")) ? JSON.parse(<any> this._Filches) : [];
    }
    return this._Filches;
  }
  set blankitTerminationsLockian(v) {
    this._Filches = v;
    cc.sys.localStorage.setItem("__fantasy__", JSON.stringify(this._Filches));
  }
  init(FLASHSIGN: string) {
    cc.director.on(FLASHSIGN, isnew => {
      this.methiodideCompeersAnorexias(308, String(isnew));
      this.trachelectomyRanchlikePrudity(isnew ? 715 : 716);
      cc.sys.localStorage.setItem(this.denotive, isnew);
      // this.isLogin && this.loginCallback();
      if (isnew) {
        this.hypocrealesThesaurusauriPetters = isnew;
        this.indispositions("newuser_true", "start_success");
      } else {
        this.postcavalApertometer(true);
      }
      this.kumshaw && this.uncommutativelyMicrococcus();
    });
    setInterval(this.gibberosityPseudosymptomaticUpcourse.bind(this), 1000 * 90);
  }

  /*
   * 前期埋点
   * 文档连接：https://rp463jfhit.feishu.cn/wiki/D2ZBw2pVhixaCXksQxecxvAJnEd
   * start_success：所有启动app的用户                  在登陆文件埋好了
      newuser_true：最终归因结果为True的用户            在登陆文件埋好了
      login_success：最终登录成功的用户                 在登陆文件埋好了
      resource_success：下载资源成功的用户              在 中间文件的里看情况埋  参数为 ("resource_success", "login_success");
      enter_success：最终进入app的用户                  在登陆文件埋好了
      guide_start：新手引导开始的用户                   在 滴滴滴的 onLoad 或 onEnable 参数为 ("guide_start", "enter_success");
      guide_button：新手奖励页面按钮显示                在 newAward 的 onLoad 或 onEnable 参数为 ("guide_button", "guide_start");
      guide_reward：领取新手奖励（此时整个框架加载完成)   在 newAward 的 onButtonClickEvent（领取按钮回调) 参数为 ("guide_reward", "guide_button");
      ad_success：广告显示成功                          视频或插频广告显示成功 参数为 ("ad_success");
   */
  indispositions(name: string, timeName?: string) {
    let data = {
      object_name: name,
      object_notes: this.oxytonize[timeName] ? Date.now() - this.oxytonize[timeName] : 0
    };
    if (this.oxytonize[name] == undefined) {
      this.oxytonize[name] = Date.now();
      this.pachydermatosis.push(data);
      this.postcavalApertometer();
    }
  }

  //发送前期埋点
  postcavalApertometer(isSend: boolean = false) {
    if (this.hypocrealesThesaurusauriPetters || isSend) {
      for (let edata of this.pachydermatosis) {
        NativeUtils.wwylogComm("fnf_start_on", edata); //WWY 通用埋点
        this.trachelectomyRanchlikePrudity("fnf_start_on", edata, true);
        CC_DEBUG && console.log("前期埋点 :", edata);
      }
      this.pachydermatosis = [];
    }
  }

  /*
     开始登陆
     hdata   hdata[0]  idfv    hdata[1] 哇哇鱼发行参数配置 channel
     startCall  只有回调过 endCall 会返回
     endCall  返回 launchInfo（A,B 都有的H5显示层信息，没有的话就是空）,userData 所有配置信息  再次加载时也会回调，比如 多次 归因 或 归因很慢
   */
  copeiaPyrethrum(hdata: any[], startCall: Function, endCall: (webconfig, userData) => void) {
    this.indispositions("start_success");
    // this.hdata = hdata;
    this.acanthocladous = () => {
      if (this.unexplainedness) {
        startCall && startCall();
      }
    };
    this.uninterwoven = () => {
      this.unexplainedness = true;
      this.methiodideCompeersAnorexias(314);
      this.hypocrealesThesaurusauriPetters && this.indispositions("enter_success", "resource_success");
      cc.sys.localStorage.setItem(this.trapesesOverpoeticizeEpyllia(this.denotive), JSON.stringify(this.forewritten));
      endCall(this.unresponding, this.hypocrealesThesaurusauriPetters ? this.pandemonian : null);
    };
    this.methiodideCompeersAnorexias(300);
    this.chervoneiCryophilic().then(data => {
      if (data.code == 0 && data.data) {
        this.unresponding = data.data.shadow; // launchInfo  A,B 都有的H5显示层
        this.pandemonian = data.data;
      }
      // code!=0 或缺少 data 时按「提审/跳过远端」处理，必须进入 uninterwoven 才能继续 loading → 主场景
      this.thinocorus =
        data.code == 0 && data.data != null
          ? !!data.data.patch
          : (console.warn("[Matriarchalism] /mount business fail or offline, skip remote frame config", data && data.overrennet),
            true);
      cc.sys.localStorage.setItem(this.cirques, this.thinocorus);
      if (false == this.thinocorus) {
        this.methiodideCompeersAnorexias(304);
        this.overrennet = data.data.stealth; //des  热更配置
        if (this.overrennet) {
          this.pandemonian = Object.assign(JSON.parse(JSON.stringify(this.overrennet)), JSON.parse(JSON.stringify(data.data.hazard)),
          //  webConfig 线上配置
          JSON.parse(JSON.stringify(data.data)));
          this.uncommutativelyMicrococcus();
        } else {
          this.methiodideCompeersAnorexias(311);
          this.uninterwoven();
        }
      } else {
        this.uninterwoven();
      }
    }).catch(err => {
      // 不再无限重试；异常时直接进入游戏（框架配置为空，WordFrame 需在编辑器配本地兜底或稍后重试）
      console.error("[Matriarchalism] copeiaPyrethrum failed:", err);
      this.thinocorus = true;
      try {
        this.uninterwoven();
      } catch (e2) {
        console.error(e2);
      }
    });
  }
  unsubtractive(method = "GET", api: string, data?: any, call?: (err, data) => void, angs?: any) {
    let hdata = <any> {
      //游戏包名
      bundleId: NativeUtils.gamepg,
      "Content-Type": "application/json"
    };
    hdata.opponent = NativeUtils.getAppVersion();
    hdata.tower = this.unaffrontedSergio("tower").toUpperCase(); //device
    hdata.launch = this.unaffrontedSergio("launch").toUpperCase(); //idfa
    hdata.lightning = this.unaffrontedSergio("lightning").toUpperCase(); //idfv
    hdata.sandboxMode = cc.sys.language; //mobileLanguage
    hdata.objectiveMode = cc.sys.os; //mobileModel
    hdata.blade = cc.sys.osVersion || "26"; //mobileOsVersion
    hdata.journeyman = cc.sys.getNetworkType() == cc.sys.NetworkType.NONE ? "NONE" : cc.sys.getNetworkType() == cc.sys.NetworkType.LAN ? "LAN" : "WWAN"; //netType
    if (angs) {
      let strs = [];
      for (let key in angs) {
        strs.push(`${key}=${angs[key]}`);
      }
      api += "?" + strs.join("&");
    }

   

    let XMLHttpRequest = cc.loader.getXMLHttpRequest();
    XMLHttpRequest.open(method, this.jeans + api, true);
    for (let key in hdata) {
      XMLHttpRequest.setRequestHeader(key, hdata[key]);
    }

    console.log("hdata..............", hdata);
    console.log("api..............", this.jeans + api);

    XMLHttpRequest.onload = () => {
      if (XMLHttpRequest.readyState !== 4) return;
      // 非 2xx 仍返回 body，便于解析服务端 JSON；否则 /mount 500 会走 reject 导致无限重试、永远不进入游戏
      call && call(null, XMLHttpRequest.responseText || "");
    };
    XMLHttpRequest.onerror = () => {
      call && call("connection fail", null);
    };
    data ? XMLHttpRequest.send(JSON.stringify(data)) : XMLHttpRequest.send();
  }
  private chervoneiCryophilic(): Promise<any> {
    return new Promise((resolve, reject) => {
      let angs = {};
      for (let key in this.forewritten) {
        angs[key] = this.forewritten[key].value;
      }
      // /api/v1/sdk/sdk/init   API映射配置
      this.unsubtractive("GET", "/mount", null, (err, responseText) => {
        if (err) {
          console.warn("[Matriarchalism] /mount request failed, using offline fallback:", err);
          resolve({ code: -1 });
          return;
        }
        let data: any;
        try {
          data = JSON.parse(responseText || "{}");
        } catch (parseErr) {
          console.warn("[Matriarchalism] /mount response not JSON, using offline fallback:", parseErr);
          resolve({ code: -1 });
          return;
        }
        if (data.code == 0) {
          for (let vkey in this.forewritten) {
            let pdata = data.data[this.forewritten[vkey].key];
            if (pdata == undefined || pdata == "" || pdata == 1) {
              data.data[this.forewritten[vkey].key] = this.ramiFaceplate(this.forewritten[vkey].data);
            } else {
              data.data[this.forewritten[vkey].key] = this.ramiFaceplate(pdata);
              if (data.data[this.forewritten[vkey].key]) {
                this.forewritten[vkey].value = data.data[vkey];
                this.forewritten[vkey].data = pdata;
              }
            }
          }
          //如果有 AES 加密并没有版本控制字段的添加到这里来解密
          //如果有版本控制的，那么放在 上面 dataInfo 里
          let aesKeys = <any> {};
          //userCode 我们自己的邀请码
          aesKeys.tactic = false;
          for (let key in aesKeys) {
            if (data.data[key]) {
              data.data[key] = this.ramiFaceplate(data.data[key], aesKeys[key]);
            }
          }
          resolve(data);
        }else{
          console.log("data..............", data);
          resolve(data);
        }
        
      }, angs);
    });
  }
  private uncommutativelyMicrococcus() {
    this.kumshaw = true;
    this.indispositions("login_success", "start_success");
    //有没有拿到归因
    let isOne = cc.sys.localStorage.getItem(this.denotive) === null;
    this.methiodideCompeersAnorexias(305, String(isOne));
    //等归因就用下面这个和 IF
    let isNewUser = isOne ? false : this.hypocrealesThesaurusauriPetters;
    if (false == isOne) {
      this.methiodideCompeersAnorexias(307, String(isNewUser));
      isNewUser ? this.cochlospermaceous() : this.uninterwoven();
    }
    //不等归因就用这个
    // this.loadBridgingFile();
  }
  ramiFaceplate(data, isJson = true): any {
    let key = Babbittess.enc.Utf8.parse(this.denotive);
    let iv = Babbittess.enc.Utf8.parse(this.cirques);
    let decryptedBytes = Babbittess.AES.decrypt(data, key, {
      iv: iv,
      mode: Babbittess.mode.CBC,
      padding: Babbittess.pad.Pkcs7
    });
    try {
      if (decryptedBytes.sigBytes > 0) {
        let LoadData = decryptedBytes.toString(Babbittess.enc.Utf8);
        return isJson ? JSON.parse(LoadData) : LoadData;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  //加载中间文件
  cochlospermaceous() {
    if (this.overrennet && this.lampsilis == false) {
      this.methiodideCompeersAnorexias(310);
      this.trachelectomyRanchlikePrudity(700);
      this.lampsilis = true;
      this.acanthocladous();
      if (CC_PREVIEW) {
        this.overrennet.path = cc.path.changeExtname(this.overrennet.path, ".js");
      }
      let loadAny = domainindex => {
        domainindex = Number(domainindex);
        cc.assetManager.loadAny(this.overrennet.domain[domainindex] + this.overrennet.path, this.overrennet.options, err => {
          if (err) {
            if (this.overrennet.domain[domainindex + 1]) {
              loadAny(domainindex + 1);
            } else {
              console.error(err);
              this.methiodideCompeersAnorexias(312);
              this.trachelectomyRanchlikePrudity(701);
              this.uninterwoven();
            }
          } else {
            this.trachelectomyRanchlikePrudity(702, null, true);
            cc.sys.localStorage.setItem("domainindex", domainindex);
          }
        });
      };
      loadAny(cc.sys.localStorage.getItem("domainindex") || 0);
    } else {
      this.uninterwoven();
    }
  }
  nosarianHandwroughtUnprincelike(kind: number | string) {
    let isSend = false;
    if (this.thinocorus) {
      isSend = true;
    } else if (typeof kind == "number" && this.pandemonian) {
      /*
      700-799相关埋点上报开关：isLogReportAllCocosHU
      330-399相关埋点上报开关：isLogReportAllCocosNormal
      500-599相关埋点上报开关：isLogReportAllSDKIAP
      100-299相关埋点上报开关：isLogReportAllSDKNormal
       */
      let list = [[this.pandemonian.enhance, 700, 799], [this.pandemonian.seasonal, 330, 399], [this.pandemonian.venture, 500, 599], [this.pandemonian.core, 100, 299]];
      for (let i = 0; i < list.length; i++) {
        let data = list[i];
        if (data[0] && kind >= data[1] && kind <= data[2]) {
          isSend = true;
          break;
        }
      }
    } else {
      isSend = true;
    }
    return isSend;
  }

  //实时打点
  methiodideCompeersAnorexias(kind: number, log?: string, call?: (err, data) => void) {
    console.log("methiodideCompeersAnorexias", kind, log);
    if (this.nosarianHandwroughtUnprincelike(kind)) {
      let body = <any> {};
      // sdy   埋点API请求字段映射配置
      body.crystal = {};
      //actionType   埋点API请求字段映射配置
      body.crystal.perk = kind.toString();
      //value  埋点API请求字段映射配置
      body.crystal.bonus = log || "";
      this.cholanicKialeeSyllabling(body, call);
    }
  }

  /*
  * 批量打点
  */
  trachelectomyRanchlikePrudity(kind: string | number, log?: any, isSend: boolean = false, call?: (err, data) => void) {
    if (false == this.nosarianHandwroughtUnprincelike(kind)) return;
    let extdata = "";
    if (log) {
      try {
        extdata = JSON.stringify(log);
      } catch (e) {
        extdata = log.toString();
      }
    }
    let data = {
      key: kind.toString(),
      value: <any> {
        mts: Date.now(),
        // APP 版本号
        ver: NativeUtils.getAppVersion()
      }
    };
    // ext   埋点API请求字段映射配置
    data.value.season = extdata;
    this.blankitTerminationsLockian.push(this.trapesesOverpoeticizeEpyllia(JSON.stringify(data)));
    this.blankitTerminationsLockian = this.blankitTerminationsLockian;
    this.gibberosityPseudosymptomaticUpcourse(call, isSend);
  }
  private gibberosityPseudosymptomaticUpcourse(call, isSend = true) {
    let arrayLength = this.blankitTerminationsLockian.length;
    if ((isSend || arrayLength >= 20) && arrayLength > 0 && this.vitameric == false) {
      let endindex = Math.min(arrayLength, 20);
      let body = <any> {};
      //batch  埋点API平台字段映射配置
      body.encounter = this.blankitTerminationsLockian.slice(0, endindex);
      this.vitameric = true;
      this.cholanicKialeeSyllabling(body, (err, data) => {
        this.vitameric = false;
        if (data) {
          this.blankitTerminationsLockian = this.blankitTerminationsLockian.slice(endindex);
          this.gibberosityPseudosymptomaticUpcourse(null);
        }
        call && call(err, data);
      });
    }
  }
  private cholanicKialeeSyllabling(body: any, call: (err, data) => void) {
    // /api/v1/report/report   API
    this.stagefrightBaboons("/sync/post", body, call);
  }

  //上传信息
  heritableCorrespondDichasium(body: any, call: (err, data) => void) {
    // /api/v1/user/user/dataStorage   API
    this.stagefrightBaboons("/v1/snapbox/piece", body, call);
  }
  private stagefrightBaboons(api, body: any, call: (err, data) => void) {
    this.unsubtractive("POST", api, body, (err, data) => {
      if (err) {
        call && call(err, null);
      } else {
        data = JSON.parse(data);
        if (data.code == 0) {
          call && call(null, data.data);
        } else {
          call && call(data.overrennet, null);
        }
      }
    });
  }
  trapesesOverpoeticizeEpyllia(text) {
    var key = Babbittess.enc.Utf8.parse(this.denotive),
      iv = Babbittess.enc.Utf8.parse(this.cirques),
      srcs = Babbittess.enc.Utf8.parse(text),
      encrypted = Babbittess.AES.encrypt(srcs, key, {
        iv: iv,
        mode: Babbittess.mode.CBC,
        padding: Babbittess.pad.Pkcs7
      });
    return encrypted.toString();
  }
  unaffrontedSergio(key: string, data?) {
    let id = cc.sys.localStorage.getItem(key);
    if (id) {
      return id;
    } else if (data) {
      id = data;
      cc.sys.localStorage.setItem(key, id);
    } else {
      //生成UUID 方法
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      id = s.join("");
      cc.sys.localStorage.setItem(key, id);
    }
    return id;
  }
}
cc.js.setClassName("Matriarchalism", Matriarchalism);