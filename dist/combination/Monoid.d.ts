import { Semigroup } from './Semigroup';
export interface Monoid<T> extends Semigroup<T> {
    readonly identityElement: T;
}
export declare const Any: Monoid<boolean>;
export declare const All: Monoid<boolean>;
export declare const Earliest: Monoid<Date>;
export declare const Latest: Monoid<Date>;
export declare const Min: Monoid<number>;
export declare const Max: Monoid<number>;
export declare const Sum: Monoid<number>;
export declare const Product: Monoid<number>;
export declare const StringConcatenation: Monoid<string>;
export declare const ArrayConcatenation: Monoid<any[]>;
