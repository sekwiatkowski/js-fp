export declare class Predicate<T> {
    private readonly f;
    constructor(f: (x: T) => boolean);
    test(x: T): boolean;
    get(): (x: T) => boolean;
    adapt<U>(f: (parameter: U) => T): Predicate<U>;
    and(other: Predicate<T>): Predicate<T>;
    or(other: Predicate<T>): Predicate<T>;
    not(): Predicate<T>;
}
export declare const predicate: <T>(test: (x: T) => boolean) => Predicate<T>;
export declare const ensurePredicateFunction: <T>(predicate: Predicate<T> | ((item: T) => boolean)) => (item: T) => boolean;
