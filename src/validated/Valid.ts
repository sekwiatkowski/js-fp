import {Validated} from './Validated'
import {Invalid} from './Invalid'
import {fulfill, Future, Option, Result, some, success} from '..'

export class Valid<T, E> implements Validated<T, E> {
    constructor(private readonly value: T) {}

    apply<U, V>(
        this: Valid<(parameter: U) => V, E>,
        parameterOrFunction: Validated<U, E> | (() => U) | (() => Validated<U, E>) | U): Validated<V, E> {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction

        if (parameter instanceof Invalid || parameter instanceof Valid) {
            return parameter.map(parameterValue => this.value(parameterValue))
        }
        else {
            return this.map(f => f(<U>parameter))
        }
    }

    assign<T extends object, K extends string, U>(
        this: Valid<T, E>,
        key: K,
        memberOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }, E> {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction

        if (member instanceof Valid || member instanceof Invalid) {
            return member.map<T & { [key in K]: U }>(memberValue => ({
                ...Object(this.value),
                [key]: memberValue
            }))
        }
        else {
            return this.map<T & { [key in K]: U }>(obj => ({
                ...Object(obj),
                [key]: member
            }))
        }
    }

    concat(validated: Validated<T, E>): Validated<T, E> {
        return validated
    }

    getErrorsOrElse(alternative: E[]|((value: T) => E[])): E[] {
        return alternative instanceof Function ? alternative(this.value) : alternative
    }

    getOrElse(alternative: T|((errors: E[]) => T)): T {
        return this.value
    }

    isInvalid(): boolean {
        return false
    }

    isValid(): boolean {
        return true
    }

    map<U>(f: (value: T) => U): Validated<U, E> {
        return new Valid(f(this.value))
    }

    mapErrors(f: (errors: E[]) => E[]): Validated<T, E> {
        return this
    }

    fold<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U {
        return onValid(this.value)
    }

    perform(sideEffect: () => void): Validated<T, E> {
        sideEffect()
        return this
    }

    performOnValid(sideEffect: (value: T) => void): Validated<T, E> {
        sideEffect(this.value)
        return this
    }

    performOnInvalid(sideEffect: (errors: E[]) => void): Validated<T, E> {
        return this
    }

    toFuture(): Future<T, E[]> {
        return fulfill<T, E[]>(this.value)
    }

    toOption(): Option<T> {
        return some(this.value)
    }

    toResult(): Result<T, E[]> {
        return success(this.value)
    }
}

export function valid<T, E>(value: T): Valid<T, E> {
    return new Valid(value)
}

export function validatedObject<E>() : Valid<{}, E> {
    return valid({})
}