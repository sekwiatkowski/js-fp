import {Equivalence, equivalence, guardedStrictEquality, neitherIsUndefinedOrNull} from '..'

export interface Settled<T, E> {
    match<X>(onFulfilled: (value: T) => X, onRejected: (error: E) => X): X

    getErrorOrElse(alternative: E | ((value: T) => E)): E
    getOrElse(alternative: T | ((error: E) => T)): T

    map<U>(f: (value: T) => U): Settled<U, E>
    mapError<F>(f: (error: E) => F): Settled<T, F>

    perform(sideEffect: () => void): Settled<T, E>
    performOnFulfilled(sideEffect: (value: T) => void): Settled<T, E>
    performOnRejected(sideEffect: (error: E) => void): Settled<T, E>

    run(whenFulfilled: (value: T) => void, whenRejected: (error: E) => void)
}

export function createSettledEquality<T, E>(
    valueEquality: Equivalence<T> = guardedStrictEquality,
    errorEquality: Equivalence<E> = guardedStrictEquality) {
    return (neitherIsUndefinedOrNull as Equivalence<Settled<T, E>>)
        .and(equivalence<Settled<T, E>>((thisSettled, otherSettled) => thisSettled.match(
            thisValue => otherSettled.match(
                otherValue => valueEquality.test(thisValue, otherValue),
                () => false
            ),
            thisError => otherSettled.match(
                () => false,
                otherError => errorEquality.test(thisError, otherError)
            )
        )))
}