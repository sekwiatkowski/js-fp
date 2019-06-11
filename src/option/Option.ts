import {some} from './Some'
import {none} from './None'
import {Future, Result, Validated} from '..'

export interface Option<A> {
    //region Access
    getOrElse(alternative: A | (() => A)): A
    //endregion

    //region Application
    apply<B, C>(this: Option<(parameter: B) => C>, argumentOrOptionOrFunction: B | (() => B) | Option<B> | (() => Option<B>)) : Option<C>
    //endregion

    //region Chaining
    chain<B>(f: (value: A) => Option<B>): Option<B>
    //endregion

    //region Comprehension
    assign<A extends object, K extends string, B>(
        this: Option<A>,
        key: K,
        memberOrFunctionOrOption: Option<B> | ((value: A) => Option<B>) | B | ((value: A) => B)): Option<A & { [key in K]: B }>
    //endregion

    //region Conversion
    toFuture<E>(error: E): Future<A, E>
    toResult<E>(error: E): Result<A, E>
    toValidated<E>(error: E): Validated<A, E>
    //endregion

    //region Fallback
    orElse(alternative: A | (() => A)): Option<A>
    orAttempt(alternative: () => Option<A>): Option<A>
    //endregion

    //region Filtering
    filter(predicate: (value: A) => boolean): Option<A>
    //endregion

    //region Mapping
    map<B>(f: (value: A) => B): Option<B>
    //endregion

    //region Reduction
    fold<B>(onSome: (value: A) => B, onNone: () => B): B
    //endregion

    //region Side-effects
    perform(sideEffect: () => void): Option<A>
    performOnSome(sideEffect: (value: A) => void): Option<A>
    performOnNone(sideEffect: () => void): Option<A>
    //endregion

    //region Status
    isSome(): boolean
    isNone(): boolean
    //endregion

    //region Testing
    equals(other: Option<A>): boolean
    test(predicate: (value: A) => boolean): boolean
    //endregion
}

export function option<T>(valueOrFunction: undefined | null | T | (() => T)): Option<T> {
    const nullable = valueOrFunction instanceof Function ? valueOrFunction() : valueOrFunction

    return nullable == null ? none : some(nullable)
}