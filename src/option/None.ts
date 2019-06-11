import {Option} from './Option'
import {some} from './Some'
import {failure, Future, invalid, reject, Result, Validated} from '..'

export class None<A> implements Option<A> {
    static value: Option<never> = new None()

    private constructor() {}

    //region Access
    getOrElse(alternative: A|(() => A)): A {
        return alternative instanceof Function ? alternative() : alternative
    }
    //endregion

    //region Application
    apply<B, C>(this: Option<(parameter: B) => C>, argumentOrOptionOrFunction: B | (() => B) | Option<B> | (() => Option<B>)) : Option<C> {
        return none
    }
    //endregion

    //region Chaining
    chain<B>(f: (a: A) => Option<B>): Option<B> {
        return none
    }
    //endregion

    //region Comprehension
    assign<A extends object, K extends string, B>(
        this: None<A>,
        key: K,
        memberOrOptionOrFunction: Option<B> | ((value: A) => Option<B>) | B | ((value: A) => B)): Option<A & { [key in K]: B }> {
        return none
    }
    //endregion

    //region Conversion
    toFuture<E>(error: E): Future<A, E> {
        return reject(error)
    }

    toResult<E>(error: E): Result<A, E> {
        return failure(error)
    }

    toValidated<E>(error: E): Validated<A, E> {
        return invalid<A, E>([error])
    }
    //endregion

    //region Fallback
    orElse(alternative: A|(() => A)): Option<A> {
        return some(alternative instanceof Function ? alternative() : alternative)
    }

    orAttempt(alternative: () => Option<A>): Option<A> {
        return alternative()
    }
    //endregion

    //region Filtering
    filter(predicate: (value: A) => boolean): Option<A> {
        return none
    }
    //endregion

    //region Mapping
    map<B>(f: (value: A) => B): Option<B> {
        return none
    }
    //endregion

    //region Testing
    equals(other: Option<A>) {
        return other.match(
            otherValue => false,
            () => true
        )
    }

    test(predicate: (value: A) => boolean): boolean {
        return false
    }
    //endregion

    //region Matching
    match<B>(onSome: (value: A) => B, onNone: () => B): B {
        return onNone()
    }
    //endregion

    //region Side-effects
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
    //endregion

    //region Status
    isNone(): boolean {
        return true
    }

    isSome(): boolean {
        return false
    }
    //endregion
}

export const none: Option<never> = None.value