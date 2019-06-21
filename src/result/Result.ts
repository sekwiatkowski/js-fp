import {
    equivalence,
    Equivalence,
    Future,
    guardedStrictEquality,
    neitherIsUndefinedOrNull,
    Option,
    Predicate,
    Validated
} from '..'

export interface Result<T, E> {
    //region Access
    getErrorOrElse(alternative: E|((value: T) => E)): E
    getOrElse(alternative: T|((error: E) => T)): T
    //endregion

    //region Application
    apply<U, V>(
        this: Result<(parameter: U) => V, E>,
        argumentOrResultOrFunction: U | (() => U) | Result<U, E> | (() => Result<U, E>)) : Result<V, E>
    //endregion

    //region Chaining
    chain<U>(f: (value: T) => Result<U, E>): Result<U, E>
    //endregion

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Result<T, E>,
        key: Exclude<K, keyof T>,
        memberOrResultOrFunction: Result<U, E> | ((value: T) => Result<U, E>) | U | ((value: T) => U)): Result<T & { [key in K]: U }, E>
    //endregion

    //region Conversion
    toFuture(): Future<T, E>
    toOption(): Option<T>
    toValidated(): Validated<T, E>
    //endregion

    //region Fallback
    orAttempt(alternative: (error: E) => Result<T, E>): Result<T, E>
    orElse(alternative: T|((error: E) => T)): Result<T, E>
    //endregion

    //region Mapping
    map<U>(f: (value: T) => U): Result<U, E>
    mapError<F>(f: (error: E) => F): Result<T, F>
    //endregion

    //region Matching
    match<X>(onSuccess: (value: T) => X, onFailure: (error: E) => X) : X
    //endregion

    //region Side-effects
    perform(sideEffect: () => void): Result<T, E>
    performOnSuccess(sideEffect: (value: T) => void): Result<T, E>
    performOnFailure(sideEffect: (error: E) => void): Result<T, E>
    //endregion

    //region Status
    isFailure(): boolean
    isSuccess(): boolean
    //endregion

    //region Testing
    equals(otherResult: Result<T, E>, equality: Equivalence<Result<T, E>>): boolean

    test(predicate: (value: T) => boolean): boolean
    test(predicate: Predicate<T>): boolean
    test(predicate: ((value: T) => boolean)|Predicate<T>): boolean
    //endregion
}

export function createResultEquality<T, E>(
    valueEquality: Equivalence<T> = guardedStrictEquality,
    errorEquality: Equivalence<E> = guardedStrictEquality): Equivalence<Result<T, E>> {
    return (neitherIsUndefinedOrNull as Equivalence<Result<T, E>>).and(equivalence((resultX: Result<T, E>, resultY: Result<T, E>) => (
        resultX.match(
            valueX => resultY.match(
                valueY => valueEquality.test(valueX, valueY),
                _ => false),
            errorX => resultY.match(
                _ => false,
                errorY => errorEquality.test(errorX, errorY)))
    )))
}