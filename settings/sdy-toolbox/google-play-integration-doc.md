## Cocos引擎 可选功能接入及API

### 初始化

```Java
// 获取application和activity类名,打包的时候需要用到这里的内容作为出包配置  ps: "包名" 需要替换成自己真实的包名, 得到applicaiton和activity路径之后不需要再次调用该函数了
let doc = ABJCUHDNRYIUEHTY.OTKPRUM().DPCIANOFTVGS("包名")  

// SDK初始化，必须   ps: "包名" 需要替换成自己真实的包名
ABJCUHDNRYIUEHTY.OTKPRUM().APLGVLNQXUOGIXLE("包名");    
```

### 邀请码

```typescript
// 用户邀请码
ABJCUHDNRYIUEHTY.OTKPRUM().QIZRKRUOQY().HTJGJHP(new MyInviteCodeListener())

class MyInviteCodeListener implements TGGOQXX {

    OHJYRTEFQ(LNLEZKFUQVZWI: string) {
          // 这里可以获取到需要的邀请码
    }
}
```

###  兑换开关

```typescript
//兑换开关

ABJCUHDNRYIUEHTY.OTKPRUM().LOXKZMS().QFTBNJ(new MyThemeListener());

class MyThemeListener implements TFAKQV {

    BEYPQAXUZUQC(newTheme: boolean) {
        AppsFlyerDemo.INSTANCE.logPrint("[Listener] newTheme: " + newTheme);
    }

}


```

### 自定义配置监听

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().YAOLFR().ANRVFUXTLL(new MyCpClientListener());


class MyCpClientListener implements JSHKSGNZCJVKYP {
    BZYZOOIUIKVLDDY(VLKQGK: string) {
        // 这里可以获取自定义配置信息
        AppsFlyerDemo.INSTANCE.logPrint("[Listener] cpClient: " + VLKQGK);
    }

}

```



### 自定义事件打点

```typescript
// eventName: 事件名  类型 : string
// properties: 属性 类型: Dictionary<string, object>
ABJCUHDNRYIUEHTY.OTKPRUM().VIBXPK().FFHOPNVPCKQKDY(eventName, property);
```

### 横幅广告

#### 设置横幅广告回调

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().OIWXAWIZI(new 
MyBannerListener());

class MyBannerListener implements KQXVTR {

    EBEOBLBO(ad: GameAd){
       // 横幅广告展示回调
    }

    JFOBFAEBPU(ad: GameAd){
      // 横幅广告点击回调
    }

    ITTHTLEDWOUNHTP(ad: GameAd){
      // 横幅广告关闭回调
    }
}
```



#### 展示横幅广告

```typescript
// 参数1: gravity  锚点位置:  0: 以顶部为锚点  1: 以底部为锚点
// 参数2: margin   距离锚点的位置: 单位像素
ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().LWKWCWTTHPNLFLLU(1, 300);
```

#### 隐藏横幅广告

```typescript
  ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().YJFRMBUZHYRTKW();
```



### MREC广告

#### MREC广告回调

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().OIWXAWIZI(new 
MyBannerListener());

class MyBannerListener implements KQXVTR {

    EBEOBLBO(ad: GameAd){
       // 横幅广告展示回调
    }

    JFOBFAEBPU(ad: GameAd){
      // 横幅广告点击回调
    }

    ITTHTLEDWOUNHTP(ad: GameAd){
      // 横幅广告关闭回调
    }
}
```

#### 展示MREC广告

```typescript
// 参数1: gravity  锚点位置:  0: 以顶部为锚点  1: 以底部为锚点
// 参数2: margin   距离锚点的位置: 单位像素
ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().FDCLLAMYQRUJI(0, 300);
```



#### 隐藏MREC广告

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().PBWOHAPKNTUKWG().YWCMZRMSDFCIDNP();
```



### 开屏广告

#### 冷/热启动回调

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().LWYONFHPJYNECVHN().JXVKMEPVGCBVK(new MyLauncherListener());

