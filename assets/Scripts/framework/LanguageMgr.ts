interface lanData {
    id?: string,
    key: string,
    en: string,

    [key: string]: string
}


export default class i18 {
    static i18nArray = {};
    static myLanguge = "en";
    static COUNTRY_LIST = [
        {"id": 101, "name": "美国", "country": "US", "language": "en", "rate": 1, "symbol": "$", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 102, "name": "英国", "country": "GB", "language": "en", "rate": 1, "symbol": "￡", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 103, "name": "法国", "country": "FR", "language": "fr", "rate": 1, "symbol": "€", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 104, "name": "德国", "country": "DE", "language": "de", "rate": 1, "symbol": "€", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 105, "name": "日本", "country": "JP", "language": "ja", "rate": 100, "symbol": "円", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 106, "name": "加拿大", "country": "CA", "language": "en", "rate": 1, "symbol": "$", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 107, "name": "澳大利亚", "country": "AU", "language": "en", "rate": 1, "symbol": "$", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 108, "name": "新西兰", "country": "NZ", "language": "en", "rate": 1, "symbol": "$", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 109, "name": "挪威", "country": "NO", "language": "no", "rate": 10, "symbol": "NOK", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 110, "name": "新加坡", "country": "SG", "language": "en", "rate": 1, "symbol": "$", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 111, "name": "瑞典", "country": "SE", "language": "se", "rate": 10, "symbol": "SEK", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 112, "name": "瑞士", "country": "CH", "language": "de", "rate": 1, "symbol": "CHF", "ibr": 0.2, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 1},
        {"id": 201, "name": "西班牙", "country": "ES", "language": "es", "rate": 1, "symbol": "€", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 202, "name": "阿拉伯", "country": "SA", "language": "ar", "rate": 5, "symbol": "SR", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 203, "name": "波兰", "country": "PL", "language": "pl", "rate": 5, "symbol": "złote", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 204, "name": "韩国", "country": "KR", "language": "ko", "rate": 1000, "symbol": "₩", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 205, "name": "意大利", "country": "IT", "language": "it", "rate": 1, "symbol": "€", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 206, "name": "比利时", "country": "BE", "language": "nl", "rate": 1, "symbol": "€", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 207, "name": "荷兰", "country": "NL", "language": "nl", "rate": 1, "symbol": "€", "ibr": 0.05, "pay_a": {"PayPal": 751}, "pay_b": {"PayPal": 751}, "ad_t": 2},
        {"id": 301, "name": "印度", "country": "IN", "language": "hi", "rate": 80, "symbol": "₹", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 302, "name": "印尼", "country": "ID", "language": "in", "rate": 15000, "symbol": "Rp", "ibr": 0.05, "pay_a": {"DANA": 756, "OVO": 761}, "pay_b": {"DANA": 756, "OVO": 761}, "ad_t": 3},
        {"id": 303, "name": "葡萄牙", "country": "PT", "language": "pt", "rate": 1, "symbol": "€", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 304, "name": "泰国", "country": "TH", "language": "th", "rate": 30, "symbol": "฿", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 305, "name": "菲律宾", "country": "PH", "language": "fil", "rate": 50, "symbol": "₱", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 306, "name": "马来西亚", "country": "MY", "language": "ms", "rate": 5, "symbol": "RM", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 307, "name": "哥伦比亚", "country": "CO", "language": "es", "rate": 3000, "symbol": "COP", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 308, "name": "阿根廷", "country": "AR", "language": "es", "rate": 350, "symbol": "ARS", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 309, "name": "墨西哥", "country": "MX", "language": "es", "rate": 20, "symbol": "Mex.$", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 310, "name": "巴西", "country": "BR", "language": "pt", "rate": 5, "symbol": "R$", "ibr": 0.05, "pay_a": {"PAGBANK": 741, "PIX": 746}, "pay_b": {"PAGBANK": 741, "PIX": 746}, "ad_t": 3},
        {"id": 311, "name": "越南", "country": "VN", "language": "vi", "rate": 20000, "symbol": "₫", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 312, "name": "土耳其", "country": "TR", "language": "tr", "rate": 8, "symbol": "₺", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 313, "name": "罗马尼亚", "country": "RO", "language": "ro", "rate": 5, "symbol": "Lei", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 314, "name": "约旦", "country": "JO", "language": "ar", "rate": 1, "symbol": "$", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 315, "name": "伊拉克", "country": "IQ", "language": "ar", "rate": 1, "symbol": "$", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 316, "name": "埃及", "country": "EG", "language": "ar", "rate": 1, "symbol": "$", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 317, "name": "以色列", "country": "IL", "language": "ar", "rate": 1, "symbol": "$", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 318, "name": "俄罗斯", "country": "RU", "language": "ru", "rate": 70, "symbol": "₽", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 319, "name": "乌克兰", "country": "UA", "language": "uk", "rate": 20, "symbol": "₴", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3},
        {"id": 400, "name": "SBALL", "country": "SBALL", "language": "en", "rate": 1, "symbol": "$", "ibr": 0.05, "pay_a": {}, "pay_b": {}, "ad_t": 3}
    ];
    private static _FRESH_STRINGArray = [];

