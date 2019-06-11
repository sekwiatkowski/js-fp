import { Future, Option, Result, Validated } from '..';
export declare class Box<A> {
    private readonly value;
    constructor(value: A);
    get(): A;
    apply<B, C>(this: Box<(parameter: B) => C>, argumentOrBoxOrFunction: B | Box<B> | (() => B) | (() => Box<B>)): Box<C>;
    chain<B>(f: (value: A) => Box<B>): Box<B>;
    assign<A extends object, K extends string, B>(this: Box<A>, key: K, memberOrBoxOrFunction: Box<B> | ((value: A) => Box<B>) | B | ((value: A) => B)): Box<A & {
        [key in K]: B;
    }>;
    toFuture<E>(): Future<A, E>;
    toOption(): Option<A>;
    toResult<E>(): Result<A, E>;
    toValidated<E>(): Validated<A, E>;
    map<B>(f: (value: A) => B): Box<B>;
    perform(sideEffect: (value: A) => void): Box<A>;
    equals(otherBox: Box<A>): boolean;
    test(predicate: (value: A) => boolean): boolean;
}
export declare function box<A>(value: A): Box<A>;
export declare function boxObject(): Box<{}>;
