export declare type Ordering = -1 | 0 | 1;
export declare class Order<T> {
    private readonly f;
    constructor(f: (x: T, y: T) => Ordering);
    get(): (x: T, y: T) => Ordering;
    compare(x: T, y: T): Ordering;
    adapt<U>(f: (value: U) => T): Order<U>;
    invert(): Order<T>;
    min(): (x: T, y: T) => T;
    max(): (x: T, y: T) => T;
    concat(otherOrFunction: ((x: T, y: T) => Ordering) | Order<T>): Order<T>;
    thenBy<U extends {
        [key in any]: any;
    }, V>(this: Order<U>, by: (obj: U) => V, byOrder?: Order<U>): Order<U>;
    thenDescendinglyBy<U extends {
        [key in any]: any;
    }, V>(this: Order<U>, by: (obj: U) => V, byOrder?: Order<U>): Order<U>;
}
export declare const order: <T>(f: (x: T, y: T) => Ordering) => Order<T>;
export declare const AnyOrder: Order<any>;
export declare const DescendingAnyOrder: Order<any>;
export declare function orderBy<T, U>(by: (x: T) => U, byOrder?: Order<U>): Order<T>;
export declare function orderDescendinglyBy<T, U>(by: (x: T) => U, byOrder?: Order<U>): Order<T>;
export declare const NumberOrder: Order<number>;
export declare const StringOrder: Order<string>;
export declare const BooleanOrder: Order<boolean>;
export declare const DateOrder: Order<{}>;
export declare const DescendingNumberOrder: Order<number>;
export declare const DescendingStringOrder: Order<string>;
export declare const DescendingBooleanOrder: Order<boolean>;
export declare const DescendingDateOrder: Order<{}>;
