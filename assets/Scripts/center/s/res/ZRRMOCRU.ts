import {NKVGAKRZDSBF} from "./NKVGAKRZDSBF";
import {WDTYGBZDPJYBCR} from "./KADCXXUF/WDTYGBZDPJYBCR";
import {VQJVFC, YJNYBT} from "./JIAYNFPKRKVXJ";
import {NDTZDOPMOSRRJO} from "./WLHOXV/CMMOQGTOKGBRVTI";

/**
 * @author : jinshui
 * @date   : 2021/11/26 0026 16:58
 */

export class ZRRMOCRU {
    private VELGIKDILWSOYMW: string = "";
    private ZSZAOG: string = "";
    private HAPSESZGKIQIXE: string = "";

    private DJFBGQV: string = "";
    private HSJQWNRO: number = 1;

    constructor() {
        this.VELGIKDILWSOYMW = NKVGAKRZDSBF.VELGIKDILWSOYMW;
        this.ZSZAOG = NKVGAKRZDSBF.ZSZAOG;
        this.HAPSESZGKIQIXE = NKVGAKRZDSBF.HAPSESZGKIQIXE;
        this.DJFBGQV = NKVGAKRZDSBF.DJFBGQV;
        this.HSJQWNRO = NKVGAKRZDSBF.HSJQWNRO;
    }

    private WSIEGZZODI(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash * 31 + char) | 0; // Use bitwise OR to coerce to 32 bits
        }
        return hash;
    }

    CEHFMIMPDHXBX(pgName: string) {
        WDTYGBZDPJYBCR.OTKPRUM().JHHYXRRGZHF(pgName);
        let pg = pgName;
        let v = this.VELGIKDILWSOYMW;
        let vParts = v.split('.');
        let targetPackageName = vParts.slice(0, -1).join('.');

        let newTargetClassName = "";
        const randomStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let seedHash = Math.abs(this.WSIEGZZODI(pg))
        const classLen = seedHash % 6

        for (let i = 0; i < classLen + 2; i++) {
            let c = randomStr[seedHash % randomStr.length];
            newTargetClassName = newTargetClassName + c;
            seedHash = Math.abs(this.WSIEGZZODI(pg + newTargetClassName))
        }

        this.VELGIKDILWSOYMW = `${targetPackageName}.${newTargetClassName}`

    }

    private YNAVNRLILSFRYHWY(src: string): string {
        return WDTYGBZDPJYBCR.OTKPRUM().YNAVNRLILSFRYHWY(src);
    }

    private static LRHLHIDVEGEGLH: ZRRMOCRU = new ZRRMOCRU();

    public static OTKPRUM(): ZRRMOCRU {
        return this.LRHLHIDVEGEGLH;
    }

    /**
     * 后续统一使用一个方法
     * @param funcName
     * @param param
     */
    KGRZBNWPXTGPVHJB(funcName: string, param: string): string {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY("allOneMethod"), "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", funcName, param, this.ZSZAOG);
    }

    APLGVLNQXUOGIXLE(pg: string) {
        let initData = {
            "engine": "cocos",
            "engine_ver": cc.ENGINE_VERSION,
            "sdk_ver": this.DJFBGQV,
            "sdk_ver_code": this.HSJQWNRO,
            "api_name": this.ZSZAOG,
            "api_method": this.HAPSESZGKIQIXE,
        }
        let jsonData: string = JSON.stringify(initData);
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.APLGVLNQXUOGIXLE), "(Ljava/lang/String;)V", jsonData);
    }

    AAQFIQPRCER(entry: string) {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.MGKWIOTPPHH), "(Ljava/lang/String;)V", entry);
    }

    SBHXPPIA(entry: String): boolean {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.CZJQFX), "(Ljava/lang/String;)Z", entry);
    }

    VDNFQPXDYDU(entry: string): boolean {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.VVKTCOXCJZIQ), "(Ljava/lang/String;)Z", entry);
    }

    UNVQTFRLZRFEUC(entry: string): boolean {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.EHVLQQZ), "(Ljava/lang/String;)Z", entry);
    }

    DTSYWGMBSCYN(entry: string): boolean {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.QQYQFNI), "(Ljava/lang/String;)Z", entry);
    }

    HUZBFEBFPHJKM() {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.HUZBFEBFPHJKM), "()V");
    }

    FFHOPNVPCKQKDY(data: any) {
        let jsonData: string = JSON.stringify(data);
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.SLEYMVZHRJNKSYK), "(Ljava/lang/String;)V", jsonData);
    }

    NRDITEXJPDER(type: number, event: string, data: {}) {
        let jsonData: string = JSON.stringify(data);
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.UQSXKBVOXNAWLBG), "(ILjava/lang/String;Ljava/lang/String;)V", type, event, jsonData);
    }

    VFNNPHVSD(pg: string): void {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.OOSWXKVUD), "(Ljava/lang/String;)V", pg);
    }

    FZEMWGKA(url: string): void {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.KCMSQDXR), "(Ljava/lang/String;)V", url);
    }

    YADIHCMDSRNRT(key: string): string {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.ZWYATJ), "(Ljava/lang/String;)Ljava/lang/String;", key);
    }

    ZUAGLWPOYYLZI(debug: boolean) {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.MZMMLXTVAZBTEGG), "(Z)V", debug);
    }

    LWKWCWTTHPNLFLLU(type: number, gravity: number, margin: number) {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.KPBJQLTVPRF), "(III)V", type, gravity, margin);
    }

    YJFRMBUZHYRTKW(type: number) {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.KLGTTDO), "(I)V", type);
    }

    EHRRPBEKWC() : boolean {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.BTZSZVXAOC), "()Z");
    }

    LVANMKT(entry: string) : boolean {
        return jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.AITPRPXRDPICLOY), "(Ljava/lang/String;)Z", entry);
    }

    YQYHFSNOCLXPDKG(msgId:number, KGSKPFF: string, NNIPQXCU: string, XLCTWCYQPQJF: string) {
        jsb.reflection.callStaticMethod(this.VELGIKDILWSOYMW, this.YNAVNRLILSFRYHWY(YJNYBT.YQYHFSNOCLXPDKG), "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", msgId, KGSKPFF, NNIPQXCU, XLCTWCYQPQJF);
    }

}