import {Validated, ValidatedMatchPattern} from './Validated';
import {Future, Option, Result} from '..';

export declare class Valid<T, E> implements Validated<T, E> {
    private readonly value;
    constructor(value: T);
    apply<U, V>(this: Valid<(parameter: U) => V, E>, parameterOrFunction: Validated<U, E> | (() => U) | (() => Validated<U, E>) | U): Validated<V, E>;
    assign<T extends object, K extends string, U>(this: Valid<T, E>, key: K, memberOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & {
        [key in K]: U;
    }, E>;
    concat(validated: Validated<T, E>): Validated<T, E>;
    getErrorsOrElse(alternative: E[] | ((value: T) => E[])): E[];
    getOrElse(alternative: T | ((errors: E[]) => T)): T;
    isInvalid(): boolean;
    isValid(): boolean;
    map<U>(f: (value: T) => U): Validated<U, E>;
    mapErrors(f: (errors: E[]) => E[]): Validated<T, E>;
    match<U, V>(pattern: ValidatedMatchPattern<T, U, E>): U;
    perform(sideEffect: (value: T) => void): Validated<T, E>;
    performWhenInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>;
    toFuture(): Future<T, E[]>;
    toResult(): Result<T, E[]>;
    toOption(): Option<T>;
}
export declare function valid<T, E>(value: T): Valid<T, E>;
export declare function validatedObject<E>(): Valid<{}, E>;
