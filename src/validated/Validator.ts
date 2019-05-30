import {Validated} from './Validated'

class Validator<T> {
    constructor(private readonly rules: ((T) => Validated<T>)[]) {}

    validate(value: T) : Validated<T> {
        return this.rules
            .map(rule => rule(value))
            .reduce((acc, current) => acc.concat(current))
    }
}

export function validator<T>(...rules: ((T) => Validated<T>)[]): Validator<T> {
    return new Validator(rules)
}