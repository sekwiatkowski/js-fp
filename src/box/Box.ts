import {fulfill, Future, Option, Result, some, success, valid, Validated} from '..'

export class Box<A> {
    constructor(private readonly value: A) {}

    apply<B, C>(this: Box<(parameter: B) => C>, parameterOrFunction: B | Box<B> | (() => B) | (() => Box<B>)) : Box<C> {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction

        return this.map(f => f(parameter instanceof Box ? parameter.get() : parameter))
    }

    assign<A extends object, K extends string, B>(
        this: Box<A>,
        key: K,
        memberOrFunction: Box<B> | ((value: A) => Box<B>) | B | ((value: A) => B)): Box<A & { [key in K]: B }> {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction
        const memberValue = member instanceof Box ? member.get() : member

        return this.map<A & { [key in K]: B }>(obj => ({
            ...Object(obj),
            [key]: memberValue
        }))
    }

    chain<B>(f: (value: A) => Box<B>): Box<B> {
        return f(this.value)
    }

    equals(otherBox: Box<A>): boolean {
        if (otherBox == null) {
            return false
        }
        else {
            return otherBox.fold(otherValue => this.value === otherValue)
        }
    }

    fold<B>(f: (value: A) => B): B {
        return f(this.value)
    }

    get(): A {
        return this.value
    }

    map<B>(f: (value: A) => B): Box<B> {
        return new Box(f(this.value))
    }

    perform(sideEffect: (value: A) => void): Box<A> {
        sideEffect(this.value)
        return new Box(this.value)
    }

    test(predicate: (value: A) => boolean): boolean {
        return predicate(this.value)
    }

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
}

export function box<A>(value: A): Box<A> {
    return new Box(value)
}

export function boxObject() : Box<{}> {
    return box({})
}