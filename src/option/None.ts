import {Option, OptionMatchPattern} from './Option'
import {some} from './Some'

export class None<A> implements Option<A> {
    static value: Option<never> = new None()

    private constructor() {}

    apply<B, C>(this: Option<(parameter: B) => C>, parameterOrFunction: B | (() => B) | Option<B> | (() => Option<B>)) : Option<C> {
        return none
    }

    assign<A extends object, B>(
        this: None<A>,
        key: string,
        member: B |((value: A) => B) | Option<B> | ((value: A) => Option<B>)): Option<A & { [k in string]: B }> {
        return none
    }

    chain<B>(f: (a: A) => Option<B>): Option<B> {
        return none
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

    match<B>(pattern: OptionMatchPattern<A, B>): B {
        return pattern.None()
    }

    orElse(alternative: A|(() => A)): Option<A> {
        return some(alternative instanceof Function ? alternative() : alternative)
    }

    orAttempt(alternative: () => Option<A>): Option<A> {
        return alternative()
    }

    perform(sideEffect: (value: A) => void): Option<A> {
        return none
    }

    performWhenNone(sideEffect: () => void): Option<A> {
        sideEffect()
        return none
    }
}

export const none: Option<never> = None.value