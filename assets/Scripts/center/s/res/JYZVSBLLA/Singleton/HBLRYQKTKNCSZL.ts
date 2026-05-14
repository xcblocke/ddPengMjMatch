/**
 * 单例模式
 */
export class HBLRYQKTKNCSZL {
    protected constructor() {}

    public static ZPFTZYR<T>(): T {
        let instance = (<any>this)._instance;
        if( instance == null){
            instance = (<any>this)._instance = new (<any>this)()
        }
        return instance;
    }
}