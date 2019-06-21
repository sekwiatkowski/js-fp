import {Validated} from './Validated'
import {Equivalence, failure, Future, none, Option, Predicate, reject, Result} from '..'

export class Invalid<T, E> implements Validated<T, E> {
    constructor(private readonly errors: E[]) {}

    //region Access
    getErrorsOrElse(alternative: E[]|((value: T) => E[])): E[] {
        return this.errors
    }

    getOrElse(alternative: T|((errors: E[]) => T)): T {
        return alternative instanceof Function ? alternative(this.errors) : alternative
    }
    //endregion

    //region Application
    apply<U, V>(
        this: Invalid<(parameter: U) => V, E>,
        argumentOrValidatedOrFunction: U | (() => U) | Validated<U, E> | (() => Validated<U, E>)): Validated<V, E> {
        return new Invalid(this.errors)
    }
    //endregion

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Invalid<T, E>,
        key: K,
        memberOrValidatedOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }, E> {
        return new Invalid<T & { [key in K]: U }, E>(this.errors)
    }
    //endregion

    //region Concatenation
    concat(otherValidated: Validated<T, E>): Validated<T, E> {
        return otherValidated.match(
            () => this,
            otherList => new Invalid<T, E>(this.errors.concat(otherList)))
    }
    //endregion

    //region Conversion
    toFuture(): Future<T, E[]> {
        return reject<T, E[]>(this.errors)
    }

    toOption(): Option<T> {
        return none
    }

    toResult(): Result<T, E[]> {
        return failure<T, E[]>(this.errors)
    }
    //endregion

    //region Mapping
    map<U>(f: (value: T) => U): Validated<U, E> {
        return new Invalid<U, E>(this.errors)
    }

    mapErrors(f: (errors: E[]) => E[]): Validated<T, E> {
        return new Invalid(f(this.errors))
    }
    //endregion

    //region Matching
    match<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U{
        return onInvalid(this.errors)
    }
    //endregion

    //region Side-effects
    perform(sideEffect: () => void): Validated<T, E> {
        sideEffect()
        return this
    }

    performOnValid(sideEffect: (value: T) => void): Validated<T, E> {
        return this
    }

    performOnInvalid(sideEffect: (errors: E[]) => void): Validated<T, E> {
        sideEffect(this.errors)
        return this
    }
    //endregion

    //region Status
    isInvalid(): boolean {
        return true
    }

    isValid(): boolean {
        return false
    }
    //endregion

    //region Testing
    equals(otherValidated: Validated<T, E>, equality: Equivalence<Validated<T, E>>): boolean {
        return equality.test(this, otherValidated)
    }

    test(predicate: (value: T) => boolean): boolean
    test(predicate: Predicate<T>): boolean
    test(predicate: ((value: T) => boolean)|Predicate<T>): boolean {
        return false
    }
    //endregion
}

export function invalid<T, E>(errors: E|E[]): Invalid<T, E> {
    return new Invalid<T, E>(errors instanceof Array ? errors : [errors])
}