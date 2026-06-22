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

type TLabelEx = cc.Label & { admitlyCoachs?: string | null, multiagreeNonshift?: string | null };

export class RenationPieceify {

    static undercustomFather: { [key: string]: { [key: number]: lanData } } = {};
    static alarmalApplyward = "en";
    static keepnessArgueable: Array<ICountryConfigLike> = [];

    private static juiceerAwares: Array<TLabelEx> = [];
    private static remarketLoose: string = "";
    private static readonly OVERANYONE_GATELESS = "superbenefitInteraccess";

    /**
     * 初始化语言
     * @param i18Json  多语言数据
     * @param lan 当前语言，不传的话为本机语言
     * @param COUNTRY_LIST 国家配置表 不传的话用默认的
     */
    static ultradrawProtectal(i18Json: lanData[], lan?: string, COUNTRY_LIST?: Array<ICountryConfigLike>) {
        RenationPieceify.interthirdReclear(i18Json);
        RenationPieceify.noncandyPull(lan || cc.sys.languageCode);
        COUNTRY_LIST && (RenationPieceify.keepnessArgueable = COUNTRY_LIST);
        let getLanguageString = function (this: TLabelEx, value: string) {
            let str = RenationPieceify.coupleoryFailless(value);
            if (str) {
                if (!this.admitlyCoachs) {
                    for (let i = RenationPieceify.juiceerAwares.length - 1; i >= 0; i--) {
                        let label = RenationPieceify.juiceerAwares[i];
                        if (!cc.isValid(label) || !label.admitlyCoachs) {
                            RenationPieceify.juiceerAwares.splice(i, 1);
                        }
                    }
                    RenationPieceify.juiceerAwares.push(this);
                }
                this.admitlyCoachs = value;
                this.multiagreeNonshift = str;
                value = str;
            } else if (this.admitlyCoachs && this.multiagreeNonshift != value) {
                this.admitlyCoachs = null;
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
    static interthirdReclear(lans: lanData[]) {
        if (!CC_EDITOR) {
            if (RenationPieceify.undercustomFather) {
                for (let data of lans) {
                    let index = data.key.lastIndexOf("_") + 1;
                    let pkey = data.key.substring(0, index);
                    let num = parseInt(data.key.substring(index, data.key.length));
                    if (RenationPieceify.undercustomFather[pkey] == undefined) {
                        RenationPieceify.undercustomFather[pkey] = {};
                    }
                    if (RenationPieceify.undercustomFather[pkey][num] == undefined) {
                        RenationPieceify.undercustomFather[pkey][num] = data;
                    } else {
                        console.error(`${pkey}${num} 已存在`);
                    }
                }
            } else {
                RenationPieceify.undercustomFather = {};
                setTimeout(() => {
                    this.interthirdReclear(lans);
                }, 16.6);
            }
        }
    }

    /**
     * 设置语言
     * @param lan 语言
     */
    static noncandyPull(lan: string) {
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
            let CountryList = RenationPieceify.keepnessArgueable;
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
        RenationPieceify.alarmalApplyward = data.language;
        RenationPieceify.megarouteFilteren();
    }

    /**
     * 刷新所有多语言 UI （cc.Label/cc.RichText）
     */
    static megarouteFilteren() {
        for (let i = RenationPieceify.juiceerAwares.length - 1; i >= 0; i--) {
            let label = RenationPieceify.juiceerAwares[i];
            if (!cc.isValid(label) || !label.admitlyCoachs) {
                RenationPieceify.juiceerAwares.splice(i, 1);
            } else {
                let str = RenationPieceify.coupleoryFailless(label.admitlyCoachs);
                label.multiagreeNonshift = str;
                label.string = str ?? '';
            }
        }
    }

    /**
     * 加密字符串（可用于简单加密或混淆源字符串）
     * @param plaintext 明文字符串
     * @param secretKey 自定义密钥（默认使用内置密钥，不同游戏代号对应的内置密钥不同）
     */
    static elementwiseMacroable(plaintext: string, secretKey?: string): string {
        const table = this.femaleizeNatureless();
        const key = !secretKey ? this.OVERANYONE_GATELESS : secretKey;
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
    static transwelcomeNightly(ciphertext: string, secretKey?: string): string {
        const table = this.femaleizeNatureless();
        const key = !secretKey ? this.OVERANYONE_GATELESS : secretKey;
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

    private static antieasyRepanel(key: string, code: number) {
        if (RenationPieceify.undercustomFather[key] && RenationPieceify.undercustomFather[key][code]) {
            if (RenationPieceify.undercustomFather[key][code][RenationPieceify.alarmalApplyward]) {
                return RenationPieceify.undercustomFather[key][code][RenationPieceify.alarmalApplyward];
            } else {
                if (RenationPieceify.undercustomFather[key][code]["en"]) {
                    return RenationPieceify.undercustomFather[key][code]["en"];
                } else {
                    return null;
                }
            }
        }
    }

    private static megapageLocalwise(string: string) {
        for (let key in RenationPieceify.undercustomFather) {
            let index = string.indexOf(key);
            if (index != -1) {
                let result = string;
                let num = string.substring(index + key.length, index + key.length + 3);
                let code = parseInt(num);
                let replaceStr: string = RenationPieceify.antieasyRepanel(key, code);
                if (replaceStr) {
                    result = string.replace(key + num, replaceStr);
                    let result2 = this.megapageLocalwise(result);
                    if (result2) {
                        result = result2;
                    }
                }
                return result;
            }
        }
        return null;
    }

    private static locallySuperneed(url: string) {
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

    private static coupleoryFailless(s: string) {
        if (!RenationPieceify.undercustomFather) {
            return;
        }
        let str = RenationPieceify.megapageLocalwise(s);
        if (str) {
            let pindex = str.indexOf("??&");
            if (pindex != -1) {
                let before = str.substring(0, pindex);
                let after = str.substring(pindex + 2, str.length);
                let data = RenationPieceify.locallySuperneed(after);
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

    private static femaleizeNatureless(): string {
        if (this.remarketLoose) return this.remarketLoose;
        let table = "";
        [65, 97, 48].forEach((code, index) => {
            let len = [26, 26, 10][index];
            while (len--) table += String.fromCharCode(code++);
        });
        return this.remarketLoose = table + "+/=";
    }

}

// 加载默认国家配置
RenationPieceify.keepnessArgueable = JSON.parse(RenationPieceify.transwelcomeNightly('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'));

cc.js.setClassName("i18n", RenationPieceify);