class MyLauncherListener implements LZOBXGFV {
    XOKKTVZKZXJC(firstLaunch: number) {
        // firstLaunch 1: 冷启动 0: 热启动
    }
}
```



#### 开关广告回调监听

```typescript
 ABJCUHDNRYIUEHTY.OTKPRUM().UTPKRWEZLFHMYSR().YZYXAKSDWXOLJ(new MySplashListener());
 
 class MySplashListener implements DZAVKRLJX {
    XHBRCH(ad: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[MySplashListener] onSplashAdClick" + " revenue:" + ad.revenue);
    }

    INHDTHCA(ad: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[MySplashListener] onSplashAdClose" + " revenue:" + ad.revenue);
    }

    ZNEMSJQVXBGJKMW(ad: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[MySplashListener] onSplashAdShowed" + " revenue:" + ad.revenue);
    }

}
```

#### 检查开屏广告是否有填充

```typescript
// true:  有填充  false: 无填充
  let isReady = ABJCUHDNRYIUEHTY.OTKPRUM().UTPKRWEZLFHMYSR().EHRRPBEKWC();
```

#### 展示开屏广告

```typescript
// true: 展示成功 false: 展示失败
let showSplash = ABJCUHDNRYIUEHTY.OTKPRUM().UTPKRWEZLFHMYSR().LVANMKT(AppsFlyerDemo.GAME_ENTRY);
```



### 激励视频

#### 激励视频按钮展示（曝光）统计【非必要，按产品需求】

```typescript
// 视频按钮曝光统计，参数表示从哪个位置播放视频广告，可以传 ""
// （每展示一次调用一次）
ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().AAQFIQPRCER("game");
```

#### 检查激励视频是否有填充

```javascript
let hasVideo = ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().SBHXPPIA("game");
```



#### 展示激励视频广告

```typescript
// 播放视频广告,如果广告无填充，返回false。有填充返回true并且播放广告
let showVideo = ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().VDNFQPXDYDU("game");
```

#### 激励视频广告回调监听

```typescript
// 设置视频广告监听
ABJCUHDNRYIUEHTY.OTKPRUM().RLLYQCGBRCK().CZOFLOMIINJO(new MyVideoAdListener());

class MyVideoAdListener implements PKQEEMPEWUHK {

    SWFLEASBVFKC(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoAdStart: " + par_ad_par.entry);
    }

    UWHIILBVLAZSZ(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoClick: " + par_ad_par.entry);
    }

    ABJJNWQ(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoClose: " + par_ad_par.entry);
    }

    LTSHSVTWAQAIZX(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onVideoReward: " + par_ad_par.entry);
    }

    REEVFESOCTAHCCVG(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[RewardedVideoAdListener] onAdRevenue: " + par_ad_par.revenue);
    }
}
```

###  插屏广告

#### 查询插屏广告

```typescript
// 查询是否有插屏广告
let isReady = ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().UNVQTFRLZRFEUC("game");
```

#### 展示插屏广告

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().DTSYWGMBSCYN("game");
```

#### 插屏广告回调监听

```typescript
ABJCUHDNRYIUEHTY.OTKPRUM().JFMLAZGGJGIWRP().PFHARDSYU(new MyInterstitialAdListener());


class MyInterstitialAdListener implements CXADIVYSYQD {

    QZIDUNEJ(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialStart: " + par_ad_par.entry);
    }

    LDAFGWCGVTLDRC(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialClick: " + par_ad_par.entry);
    }

    JDBEBZSPCKF(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onInterstitialClose: " + par_ad_par.entry);
    }

    REEVFESOCTAHCCVG(par_ad_par: GameAd) {
        AppsFlyerDemo.INSTANCE.logPrint("[InterstitialAdListener] onAdRevenue: " + par_ad_par.revenue);
    }


}
```

### 导流广告

#### 显示导流广告

```typescript
// 参数一:  广告单元id
// 参数二:  广告宽度大小  单位像素
// 参数三:  广告高度大小   单位像素
// 参数四:  广告距离屏幕最左边的位置  单位像素
// 参数五:  广告广告距离屏幕最顶部的位置 单位像素
ABJCUHDNRYIUEHTY.OTKPRUM().fun_newbyear_fun().fun_showNewbyearIconAd_fun("cpmm2dev_1", 200, 200, 100, 200);
```

#### 隐藏导流广告

```typescript
// 参数一: 广告单元id
ABJCUHDNRYIUEHTY.OTKPRUM().fun_newbyear_fun().fun_hideNewbyearIconAd_fun("cpmm2dev_1");
```



### pp卡打点

