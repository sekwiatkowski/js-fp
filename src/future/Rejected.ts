import {Settled, SettledMatchPattern} from './Settled'

class Rejected<T, E> implements Settled<T, E> {
    constructor(private readonly error: E) {}

    getErrorOrElse(alternative: E | ((value: T) => E)): E {
        return this.error
    }

    getOrElse(alternative: T | ((error: E) => T)): T {
        return alternative instanceof Function ? alternative(this.error) : alternative
    }

    match<X>(pattern: SettledMatchPattern<T, E, X>) {
        return pattern.Rejected(this.error)
    }

    map<U>(f: (value: T) => U): Settled<U, E> {
        return new Rejected<U, E>(this.error)
    }

    mapError<F>(f: (error: E) => F): Settled<T, F> {
        return new Rejected(f(this.error))
    }

    perform(sideEffect: (value: T) => void) {}

    performOnError(sideEffect: (error: E) => void) {
        sideEffect(this.error)
    }

    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void) {
        whenRejected(this.error)
    }
}

export function rejected<T, E>(error: E): Rejected<T, E> {
    return new Rejected<T, E>(error)
}