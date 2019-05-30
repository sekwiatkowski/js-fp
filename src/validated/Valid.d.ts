import { Validated, ValidatedMatchPattern } from './Validated';
export declare class Valid<T> implements Validated<T> {
    private readonly value;
    constructor(value: T);
    apply<U, V>(this: Valid<(parameter: U) => V>, parameterOrFunction: Validated<U> | (() => U) | (() => Validated<U>) | U): Validated<V>;
    assign<T extends object, U>(this: Valid<T>, key: string, memberOrFunction: U | ((T: any) => U) | Validated<U> | ((value: T) => Validated<U>)): Validated<T & {
        [key in string]: U;
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
