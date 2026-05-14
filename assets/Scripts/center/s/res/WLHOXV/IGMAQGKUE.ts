/**
 * @author : YANJIABIN
 * @date   : 2024/6/3 0003 21:33
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {VQJVFC} from "../JIAYNFPKRKVXJ";
import {ZRRMOCRU} from "../ZRRMOCRU";
import {JINLVIR} from "./JINLVIR";
import {GameAd} from "../ZAFDBPSZSUQVJ";

export interface DZAVKRLJX {

    ZNEMSJQVXBGJKMW(ad: GameAd);

    XHBRCH(ad: GameAd);

    INHDTHCA(ad: GameAd);
}

export class IGMAQGKUE extends SSIIXNDDF {
    private listener: DZAVKRLJX;

    protected JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.FUVPQWJGQUQCYTC, this.FUVPQWJGQUQCYTC, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.WMVFMFDMRNDH, this.WMVFMFDMRNDH, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.EZUEJADYFGHSEH, this.JZZTNHQRBTRQOJ, this)
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    private FUVPQWJGQUQCYTC(NBSJCEYHJYWPPGD: string) {
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.listener != null) {
                this.listener.ZNEMSJQVXBGJKMW(data);
            }
        } catch (e) {
        }
    }

    private WMVFMFDMRNDH(NBSJCEYHJYWPPGD: string) {
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.listener != null) {
                this.listener.XHBRCH(data);
            }
        } catch (e) {
        }
    }

    private JZZTNHQRBTRQOJ(NBSJCEYHJYWPPGD: string){
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.listener != null) {
                this.listener.INHDTHCA(data);
            }
        } catch (e) {
        }
    }

    public YZYXAKSDWXOLJ(WGXKIEV: DZAVKRLJX) {
        this.listener = WGXKIEV;
    }

    public EHRRPBEKWC():boolean {
        if (JINLVIR.VTOBFBD) {
            return false
        }
        return ZRRMOCRU.OTKPRUM().EHRRPBEKWC();
    }

    public LVANMKT(OILCVEFNXSKQHE: string): boolean {
        if (JINLVIR.VTOBFBD) {
            return false
        }
        return ZRRMOCRU.OTKPRUM().LVANMKT(OILCVEFNXSKQHE)
    }

}