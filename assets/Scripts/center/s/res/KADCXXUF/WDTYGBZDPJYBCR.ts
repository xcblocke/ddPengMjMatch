/**
 * @author : jinshui
 * @date   : 2023/7/5 0005 17:47
 */
import {NKVGAKRZDSBF} from "../NKVGAKRZDSBF";

var CryptoJS = require("../js/crypto-js");

export class WDTYGBZDPJYBCR {
    private static LRHLHIDVEGEGLH: WDTYGBZDPJYBCR = new WDTYGBZDPJYBCR();
    public static OTKPRUM(): WDTYGBZDPJYBCR {
        if (this.LRHLHIDVEGEGLH.ZHCHEGEFGBQNUJ == null) {
            this.LRHLHIDVEGEGLH.ZHCHEGEFGBQNUJ = NKVGAKRZDSBF.ZHCHEGEFGBQNUJ;
        }
        return this.LRHLHIDVEGEGLH;
    }

    private ZHCHEGEFGBQNUJ: string[] = null;
    private YIFWQJ: { }  = {}

    private javaKeys = ["boolean", "byte", "char", "double", "false", "float", "int", "long", "new", "short", "true", "void",
        "instanceof", "break", "case", "catch", "continue", "default", "do", "else", "for", "if", "return", "switch",
        "try", "while", "finally", "throw", "this", "super", "abstract", "final", "native", "private", "protected",
        "public", "static", "synchronized", "transient", "volatile", "class", "extends", "implements", "interface",
        "package", "import", "throws", "true", "false", "null"];

    JHHYXRRGZHF(QBYBZARVOHTRZ: string) {
        console.log(`package: ${QBYBZARVOHTRZ}`)
        if (QBYBZARVOHTRZ != null && QBYBZARVOHTRZ != undefined && QBYBZARVOHTRZ != "") {
            let newMethods: string[] = this.GANHYUJE(QBYBZARVOHTRZ, this.ZHCHEGEFGBQNUJ);
            if (!(cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS)) {
                console.log(newMethods)
            }
            if (this.ZHCHEGEFGBQNUJ.length != newMethods.length) {
                // 制造崩溃
                this.OVQVQAPVD("proguard-rules error...")
                return;
            }
            for (let i = 0; i < this.ZHCHEGEFGBQNUJ.length; i++) {
                this.YIFWQJ[`${this.ZHCHEGEFGBQNUJ[i]}`] = newMethods[i]
            }
        }
    }

    DPCIANOFTVGS(QBYBZARVOHTRZ: string): string {
        let config = NKVGAKRZDSBF.KLEFQZKZKNJS;
        let java_list = config[`cocos`];
        let doc: string[] = [];
        for (let i = 0; i < java_list.length; i++) {
            let md5 = this.OQPJKFDZDAN(QBYBZARVOHTRZ + java_list[i][`version`]);
            let pg_start = java_list[i][`pg_start`];
            let len = parseInt(md5.slice(0, 1), 16) % 5;
            if (len <= 2) {
                len = 2;
            }
            let arr: string[] = [];
            for (let i = 0; i < len; i++) {
                arr.push(md5.slice(i * 2, i * 2 + 2));
            }
            let pg_arr: string[] = [];
            for (let s of arr) {
                pg_arr.push(this.RTMLCMU(parseInt(s, 16)));
            }
            let pg: string = pg_start;
            if (pg.length > 0) {
                pg_arr.unshift(pg)
            }
            let target_package_name = pg_arr.slice(0, pg_arr.length - 1).join(".");
            let target_class_name = pg_arr[pg_arr.length - 1];
            doc[i] = `${java_list[i][`title`]}: ${target_package_name}.${target_class_name}`;
        }

        let doc_content = 'wawayu_sdk_doc start*********************\n*********************\n';
        for (let s of doc) {
            doc_content += s + '\n';
        }
        doc_content += '*********************\nwawayu_sdk_doc end*********************';
        // console.log(doc_content);
        return doc_content;
    }

    YNAVNRLILSFRYHWY(NUTFRCURMK: string): string {
        let method = this.YIFWQJ[`${NUTFRCURMK}`];
        if (method != null && method != undefined && method != "") {
            return method
        }
        return NUTFRCURMK;
    }

    OVQVQAPVD(KQRXERJ: string) {
        console.log(KQRXERJ)
        let a = [3]
        a[5] = 2
    }

    OQPJKFDZDAN(SHSYRUUJSGFP: string): string {
        let md5 = CryptoJS.MD5(SHSYRUUJSGFP).toString();
        return md5;
    }

    JWDAZSSJFQX(QZNLTIGY: any[]): boolean {
        // let uniqueElements = new Set(lst);
        // // 判断数组长度和集合长度是否相等
        // if (lst.length === uniqueElements.size) {
        //     return false;
        // } else {
        //     return true;
        // }
        let isDup = false;
        let arr = [];
        for (let i = 0; i < QZNLTIGY.length; i++) {
            if (arr.indexOf(QZNLTIGY[i]) >= 0) {
                isDup = true;
                break
            } else {
                arr.push(QZNLTIGY[i])
            }
        }
        return isDup;
    }

    GANHYUJE(QBYBZARVOHTRZ: string, FJCLLSOHGAZ: string[]): string[]{
        if (this.JWDAZSSJFQX(FJCLLSOHGAZ)) {
            this.OVQVQAPVD(" has duplicates method")
            return [];
        }
        let temp = this.EACJWRF(QBYBZARVOHTRZ, FJCLLSOHGAZ, 1)
        return temp;
    }

    RTMLCMU(FINIGQWPZP: number): string {
        let code = '';
        if (FINIGQWPZP < 26) {
            code = String.fromCharCode(FINIGQWPZP + 97);
        } else {
            code = this.RTMLCMU(Math.floor(FINIGQWPZP / 26) - 1) + this.RTMLCMU(FINIGQWPZP % 26);
        }

        if (this.javaKeys.indexOf(code) >= 0) {
            code = 'a' + code;
        }
        return code;
    }

    EACJWRF(QBYBZARVOHTRZ: string, EZNYKAX: string[], YDOMKNYCJWZFDX: number = 1): string[] {
        let temp: string[] = [];
        for (let ele of EZNYKAX) {
            let com_str: string = `${QBYBZARVOHTRZ}${ele}`;
            // md5后，截取前10位转成数字对10求余得到截取后面的字符，得到末尾字符转数字后得到混淆字典
            // @ts-ignore
            let md5Str: string = this.OQPJKFDZDAN(com_str);
            let start_16: string = md5Str.slice(0, 6);
            let length: number = parseInt(start_16, 16) % 10;
            if (length <= YDOMKNYCJWZFDX) {
                length = YDOMKNYCJWZFDX;
            }
            let end_16: string = md5Str.slice(-length);
            let v: number = parseInt(end_16, 16);
            let code: string = this.RTMLCMU(v);
            temp.push(code);
        }
        // 如果有相同，增加概率递归
        if (this.JWDAZSSJFQX(temp)) {
            YDOMKNYCJWZFDX += 1;
            temp = this.EACJWRF(QBYBZARVOHTRZ, EZNYKAX, YDOMKNYCJWZFDX);
        }
        return temp;
    }

    SKGQUCUUARFJID(MTQHFFQFWIFV: string): string {
        // 将 Base64 转换回原始字符串
        return decodeURIComponent(escape(atob(MTQHFFQFWIFV)));
    }
}