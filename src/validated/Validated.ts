export interface ValidatedMatchPattern<T, U> {
    Valid: (value: T) => U
    Invalid: (list: string[]) => U
}

export interface Validated<T> {
    apply<U, V>(
        this: Validated<(parameter: U) => V>,
        parameterOrFunction: U | Validated<U> | (() => U) | (() => Validated<U>)) : Validated<V>

    assign<T extends object, K extends string, U>(
        this: Validated<T>,
        key: K,
        memberOrFunction: Validated<U> | ((value: T) => Validated<U>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }>

    concat(v: Validated<T>): Validated<T>

    getErrorsOrElse(alternative: string[]|((value: T) => string[])): string[]
    getOrElse(alternative: T|((errors: string[]) => T)): T

    isValid(): boolean
    isInvalid(): boolean

    map<U>(f: (value: T) => U) : Validated<U>
    mapErrors(f: (errors: string[]) => string[]) : Validated<T>

    match<U>(pattern: ValidatedMatchPattern<T, U>): U

    perform(sideEffect: (value: T) => void): Validated<T>
    performWhenInvalid(sideEffect: (errors: string[]) => void): Validated<T>
}