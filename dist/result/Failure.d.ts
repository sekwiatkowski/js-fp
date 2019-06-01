import {Result, ResultFoldPattern} from './Result';
import {Future, Option, Validated} from '..';

export declare class Failure<T, E> implements Result<T, E> {
    private readonly error;
    constructor(error: E);
    apply<U, V>(this: Failure<(parameter: U) => V, E>, parameterOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E>;
    assign<T extends object, K extends string, U>(this: Failure<T, E>, key: K, other: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & {
        [key in K]: U;
    }, E>;
    chain<U>(f: (t: T) => Result<U, E>): Result<U, E>;
    isFailure(): boolean;
    isSuccess(): boolean;
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    map<U>(f: (value: T) => U): Result<U, E>;
    mapError<F>(f: (error: E) => F): Result<T, F>;
    fold<X>(pattern: ResultFoldPattern<T, E, X>): X;
    orElse(alternative: T | ((error: E) => T)): Result<T, E>;
    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>;
    perform(sideEffect: (value: T) => void): Result<T, E>;
    performOnError(sideEffect: (error: E) => void): Result<T, E>;
    toFuture(): Future<T, E>;
    toOption(): Option<T>;
    toValidated(): Validated<T, E>;
}
export declare function failure<T, E>(error: E): Failure<T, E>;
