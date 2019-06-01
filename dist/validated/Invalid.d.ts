import {Validated, ValidatedMatchPattern} from './Validated';
import {Future, Option, Result} from '..';

export declare class Invalid<T, E> implements Validated<T, E> {
    private readonly errors;
    constructor(errors: E[]);
    apply<U, V>(this: Invalid<(parameter: U) => V, E>, parameterOrFunction: U | (() => U) | Validated<U, E> | (() => Validated<U, E>)): Validated<V, E>;
    assign<T extends object, K extends string, U>(this: Invalid<T, E>, key: K, memberOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & {
        [key in K]: U;
    }, E>;
    concat(other: Validated<T, E>): Validated<T, E>;
    getErrorsOrElse(alternative: E[] | ((value: T) => E[])): E[];
    getOrElse(alternative: T | ((errors: E[]) => T)): T;
    isInvalid(): boolean;
    isValid(): boolean;
    map<U>(f: (value: T) => U): Validated<U, E>;
    mapErrors(f: (errors: E[]) => E[]): Validated<T, E>;
    match<U>(pattern: ValidatedMatchPattern<T, U, E>): U;
    perform(sideEffect: (value: T) => void): Validated<T, E>;
    performWhenInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>;
    toFuture(): Future<T, E[]>;
    toResult(): Result<T, E[]>;
    toOption(): Option<T>;
}
export declare function invalid<T, E>(errors: E | E[]): Invalid<T, E>;
