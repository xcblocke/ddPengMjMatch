/**
 * @author : YANJIABIN
 * @date   : 2024/6/18 0003 21:33
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {VQJVFC} from "../JIAYNFPKRKVXJ";
import {GameAd} from "../ZAFDBPSZSUQVJ";
import {JINLVIR} from "./JINLVIR";
import {ZRRMOCRU} from "../ZRRMOCRU";

export interface KQXVTR {
    EBEOBLBO(ad: GameAd);

    JFOBFAEBPU(ad: GameAd);

    ITTHTLEDWOUNHTP(ad: GameAd);
}

export class CFADZEMOSF extends SSIIXNDDF {

    private CSIROGLDFOMDZN: KQXVTR = null;


    protected JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.EBEOBLBO, this.EBEOBLBO, this);
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.JFOBFAEBPU, this.JFOBFAEBPU, this);
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.ITTHTLEDWOUNHTP, this.ITTHTLEDWOUNHTP, this);
    }

    protected MAFJMDAJWGUXEAXV() {

    }

    private EBEOBLBO(NBSJCEYHJYWPPGD: string) {
        // console.log(`onBannerStart ${NBSJCEYHJYWPPGD}`);
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.EBEOBLBO(data);
            }
        } catch (e) {
        }
    }

    private JFOBFAEBPU(NBSJCEYHJYWPPGD: string) {
        // console.log(`onBannerClicked ${NBSJCEYHJYWPPGD}`);
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.JFOBFAEBPU(data);
            }
        } catch (e) {

        }
    }

    private ITTHTLEDWOUNHTP(NBSJCEYHJYWPPGD: string) {
        // console.log(`onBannerClosed ${NBSJCEYHJYWPPGD}`);
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.ITTHTLEDWOUNHTP(data);
            }
        } catch (e) {
        }
    }

    public OIWXAWIZI(WGXKIEV: KQXVTR) {
        this.CSIROGLDFOMDZN = WGXKIEV;
    }

    public LWKWCWTTHPNLFLLU(IELDNJCPEMZY: number, XSMRDIOWOCXGE: number) {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().LWKWCWTTHPNLFLLU(0, IELDNJCPEMZY, XSMRDIOWOCXGE);
    }

    public YJFRMBUZHYRTKW() {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().YJFRMBUZHYRTKW(0);
    }


    public FDCLLAMYQRUJI(IELDNJCPEMZY: number, XSMRDIOWOCXGE: number) {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().LWKWCWTTHPNLFLLU(1, IELDNJCPEMZY, XSMRDIOWOCXGE);
    }

    public YWCMZRMSDFCIDNP() {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().YJFRMBUZHYRTKW(1);
    }

}