export class Box<A> {
    constructor(private readonly value: A) {}

    apply<B, C>(this: Box<(parameter: B) => C>, parameterOrFunction: B | Box<B> | (() => B) | (() => Box<B>)) : Box<C> {
        const parameter = parameterOrFunction instanceof Function ? parameterOrFunction() : parameterOrFunction

        return this.map(f => f(parameter instanceof Box ? parameter.get() : parameter))
    }

    assign<A extends object, B>(
        this: Box<A>,
        key: string,
        memberOrFunction: B | ((value: A) => B) | Box<B> | ((value: A) => Box<B>)): Box<A & { [k in string]: B }> {

        const member = memberOrFunction instanceof Function ? memberOrFunction(this.value) : memberOrFunction

        if (member instanceof Box) {
            return member.map(memberValue => {
                return {
                    ...Object(this.value),
                    [key]: memberValue
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

    chain<B>(f: (value: A) => Box<B>): Box<B> {
        return f(this.value)
    }

    get(): A {
        return this.value
    }

    map<B>(f: (value: A) => B): Box<B> {
        return new Box(f(this.value))
    }

    perform(sideEffect: (A) => void): Box<A> {
        sideEffect(this.value)
        return new Box(this.value)
    }

    test(predicate: (A) => boolean): boolean {
        return predicate(this.value)
    }
}

export function box<A>(value: A): Box<A> {
    return new Box(value)
}