import {Validated} from './Validated'
import {Invalid} from './Invalid'
import {Equivalence, fulfill, Future, Option, Predicate, Result, some, success} from '..'

export class Valid<T, E> implements Validated<T, E> {
    constructor(private readonly value: T) {}

    //region Access
    getErrorsOrElse(alternative: E[]|((value: T) => E[])): E[] {
        return alternative instanceof Function ? alternative(this.value) : alternative
    }

    getOrElse(alternative: T|((errors: E[]) => T)): T {
        return this.value
    }
    //endregion

    //region Application
    apply<U, V>(
        this: Valid<(parameter: U) => V, E>,
        argumentOrFunctionOrValidated: Validated<U, E> | (() => U) | (() => Validated<U, E>) | U): Validated<V, E> {
        const argumentOrValidated = argumentOrFunctionOrValidated instanceof Function ? argumentOrFunctionOrValidated() : argumentOrFunctionOrValidated

        if (argumentOrValidated instanceof Invalid || argumentOrValidated instanceof Valid) {
            return argumentOrValidated.map(argument => this.value(argument))
        }
        else {
            return this.map(f => f(<U>argumentOrValidated))
        }
    }
    //endregion

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Valid<T, E>,
        key: K,
        memberOrValidatedOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }, E> {
        const member = memberOrValidatedOrFunction instanceof Function ? memberOrValidatedOrFunction(this.value) : memberOrValidatedOrFunction

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
    //endregion

    //region Concatenation
    concat(otherValidated: Validated<T, E>): Validated<T, E> {
        return otherValidated
    }
    //endregion

    //region Conversion
    toFuture(): Future<T, E[]> {
        return fulfill<T, E[]>(this.value)
    }

    toOption(): Option<T> {
        return some(this.value)
    }

    toResult(): Result<T, E[]> {
        return success(this.value)
    }
    //endregion

    //region Mapping
    map<U>(f: (value: T) => U): Validated<U, E> {
        return new Valid(f(this.value))
    }

    mapErrors(f: (errors: E[]) => E[]): Validated<T, E> {
        return this
    }
    //endregion

    //region Matching
    match<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U {
        return onValid(this.value)
    }
    //endregion

    //region Side-effects
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
    //endregion

    //region Status
    isInvalid(): boolean {
        return false
    }

    isValid(): boolean {
        return true
    }
    //endregion

    //region Testing
    equals(otherValidated: Validated<T, E>, equality: Equivalence<Validated<T, E>>): boolean {
        return equality.test(this, otherValidated)
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

export function valid<T, E>(value: T): Valid<T, E> {
    return new Valid(value)
}

export function validatedObject<E>() : Valid<{}, E> {
    return valid({})
}