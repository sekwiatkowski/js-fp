import {some} from './Some'
import {none} from './None'
import {Future, Result, Validated} from '..'

export interface OptionFoldPattern<A, B> {
    Some: (value: A) => B
    None: () => B
}

export interface Option<A> {
    apply<B, C>(this: Option<(parameter: B) => C>, parameterOrFunction: B | (() => B) | Option<B> | (() => Option<B>)) : Option<C>

    assign<A extends object, K extends string, B>(
        this: Option<A>,
        key: K,
        memberOrFunction: Option<B> | ((obj: A) => Option<B>) | B | ((obj: A) => B)): Option<A & { [key in K]: B }>

    chain<B>(f: (value: A) => Option<B>): Option<B>

    filter(predicate: (value: A) => boolean): Option<A>

    getOrElse(alternative: A | (() => A)): A

    isSome(): boolean
    isNone(): boolean

    map<B>(f: (value: A) => B): Option<B>

    fold<B>(pattern: OptionFoldPattern<A, B>): B

    orElse(alternative: A | (() => A)): Option<A>
    orAttempt(alternative: () => Option<A>): Option<A>

    perform(sideEffect: (value: A) => void): Option<A>
    performWhenNone(sideEffect: () => void): Option<A>

    test(predicate: (value: A) => boolean): boolean

    toFuture<E>(error: E): Future<A, E>
    toResult<E>(error: E): Result<A, E>
    toValidated<E>(error: E): Validated<A, E>
}

export function option<T>(valueOrFunction: T | (() => T)): Option<T> {
    const nullable = valueOrFunction instanceof Function ? valueOrFunction() : valueOrFunction

    return nullable != null ? some(nullable) : none
}