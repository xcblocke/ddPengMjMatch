export function CLICKLOCK(seconds: number = 0.5) {
    return function (target, methodName: string, descriptor: PropertyDescriptor) {
        let oldMethod = descriptor.value;
        let isLock = false;
        descriptor.value = function (...args: any[]) {
            if (isLock) {
                console.log("跳过了", this.name, methodName);
                return;
            }
            isLock = true;
            setTimeout(() => {
                isLock = false;
            }, seconds * 1000);
            oldMethod.apply(this, args);
        };
        return descriptor;
    };
}

