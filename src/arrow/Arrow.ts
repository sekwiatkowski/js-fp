import {box, Box} from '..'

export class Arrow<A, B> {
    constructor(private f: (input: A) => B) {}

    andThen<C>(arrowOrFunction: Arrow<B, C>|((input: B) => C)): Arrow<A, C> {
        return new Arrow((input: A) => {
            const g = arrowOrFunction instanceof Function ? arrowOrFunction : arrowOrFunction.get()

            return g(this.f(input))
        })
    }

    adapt<C>(adaptor: (input: C) => A): Arrow<C, B> {
        return new Arrow((input: C) => this.f(adaptor(input)))
    }

    apply(input: A): Box<B> {
        return box(this.f(input))
    }

    get(): (input: A) => B {
        return this.f
    }
}

export const arrow = <A, B>(f: (input: A) => B) => new Arrow(f)