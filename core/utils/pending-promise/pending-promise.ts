export /*bundle*/
class PendingPromise<T> extends Promise<T> {
    resolve: any;
    reject: any;

    constructor(executor?: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        // needed for PendingPromise.race/all ecc
        if (executor instanceof Function) {
            super(executor);
            return;
        }

        let resolve: any = void 0;
        let reject: any = void 0;
        super((a, b) => {
            resolve = a;
            reject = b;
        });
        this.resolve = resolve;
        this.reject = reject;
    }
}

// For backward compatibility
typeof process !== 'object' && ((<any>window).PendingPromise = PendingPromise);
