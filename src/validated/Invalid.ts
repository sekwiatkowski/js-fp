import {Validated, ValidatedMatchPattern} from './Validated'

export class Invalid<T> implements Validated<T> {
    constructor(private readonly errors: string[]) {}

    apply<U, V>(
        this: Invalid<(parameter: U) => V>,
        parameterOrFunction: U | (() => U) | Validated<U> | (() => Validated<U>)): Validated<V> {

        return new Invalid(this.errors)
    }

    assign<T extends object, K extends string, U>(
        this: Invalid<T>,
        key: K,
        memberOrFunction: Validated<U> | ((value: T) => Validated<U>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }> {
        return new Invalid<T & { [key in K]: U }>(this.errors)
    }

    concat(other: Validated<T>): Validated<T> {
        return other.match({
            Valid: () => this,
            Invalid: otherList => new Invalid<T>(this.errors.concat(otherList))
        })
    }

    getErrorsOrElse(alternative: string[]|((value: T) => string[])): string[] {
        return this.errors
    }

    getOrElse(alternative: T|((errors: string[]) => T)): T {
        return alternative instanceof Function ? alternative(this.errors) : alternative
    }

    isInvalid(): boolean {
        return true
    }

    isValid(): boolean {
        return false
    }

    map<U>(f: (value: T) => U): Validated<U> {
        return new Invalid<U>(this.errors)
    }

    mapErrors(f: (errors: string[]) => string[]): Validated<T> {
        return new Invalid(f(this.errors))
    }

    match<U>(pattern: ValidatedMatchPattern<T, U>): U {
        return pattern.Invalid(this.errors)
    }

    perform(sideEffect: (value: T) => void): Validated<T> {
        return this
    }

    performWhenInvalid(sideEffect: (errors: string[]) => void): Validated<T> {
        sideEffect(this.errors)
        return this
    }
}

export function invalid<T>(errors: string|string[]): Invalid<T> {
    return new Invalid<T>(errors instanceof Array ? errors : [errors])
}