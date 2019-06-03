import {Settled, SettledFoldPattern} from './Settled';

declare class Fulfilled<T, E> implements Settled<T, E> {
    private readonly value;
    constructor(value: T);
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    map<U>(f: (value: T) => U): Settled<U, E>;
    mapError<F>(f: (error: E) => F): Settled<T, F>;
    fold<X>(pattern: SettledFoldPattern<T, E, X>): X;
    orAttempt(alternative: (error: E) => Promise<T>): Settled<T, E>;
    perform(sideEffect: () => void): Settled<T, E>;
    performOnFulfilled(sideEffect: (value: T) => void): Settled<T, E>;
    performOnRejected(sideEffect: (error: E) => void): Settled<T, E>;
    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void): void;
}
export declare function fulfilled<T, E>(value: T): Fulfilled<T, E>;
export {};
