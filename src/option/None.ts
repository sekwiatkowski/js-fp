import {Option} from './Option'
import {some} from './Some'
import {failure, Future, invalid, reject, Result, Validated} from '..'

export class None<A> implements Option<A> {
    static value: Option<never> = new None()

    private constructor() {}

    apply<B, C>(this: Option<(parameter: B) => C>, parameterOrFunction: B | (() => B) | Option<B> | (() => Option<B>)) : Option<C> {
        return none
    }

    assign<A extends object, K extends string, B>(
        this: None<A>,
        key: K,
        memberOrFunction: Option<B> | ((obj: A) => Option<B>) | B | ((obj: A) => B)): Option<A & { [key in K]: B }> {
        return none
    }

    chain<B>(f: (a: A) => Option<B>): Option<B> {
        return none
    }

    equals(other: Option<A>) {
        return other.fold(
            otherValue => false,
            () => true
        )
    }

    test(predicate: (value: A) => boolean): boolean {
        return false
    }

    filter(predicate: (value: A) => boolean): Option<A> {
        return none
    }

    getOrElse(alternative: A|(() => A)): A {
        return alternative instanceof Function ? alternative() : alternative
    }

    isSome(): boolean {
        return false
    }

    isNone(): boolean {
        return true
    }

    map<B>(f: (value: A) => B): Option<B> {
        return none
    }

    fold<B>(onSome: (value: A) => B, onNone: () => B): B {
        return onNone()
    }

    orElse(alternative: A|(() => A)): Option<A> {
        return some(alternative instanceof Function ? alternative() : alternative)
    }

    orAttempt(alternative: () => Option<A>): Option<A> {
        return alternative()
    }

    perform(sideEffect: () => void): Option<A> {
        sideEffect()
        return none
    }

    performOnSome(sideEffect: (value: A) => void): Option<A> {
        return none
    }

    performOnNone(sideEffect: () => void): Option<A> {
        sideEffect()
        return none
    }

    toFuture<E>(error: E): Future<A, E> {
        return reject(error)
    }

    toResult<E>(error: E): Result<A, E> {
        return failure(error)
    }

    toValidated<E>(error: E): Validated<A, E> {
        return invalid<A, E>([error])
    }
}

export const none: Option<never> = None.value