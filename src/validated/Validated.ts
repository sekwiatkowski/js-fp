import {Future, Option, Result} from '..'

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

    fold<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U

    perform(sideEffect: () => void): Validated<T, E>
    performOnValid(sideEffect: (value: T) => void): Validated<T, E>
    performOnInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>

    toFuture(): Future<T, E[]>
    toResult(): Result<T, E[]>
    toOption(): Option<T>
}