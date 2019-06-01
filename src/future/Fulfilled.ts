import {Settled, SettledFoldPattern} from './Settled'

class Fulfilled<T, E> implements Settled<T, E> {
    constructor(private readonly value: T) {}

    getErrorOrElse(alternative: E | ((value: T) => E)): E {
        return alternative instanceof Function ? alternative(this.value) : alternative
    }

    getOrElse(alternative: T | ((error: E) => T)): T {
        return this.value
    }

    map<U>(f: (value: T) => U): Settled<U, E> {
        return new Fulfilled(f(this.value))
    }

    mapError<F>(f: (error: E) => F): Settled<T, F> {
        return new Fulfilled(this.value)
    }

    fold<X>(pattern: SettledFoldPattern<T, E, X>): X {
        return pattern.Resolved(this.value)
    }

    orAttempt(alternative: (error: E) => Promise<T>): Settled<T, E> {
        return this
    }

    perform(sideEffect: (value: T) => void): Settled<T, E> {
        sideEffect(this.value)

        return this
    }

    performOnError(sideEffect: (error: E) => void): Settled<T, E> {
        return this
    }

    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void) {
        whenFulfilled(this.value)
    }
}

export function fulfilled<T, E>(value: T): Fulfilled<T, E> {
    return new Fulfilled<T, E>(value)
}