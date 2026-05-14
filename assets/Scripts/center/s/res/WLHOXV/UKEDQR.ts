/**
 * @author : jinshui
 * @date   : 2024/6/3 0003 21:48
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {GameAd} from "../ZAFDBPSZSUQVJ";
import {ZRRMOCRU} from "../ZRRMOCRU";
import {VQJVFC, OVWRUPSD} from "../JIAYNFPKRKVXJ";
import {JINLVIR} from "./JINLVIR";

export interface PKQEEMPEWUHK {
    SWFLEASBVFKC(ad: GameAd);

    ABJJNWQ(ad: GameAd);

    UWHIILBVLAZSZ(ad: GameAd);

    LTSHSVTWAQAIZX(ad: GameAd);

    REEVFESOCTAHCCVG(ad: GameAd)
}

export class UKEDQR extends SSIIXNDDF {

    private CSIROGLDFOMDZN: PKQEEMPEWUHK = null;

    JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.UFFBPRHIMEP, this.UFFBPRHIMEP, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.ABJJNWQ, this.ABJJNWQ, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.UWHIILBVLAZSZ, this.UWHIILBVLAZSZ, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.LTSHSVTWAQAIZX, this.LTSHSVTWAQAIZX, this)
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.REEVFESOCTAHCCVG, this.REEVFESOCTAHCCVG, this)
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    private UFFBPRHIMEP(args: string) {
        try {
            let data: GameAd = JSON.parse(args);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.SWFLEASBVFKC(data);
            }
        } catch (e) {
        }

    }

    private ABJJNWQ(args: string) {
        try {
            let data: GameAd = JSON.parse(args);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.ABJJNWQ(data);
            }
        } catch (e) {
        }
    }

    private UWHIILBVLAZSZ(args: string) {
        try {
            let data: GameAd = JSON.parse(args);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.UWHIILBVLAZSZ(data);
            }
        } catch (e) {
        }
    }

    private LTSHSVTWAQAIZX(args: string) {
        try {
            let data: GameAd = JSON.parse(args);
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.LTSHSVTWAQAIZX(data);
            }
        } catch (e) {
        }
    }

    private REEVFESOCTAHCCVG(args: string) {
        try {
            let data: GameAd = JSON.parse(args);
            if (OVWRUPSD.RLLYQCGBRCK == data.type) {
                if (this.CSIROGLDFOMDZN != null) {
                    this.CSIROGLDFOMDZN.REEVFESOCTAHCCVG(data);
                }
            }
        } catch (e) {
        }
    }

    public CZOFLOMIINJO(listener: PKQEEMPEWUHK) {
        this.CSIROGLDFOMDZN = listener;
    }

    public SBHXPPIA(entry: string) : boolean{
        if (JINLVIR.VTOBFBD) {
            return false
        }
        return ZRRMOCRU.OTKPRUM().SBHXPPIA(entry)
    }

    public AAQFIQPRCER(entry: string) {
        if (JINLVIR.VTOBFBD) {
            return;
        }
        ZRRMOCRU.OTKPRUM().AAQFIQPRCER(entry);
    }

    public VDNFQPXDYDU(entry: string): boolean {
        if (JINLVIR.VTOBFBD) {
            let data: GameAd = new GameAd();
            data.entry = entry;
            if (this.CSIROGLDFOMDZN != null) {
                this.CSIROGLDFOMDZN.SWFLEASBVFKC(data);
                this.CSIROGLDFOMDZN.UWHIILBVLAZSZ(data);
                this.CSIROGLDFOMDZN.LTSHSVTWAQAIZX(data);
                this.CSIROGLDFOMDZN.ABJJNWQ(data);
            }
            return true;
        }
        return ZRRMOCRU.OTKPRUM().VDNFQPXDYDU(entry);
    }

}