export interface SettledFoldPattern<T, E, X> {
    Resolved: (value: T) => X;
    Rejected: (error: E) => X;
}
export interface Settled<T, E> {
    fold<X>(pattern: SettledFoldPattern<T, E, X>): X;
    getErrorOrElse(alternative: E | ((value: T) => E)): E;
    getOrElse(alternative: T | ((error: E) => T)): T;
    map<U>(f: (value: T) => U): Settled<U, E>;
    mapError<F>(f: (error: E) => F): Settled<T, F>;
    perform(sideEffect: () => void): Settled<T, E>;
    performOnFulfilled(sideEffect: (value: T) => void): Settled<T, E>;
    performOnRejected(sideEffect: (error: E) => void): Settled<T, E>;
    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void): any;
}
