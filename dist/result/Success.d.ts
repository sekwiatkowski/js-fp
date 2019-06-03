import {Result, ResultFoldPattern} from './Result';
import {Future, Option, Validated} from '..';

export declare class Success<T, E> implements Result<T, E> {
    private readonly value;
    constructor(value: T);
    apply<U, V>(this: Result<(parameter: U) => V, E>, parameterOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E>;
    assign<T extends object, K extends string, U>(this: Success<T, E>, key: K, memberOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & {
        [key in K]: U;
    }, E>;
    chain<U>(f: (t: T) => Result<U, E>): Result<U, E>;
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    isFailure(): boolean;
    isSuccess(): boolean;
    map<U>(f: (value: T) => U): Result<U, E>;
    mapError<F>(f: (error: E) => F): Result<T, F>;
    fold<X>(pattern: ResultFoldPattern<T, E, X>): X;
    orElse(alternative: T | ((error: E) => T)): Result<T, E>;
    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>;
    perform(sideEffect: () => void): Result<T, E>;
    performOnSuccess(sideEffect: (value: T) => void): Result<T, E>;
    performOnFailure(sideEffect: (error: E) => void): Result<T, E>;
    toFuture(): Future<T, E>;
    toOption(): Option<T>;
    toValidated(): Validated<T, E>;
}
export declare function success<T, E>(value: T): Success<T, E>;
export declare function resultObject<E>(): Result<{}, E>;
