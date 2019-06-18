import {Arrow} from '..'

export class Action<A> {
    constructor(private f: () => A) {}

    andThen<B>(arrowOrFunction: Arrow<A, B>|((input: A) => B)): Action<B> {
        return new Action(() => (arrowOrFunction instanceof Function ? arrowOrFunction : arrowOrFunction.get())(this.f()))
    }

    act() : A {
        return this.f()
    }
}

export const action = <A>(f: () => A) => new Action(f)