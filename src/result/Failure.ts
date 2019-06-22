import {Result} from './Result'
import {success} from './Success'
import {Equivalence, Future, invalid, none, Option, Predicate, reject, Validated} from '..'

export class Failure<T, E> implements Result<T, E> {
    constructor(private readonly error: E) {}

    //region Access
    getErrorOrElse(alternative: E|((value: T) => E)): E {
        return this.error
    }

    getOrElse(alternative: T|((error: E) => T)): T {
        return alternative instanceof Function ? alternative(this.error) : alternative
    }
    //endregion

    //region Application
    apply<U, V>(
        this: Failure<(parameter: U) => V, E>,
        argumentOrFunctionOrResult: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E> {
        return new Failure(this.error)
    }
    //endregion

    //region Chaining
    chain<U>(f: (t: T) => Result<U, E>): Result<U, E> {
        return new Failure<U, E>(this.error)
    }
    //endregion

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Failure<T, E>,
        key: Exclude<K, keyof T>,
        memberResultOrValueOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & { [key in K]: U }, E> {
        return new Failure<T & { [k in K]: U }, E>(this.error)
    }
    //endregion

    //region Conversion
    toFuture(): Future<T, E> {
        return reject<T, E>(this.error)
    }

    toOption(): Option<T> {
        return none
    }

    toValidated(): Validated<T, E> {
        return invalid([this.error])
    }
    //endregion

    //region Fallback
    orElse(alternative: T|((error: E) => T)): Result<T, E> {
        return success(alternative instanceof Function ? alternative(this.error) : alternative)
    }

    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E> {
        return alternative(this.error)
    }
    //endregion

    //region Mapping
    map<U>(f: (value: T) => U): Result<U, E> {
        return new Failure(this.error)
    }

    mapError<F>(f: (error: E) => F): Result<T, F> {
        return new Failure(f(this.error))
    }
    //endregion

    //region Matching
    match<X>(onSuccess: (value: T) => X, onFailure: (error: E) => X) : X {
        return onFailure(this.error)
    }
    //endregion

    //region Side-effects
    perform(sideEffect: () => void) : Result<T, E> {
        sideEffect()
        return this
    }

    performOnSuccess(sideEffect: (value: T) => void) : Result<T, E> {
        return this
    }

    performOnFailure(sideEffect: (error: E) => void) : Result<T, E> {
        sideEffect(this.error)
        return this
    }
    //endregion

    //region Status
    isFailure(): boolean {
        return true
    }

    isSuccess(): boolean {
        return false
    }
    //endregion

    //region Testing
    equals(otherResult: Result<T, E>, equality: Equivalence<Result<T, E>>): boolean {
        return equality.test(this, otherResult)
    }

    test(predicate: (value: T) => boolean): boolean
    test(predicate: Predicate<T>): boolean
    test(predicate: ((value: T) => boolean)|Predicate<T>): boolean {
        return false
    }
    //endregion
}

export function failure<T, E>(error: E) : Failure<T, E> {
    return new Failure(error)
}