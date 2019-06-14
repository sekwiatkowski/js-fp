export declare class Arrow<A, B> {
    private f;
    constructor(f: (input: A) => B);
    compose<C>(other: Arrow<B, C>): Arrow<A, C>;
    map<C>(g: (input: B) => C): Arrow<A, C>;
    mapInput<C>(map: (input: C) => A): Arrow<C, B>;
    apply(input: A): B;
    get(): (input: A) => B;
}
export declare const arrow: <A, B>(f: (input: A) => B) => Arrow<A, B>;
