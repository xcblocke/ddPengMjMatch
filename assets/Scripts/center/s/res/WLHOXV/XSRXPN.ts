/**
 * @author : jinshui
 * @date   : 2024/6/3 0003 21:48
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {GameAd} from "../ZAFDBPSZSUQVJ";
import {ZRRMOCRU} from "../ZRRMOCRU";
import {VQJVFC, YJNYBT, OVWRUPSD, JIAYNFPKRKVXJ} from "../JIAYNFPKRKVXJ";
import {JINLVIR} from "./JINLVIR";

export interface CXADIVYSYQD {
    QZIDUNEJ(ad: GameAd);

    LDAFGWCGVTLDRC(ad: GameAd);

    JDBEBZSPCKF(ad: GameAd);

    REEVFESOCTAHCCVG(ad: GameAd)
}

export class XSRXPN extends SSIIXNDDF {

    private CSIROGLDFOMDZN: CXADIVYSYQD = null;

    JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.QZIDUNEJ, this.QZIDUNEJ, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.LDAFGWCGVTLDRC, this.LDAFGWCGVTLDRC, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.JDBEBZSPCKF, this.JDBEBZSPCKF, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.REEVFESOCTAHCCVG, this.REEVFESOCTAHCCVG, this)
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    private QZIDUNEJ(NBSJCEYHJYWPPGD: string) {
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.QZIDUNEJ(data);
            }
        } catch (e) {
        }

    }

    private LDAFGWCGVTLDRC(NBSJCEYHJYWPPGD: string) {
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.LDAFGWCGVTLDRC(data);
            }
        } catch (e) {
        }
    }

    private JDBEBZSPCKF(NBSJCEYHJYWPPGD: string) {
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.JDBEBZSPCKF(data);
            }
        } catch (e) {
        }
    }

    private REEVFESOCTAHCCVG(NBSJCEYHJYWPPGD: string) {
        try {
            let data: GameAd = JSON.parse(NBSJCEYHJYWPPGD);
            if (OVWRUPSD.JFMLAZGGJGIWRP == data.type) {
                if (this.CSIROGLDFOMDZN != null) {
                    this.CSIROGLDFOMDZN.REEVFESOCTAHCCVG(data);
                }
            }
        } catch (e) {
        }
    }

    public PFHARDSYU(WGXKIEV: CXADIVYSYQD) {
        this.CSIROGLDFOMDZN = WGXKIEV;
    }

    public UNVQTFRLZRFEUC(CXUAJCHCEBOD: string): boolean {
        if (JINLVIR.VTOBFBD) {
            return false;
        }
        return ZRRMOCRU.OTKPRUM().UNVQTFRLZRFEUC(CXUAJCHCEBOD);
    }

    public DTSYWGMBSCYN(CXUAJCHCEBOD: string): boolean {
        if (JINLVIR.VTOBFBD) {
            let data: GameAd = new GameAd();
            data.entry = CXUAJCHCEBOD;
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.QZIDUNEJ(data);
                this.CSIROGLDFOMDZN.LDAFGWCGVTLDRC(data);
                this.CSIROGLDFOMDZN.JDBEBZSPCKF(data);
            }
            return true;
        }
        return ZRRMOCRU.OTKPRUM().DTSYWGMBSCYN(CXUAJCHCEBOD);
    }

}