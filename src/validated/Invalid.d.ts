import { Validated, ValidatedMatchPattern } from './Validated';
export declare class Invalid<T> implements Validated<T> {
    private readonly errors;
    constructor(errors: string[]);
    apply<U, V>(this: Invalid<(parameter: U) => V>, parameterOrFunction: U | (() => U) | Validated<U> | (() => Validated<U>)): Validated<V>;
    assign<T extends object, U>(this: Invalid<T>, key: string, other: U | ((T: any) => U) | Validated<U> | ((value: T) => Validated<U>)): Validated<T & {
        [key in string]: U;
    }>;
    concat(other: Validated<T>): Validated<T>;
    getErrorsOrElse(alternative: string[] | ((value: T) => string[])): string[];
    getOrElse(alternative: T | ((errors: string[]) => T)): T;
    isInvalid(): boolean;
    isValid(): boolean;
    map<U>(f: (value: T) => U): Validated<U>;
    mapErrors(f: (errors: string[]) => string[]): Validated<T>;
    match<U>(pattern: ValidatedMatchPattern<T, U>): U;
    perform(sideEffect: (value: T) => void): Validated<T>;
    performWhenInvalid(sideEffect: (errors: string[]) => void): Validated<T>;
}
export declare function invalid<T>(errors: string | string[]): Invalid<T>;
