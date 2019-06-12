export interface Monoid<T> {
    combine: (a: T) => (b: T) => T;
    identityElement: T;
}
export declare const Max: Monoid<number>;
export declare const Min: Monoid<number>;
export declare const Sum: Monoid<number>;
export declare const Product: Monoid<number>;
export declare const ArrayConcatenation: Monoid<any[]>;
