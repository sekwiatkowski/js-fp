import {
    Equivalence,
    fulfill,
    Future,
    guardedStrictEquality,
    neitherIsUndefinedOrNull,
    Option,
    Predicate,
    Result,
    Semigroup,
    some,
    success,
    valid,
    Validated
} from '..'

export class Box<A> {
    constructor(private readonly value: A) {}

    //region Access
    get(): A
    get<T>(f: (value : A) => T): T
    get<T>(f?: (value : A) => T): A|T {
        if (f) {
            return f(this.value)
        }
        else {
            return this.value
        }
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
        key: Exclude<K, keyof A>,
        memberBoxOrValueOrFunction: Box<B> | ((scope: A) => Box<B>) | B | ((scope: A) => B)): Box<A & { [key in K]: B }> {
        return this.chain(scope => {
            const memberBoxOrValue = memberBoxOrValueOrFunction instanceof Function
                ? memberBoxOrValueOrFunction(this.value)
                : memberBoxOrValueOrFunction

            const memberBox = memberBoxOrValue instanceof Box
                ? memberBoxOrValue
                : new Box(memberBoxOrValue)

            return memberBox.map(memberValue => ({
                ...Object(scope),
                [key]: memberValue
            }))
        })
    }
    //endregion

    //region Combination
    combine(otherValueOrBox: A|Box<A>, semigroup: Semigroup<A>): Box<A> {
        const otherValue = otherValueOrBox instanceof Box ? otherValueOrBox.get() : otherValueOrBox

        return this.map(value => semigroup.combine(value)(otherValue))
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
    equals(otherBox: Box<A>, equality: Equivalence<Box<A>>): boolean {
        return equality.test(this, otherBox)
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

export function createBoxEquality<T>(valueEquality: Equivalence<T> = guardedStrictEquality) {
    return (neitherIsUndefinedOrNull as Equivalence<Box<T>>).and(valueEquality.adapt(box => box.get()))
}