import { Equivalence, Future, Option, Predicate, Validated } from '..';
export interface Result<T, E> {
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    apply<U, V>(this: Result<(parameter: U) => V, E>, argumentOrResultOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E>;
    chain<U>(f: (value: T) => Result<U, E>): Result<U, E>;
    assign<T extends object, K extends string, U>(this: Result<T, E>, key: Exclude<K, keyof T>, memberResultOrValueOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & {
        [key in K]: U;
    }, E>;
    toFuture(): Future<T, E>;
    toOption(): Option<T>;
    toValidated(): Validated<T, E>;
    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>;
    orElse(alternative: T | ((error: E) => T)): Result<T, E>;
    map<U>(f: (value: T) => U): Result<U, E>;
    mapError<F>(f: (error: E) => F): Result<T, F>;
    match<X>(onSuccess: (value: T) => X, onFailure: (error: E) => X): X;
    perform(sideEffect: (value: T) => void): Result<T, E>;
    performOnFailure(sideEffect: (error: E) => void): Result<T, E>;
    performOnBoth(sideEffect: () => void): Result<T, E>;
    isFailure(): boolean;
    isSuccess(): boolean;
    equals(otherResult: Result<T, E>, equality: Equivalence<Result<T, E>>): boolean;
    test(predicate: (value: T) => boolean): boolean;
    test(predicate: Predicate<T>): boolean;
    test(predicate: ((value: T) => boolean) | Predicate<T>): boolean;
}
export declare function createResultEquality<T, E>(valueEquality?: Equivalence<T>, errorEquality?: Equivalence<E>): Equivalence<Result<T, E>>;
