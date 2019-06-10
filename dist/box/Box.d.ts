import { Future, Option, Result, Validated } from '..';
export declare class Box<A> {
    private readonly value;
    constructor(value: A);
    apply<B, C>(this: Box<(parameter: B) => C>, parameterOrFunction: B | Box<B> | (() => B) | (() => Box<B>)): Box<C>;
    assign<A extends object, K extends string, B>(this: Box<A>, key: K, memberOrFunction: Box<B> | ((value: A) => Box<B>) | B | ((value: A) => B)): Box<A & {
        [key in K]: B;
    }>;
    chain<B>(f: (value: A) => Box<B>): Box<B>;
    equals(otherBox: Box<A>): boolean;
    fold<B>(f: (value: A) => B): B;
    get(): A;
    map<B>(f: (value: A) => B): Box<B>;
    perform(sideEffect: (value: A) => void): Box<A>;
    test(predicate: (value: A) => boolean): boolean;
    toFuture<E>(): Future<A, E>;
    toOption(): Option<A>;
    toResult<E>(): Result<A, E>;
    toValidated<E>(): Validated<A, E>;
}
export declare function box<A>(value: A): Box<A>;
export declare function boxObject(): Box<{}>;
