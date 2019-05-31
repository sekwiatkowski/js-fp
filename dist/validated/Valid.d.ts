import {Validated, ValidatedMatchPattern} from './Validated';

export declare class Valid<T> implements Validated<T> {
    private readonly value;
    constructor(value: T);
    apply<U, V>(this: Valid<(parameter: U) => V>, parameterOrFunction: Validated<U> | (() => U) | (() => Validated<U>) | U): Validated<V>;
    assign<T extends object, K extends string, U>(this: Valid<T>, key: K, memberOrFunction: Validated<U> | ((value: T) => Validated<U>) | U | ((value: T) => U)): Validated<T & {
        [key in K]: U;
    }>;
    concat(validated: Validated<T>): Validated<T>;
    getErrorsOrElse(alternative: string[] | ((value: T) => string[])): string[];
    getOrElse(alternative: T | ((errors: string[]) => T)): T;
    isInvalid(): boolean;
    isValid(): boolean;
    map<U>(f: (value: T) => U): Validated<U>;
    mapErrors(f: (errors: string[]) => string[]): Validated<T>;
    match<U, V>(pattern: ValidatedMatchPattern<T, U>): U;
    perform(sideEffect: (value: T) => void): Validated<T>;
    performWhenInvalid(sideEffect: (errors: string[]) => void): Validated<T>;
}
export declare function valid<T>(value: T): Valid<T>;
export declare function validatedObject(): Valid<{}>;