```typescript
// pp卡卡槽展示
LWSUGNQUXE.SJQDXS();
// pp卡弹窗展示
LWSUGNQUXE.ILDZNU();
// pp卡点击领取
LWSUGNQUXE.AIIIBCZPPOPDB();
// pp卡领取成功
LWSUGNQUXE.QFYSSNZC();
// pp卡免费奖励展示
LWSUGNQUXE.AIKSAGONK();
// pp卡免费奖励点击
LWSUGNQUXE.FOLGBKBJ();
// pp卡免费奖励领取成功
LWSUGNQUXE.CNLBWNB();

// 显示游戏界面（冷启动后引擎载入后的第一屏）
LWSUGNQUXE.YUNGCU();

// 显示游戏界面（冷启动后引擎载入后的第一屏）,并展示开屏
LWSUGNQUXE.QWXMVQR();

```

### 网赚/礼包用户生命周期关键节点打点

说明: 该"事件名"参数已经封装在函数中,无需用户传递,用户只需传递"属性"参数即可

```typescript
事件名：game_life_key_node  
属性：
    "step"
        属性值：
            hot_start: 用户开始热更
            hot_end:   用户热更完成
            into_game: 进入游戏
            guide_start: 开始新手引导
            guide_end: 结束新手引导
            start_game: 开始游戏
            first_ad: 看第一次广告【以show的回调为准】
            reach_threshold: 达到收集门槛【达到第一个档位】
            submit_order: 订单提交【提交兑换订单】
            finish_task_1: 完成任务1【第一个订单】【第一期只追溯15天】
            finish_task_2: 完成任务2
            finish_task_3: 完成任务3
            finish_task_4: 完成任务4
            finish_task_5: 完成任务4
            finish_task_6: 完成任务4
            finish_task_7: 完成任务4
            finish_task_8: 完成任务4
            ...
    "duration":
        时长，只有hot_end步骤需要，hot_start到hot_end的时长，单位毫秒
    "res_ver":
        字符串类型
        热更版本，step=hot_end的时候必须传

使用样例:
let hot_start_properties = {
    "step": "hot_start"
}
LWSUGNQUXE.AJAWWHYZCCKG(hot_start_properties);
```



### 获取设备常用信息

```typescript


// 查询设备idfa信息
ABJCUHDNRYIUEHTY.OTKPRUM().CNKHFBQPXF().GUIQQGAXN();

// 查询设备国家码
ABJCUHDNRYIUEHTY.OTKPRUM().CNKHFBQPXF().QOQFWRMNWSF();

// 查询设备语言码
ABJCUHDNRYIUEHTY.OTKPRUM().CNKHFBQPXF().IAWAAMMMZBJRY();

// 用户注册国家
let regCountry = ABJCUHDNRYIUEHTY.OTKPRUM().CNKHFBQPXF().NBMMIHNKKAASAV();

//获取归因信息
let attribution = ABJCUHDNRYIUEHTY.OTKPRUM().LWYONFHPJYNECVHN().ZUSOUL();

// 打开sdk日志调试开关(默认是关闭状态)
ABJCUHDNRYIUEHTY.OTKPRUM().LWYONFHPJYNECVHN().ZUAGLWPOYYLZI(true);

// 网络是否可用  "1": 可用 "0":不可用
let isNetworkAvailable = ABJCUHDNRYIUEHTY.OTKPRUM().APXSSQRWIGHEHXWM().IWJVUPLXV();

// 跳转到gp(参数: 包名)
ABJCUHDNRYIUEHTY.OTKPRUM().APXSSQRWIGHEHXWM().VFNNPHVSD("xxx");


// 打开网址(网址地址)
ABJCUHDNRYIUEHTY.OTKPRUM().APXSSQRWIGHEHXWM().FZEMWGKA("xxx");

// 打开max聚合平台测试面板
ABJCUHDNRYIUEHTY.OTKPRUM().APXSSQRWIGHEHXWM().HUZBFEBFPHJKM();

```

### 第三方平台打点

#### adjust打点

```typescript
// 参数一:  事件token
// 参数二: 属性集（可选）, 这里属性值支持  "revenue" 传 "revenue" 作为key(收益)  "currency" 传 "currency" 作为key(货币单位) "orderId" 传 "orderId" 作为key(订单号)

let data = {
    "revenue": 2.87,
    "currency": "USD",
    "orderId": "123"
}
ABJCUHDNRYIUEHTY.OTKPRUM().VIBXPK().WNZFGPJ("testAdjust", data)
```

#### firebase打点

```typescript
// 参数一:  事件名
// 参数二: 属性集（可选）
let data = {
    "value": 1.24,
    "currency": "USD",
}
ABJCUHDNRYIUEHTY.OTKPRUM().VIBXPK().GVDVCQU("testFirebase", data);
```

#### facebook打点

