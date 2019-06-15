import {fulfill, Future, neitherIsUndefinedOrNull, Option, Predicate, Result, some, success, valid, Validated} from '..'
import {strictEquality} from '../equivalence/Equality'

export class Box<A> {
    constructor(private readonly value: A) {}

    //region Access
    get(): A {
        return this.value
    }
    // endregion

    //region Application
    apply<B, C>(this: Box<(parameter: B) => C>, argumentOrBoxOrFunction: B | Box<B> | (() => B) | (() => Box<B>)) : Box<C> {
        const argumentOrBox = argumentOrBoxOrFunction instanceof Function ? argumentOrBoxOrFunction() : argumentOrBoxOrFunction

        return this.map(f => f(argumentOrBox instanceof Box ? argumentOrBox.get() : argumentOrBox))
    }
    //endregion

    //region Chaining
    chain<B>(f: (value: A) => Box<B>): Box<B> {
        return f(this.value)
    }
    //endregion

    //region Comprehension
    assign<A extends object, K extends string, B>(
        this: Box<A>,
        key: K,
        memberOrBoxOrFunction: Box<B> | ((scope: A) => Box<B>) | B | ((scope: A) => B)): Box<A & { [key in K]: B }> {
        const memberOrBox = memberOrBoxOrFunction instanceof Function ? memberOrBoxOrFunction(this.value) : memberOrBoxOrFunction
        const member = memberOrBox instanceof Box ? memberOrBox.get() : memberOrBox

        return this.map<A & { [key in K]: B }>(obj => ({
            ...Object(obj),
            [key]: member
        }))
    }
    //endregion

    //region Conversion
    toFuture<E>(): Future<A, E> {
        return fulfill(this.value)
    }

    toOption(): Option<A> {
        return some(this.value)
    }

    toResult<E>(): Result<A, E> {
        return success(this.value)
    }

    toValidated<E>(): Validated<A, E> {
        return valid(this.value)
    }
    //endregion

    //region Mapping
    map<B>(f: (value: A) => B): Box<B> {
        return new Box(f(this.value))
    }
    //endregion

    //region Side-effects
    perform(sideEffect: (value: A) => void): Box<A> {
        sideEffect(this.value)
        return new Box(this.value)
    }
    //endregion

    //region Testing
    equals(otherBox: Box<A>): boolean {
        return BoxEquality.test(this, otherBox)
    }

    test(predicate: (value: A) => boolean): boolean
    test(predicate: Predicate<A>): boolean
    test(predicate: ((value: A) => boolean)|Predicate<A>): boolean {
        if (predicate instanceof Function) {
            return predicate(this.value)
        }
        else {
            return predicate.test(this.value)
        }
    }
    //endregion
}

export function box<A>(value: A): Box<A> {
    return new Box(value)
}

export function boxObject() : Box<{}> {
    return box({})
}

export const BoxEquality = neitherIsUndefinedOrNull.and(strictEquality.adapt<Box<any>>(box => box.get()))