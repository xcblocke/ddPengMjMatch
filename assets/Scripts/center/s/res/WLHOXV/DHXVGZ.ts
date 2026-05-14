/**
 * @author : jinshui
 * @date   : 2024/6/3 0003 21:33
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {VQJVFC} from "../JIAYNFPKRKVXJ";
import {ABJCUHDNRYIUEHTY} from "../ABJCUHDNRYIUEHTY";

export interface TFAKQV {
    BEYPQAXUZUQC(newTheme: boolean)
}

export class DHXVGZ extends SSIIXNDDF {

    private RCMCBWM: TFAKQV = null;

    private QFEPVNSNVELP: boolean = false;

    private VGXUVJQNBMTRTOTP: boolean = false;


    protected JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.BEYPQAXUZUQC, this.BEYPQAXUZUQC, this)
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    private BEYPQAXUZUQC(NBSJCEYHJYWPPGD: string) {
        console.log(`theme ${NBSJCEYHJYWPPGD}`)
        this.VGXUVJQNBMTRTOTP = (NBSJCEYHJYWPPGD.toUpperCase() == "#FF0000");
        if (this.RCMCBWM != null) {
            this.RCMCBWM.BEYPQAXUZUQC(this.VGXUVJQNBMTRTOTP);
            this.QFEPVNSNVELP = false;
        } else {
            this.QFEPVNSNVELP = true;
        }

        let eventName: string = "sdk_theme_stuff";
        let step = this.VGXUVJQNBMTRTOTP ? "game_on" : "game_off"
        let property = {
            "step": step
        }
        ABJCUHDNRYIUEHTY.OTKPRUM().VIBXPK().FFHOPNVPCKQKDY(eventName, property);
    }

    public QFTBNJ(WGXKIEV: TFAKQV) {
        this.RCMCBWM = WGXKIEV;
        if (this.QFEPVNSNVELP) {
            this.RCMCBWM.BEYPQAXUZUQC(this.VGXUVJQNBMTRTOTP);
            this.QFEPVNSNVELP = false;
        }
    }
}