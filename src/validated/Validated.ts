import {
    createArrayEquality,
    equivalence,
    Equivalence,
    Future,
    neitherIsUndefinedOrNull,
    Option,
    Predicate,
    Result
} from '..'
import {strictEquality} from '../equivalence/Equality'

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

    //region Comprehension
    assign<T extends object, K extends string, U>(
        this: Validated<T, E>,
        key: K,
        memberOrFunction: Validated<U, E> | ((value: T) => Validated<U, E>) | U | ((value: T) => U)): Validated<T & { [key in K]: U }, E>
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
    equals(otherValidated: Validated<T, E>): boolean

    test(predicate: (value: T) => boolean): boolean
    test(predicate: Predicate<T>): boolean
    test(predicate: ((value: T) => boolean)|Predicate<T>): boolean
    //endregion
}

export const anyValidatedEquality = (neitherIsUndefinedOrNull as Equivalence<Validated<any, any>>).and(equivalence((validatedX: Validated<any, any>, validatedY: Validated<any, any>) => (
    validatedX.match(
        valueX => validatedY.match(
            successY => strictEquality.test(valueX, successY),
            _ => false),
        errorsX => validatedY.match(
            _ => false,
            errorsY => createArrayEquality<any>().test(errorsX, errorsY)))
)))