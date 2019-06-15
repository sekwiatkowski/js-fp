import {anyResultEquality, Result} from './Result'
import {Failure} from './Failure'
import {Equivalence, fulfill, Future, Option, Predicate, some, valid, Validated} from '..'

export class Success<T, E> implements Result<T, E> {
    constructor(private readonly value: T) {}

    //region Access
    getErrorOrElse(alternative: E|((value: T) => E)): E {
        return alternative instanceof Function ? alternative(this.value) : alternative
    }

    getOrElse(alternative: T|((error: E) => T)): T {
        return this.value
    }
    //endregion

    //region Application
    apply<U, V>(
        this: Result<(parameter: U) => V, E>,
        argumentOrFunctionOrResult: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E> {
        const argumentOrResult = argumentOrFunctionOrResult instanceof Function ? argumentOrFunctionOrResult() : argumentOrFunctionOrResult

        if (argumentOrResult instanceof Success || argumentOrResult instanceof Failure) {
            return argumentOrResult.chain(argument => this.map(f => f(argument)))
        }
        else {
            return this.map(f => f(<U>argumentOrResult))
        }
    }
    //endregion

    //region Chaining
    chain<U>(f: (t: T) => Result<U, E>): Result<U, E> {
        return f(this.value)
    }
    //endregion

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Success<T, E>,
        key: K,
        memberOrResultOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & { [key in K]: U }, E> {
        const memberOrResult = memberOrResultOrFunction instanceof Function ? memberOrResultOrFunction(this.value) : memberOrResultOrFunction

        if(memberOrResult instanceof Success || memberOrResult instanceof Failure) {
            return memberOrResult.map<T & { [key in K]: U }>(memberValue => ({
                ...Object(this.value),
                [key]: memberValue
            }))
        }
        else {
            return this.map<T & { [key in K]: U }>(obj  => ({
                ...Object(obj),
                [key]: memberOrResult
            }))
        }
    }
    //endregion

    //region Conversion
    toFuture(): Future<T, E> {
        return fulfill<T, E>(this.value)
    }

    toOption(): Option<T> {
        return some(this.value)
    }

    toValidated(): Validated<T, E> {
        return valid(this.value)
    }
    //endregion

    //region Fallback
    orElse(alternative: T|((error: E) => T)): Result<T, E> {
        return this
    }

    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E> {
        return this
    }
    //endregion

    //region Mapping
    map<U>(f: (value: T) => U): Result<U, E> {
        return new Success(f(this.value))
    }

    mapError<F>(f: (error: E) => F): Result<T, F> {
        return new Success(this.value)
    }
    //endregion

    //region Matching
    match<X>(onSuccess: (value: T) => X, onFailure: (error: E) => X) : X {
        return onSuccess(this.value)
    }
    //endregion

    //region Side-effects
    perform(sideEffect: () => void): Result<T, E> {
        sideEffect()
        return this
    }

    performOnSuccess(sideEffect: (value: T) => void): Result<T, E> {
        sideEffect(this.value)
        return this
    }

    performOnFailure(sideEffect: (error: E) => void): Result<T, E> {
        return this
    }
    //endregion

    //region Status
    isFailure(): boolean {
        return false
    }

    isSuccess(): boolean {
        return true
    }
    //endregion

    //region Testing
    equals(otherResult: Result<T, E>, equality?: Equivalence<Result<T, E>>): boolean {
        return (equality || anyResultEquality).test(this, otherResult)
    }

    test(predicate: (value: T) => boolean): boolean
    test(predicate: Predicate<T>): boolean
    test(predicate: ((value: T) => boolean)|Predicate<T>): boolean {
        if (predicate instanceof Function) {
            return predicate(this.value)
        }
        else {
            return predicate.test(this.value)
        }
    }
    //endregion
}

export function success<T, E>(value: T) : Success<T, E> {
    return new Success(value)
}

export function resultObject<E>() : Result<{}, E> {
    return success({})
}