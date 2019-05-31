import {Result, ResultMatchPattern} from './Result'
import {success} from './Success'

export class Failure<T, E> implements Result<T, E> {
    constructor(private readonly error: E) {}

    apply<U, V>(
        this: Failure<(parameter: U) => V, E>,
        parameterOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E> {

        return new Failure(this.error)
    }

    assign<T extends object, K extends string, U>(
        this: Failure<T, E>,
        key: K,
        other: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & { [key in K]: U }, E> {
        return new Failure<T & { [k in K]: U }, E>(this.error)
    }

    chain<U>(f: (t: T) => Result<U, E>): Result<U, E> {
        return new Failure<U, E>(this.error)
    }

    isFailure(): boolean {
        return true
    }

    isSuccess(): boolean {
        return false
    }

    getErrorOrElse(alternative: E|((value: T) => E)): E {
        return this.error
    }

    getOrElse(alternative: T|((error: E) => T)): T {
        return alternative instanceof Function ? alternative(this.error) : alternative
    }

    map<U>(f: (value: T) => U): Result<U, E> {
        return new Failure(this.error)
    }

    mapError<F>(f: (error: E) => F): Result<T, F> {
        return new Failure(f(this.error))
    }

    match<X>(pattern: ResultMatchPattern<T, E, X>): X {
        return pattern.Failure(this.error)
    }

    orElse(alternative: T|((error: E) => T)): Result<T, E> {
        return success(alternative instanceof Function ? alternative(this.error) : alternative)
    }

    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E> {
        return alternative(this.error)
    }

    perform(sideEffect: (value: T) => void) : Result<T, E> {
        return this
    }

    performOnError(sideEffect: (error: E) => void) : Result<T, E> {
        sideEffect(this.error)
        return new Failure(this.error)
    }
}


export function failure<T, E>(error: E) : Failure<T, E> {
    return new Failure(error)
}