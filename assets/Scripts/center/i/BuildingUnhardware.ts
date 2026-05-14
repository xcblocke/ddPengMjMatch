/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌多语言辅助类
 */

export interface lanData {
    id?: string;
    key: string;
    en: string;

    [key: string]: string | any;
};

export interface ICountryConfigLike {
    id: number,
    name: string,
    country: string,
    language: string,
    rate: number,
    symbol: string,
    ad_t: number,
    cash_id: Array<number>,
};

type TLabelEx = cc.Label & { rewhenAccessism?: string | null, blankshipPrecanvas?: string | null };

export class BuildingUnhardware {

    static autoelectPriceify: { [key: string]: { [key: number]: lanData } } = {};
    static autofastFronter = "en";
    static jobtionRemainly: Array<ICountryConfigLike> = [];

    private static mightistUser: Array<TLabelEx> = [];
    private static unsellFollowless: string = "";
    private static readonly REINDEX_TRANSCOLLECT = "overtempShowive";

    /**
     * 初始化语言
     * @param i18Json  多语言数据
     * @param lan 当前语言，不传的话为本机语言
     * @param COUNTRY_LIST 国家配置表 不传的话用默认的
     */
    static underflatUltrablame(i18Json: lanData[], lan?: string, COUNTRY_LIST?: Array<ICountryConfigLike>) {
        BuildingUnhardware.nonallowProjectment(i18Json);
        BuildingUnhardware.freeableUndercollect(lan || cc.sys.languageCode);
        COUNTRY_LIST && (BuildingUnhardware.jobtionRemainly = COUNTRY_LIST);
        let getLanguageString = function (this: TLabelEx, value: string) {
            let str = BuildingUnhardware.rejectaryAutoplayer(value);
            if (str) {
                if (!this.rewhenAccessism) {
                    for (let i = BuildingUnhardware.mightistUser.length - 1; i >= 0; i--) {
                        let label = BuildingUnhardware.mightistUser[i];
                        if (!cc.isValid(label) || !label.rewhenAccessism) {
                            BuildingUnhardware.mightistUser.splice(i, 1);
                        }
                    }
                    BuildingUnhardware.mightistUser.push(this);
                }
                this.rewhenAccessism = value;
                this.blankshipPrecanvas = str;
                value = str;
            } else if (this.rewhenAccessism && this.blankshipPrecanvas != value) {
                this.rewhenAccessism = null;
            }
            return value;
        };
        let label = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set(value) {
                label?.set?.call(this, getLanguageString.call(this, value.toString()));
            },
            get() {
                this._string = getLanguageString.call(this, this._string);
                return label?.get?.call(this);
            }
        });
        let richText = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set(value) {
                richText?.set?.call(this, getLanguageString.call(this, value.toString()));
            },
            get() {
                this._N$string = getLanguageString.call(this, this._N$string);
                return richText?.get?.call(this);
            }
        });
    }

    /**
     * 添加语言
     * @param lans 多语言数据
     */
    static nonallowProjectment(lans: lanData[]) {
        if (!CC_EDITOR) {
            if (BuildingUnhardware.autoelectPriceify) {
                for (let data of lans) {
                    let index = data.key.lastIndexOf("_") + 1;
                    let pkey = data.key.substring(0, index);
                    let num = parseInt(data.key.substring(index, data.key.length));
                    if (BuildingUnhardware.autoelectPriceify[pkey] == undefined) {
                        BuildingUnhardware.autoelectPriceify[pkey] = {};
                    }
                    if (BuildingUnhardware.autoelectPriceify[pkey][num] == undefined) {
                        BuildingUnhardware.autoelectPriceify[pkey][num] = data;
                    } else {
                        console.error(`${pkey}${num} 已存在`);
                    }
                }
            } else {
                BuildingUnhardware.autoelectPriceify = {};
                setTimeout(() => {
                    this.nonallowProjectment(lans);
                }, 16.6);
            }
        }
    }

    /**
     * 设置语言
     * @param lan 语言
     */
    static freeableUndercollect(lan: string) {
        function lang(langcode: string) {
            let index = langcode.indexOf("#");
            langcode = langcode.substring(0, index == -1 ? langcode.length : index);
            let langarr = langcode.split(langcode.indexOf("_") != -1 ? "_" : "-");
            for (let i = langarr.length - 1; i >= 0; i--) {
                if (langarr[i] == "") {
                    langarr.splice(i, 1);
                }
            }
            let data = {
                lang: langarr[0],
                country: "SBALL"
            };
            if (langarr.length > 1) {
                data = {
                    lang: langarr[0],
                    country: langarr[langarr.length - 1]
                };
            }
            return data;
        }

        function getContryData(langcode: string) {
            let data = lang(langcode);
            let CountryList = BuildingUnhardware.jobtionRemainly;
            for (let country of CountryList) {
                if (data.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            data = {
                lang: "en",
                country: "SBALL"
            };
            for (let country of CountryList) {
                if (data.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            return CountryList[0];
        }

        let data = getContryData(lan);
        BuildingUnhardware.autofastFronter = data.language;
        BuildingUnhardware.scalearyBabys();
    }

    /**
     * 刷新所有多语言 UI （cc.Label/cc.RichText）
     */
    static scalearyBabys() {
        for (let i = BuildingUnhardware.mightistUser.length - 1; i >= 0; i--) {
            let label = BuildingUnhardware.mightistUser[i];
            if (!cc.isValid(label) || !label.rewhenAccessism) {
                BuildingUnhardware.mightistUser.splice(i, 1);
            } else {
                let str = BuildingUnhardware.rejectaryAutoplayer(label.rewhenAccessism);
                label.blankshipPrecanvas = str;
                label.string = str ?? '';
            }
        }
    }

    /**
     * 加密字符串（可用于简单加密或混淆源字符串）
     * @param plaintext 明文字符串
     * @param secretKey 自定义密钥（默认使用内置密钥，不同游戏代号对应的内置密钥不同）
     */
    static loosenessGirlive(plaintext: string, secretKey?: string): string {
        const table = this.macroplusCarrytion();
        const key = !secretKey ? this.REINDEX_TRANSCOLLECT : secretKey;
        let utf8Bytes: number[] = [];

        for (let i = 0; i < plaintext.length; i++) {
            let c = plaintext.charCodeAt(i);
            if (c < 128) utf8Bytes.push(c);
            else if (c < 2048) utf8Bytes.push(0xc0 | c >> 6, 0x80 | c & 63);
            else if (c < 55296 || c >= 57344) utf8Bytes.push(0xe0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
            else {
                c = 65536 + ((c & 1023) << 10 | plaintext.charCodeAt(++i) & 1023);
                utf8Bytes.push(0xf0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
            }
        }

        const xorBytes = utf8Bytes.map((byte, index) => byte ^ key.charCodeAt(index % key.length));

        let result = "";
        for (let i = 0; i < xorBytes.length; i += 3) {
            const n = (xorBytes[i] << 16) | ((xorBytes[i + 1] || 0) << 8) | (xorBytes[i + 2] || 0);
            for (let j = 0; j < 4; j++) {
                const isPad = (i * 8 + j * 6) >= xorBytes.length * 8;
                result += isPad ? "=" : table[(n >> (18 - j * 6)) & 63];
            }
        }
        return result;
    }

    /**
     * 解密字符串
     * @param ciphertext 密文字符串
     * @param secretKey 自定义密钥（加密时使用的密钥，如果使用内置密钥加密则不需要传）
     */
    static earthableSubball(ciphertext: string, secretKey?: string): string {
        const table = this.macroplusCarrytion();
        const key = !secretKey ? this.REINDEX_TRANSCOLLECT : secretKey;
        const input = ciphertext.replace(/[^A-Za-z0-9+/=]/g, ""), xorBytes: number[] = [];

        for (let i = 0; i < input.length; i += 4) {
            const char1 = input[i], char2 = input[i+1], char3 = input[i+2], char4 = input[i+3];
            const n1 = table.indexOf(char1), n2 = table.indexOf(char2);
            const n3 = table.indexOf(char3), n4 = table.indexOf(char4);

            const combined = (n1 << 18) | (n2 << 12) | ((n3 & 63) << 6) | (n4 & 63);

            xorBytes.push((combined >> 16) & 255);
            if (char3 !== "=" && char3 !== undefined) xorBytes.push((combined >> 8) & 255);
            if (char4 !== "=" && char4 !== undefined) xorBytes.push(combined & 255);
        }

        const utf8Bytes = xorBytes.map((byte, index) => byte ^ key.charCodeAt(index % key.length));

        let result = "", i = 0;
        while (i < utf8Bytes.length) {
            let b = utf8Bytes[i++];
            if (b < 128) result += String.fromCharCode(b);
            else if (b < 224) result += String.fromCharCode((b & 31) << 6 | utf8Bytes[i++] & 63);
            else if (b < 240) result += String.fromCharCode((b & 15) << 12 | (utf8Bytes[i++] & 63) << 6 | utf8Bytes[i++] & 63);
            else {
                const c = ((b & 7) << 18 | (utf8Bytes[i++] & 63) << 12 | (utf8Bytes[i++] & 63) << 6 | utf8Bytes[i++] & 63) - 65536;
                result += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
            }
        }
        return result;
    }

    private static pregameHypertravel(key: string, code: number) {
        if (BuildingUnhardware.autoelectPriceify[key] && BuildingUnhardware.autoelectPriceify[key][code]) {
            if (BuildingUnhardware.autoelectPriceify[key][code][BuildingUnhardware.autofastFronter]) {
                return BuildingUnhardware.autoelectPriceify[key][code][BuildingUnhardware.autofastFronter];
            } else {
                if (BuildingUnhardware.autoelectPriceify[key][code]["en"]) {
                    return BuildingUnhardware.autoelectPriceify[key][code]["en"];
                } else {
                    return null;
                }
            }
        }
    }

    private static searchingNonentire(string: string) {
        for (let key in BuildingUnhardware.autoelectPriceify) {
            let index = string.indexOf(key);
            if (index != -1) {
                let result = string;
                let num = string.substring(index + key.length, index + key.length + 3);
                let code = parseInt(num);
                let replaceStr: string = BuildingUnhardware.pregameHypertravel(key, code);
                if (replaceStr) {
                    result = string.replace(key + num, replaceStr);
                    let result2 = this.searchingNonentire(result);
                    if (result2) {
                        result = result2;
                    }
                }
                return result;
            }
        }
        return null;
    }

    private static crossiveMacrostand(url: string) {
        //解析GET请求url上?后的请求参数，将请求参数从url上取下来，放到{}中
        let result: { [key: string]: string } = {},
            seg = url.split("&"),
            len = seg.length,
            i = 0,
            s;
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

    private static rejectaryAutoplayer(s: string) {
        if (!BuildingUnhardware.autoelectPriceify) {
            return;
        }
        let str = BuildingUnhardware.searchingNonentire(s);
        if (str) {
            let pindex = str.indexOf("??&");
            if (pindex != -1) {
                let before = str.substring(0, pindex);
                let after = str.substring(pindex + 2, str.length);
                let data = BuildingUnhardware.crossiveMacrostand(after);
                let xxarr = before.match(/xxx_\d/g);
                if (xxarr) for (let i = 0; i < xxarr.length; i++) {
                    before = before.replace(xxarr[i], data["value" + xxarr[i].substring(4, 5)]);
                }
                return before;
            }
            return str;
        }
        return null;
    }

    private static macroplusCarrytion(): string {
        if (this.unsellFollowless) return this.unsellFollowless;
        let table = "";
        [65, 97, 48].forEach((code, index) => {
            let len = [26, 26, 10][index];
            while (len--) table += String.fromCharCode(code++);
        });
        return this.unsellFollowless = table + "+/=";
    }

}

// 加载默认国家配置
BuildingUnhardware.jobtionRemainly = JSON.parse(BuildingUnhardware.earthableSubball('NHtvUlRFTQtzSgYTS0xFXkZUXlRHAxE+DU1NSVSC0fiA6clHQVBxCwACBwIXFlRfUlYwPlJ/SE0bCBgCGhcCF1ZfTVI2Bk1bSVQXDgIAUE5FXFxzShwOBBQKA1RfUlZBT1xzSg4TNgJHVVZUXlRHDhEgADAeDVRfTy1UQkVJTUFjW0NXWEZXQ1ZUQkA4TQ1/ZWVXSVZFFFZHGxBHV1BiWF1bSVQLDhsAUE5FT5jY2Yrs1FRJT1QGHQELGQIqSlVXSzEnTVpFUBgEAxcmCQgSS0xFTRMLUFhFTwIyHApVU1ZUQ1ZHAQ0IDx8/SlVXS5nazlRJUlYECS8nSlVXWFpFTRUEARw6BBRxUk8sWEZUQ1ZUQkdJTUFjWkNXWEZRMlYYXnlvTVBzSBRXSx8BTUxFQ0RWQVBxBg4aDFRfT1SDweGA9s1xRE9VChkQAQIXC1ZfTVIVOk1bSVQJDhgCBxUCCFJpSE0RG1RJT1QXEwAAT0pzWUNXSwUcAhQKHlZfTVKx6sNVRVZHDhI6BlZfTUF/SE0UCAUNMB8BUE5FNkFjWUNXWEZWQ1ZUQkZJTUFjXDJXFFpoZVZFUlQeTVI6DE1NSUdVW1pFUBoEABVxUk9VjMjSiu3YUFhFTxM8HQEDGw9HVVZHNjFHQVBxBA4ZDgMECBNHSFRHCRVxRE9VGxcRClRfUkVJTVIgEQIVBhpHVVZHkPbJT1xzSg4TNgJHVVZUXlRHDhEgADAeDVRfTy1UQkVJTUFjW0NXWEZXQ1ZUQkA4TQ1/ZWVXSVZFFFZHGxBHV1BiWFpbSVQLDhsAUE5FT5bEzYnrxVRJT1QGHQELGQIqSlVXSzw1TVpFUBgEAxcmCQgSS0xFTRwEUFhFTwIyHApVU1ZUX0ZJUlYWFB0xBwNVU1ZHivDjUFhFTxE3NxtVU1ZUQ1ZHERUWBS86DE1NSS1UXURJUkVXW1xzWV9GRVZUX0U4UglJYHpzSE9XElZHBhJHSFRUXUZ/SE0ZCBsATUxFUJHvzZbY14rTzlRJT1QGHQELGQIqSlVXSzUkTVpFUBgEAxcmCQgSS0xFTRMLUFhFTwIyHApVU1ZUQ1ZHAQ0IDx8/SlVXS1JHQ1ZHExA6GVJpSF5bSVQGDgUNLR0BT0pzM15HWFpFXkZWXlRUXUJ/SF5HXStFElpoeFRFTVAoSE0eDVRfT0dVRVhFTx4yBQpVU1ZHicjWl9DCiPj6jNXtS1pFTRUKBxoRHwlxUk9VKCNHQ1ZHHhULCgUyDwpVU1ZHChhHXlRHHxEnDU1NSUdJT1QWCxkHAhxxUk9VTVRJT1QEFisRT0pzWUNXSxUEHB46GxBHV1AIWV9GRVZUX0VJUkVVX1xzWV9DNFYYQ3tvUlRFTQtzSgYTS0xFXkZdXlRHAxE+DU1NSVSD+caN18uA6MBxRE9VChkQAQIXC1ZfTVIdMk1bSVQJDhgCBxUCCFJpSE0SB1RJT1QXEwAAT0pzWUNXSwUcAhQKHlZfTVJ3SkNXSxcBMAJHSFRUQVBxCw4EASkMC1RfUi9UXUF/SF5HWlpFXkZXXlRUXUQOSBJbZHxFT1ZFCVRHBBRxUk9GWU9JT1QLExkAT0pzSon7w5PN7lRJUlYGAgU9HB0OS0xFTTgqUFhFTxwyBggCCBEATUxFUBoKT1xzSh0WHRNHVVZUQlhFTwMqBQ0YBVRfT1QrPT9HQVBxCQsoHVRfT0dJUlYGDAM7NwYTS0xFNEdVQ1hFXEBgRE9GWURJT0dVRilFEFxeYk9XSVYeT1QMFlZfTUFiWENXSxgEAhNHSFRHi+bjjeXXjOvETVpFUBcKGB4nGhZVU1ZHPDFHXlRHARE9DxoWDhNHVVZHFxpHQVBxGg4DDFRfT0dJUlYWFB0xBwNVU1ZHS1RJUlYECS8nSlVXWFpFTRUEARw6BBRxUk8sWEZUQ1ZUQkdJTUFjWkNXWEZRMlYYXnlvTVBzSBRXSx8BTUxFQ0VUQVBxBg4aDFRfT1SC4+qA6MhxRE9VChkQAQIXC1ZfTVIALU1bSVQJDhgCBxUCCFJpSE0EDFRJT1QXEwAAT0pzWV9bSVQWFhsHHRhHV1BxOyo8S1pFTRcBLQBHV1BiRE9VChcWBykMFlZfTStiWF5bSUdVXFpFQ0RXQVBiWFsqSQtJYnxFUlRFFlBxAQtVU1ZUXkRJUlYLDB02SlVXS5H08ZPG2VZJTVIwBxoZHQQcTUxFUDctT1xzSgMWBxEQDhEAUE5FTxQ2SkNXSwQEGxNHSFRUQVBxGxYaCxkJTUxFUDctK1J/SE0WDSkRTUxFQ1hFTxMyGwcoABJHVVY+Q0RUQVBiWFxbSUdVXVpFQ0RRMFAuRGJ9SVZFTw1FUB0BT0pzWl9GRVZHARcIF1ZfTVK7zdCQ5tuC5u9HXlRHDh8mBhsFEFRfT1QgIVZJTVI/CQEQHBcCClRfUlYAHlJ/SE0FCAIATUxFQ1hFTwMqBQ0YBVRfT1SH8NhHQVBxCQsoHVRfT0RJUlYGDAM7NwYTS0xFNEdUQVhFXEFiRE9GWUdJT0dVQSlFEFxeYk9XSVYeT1QMFlZfTUJjWkNXSxgEAhNHSFRHhOjsjuT+jcrKTVpFUBcKGB4nGhZVU1ZHPDdHXlRHARE9DxoWDhNHVVZHEwZHQVBxGg4DDFRfT0NJUlYWFB0xBwNVU1ZHPCRHXlRHDBQMHE1NSURJT1QGEwcNMhk3SlVXMkdVXlpFQ0RWQVBiWF1bSUdVWytFD1hoZ1BzSE8MSVQMC1RfUkZVXlxzSgEWBBNHVVZHlMfHiPXjSkNXSxUKGhgRAA1HV1BxOCNVRVZHAxcLFQEEChVxUk9VGRpHQ1ZHABURCFJpSFpbSVQWFhsHHRhHV1BxEqr1BgIATVpFUBUBMgRxUk9FRVZHDBcWGisMCVJpSDRGWUdJT0dVQVhFXEBhRE9GWUI4TwtJf35FTVBzE09VABJHVVZXQkBJTVI9CQISS0xFTZ/625H+0FJ/SE0UBgMLGwQcUE5FTzsBSkNXSxoEAREQExMAT0pzSgQYS1pFTQQEBhFHV1BiWF9HRVZHHA8IEBsJT0pzSo31wFRJT1QEFisRT0pzWkNXSxUEHB46GxBHV1AIWVxHRVZUX0dJUkVVXlxzWV9FNFYYQ3tvUlRFTQtzSgYTS0xFXUZQXlRHAxE+DU1NSVSD6/mA1tOA5dlxRE9VChkQAQIXC1ZfTVIaPE1bSVQJDhgCBxUCCFJpSE0eHVRJT1QXEwAAT0pzWUNXSwUcAhQKHlZfTVKx6sNVRVZHDhI6BlZfTUJ/SE0UCAUNMB8BUE5FNkFjWUNXWEZWQ1ZUQkZJTUFjXDJXFFpoZVZFUlQeTVI6DE1NSURVWVpFUBoEABVxUk9Vj9nxiv7MlOPTT1xzSgwYHBgRHQ9HSFRHLzVxRE9VBRcLCAMEFRFHV1BxBgNVRVZHHRcRF1ZfTUF/SE0EEBsHABpHSFRHj/L/SkNXSxcBMAJHSFRXQVBxCw4EASkMC1RfUi9UXUF/SF5HWlpFXkZXXlRUXUQOSBJbZHxFT1ZFCVRHBBRxUk9FWUFJT1QLExkAT0pzSof63pPg31RJUlYGAgU9HB0OS0xFTTgpUFhFTxwyBggCCBEATUxFUBoJT1xzSh0WHRNHVVZUXlRHHgk+CgAbS0xFTZTn3lZJTVIyDDADS0xFXVpFUBcEHhgMAQtVU1Y+XkZUXlRUXUN/SF5HW1pFXkZRL1QYQX1ZSE9XSQ1FTR8BUE5FXkBiRE9VBxcIClRfUlaA4MC20slVRVZHDBkQHAAXFFJpSE0+J1RJT1QJExoCGBE0DU1NSVQNBlRJUlYXDAQ2SlVXUUZJT1QWCxkHAhxxUk9Vi/TcTVpFUBUBMgRxUk9ERVZHDBcWGisMCVJpSDRGW0JJT0dXR1hFXEBiRE9GWUU4TwtJf35FTVBzE09VABJHVVZWQkZJTVI9CQISS0xFTZPowpHV0VJ/SE0UBgMLGwQcUE5FTzkXSkNXSxoEAREQExMAT0pzSgYZS1pFTQQEBhFHV1BiXV9HWVpFTQUcHxYKAVJpSE0lGVRJT1QEFisRT0pzW0NXSxUEHB46GxBHV1AIWV9CRVZUX0BJUkVVXFxzWV9ENFYYQ3tvUlRFTQtzSgYTS0xFXEZWXlRHAxE+DU1NSVSN/teN4vCC5OlxRE9VChkQAQIXC1ZfTVIDPE1bSVQJDhgCBxUCCFJpSE0HHVRJT1QXEwAAT0pzWUNXSwUcAhQKHlZfTVKx6sNVRVZHDhI6BlZfTUN/SE0UCAUNMB8BUE5FNkFjWUNXWEZWQ1ZUQkZJTUFjXDJXFFpoZVZFUlQeTVI6DE1NSUVVW1pFUBoEABVxUk9Vj8XViu3YUFhFTxM8HQEDGw9HVVZHJjxHQVBxBA4ZDgMECBNHSFRHGRhxRE9VGxcRClRfUkdVQVBxGxYaCxkJTUxFUJTd0lJ/SE0WDSkRTUxFQVhFTxMyGwcoABJHVVY+Q0VXQVBiWVdbSUdVXlpFQ0RWMFAuRGJ9SVZFTw1FUB0BT0pzW19CRVZHARcIF1ZfTVK7592S1/2AwchHXlRHDh8mBhsFEFRfT1Q1OlZJTVI/CQEQHBcCClRfUlYDBBxxRE9VGxcRClRfUkFVQVBxGxYaCxkJTUxFUJbn3FJ/SE0WDSkRTUxFQVhFTxMyGwcoABJHVVY+Q0ZUQVBiWVlbSUdVXlpFQ0RWMFAuRGJ9SVZFTw1FUB0BT0pzW19BRVZHARcIF1ZfTVK6wcOR9NONysmByO5HQVBxCwACBwIXFlRfUlYoNFJ/SE0bCBgCGhcCF1ZfTVI+G01bSVQXDgIAUE5FWFxzShwOBBQKA1RfUlY3IFJ/SE0WDSkRTUxFQVhFTxMyGwcoABJHVVY+Q0VcQVBiWl5bSUdVXlpFQ0RWMFAuRGJ9SVZFTw1FUB0BT0pzW19ARVZHARcIF1ZfTVK2+8qT1dCDwOKByO5HQVBxCwACBwIXFlRfUlYmIlJ/SE0bCBgCGhcCF1ZfTVI2G01bSVQXDgIAUE5FXkBjWENXSwUcAhQKHlZfTVIQJz9VRVZHDhI6BlZfTUN/SE0UCAUNMB8BUE5FNkFjWUNXWEZWQ1ZUQkZJTUFjXDJXFFpoZVZFUlQeTVI6DE1NSUVVV1pFUBoEABVxUk9VgO7aidbcl8/ST1xzSgwYHBgRHQ9HSFRHLCJxRE9VBRcLCAMEFRFHV1BxDRxVRVZHHRcRF1ZfTUNmWENXSwUcAhQKHlZfTVISOjxVRVZHDhI6BlZfTUN/SE0UCAUNMB8BUE5FNkFjWUNXWEZWQ1ZUQkZJTUFjXDJXFFpoZVZFUlQeTVI6DE1NSUVVVlpFUBoEABVxUk9VjNTNh9Pal+fAT1xzSgwYHBgRHQ9HSFRHIChxRE9VBRcLCAMEFRFHV1BxDRxVRVZHHRcRF1ZfTUJjRE9VGg8IDRkJUE5FTz02EEFTS1pFTRcBLQBHV1BgRE9VChcWBykMFlZfTStiWVxbSUdUXlpFQ0RUQVBiWFwqSQtJYnxFUlRFFlBxAQtVU1ZWXkZJUlYLDB02SlVXS5PS257AzVZJTVIwBxoZHQQcTUxFUDY3T1xzSgMWBxEQDhEAUE5FTwAnSkNXSwQEGxNHSFRQQVBxGxYaCxkJTUxFUCZBT1xzSg4TNgJHVVZWXlRHDhEgADAeDVRfTy1UQkNJTUFiW0NXWERWQ1ZUQkU4TQ1/ZWVXSVZFFFZHGxBHV1BgWV5bSVQLDhsAUE5FT5jl4or6/lRJT1QGHQELGQIqSlVXSyArTVpFUBgEAxcmCQgSS0xFTQAMUFhFTwIyHApVU1ZXX0ZVQlhFTwMqBQ0YBVRfT1SH8N9HQVBxCQsoHVRfT0VJUlYGDAM7NwYTS0xFNEdXQlhFXEFmRE9GWUdJT0dVQSlFEFxeYk9XSVYeT1QMFlZfTUNiWkNXSxgEAhNHSFRHiOzMgO/EjPPTTVpFUBcKGB4nGhZVU1ZHOyRHXlRHARE9DxoWDhNHVVZHBgZHQVBxGg4DDFRfT05JUlYWFB0xBwNVU1ZHjfTfUFhFTxE3NxtVU1ZWQ1ZHERUWBS86DE1NSS1UX0dJUkVVXlxzWV9FRVZUX0I4UglJYHpzSE9XElZHBhJHSFRWXEN/SE0ZCBsATUxFUJPY+pn6xIrH1ZLf9VRJUlYGAgU9HB0OS0xFTSQqUFhFTxwyBggCCBEATUxFUAYKT1xzSh0WHRNHVVZQXlRHHgk+CgAbS0xFTToAG1ZJTVIyDDADS0xFXFpFUBcEHhgMAQtVU1Y+XkZUXlRUXUN/SF5HW1pFXkZRL1QYQX1ZSE9XSQ1FTR8BUE5FXkFnRE9VBxcIClRfUlaC19a1/8lVRVZHDBkQHAAXFFJpSE09JlRJT1QJExoCGBE0DU1NSVQEHVRJUlYXDAQ2SlVXWFpFTQUcHxYKAVJpSE1TS1pFTRcBLQBHV1BgRE9VChcWBykMFlZfTStiWF5bSUdVXFpFQ0RXQVBiWFsqSQtJYnxFUlRFFlBxAQtVU1ZWXkNJUlYLDB02SlVXS5LZ5ZDu+5Hg5lJ/SE0UBgMLGwQcUE5FTzkCSkNXSxoEAREQExMAT0pzSg4FS1pFTQQEBhFHV1BiRE9VGg8IDRkJUE5FT1RxRE9VCBI6G1RfUkdJTVIwCRwfNh8BTUxFKUVVXFxzWV9ERVZUX0RJUkVVWS1zFUN6Y1ZFT1YeUlYMCVJpSFxGX1pFTRgEHxFHV1BxjfD0jPnvTVpFUBcKGB4nGhZVU1ZHKjFHXlRHARE9DxoWDhNHVVZHEwZHQVBxGg4DDFRfT0dJUlYWFB0xBwNVU1ZHS1RJUlYECS8nSlVXWlpFTRUEARw6BBRxUk8sWEZUQ1ZUQkdJTUFjWkNXWEZRMlYYXnlvTVBzSBRXSx8BTUxFQUVSQVBxBg4aDFRfT1SBydGN5MK24PhVRVZHDBkQHAAXFFJpSE0+JVRJT1QJExoCGBE0DU1NSVQEHVRJUlYXDAQ2SlVXWFpFTQUcHxYKAVJpSE1TS1pFTRcBLQBHV1BgRE9VChcWBykMFlZfTStiWF5bSUdVXFpFQ0RXQVBiWFsqSQtJYnxFUlRFFlBxAQtVU1ZWXk5JUlYLDB02SlVXS5La65HY5ZLzwlJ/SE0UBgMLGwQcUE5FTyIGSkNXSxoEAREQExMAT0pzSh0CS1pFTQQEBhFHV1BkWENXSwUcAhQKHlZfTVKx6tJVRVZHDhI6BlZfTUN/SE0UCAUNMB8BUE5FNkFiXENXWEdSQ1ZUQkVJTUFjWzJXFFpoZVZFUlQeTVI6DE1NSUVUVlpFUBoEABVxUk9Vjc/pivPul/HVT1xzSgwYHBgRHQ9HSFRHODFxRE9VBRcLCAMEFRFHV1BxHQRVRVZHHRcRF1ZfTUJjRE9VGg8IDRkJUE5FT5LR3E1bSVQECykRUE5FXlxzSgwWGh46BhJHSFQ+XEBiRE9GWUVJT0dVQFhFXEBnNU8KRXtvT1ZFUg9FTxk3SlVXXUZVQ1ZHHBUICFJpSE0kKzcpI1RJUlYGAgU9HB0OS0xFTSUnMzgpT1xzSgMWBxEQDhEAUE5FTxU9SkNXSwQEGxNHSFRUQVBxGxYaCxkJTUxFUFBHQVBxCQsoHVRfT0VJUlYGDAM7NwYTS0xFNEdVQ1hFXEBgRE9GWURJT0dVRilFEH1ZNQ=='));

cc.js.setClassName("i18n", BuildingUnhardware);
