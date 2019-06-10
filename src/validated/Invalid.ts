import {Validated} from './Validated'
import {failure, Future, none, Option, reject, Result} from '..'
import {listFromArray} from '../list/List'

export class Invalid<T, E> implements Validated<T, E> {
    constructor(private readonly errors: E[]) {}

    apply<U, V>(
        this: Invalid<(parameter: U) => V, E>,
        parameterOrFunction: U | (() => U) | Validated<U, E> | (() => Validated<U, E>)): Validated<V, E> {

        return new Invalid(this.errors)
    }

    assign<T extends object, K extends string, U>(
        this: Invalid<T, E>,
        key: K,
        memberOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }, E> {
        return new Invalid<T & { [key in K]: U }, E>(this.errors)
    }

    concat(otherValidated: Validated<T, E>): Validated<T, E> {
        return otherValidated.fold(
            () => this,
            otherList => new Invalid<T, E>(this.errors.concat(otherList)))
    }

    equals(otherValidated: Validated<T, E>): boolean {
        return otherValidated.fold(
            () => false,
            otherErrors => listFromArray(this.errors).equals(listFromArray(otherErrors))
        )
    }

    getErrorsOrElse(alternative: E[]|((value: T) => E[])): E[] {
        return this.errors
    }

    getOrElse(alternative: T|((errors: E[]) => T)): T {
        return alternative instanceof Function ? alternative(this.errors) : alternative
    }

    isInvalid(): boolean {
        return true
    }

    isValid(): boolean {
        return false
    }

    map<U>(f: (value: T) => U): Validated<U, E> {
        return new Invalid<U, E>(this.errors)
    }

    mapErrors(f: (errors: E[]) => E[]): Validated<T, E> {
        return new Invalid(f(this.errors))
    }

    fold<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U{
        return onInvalid(this.errors)
    }

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

    toFuture(): Future<T, E[]> {
        return reject<T, E[]>(this.errors)
    }

    toOption(): Option<T> {
        return none
    }

    toResult(): Result<T, E[]> {
        return failure<T, E[]>(this.errors)
    }
}

export function invalid<T, E>(errors: E|E[]): Invalid<T, E> {
    return new Invalid<T, E>(errors instanceof Array ? errors : [errors])
}