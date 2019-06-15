export class Arrow<A, B> {
    constructor(private f: (input: A) => B) {}

    compose<C>(arrowOrFunction: Arrow<B, C>|((input: B) => C)): Arrow<A, C> {
        if(arrowOrFunction instanceof Function) {
            return new Arrow((input: A) => arrowOrFunction(this.f(input)))
        }
        else {
            return new Arrow((input: A) => arrowOrFunction.apply((this.f(input))))
        }
    }

    adapt<C>(adaptor: (input: C) => A): Arrow<C, B> {
        return new Arrow((input: C) => this.f(adaptor(input)))
    }

    apply(input: A) {
        return this.f(input)
    }

    get(): (input: A) => B {
        return this.f
    }
}

export const arrow = <A, B>(f: (input: A) => B) => new Arrow(f)