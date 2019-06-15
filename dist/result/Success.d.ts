import { Result } from './Result';
import { Future, Option, Predicate, Validated } from '..';
export declare class Success<T, E> implements Result<T, E> {
    private readonly value;
    constructor(value: T);
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    apply<U, V>(this: Result<(parameter: U) => V, E>, argumentOrFunctionOrResult: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E>;
    chain<U>(f: (t: T) => Result<U, E>): Result<U, E>;
    assign<T extends object, K extends string, U>(this: Success<T, E>, key: K, memberOrResultOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & {
        [key in K]: U;
    }, E>;
    toFuture(): Future<T, E>;
    toOption(): Option<T>;
    toValidated(): Validated<T, E>;
    orElse(alternative: T | ((error: E) => T)): Result<T, E>;
    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>;
    map<U>(f: (value: T) => U): Result<U, E>;
    mapError<F>(f: (error: E) => F): Result<T, F>;
    match<X>(onSuccess: (value: T) => X, onFailure: (error: E) => X): X;
    perform(sideEffect: () => void): Result<T, E>;
    performOnSuccess(sideEffect: (value: T) => void): Result<T, E>;
    performOnFailure(sideEffect: (error: E) => void): Result<T, E>;
    isFailure(): boolean;
    isSuccess(): boolean;
    equals(otherResult: Result<T, E>): boolean;
    test(predicate: (value: T) => boolean): boolean;
    test(predicate: Predicate<T>): boolean;
}
export declare function success<T, E>(value: T): Success<T, E>;
export declare function resultObject<E>(): Result<{}, E>;
