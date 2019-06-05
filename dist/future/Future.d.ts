import { Settled } from './Settled';
export declare class Future<T, E> {
    private readonly createPromise;
    constructor(createPromise: () => Promise<Settled<T, E>>);
    apply<B, C>(this: Future<(parameter: B) => C, E>, parameterValueOrFunction: B | (() => B) | Future<B, E> | (() => Future<B, E>) | Promise<B> | (() => Promise<B>)): Future<C, E>;
    assign<T extends object, K extends string, U>(this: Future<T, E>, key: K, memberValueOrFunction: Future<U, E> | ((value: T) => Future<U, E>) | Promise<U> | ((value: T) => Promise<U>) | U | ((value: T) => U)): Future<T & {
        [key in K]: U;
    }, E>;
    chain<U>(f: ((value: T) => Future<U, E>) | ((value: T) => Promise<U>)): Future<U, E>;
    getOrElse(alternative: T | ((error: E) => T)): Promise<T>;
    getErrorOrElse(alternative: E | ((value: T) => E)): Promise<E>;
    map<U>(f: (value: T) => U): Future<U, E>;
    mapError<F>(f: (error: E) => F): Future<T, F>;
    fold<X>(onFulfilled: (value: T) => X, onRejected: (error: E) => X): Promise<X>;
    isFulfilled(): Promise<boolean>;
    isRejected(): Promise<boolean>;
    orAttempt(alternative: Future<T, E> | ((error: E) => Future<T, E>)): Future<T, E>;
    orElse(alternative: T | ((error: E) => T)): Future<T, E>;
    orPromise(alternative: Promise<T> | ((error: E) => Promise<T>)): Future<T, E>;
    perform<U>(f: (() => Future<U, E>) | (() => Promise<U>)): Future<T, E>;
    performOnFulfilled<U>(f: ((value: T) => Future<U, E>) | ((value: T) => Promise<U>)): Future<T, E>;
    performOnRejected<U>(f: ((error: E) => Future<U, E>) | ((error: E) => Promise<U>)): Future<T, E>;
    performSync(sideEffect: () => void): Future<T, E>;
    performSyncOnFulfilled(sideEffect: (value: T) => void): Future<T, E>;
    performSyncOnRejected(sideEffect: (error: E) => void): Future<T, E>;
    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void): void;
}
export declare function fulfill<T, E>(value: T): Future<T, E>;
export declare function reject<T, E>(error: E): Future<T, E>;
export declare function future<T, E>(createPromise: () => Promise<T>): Future<T, E>;
export declare function futureObject<E>(): Future<{}, E>;
