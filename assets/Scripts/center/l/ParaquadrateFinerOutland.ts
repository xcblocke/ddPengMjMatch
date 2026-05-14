//版本 2026.2.6
import { NextlyAnyoneize } from "../p/NextlyAnyoneize";
import { SubbillHyperforce } from "../s/SubbillHyperforce";
declare let require;
const IllecebrousBlackhanderExuvial = require("crypto-js");
export class ParaquadrateFinerOutland {
  //'https://test-sdk.sdygame.com';//'https://boardkoimj.mahjongpairdrift.xyz'
  quadragenarious = "https://boardkoimj.mahjongpairdrift.xyz";
  induced = "S4gOgFuv70sH4ph6";
  unbusied = "QOpYUZetYyofnBGA";
  //是否加载了B面（中间文件加载成功后，为 true）
  universalizing = false;
  //startCall  只有回调过 endCall 会返回
  unconvertibleness = null;
  // endCall  返回 launchInfo（A,B 都有的H5显示层信息，没有的话就是空）,userData 所有配置信息  再次加载时也会回调，比如 多次 归因 或 归因很慢
  nonfeldspathic = null;
  //更多游戏配置
  private unbrilliant = null;
  //所有游戏配置
  private lumbricoid = null;
  //是否审核模式
  private echeneidoid = true;
  private epituberculosis = false;
  private rascallike = false;
  private methanolysis = false;
  // 热更配置
  private preening = null;
  private puppysnatch = null;
  private swollenly = {};
  private tetraethylsilane = [];
  private _Shetland = null;
  private philander = false;
  private static _Potentially = null;

  //获取实例
  static get instance(): ParaquadrateFinerOutland {
    return ParaquadrateFinerOutland._Potentially || (ParaquadrateFinerOutland._Potentially = new ParaquadrateFinerOutland());
  }
  get IllecebrousBlackhanderExuvial() {
    return IllecebrousBlackhanderExuvial;
  }
  constructor() {
    this.echeneidoid = (this.echeneidoid = cc.sys.localStorage.getItem(this.unbusied)) ? JSON.parse(<any> this.echeneidoid) : true;
    //这里要根据自己项目要用到的功能添加
    let dataInfo = <any> {};
    (function (dataInfo) {
      //热更配置
      dataInfo.capture = {
        //desVer
        key: "spawn",
        //des
        value: 0,
        data: ""
      };
      //A/B面H5入口配置(
      dataInfo.talent = {
        //launchInfoVer
        key: "partyplay",
        //launchInfo
        value: 0,
        data: ""
      };
      //B面H5配置
      dataInfo.overdrive = {
        //webConfigVer
        key: "agility",
        //webConfig
        value: 0,
        data: ""
      };
    })(dataInfo);
    this.puppysnatch = (this.puppysnatch = cc.sys.localStorage.getItem(this.uncontemptiblyPandershipSemiconical(this.induced))) ? Object.assign(dataInfo, JSON.parse(this.puppysnatch)) : dataInfo;
  }
  get furrowless() {
    if (SubbillHyperforce.instance.postniceBlankward) {
      // 归因变量
      return true;
    } else if ("1" === cc.sys.localStorage.getItem("__experience")) {
      SubbillHyperforce.instance.postniceBlankward = true;
    }
    return SubbillHyperforce.instance.postniceBlankward;
  }
  set furrowless(v) {
    if (v) {
      cc.sys.localStorage.setItem("__experience", "1");
    }
    SubbillHyperforce.instance.postniceBlankward = v;
  }

