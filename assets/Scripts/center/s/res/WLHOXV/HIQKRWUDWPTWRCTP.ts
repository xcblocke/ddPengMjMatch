/**
 * @author : jinshui
 * @date   : 2024/6/4 0004 14:15
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {ZRRMOCRU} from "../ZRRMOCRU";
import {JINLVIR} from "./JINLVIR";
import {VQJVFC, YJNYBT} from "../JIAYNFPKRKVXJ";


// 冷/热启动回调
export interface LZOBXGFV {

    // 1 冷启动 0 热启动
    XOKKTVZKZXJC(VVXKNZJJFEI: number)
}


export class HIQKRWUDWPTWRCTP extends SSIIXNDDF {

    private LXUPRFC: string = "";
    private DDLVBXZUNRKWB: string = "";
    private FKIZDFORZAJDO: LZOBXGFV;
    //是否是冷启
    private STXNOSCE = 0;

    private ZDSEDEQLXNBWGT = false;


    protected JPHKNYDFLEOPE() {
        this.TWXTGF.JPHKNYDFLEOPE(VQJVFC.XOKKTVZKZXJC, this.XOKKTVZKZXJC, this)
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    public ZUSOUL(): string {
        if (JINLVIR.VTOBFBD) {
            return "{}";
        }

        if (this.LXUPRFC == "") {
            this.LXUPRFC = ZRRMOCRU.OTKPRUM().YADIHCMDSRNRT(YJNYBT.EUNLKRCTXTB);
        }
        return this.LXUPRFC;
    }


    public ZUAGLWPOYYLZI(IXTVTPEHMHGUAEVI: boolean): void {
        if (JINLVIR.VTOBFBD) {
            return;
        }
        ZRRMOCRU.OTKPRUM().ZUAGLWPOYYLZI(IXTVTPEHMHGUAEVI)
    }

    public JXVKMEPVGCBVK(WGXKIEV: LZOBXGFV) {
        this.FKIZDFORZAJDO = WGXKIEV;
        if (this.ZDSEDEQLXNBWGT) {
            this.FKIZDFORZAJDO.XOKKTVZKZXJC(this.STXNOSCE);
            this.ZDSEDEQLXNBWGT = false;
        }
    }

    private XOKKTVZKZXJC(STXNOSCE: number) {
        console.log(`launch ${STXNOSCE}`)
        if (this.FKIZDFORZAJDO != null) {
            this.FKIZDFORZAJDO.XOKKTVZKZXJC(STXNOSCE);
            this.ZDSEDEQLXNBWGT = false;
        } else {
            this.STXNOSCE = STXNOSCE;
            this.ZDSEDEQLXNBWGT = true;
        }
    }
}