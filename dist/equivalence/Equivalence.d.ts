export declare class Equivalence<T> {
    private f;
    constructor(f: (x: T, y: T) => boolean);
    test(x: T, y: T): boolean;
    get(): (x: T, y: T) => boolean;
    mapParameters<U>(f: (parameter: U) => T): Equivalence<U>;
    and(other: Equivalence<T>): Equivalence<T>;
    or(other: Equivalence<T>): Equivalence<T>;
    not(): Equivalence<T>;
}
export declare const equivalence: <T>(test: (x: T, y: T) => boolean) => Equivalence<T>;