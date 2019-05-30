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

    assign<T extends object, U>(
        this: Valid<T>,
        key: string,
        memberOrFunction: U | ((T) => U) | Validated<U> | ((value: T) => Validated<U>)): Validated<T & { [key in string]: U }> {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction

        if (member instanceof Valid || member instanceof Invalid) {
            return member.map(memberValue => {
                return {
                    ...Object(this.value),
                    [key]: memberValue
                }
            })
        }
        else {
            return this.map(obj => {
                return {
                    ...Object(obj),
                    [key]: member
                }
            })
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

export function valid<T>(value: T) {
    return new Valid(value)
}