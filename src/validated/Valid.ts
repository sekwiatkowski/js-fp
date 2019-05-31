import {Validated, ValidatedMatchPattern} from './Validated'
import {Invalid} from './Invalid'

export class Valid<T> implements Validated<T> {
    constructor(private readonly value: T) {}

    apply<U, V>(
        this: Valid<(parameter: U) => V>,
        parameterOrFunction: Validated<U> | (() => U) | (() => Validated<U>) | U): Validated<V> {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction

        if (parameter instanceof Invalid || parameter instanceof Valid) {
            return parameter.map(parameterValue => this.value(parameterValue))
        }
        else {
            return this.map(f => f(<U>parameter))
        }
    }

    assign<T extends object, K extends string, U>(
        this: Valid<T>,
        key: K,
        memberOrFunction: Validated<U> | ((value: T) => Validated<U>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }> {
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

    concat(validated: Validated<T>): Validated<T> {
        return validated
    }

    getErrorsOrElse(alternative: string[]|((value: T) => string[])): string[] {
        return alternative instanceof Function ? alternative(this.value) : alternative
    }

    getOrElse(alternative: T|((errors: string[]) => T)): T {
        return this.value
    }

    isInvalid(): boolean {
        return false
    }

    isValid(): boolean {
        return true
    }

    map<U>(f: (value: T) => U): Validated<U> {
        return new Valid(f(this.value))
    }

    mapErrors(f: (errors: string[]) => string[]): Validated<T> {
        return this;
    }

    match<U, V>(pattern: ValidatedMatchPattern<T, U>): U {
        return pattern.Valid(this.value)
    }

    perform(sideEffect: (value: T) => void): Validated<T> {
        sideEffect(this.value)
        return this
    }

    performWhenInvalid(sideEffect: (errors: string[]) => void): Validated<T> {
        return this
    }
}

export function valid<T>(value: T): Valid<T> {
    return new Valid(value)
}

export function validatedObject() : Valid<{}> {
    return valid({})
}