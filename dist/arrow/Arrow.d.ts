import { Box } from '..';
export declare class Arrow<A, B> {
    private f;
    constructor(f: (input: A) => B);
    andThen<C>(arrowOrFunction: Arrow<B, C> | ((input: B) => C)): Arrow<A, C>;
    adapt<C>(adaptor: (input: C) => A): Arrow<C, B>;
    apply(input: A): Box<B>;
    get(): (input: A) => B;
}
export declare const arrow: <A, B>(f: (input: A) => B) => Arrow<A, B>;
