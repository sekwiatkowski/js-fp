import {Validated} from './Validated'

class Validator<T, E> {
    constructor(private readonly rules: ((value: T) => Validated<T, E>)[]) {}

    validate(value: T) : Validated<T, E> {
        return this.rules
            .map(rule => rule(value))
            .reduce((acc, current) => acc.concat(current))
    }
}

export function validator<T, E>(...rules: ((value: T) => Validated<T, E>)[]): Validator<T, E> {
    return new Validator(rules)
}