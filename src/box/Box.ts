import {fulfill, Future, Option, Result, some, success, valid, Validated} from '..'

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
        memberOrBoxOrFunction: Box<B> | ((value: A) => Box<B>) | B | ((value: A) => B)): Box<A & { [key in K]: B }> {
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
        if (otherBox == null) {
            return false
        }
        else {
            return this.value === otherBox.value
        }
    }

    test(predicate: (value: A) => boolean): boolean {
        return predicate(this.value)
    }
    //endregion
}

export function box<A>(value: A): Box<A> {
    return new Box(value)
}

export function boxObject() : Box<{}> {
    return box({})
}