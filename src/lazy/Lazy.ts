import {neitherIsUndefinedOrNull, strictEquality} from '../equivalence/Equality'
import {Equivalence, Predicate} from '..'

export class Lazy<A> {
    constructor(private readonly lazyValue: () => A) {}

    //region Access
    get(): () => A {
        return this.lazyValue
    }
    //endregion

    //region Application
    apply<B, C>(this: Lazy<(parameter: B) => C>, argumentOrFunction: B | Lazy<B> | (() => B) | (() => Lazy<B>)) : Lazy<C> {
        return new Lazy<C>(() => {
            const argumentOrLazy = argumentOrFunction instanceof Function ? argumentOrFunction() : argumentOrFunction
            const argument = argumentOrLazy instanceof Lazy ? argumentOrLazy.run() : argumentOrLazy

            return this.lazyValue()(argument)
        })
    }
    //endregion

    //region Chaining
    chain<B>(f: (value: A) => Lazy<B>): Lazy<B> {
        return new Lazy<B>(() => f(this.run()).run() )
    }
    //endregion

    //region Comprehension
    assign<A extends object, K extends string, B>(
        this: Lazy<A>,
        key: K,
        memberOrLazyOrFunction: Lazy<B> | ((scope: A) => Lazy<B>) | B | ((scope: A) => B)): Lazy<A & { [key in K]: B }> {

        return this.map<A & { [key in K]: B }>(scope => {
            const memberOrLazy = memberOrLazyOrFunction instanceof Function ? memberOrLazyOrFunction(scope) : memberOrLazyOrFunction
            const member = memberOrLazy instanceof Lazy ? memberOrLazy.run() : memberOrLazy

            return {
                ...Object(scope),
                [key]: member
            }
        })
    }
    //endregion

    //region Execution
    run(): A {
        return this.lazyValue()
    }
    //endregion

    //region Mapping
    map<U>(f: (input: A) => U): Lazy<U> {
        return new Lazy(() => f(this.lazyValue()))
    }
    //endregion Mapping

    //region Side-effects
    perform(sideEffect: (value: A) => void): Lazy<A> {
        return new Lazy<A>(() => {
            const value = this.lazyValue()

            sideEffect(value)

            return value
        })

    }
    //endregion

    //region Testing
    equals(otherLazy: Lazy<A>, equality?: Equivalence<Lazy<A>>): boolean {
        return (equality || LazyEquality).test(this, otherLazy)
    }

    test(predicate: (value: A) => boolean): boolean
    test(predicate: Predicate<A>): boolean
    test(predicate: ((value: A) => boolean)|Predicate<A>): boolean {
        if (predicate instanceof Function) {
            return predicate(this.run())
        }
        else {
            return predicate.test(this.run())
        }
    }
    //endregion
}

export function lazy<T>(f: () => T) {
    return new Lazy(f)
}

export function lazyObject() : Lazy<{}> {
    return new Lazy(() => ({}))
}

const LazyEquality = neitherIsUndefinedOrNull.and(strictEquality.adapt<Lazy<any>>(lazy => lazy.get()))