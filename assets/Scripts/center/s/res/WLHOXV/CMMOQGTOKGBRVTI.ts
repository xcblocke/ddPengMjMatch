import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {JINLVIR} from "./JINLVIR";
import {VQJVFC} from "../JIAYNFPKRKVXJ";
import {ZRRMOCRU} from "../ZRRMOCRU";

export interface NDTZDOPMOSRRJO {
    LHWVRV(VMDNPBVUBM: string)
}

export class HttpRequestTempData {
    msgId: string;
    data: string;
}

export class  CMMOQGTOKGBRVTI extends SSIIXNDDF {
    private UMNDBNINAMNT: number = 1;
    private ZBUDELEX: {[key: string]: NDTZDOPMOSRRJO} = {};
    protected JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.ALNGOBVERZQY, this.ALNGOBVERZQY, this);
    }

    protected MAFJMDAJWGUXEAXV() {

    }

    private ALNGOBVERZQY(NBSJCEYHJYWPPGD: string) {
        try {
            let result = atob(NBSJCEYHJYWPPGD);
            let data: HttpRequestTempData = JSON.parse(result);
            let id: string = data.msgId;
            let listener: NDTZDOPMOSRRJO = this.ZBUDELEX[`${id}`];
            if (listener != null && data.data != null) {
                let dataResult = atob(data.data)
                listener.LHWVRV(dataResult);
            }
        } catch (e) {
        }
    }

    public VUCMLLAKCBDUWV(NNIPQXCU: { [DCASAEGGRZPVA: string]: string } = null, queryParams: { [DCASAEGGRZPVA: string]: string } = null, WGXKIEV: NDTZDOPMOSRRJO) {
        this.YQYHFSNOCLXPDKG("get", NNIPQXCU, queryParams, WGXKIEV);
    }

    public IXUDPKYSSAYGXCS(JFPFMEGG: string, KSSPAHGKTXWX: { [DCASAEGGRZPVA: string]: string } = null, WGXKIEV: NDTZDOPMOSRRJO) {
        let headers = {
            "X-Forwarded": JFPFMEGG
        }
        this.YQYHFSNOCLXPDKG("get", headers, KSSPAHGKTXWX, WGXKIEV);
    }

    public VCAING(NNIPQXCU: { [DCASAEGGRZPVA: string]: string } = null, BCBAVZBFOSIBVAIO: { [DCASAEGGRZPVA: string]: string } = null, WGXKIEV: NDTZDOPMOSRRJO) {
        this.YQYHFSNOCLXPDKG("post", NNIPQXCU, BCBAVZBFOSIBVAIO, WGXKIEV);
    }

    public YDNBJIJQSMCBZRZK(JFPFMEGG: string, JRQRHHXBY: { [DCASAEGGRZPVA: string]: string } = null, WGXKIEV: NDTZDOPMOSRRJO) {
        let headers = {
            "X-Forwarded": JFPFMEGG
        }
        this.YQYHFSNOCLXPDKG("post", headers, JRQRHHXBY, WGXKIEV);
    }

    private YQYHFSNOCLXPDKG(KGSKPFF: string, NNIPQXCU: { [DCASAEGGRZPVA: string]: string } = {}, XLCTWCYQPQJF: { [key: string]: string } = {}, WGXKIEV: NDTZDOPMOSRRJO) {
        if (JINLVIR.VTOBFBD) {
            return;
        }
        this.UMNDBNINAMNT += 1;
        this.ZBUDELEX[`${this.UMNDBNINAMNT}`] = WGXKIEV;
        let headerStr = "{}";
        if (NNIPQXCU != null) {
            headerStr = JSON.stringify(NNIPQXCU)
        }
        let paramsStr = "{}";
        if (XLCTWCYQPQJF != null) {
            paramsStr = JSON.stringify(XLCTWCYQPQJF);
        }
        ZRRMOCRU.OTKPRUM().YQYHFSNOCLXPDKG(this.UMNDBNINAMNT, KGSKPFF, headerStr, paramsStr);
    }
}