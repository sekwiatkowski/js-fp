import { Settled, SettledMatchPattern } from './Settled';
declare class Rejected<T, E> implements Settled<T, E> {
    private readonly error;
    constructor(error: E);
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    match<X>(pattern: SettledMatchPattern<T, E, X>): X;
    map<U>(f: (value: T) => U): Settled<U, E>;
    mapError<F>(f: (error: E) => F): Settled<T, F>;
    perform(sideEffect: (value: T) => void): void;
    performOnError(sideEffect: (error: E) => void): void;
    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void): void;
}
export declare function rejected<T, E>(error: E): Rejected<T, E>;
export {};