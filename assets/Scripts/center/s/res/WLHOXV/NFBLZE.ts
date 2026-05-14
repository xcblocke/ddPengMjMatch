/**
 * @author : jinshui
 * @date   : 2024/6/3 0003 21:33
 */
import {VQJVFC} from "../JIAYNFPKRKVXJ";
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";

export interface JSHKSGNZCJVKYP {
    BZYZOOIUIKVLDDY(VLKQGK: string)
}

export class NFBLZE extends SSIIXNDDF {

    private OJPDWZ: JSHKSGNZCJVKYP = null;
    private UYMGHKO: boolean = false;
    private YAOLFR: string = null;

    protected JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.BZYZOOIUIKVLDDY, this.BZYZOOIUIKVLDDY, this)
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    
    private SKGQUCUUARFJID(input: string): string {
        // 将 Base64 转换回原始字符串
        return decodeURIComponent(escape(atob(input)));
    }


    private BZYZOOIUIKVLDDY(VLKQGK: string) {
        try {
            this.YAOLFR = this.SKGQUCUUARFJID(VLKQGK);
            if (this.OJPDWZ != null) {
                this.OJPDWZ.BZYZOOIUIKVLDDY(this.YAOLFR);
                this.UYMGHKO = false;
            } else {
                this.UYMGHKO = true;
            }
        } catch (e) {

        }

    }

    public ANRVFUXTLL(WGXKIEV: JSHKSGNZCJVKYP) {
        this.OJPDWZ = WGXKIEV;
        if (this.UYMGHKO) {
            this.OJPDWZ.BZYZOOIUIKVLDDY(this.YAOLFR);
            this.UYMGHKO = false;
        }
    }

}