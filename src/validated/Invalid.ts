import {Validated, ValidatedMatchPattern} from './Validated'

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

    concat(other: Validated<T, E>): Validated<T, E> {
        return other.match({
            Valid: () => this,
            Invalid: otherList => new Invalid<T, E>(this.errors.concat(otherList))
        })
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

    match<U>(pattern: ValidatedMatchPattern<T, U, E>): U {
        return pattern.Invalid(this.errors)
    }

    perform(sideEffect: (value: T) => void): Validated<T, E> {
        return this
    }

    performWhenInvalid(sideEffect: (errors: E[]) => void): Validated<T, E> {
        sideEffect(this.errors)
        return this
    }
}

export function invalid<T, E>(errors: E|E[]): Invalid<T, E> {
    return new Invalid<T, E>(errors instanceof Array ? errors : [errors])
}