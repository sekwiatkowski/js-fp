import {Result, ResultFoldPattern} from './Result'
import {Failure} from './Failure'
import {fulfill, Future, Option, some, valid, Validated} from '..'

export class Success<T, E> implements Result<T, E> {
    constructor(private readonly value: T) {}

    apply<U, V>(
        this: Result<(parameter: U) => V, E>,
        parameterOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)): Result<V, E> {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction

        if (parameter instanceof Success || parameter instanceof Failure) {
            return parameter.chain(parameterValue => this.map(f => f(parameterValue)))
        }
        else {
            return this.map(f => f(<U>parameter))
        }
    }

    assign<T extends object, K extends string, U>(
        this: Success<T, E>,
        key: K,
        memberOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & { [key in K]: U }, E> {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction

        if(member instanceof Success || member instanceof Failure) {
            return member.map<T & { [key in K]: U }>(memberValue => ({
                ...Object(this.value),
                [key]: memberValue
            }))
        }
        else {
            return this.map<T & { [key in K]: U }>(obj  => ({
                ...Object(obj),
                [key]: member
            }))
        }
    }

    chain<U>(f: (t: T) => Result<U, E>): Result<U, E> {
        return f(this.value)
    }

    getErrorOrElse(alternative: E|((value: T) => E)): E {
        return alternative instanceof Function ? alternative(this.value) : alternative
    }

    getOrElse(alternative: T|((error: E) => T)): T {
        return this.value
    }

    isFailure(): boolean {
        return false
    }

    isSuccess(): boolean {
        return true
    }

    map<U>(f: (value: T) => U): Result<U, E> {
        return new Success(f(this.value))
    }

    mapError<F>(f: (error: E) => F): Result<T, F> {
        return new Success(this.value)
    }

    fold<X>(pattern: ResultFoldPattern<T, E, X>): X {
        return pattern.Success(this.value)
    }

    orElse(alternative: T|((error: E) => T)): Result<T, E> {
        return this
    }

    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E> {
        return this
    }

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

    toFuture(): Future<T, E> {
        return fulfill<T, E>(this.value)
    }

    toOption(): Option<T> {
        return some(this.value)
    }

    toValidated(): Validated<T, E> {
        return valid(this.value)
    }
}

export function success<T, E>(value: T) : Success<T, E> {
    return new Success(value)
}

export function resultObject<E>() : Result<{}, E> {
    return success({})
}