    /* 初始化语言
     * i18Json  多语言数据
     * lan 当前语言，不传的话为本机语言
     * COUNTRY_LIST 国家配置表 不传的话用默认的
     */
    static init(i18Json: lanData[], lan?: string, COUNTRY_LIST?) {
        i18.addi18nArray(i18Json);
        i18.setLanguage(lan || cc.sys.languageCode);
        COUNTRY_LIST && (i18.COUNTRY_LIST = COUNTRY_LIST);
        let getLanguageString = function (value) {
            let str = i18.getKeyStr(value);
            if (str) {
                if (!this.sKey) {
                    for (let i = i18._FRESH_STRINGArray.length - 1; i >= 0; i--) {
                        let label = i18._FRESH_STRINGArray[i];
                        if (!cc.isValid(label) || !label.sKey) {
                            i18._FRESH_STRINGArray.splice(i, 1);
                        }
                    }
                    i18._FRESH_STRINGArray.push(this);
                }
                this.sKey = value;
                this.keystring = str;
                value = str;
            } else if (this.sKey && this.keystring != value) {
                this.sKey = null;
            }
            return value;
        };
        let label = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set(value) {
                label.set.call(this, getLanguageString.call(this, value.toString()));
            },
            get() {
                this._string = getLanguageString.call(this, this._string);
                return label.get.call(this);
            }
        });

        let richText = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set(value) {
                richText.set.call(this, getLanguageString.call(this, value.toString()));
            },
            get() {
                this._N$string = getLanguageString.call(this, this._N$string);
                return richText.get.call(this);
            }
        });
    }

    /*
     * 添加语言
     * lans 多语言数据
     */
    static addi18nArray(lans: lanData[]) {
        if (!CC_EDITOR) {
            if (i18.i18nArray) {
                for (let data of lans) {
                    let index = data.key.lastIndexOf("_") + 1;
                    let pkey = data.key.substring(0, index);
                    let num = parseInt(data.key.substring(index, data.key.length));
                    if (i18.i18nArray[pkey] == undefined) {
                        i18.i18nArray[pkey] = {};
                    }
                    if (i18.i18nArray[pkey][num] == undefined) {
                        i18.i18nArray[pkey][num] = data;
                    } else {
                        console.error(`${pkey}${num} 已存在`);
                    }
                }
            } else {
                i18.i18nArray = {};
                setTimeout(() => {
                    this.addi18nArray(lans);
                }, 16.6);
            }
        }
    }

    /*
     *设置语言
     * lan 语言
     */
    static setLanguage(lan: string) {
        function lang(langcode) {
            let index = langcode.indexOf("#");
            langcode = langcode.substring(0, index == -1 ? langcode.length : index);
            let langarr = langcode.split(langcode.indexOf("_") != -1 ? "_" : "-");
            for (let i = langarr.length - 1; i >= 0; i--) {
                if (langarr[i] == "") {
                    langarr.splice(i, 1);
                }
            }
            let data = {lang: langarr[0], country: "SBALL"};
            if (langarr.length > 1) {
                data = {lang: langarr[0], country: langarr[langarr.length - 1]};
            }
            return data;
        }

        function getContryData(langcode: string) {
            let data = lang(langcode);
            let CountryList = i18.COUNTRY_LIST;
            for (let country of CountryList) {
                if (data.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            data = {lang: "en", country: "SBALL"};
            for (let country of CountryList) {
                if (data.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            return CountryList[0];
        }

        let data = getContryData(lan);
        i18.myLanguge = "zh";//CC_DEBUG ? "zh" : data.language;
        i18.updataString();
    }

    private static updataString() {
        for (let i = i18._FRESH_STRINGArray.length - 1; i >= 0; i--) {
            let label = i18._FRESH_STRINGArray[i];
            if (!cc.isValid(label) || !label.sKey) {
                i18._FRESH_STRINGArray.splice(i, 1);
            } else {
                let str = i18.getKeyStr(label.sKey);
                label.keystring = str;
                label.string = str;
            }
        }
    }


    private static getReplaceStr(key: string, code: number) {
        if (i18.i18nArray[key] && i18.i18nArray[key][code]) {
            if (i18.i18nArray[key][code][i18.myLanguge]) {
                return i18.i18nArray[key][code][i18.myLanguge];
            } else {
                if (i18.i18nArray[key][code]["en"]) {
                    return i18.i18nArray[key][code]["en"];
                } else {
                    return null;
                }
            }

        }
    }

    private static changeStr(string: string) {
        for (let key in i18.i18nArray) {
            let index = string.indexOf(key);
            if (index != -1) {
                let result = string;
                let num = string.substring(index + key.length, index + key.length + 3);
                let code = parseInt(num);
                let replaceStr: string = i18.getReplaceStr(key, code);
                if (replaceStr) {
                    result = string.replace(key + num, replaceStr);
                    let result2 = this.changeStr(result);
                    if (result2) {
                        result = result2;
                    }
                }
                return result;
            }
        }
        return null;
    }

    private static parseURL(url) { //解析GET请求url上?后的请求参数，将请求参数从url上取下来，放到{}中
        let result = {},
            seg = url.split("&"), len = seg.length, i = 0, s;
        for (; i < len; i++) {
            if (!seg[i]) {
                continue;
            }
            s = seg[i].split("==");
            s[1] = s[1].replace(/%/g, "%25");
            result[s[0]] = decodeURIComponent(s[1]);
        }
        return result;
    }

    private static getKeyStr(string) {
        if (!i18.i18nArray) {
            return;
        }
        if (string.indexOf("{") != -1) {
            try {
                let data = JSON.parse(string);
                for (let key in data) {
                    let str = i18.changeStr(key);
                    let pdata = data[key];
                    for (let i in pdata) {
                        let rstr = i18.getKeyStr(pdata[i]) || pdata[i];
                        let code = i.substring(1, i.length);
                        str = str.replace(`xxx_${code}`, rstr);
                    }
                    return str;
                }
            } catch (e) {
    
            }
        }
        let str = i18.changeStr(string);
        if (str) {
            let pindex = str.indexOf("??&");
            if (pindex != -1) {
                let before = str.substring(0, pindex);
                let after = str.substring(pindex + 2, str.length);
                let data = i18.parseURL(after);
                let xxarr = before.match(/xxx_\d/g);
                if (xxarr)
                    for (let i = 0; i < xxarr.length; i++) {
                        before = before.replace(xxarr[i], data["value" + xxarr[i].substring(4, 5)]);
                    }
                return before;
            }
            return str;
        }
    
        return null;
    }
}