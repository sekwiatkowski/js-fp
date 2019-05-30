export interface SettledMatchPattern<T, E, X> {
    Resolved: (T) => X,
    Rejected: (E) => X
}

export interface Settled<T, E> {
    map<U>(f: (value: T) => U): Settled<U, E>

    mapError<F>(f: (error: E) => F): Settled<T, F>

    match<X>(pattern: SettledMatchPattern<T, E, X>)

    getErrorOrElse(alternative: E | ((value: T) => E)): E

    getOrElse(alternative: T | ((error: E) => T)): T

    perform(sideEffect: (value: T) => void)

    performOnError(sideEffect: (error: E) => void)

    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void)
}