```typescript
// 参数一:  事件名
// 参数二: 属性集（可选）
let data = {
    "revenue": 4.21,
    "currency": "USD",
    "testProperties": 23
}
 ABJCUHDNRYIUEHTY.OTKPRUM().VIBXPK().JQNXYUCCC("testFacebook", data);
```

### 自定义网络请求

#### get请求

##### get请求方式一

```typescript

// 方式一: 通过传递请求X-Forwarded参数(X-Forwarded: 参考协议文档 Headers的 X-Forwarded 参数值) 和 请求query参数(类型: 字符串类型) 
// 样例: X-Forwarded: 1007
let time : number = new Date().getTime();
let queryParams = {
    "timestamp": time.toString()
};
ABJCUHDNRYIUEHTY.OTKPRUM().IIMHVQRVNRFTO().IXUDPKYSSAYGXCS("1007", queryParams, new MyHttpResponseCallback());
class MyHttpResponseCallback implements NDTZDOPMOSRRJO {

    LHWVRV(json: string) {
        AppsFlyerDemo.INSTANCE.logPrint("[MyHttpResponseCallback] onResponse: " + json);
    }
}


```

##### get请求方式二

```typescript
// 方式二: : 通过传递请求headers(类型: 字符串类型)(X-Forwarded: 参考协议文档 Headers的 X-Forwarded 参数值) 和 请求query参数(类型: 字符串类型) 
// 样例: X-Forwarded: 1007
 let headersParams = {
     "X-Forwarded": "1007",
     "key1": "001",
     "key2":"abc"
 };

let time : number = new Date().getTime();
let queryParams = {
    "timestamp": time.toString()
};
ABJCUHDNRYIUEHTY.OTKPRUM().IIMHVQRVNRFTO().VUCMLLAKCBDUWV(headersParams, queryParams, new MyHttpResponseCallback());

class MyHttpResponseCallback implements NDTZDOPMOSRRJO {

    LHWVRV(json: string) {
        AppsFlyerDemo.INSTANCE.logPrint("[MyHttpResponseCallback] onResponse: " + json);
    }
}
```



#### post请求

##### post请求方式一

```typescript
// 方式一: 通过传递请求X-Forwarded参数(X-Forwarded: 参考协议文档 Headers的 X-Forwarded 参数值) 和 请求body参数(类型: 字符串类型)
// 样例: X-Forwarded: 1101
let time : number = new Date().getTime();
let bodyParams = {
    "product_id": "iap_1",
    "custom_id": time.toString()
};
ABJCUHDNRYIUEHTY.OTKPRUM().IIMHVQRVNRFTO().YDNBJIJQSMCBZRZK("1101", bodyParams, new MyHttpResponseCallback());

class MyHttpResponseCallback implements NDTZDOPMOSRRJO {

    LHWVRV(json: string) {
        AppsFlyerDemo.INSTANCE.logPrint("[MyHttpResponseCallback] onResponse: " + json);
    }
}
```

##### post请求方式二

```typescript
// 方式二: 通过传递请求headers(类型: 字符串类型)(X-Forwarded: 参考协议文档 Headers的 X-Forwarded 参数值) 和 请求body参数(类型: 字符串类型) 
// 样例: X-Forwarded: 1101
let headersParams = {
    "X-Forwarded": "1101",
    "key1": "002",
    "key2":"cha"
};

let time : number = new Date().getTime();
let bodyParams = {
    "product_id": "iap_1",
    "custom_id": time.toString()
}
ABJCUHDNRYIUEHTY.OTKPRUM().IIMHVQRVNRFTO().VCAING(headersParams, bodyParams, new MyHttpResponseCallback());

class MyHttpResponseCallback implements NDTZDOPMOSRRJO {

    LHWVRV(json: string) {
        AppsFlyerDemo.INSTANCE.logPrint("[MyHttpResponseCallback] onResponse: " + json);
    }
}
```


### CPL

```typescript
// 设置任务监听
ABJCUHDNRYIUEHTY.OTKPRUM().PGWQVPNJDR().YCTPAS(new MyTaskListener());


class MyTaskListener implements FIJWZYKHTY {
    
     // config: 数据类型为json字符串
     // 数据样例: {"type":"mobplus_callback","data":{"id":"{SUB2}","country":"{COUNTRY}","revenue":null,"currency":"{CURRENCY}"}}
    XIQMWSSMNH(config: string) {
        // type: 种类
        // 	 种类一: "myappfree_callback" : MAF积分墙
        //   种类二: "mobplus_callback" : mobplus
        // data: 数据
    }
}
```