import {None, none} from './None'
import {Option, OptionMatchPattern} from './Option'

export class Some<A> implements Option<A> {
    constructor(private readonly value: A) {}

    apply<B, C>(this: Option<(parameter: B) => C>, parameterOrFunction: B |(() => B) | Option<B> | (() => Option<B>)) : Option<C> {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction

        if (parameter instanceof Some || parameter instanceof None) {
            return parameter.chain(parameterValue => this.map(f => f(parameterValue)))
        }
        else {
            return this.map(f => f(<B>parameter))
        }
    }

    assign<A extends object, B>(
        this: Some<A>,
        key: string,
        memberOrFunction: B | ((obj: A) => B) | Option<B> | ((obj: A) => Option<B>)): Option<A & { [key in string]: B }> {
        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction

        if(member instanceof Some || member instanceof None) {
            return member
                .map(otherValue => {
                    return {
                        ...Object(this.value),
                        [key]: otherValue
                    }
                })
        }
        else {
            return this.map(obj => {
                return {
                    ...Object(obj),
                    [key]: member
                }
            })
        }
    }

    chain<B>(f: (value: A) => Option<B>): Option<B> {
        return f(this.value)
    }

    test(predicate: (value: A) => boolean): boolean {
        return predicate(this.value)
    }

    filter(predicate: (value: A) => boolean): Option<A> {
        return this.test(predicate) ? this : none
    }

    getOrElse(alternative: A|(() => A)): A {
        return this.value
    }

    isSome(): boolean {
        return true
    }

    isNone(): boolean {
        return false
    }

    map<B>(f: (value: A) => B): Option<B> {
        return new Some(f(this.value))
    }

    match<B>(pattern : OptionMatchPattern<A, B>) : B {
        return pattern.Some(this.value)
    }

    orElse(alternative: A|(() => A)): Option<A> {
        return this
    }

    orAttempt(alternative: () => Option<A>): Option<A> {
        return this
    }

    perform(sideEffect: (value: A) => void): Option<A> {
        sideEffect(this.value)
        return new Some(this.value)
    }

    performWhenNone(sideEffect: () => void): Option<A> {
        return new Some(this.value)
    }
}


export function some<A>(value: A): Some<A> {
    return new Some(value)
}