  //WWY 自定义配置
  get pissantsUngluttonousPublish() {
    return SubbillHyperforce.instance.unplanShiftive || null;
  }
  get omnivoracityParagasterMethylnaphthalene() {
    if (this._Shetland == null) {
      this._Shetland = (this._Shetland = cc.sys.localStorage.getItem("__online__")) ? JSON.parse(<any> this._Shetland) : [];
    }
    return this._Shetland;
  }
  set omnivoracityParagasterMethylnaphthalene(v) {
    this._Shetland = v;
    cc.sys.localStorage.setItem("__online__", JSON.stringify(this._Shetland));
  }
  init(FLASHSIGN: string) {
    cc.director.on(FLASHSIGN, isnew => {
      this.exercitant(308, String(isnew));
      this.smeltOversentimentalismMonarchism(isnew ? 715 : 716);
      cc.sys.localStorage.setItem(this.induced, isnew);
      // this.isLogin && this.loginCallback();
      if (isnew) {
        this.furrowless = isnew;
        this.overglancing("newuser_true", "start_success");
      } else {
        this.arteriophlebotomy(true);
      }
      this.methanolysis && this.coldheartedness();
    });
    setInterval(this.thiazideSlabbiness.bind(this), 1000 * 90);
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
  overglancing(name: string, timeName?: string) {
    let data = {
      object_name: name,
      object_notes: this.swollenly[timeName] ? Date.now() - this.swollenly[timeName] : 0
    };
    if (this.swollenly[name] == undefined) {
      this.swollenly[name] = Date.now();
      this.tetraethylsilane.push(data);
      this.arteriophlebotomy();
    }
  }

  //发送前期埋点
  arteriophlebotomy(isSend: boolean = false) {
    if (this.furrowless || isSend) {
      for (let edata of this.tetraethylsilane) {
        SubbillHyperforce.instance.superwayTranscrew("fnf_start_on", edata); //WWY 通用埋点
        this.smeltOversentimentalismMonarchism("fnf_start_on", edata, true);
        CC_DEBUG && console.log("前期埋点 :", edata);
      }
      this.tetraethylsilane = [];
    }
  }

  /*
     开始登陆
     hdata   hdata[0]  idfv    hdata[1] 哇哇鱼发行参数配置 channel
     startCall  只有回调过 endCall 会返回
     endCall  返回 launchInfo（A,B 都有的H5显示层信息，没有的话就是空）,userData 所有配置信息  再次加载时也会回调，比如 多次 归因 或 归因很慢
   */
  compulsitorHemivagotony(hdata: any[], startCall: Function, endCall: (webconfig, userData) => void) {
    this.overglancing("start_success");
    // this.hdata = hdata;
    this.unconvertibleness = () => {
      if (this.epituberculosis) {
        startCall && startCall();
      }
    };
    this.nonfeldspathic = () => {
      this.epituberculosis = true;
      this.exercitant(314);
      this.furrowless && this.overglancing("enter_success", "resource_success");
      cc.sys.localStorage.setItem(this.uncontemptiblyPandershipSemiconical(this.induced), JSON.stringify(this.puppysnatch));
      endCall(this.unbrilliant, this.furrowless ? this.lumbricoid : null);
    };
    this.exercitant(300);
    this.fifteenths().then(data => {
      if (data.code == 0) {
        this.unbrilliant = data.data.partyplay; // launchInfo  A,B 都有的H5显示层
        this.lumbricoid = data.data;
      }
      this.echeneidoid = data.code == 0 ? data.data.progress : (console.error(data.preening), true); // isVip 是否提审开关
      cc.sys.localStorage.setItem(this.unbusied, this.echeneidoid);
      if (false == this.echeneidoid) {
        this.exercitant(304);
        this.preening = data.data.spawn; //des  热更配置
        if (this.preening) {
          this.lumbricoid = Object.assign(JSON.parse(JSON.stringify(this.preening)), JSON.parse(JSON.stringify(data.data.agility)),
          //  webConfig 线上配置
          JSON.parse(JSON.stringify(data.data)));
          this.coldheartedness();
        } else {
          this.exercitant(311);
          this.nonfeldspathic();
        }
      } else {
        this.nonfeldspathic();
      }
    }).catch(err => {
      setTimeout(() => {
        this.compulsitorHemivagotony(hdata, startCall, endCall);
      }, 1000);
      console.error(err);
    });
  }
  ichthyosaurusWandooObside(method = "GET", api: string, data?: any, call?: (err, data) => void, angs?: any) {
    let hdata = <any> {
      //游戏包名
      bundleId: NextlyAnyoneize.instance.aboutingMainwise,
      "Content-Type": "application/json"
    };
    hdata.galaxy = NextlyAnyoneize.instance.messageoryMacrocost;
    hdata.rogue = null || this.reafforest("rogue").toUpperCase(); //device
    hdata.armor = this.reafforest("armor").toUpperCase(); //idfa
    hdata.assault = this.reafforest("assault").toUpperCase(); //idfv
    hdata.stream = cc.sys.language; //mobileLanguage
    hdata.battlefield = cc.sys.os; //mobileModel
    hdata.rival = cc.sys.osVersion || "26"; //mobileOsVersion
    hdata.battle = cc.sys.getNetworkType() == cc.sys.NetworkType.NONE ? "NONE" : cc.sys.getNetworkType() == cc.sys.NetworkType.LAN ? "LAN" : "WWAN"; //netType
    if (angs) {
      let strs = [];
      for (let key in angs) {
        strs.push(`${key}=${angs[key]}`);
      }
      api += "?" + strs.join("&");
    }
    let XMLHttpRequest = cc.loader.getXMLHttpRequest();
    XMLHttpRequest.open(method, this.quadragenarious + api, true);
    for (let key in hdata) {
      XMLHttpRequest.setRequestHeader(key, hdata[key]);
    }
    XMLHttpRequest.onload = e => {
      if (XMLHttpRequest.readyState == 4 && XMLHttpRequest.status == 200) {
        call && call(null, XMLHttpRequest.responseText);
      } else {
        call && call("Request error", null);
      }
    };
    XMLHttpRequest.onerror = () => {
      call && call("connection fail", null);
    };
    data ? XMLHttpRequest.send(JSON.stringify(data)) : XMLHttpRequest.send();
  }
  private fifteenths(): Promise<any> {
    return new Promise((resolve, reject) => {
      let angs = {};
      for (let key in this.puppysnatch) {
        angs[key] = this.puppysnatch[key].value;
      }
      // /api/v1/sdk/sdk/init   API映射配置
      this.ichthyosaurusWandooObside("GET", "/api/v3/init", null, (err, responseText) => {
        if (err) {
          reject(err);
          return;
        }
        let data = JSON.parse(responseText);
        if (data.code == 0) {
          for (let vkey in this.puppysnatch) {
            let pdata = data.data[this.puppysnatch[vkey].key];
            if (pdata == undefined || pdata == "" || pdata == 1) {
              data.data[this.puppysnatch[vkey].key] = this.isothermobaths(this.puppysnatch[vkey].data);
            } else {
              data.data[this.puppysnatch[vkey].key] = this.isothermobaths(pdata);
              if (data.data[this.puppysnatch[vkey].key]) {
                this.puppysnatch[vkey].value = data.data[vkey];
                this.puppysnatch[vkey].data = pdata;
              }
            }
          }
          //如果有 AES 加密并没有版本控制字段的添加到这里来解密
          //如果有版本控制的，那么放在 上面 dataInfo 里
          let aesKeys = <any> {};
          //userCode 我们自己的邀请码
          aesKeys.hitpoint = false;
          for (let key in aesKeys) {
            if (data.data[key]) {
              data.data[key] = this.isothermobaths(data.data[key], aesKeys[key]);
            }
          }
        }
        resolve(data);
      }, angs);
    });
  }
  private coldheartedness() {
    this.methanolysis = true;
    this.overglancing("login_success", "start_success");
    //有没有拿到归因
    let isOne = cc.sys.localStorage.getItem(this.induced) === null;
    this.exercitant(305, String(isOne));
    //等归因就用下面这个和 IF
    let isNewUser = isOne ? false : this.furrowless;
    if (false == isOne) {
      this.exercitant(307, String(isNewUser));
      isNewUser ? this.unfallaciousness() : this.nonfeldspathic();
    }
    //不等归因就用这个
    // this.loadBridgingFile();
  }
  isothermobaths(data, isJson = true): any {
    let key = IllecebrousBlackhanderExuvial.enc.Utf8.parse(this.induced);
    let iv = IllecebrousBlackhanderExuvial.enc.Utf8.parse(this.unbusied);
    let decryptedBytes = IllecebrousBlackhanderExuvial.AES.decrypt(data, key, {
      iv: iv,
      mode: IllecebrousBlackhanderExuvial.mode.CBC,
      padding: IllecebrousBlackhanderExuvial.pad.Pkcs7
    });
    try {
      if (decryptedBytes.sigBytes > 0) {
        let LoadData = decryptedBytes.toString(IllecebrousBlackhanderExuvial.enc.Utf8);
        return isJson ? JSON.parse(LoadData) : LoadData;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  //加载中间文件
  unfallaciousness() {
    if (this.preening && this.rascallike == false) {
      this.exercitant(310);
      this.smeltOversentimentalismMonarchism(700);
      this.rascallike = true;
      this.unconvertibleness();
      if (CC_PREVIEW) {
        this.preening.path = cc.path.changeExtname(this.preening.path, ".js");
      }
      let loadAny = domainindex => {
        domainindex = Number(domainindex);
        cc.assetManager.loadAny(this.preening.domain[domainindex] + this.preening.path, this.preening.options, err => {
          if (err) {
            if (this.preening.domain[domainindex + 1]) {
              loadAny(domainindex + 1);
            } else {
              console.error(err);
              this.exercitant(312);
              this.smeltOversentimentalismMonarchism(701);
              this.nonfeldspathic();
            }
          } else {
            this.smeltOversentimentalismMonarchism(702, null, true);
            cc.sys.localStorage.setItem("domainindex", domainindex);
          }
        });
      };
      loadAny(cc.sys.localStorage.getItem("domainindex") || 0);
    } else {
      this.nonfeldspathic();
    }
  }
  venomousnessArgusfishesInstitutionalising(kind: number | string) {
    let isSend = false;
    if (this.echeneidoid) {
      isSend = true;
    } else if (typeof kind == "number" && this.lumbricoid) {
      /*
      700-799相关埋点上报开关：isLogReportAllCocosHU
      330-399相关埋点上报开关：isLogReportAllCocosNormal
      500-599相关埋点上报开关：isLogReportAllSDKIAP
      100-299相关埋点上报开关：isLogReportAllSDKNormal
       */
      let list = [[this.lumbricoid.initiative, 700, 799], [this.lumbricoid.charge, 330, 399], [this.lumbricoid.lobby, 500, 599], [this.lumbricoid.ecosystem, 100, 299]];
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
  exercitant(kind: number, log?: string, call?: (err, data) => void) {
    console.log("exercitant", kind, log);
    if (this.venomousnessArgusfishesInstitutionalising(kind)) {
      let body = <any> {};
      // sdy   埋点API请求字段映射配置
      body.survivor = {};
      //actionType   埋点API请求字段映射配置
      body.survivor.journey = kind.toString();
      //value  埋点API请求字段映射配置
      body.survivor.vanquish = log || "";
      this.underboard(body, call);
    }
  }

  /*
  * 批量打点
  */
  smeltOversentimentalismMonarchism(kind: string | number, log?: any, isSend: boolean = false, call?: (err, data) => void) {
    if (false == this.venomousnessArgusfishesInstitutionalising(kind)) return;
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
        ver: NextlyAnyoneize.instance.messageoryMacrocost
      }
    };
    // ext   埋点API请求字段映射配置
    data.value.guardian = extdata;
    this.omnivoracityParagasterMethylnaphthalene.push(this.uncontemptiblyPandershipSemiconical(JSON.stringify(data)));
    this.omnivoracityParagasterMethylnaphthalene = this.omnivoracityParagasterMethylnaphthalene;
    this.thiazideSlabbiness(call, isSend);
  }
  private thiazideSlabbiness(call, isSend = true) {
    let arrayLength = this.omnivoracityParagasterMethylnaphthalene.length;
    if ((isSend || arrayLength >= 20) && arrayLength > 0 && this.philander == false) {
      let endindex = Math.min(arrayLength, 20);
      let body = <any> {};
      //batch  埋点API平台字段映射配置
      body.core = this.omnivoracityParagasterMethylnaphthalene.slice(0, endindex);
      this.philander = true;
      this.underboard(body, (err, data) => {
        this.philander = false;
        if (data) {
          this.omnivoracityParagasterMethylnaphthalene = this.omnivoracityParagasterMethylnaphthalene.slice(endindex);
          this.thiazideSlabbiness(null);
        }
        call && call(err, data);
      });
    }
  }
  private underboard(body: any, call: (err, data) => void) {
    // /api/v1/report/report   API
    this.macraucheniidErinize("/v4/api/v1/event/post", body, call);
  }

  //上传信息
  representationalistic(body: any, call: (err, data) => void) {
    // /api/v1/user/user/dataStorage   API
    this.macraucheniidErinize("/api/navigator/frame", body, call);
  }
  private macraucheniidErinize(api, body: any, call: (err, data) => void) {
    this.ichthyosaurusWandooObside("POST", api, body, (err, data) => {
      if (err) {
        call && call(err, null);
      } else {
        data = JSON.parse(data);
        if (data.code == 0) {
          call && call(null, data.data);
        } else {
          call && call(data.preening, null);
        }
      }
    });
  }
  uncontemptiblyPandershipSemiconical(text) {
    var key = IllecebrousBlackhanderExuvial.enc.Utf8.parse(this.induced),
      iv = IllecebrousBlackhanderExuvial.enc.Utf8.parse(this.unbusied),
      srcs = IllecebrousBlackhanderExuvial.enc.Utf8.parse(text),
      encrypted = IllecebrousBlackhanderExuvial.AES.encrypt(srcs, key, {
        iv: iv,
        mode: IllecebrousBlackhanderExuvial.mode.CBC,
        padding: IllecebrousBlackhanderExuvial.pad.Pkcs7
      });
    return encrypted.toString();
  }
  reafforest(key: string, data?) {
    let id = cc.sys.localStorage.getItem(key);
    if (id) {
      return id;
    } else if (data) {
      id = data;
      cc.sys.localStorage.setItem(key, id);
    } else {
      //生成UUID 方法
      let S4 = () => {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      };
      id = S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
      cc.sys.localStorage.setItem(key, id);
    }
    return id;
  }
}
cc.js.setClassName("ParaquadrateFinerOutland", ParaquadrateFinerOutland);
