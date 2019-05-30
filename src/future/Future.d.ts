import { Settled, SettledMatchPattern } from './Settled';
export declare class Future<T, E> {
    private readonly createPromise;
    constructor(createPromise: () => Promise<Settled<T, E>>);
    apply<B, C>(this: Future<(parameter: B) => C, E>, parameterValueOrFunction: B | (() => B) | Future<B, E> | (() => Future<B, E>) | Promise<B> | (() => Promise<B>)): Future<C, E>;
    assign<T extends object, U>(this: Future<T, E>, key: string, memberValueOrFunction: U | ((value: T) => U) | Future<U, E> | ((value: T) => Future<U, E>) | Promise<U> | ((value: T) => Promise<U>)): Future<T & {
        [key in string]: U;
    }, E>;
    chain<U>(f: ((value: T) => Future<U, E>) | ((value: T) => Promise<U>)): Future<U, E>;
    getOrElse(alternative: T | ((error: E) => T)): Promise<T>;
    getErrorOrElse(alternative: E | ((value: T) => E)): Promise<E>;
    map<U>(f: (value: T) => U): Future<U, E>;
    mapError<F>(f: (error: E) => F): Future<T, F>;
    match<X>(pattern: SettledMatchPattern<T, E, X>): Promise<X>;
    orAttempt(alternative: Future<T, E> | ((error: E) => Future<T, E>)): Future<T, E>;
    orElse(alternative: T | ((error: E) => T)): Future<T, E>;
    orPromise(alternative: Promise<T> | ((error: E) => Promise<T>)): Future<T, E>;
    perform(sideEffect: (value: T) => void): Future<T, E>;
    performOnError(sideEffect: (error: E) => void): Future<T, E>;
    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void): void;
}
export declare function fulfill<T, E>(value: T): Future<T, E>;
export declare function reject<T, E>(error: E): Future<T, E>;
export declare function future<T, E>(createPromise: () => Promise<T>): Future<T, E>;
