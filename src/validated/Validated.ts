export interface ValidatedMatchPattern<T, U, E> {
    Valid: (value: T) => U
    Invalid: (list: E[]) => U
}

export interface Validated<T, E> {
    apply<U, V>(
        this: Validated<(parameter: U) => V, E>,
        parameterOrFunction: U | Validated<U, E> | (() => U) | (() => Validated<U, E>)) : Validated<V, E>

    assign<T extends object, K extends string, U>(
        this: Validated<T, E>,
        key: K,
        memberOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }, E>

    concat(v: Validated<T, E>): Validated<T, E>

    getErrorsOrElse(alternative: E[]|((value: T) => E[])): E[]
    getOrElse(alternative: T|((errors: E[]) => T)): T

    isValid(): boolean
    isInvalid(): boolean

    map<U>(f: (value: T) => U) : Validated<U, E>
    mapErrors(f: (errors: E[]) => E[]) : Validated<T, E>

    match<U>(pattern: ValidatedMatchPattern<T, U, E>): U

    perform(sideEffect: (value: T) => void): Validated<T, E>
    performWhenInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>
}