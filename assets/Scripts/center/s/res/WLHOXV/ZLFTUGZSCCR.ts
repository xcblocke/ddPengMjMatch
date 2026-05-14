/**
 * @author : jinshui
 * @date   : 2024/6/4 0004 11:38
 */
import {SSIIXNDDF} from "../FRCFSJARKXO/SSIIXNDDF";
import {ZRRMOCRU} from "../ZRRMOCRU";
import {JINLVIR} from "./JINLVIR";

export class ZLFTUGZSCCR extends SSIIXNDDF {

    protected JPHKNYDFLEOPE() {
    }

    protected MAFJMDAJWGUXEAXV() {
    }

    /**
     * bi日志统计。注意，使用前的所有事件名和属性名必须找我们登记。
     * @param AMLSNKOM 事件名token
     * @param JUSGJYZ 属性集（可选），这里属性值只支持：字符串、数字、布尔
     */
    public FFHOPNVPCKQKDY(AMLSNKOM: string, JUSGJYZ: { [key: string]: any } = null): void {
        if (JINLVIR.VTOBFBD) {
            return
        }
        let commonEventValue = {
            "event_name": AMLSNKOM
        };
        if (JUSGJYZ != null) {
            commonEventValue["properties"] = JUSGJYZ;
        }
        ZRRMOCRU.OTKPRUM().FFHOPNVPCKQKDY(commonEventValue)

    }

    /**
     * @param INDNOGN 事件名
     * @param JUSGJYZ 属性集（可选）, 这里属性值支持  "revenue" 传 "revenue" 作为key(收益)  "currency" 传 "currency" 作为key(货币单位) "orderId" 传 "orderId" 作为key(订单号)
     */
    public WNZFGPJ(INDNOGN: string, JUSGJYZ: { [key: string]: any } = null): void {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().NRDITEXJPDER(1, INDNOGN, JUSGJYZ)
    }

    /**
     * @param INDNOGN 事件名
     * @param JUSGJYZ 属性集（可选）
     */
    public GVDVCQU(INDNOGN: string, JUSGJYZ: { [key: string]: any } = null): void {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().NRDITEXJPDER(2, INDNOGN, JUSGJYZ)
    }

    /**
     * @param INDNOGN 事件名
     * @param JUSGJYZ 属性集（可选）
     */
    public JQNXYUCCC(INDNOGN: string, JUSGJYZ: { [key: string]: any } = null): void {
        if (JINLVIR.VTOBFBD) {
            return
        }
        ZRRMOCRU.OTKPRUM().NRDITEXJPDER(3, INDNOGN, JUSGJYZ)
    }

}