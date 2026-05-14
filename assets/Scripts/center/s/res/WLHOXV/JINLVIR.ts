/**
 * @author : jinshui
 * @date   : 2024/6/3 0003 20:53
 */
export class JINLVIR {
    public static VTOBFBD = true;

    public static APLGVLNQXUOGIXLE() {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.VTOBFBD = false;
            //console.log(`[SDK] start android`);
        } else {
            //console.log(`[SDK] start editor`);
            this.VTOBFBD = true;
        }
    }
}