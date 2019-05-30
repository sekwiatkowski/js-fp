import { Result, ResultMatchPattern } from './Result';
export declare class Failure<T, E> implements Result<T, E> {
    private readonly error;
    constructor(error: E);
    apply<U, V>(this: Failure<(parameter: U) => V, E>, parameterOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E>;
    assign<T extends object, U>(this: Failure<T, E>, key: string, memberOrFunction: U | ((value: T) => U) | Result<T, E> | ((value: T) => T) | ((value: T) => Result<T, E>)): Result<T & {
        [key in string]: U;
    }, E>;
    chain<U>(f: (t: T) => Result<U, E>): Result<U, E>;
    isFailure(): boolean;
    isSuccess(): boolean;
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    map<U>(f: (value: T) => U): Result<U, E>;
    mapError<F>(f: (error: E) => F): Result<T, F>;
    match<X>(pattern: ResultMatchPattern<T, E, X>): X;
    orElse(alternative: T | ((error: E) => T)): Result<T, E>;
    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>;
    perform(sideEffect: (value: T) => void): Result<T, E>;
    performOnError(sideEffect: (error: E) => void): Result<T, E>;
}
export declare function failure<T, E>(error: E): Failure<T, E>;
