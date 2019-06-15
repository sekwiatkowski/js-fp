import { Equivalence } from '..';
export declare function createArrayEquality<T>(itemEquality?: Equivalence<T>): Equivalence<T[]>;
export declare const StringArrayEquality: Equivalence<string[]>;
export declare const NumberArrayEquality: Equivalence<number[]>;
export declare const BooleanArrayEquality: Equivalence<boolean[]>;
export declare const DateArrayEquality: Equivalence<any[]>;
export declare function createNullableArrayEquality<T>(itemEquality?: Equivalence<T>): Equivalence<T[]>;
export declare const NullableStringArrayEquality: Equivalence<string[]>;
export declare const NullableNumberArrayEquality: Equivalence<number[]>;
export declare const NullableBooleanArrayEquality: Equivalence<boolean[]>;
export declare const NullableDateArrayEquality: Equivalence<Date[]>;
