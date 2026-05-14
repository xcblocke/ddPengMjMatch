/**
 * @author laijinshui
 * @date 2020/5/20 14:01
 */
import {HBLRYQKTKNCSZL} from "../JYZVSBLLA/Singleton/HBLRYQKTKNCSZL";

export class FKGJUSUDUDVJSDC extends HBLRYQKTKNCSZL {

    // private _Instance: BaseDispatcher = null;
    // get Instance(): BaseDispatcher{
    //     if (this._Instance == null){
    //         return BaseDispatcher.getInstance<BaseDispatcher>();
    //     }
    //     return this._Instance;
    // }

    private QIZFULJVRLQN: { [key: string]: MsgFuc[] } = {};
    private VNKVMZHVH: { [key: string]: MsgFuc[] } = {};
    private YKXHODCENFAAYKVH: { [key: string]: MsgFuc[] } = {};


    private RVGFBHLSLJKSU(USKITXJS: { [DCASAEGGRZPVA: string]: MsgFuc[] }, DCASAEGGRZPVA: string, BALUUFKFQU: Function, DPWXXRLROACJ: any){
        if (null != USKITXJS[DCASAEGGRZPVA]) {
            USKITXJS[DCASAEGGRZPVA].push(new MsgFuc(DPWXXRLROACJ, BALUUFKFQU));
        }else{
            USKITXJS[DCASAEGGRZPVA] = [];
            USKITXJS[DCASAEGGRZPVA].push(new MsgFuc(DPWXXRLROACJ, BALUUFKFQU));
        }
    }

    private HQQEOJYG(USKITXJS: { [DCASAEGGRZPVA: string]: MsgFuc[] }, DCASAEGGRZPVA: string, BALUUFKFQU: Function, DPWXXRLROACJ: any){
        if (null != USKITXJS[DCASAEGGRZPVA] && USKITXJS[DCASAEGGRZPVA].length > 0) {
            // 移除事件
            // 找出当前事件
            let needDelMsg: MsgFuc = null;
            for (let i = 0; i < USKITXJS[DCASAEGGRZPVA].length; i++){
                if (USKITXJS[DCASAEGGRZPVA][i].BALUUFKFQU == BALUUFKFQU && USKITXJS[DCASAEGGRZPVA][i].DPWXXRLROACJ == DPWXXRLROACJ){
                    needDelMsg = USKITXJS[DCASAEGGRZPVA][i];
                    break;
                }
            }
            let index = USKITXJS[DCASAEGGRZPVA].indexOf(needDelMsg);
            if (index > -1){
                USKITXJS[DCASAEGGRZPVA].splice(index, 1);
            }
            if (null != USKITXJS[DCASAEGGRZPVA] && USKITXJS[DCASAEGGRZPVA].length == 0){
                // 没有消息了，删除内存
                delete USKITXJS[DCASAEGGRZPVA];
            }
        }
    }

    private KQKABTNCBSEII(USKITXJS: { [DCASAEGGRZPVA: string]: MsgFuc[] }, DCASAEGGRZPVA: string, FZEUIZMCBRGB: any){
        if (USKITXJS[DCASAEGGRZPVA] == null){
            return;
        }
        // 遍历消息
        USKITXJS[DCASAEGGRZPVA].forEach((RKNMRYJ: MsgFuc)=>{
            RKNMRYJ.BALUUFKFQU.call(RKNMRYJ.DPWXXRLROACJ, FZEUIZMCBRGB);
        });
    }

    public JPHKNYDFLEOPE(DCASAEGGRZPVA: string, BALUUFKFQU: Function, DPWXXRLROACJ: any) {
        this.RVGFBHLSLJKSU(this.QIZFULJVRLQN, DCASAEGGRZPVA, BALUUFKFQU, DPWXXRLROACJ);
    }

    public APHNDWMZR(DCASAEGGRZPVA: string, BALUUFKFQU: Function, DPWXXRLROACJ: any) {
        this.HQQEOJYG(this.QIZFULJVRLQN, DCASAEGGRZPVA, BALUUFKFQU, DPWXXRLROACJ);
    }

    public SUKCFPC(DCASAEGGRZPVA: string, BALUUFKFQU: Function, DPWXXRLROACJ: any) {
        this.RVGFBHLSLJKSU(this.VNKVMZHVH, DCASAEGGRZPVA, BALUUFKFQU, DPWXXRLROACJ);
    }

    public BVGUULXPYFUAVC(DCASAEGGRZPVA: string, BALUUFKFQU_: Function, DPWXXRLROACJ: any) {
        this.HQQEOJYG(this.VNKVMZHVH, DCASAEGGRZPVA, BALUUFKFQU_, DPWXXRLROACJ);
    }

    public SEXCJB(DCASAEGGRZPVA_: string, BALUUFKFQU: Function, DPWXXRLROACJ: any) {
        this.RVGFBHLSLJKSU(this.YKXHODCENFAAYKVH, DCASAEGGRZPVA_, BALUUFKFQU, DPWXXRLROACJ);
    }

    public ZYJQJVSYV(DCASAEGGRZPVA: string, BALUUFKFQU: Function, DPWXXRLROACJ: any) {
        this.HQQEOJYG(this.YKXHODCENFAAYKVH, DCASAEGGRZPVA, BALUUFKFQU, DPWXXRLROACJ);
    }

    public NXRAWNJ(DCASAEGGRZPVA: string, FZEUIZMCBRGB: any){
        this.KQKABTNCBSEII(this.VNKVMZHVH, DCASAEGGRZPVA, FZEUIZMCBRGB);
        this.KQKABTNCBSEII(this.QIZFULJVRLQN, DCASAEGGRZPVA, FZEUIZMCBRGB);
        this.KQKABTNCBSEII(this.YKXHODCENFAAYKVH, DCASAEGGRZPVA, FZEUIZMCBRGB);
    }
}

export class MsgFuc {
    DPWXXRLROACJ: any;
    BALUUFKFQU: Function;

    constructor(DPWXXRLROACJ: any, BALUUFKFQU: Function) {
        this.DPWXXRLROACJ = DPWXXRLROACJ;
        this.BALUUFKFQU = BALUUFKFQU;
        this.BALUUFKFQU.bind(DPWXXRLROACJ);
    }
}
