declare class Box<A> {
    private readonly value;
    constructor(value: A);
    apply<B, C>(this: Box<(parameter: B) => C>, parameterOrFunction: B | Box<B> | (() => B) | (() => Box<B>)): Box<C>;
    assign<A extends object, B>(this: Box<A>, key: string, memberOrFunction: B | ((value: A) => B) | Box<B> | ((value: A) => Box<B>)): Box<A & {
        [k in string]: B;
    }>;
    chain<B>(f: (value: A) => Box<B>): Box<B>;
    get(): A;
    map<B>(f: (value: A) => B): Box<B>;
    perform(sideEffect: (A: any) => void): Box<A>;
    test(predicate: (A: any) => boolean): boolean;
}
export declare function box<A>(value: A): Box<A>;
export {};
