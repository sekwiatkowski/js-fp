import {
    createArrayEquality,
    equivalence,
    Equivalence,
    Future,
    guardedStrictEquality,
    neitherIsUndefinedOrNull,
    Option,
    Predicate,
    Result
} from '..'

export interface Validated<T, E> {
    //region Access
    getErrorsOrElse(alternative: E[]|((value: T) => E[])): E[]
    getOrElse(alternative: T|((errors: E[]) => T)): T
    //endregion

    //region Application
    apply<U, V>(
        this: Validated<(parameter: U) => V, E>,
        argumentOrFunctionOrValidated: U | Validated<U, E> | (() => U) | (() => Validated<U, E>)) : Validated<V, E>
    //endregion

    //region Concatenation
    concat(otherValidated: Validated<T, E>): Validated<T, E>
    //endregion

    //region Conversion
    toFuture(): Future<T, E[]>
    toResult(): Result<T, E[]>
    toOption(): Option<T>
    //endregion

    //region Mapping
    map<U>(f: (value: T) => U) : Validated<U, E>
    mapErrors(f: (errors: E[]) => E[]) : Validated<T, E>
    //endregion

    //region Matching
    match<U>(onValid: (value: T) => U, onInvalid: (list: E[]) => U): U
    //endregion

    //region Side-effects
    perform(sideEffect: () => void): Validated<T, E>
    performOnValid(sideEffect: (value: T) => void): Validated<T, E>
    performOnInvalid(sideEffect: (errors: E[]) => void): Validated<T, E>
    //endregion

    //region Status
    isValid(): boolean
    isInvalid(): boolean
    //endregion

    //region Testing
    equals(otherValidated: Validated<T, E>, equality: Equivalence<Validated<T, E>>): boolean

    test(predicate: (value: T) => boolean): boolean
    test(predicate: Predicate<T>): boolean
    test(predicate: ((value: T) => boolean)|Predicate<T>): boolean
    //endregion
}

export function createValidatedEquality<T, E>(
    valueEquality: Equivalence<T> = guardedStrictEquality,
    errorsEquality: Equivalence<E[]> = createArrayEquality(guardedStrictEquality)): Equivalence<Validated<T, E>> {
    return (neitherIsUndefinedOrNull as Equivalence<Validated<T, E>>).and(equivalence((validatedX: Validated<T, E>, resultY: Validated<T, E>) => (
        validatedX.match(
            valueX => resultY.match(
                valueY => valueEquality.test(valueX, valueY),
                _ => false),
            errorsX => resultY.match(
                _ => false,
                errorY => errorsEquality.test(errorsX, errorY)))
    )))
}