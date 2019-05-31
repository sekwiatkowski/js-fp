export interface ResultMatchPattern<T, E, X> {
    Success: (value: T) => X
    Failure: (error: E) => X
}

export interface Result<T, E> {
    apply<U, V>(
        this: Result<(parameter: U) => V, E>,
        parameterOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)) : Result<V, E>

    assign<T extends object, K extends string, U>(
        this: Result<T, E>,
        key: K,
        memberOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & { [key in K]: U }, E>

    chain<U>(f: (value: T) => Result<U, E>): Result<U, E>

    getErrorOrElse(alternative: E|((value: T) => E)): E
    getOrElse(alternative: T|((error: E) => T)): T

    isFailure(): boolean
    isSuccess(): boolean

    map<U>(f: (value: T) => U): Result<U, E>
    mapError<F>(f: (F) => F): Result<T, F>

    match<X>(pattern : ResultMatchPattern<T, E, X>) : X

    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>
    orElse(alternative: T|((error: E) => T)): Result<T, E>

    perform(sideEffect: (value: T) => void): Result<T, E>
    performOnError(sideEffect: (error: E) => void): Result<T, E>
}