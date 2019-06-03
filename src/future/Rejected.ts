import {Settled, SettledFoldPattern} from './Settled'

class Rejected<T, E> implements Settled<T, E> {
    constructor(private readonly error: E) {}

    getErrorOrElse(alternative: E | ((value: T) => E)): E {
        return this.error
    }

    getOrElse(alternative: T | ((error: E) => T)): T {
        return alternative instanceof Function ? alternative(this.error) : alternative
    }

    fold<X>(pattern: SettledFoldPattern<T, E, X>): X {
        return pattern.Rejected(this.error)
    }

    map<U>(f: (value: T) => U): Settled<U, E> {
        return new Rejected<U, E>(this.error)
    }

    mapError<F>(f: (error: E) => F): Settled<T, F> {
        return new Rejected(f(this.error))
    }

    perform(sideEffect: () => void): Settled<T, E> {
        sideEffect()
        return this
    }

    performOnFulfilled(sideEffect: (value: T) => void): Settled<T, E> {
        return this
    }

    performOnRejected(sideEffect: (error: E) => void): Settled<T, E> {
        sideEffect(this.error)
        return this
    }

    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void) {
        whenRejected(this.error)
    }
}

export function rejected<T, E>(error: E): Rejected<T, E> {
    return new Rejected<T, E>(error)
}